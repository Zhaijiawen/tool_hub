/**
 * ToolHub OCR（Tesseract.js）主线程驱动。
 *
 * 职责边界：
 * - 本文件负责「worker 生命周期 + tesseract job 协议驱动」；
 * - wasm 字节 / 语言包字节的下载（进度、取消、Cache API 缓存）由调用方经
 *   useWasmModule 完成后再注入——本驱动不发起任何网络请求。
 *
 * 与上游 tesseract.js createWorker 的关系：上游主线程侧同样向 worker 发
 * load/loadLanguage/initialize/recognize 消息；此处不复用其主线程代码，
 * 而是按同一协议自实现（约 150 行），以便：
 *  - init 握手先于 load job（注入胶水工厂 + wasm 字节）；
 *  - 语言包以对象 { code, data } 注入，绕过上游的 CDN langPath 抓取；
 *  - 复用本站 useWasmModule 的下载/缓存体系。
 */

import { relaxedSimd, simd } from 'wasm-feature-detect';
import { toRaw } from 'vue';

/**
 * 去除 Vue reactive Proxy，使 payload 可被 worker.postMessage 结构化克隆。
 *
 * 背景：组件里 `selectedLangs` 等是 ref，其 `.value` 是 Vue reactive 代理对象。
 * 代理对象（Proxy）无法被 structured clone，直接传给 Worker 会抛
 * "Failed to execute 'postMessage' on 'Worker': [object Object] could not be cloned"。
 * 这里在「主线程→Worker」序列化边界统一去代理，避免任何调用方把响应式数据漏进 Worker。
 *
 * - 基本类型/null 原样返回；
 * - ArrayBuffer / TypedArray（图片/语言包字节）原样返回，绝不拷贝大块二进制；
 * - 数组逐元素去代理；
 * - 普通对象逐键去代理；
 * - 其它类型（Date/Map/类实例等）原样返回，避免破坏。
 */
function unproxy(value) {
  if (value === null || typeof value !== 'object') return value;
  const v = toRaw(value); // 非响应式对象 toRaw 原样返回
  if (Array.isArray(v)) return v.map(unproxy);
  if (ArrayBuffer.isView(v) || v instanceof ArrayBuffer) return v;
  if (v.constructor === Object || v.constructor === undefined) {
    const out = {};
    for (const k of Object.keys(v)) out[k] = unproxy(v[k]);
    return out;
  }
  return v;
}

/**
 * 可选语言（tesseract.js-data 4.0.0_best_int，LSTM-only，与 lstm 系 core 配对）。
 * size 为 .traineddata.gz 字节数（主线程按需下载，仅下载用户选中的语言）。
 */
export const OCR_LANGS = [
  { code: 'eng', size: 2952873 },
  { code: 'chi_sim', size: 1718768 },
  { code: 'chi_tra', size: 1656239 },
  { code: 'jpn', size: 2030256 },
  { code: 'kor', size: 1572336 },
  { code: 'deu', size: 1333102 },
  { code: 'fra', size: 707406 },
  { code: 'spa', size: 2100190 },
  { code: 'rus', size: 2679598 },
];

/** PSM（页面分割模式）选项，值为 tesseract PSM 常量 */
export const OCR_PSM_OPTIONS = [
  { value: '3', key: 'auto' },
  { value: '6', key: 'singleBlock' },
  { value: '7', key: 'singleLine' },
  { value: '8', key: 'singleWord' },
  { value: '11', key: 'sparseText' },
];

/** OEM：LSTM_ONLY（tesseract 5+ 默认，配 best_int 语言包） */
const OEM_LSTM_ONLY = 1;

/**
 * 探测本机支持的 core 变体（与 WebpAvifConvert 的 SIMD 探测同模式）：
 * relaxed SIMD > SIMD > 普通。胶水与 wasm 必须同变体配对。
 */
export async function detectTesseractVariant() {
  if (await relaxedSimd()) return 'relaxedsimd-lstm';
  if (await simd()) return 'simd-lstm';
  return 'lstm';
}

export class TesseractEngine {
  constructor() {
    this.worker = null;
    this.ready = false;
    this.jobCounter = 0;
    /** @type {Map<string, {resolve:Function, reject:Function}>} */
    this.pending = new Map();
    /** @type {((p:{status:string, progress:number}) => void)|null} */
    this.onProgress = null;
    this._initPromise = null;
    this._resolveInit = null;
    this._rejectInit = null;
  }

  /**
   * 启动 worker 并完成 init 握手（幂等）。
   * @param {{glue:string, wasm:ArrayBuffer}} opts glue=core 变体名；wasm=core wasm 字节
   */
  ensureReady({ glue, wasm }) {
    if (this.ready) return Promise.resolve();
    if (this._initPromise) return this._initPromise;
    this._initPromise = new Promise((resolve, reject) => {
      this._resolveInit = resolve;
      this._rejectInit = reject;
      const worker = new Worker(new URL('../workers/tesseract-worker.js', import.meta.url), {
        type: 'module',
      });
      worker.onmessage = (e) => this._handleMessage(e);
      worker.onerror = (e) => {
        const err = new Error(e.message || 'OCR worker error');
        this._rejectAll(err);
        this._rejectInit(err);
      };
      this.worker = worker;
      // useWasmModule 复用同一 ArrayBuffer，postMessage 转移会 detach 它，必须拷贝
      const wasmCopy = wasm.slice(0);
      worker.postMessage(
        unproxy({ type: 'toolhub:tesseract-init', glue, wasm: wasmCopy }),
        [wasmCopy],
      );
    });
    return this._initPromise;
  }

  _handleMessage(e) {
    const msg = e.data;
    if (!msg) return;
    if (msg.type === 'toolhub:tesseract-ready') {
      this.ready = true;
      this._resolveInit();
      return;
    }
    if (msg.type === 'toolhub:tesseract-error') {
      const err = new Error(msg.error || 'OCR worker init failed');
      this._rejectAll(err);
      this._rejectInit(err);
      return;
    }
    const { jobId, action, status, data } = msg;
    const key = `${action}-${jobId}`;
    const entry = this.pending.get(key);
    if (!entry) return;
    if (status === 'resolve') {
      this.pending.delete(key);
      entry.resolve({ jobId, data });
    } else if (status === 'reject') {
      this.pending.delete(key);
      entry.reject(new Error(typeof data === 'string' ? data : 'OCR job failed'));
    } else if (status === 'progress') {
      this.onProgress && this.onProgress({ ...data });
    }
  }

  _rejectAll(err) {
    for (const entry of this.pending.values()) entry.reject(err);
    this.pending.clear();
  }

  /** 发送一个 tesseract job；transfer 为需要转移的 ArrayBuffer 列表 */
  send(action, payload, transfer = []) {
    const jobId = ++this.jobCounter;
    return new Promise((resolve, reject) => {
      this.pending.set(`${action}-${jobId}`, { resolve, reject });
      this.worker.postMessage(
        { workerId: 'toolhub-ocr', jobId, action, payload: unproxy(payload) },
        transfer,
      );
    });
  }

  /**
   * 引导 core wasm 实例化，设置 worker 内的 TessModule。
   *
   * 关键时序：worker 端 TessModule 只在 `load` action 里被赋值
   * （Core({wasmBinary}).then(t => TessModule = t)）。loadLanguage 依赖
   * TessModule.FS 写语言包、initialize 依赖 new TessModule.TessBaseAPI()，
   * 因此 load 必须排在它们前面，否则 TessModule 为 undefined 会抛
   * "Cannot read properties of undefined (reading 'TessBaseAPI')"。
   * worker 端 load 对已存在的 TessModule 幂等（直接 resolve），重复调用无副作用。
   */
  async loadCore() {
    await this.send('load', {
      options: {
        lstmOnly: true,
        corePath: null,
        logging: false,
      },
    });
  }

  /** 注入语言包（对象形式，绕过 CDN 抓取；缓存适配器已 no-op） */
  async loadLanguages(langData) {
    const langs = langData.map((l) => ({ code: l.code, data: new Uint8Array(l.data.slice(0)) }));
    await this.send(
      'loadLanguage',
      {
        langs,
        options: {
          langPath: null,
          dataPath: null,
          cachePath: null,
          cacheMethod: 'none',
          gzip: true,
          lstmOnly: true,
        },
      },
      langs.map((l) => l.data.buffer),
    );
  }

  async initialize(langCodes) {
    await this.send('initialize', {
      langs: langCodes,
      oem: OEM_LSTM_ONLY,
      config: {},
    });
  }

  async setParameters(params) {
    await this.send('setParameters', { params });
  }

  /**
   * 完整识别一帧。
   * @param {ArrayBuffer} imageBuffer 原始图片字节（PNG/JPEG/BMP/WebP 等 leptonica 可读格式）
   * @param {string[]} langCodes 语言代码列表（如 ['eng'] 或 ['eng','chi_sim']）
   * @param {{code:string, data:ArrayBuffer}[]} langData 与 langCodes 对应的语言包字节
   * @param {string} [psm] 页面分割模式
   * @returns {Promise<{text:string, confidence:number}>}
   */
  async recognize(imageBuffer, langCodes, langData, psm) {
    await this.loadCore();
    await this.loadLanguages(langData);
    await this.initialize(langCodes);
    if (psm) await this.setParameters({ tessedit_pageseg_mode: String(psm) });
    const { data } = await this.send('recognize', {
      image: new Uint8Array(imageBuffer),
      options: {},
      output: { text: true },
    });
    return data;
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.ready = false;
    this._initPromise = null;
    this.pending.clear();
  }
}
