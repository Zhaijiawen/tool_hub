/**
 * ToolHub SQLite Worker 入口。
 *
 * 时序设计（与 mupdf-worker / tesseract-worker 同型）：
 * 1. 顶层注册一次性 message 监听，等待主线程注入 wasm 字节；
 * 2. 收到字节后动态 import vendored sqlite-wasm/index.mjs，调用
 *    `sqlite3InitModule({ wasmBinary })`——上游 Emscripten 胶水原生支持
 *    `Module.wasmBinary` 注入（2635 行 `if (Module["wasmBinary"]) ...`），
 *    与 jsquash/pcre2/mupdf 同模式；
 * 3. ready 后按 job 协议驱动数据库操作。
 *
 * 为什么 worker 化：
 * - OPFS 持久化要求专用 worker 线程（sqlite-wasm 官方约束：opfs VFS 的
 *   同步文件 API 经 SAB+Atomics 由 async proxy worker 桥接，仅 dedicated
 *   worker 可用）+ 本站已开 COOP/COEP（credentialless）提供 SAB；
 * - SQL 执行是 CPU 密集操作，放主线程会冻结 UI。
 *
 * 为什么不在 worker 里自己 fetch wasm：主线程 useWasmModule 才承载
 * 下载进度 / 取消 / Cache API 缓存（用户要求的完整体验），字节经
 * postMessage 转移（868KB 结构化克隆，一次性成本可接受）。
 */

let sqlite3 = null
let ready = false

// 当前打开的数据库
let db = null // oo1.DB / oo1.OpfsDb 实例
let dbName = '' // 展示名
let dbKind = '' // 'opfs' | 'memory'
let dbSize = 0 // OPFS 文件大小（内存库为序列化大小估计）

function currentSize() {
  if (dbKind === 'opfs') return dbSize
  try {
    return sqlite3.capi.sqlite3_js_db_export(db.pointer).byteLength
  } catch (_) {
    return 0
  }
}

function affirmDb() {
  if (!db) throw new Error('DB_NOT_OPEN')
}

/** 关闭当前库（幂等） */
function closeDb() {
  if (db) {
    try {
      db.close()
    } catch (_) { /* 已关闭时静默 */ }
  }
  db = null
  dbName = ''
  dbKind = ''
  dbSize = 0
}

/** 查询 sqlite_master 中的表/视图列表 */
function listTables() {
  affirmDb()
  return db.selectObjects(
    "SELECT name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY type, name"
  )
}

/** 浏览表数据（带 LIMIT 保护） */
function browseTable(table, limit) {
  affirmDb()
  // 表名来自 sqlite_master 枚举（非用户自由输入），仍做标识符转义防御
  const safe = '"' + String(table).replace(/"/g, '""') + '"'
  const columns = []
  const rows = []
  db.exec({
    sql: `SELECT * FROM ${safe} LIMIT ${Math.max(1, Math.min(Number(limit) || 200, 5000))}`,
    rowMode: 'object',
    columnNames: columns,
    resultRows: rows
  })
  return { columns, rows }
}

/** 执行任意 SQL（可含多条语句；返回首条 SELECT 的列与行 + 末条 DML 的 changes） */
function execSql(sql) {
  affirmDb()
  const columns = []
  const rows = []
  db.exec({
    sql,
    rowMode: 'object',
    columnNames: columns,
    resultRows: rows
  })
  let changes = 0
  try {
    changes = sqlite3.capi.sqlite3_changes(db.pointer)
  } catch (_) { /* 忽略 */ }
  return { columns, rows, changes }
}

/** 把字节反序列化进已打开的内存库（capi sqlite3_deserialize） */
function loadMemoryFromBytes(bytes) {
  const capi = sqlite3.capi
  const wasm = sqlite3.wasm
  const pData = capi.sqlite3_malloc(bytes.byteLength)
  if (!pData) throw new Error('ALLOC_FAILED')
  wasm.heap8().set(bytes, pData)
  const rc = capi.sqlite3_deserialize(
    db.pointer, 'main', pData, bytes.byteLength, bytes.byteLength,
    1 | 2 // SQLITE_DESERIALIZE_FREEONCLOSE | SQLITE_DESERIALIZE_RESIZEABLE
  )
  if (rc !== 0) throw new Error('DESERIALIZE_FAILED')
}

/** OPFS 根目录下本站创建的库文件列表（.sqlite3 / .db） */
async function listOpfsFiles() {
  const dir = await navigator.storage.getDirectory()
  const out = []
  for await (const [name, handle] of dir) {
    if (handle.kind !== 'file') continue
    if (!/\.(sqlite3?|db)$/i.test(name)) continue
    try {
      const file = await handle.getFile()
      out.push({ name, size: file.size })
    } catch (_) { /* 跳过不可读条目 */ }
  }
  return out.sort((a, b) => b.size - a.size)
}

async function deleteOpfsFile(name) {
  const dir = await navigator.storage.getDirectory()
  await dir.removeEntry(name)
}

/** 上传导入：校验 SQLite 头 → importDb 写入 OPFS（强制关 WAL）→ 打开 */
async function handleImport(msg) {
  if (!('opfs' in sqlite3)) throw new Error('OPFS_UNAVAILABLE')
  const name = String(msg.name || '').trim()
  if (!name) throw new Error('NAME_REQUIRED')
  const bytes = new Uint8Array(msg.bytes)
  // OpfsDb.importDb：内部 affirmIsDb 校验头，非 SQLite 文件抛错；
  // 失败时自动清理残留文件
  await sqlite3.oo1.OpfsDb.importDb('/' + name, bytes)
  closeDb()
  db = new sqlite3.oo1.OpfsDb('/' + name)
  dbName = name
  dbKind = 'opfs'
  dbSize = bytes.byteLength
  return openResult()
}

/** 打开已存在的 OPFS 库（不存在则新建空库） */
async function handleOpenOpfs(msg) {
  if (!('opfs' in sqlite3)) throw new Error('OPFS_UNAVAILABLE')
  const name = String(msg.name || '').trim()
  if (!name) throw new Error('NAME_REQUIRED')
  closeDb()
  db = new sqlite3.oo1.OpfsDb('/' + name)
  dbName = name
  dbKind = 'opfs'
  const files = await listOpfsFiles()
  dbSize = files.find((f) => f.name === name)?.size ?? 0
  return openResult()
}

/** 打开内存库（可选用上传字节反序列化；刷新即失） */
async function handleOpenMemory(msg) {
  const name = String(msg.name || '').trim() || ':memory:'
  closeDb()
  db = new sqlite3.oo1.DB(':memory:', 'ct')
  dbName = name
  dbKind = 'memory'
  dbSize = 0
  if (msg.bytes && msg.bytes.byteLength) {
    try {
      loadMemoryFromBytes(new Uint8Array(msg.bytes))
    } catch (e) {
      closeDb()
      throw new Error('DESERIALIZE_FAILED')
    }
  }
  return openResult()
}

function openResult() {
  return {
    name: dbName,
    kind: dbKind,
    size: currentSize(),
    tables: listTables()
  }
}

self.addEventListener('message', async (e) => {
  const msg = e.data
  if (!msg || typeof msg !== 'object') return

  if (msg.type === 'toolhub:sqlite-init') {
    try {
      const mod = await import('../vendor/sqlite-wasm/index.mjs')
      sqlite3 = await mod.default({ wasmBinary: new Uint8Array(msg.wasm) })
      // 静默 SQLite 内部 trace 日志（每次 exec 都会打 SQL TRACE，对用户无意义）
      if (sqlite3.config && typeof sqlite3.config.log === 'function') {
        sqlite3.config.log(() => {})
      }
      ready = true
      self.postMessage({
        type: 'toolhub:sqlite-ready',
        version: sqlite3.version.libVersion,
        opfs: 'opfs' in sqlite3
      })
    } catch (err) {
      self.postMessage({
        type: 'toolhub:sqlite-error',
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
    let result
    switch (msg.type) {
      case 'import':
        result = await handleImport(msg)
        break
      case 'openOpfs':
        result = await handleOpenOpfs(msg)
        break
      case 'openMemory':
        result = await handleOpenMemory(msg)
        break
      case 'exec':
        result = execSql(String(msg.sql || ''))
        break
      case 'tables':
        result = { tables: listTables() }
        break
      case 'browse':
        result = browseTable(msg.table, msg.limit)
        break
      case 'export':
        affirmDb()
        // sqlite3_js_db_export 内部为 heap8u().slice() 副本（非 HEAP 视图），可直接转移
        result = { bytes: sqlite3.capi.sqlite3_js_db_export(db.pointer) }
        break
      case 'listOpfs':
        result = { files: await listOpfsFiles() }
        break
      case 'deleteOpfs': {
        const name = String(msg.name || '').trim()
        if (db && dbKind === 'opfs' && dbName === name) closeDb()
        await deleteOpfsFile(name)
        result = { files: await listOpfsFiles() }
        break
      }
      case 'close':
        closeDb()
        result = {}
        break
      default:
        throw new Error('UNKNOWN_JOB:' + msg.type)
    }
    const transfer = result && result.bytes ? [result.bytes.buffer] : []
    self.postMessage({ type: 'toolhub:job-done', id: msg.id, result }, transfer)
  } catch (err) {
    self.postMessage({
      type: 'toolhub:job-error',
      id: msg.id,
      message: String(err && err.message ? err.message : err)
    })
  }
})
