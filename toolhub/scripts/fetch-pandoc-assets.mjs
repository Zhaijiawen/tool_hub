/**
 * 把 pandoc.wasm 从 node_modules 压缩后写入 public/wasm/（.wasm.gz）。
 *
 * 为什么压缩：pandoc.wasm 原始 56MB、远超 Cloudflare Pages 单文件 25MB 上限，
 * 直接随站部署会被拒。改为 gzip 存储（约 16MB）后运行时由 useWasmModule 的
 * decompress:'gzip' 解压为原始字节，既过部署限制，又缩小用户实际下载量。
 *
 * 为什么不在仓库里直接存这份二进制：来源可复现（随 pandoc-wasm npm 包分发，
 * `npm install` 后必定存在），走「gitignore + 按需获取」，与 imgly-bg / mermaid 一致。
 *
 * 用法：npm run fetch:pandoc-assets
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SRC = path.join(ROOT, 'node_modules/pandoc-wasm/src/pandoc.wasm')
const DEST_DIR = path.join(ROOT, 'public/wasm')
const DEST = path.join(DEST_DIR, 'pandoc.wasm.gz')
const RAW_DEST = path.join(DEST_DIR, 'pandoc.wasm')

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

if (!fs.existsSync(SRC)) {
  console.error('未找到 pandoc.wasm：' + SRC)
  console.error('请先执行 npm install（pandoc-wasm 包内含该二进制）。')
  process.exit(1)
}

fs.mkdirSync(DEST_DIR, { recursive: true })

// 已是同体积的最新产物则跳过，避免每次都重新压缩 56MB
if (fs.existsSync(DEST)) {
  const a = fs.statSync(SRC)
  const b = fs.statSync(DEST)
  if (a.size === b.size && a.mtimeMs <= b.mtimeMs) {
    console.log(`pandoc.wasm.gz 已是最新（${mb(b.size)}），跳过。`)
    process.exit(0)
  }
}

// 旧脚本曾产出未压缩的 pandoc.wasm（56MB），留着会随构建进 dist 并触发 25MB 上限，清掉。
if (fs.existsSync(RAW_DEST)) fs.rmSync(RAW_DEST)

const raw = fs.readFileSync(SRC)
const gz = zlib.gzipSync(raw, { level: 9 })
fs.writeFileSync(DEST, gz)
console.log(`已写入 ${path.relative(ROOT, DEST)}  ${mb(gz.length)}（原始 ${mb(raw.length)}）`)
