/**
 * Whisper 语音转文字 worker（@xenova/transformers + onnxruntime-web WASM）。
 *
 * 架构决策：
 * 1. 推理放 worker——一次 30s 窗口的编码+解码是秒级重活，主线程跑必卡。
 * 2. onnxruntime 的 wasm 二进制由主线程经 useWasmModule 下载后喂进来
 *    （进度/取消/缓存体系），同时把 wasmPaths 指向自托管目录——
 *    ort 1.14 的线程 worker 由其内联胶水创建，无需外部代理文件。
 * 3. 模型走本地 /models/whisper-tiny/（fetch:whisper-assets 落位），
 *    并关闭 allowRemoteModels：缺文件时直接报错，不静默回源 huggingface.co。
 * 4. 音频解码不在 worker 做：worker 里没有 AudioContext。主线程
 *    decodeAudioData + 降混 + 16kHz 重采样后，把 Float32Array 转移进来。
 *
 * 消息协议（与 useWhisper.js 配套）：
 * - init:   { type:'toolhub:whisper-init', wasmBinary }
 *           → 'toolhub:whisper-progress'（模型下载进度）
 *           → 'toolhub:whisper-ready' | 'toolhub:whisper-error'
 * - job:    { type:'transcribe', id, audio, task, language, timestamps, stream }
 *           → 'toolhub:whisper-chunk'（流式中间结果，仅 stream=true；text 由
 *              本 worker 用 tokenizer 解码 chunk.tokens 得到）
 *           → 'toolhub:whisper-done' | 'toolhub:whisper-error'
 */

import { pipeline, env } from '@xenova/transformers'

// 与 scripts/fetch-whisper-assets.mjs 落位目录对应
const MODEL_ID = 'whisper-tiny'
const WASM_PATHS = '/wasm/ort/'

// 站点底线：无外部请求。本地模型缺文件必须显式失败。
env.allowRemoteModels = false

let transcriber = null

function post(msg, transfer) {
  self.postMessage(msg, transfer || [])
}

function fail(id, message) {
  let text = String(message && message.message ? message.message : message)
  // 浏览器端排障：worker 内的堆栈不会进主线程 console，随错误一起上报
  if (message && message.stack) text += '\n' + message.stack
  post({
    type: 'toolhub:whisper-error',
    id,
    message: text
  })
}

self.addEventListener('message', async (e) => {
  const msg = e.data
  if (!msg || typeof msg !== 'object') return

  if (msg.type === 'toolhub:whisper-init') {
    try {
      if (msg.wasmBinary) {
        const bytes = new Uint8Array(msg.wasmBinary)
        env.backends.onnx.wasm.wasmBinary = bytes
        // ort 1.14（transformers 2.17.2 的 pin 版本）的 emscripten 胶水内联在
        // ort 包 JS 里，线程 worker 由其内部 Blob 创建，无需外部 .mjs 代理。
        // wasmPaths 仍指向自托管目录，供非 threaded 变体等运行时探测回退用。
        env.backends.onnx.wasm.wasmPaths = WASM_PATHS
      }

      transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
        progress_callback: (data) => {
          // data: { status, name, file, progress, loaded, total }
          post({ type: 'toolhub:whisper-progress', data })
        }
      })
      post({ type: 'toolhub:whisper-ready' })
    } catch (err) {
      transcriber = null
      fail(null, err)
    }
    return
  }

  if (msg.type !== 'transcribe') return

  if (!transcriber) {
    fail(msg.id, 'WORKER_NOT_READY')
    return
  }

  try {
    // 主线程转移过来的是 ArrayBuffer；Float32Array 视图零拷贝重建
    const audio = new Float32Array(msg.audio)

    const options = {
      task: msg.task || 'transcribe',
      // 长音频必须分块：whisper 单窗 30s，chunk_length_s=0 时超长音频只会处理开头
      chunk_length_s: 30,
      return_timestamps: !!msg.timestamps
    }
    if (msg.language) options.language = msg.language
    if (msg.stream) {
      // transformers.js 的 chunk_callback 给出的 chunk 尚未解码——它只有
      // tokens（token id 数组）、stride、input_features，text 要等后续
      // _decode_asr() 合并时才生成。直接读 chunk.text 会恒为空串。
      // 这里就地用 pipeline 自带的 tokenizer 解码该 chunk 的 tokens，
      // 得到该 30s 窗口的文本，实现真正的流式中间结果。
      options.chunk_callback = (chunk) => {
        let text = ''
        try {
          const tokens = chunk.tokens
          if (Array.isArray(tokens) && tokens.length) {
            text = transcriber.tokenizer.decode(tokens, {
              skip_special_tokens: true
            })
          }
        } catch (err) {
          // 单个窗口解码失败不应中断整个推理，跳过该窗口即可
          text = ''
        }
        post({
          type: 'toolhub:whisper-chunk',
          id: msg.id,
          chunk: { text, timestamp: null }
        })
      }
    }

    const result = await transcriber(audio, options)
    post({
      type: 'toolhub:whisper-done',
      id: msg.id,
      result: {
        text: result.text || '',
        chunks: Array.isArray(result.chunks) ? result.chunks : null
      }
    })
  } catch (err) {
    fail(msg.id, err)
  }
})
