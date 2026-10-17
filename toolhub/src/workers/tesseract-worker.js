/**
 * ToolHub tesseract Worker 入口（Vite ESM worker）。
 *
 * 时序设计（关键）：
 * 1. 监听主线程的 init 握手消息 { type: 'toolhub:tesseract-init', glue, wasm }；
 * 2. 按主线程 wasm-feature-detect 选定的变体动态 import 对应胶水
 *    （src/vendor/tesseract/core-glue/<variant>.js，已剥离内嵌 wasm 载荷），
 *    把胶水工厂挂到 self.__toolhubTesseract.coreFactory；
 * 3. 动态 import 打过补丁的 worker-bundle（src/vendor/tesseract/worker_bundle.js），
 *    其内部注册 message 监听并装配适配器（getCore 读注入工厂、
 *    load handler 以 wasmBinary 注入主线程下载的 wasm 字节）；
 * 4. 回发 ready，此后主线程经 tesseract job 协议（load/loadLanguage/initialize/
 *    setParameters/recognize）驱动，进度/结果由 bundle 的监听器回传。
 *
 * 为什么不在 worker 里自己 fetch：主线程 useWasmModule 才承载
 * 下载进度 / 取消 / Cache API 缓存（用户要求的完整体验），字节经
 * postMessage 转移（core ~2.9MB + 语言包 ~0.7-3MB，一次性结构化克隆）。
 */

const GLUE_LOADERS = {
  'relaxedsimd-lstm': () => import('../vendor/tesseract/core-glue/relaxedsimd-lstm.js'),
  'simd-lstm': () => import('../vendor/tesseract/core-glue/simd-lstm.js'),
  lstm: () => import('../vendor/tesseract/core-glue/lstm.js'),
};

self.addEventListener('message', async (e) => {
  const data = e.data;
  if (!data || data.type !== 'toolhub:tesseract-init') return;
  try {
    const loader = GLUE_LOADERS[data.glue] || GLUE_LOADERS.lstm;
    const glueModule = await loader();
    self.__toolhubTesseract = {
      wasm: new Uint8Array(data.wasm),
      coreFactory: glueModule.default,
    };
    await import('../vendor/tesseract/worker_bundle.js');
    self.postMessage({ type: 'toolhub:tesseract-ready' });
  } catch (err) {
    self.postMessage({
      type: 'toolhub:tesseract-error',
      error: String(err && err.message ? err.message : err),
    });
  }
});
