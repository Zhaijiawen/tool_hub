/**
 * ToolHub mupdf Worker 入口。
 *
 * 时序设计（与 libarchive-worker 同型）：
 * 1. 顶层注册一次性 message 监听，等待主线程注入 wasm 字节；
 * 2. 收到字节后动态 import 打过补丁的 vendored mupdf.js，并调用其
 *    `__initMupdf(wasmBinary)`——胶水的 `t.wasmBinary && (u = t.wasmBinary)`
 *    注入分支被采用（上游原生支持，与 jsquash/pcre2/tesseract 同模式）；
 * 3. ready 后按 job 协议处理 render / merge / split。
 *
 * 为什么不在 worker 里自己 fetch wasm：主线程 useWasmModule 才承载
 * 下载进度 / 取消 / Cache API 缓存（用户要求的完整体验），字节经
 * postMessage 转移（9.9MB 结构化克隆，一次性成本可接受）。
 *
 * 页码范围语法（1 基，闭区间，逗号分隔）："1-3,5,8-"（空结尾 = 到最后一页）。
 * 解析放在 worker 内：打开文档后才知道总页数，组件侧无法预知。
 */

let mupdf = null
let ready = false

/** WASM 堆内的视图（Buffer.asUint8Array 返回 HEAPU8.subarray）不能直接
 *  postMessage 转移——那会 detach 整个 wasm 内存。必须先复制。 */
function copyBytes(view) {
  const out = new Uint8Array(view.byteLength)
  out.set(view)
  return out
}

function openPdf(buffer, password) {
  let doc
  try {
    doc = mupdf.PDFDocument.openDocument(new Uint8Array(buffer), 'application/pdf')
  } catch (_) {
    throw new Error('OPEN_FAILED')
  }
  if (doc.needsPassword()) {
    if (!password) throw new Error('PASSWORD_REQUIRED')
    if (!doc.authenticatePassword(password)) throw new Error('PASSWORD_WRONG')
  }
  return doc
}

/** 解析页码范围；null / 空 = 全部页。返回 0 基闭区间数组。 */
function parseRanges(spec, total) {
  if (spec === null || spec === undefined || String(spec).trim() === '') {
    return [[0, total - 1]]
  }
  const out = []
  for (const part of String(spec).split(',')) {
    const p = part.trim()
    if (!p) continue
    const m = p.match(/^(\d*)(?:-(\d*))?$/)
    if (!m) throw new Error('RANGE_INVALID')
    const s = m[1] === '' ? 1 : parseInt(m[1], 10)
    const e = m[2] === undefined ? s : (m[2] === '' ? total : parseInt(m[2], 10))
    if (!Number.isFinite(s) || !Number.isFinite(e) || s < 1 || e < s || s > total) {
      throw new Error('RANGE_INVALID')
    }
    out.push([s - 1, Math.min(e, total) - 1])
  }
  if (!out.length) throw new Error('RANGE_INVALID')
  return out
}

async function handleRender(msg) {
  const { id, buffer, format, range, password } = msg
  const doc = openPdf(buffer, password)
  const total = doc.countPages()
  if (total <= 0) throw new Error('EMPTY_DOC')
  const ranges = parseRanges(range, total)
  const pages = []
  for (const [s, e] of ranges) {
    for (let p = s; p <= e; p++) pages.push(p)
  }
  const pad = String(pages.length).length
  const out = []
  for (let i = 0; i < pages.length; i++) {
    const pageIndex = pages[i]
    const page = doc.loadPage(pageIndex)
    const pixmap = page.toPixmap(
      mupdf.Matrix.scale(msg.scale, msg.scale),
      mupdf.ColorSpace.DeviceRGB,
      false,
      true
    )
    const view = format === 'jpeg' ? pixmap.asJPEG(90) : pixmap.asPNG()
    out.push({
      name: `page-${String(i + 1).padStart(pad, '0')}.${format}`,
      page: pageIndex + 1,
      bytes: copyBytes(view)
    })
    self.postMessage({ type: 'toolhub:job-progress', id, done: i + 1, total: pages.length })
  }
  self.postMessage(
    { type: 'toolhub:job-done', id, result: { kind: 'pages', pageCount: total, pages: out } },
    out.map((p) => p.bytes.buffer)
  )
}

async function handleMerge(msg) {
  const { id, files, password } = msg
  const out = new mupdf.PDFDocument()
  let totalPages = 0
  for (let i = 0; i < files.length; i++) {
    const src = openPdf(files[i].buffer, password)
    const n = src.countPages()
    for (let p = 0; p < n; p++) {
      out.graftPage(out.countPages(), src, p)
    }
    totalPages += n
    self.postMessage({ type: 'toolhub:job-progress', id, done: i + 1, total: files.length })
  }
  const bytes = copyBytes(out.saveToBuffer().asUint8Array())
  self.postMessage(
    { type: 'toolhub:job-done', id, result: { kind: 'file', name: 'merged.pdf', pageCount: totalPages, bytes } },
    [bytes.buffer]
  )
}

/**
 * PDF 瘦身压缩。
 *
 * saveToBuffer 的 options 是 MuPDF write options 字符串，实测两条硬约束：
 * 1. 分隔符必须是「纯逗号」，带空格会抛 "Unused pdf arguments found"
 *    （`compress=yes,garbage` 可用；`compress=yes, garbage` 直接失败）；
 * 2. 仅识别特定键：garbage / compress=yes / compress-images / compress-fonts /
 *    decompress / linearize / pretty / clean。臆测的键（如 compress-images=yes、
 *    garbage=compact、compression=jpeg）会被判为 unknown 并终报 Unused pdf arguments。
 */
async function handleCompress(msg) {
  const { id, buffer, password } = msg
  const doc = openPdf(buffer, password)
  const total = doc.countPages()
  self.postMessage({ type: 'toolhub:job-progress', id, done: 1, total: 2 })
  const opts = 'garbage,compress=yes,compress-images,compress-fonts'
  const bytes = copyBytes(doc.saveToBuffer(opts).asUint8Array())
  self.postMessage({ type: 'toolhub:job-progress', id, done: 2, total: 2 })
  self.postMessage(
    { type: 'toolhub:job-done', id, result: { kind: 'file', name: 'compressed.pdf', pageCount: total, bytes } },
    [bytes.buffer]
  )
}

/** 提取 PDF 文本层（toStructuredText → asText）。扫描件无文本层时返回空串。 */
async function handleExtract(msg) {
  const { id, buffer, range, password } = msg
  const doc = openPdf(buffer, password)
  const total = doc.countPages()
  if (total <= 0) throw new Error('EMPTY_DOC')
  const ranges = parseRanges(range, total)
  const pages = []
  for (const [s, e] of ranges) {
    for (let p = s; p <= e; p++) pages.push(p)
  }
  const parts = []
  for (let i = 0; i < pages.length; i++) {
    const pageIndex = pages[i]
    const page = doc.loadPage(pageIndex)
    const text = page.toStructuredText().asText()
    parts.push({ page: pageIndex + 1, text })
    self.postMessage({ type: 'toolhub:job-progress', id, done: i + 1, total: pages.length })
  }
  self.postMessage({
    type: 'toolhub:job-done',
    id,
    result: { kind: 'text', pageCount: total, parts }
  })
}

/**
 * 按页码范围保留 / 删除页面。
 * 删除必须「从大到小」执行：deletePage 会平移后续索引，正序删会错位。
 */
async function handleOrganize(msg) {
  const { id, buffer, mode, range, password } = msg
  const doc = openPdf(buffer, password)
  const total = doc.countPages()
  if (total <= 0) throw new Error('EMPTY_DOC')
  const ranges = parseRanges(range, total)
  const target = new Set()
  for (const [s, e] of ranges) {
    for (let p = s; p <= e; p++) target.add(p)
  }
  let toDelete
  if (mode === 'delete') {
    toDelete = [...target]
  } else {
    toDelete = []
    for (let i = 0; i < total; i++) if (!target.has(i)) toDelete.push(i)
  }
  // 全部删除没有意义，交给上层拦截
  if (toDelete.length >= total) throw new Error('DELETE_ALL')
  toDelete.sort((a, b) => b - a)
  self.postMessage({ type: 'toolhub:job-progress', id, done: 1, total: 2 })
  for (const p of toDelete) doc.deletePage(p)
  const left = doc.countPages()
  const bytes = copyBytes(doc.saveToBuffer().asUint8Array())
  self.postMessage({ type: 'toolhub:job-progress', id, done: 2, total: 2 })
  self.postMessage(
    { type: 'toolhub:job-done', id, result: { kind: 'file', name: 'organized.pdf', pageCount: left, removed: toDelete.length, bytes } },
    [bytes.buffer]
  )
}

async function handleSplit(msg) {
  const { id, buffer, mode, range, password } = msg
  const src = openPdf(buffer, password)
  const total = src.countPages()
  if (total <= 0) throw new Error('EMPTY_DOC')
  const ranges = mode === 'each'
    ? Array.from({ length: total }, (_, i) => [i, i])
    : parseRanges(range, total)
  const parts = []
  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i]
    const out = new mupdf.PDFDocument()
    for (let p = start; p <= end; p++) {
      out.graftPage(out.countPages(), src, p)
    }
    const bytes = copyBytes(out.saveToBuffer().asUint8Array())
    const suffix = ranges.length > 1 ? `-${i + 1}` : ''
    parts.push({
      name: `split-p${start + 1}-${end + 1}${suffix}.pdf`,
      pages: end - start + 1,
      bytes
    })
    self.postMessage({ type: 'toolhub:job-progress', id, done: i + 1, total: ranges.length })
  }
  self.postMessage(
    { type: 'toolhub:job-done', id, result: { kind: 'parts', parts } },
    parts.map((p) => p.bytes.buffer)
  )
}

self.addEventListener('message', async (e) => {
  const msg = e.data
  if (!msg || typeof msg !== 'object') return

  if (msg.type === 'toolhub:mupdf-init') {
    try {
      //  vendored mupdf.js 已去 TLA：显式 __initMupdf(bytes) 注入 wasmBinary，
      //  完成后经命名空间默认导出取得完整 API（类静态赋值在 init 内收拢执行）。
      const mod = await import('../vendor/mupdf/mupdf.js')
      await mod.__initMupdf(new Uint8Array(msg.wasm))
      mupdf = mod.default
      // 静默 mupdf 内部日志：非致命 format error/warning（多见于不规范 PDF 的
      // 慢速回退路径）会打到 console，对用户无意义且造成噪音。
      if (typeof mupdf.setLog === 'function') mupdf.setLog(() => {})
      ready = true
      self.postMessage({ type: 'toolhub:mupdf-ready' })
    } catch (err) {
      self.postMessage({
        type: 'toolhub:mupdf-error',
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
    if (msg.type === 'render') await handleRender(msg)
    else if (msg.type === 'merge') await handleMerge(msg)
    else if (msg.type === 'split') await handleSplit(msg)
    else if (msg.type === 'compress') await handleCompress(msg)
    else if (msg.type === 'extract') await handleExtract(msg)
    else if (msg.type === 'organize') await handleOrganize(msg)
  } catch (err) {
    self.postMessage({
      type: 'toolhub:job-error',
      id: msg.id,
      message: String(err && err.message ? err.message : err)
    })
  }
})
