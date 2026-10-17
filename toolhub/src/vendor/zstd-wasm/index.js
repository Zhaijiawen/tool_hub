/**
 * zstd-wasm 本地入口（ToolHub vendor 版）。
 *
 * 与 npm 包 @bokuweb/zstd-wasm@0.0.27 的差异：
 * - init() 只接受 useWasmModule 下载+缓存的 wasm 字节（ArrayBuffer），
 *   不使用包内 dist/web/index.web.js 的 `new URL('./zstd.wasm', import.meta.url)` 自动加载
 *   （那会让 Vite 额外吐一份 wasm 死资产进 dist，且绕过我们的进度/缓存/取消链路）。
 * - 只保留 simple API（compress / decompress），未引入 dictionary 系列。
 *
 * 底层 Module.init(filePathOrBuf) 对 byteLength > 0 的入参直接走
 * WebAssembly.instantiate(bytes)（见 zstd.js 的 instantiateAsync）。
 */
import { Module, waitInitialized } from './module'
import { compress } from './simple/compress'
import { decompress } from './simple/decompress'

let inited = false

/**
 * 用已下载的 wasm 字节初始化 zstd 模块（幂等）。
 * @param {ArrayBuffer} bytes useWasmModule 下载+缓存的字节
 */
export async function init(bytes) {
  if (inited) return
  Module.init(bytes)
  await waitInitialized()
  inited = true
}

export { compress, decompress }
