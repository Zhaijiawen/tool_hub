'use strict';

/*
 * ToolHub vendored: tesseract.js log 工具（CJS -> ESM 转换）。
 * 上游: tesseract.js@7.0.0 src/utils/log.js (Apache-2.0)
 * 注意：上游的 `exports.logging` 为值导出（快照），ESM 无对应语义且无人引用，
 * 已移除；需要时用 getLogging()。
 */

let logging = false;

export const getLogging = () => logging;

export const setLogging = (_logging) => {
  logging = _logging;
};

export const log = (...args) => (logging ? console.log.apply(this, args) : null);
