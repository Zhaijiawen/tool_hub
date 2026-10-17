'use strict';

/*
 * ToolHub patch: tesseract.js worker-script 浏览器 getCore 适配器（重写）。
 * 上游: tesseract.js@7.0.0 src/worker-script/browser/getCore.js (Apache-2.0)
 *
 * 上游行为：global.importScripts(corePath) 从 CDN / 自定义 corePath 加载
 * Emscripten 胶水（胶水再自行抓取 .wasm）。
 *
 * 本 vendor 版本：
 *  - 胶水工厂由 Vite worker 入口（src/workers/tesseract-worker.js）从
 *    src/vendor/tesseract/core-glue/<variant>.js 动态 import 后注入到
 *    self.__toolhubTesseract.coreFactory（变体由主线程 wasm-feature-detect 选定）；
 *  - wasm 字节不在此处获取——worker-script 的 load handler 以
 *    Core({ wasmBinary }) 注入（主线程 useWasmModule 下载、带进度/可取消/缓存）；
 *  - 全程无 importScripts、无 CDN 抓取。
 */
export default async (lstmOnly, corePath, res) => {
  if (typeof globalThis.TesseractCore === 'undefined') {
    const injected = self.__toolhubTesseract;
    if (!injected || typeof injected.coreFactory !== 'function') {
      throw Error('Tesseract core glue was not injected by the worker entry');
    }
    res.progress({ status: 'loading tesseract core', progress: 0 });
    globalThis.TesseractCore = injected.coreFactory;
    res.progress({ status: 'loading tesseract core', progress: 1 });
  }
  return globalThis.TesseractCore;
};
