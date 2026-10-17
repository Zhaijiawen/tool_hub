/**
 * ToolHub Pyodide 驱动（主线程侧）。
 *
 * 职责：
 * - 经 useWasmModule 下载 pyodide.asm.wasm（8.6MB，带进度/取消/缓存）；
 * - 管理 Vite ESM worker 生命周期：注入 wasm 字节 → 动态 import vendored
 *   pyodide.mjs → loadPyodide → ready 握手（回传 Python 版本）；
 * - 以 job 协议执行 Python 代码，回传结果值 / stdout / stderr / 耗时 / 错误。
 *
 * 定位：标准库模式（不含 numpy/pandas 等科学栈，理由见 worker 文件头注释）。
 */

import { ref, computed } from 'vue'
import { useWasmModule } from './useWasmModule'

export function usePyodide() {
  // compile:false —— 8.6MB 的编译在 worker 内由 Emscripten 完成，主线程再编译纯属浪费
  const wasm = useWasmModule('pyodide', {
    url: '/pyodide/pyodide.asm.wasm',
    name: 'Pyodide (Python)',
    compile: false
  })

  const workerReady = ref(false)
  const busy = ref(false)
  const errorMsg = ref('')
  const stage = ref(null) // 'download' | 'load' | 'run'
  const pyodideVersion = ref('')
  const pythonVersion = ref('')
  const lastResult = ref(null) // { value, stdout, stderr, ms }

  let worker = null
  let jobSeq = 0
  const pending = new Map()

  /**
   * 三段式进度：
   *   下载 wasm 0–70 / 引擎加载 70–95 / 执行 95–100
   * 执行阶段无可靠百分比（Python 脚本耗时不可预知），故显示为 95% 常驻。
   */
  const displayProgress = computed(() => {
    if (stage.value === 'download') return Math.round(wasm.progress.value * 70)
    if (stage.value === 'load') return 70 + Math.round(wasm.progress.value * 25)
    return 95
  })

  function handleMessage(e) {
    const msg = e.data
    if (!msg || typeof msg !== 'object') return

    if (msg.type === 'toolhub:pyodide-ready') {
      workerReady.value = true
      pyodideVersion.value = msg.version || ''
      pythonVersion.value = msg.python || ''
      return
    }
    if (msg.type === 'toolhub:pyodide-error') {
      workerReady.value = false
      errorMsg.value = msg.message
      for (const [, job] of pending) job.reject(new Error(msg.message))
      pending.clear()
      return
    }
    if (msg.type === 'toolhub:job-done') {
      const job = pending.get(msg.id)
      pending.delete(msg.id)
      if (job) job.resolve(msg.result)
      return
    }
    if (msg.type === 'toolhub:job-error') {
      const job = pending.get(msg.id)
      pending.delete(msg.id)
      if (job) job.reject(new Error(msg.message))
    }
  }

  function handleError(err) {
    errorMsg.value = String(err && err.message ? err.message : err)
    for (const [, job] of pending) {
      job.reject(err instanceof ErrorEvent ? new Error('WORKER_ERROR') : err)
    }
    pending.clear()
  }

  /** 下载 wasm 并启动 worker（幂等；失败可重试） */
  async function ensureReady() {
    if (workerReady.value) return
    errorMsg.value = ''

    if (!worker) {
      stage.value = 'download'
      const { buffer } = await wasm.load()

      worker = new Worker(new URL('../workers/pyodide-worker.js', import.meta.url), {
        type: 'module'
      })
      worker.addEventListener('message', handleMessage)
      worker.addEventListener('error', handleError)

      // 转移副本：useWasmModule 的 bytesPromise 复用同一 ArrayBuffer，
      // 直接转移会 detach 缓存字节
      const copy = buffer.slice(0)
      worker.postMessage({ type: 'toolhub:pyodide-init', wasm: copy }, [copy])
    }

    stage.value = 'load'
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
      // 首次加载还要取 asm.js(1MB) + stdlib(2.4MB)，给足超时
      setTimeout(() => {
        clearInterval(timer)
        if (!workerReady.value) reject(new Error('PYODIDE_INIT_TIMEOUT'))
      }, 180000)
    })
    stage.value = null
  }

  function runJob(type, payload) {
    return new Promise((resolve, reject) => {
      const id = ++jobSeq
      pending.set(id, { resolve, reject })
      stage.value = 'run'
      worker.postMessage({ type, id, ...payload })
    })
  }

  /**
   * 执行 Python 代码。
   * @param {string} code
   * @returns {Promise<{value:string, stdout:string[], stderr:string[], ms:number, error:?object}>}
   */
  async function runPython(code) {
    busy.value = true
    try {
      await ensureReady()
      const result = await runJob('exec', { code })
      lastResult.value = result
      return result
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
    lastResult.value = null
    pending.clear()
  }

  return {
    wasm,
    workerReady,
    busy,
    errorMsg,
    stage,
    displayProgress,
    pyodideVersion,
    pythonVersion,
    lastResult,
    runPython,
    terminate
  }
}