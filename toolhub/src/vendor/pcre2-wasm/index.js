/**
 * ToolHub 本地 facade：pcre2-wasm@10.49.2（PCRE2 10.49 编译到 WebAssembly）。
 *
 * 来源：npm `pcre2-wasm@10.49.2`（js/ 五个文件原样拷贝 + dist/pcre2.js 打补丁）。
 *
 * 为什么要 vendor：
 * 原包把 wasm 以「二进制字符串字面量」内嵌在 dist/pcre2.js（单文件 523KB，
 * 其中 453KB 是 wasm 载荷）里自加载——绕过 ToolHub 的下载/缓存/进度/取消链路。
 * 本副本：
 * 1. 抽出 wasm 到 public/wasm/pcre2.wasm（443KB），走 useWasmModule 带进度下载；
 * 2. 清空胶水中的内嵌载荷（findWasmBinary 变为 binaryDecode('')，死路径）；
 * 3. 仅通过 Module.instantiateWasm 注入我们下载+编译的 WebAssembly.Module
 *    （上游 glue 本身支持该注入点，与 @jsquash 的 initEmscriptenModule 同模式）。
 *
 * 用法：
 *   import { createPCRE2WithModule, parseFlags, FLAGS } from '@/vendor/pcre2-wasm/index.js'
 *   const { module } = await wasm.load()            // useWasmModule(compile:true)
 *   const pcre2 = await createPCRE2WithModule(module)
 *   pcre2.matchAll('\\d+', subject, parseFlags('i'))
 *
 * 已知限制（来自上游设计）：parseFlags 的 'g' 被静默忽略——stateless API
 * 每次调用独立编译，matchAll/replaceAll 由库内部循环完成，无需全局标志。
 */

import PCRE2Module from './pcre2_glue.js'
import { PCRE2 } from './pcre2.js'

export {
  FLAGS,
  MATCH_FLAGS,
  REPLACE_FLAGS,
  EXTRA_FLAGS,
  PCRE2Regex,
  parseFlags,
  PCRE2CompileError,
  PCRE2MatchError,
} from './pcre2.js'

/**
 * 用编译好的 WebAssembly.Module 创建 PCRE2 实例。
 * @param {WebAssembly.Module} wasmModule useWasmModule(compile:true) 的产物
 * @returns {Promise<PCRE2>} 与 import { createPCRE2 } from 'pcre2-wasm' 等价的实例
 */
export async function createPCRE2WithModule(wasmModule) {
  const mod = await PCRE2Module({
    // 上游 glue 契约：instantiateWasm(imports, callback)，callback 收 WebAssembly.Instance
    instantiateWasm: (imports, callback) => {
      const instance = new WebAssembly.Instance(wasmModule, imports)
      callback(instance)
      return instance.exports
    },
  })
  return new PCRE2(mod)
}
