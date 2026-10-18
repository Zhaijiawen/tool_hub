/**
 * 把 pandoc.wasm 从 node_modules 复制到 public/wasm/。
 *
 * 为什么不在仓库里直接存这份二进制：
 * - 它有 56MB（brotli 后仍约 12MB），远大于本站其他 wasm 资产；
 * - 来源可复现：随 pandoc-wasm npm 包分发，`npm install` 后必定存在。
 * 因此走「gitignore + 按需获取」，与 imgly-bg / mermaid 的处理保持一致。
 *
 * 用法：npm run fetch:pandoc-assets
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SRC = path.join(ROOT, 'node_modules/pandoc-wasm/src/pandoc.wasm')
const DEST_DIR = path.join(ROOT, 'public/wasm')
const DEST = path.join(DEST_DIR, 'pandoc.wasm')

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

if (!fs.existsSync(SRC)) {
  console.error('未找到 pandoc.wasm：' + SRC)
  console.error('请先执行 npm install（pandoc-wasm 包内含该二进制）。')
  process.exit(1)
}

fs.mkdirSync(DEST_DIR, { recursive: true })

// 已是最新（同 size 且源文件不比目标新）则跳过，避免每次都拷 56MB
if (fs.existsSync(DEST)) {
  const a = fs.statSync(SRC)
  const b = fs.statSync(DEST)
  if (a.size === b.size && a.mtimeMs <= b.mtimeMs) {
    console.log(`pandoc.wasm 已是最新（${mb(b.size)}），跳过。`)
    process.exit(0)
  }
}

fs.copyFileSync(SRC, DEST)
console.log(`已写入 ${path.relative(ROOT, DEST)}  ${mb(fs.statSync(DEST).size)}`)
