/**
 * ToolHub 本地 facade：@jsquash/webp 编码器（仅 ST 单线程 glue）。
 *
 * 来源：@jsquash/webp@1.5.0（Squoosh App 移植，Apache-2.0）
 * - webp_enc.js / webp_enc_simd.js：Emscripten MODULARIZE glue，原样拷贝，
 *   仅将 `new URL("*.wasm", import.meta.url).href` 回退改为抛错——
 *   避免 Vite 构建期把它当静态资源解析（白吐 ~630KB 死资产），
 *   同时强制 wasm 只能以「编译好的 WebAssembly.Module」注入（走我们的下载/缓存/进度链路）。
 * - emscriptenUtils.js：jsquash 的 initEmscriptenModule（与 @jsquash/webp/utils.js 相同，
 *   各 jsquash 包该文件一致，故共享一份）。
 * - meta.js：libwebp 默认参数（quality 75 等）。
 *
 * 与上游 encode.js 包装层的差异：上游 init() 内部用 wasm-feature-detect 的 simd()
 * 自动选 glue；这里把选择权上抛给调用方（组件先 simd() 探测，再决定下载哪个 wasm、
 * 传对应 useSimd 标志），保证「下载的字节」与「实例化的 glue」严格匹配。
 */

import { initEmscriptenModule } from '../emscriptenUtils.js'
import webpEncFactory from './webp_enc.js'
import webpEncSimdFactory from './webp_enc_simd.js'
import { defaultOptions } from './meta.js'

/**
 * 用编译好的 WebAssembly.Module 实例化 WebP 编码器。
 * @param {WebAssembly.Module} wasmModule useWasmModule(compile:true) 的产物
 * @param {boolean} useSimd 是否使用 SIMD glue（须与下载的 wasm 文件一致）
 * @returns {Promise<object>} Emscripten 模块（带 encode 方法）
 */
export async function createWebpEncoder(wasmModule, useSimd) {
  const factory = useSimd ? webpEncSimdFactory : webpEncFactory
  return initEmscriptenModule(factory, wasmModule, {})
}

/**
 * 编码 ImageData 为 WebP。
 * @param {object} encoder createWebpEncoder 的返回值
 * @param {ImageData} imageData
 * @param {object} [options] 覆盖默认参数（quality / lossless 等）
 * @returns {Promise<ArrayBuffer>} WebP 字节
 */
export async function encodeWebp(encoder, imageData, options = {}) {
  const result = encoder.encode(
    imageData.data,
    imageData.width,
    imageData.height,
    { ...defaultOptions, ...options }
  )
  if (!result) throw new Error('WebP encoding error.')
  return result.buffer
}
