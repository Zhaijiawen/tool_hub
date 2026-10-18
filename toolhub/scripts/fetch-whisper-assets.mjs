/**
 * 获取语音转文字（Whisper）工具所需的大体积资产：
 *
 * 1. onnxruntime-web 的 WASM 后端二进制
 *    node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm -> public/wasm/ort/
 *    node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm         -> public/wasm/ort/
 *    版本必须是 1.14.0（@xenova/transformers 2.17.2 的硬性 pin，见其
 *    package.json dependencies）。ort 自 1.17 起把 Tensor.data 改成原型
 *    getter（数据挪进自有字段 cpuData），transformers 用 Object.assign
 *    浅拷贝 ONNX Tensor，拷不到 data → 推理期 "Cannot use 'in' operator
 *    to search for 'subarray' in undefined" 崩溃（实机验证抓到）。
 *    两个变体都要就位：ort 运行时探测 SharedArrayBuffer 可用性后自行
 *    选择 threaded / 非 threaded 二进制（1.14 的 emscripten 胶水内联在
 *    ort 包的 JS 里，无独立 .mjs 代理文件）。
 *
 * 2. Whisper tiny（int8 量化）模型文件（合计约 43.5MB）
 *    Xenova/whisper-tiny -> public/models/whisper-tiny/
 *    运行时由 transformers.js 从本地路径加载，不请求 huggingface.co。
 *
 * 为什么不入库：模型 + wasm 合计约 55MB，与 pandoc.wasm 量级相当，
 * 走「gitignore + 按需获取」。模型文件来自 HuggingFace，需联网；
 * onnx wasm 来自本地 npm 包。
 *
 * 用法：npm run fetch:whisper-assets
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

// ---------- 1. onnxruntime-web wasm ----------
const ORT_FILES = ['ort-wasm-simd-threaded.wasm', 'ort-wasm-simd.wasm']
const ORT_DIR = path.join(ROOT, 'public/wasm/ort')

let ortCopied = false
for (const name of ORT_FILES) {
  const SRC = path.join(ROOT, 'node_modules/onnxruntime-web/dist', name)
  const DEST = path.join(ORT_DIR, name)
  if (!fs.existsSync(SRC)) {
    console.error('未找到 onnxruntime-web 文件：' + SRC)
    console.error('请先执行 npm install（onnxruntime-web 包内含该二进制）。')
    process.exit(1)
  }
  fs.mkdirSync(ORT_DIR, { recursive: true })
  if (fs.existsSync(DEST)) {
    const a = fs.statSync(SRC)
    const b = fs.statSync(DEST)
    if (a.size === b.size && a.mtimeMs <= b.mtimeMs) {
      console.log(`${name} 已是最新（${mb(b.size)}），跳过。`)
      continue
    }
  }
  fs.copyFileSync(SRC, DEST)
  ortCopied = true
  console.log(`已写入 public/wasm/ort/${name}  ${mb(fs.statSync(DEST).size)}`)
}

// ---------- 2. Whisper tiny 量化模型 ----------
const MODEL_DIR = path.join(ROOT, 'public/models/whisper-tiny')
const HF_BASE = 'https://huggingface.co/Xenova/whisper-tiny/resolve/main'
// 经 Node 实证：pipeline('automatic-speech-recognition') 加载 q8 变体时
// 实际只拉取这 7 个文件（encoder + merged decoder，int8 量化）
const MODEL_FILES = [
  'config.json',
  'generation_config.json',
  'preprocessor_config.json',
  'tokenizer.json',
  'tokenizer_config.json',
  'onnx/encoder_model_quantized.onnx',
  'onnx/decoder_model_merged_quantized.onnx'
]

async function fetchModel(file) {
  const dest = path.join(MODEL_DIR, file)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  // 已存在且非空则跳过（大文件，避免每次跑都下一遍 43MB）
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log(`  ${file} 已存在，跳过`)
    return
  }
  const url = `${HF_BASE}/${file}`
  process.stdout.write(`  下载 ${file} ... `)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    console.error(`失败 HTTP ${res.status}`)
    process.exit(1)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
  console.log(`${mb(buf.length)}`)
}

console.log('获取 Whisper tiny 量化模型（Xenova/whisper-tiny，int8）...')
for (const f of MODEL_FILES) {
  await fetchModel(f)
}

const total = MODEL_FILES.reduce((sum, f) => sum + fs.statSync(path.join(MODEL_DIR, f)).size, 0)
console.log(`模型就绪：public/models/whisper-tiny/（合计 ${mb(total)}）`)
if (ortCopied) {
  console.log('提示：onnx wasm 已更新，如部署过请同步刷新 CDN 缓存。')
}
