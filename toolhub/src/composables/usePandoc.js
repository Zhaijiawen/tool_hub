/**
 * ToolHub pandoc 驱动（主线程侧）。
 *
 * 职责：
 * - 经 useWasmModule 下载 pandoc.wasm（56MB，带进度/取消/缓存）；
 * - 启动 ESM worker 并把 wasm 字节喂进去完成握手；
 * - 以 job 协议驱动文档转换。
 *
 * 为什么 worker 化：实例化 pandoc + 跑一次转换都是重活（FCCT 初始化约 1-3s），
 * 放主线程会明显卡顿；且 Worker 内独立 wasm 内存互不干扰。
 */

import { ref, computed } from 'vue'
import { useWasmModule } from './useWasmModule'

export function usePandoc() {
  // compile:false —— 56MB 在主线程编译再传 worker 毫无意义，交给 worker 自己实例化。
  const wasm = useWasmModule('pandoc', {
    url: '/wasm/pandoc.wasm',
    name: 'Pandoc',
    compile: false
  })

  const workerReady = ref(false)
  const busy = ref(false)
  const errorMsg = ref('')
  const stage = ref(null) // 'download' | 'run' | 'init'
  const jobText = ref('')

  let worker = null
  let readyPromise = null
  let jobSeq = 0
  const pending = new Map() // id -> { resolve, reject }

  const displayProgress = computed(() =>
    stage.value === 'download' ? Math.round(wasm.progress.value * 100) : null
  )

  function handleMessage(e) {
    const msg = e.data
    if (!msg || typeof msg !== 'object') return

    if (msg.type === 'toolhub:pandoc-ready') {
      workerReady.value = true
      return
    }
    if (msg.type === 'toolhub:pandoc-error') {
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
    if (msg.type === 'toolhub:pandoc-done') {
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
      stage.value = 'download'
      const { buffer } = await wasm.load()

      stage.value = 'init'
      worker = new Worker(new URL('../workers/pandoc-worker.js', import.meta.url), {
        type: 'module'
      })
      worker.addEventListener('message', handleMessage)
      worker.addEventListener('error', handleError)

      const copy = buffer.slice(0)
      worker.postMessage({ type: 'toolhub:pandoc-init', wasm: copy }, [copy])

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
        // 56MB 实例化的防御性超时；正常为秒级
        setTimeout(() => {
          clearInterval(timer)
          if (!workerReady.value) reject(new Error('PANDOC_INIT_TIMEOUT'))
        }, 180000)
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
   * 执行一次文档转换。
   * @param {Object} options pandoc 选项，如 { from:'markdown', to:'html', standalone:true }
   * @param {string|null} stdin 文本输入；走 input-files 时传 null
   * @param {Object} files { 文件名: ArrayBuffer } 输入/资源文件
   * @returns {Promise<{stdout:string, stderr:string, warnings:Array, outputFile?:{name:string, bytes:Uint8Array}}>}
   */
  async function convert(options, stdin, files = {}) {
    await ensureReady()
    busy.value = true
    stage.value = 'run'
    try {
      // files 里的 ArrayBuffer 需要转移给 worker，逐个复制避免 detach 调用方数据
      const transfer = []
      const packed = {}
      for (const [name, buf] of Object.entries(files)) {
        if (typeof buf === 'string') {
          packed[name] = buf
        } else {
          const copy = new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer ?? buf)
          packed[name] = copy
          transfer.push(copy.buffer)
        }
      }

      return await new Promise((resolve, reject) => {
        const id = ++jobSeq
        pending.set(id, { resolve, reject })
        worker.postMessage({ type: 'convert', id, options, stdin, files: packed }, transfer)
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
    jobText,
    displayProgress,
    convert,
    terminate
  }
}
