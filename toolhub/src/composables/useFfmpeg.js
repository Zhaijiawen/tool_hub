/**
 * ToolHub FFmpeg 驱动（主线程侧）。
 *
 * 职责：
 * - 经 useWasmModule 下载 ffmpeg-core.wasm（32.2MB，带进度/取消/缓存）；
 * - 管理自建 Vite ESM worker 生命周期：注入 wasm 字节 → 动态 import vendored
 *   ffmpeg-core.js → ready 握手；
 * - 以 job 协议驱动 probe / transcode / audio / gif。
 *
 * 为什么是自建 worker 而非上游 `@ffmpeg/ffmpeg` 的 FFmpeg 类：
 * 上游类会 spawn 自己的 worker 并自行 fetch wasm，绕过本加载器，
 * 导致进度条/取消/缓存全部失效（违背「异步按需下载+进度+可取消」需求）。
 * 与 OCR / PDF / SQLite 保持同一架构。
 *
 * 进度模型（三段式）：
 *   下载 0–50 → 引擎加载 50–85 → 转码执行 85–100
 * ffmpeg 的执行阶段本身没有可靠百分比（依赖总时长，
 * 而我们拿不到 stderr 里的 Duration），故该段用**不确定进度条**
 * （n-progress 的 indeterminate 风格）而非假百分比。
 */

import { ref, computed } from 'vue'
import { useWasmModule } from './useWasmModule'

export function useFfmpeg() {
  // compile:false —— 32MB 编译在 worker 内由胶水完成，主线程再 compile 纯属浪费
  const wasm = useWasmModule('ffmpeg-core', {
    url: '/wasm/ffmpeg-core.wasm',
    name: 'FFmpeg',
    compile: false
  })

  const workerReady = ref(false)
  const busy = ref(false)
  const errorMsg = ref('')
  const stage = ref(null) // 'download' | 'load' | 'run'
  // 执行阶段进度：ffmpeg 无可靠百分比（拿不到 Duration），置 null 表示不确定进度
  const jobProgress = ref(null)
  const jobLogs = ref([])

  let worker = null
  let jobSeq = 0
  const pending = new Map()

  /** 下载 0–50 / 加载 50–85 / 执行 85–100（执行段用不确定进度） */
  const displayProgress = computed(() => {
    if (stage.value === 'download') return Math.round(wasm.progress.value * 50)
    if (stage.value === 'load') return 50 + Math.round(wasm.progress.value * 35)
    return 85
  })

  /** 执行阶段是否为不确定进度（ffmpeg 无法给出可信百分比） */
  const indeterminate = computed(() => stage.value === 'run')

  function handleMessage(e) {
    const msg = e.data
    if (!msg || typeof msg !== 'object') return

    if (msg.type === 'toolhub:ffmpeg-ready') {
      workerReady.value = true
      return
    }
    if (msg.type === 'toolhub:ffmpeg-error') {
      workerReady.value = false
      errorMsg.value = msg.message
      for (const [, job] of pending) job.reject(new Error(msg.message))
      pending.clear()
      return
    }
    if (msg.type === 'toolhub:job-progress') {
      const job = pending.get(msg.id)
      // ffmpeg progress 实测可能为负/超大，仅记录不用于百分比展示
      if (job) job.lastProgress = msg.progress
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

  /** 下载 32MB wasm 并启动 worker（幂等；失败可重试） */
  async function ensureReady() {
    if (workerReady.value) return
    errorMsg.value = ''

    if (!worker) {
      stage.value = 'download'
      const { buffer } = await wasm.load()

      worker = new Worker(new URL('../workers/ffmpeg-worker.js', import.meta.url), {
        type: 'module'
      })
      worker.addEventListener('message', handleMessage)
      worker.addEventListener('error', handleError)

      // 转移副本：useWasmModule 的 bytesPromise 复用同一 ArrayBuffer，
      // 直接转移会 detach 缓存字节（二次进入工具时必然失败）
      const copy = buffer.slice(0)
      worker.postMessage({ type: 'toolhub:ffmpeg-init', wasm: copy }, [copy])
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
      // 32MB wasm 实例化正常秒级；给足超时（大文件首次编译可能较慢）
      setTimeout(() => {
        clearInterval(timer)
        if (!workerReady.value) reject(new Error('FFMPEG_INIT_TIMEOUT'))
      }, 180000)
    })
    stage.value = null
  }

  function runJob(type, payload) {
    return new Promise((resolve, reject) => {
      const id = ++jobSeq
      pending.set(id, { resolve, reject, lastProgress: 0 })
      stage.value = 'run'
      jobProgress.value = null
      worker.postMessage({ type, id, ...payload })
    })
  }

  /** 校验文件是否为可解析的媒体，并取容器信息 */
  async function probe(bytes, name) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('probe', { bytes, name })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 视频转码。
   * @param {ArrayBuffer} bytes 输入文件字节
   * @param {string} name 输入文件名
   * @param {{format?:'mp4'|'webm', quality?:number, scale?:number, timeoutMs?:number}} opts
   *   quality: mp4 的 CRF（0-51，越小越清晰，默认 28）
   *   scale:   限制宽度（0 = 保持原尺寸）
   * @returns {Promise<{kind:'file', name:string, bytes:Uint8Array}>}
   */
  async function transcode(bytes, name, opts = {}) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('transcode', { bytes, name, ...opts })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 提取 / 转换音频。
   * @param {{format?:'mp3'|'m4a'|'wav'|'ogg'|'opus', timeoutMs?:number}} opts
   * @returns {Promise<{kind:'file', name:string, bytes:Uint8Array}>}
   */
  async function extractAudio(bytes, name, opts = {}) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('audio', { bytes, name, ...opts })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /**
   * 视频转 GIF。
   * @param {{fps?:number, width?:number, timeoutMs?:number}} opts
   * @returns {Promise<{kind:'file', name:string, bytes:Uint8Array}>}
   */
  async function toGif(bytes, name, opts = {}) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('gif', { bytes, name, ...opts })
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
    jobLogs,
    displayProgress,
    indeterminate,
    probe,
    transcode,
    extractAudio,
    toGif,
    terminate
  }
}