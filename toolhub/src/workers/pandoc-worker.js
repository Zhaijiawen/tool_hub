/**
 * Pandoc 文档转换 worker。
 *
 * 之所以不让组件直接用 pandoc-wasm 的浏览器入口：
 * 1. 该入口在 import 时就把 56MB 的 wasm 一次性拉下来，且带顶层 await，
 *    无法接入本站「下载进度 + 可取消 + Cache API 缓存」的加载体系；
 * 2. 实例化与转换都是重活，放 worker 才不会卡住主线程。
 * 因此这里接收主线程已下载好的 wasm 字节，自行实例化后长期驻留。
 *
 * 调用契约（与 usePandoc.js 配套）：
 * - init: { type:'toolhub:pandoc-init', wasm } → 'toolhub:pandoc-ready' | 'toolhub:pandoc-error'
 * - job:  { type:'convert', id, options, stdin, files } → 'toolhub:pandoc-done' | 'toolhub:pandoc-error'
 */

import { createPandocInstance } from 'pandoc-wasm-core'

let pandoc = null
let ready = false

/** options 里绝不能带空数组的 input-files：会让 pandoc 走「无输入文件」分支，
 *  实测产出的是残缺文件（docx 体积明显偏小、回读为空）。没有输入文件时必须省略。 */
function sanitizeOptions(options) {
  const opts = { ...(options || {}) }
  if (Array.isArray(opts['input-files']) && opts['input-files'].length === 0) {
    delete opts['input-files']
  }
  return opts
}

self.addEventListener('message', async (e) => {
  const msg = e.data
  if (!msg || typeof msg !== 'object') return

  if (msg.type === 'toolhub:pandoc-init') {
    try {
      pandoc = await createPandocInstance(new Uint8Array(msg.wasm))
      ready = true
      self.postMessage({ type: 'toolhub:pandoc-ready' })
    } catch (err) {
      self.postMessage({
        type: 'toolhub:pandoc-error',
        message: String(err && err.message ? err.message : err)
      })
    }
    return
  }

  if (msg.type !== 'convert') return

  if (!ready) {
    self.postMessage({ type: 'toolhub:pandoc-error', id: msg.id, message: 'WORKER_NOT_READY' })
    return
  }

  try {
    const options = sanitizeOptions(msg.options)

    // 主线程传来的 files 是 { name: ArrayBuffer }（穿过 postMessage 后不再是 Blob），
    // core.js 只接受 string 或 Blob，这里统一还原成 Blob。
    const files = {}
    for (const [name, data] of Object.entries(msg.files || {})) {
      files[name] = new Blob([data])
    }

    const result = await pandoc.convert(options, msg.stdin ?? null, files)

    const payload = {
      type: 'toolhub:pandoc-done',
      id: msg.id,
      result: {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        warnings: result.warnings || [],
        // extract-media 的产物（media.zip）此前从未被转发，导致页面上的勾选
        // 框等于无效——用户勾了却拿不到任何东西。现在一并交付。
        mediaZip: null
      }
    }

    const transfer = []

    // 二进制输出（docx/epub/odt/rtf 等需要有 output-file 的产物）
    const outName = options['output-file']
    if (outName && result.files[outName]) {
      const bytes = new Uint8Array(await result.files[outName].arrayBuffer())
      payload.result.outputFile = { name: outName, bytes }
      transfer.push(bytes.buffer)
    }

    // extract-media 的媒体包。注意：只有当 extract-media 真的解出内容时
    // pandoc 才会生成 media.zip；没有内嵌资源的文档不会有这个键。
    if (options['extract-media']) {
      const zip = result.files['media.zip'] || result.files[options['extract-media']]
      if (zip) {
        const bytes = new Uint8Array(await zip.arrayBuffer())
        payload.result.mediaZip = { name: 'media.zip', bytes }
        transfer.push(bytes.buffer)
      }
    }

    self.postMessage(payload, transfer)
  } catch (err) {
    self.postMessage({
      type: 'toolhub:pandoc-error',
      id: msg.id,
      message: String(err && err.message ? err.message : err)
    })
  }
})
