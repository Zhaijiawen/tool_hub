/*
 * ToolHub vendored: tesseract.js worker-script 打包入口（esbuild 输入文件，ESM）。
 *
 * 由 esbuild 打包为 src/vendor/tesseract/worker_bundle.js（ESM，自包含），
 * 供 Vite worker 入口（src/workers/tesseract-worker.js）在收到主线程注入的
 * wasm 字节 / 语言包字节后动态 import。
 *
 * 与上游 src/worker-script/browser/index.js 的差异：
 *  - 消息监听改用 globalThis.addEventListener；
 *  - 缓存适配器（idb-keyval）全部 no-op：traineddata 的下载与缓存由主线程
 *    useWasmModule（Cache API）负责，worker 内不二次缓存；
 *  - fetch 适配器 no-op：语言包以对象形式 { code, data } 注入，不走网络。
 */

import { setAdapter, dispatchHandlers } from './worker-script/index.js';
import getCore from './worker-script/browser/getCore.js';
import gunzip from './worker-script/browser/gunzip.js';

setAdapter({
  getCore,
  gunzip,
  fetch: () => {},
  readCache: () => Promise.resolve(),
  writeCache: () => Promise.resolve(),
  deleteCache: () => Promise.resolve(),
  checkCache: () => Promise.resolve(false),
});

globalThis.addEventListener('message', ({ data }) => {
  dispatchHandlers(data, (obj) => postMessage(obj));
});

// 占位导出：本 bundle 的副作用（注册监听 + 适配器）即全部所需行为
export const startTesseractWorker = () => {};
