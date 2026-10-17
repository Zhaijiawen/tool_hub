/*
 * ToolHub vendored: tesseract.js setImage（已打补丁）。
 * 上游: tesseract.js@7.0.0 src/worker-script/utils/setImage.js (Apache-2.0)
 * 补丁：移除 bmp-js 中转分支（Node Buffer 依赖；leptonica 原生可读 BMP，已实证）。
 */
'use strict';

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 */
export default (TessModule, api, image, angle = 0) => {
  const exif = parseInt(image.slice(0, 500).join(' ').match(/1 18 0 3 0 0 0 1 0 (\d)/)?.[1], 10) || 1;

  /*
   * ToolHub patch: 上游在此用 bmp-js 中转 BMP（依赖 Node Buffer，浏览器 worker 不可用）。
   * 已实证 leptonica wasm 构建的 pixReadMem 可直接读取 BMP，故所有格式直接写字节。
   */
  TessModule.FS.writeFile('/input', image);

  const res = api.SetImageFile(exif, angle);
  if (res === 1) throw Error('Error attempting to read image.');
};
