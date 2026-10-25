/**
 * ToolHub libarchive Worker 入口。
 *
 * 时序设计（关键）：
 * 1. 顶层注册一次性 message 监听，等待主线程注入 wasm 字节；
 * 2. 收到字节后写入 globalThis.__toolhubWasmBinary，再动态 import 打过补丁的
 *    worker-bundle（其 `k(new S)` 补丁会读取该全局并作为 wasmBinary 注入）；
 * 3. worker-bundle 内部通过 comlink expose(A)——此时主线程 comlink 的 CONSTRUCT
 *    消息已在队列中等待，expose 注册监听后即刻被处理，握手时序安全。
 *
 * 为什么不在 worker 里自己 fetch wasm：主线程 useWasmModule 才承载
 * 下载进度 / 取消 / Cache API 缓存（用户要求的完整体验），字节经
 * postMessage 转移（一次性 980KB 结构化克隆，成本可忽略）。
 */

self.addEventListener(
  'message',
  (e) => {
    const data = e.data
    if (data && data.type === 'toolhub:wasm-binary') {
      globalThis.__toolhubWasmBinary = new Uint8Array(data.buffer)
      // 动态 import 触发 bundle 顶层同步 expose(A)；import resolve 即代表 comlink 已
      // 就绪。回传 ready 让主线程再发 CONSTRUCT，避免握手竞态：CONSTRUCT 在 expose 之前
      // 到达会被丢弃，导致主线程 proxy 握手永远挂起（表现为「处理中」卡死）。
      import('../vendor/libarchive/worker-bundle.js')
        .then(() => self.postMessage({ type: 'toolhub:archive-ready' }))
        .catch((err) => {
          console.error('[libarchive-worker] failed to load vendored worker-bundle:', err)
          self.postMessage({
            type: 'toolhub:archive-error',
            error: String((err && err.message) ? err.message : err)
          })
        })
    }
  },
  { once: true }
)
