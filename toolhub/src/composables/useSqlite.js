/**
 * ToolHub SQLite 驱动（主线程侧）。
 *
 * 职责：
 * - 经 useWasmModule 下载 sqlite3.wasm（868KB，带进度/取消/缓存）；
 * - 管理 Vite ESM worker 生命周期：注入 wasm 字节 → 动态 import vendored
 *   sqlite-wasm/index.mjs → ready 握手（回传 SQLite 版本与 OPFS 可用性）；
 * - 以 job 协议驱动 import / openOpfs / openMemory / exec / tables / browse /
 *   export / listOpfs / deleteOpfs / close。
 *
 * 为什么 worker 化：OPFS 持久化要求专用 worker 线程（SAB+Atomics 桥接，
 * 本站已开 COOP/COEP），且 SQL 执行属 CPU 密集操作不能放主线程。
 */

import { ref, computed } from 'vue'
import { useWasmModule } from './useWasmModule'

export function useSqlite() {
  // compile:false —— 编译实例化在 worker 内由 Emscripten 胶水自行完成，
  // 主线程再 compile 一份纯属浪费。
  const wasm = useWasmModule('sqlite3', {
    url: '/wasm/sqlite3.wasm',
    name: 'SQLite',
    compile: false
  })

  const workerReady = ref(false)
  const busy = ref(false)
  const errorMsg = ref('')
  const stage = ref(null) // 'download' | 'run'
  const jobProgress = ref(0)
  const jobText = ref('')

  // worker 就绪后回传的环境信息
  const sqliteVersion = ref('')
  const opfsAvailable = ref(false)

  // 当前打开的库信息（主线程镜像，供 UI 直接渲染）
  const dbInfo = ref(null) // { name, kind, size, tables } | null

  let worker = null
  let jobSeq = 0
  const pending = new Map() // id -> { resolve, reject }

  const displayProgress = computed(() =>
    stage.value === 'download' ? Math.round(wasm.progress.value * 100) : jobProgress.value
  )

  function handleMessage(e) {
    const msg = e.data
    if (!msg || typeof msg !== 'object') return

    if (msg.type === 'toolhub:sqlite-ready') {
      workerReady.value = true
      sqliteVersion.value = msg.version || ''
      opfsAvailable.value = !!msg.opfs
      return
    }
    if (msg.type === 'toolhub:sqlite-error') {
      workerReady.value = false
      errorMsg.value = msg.message
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

    worker = new Worker(new URL('../workers/sqlite-worker.js', import.meta.url), {
      type: 'module'
    })
    worker.addEventListener('message', handleMessage)
    worker.addEventListener('error', handleError)

    // 转移副本：useWasmModule 的 bytesPromise 复用同一 ArrayBuffer，
    // 直接转移会 detach 缓存字节。
    const copy = buffer.slice(0)
    worker.postMessage({ type: 'toolhub:sqlite-init', wasm: copy }, [copy])

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
      // 防御性超时：868KB 实例化 + OPFS proxy worker 启动正常秒级完成
      setTimeout(() => {
        clearInterval(timer)
        if (!workerReady.value) reject(new Error('SQLITE_INIT_TIMEOUT'))
      }, 60000)
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

  /** 上传 .db 文件并导入为 OPFS 持久库 */
  async function importDb(name, bytes) {
    busy.value = true
    try {
      await ensureReady()
      dbInfo.value = await runJob('import', { name, bytes })
      return dbInfo.value
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 打开已存在的 OPFS 库（不存在则新建空库） */
  async function openOpfs(name) {
    busy.value = true
    try {
      await ensureReady()
      dbInfo.value = await runJob('openOpfs', { name })
      return dbInfo.value
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 打开内存库（bytes 可选：从上传文件反序列化；刷新即失） */
  async function openMemory(name, bytes) {
    busy.value = true
    try {
      await ensureReady()
      dbInfo.value = await runJob('openMemory', { name, bytes })
      return dbInfo.value
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 执行 SQL，返回 { columns, rows, changes } */
  async function exec(sql) {
    busy.value = true
    try {
      await ensureReady()
      const result = await runJob('exec', { sql })
      // exec 可能改变表结构 → 刷新表列表与大小
      if (dbInfo.value) {
        dbInfo.value = { ...dbInfo.value, tables: (await runJob('tables')).tables }
      }
      return result
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 浏览表（前 limit 行） */
  async function browse(table, limit = 200) {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('browse', { table, limit })
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 导出当前库为字节（OPFS 库与内存库均可） */
  async function exportDb() {
    busy.value = true
    try {
      await ensureReady()
      return await runJob('export', {})
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 列出 OPFS 中本站创建的库文件 */
  async function listOpfs() {
    busy.value = true
    try {
      await ensureReady()
      return (await runJob('listOpfs', {})).files
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 删除 OPFS 库文件（若正打开则先关闭） */
  async function deleteOpfs(name) {
    busy.value = true
    try {
      await ensureReady()
      const result = await runJob('deleteOpfs', { name })
      if (dbInfo.value && dbInfo.value.name === name) dbInfo.value = null
      return result.files
    } finally {
      busy.value = false
      stage.value = null
    }
  }

  /** 关闭当前库（保留 worker 与已下载字节） */
  async function closeDb() {
    if (!workerReady.value) {
      dbInfo.value = null
      return
    }
    busy.value = true
    try {
      await runJob('close', {})
      dbInfo.value = null
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
    dbInfo.value = null
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
    sqliteVersion,
    opfsAvailable,
    dbInfo,
    importDb,
    openOpfs,
    openMemory,
    exec,
    browse,
    exportDb,
    listOpfs,
    deleteOpfs,
    closeDb,
    terminate
  }
}
