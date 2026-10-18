/**
 * 为 onnxruntime-web 补齐 imgly 多线程所需的原始文件路径。
 *
 * 背景：imgly 用分片 + 内容寻址存 ort 的 wasm/mjs，读取时经
 * new URL(chunk.name, publicPath) 拼分片地址，再 createObjectURL 得到
 * blob URL 交给 onnxruntime-web。主线程用 blob URL 没问题，但 imgly 把
 * ort.env.wasm.numThreads 硬编码为 navigator.hardwareConcurrency，多线程时
 * ort 需要 pthread 代理——代理 Worker 内部无法沿用 blob URL，会回退到
 * **站点根**下的硬编码路径 /onnxruntime-web/ort-wasm-simd-threaded.wasm
 * （不是 publicPath 下）。该路径不存在 → 站点 SPA fallback 返回
 * index.html → wasm 实例化报
 * "expected magic word 00 61 73 6d, found 3c 21 64 6f"（即 "<!do"）。
 *
 * 修法：把 wasm/mjs 按原始文件名额外放到 public/onnxruntime-web/ 下，
 * 使回退路径可命中。分片文件保留不动，imgly 正常读取路径不受影响。
 */
import fs from 'fs'
import path from 'path'

const SRC_DIR = path.resolve(process.argv[2] || 'public/imgly-bg')
const OUT_DIR = path.resolve(process.argv[3] || 'public/onnxruntime-web')
const RES = path.join(SRC_DIR, 'resources.json')
if (!fs.existsSync(RES)) {
  console.error('resources.json not found at', RES)
  process.exit(1)
}

const map = JSON.parse(fs.readFileSync(RES, 'utf8'))

/** 按 resources.json 的 chunks/offsets 重组一个逻辑文件 */
function assemble(key) {
  const entry = map[key]
  if (!entry) throw new Error('no entry: ' + key)
  const parts = entry.chunks.map((c) => {
    const p = path.join(SRC_DIR, c.hash)
    if (!fs.existsSync(p)) throw new Error('missing chunk: ' + c.hash)
    const buf = fs.readFileSync(p)
    const [start, end] = c.offsets
    if (buf.length !== end - start) {
      throw new Error(`chunk ${c.hash.slice(0, 12)} size mismatch: ${buf.length} != ${end - start}`)
    }
    return buf
  })
  const out = Buffer.concat(parts)
  if (out.length !== entry.size) throw new Error(`size mismatch: ${out.length} != ${entry.size}`)
  return out
}

console.log('源目录:', SRC_DIR)
console.log('输出目录:', OUT_DIR)
fs.mkdirSync(OUT_DIR, { recursive: true })

// 只取 onnxruntime-web 下的 wasm/mjs（模型不走 pthread 代理，无需复制）
const targets = Object.keys(map).filter((k) => k.startsWith('/onnxruntime-web/'))
console.log('待处理:', targets.length)

let written = 0
for (const key of targets) {
  const name = key.replace(/^\//, '').split('/').pop()
  const target = path.join(OUT_DIR, name)
  try {
    const buf = assemble(key)
    fs.writeFileSync(target, buf)
    written++
    const head = buf.subarray(0, 4).toString('hex').match(/../g).join(' ')
    console.log(`  ✅ ${name}  ${(buf.length / 1048576).toFixed(2)} MB  magic=${head}`)
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`)
  }
}
console.log('\n新增文件:', written)
console.log('提示：public/ 下的资源不参与 vite hash 重命名，缓存键稳定。')

