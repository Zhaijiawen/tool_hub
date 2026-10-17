/**
 * ToolHub mupdf 驱动（主线程侧）。
 *
 * 职责：
 * - 经 useWasmModule 下载 mupdf.wasm（9.9MB，带进度/取消/缓存）；
 * - 管理 Vite ESM worker 生命周期：注入 wasm 字节 → 动态 import vendored
 *   mupdf.js → ready 握手；
 * - 以 job 协议驱动 render / merge / split，回报 0-100 进度。
 *
 * 为什么 worker 化：PDF 渲染/合并是 CPU 密集操作（大文档数十秒），
 * 放主线程会冻结 UI；同时 mupdf 的 wasm 内存在 worker 中独立。
 */

import { ref, computed } from 'vue'
import { useWasmModule } from './useWasmModule'

export function useMupdf() {
  // compile:false —— 编译实例化在 worker 内由 Emscripten 胶水自行完成，
  // 主线程再 compile 一份 9.9MB 纯属浪费。
  const wasm = useWasmModule('mupdf', {
    url: '/wasm/mupdf.wasm',
    name: 'MuPDF',
    compile: false
  })

  const workerReady = ref(false)
  const busy = ref(false)
  const errorMsg = ref('')
  const stage = ref(null) // 'download' | 'run'
  const jobProgress = ref(0) // 0-100，当前 job 的阶段进度
  const jobText = ref('') // worker 回报的可选阶段描述

  let worker = null
  let jobSeq = 0
  const pending = new Map() // id -> { resolve, reject }

  const displayProgress = computed(() =>
    stage.value === 'download' ? Math.round(wasm.progress.value * 100) : jobProgress.value
  )

  function handleMessage(e) {
    const msg = e.data
    if (!msg || typeof msg !== 'object') return

    if (msg.type === 'toolhub:mupdf-ready') {
      workerReady.value = true
      return
    }
    if (msg.type === 'toolhub:mupdf-error') {
      workerReady.value = false
      errorMsg.value = msg.message
      // 拒绝所有在途 job
      for (const [, job] of pending) {
        job.reject(new Error(msg.message))
      }
      pending.clear()
      return
    }
    if (msg.type === 'toolhub:job-progress') {
      const job = pending.get(msg.id)
      if (job && msg.total) {
        jobProgress.value = Math.round((msg.done / msg.total) * 100)
      }
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
    stage.value = 'download'
    const { buffer } = await wasm.load()

    worker = new Worker(new URL('../workers/mupdf-worker.js', import.meta.url), {
      type: 'module'
    })
    worker.addEventListener('message', handleMessage)
    worker.addEventListener('error', handleError)

    // 转移副本：useWasmModule 的 bytesPromise 复用同一 ArrayBuffer，
    // 直接转移会 detach 缓存字节。
    const copy = buffer.slice(0)
    worker.postMessage({ type: 'toolhub:mupdf-init', wasm: copy }, [copy])

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
      // 防御性超时：9.9MB 实例化 + 顶层 await import 正常秒级完成
      setTimeout(() => {
        clearInterval(timer)
        if (!workerReady.value) reject(new Error('MUPDF_INIT_TIMEOUT'))
      }, 120000)
    })
    stage.value = null
  }

  function runJob(type, payload) {
    return new Promise((resolve, reject) => {
      const id = ++jobSeq
      pending.set(id, { resolve, reject })
      jobProgress.value = 0
      stage.value = 'run'
      worker.postMessage({ type, id, ...payload })
    })
  }

  /**
   * 渲染 PDF 页面为图片。
   * @param {ArrayBuffer} buffer PDF 字节
   * @param {{format:string, scale:number, range:?string, password?:string}} opts
   *   range: null/空 = 全部页；否则 "1-3,5,8-"（1 基闭区间，worker 内解析）
   * @returns {Promise<{kind:'pages', pageCount:number, pages:Array<{name:string, page:number, bytes:Uint8Array}>}>}
   */
  async function render(buffer, opts) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('render', { buffer, ...opts })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 合并多个 PDF（按 files 顺序拼接全部页面）。
   * @param {Array<{name:string, buffer:ArrayBuffer}>} files
   * @param {string} [password]
   * @returns {Promise<{kind:'file', name:string, pageCount:number, bytes:Uint8Array}>}
   */
  async function merge(files, password) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('merge', { files, password })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 拆分 PDF。
   * @param {ArrayBuffer} buffer
   * @param {{mode:'each'|'range', range:?string, password?:string}} opts
   *   mode='each'：每页一个文件；mode='range'：按 range 语法（"1-3,5,8-"）每组一个文件
   * @returns {Promise<{kind:'parts', parts:Array<{name:string, pages:number, bytes:Uint8Array}>}>}
   */
  async function split(buffer, opts) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('split', { buffer, ...opts })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * PDF 瘦身压缩（垃圾回收 + 流压缩 + 字体/图片重压缩）。
   * @param {ArrayBuffer} buffer
   * @param {{password?:string}} [opts]
   * @returns {Promise<{kind:'file', name:string, pageCount:number, bytes:Uint8Array}>}
   */
  async function compress(buffer, opts = {}) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('compress', { buffer, ...opts })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 提取 PDF 文本层内容（非 OCR，扫描件返回空文本）。
   * @param {ArrayBuffer} buffer
   * @param {{range:?string, password?:string}} [opts]
   * @returns {Promise<{kind:'text', pageCount:number, parts:Array<{page:number, text:string}>}>}
   */
  async function extract(buffer, opts = {}) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('extract', { buffer, ...opts })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 页面管理：按页码范围保留（keep）或删除（delete）页面。
   * @param {ArrayBuffer} buffer
   * @param {{mode:'keep'|'delete', range:?string, password?:string}} opts
   * @returns {Promise<{kind:'file', name:string, pageCount:number, removed:number, bytes:Uint8Array}>}
   */
  async function organize(buffer, opts) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('organize', { buffer, ...opts })
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
    pending.clear()
  }

  return {
    wasm,
    workerReady,
    busy,
    errorMsg,
    stage,
    jobProgress,
    jobText,
    displayProgress,
    render,
    merge,
    split,
    compress,
    extract,
    organize,
    terminate
  }
}
