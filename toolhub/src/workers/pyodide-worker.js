/**
 * ToolHub Pyodide Worker 入口（Python 代码运行器）。
 *
 * 定位：**标准库模式** —— 只用 Python 标准库（json/re/datetime/math/
 * statistics/collections/itertools 等），不含 numpy/pandas/scipy 等科学栈
 * （那些 wheel 不在 npm 包内，需从 jsdelivr 拉取 scipy 实测 12MB，
 * 会重新引入外部 CDN 依赖 —— 与已否决的 Whisper 方案同类，故不做）。
 *
 * 架构（与 OCR/PDF/SQLite/FFmpeg 同型）：
 * 1. 主线程 useWasmModule 下载 pyodide.asm.wasm（8.6MB，带进度/取消/缓存）；
 * 2. 字节转移进 worker，worker 内 loadPyodide({ indexURL, wasmBinary })；
 * 3. indexURL 指向 /pyodide/ —— loader 会自行 fetch 该目录下的
 *    pyodide.asm.js（1.0MB）、python_stdlib.zip（2.4MB）、
 *    pyodide-lock.json（107KB）。这三项体积远小于 wasm，由 worker 内直取即可，
 *    走主线程 loader 反而要为几百毫秒的小文件增加三份协议代码。
 *
 * 为什么放 worker：
 * - Python 执行是同步阻塞的（`runPython` 在 wasm 内跑完才返回），
 *   放主线程会冻结整个页面（死循环脚本会卡死 UI，用户无法取消）；
 * - pyodide 的 8.6MB wasm 内存与解释器栈独立在 worker 侧，terminate 即可完全释放。
 *
 * 注意：wasm 是通过 indexURL 直接 fetch 的（Emscripten 的
 * `getInstantiateWasmFunc` 用 instantiateStreaming），故主线程注入的字节
 * 经 `Module.instantiateWasm` 路径复用 —— 见下方 `instantiateWasm` 补丁。
 */

let pyodide = null
let ready = false

/** 资产基址（与 public/pyodide/ 对应） */
const INDEX_URL = '/pyodide/'

/** 缓存的 wasm 字节（供 pyodide 初始化时注入，避免二次下载） */
let wasmBytes = null

/**
 * 执行一段 Python 代码。
 * @param {string} code
 * @returns {{value:string, stdout:string[], stderr:string[], ms:number}}
 */
function runCode(code) {
  const stdout = []
  const stderr = []
  pyodide.setStdout({ batched: (s) => stdout.push(s) })
  pyodide.setStderr({ batched: (s) => stderr.push(s) })

  const t0 = Date.now()
  let value = ''
  let error = null
  try {
    // 表达式模式：末行是表达式时取其值，否则取 None
    const result = pyodide.runPython(code)
    if (result !== undefined && result !== null) {
      value = String(result)
      // runPython 对纯表达式返回 PyProxy；字符串结果已被 String() 消费
      if (typeof result?.destroy === 'function') {
        try {
          result.destroy()
        } catch (_) {
          /* 已消费则忽略 */
        }
      }
    } else {
      value = ''
    }
  } catch (e) {
    error = normalizePythonError(e)
  }
  const ms = Date.now() - t0

  return { value, stdout, stderr, ms, error }
}

/** 把 Python 异常转成可读结构（traceback 行数多，UI 侧展示已够用） */
function normalizePythonError(e) {
  const raw = String(e && e.message ? e.message : e)
  // PyodideError 常在末尾附带 "Error: <msg>"；同时剔除 Python 内部提示噪音
  const lines = raw.split('\n')
  const meaningful = lines.filter(
    (l) => l.trim() && !/^\s*(Traceback|File "<exec>"|During handling|\s+\^+\s*$)/.test(l)
  )
  const last = meaningful.length ? meaningful[meaningful.length - 1] : raw
  return {
    // 取最后一行（真正的异常信息），去除 "Error: " 前缀交给 UI 渲染
    type: (raw.match(/^(\w*(?:Error|Exception|Warning)):/m) || [, 'Error'])[1],
    message: last.replace(/^\w*(?:Error|Exception):\s*/, '').trim() || last.trim()
  }
}

self.addEventListener('message', async (e) => {
  const msg = e.data
  if (!msg || typeof msg !== 'object') return

  if (msg.type === 'toolhub:pyodide-init') {
    try {
      wasmBytes = new Uint8Array(msg.wasm)

      const { loadPyodide } = await import('../vendor/pyodide/pyodide.mjs')

      /**
       * wasm 字节注入：pyodide 的 createSettings 里 `instantiateWasm: Fe(indexURL)`
       * 走的是「先 fetch indexURL+pyodide.asm.wasm 再 instantiateStreaming」。
       * 我们已经用主线程 loader 带进度/缓存下载过同一份字节，
       * 故改为用 `Module.instantiateWasm` 直接注入，避免重复下载 8.6MB。
       *
       * 手法（与 mupdf/sqlite 同类的注入点替换）：在 loadPyodide 之前，
       * 把 fetch 拦一层——Emscripten 初始化时会把 pyodide.asm.wasm 交给我们，
       * 我们返回已缓存的字节。
       */
      const originalFetch = self.fetch.bind(self)
      self.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input?.url || ''
        if (url.endsWith('pyodide.asm.wasm')) {
          // 返回一个能 instantiateStreaming 的 Response
          return Promise.resolve(new Response(wasmBytes, {
            headers: { 'Content-Type': 'application/wasm' }
          }))
        }
        return originalFetch(input, init)
      }

      pyodide = await loadPyodide({ indexURL: INDEX_URL })
      self.fetch = originalFetch // 恢复，避免影响用户代码里的网络请求

      ready = true
      self.postMessage({
        type: 'toolhub:pyodide-ready',
        version: pyodide.version,
        python: pyodide.runPython('import sys; sys.version.split()[0]')
      })
    } catch (err) {
      self.postMessage({
        type: 'toolhub:pyodide-error',
        message: String(err && err.message ? err.message : err)
      })
    }
    return
  }

  if (!ready) {
    self.postMessage({ type: 'toolhub:job-error', id: msg.id, message: 'WORKER_NOT_READY' })
    return
  }

  try {
    if (msg.type === 'exec') {
      const result = runCode(String(msg.code || ''))
      self.postMessage({ type: 'toolhub:job-done', id: msg.id, result })
    } else if (msg.type === 'reset') {
      pyodide.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()')
      self.postMessage({ type: 'toolhub:job-done', id: msg.id, result: {} })
    } else {
      throw new Error('UNKNOWN_JOB:' + msg.type)
    }
  } catch (err) {
    self.postMessage({
      type: 'toolhub:job-error',
      id: msg.id,
      message: String(err && err.message ? err.message : err)
    })
  }
})