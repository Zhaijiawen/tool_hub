import { ref } from 'vue'

/**
 * 统一 WASM 模块加载器（Phase 0 基建）。
 *
 * 职责：把一个 .wasm 二进制「异步下载（带进度）→ Cache API 缓存 → 编译」，
 * 并提供取消能力；具体实例化（Emscripten 工厂 / 原始 instantiate / 喂给第三方库的
 * locateFile/wasmBinary）由调用方用返回的 bytes/module 完成，从而与具体库解耦。
 *
 * 设计要点：
 * - 缓存优先：命中 Cache API 直接返回，二次打开瞬时完成（"继续"的最终体验）。
 * - 流式进度：读 response.body，结合 Content-Length 计算 0-100%。
 * - 取消：AbortController.abort()；再次 load() 重新发起。
 * - 全局注册表 downloads：模块级 ref，供 <WasmDownloadBar> 展示所有进行中的下载。
 *
 * 说明：hash-wasm / oxipng-wasm 等 npm 包通常自行加载内置 .wasm，无需本加载器；
 * 本加载器面向「我们主动 fetch 的大体积二进制」（FFmpeg core、Whisper 模型、
 * Tesseract 语言包等）以及需要自管缓存/进度的场景。
 */

// Cache API 存储空间名称（升级时 bump 版本号即可整体失效）
const CACHE_NAME = 'toolhub-wasm-v1'

// 模块级响应式注册表：{ [id]: { name, status, progress } }
const downloads = ref({})

// 每个进行中下载的 AbortController
const controllers = new Map()

function patch(id, data) {
  downloads.value = { ...downloads.value, [id]: { ...downloads.value[id], ...data } }
}

function remove(id) {
  if (!(id in downloads.value)) return
  const next = { ...downloads.value }
  delete next[id]
  downloads.value = next
}

/** 带进度的 fetch，返回 ArrayBuffer */
async function fetchWithProgress(url, onProgress, signal) {
  const res = await fetch(url, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`)
  const total = Number(res.headers.get('Content-Length')) || 0

  // 无流式 body（极端环境）：退化为一次性读取
  if (!res.body) {
    const buf = await res.arrayBuffer()
    onProgress && onProgress(1)
    return buf
  }

  const reader = res.body.getReader()
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    onProgress && onProgress(total ? received / total : 0)
  }
  const merged = new Uint8Array(received)
  let offset = 0
  for (const c of chunks) {
    merged.set(c, offset)
    offset += c.length
  }
  return merged.buffer
}

async function readCache(url) {
  if (typeof caches === 'undefined') return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const hit = await cache.match(url)
    if (hit) return await hit.arrayBuffer()
  } catch (_) { /* 隐私模式/不支持时静默降级 */ }
  return null
}

async function writeCache(url, buffer) {
  if (typeof caches === 'undefined') return
  try {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(url, new Response(buffer))
  } catch (_) { /* 忽略写入失败（如隐私模式） */ }
}

/**
 * 使用一个 WASM 模块。
 * @param {string} id 唯一标识（如 'ffmpeg-core'）
 * @param {Object} opts
 * @param {string} opts.url   .wasm 二进制地址
 * @param {string} [opts.name] 展示名（默认取 id）
 * @param {boolean} [opts.compile=true] 是否顺带 WebAssembly.compile
 * @returns {{ id:string, status:import('vue').Ref, progress:import('vue').Ref,
 *            load:Function, cancel:Function }}
 */
export function useWasmModule(id, opts = {}) {
  const { url, name = id, compile = true } = opts

  const status = ref('idle') // idle | downloading | compiling | ready | error
  const progress = ref(0)
  let bytesPromise = null

  patch(id, { name, status: status.value, progress: progress.value })

  function setStatus(s) {
    status.value = s
    patch(id, { status: s, progress: progress.value })
  }
  function setProgress(p) {
    progress.value = p
    patch(id, { progress: p })
  }

  async function load() {
    if (status.value === 'ready') return bytesPromise
    if (bytesPromise) return bytesPromise

    bytesPromise = (async () => {
      try {
        let buffer = await readCache(url)
        if (buffer) {
          setProgress(1)
        } else {
          setStatus('downloading')
          setProgress(0)
          const controller = new AbortController()
          controllers.set(id, controller)
          try {
            buffer = await fetchWithProgress(url, setProgress, controller.signal)
          } finally {
            controllers.delete(id)
          }
          await writeCache(url, buffer)
        }

        setStatus('compiling')
        let module = null
        if (compile) module = await WebAssembly.compile(buffer)

        setStatus('ready')
        setProgress(1)
        // 就绪后短暂驻留注册表供 UI 展示"已就绪"，随后清理，避免堆积
        window.setTimeout(() => {
          if (status.value === 'ready') remove(id)
        }, 1500)
        return { buffer, module }
      } catch (err) {
        if (err && err.name === 'AbortError') {
          setStatus('idle')
          setProgress(0)
          remove(id)
        } else {
          setStatus('error')
          patch(id, { error: String(err && err.message ? err.message : err) })
        }
        bytesPromise = null
        throw err
      }
    })()

    return bytesPromise
  }

  function cancel() {
    const controller = controllers.get(id)
    if (controller) controller.abort()
  }

  // 供全局进度条在失败态调用重试
  patch(id, { retry: load })

  return { id, status, progress, load, cancel }
}

/**
 * 供全局下载条使用：所有下载的响应式状态 + 按 id 取消。
 */
export function useWasmDownloads() {
  function cancelById(id) {
    const controller = controllers.get(id)
    if (controller) controller.abort()
  }
  return { downloads, cancel: cancelById }
}
