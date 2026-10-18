/**
 * onnxruntime-node 空桩（仅浏览器构建用）。
 *
 * @xenova/transformers 在 src/backends/onnx.js 里无条件静态 import 了
 * onnxruntime-node（Node 原生包，含 platform-specific 二进制）。浏览器分支
 * 只用 onnxruntime-web，这个命名空间导入在运行时永远不会被求值，但 bundler
 * 必须能解析它——否则整个 node 包会被拖进前端 bundle。
 *
 * 配套 vite.config.js 里的 alias：
 *   'onnxruntime-node': src/vendor/onnxruntime-node-stub.js
 */
export default {}
