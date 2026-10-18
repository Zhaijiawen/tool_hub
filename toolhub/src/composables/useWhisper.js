/**
 * ToolHub Whisper 驱动（主线程侧）。
 *
 * 职责：
 * - 经 useWasmModule 下载 onnxruntime 的 simd-threaded wasm（10.5MB，进度/取消/缓存）；
 * - 启动 ESM worker，喂 wasm 字节完成握手，模型由 worker 从本地 /models/ 加载；
 * - 主线程负责音频解码（worker 里没有 AudioContext）：decodeAudioData +
 *   降混单声道 + 重采样 16kHz，然后把 Float32Array 转移给 worker。
 *
 * 进度分三段：下载 wasm → 下载模型（约 42MB，transformers 逐文件回报）→ 推理。
 */

import { ref, computed } from 'vue'
import { useWasmModule } from './useWasmModule'

// 与 scripts/fetch-whisper-assets.mjs 一致：int8 量化 whisper-tiny 共 7 个文件
const MODEL_TOTAL_BYTES = 43_600_000

export function useWhisper() {
  const wasm = useWasmModule('whisper', {
    url: '/wasm/ort/ort-wasm-simd-threaded.wasm',
    name: 'ONNX Runtime',
    compile: false
  })

  const workerReady = ref(false)
  const busy = ref(false)
  const errorMsg = ref('')
  const stage = ref(null) // 'wasm' | 'model' | 'run'
  const modelProgress = ref(0) // 模型下载 0-100
  const modelFile = ref('') // 当前下载的文件名
  const partialText = ref('') // 流式中间结果

  let worker = null
  let readyPromise = null
  let jobSeq = 0
  const pending = new Map()

  /** 统一对外的进度：0-100；wasm 段占 20%，模型段占 80% */
  const displayProgress = computed(() => {
    if (stage.value === 'wasm') return Math.round(wasm.progress.value * 20)
    if (stage.value === 'model') return 20 + Math.round((modelProgress.value / 100) * 80)
    return null
  })

  function handleMessage(e) {
    const msg = e.data
    if (!msg || typeof msg !== 'object') return

    if (msg.type === 'toolhub:whisper-progress') {
      const d = msg.data || {}
      if (d.status === 'progress' && d.total) {
        // 逐文件汇总：cumLoaded/cumTotal 由调用方维护在闭包外不可行，
        // 这里用「当前文件内进度 × 已见文件数权重」的近似——
        // 更简单的做法：直接用 loaded/total 的单文件百分比（大文件占绝大部分时长）
        modelProgress.value = Math.max(modelProgress.value, Math.round((d.loaded / d.total) * 100))
        modelFile.value = d.file || ''
      } else if (d.status === 'ready' || d.status === 'done') {
        modelFile.value = d.file || modelFile.value
      }
      return
    }

    if (msg.type === 'toolhub:whisper-ready') {
      workerReady.value = true
      return
    }

    if (msg.type === 'toolhub:whisper-error') {
      const job = pending.get(msg.id)
      if (job) {
        pending.delete(msg.id)
        job.reject(new Error(msg.message))
        return
      }
      if (!workerReady.value) {
        errorMsg.value = msg.message
        for (const [, j] of pending) j.reject(new Error(msg.message))
        pending.clear()
      }
      return
    }

    if (msg.type === 'toolhub:whisper-chunk') {
      const job = pending.get(msg.id)
      if (job && job.onChunk) job.onChunk(msg.chunk)
      return
    }

    if (msg.type === 'toolhub:whisper-done') {
      const job = pending.get(msg.id)
      pending.delete(msg.id)
      if (job) job.resolve(msg.result)
    }
  }

  function handleError(err) {
    errorMsg.value = String(err && err.message ? err.message : err)
    for (const [, job] of pending) {
      job.reject(err instanceof ErrorEvent ? new Error('WORKER_ERROR') : err)
    }
    pending.clear()
  }

  /** 下载 wasm 并启动 worker（幂等） */
  async function ensureReady() {
    if (workerReady.value) return
    if (readyPromise) return readyPromise

    readyPromise = (async () => {
      errorMsg.value = ''
      stage.value = 'wasm'
      const { buffer } = await wasm.load()

      stage.value = 'model'
      modelProgress.value = 0
      worker = new Worker(new URL('../workers/whisper-worker.js', import.meta.url), {
        type: 'module'
      })
      worker.addEventListener('message', handleMessage)
      worker.addEventListener('error', handleError)

      const copy = buffer.slice(0)
      worker.postMessage({ type: 'toolhub:whisper-init', wasmBinary: copy }, [copy])

      await new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (workerReady.value) {
            clearInterval(timer)
            resolve()
          } else if (errorMsg.value) {
            clearInterval(timer)
            reject(new Error(errorMsg.value))
          }
        }, 50)
        // 模型 42MB + wasm 实例化，弱网下可能需要数分钟
        setTimeout(() => {
          clearInterval(timer)
          if (!workerReady.value) reject(new Error('WHISPER_INIT_TIMEOUT'))
        }, 300000)
      })

      stage.value = null
    })().catch((err) => {
      readyPromise = null
      stage.value = null
      throw err
    })

    return readyPromise
  }

  /**
   * 主线程音频解码：File/Blob → 16kHz 单声道 Float32Array。
   * 用 AudioContext({sampleRate:16000}) 让浏览器做重采样，再手动降混。
   */
  async function decodeAudio(file) {
    const arrayBuffer = await file.arrayBuffer()
    const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 })
    try {
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      const channels = audioBuffer.numberOfChannels
      const length = audioBuffer.length
      if (channels === 1) {
        return audioBuffer.getChannelData(0).slice()
      }
      const out = new Float32Array(length)
      for (let c = 0; c < channels; c++) {
        const data = audioBuffer.getChannelData(c)
        for (let i = 0; i < length; i++) out[i] += data[i]
      }
      for (let i = 0; i < length; i++) out[i] /= channels
      return out
    } finally {
      ctx.close()
    }
  }

  /**
   * 执行一次语音识别。
   * @param {Float32Array} audio 16kHz 单声道
   * @param {Object} opts { task:'transcribe'|'translate', language, timestamps, stream, onChunk }
   */
  async function transcribe(audio, opts = {}) {
    await ensureReady()
    busy.value = true
    stage.value = 'run'
    partialText.value = ''
    try {
      const transfer = [audio.buffer]
      return await new Promise((resolve, reject) => {
        const id = ++jobSeq
        pending.set(id, {
          resolve,
          reject,
          onChunk: opts.onChunk
            ? (chunk) => {
                partialText.value += chunk.text
                opts.onChunk(chunk)
              }
            : null
        })
        worker.postMessage(
          {
            type: 'transcribe',
            id,
            audio,
            task: opts.task || 'transcribe',
            language: opts.language || null,
            timestamps: !!opts.timestamps,
            stream: !!opts.stream
          },
          transfer
        )
      })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  function terminate() {
    if (worker) {
      worker.terminate()
      worker = null
    }
    workerReady.value = false
    readyPromise = null
    pending.clear()
  }

  return {
    wasm,
    workerReady,
    busy,
    errorMsg,
    stage,
    modelProgress,
    modelFile,
    partialText,
    displayProgress,
    decodeAudio,
    transcribe,
    terminate
  }
}
