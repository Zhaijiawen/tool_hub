/**
 * ToolHub 本地 facade：@jsquash/avif 编码器（仅 ST 单线程 glue）。
 *
 * 来源：@jsquash/avif@2.1.1（Squoosh App 移植，Apache-2.0）
 * - avif_enc.js：Emscripten MODULARIZE glue，原样拷贝，仅将
 *   `new URL("avif_enc.wasm", import.meta.url).href` 回退改为抛错（理由同 webp/index.js）。
 * - meta.js：libavif 默认参数（quality 50 / speed 6 / bitDepth 8）。
 *
 * 与上游 encode.js 包装层的差异（重要）：
 * 上游 init() 在检测到 SharedArrayBuffer（本站已开 COOP/COEP）时会改用
 * avif_enc_mt.js 多线程 glue——那需要 pthread worker 文件（avif_enc_mt.worker.mjs），
 * 与 Vite 打包/我们的主线程加载链路兼容性差。本站 deliberately 只用 ST glue，
 * 编码在主线程执行；多线程 + Worker 化统一留待 Wave3 与 FFmpeg 一并做。
 *
 * 8-bit 通路说明：上游对 lossless 会强制 quality=100 / qualityAlpha=-1 / subsample=3
 * （libavif 要求），此处保留同样的修正逻辑。
 */

import { initEmscriptenModule } from '../emscriptenUtils.js'
import avifEncFactory from './avif_enc.js'
import { defaultOptions } from './meta.js'

/**
 * 用编译好的 WebAssembly.Module 实例化 AVIF 编码器。
 * @param {WebAssembly.Module} wasmModule useWasmModule(compile:true) 的产物
 * @returns {Promise<object>} Emscripten 模块（带 encode 方法）
 */
export async function createAvifEncoder(wasmModule) {
  return initEmscriptenModule(avifEncFactory, wasmModule, {})
}

/**
 * 编码 ImageData 为 AVIF（8-bit）。
 * @param {object} encoder createAvifEncoder 的返回值
 * @param {ImageData} imageData
 * @param {object} [options] 覆盖默认参数（quality / speed / lossless 等）
 * @returns {Promise<ArrayBuffer>} AVIF 字节
 */
export async function encodeAvif(encoder, imageData, options = {}) {
  const _options = { ...defaultOptions, ...options }
  if (_options.lossless) {
    // 与上游一致：libavif 无损模式忽略并覆写这三项
    _options.quality = 100
    _options.qualityAlpha = -1
    _options.subsample = 3
  }
  const output = encoder.encode(
    new Uint8Array(imageData.data.buffer),
    imageData.width,
    imageData.height,
    _options
  )
  if (!output) throw new Error('AVIF encoding error.')
  return output.buffer
}
