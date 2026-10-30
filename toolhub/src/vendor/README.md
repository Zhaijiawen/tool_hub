# src/vendor — 第三方 WASM 胶水层（本地化副本）

本目录存放从 npm 包拷贝的 **wasm-bindgen / Emscripten 胶水代码**，目的是让 wasm 二进制
统一走 ToolHub 自己的加载链路（`src/composables/useWasmModule.js`）：
带进度下载 → Cache API 缓存 → 取消/重试，而不是让各库用 `new URL(..., import.meta.url)`
自行抓取（那会绕过进度条，并让 Vite 把一份用不到的死资产吐进 dist）。

升级某个库时：更新 package.json 依赖 → 重新拷贝对应胶水文件与 `public/wasm/` 二进制 →
核对下方"补丁"是否仍适用。**无 CI 自动重建，均为手动快照。**

## brotli-wasm/（来源：npm `brotli-wasm@3.0.1`，httptoolkit/brotli-wasm）

| 文件 | 来源 |
| --- | --- |
| `brotli_wasm.js` | `pkg.web/brotli_wasm.js`（wasm-bindgen --target web） |

- 二进制：`public/wasm/brotli_wasm_bg.wasm`（~1.0MB）
- 补丁：删除了 `init()` 无参时 `new URL('brotli_wasm_bg.wasm', import.meta.url)` 的
  默认回退，改为抛错——本副本必须由调用方传入字节（`InitInput` 类型本身支持 BufferSource）。
- 用法：`import brotliInit, { compress, decompress } from '@/vendor/brotli-wasm/brotli_wasm.js'`
  → `await brotliInit(bytes)` → `compress(buf, { quality })` / `decompress(buf)`

## zstd-wasm/（来源：npm `@bokuweb/zstd-wasm@0.0.27`，bokuweb/zstd-wasm）

| 文件 | 来源 |
| --- | --- |
| `zstd.js` | `dist/web/zstd.js`（Emscripten 运行时，导出 `Module`） |
| `module.js` | `dist/web/module.js`（`Module` + `waitInitialized`） |
| `errors/index.js` | `dist/web/errors/index.js` |
| `simple/compress.js` | `dist/web/simple/compress.js` |
| `simple/decompress.js` | `dist/web/simple/decompress.js` |
| `index.js` | **本地新增入口**：只暴露 `init(bytes)` + `compress` / `decompress` |

- 二进制：`public/wasm/zstd.wasm`（~246KB）
- 用法：`import { init, compress, decompress } from '@/vendor/zstd-wasm/index.js'`
  → `await init(bytes)` → `compress(buf, level)` / `decompress(buf, opts)`
- 已知限制：simple decompress 在帧内未嵌内容大小（contentSize=-1）时按
  `defaultHeapSize`（默认 1MB）分配；解压大于此且无内容大小的帧会失败，
  调用方应以更大 `defaultHeapSize` 重试（FileCompress.vue 已实现 64MB 重试）。

## jsquash/（来源：npm `@jsquash/webp@1.5.0` + `@jsquash/avif@2.1.1`，Squoosh App 移植，Apache-2.0）

| 文件 | 来源 |
| --- | --- |
| `emscriptenUtils.js` | `@jsquash/webp/utils.js`（`initEmscriptenModule`，各 jsquash 包该文件一致，共享一份） |
| `webp/webp_enc.js` | `@jsquash/webp/codec/enc/webp_enc.js`（Emscripten glue） |
| `webp/webp_enc_simd.js` | `@jsquash/webp/codec/enc/webp_enc_simd.js`（SIMD glue） |
| `webp/meta.js` | `@jsquash/webp/meta.js`（libwebp 默认参数） |
| `webp/index.js` | **本地 facade**：`createWebpEncoder(module, useSimd)` + `encodeWebp(encoder, imageData, opts)` |
| `avif/avif_enc.js` | `@jsquash/avif/codec/enc/avif_enc.js`（Emscripten glue） |
| `avif/meta.js` | `@jsquash/avif/meta.js`（libavif 默认参数） |
| `avif/index.js` | **本地 facade**：`createAvifEncoder(module)` + `encodeAvif(encoder, imageData, opts)` |

- 二进制：`public/wasm/webp_enc.wasm`（~275KB）、`public/wasm/webp_enc_simd.wasm`（~338KB）、
  `public/wasm/avif_enc.wasm`（~3.3MB）。三者按运行时探测只下载其中一个（webp 二选一）。
- 补丁：三个 glue 的 `new URL("*.wasm", import.meta.url).href` 回退均改为抛错，
  强制 wasm 以「编译好的 `WebAssembly.Module`」经 `initEmscriptenModule` 注入。
- 用法：`import { createWebpEncoder, encodeWebp } from '@/vendor/jsquash/webp/index.js'`
  → `createWebpEncoder(module, simd)` → `encodeWebp(encoder, imageData, { quality })`
- 与上游的差异：
  1. **glue 选择上抛**：上游 `init()` 内部用 `wasm-feature-detect` 的 `simd()` 自动选 glue；
     本站由组件先探测，再决定下载哪个 wasm 并传对应标志，保证字节与 glue 严格匹配。
  2. **avif 强制 ST**：上游在检测到 SAB（本站已开 COOP/COEP）时会改用 `avif_enc_mt.js`
     多线程 glue，需 pthread worker 文件，与 Vite 打包及主线程链路兼容性差；
     多线程 + Worker 化统一留待 Wave3 与 FFmpeg 一并做。

## pcre2-wasm/（来源：npm `pcre2-wasm@10.49.2`，PCRE2 10.49 → WASM）

| 文件 | 来源 |
| --- | --- |
| `pcre2_glue.js` | `dist/pcre2.js`（Emscripten MODULARIZE glue，**已打补丁**） |
| `pcre2.js` | `js/pcre2.js`（PCRE2 包装类，import 行已改为指向本地 glue） |
| `regex.js` | `js/regex.js`（PCRE2Regex 编译/匹配/替换实现） |
| `constants.js` | `js/constants.js`（FLAGS / MATCH_FLAGS / REPLACE_FLAGS / EXTRA_FLAGS / parseFlags） |
| `errors.js` | `js/errors.js`（PCRE2CompileError / PCRE2MatchError） |
| `utils.js` | `js/utils.js`（字符串 ↔ WASM 内存辅助） |
| `index.js` | **本地 facade**：`createPCRE2WithModule(wasmModule)` + 原样再导出 FLAGS/parseFlags/PCRE2Regex/错误类 |

- 二进制：`public/wasm/pcre2.wasm`（443KB，**从 glue 内嵌载荷抽取**，非 npm 独立文件）。
- 补丁：
  1. `findWasmBinary()` 内的二进制字符串字面量（约 453KB 载荷）清空为 `binaryDecode('')`——该路径变为死代码；
  2. wasm 改为经 `Module.instantiateWasm` 注入我们下载+编译的 `WebAssembly.Module`
     （上游 glue 原生支持该注入点，与 jsquash 的 `initEmscriptenModule` 同模式）；
  3. Node 分支短路：原 `if(ENVIRONMENT_IS_NODE){...await import("node:module")...}`
     整段替换为抛错。本站为纯浏览器产物，Node 路径永不执行；且 Vite 会静态解析
     `await import("node:module")` 并打 browser-external shim（构建 warning），
     补丁后警告消除、产物无 Node 内置模块引用。
- 抽取方法备忘（升级包时复用）：字面量以 `function findWasmBinary(){return binaryDecode('` 开头，
  扫描到第一个**未转义**闭引号为止（注意载荷内含 `\'` 与 `\\`，不能直接 `indexOf("')}")`，
  会误匹配到载荷中的 `\')}` 序列而切错位置——2026-10-17 首次抽取即踩此坑）；
  求值字面量后按 latin1 取字节，校验 magic `0061736d`。
- 用法：`import { createPCRE2WithModule, parseFlags } from '@/vendor/pcre2-wasm/index.js'`
  → `createPCRE2WithModule(module)` → `pcre2.matchAll(pattern, subject, parseFlags('i'))`
- 上游限制：`parseFlags('g')` 被静默忽略——库为 stateless API，matchAll/replaceAll 内部循环，无需全局标志。

## libarchive/（来源：npm `libarchive.js@2.0.2`，libarchive → WASM，Comlink + Web Worker 架构）

| 文件 | 来源 |
| --- | --- |
| `libarchive.js` | `dist/libarchive.js`（主入口，Comlink 客户端 + `Archive` 静态类，**已打补丁**） |
| `worker-bundle.js` | `dist/worker-bundle.js`（自包含 worker bundle：Emscripten glue + comlink expose，**已打补丁**） |

- 二进制：`public/wasm/libarchive.wasm`（980KB，从 `dist/` 拷贝）。
- 配套 worker 入口（非 vendor，属本项目代码）：`src/workers/libarchive-worker.js`。
- 补丁（4 处，均可用 `node /tmp/patch_libarchive.cjs` 思路复现；脚本已删，按下列文本替换）：
  1. **worker-bundle** `k(new S).then(...)` → `k(Object.assign(new S(),globalThis.__toolhubWasmBinary?{wasmBinary:globalThis.__toolhubWasmBinary}:{})).then(...)`
     ——把主线程经 postMessage 注入的字节作为 Emscripten `wasmBinary`（上游 glue 原生支持）；
  2. **worker-bundle** `N=new URL("libarchive.wasm",import.meta.url).href` → 抛错 IIFE
     ——消除 Vite 对该 URL 的静态解析（否则 980KB 死资产进 dist），且强制走注入路径；
  3. **主入口** `new Worker(e.workerUrl||new URL("./worker-bundle.js",import.meta.url),{type:"module"})` → workerUrl 缺省时抛错 IIFE
     ——同上，消除 61KB 死资产解析；本站一律经 `Archive.init({ getWorker })` 注入自有 worker；
  4. **worker-bundle** Node 分支 `if(h){const{createRequire:e}=await import("module");var m=e(import.meta.url),p=m("fs"),v=m("path");`
     → `if(h){throw new Error("...browser-only build");var m=null,p=null,v=null;`（分支后续语句保留但不可达）
     ——该动态 import 有 `ENVIRONMENT_IS_NODE` 守卫（浏览器恒 false），但会被 Vite 静态解析成
     browser-external shim（构建 warning）；与 pcre2 补丁 3 同理，短路消除 warning 与产物引用。
- 配套构建配置（**非 vendor，属项目配置**）：`vite.config.js` 增加 `worker: { format: 'es' }`。
  Vite worker 默认 IIFE 格式与项目 manualChunks 代码分割不兼容，会报
  `[vite:worker-import-meta-url] Invalid value "iife" for option "output.format"`，须显式改 ES。
- 注入链路：`useWasmModule` 下载/缓存/进度 → `Archive.init({ getWorker })` → 自有 worker 收字节 →
  动态 import 补丁 bundle → comlink 握手 → `Archive.open(file)` / `Archive.write({...})`。
- 已知取舍：字节经 postMessage 一次性转移（980KB 结构化克隆）；每次 `Archive.open/write` 创建新 worker，
  `close()`/write 结束时会 terminate。主线程loader 缓存命中时每次返回新 ArrayBuffer，转移安全。

## tesseract/（来源：npm `tesseract.js@7.0.0` + `tesseract.js-core@7.0.0`，naptha，Apache-2.0）

| 文件 | 来源 |
| --- | --- |
| `core-glue/relaxedsimd-lstm.js` | `tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js`（**已打补丁**，~90KB） |
| `core-glue/simd-lstm.js` | `tesseract.js-core/tesseract-core-simd-lstm.wasm.js`（**已打补丁**，~90KB） |
| `core-glue/lstm.js` | `tesseract.js-core/tesseract-core-lstm.wasm.js`（**已打补丁**，~90KB） |
| `worker-entry.js` | **本地 esbuild 入口**（替代上游 `src/worker-script/browser/index.js` 的适配器装配） |
| `worker-script/index.js` | `tesseract.js/src/worker-script/index.js`（**已打补丁 + CJS→ESM 转换**） |
| `worker-script/browser/getCore.js` | 同名上游文件（**重写**：改用注入的胶水工厂） |
| `worker-script/browser/gunzip.js` | 同名上游文件（CJS→ESM 转换，`zlibjs.gunzipSync`） |
| `worker-script/utils/setImage.js` | 同名上游文件（**已打补丁**：移除 bmp-js 分支） |
| `worker-script/utils/dump.js` `arrayBufferToBase64.js`、`worker-script/constants/defaultOutput.js`、`constants/{PSM,imageType}.js`、`utils/{getEnvironment,log}.js` | 同名上游文件（CJS→ESM 转换；log.js 的值导出 `exports.logging` 改为 `getLogging()`） |
| `worker_bundle.js` | **esbuild 产物**（`worker-entry.js` 打包，ESM 自包含，~86KB；升级需重跑下方命令） |

- 二进制：`public/wasm/tesseract-core-{relaxedsimd-lstm,simd-lstm,lstm}.wasm`（2.86/2.86/2.85MB，
  按 `wasm-feature-detect` 探测只下载其中一个）；语言包 `public/lang/{eng,chi_sim,chi_tra,jpn,kor,deu,fra,spa,rus}.traineddata.gz`
  （0.7–2.95MB，按用户选择下载，来源 `@tesseract.js-data/<lang>@1.0.0/4.0.0_best_int`）。
- **core-glue 补丁**（3 份同构）：
  1. **剥离内嵌载荷**：上游把 wasm 以 base64 字面量内嵌在 `wa??=Ga("AGFzbQ...")`（约 3.8MB，与独立
     `.wasm` 文件字节一致，已校验 md5）。剥离为 `wa=void 0` 后，`xa()` 的 `a==wa&&la` 分支生效——
     `Core({ wasmBinary })` 注入的字节（主线程 useWasmModule 下载、带进度/可取消/缓存）被采用。
     不注入时 glue 明确报错 `both async and sync fetching of the wasm failed`（无静默回退）。
  2. **Node 分支短路**（3 处）：fs 读取 / crypto randomFill / stdin 读取的 `if(ca){...}` 均改为
     `if(false){...}`。浏览器恒不走这些路径；短路同时消除打包器对 Node 内置模块的静态解析告警。
  3. **UMD → ESM**：尾部 `module.exports`/AMD 分支改为 `export default TesseractCore`，
     供 Vite worker 动态 import（原生 ESM import 该 UMD 文件拿不到导出）。
- **worker-script 补丁**（esbuild 输入侧）：
  1. `load` handler：`Core({ wasmBinary: self.__toolhubTesseract.wasm, ... })` 注入 core 字节；
  2. `initialize`：对象语言用 `l.code` 参与 `api.Init`（上游误用 `l.data`，会把整包 traineddata
     字节拼成语言字符串）；
  3. `dispatchHandlers`：忽略无 `action` 的消息（init 握手由 Vite worker 入口处理）；
  4. `getCore` 重写：不再 `importScripts` CDN 胶水，改用 worker 入口注入的工厂；
  5. `setImage`：移除 bmp-js 中转分支（依赖 Node Buffer；已实证 leptonica `pixReadMem` 可直接读 BMP）；
  6. CJS→ESM 全量转换（本仓库 package.json 为 `type: module`，CJS 胶水会被 esbuild 当作
     "module 变量当全局"处理，故一律转成真 ESM 再打包）。
- esbuild 重建命令（升级 tesseract.js 后重跑）：
  `node_modules/.bin/esbuild src/vendor/tesseract/worker-entry.js --bundle --format=esm --platform=browser --target=es2020 --outfile=src/vendor/tesseract/worker_bundle.js`
- 架构：主线程 `useTesseract.js`（TesseractEngine 驱动 load/loadLanguage/initialize/recognize job 协议）
  → `src/workers/tesseract-worker.js`（Vite ESM worker：init 握手 → 动态 import 对应变体 glue +
  worker_bundle）→ 识别在 worker 内进行。语言包以对象 `{code, data}` 注入，绕过上游 CDN langPath；
  idb-keyval 缓存适配器全部 no-op（下载/缓存统一由 useWasmModule 负责）。
- 已知取舍：上游 `createWorker` 主线程侧未复用（自实现约 150 行 driver），以便 init 握手先于
  load job 并完全复用本站下载缓存体系；每次识别重新 `loadLanguage` + `initialize`（引擎已加载时
  近乎瞬时），切换语言无需重建 worker。

## mupdf/（来源：npm `mupdf@1.28.1`，Artifex MuPDF → WASM，AGPL-3.0）

| 文件 | 来源 |
| --- | --- |
| `mupdf-wasm.js` | `dist/mupdf-wasm.js`（Emscripten 胶水，ESM，**已打补丁**） |
| `mupdf.js` | `dist/mupdf.js`（高层 API 包装层，**已打补丁**） |

- 二进制：`public/wasm/mupdf.wasm`（**9.9MB**，从 `dist/mupdf-wasm.wasm` 原样拷贝；上游另附
  `.br` 压缩版但需 brotli 协商，本站直接发原文件，靠 Cache API + immutable 缓存）。
- 配套 worker 入口（非 vendor，属本项目代码）：`src/workers/mupdf-worker.js`；
  主线程驱动：`src/composables/useMupdf.js`；工具组件：`src/components/document/PdfTools.vue`。
- 补丁（glue 2 处 + wrapper 3 处）：
  1. **glue `D()` 函数**：原 locateFile 缺失时回退 `new URL("mupdf-wasm.wasm", import.meta.url).href`
     ——会让 Vite 把 9.9MB 死资产吐进 dist。改为：注入 `wasmBinary` 时返回占位名
     （`E ??= D()` 在注入场景也会被无条件调用，但 `I(u,E,a)` 走注入分支不会 fetch 它）；
     既无 wasmBinary 又无 locateFile 时抛错。
  2. **glue Node 分支**：`const{createRequire:_}=await(import("module"))` 改为变量动态导入 +
     `@vite-ignore`——消除 Rollup 静态 externalize 告警；Node 下行为不变（本地 E2E 依赖它）。
  3. **wrapper 去顶层 await（关键）**：上游模块顶部有 2 处 TLA（`await libmupdf_wasm(...)`
     与 `await import("node:fs")`），与本站构建目标（默认 chrome87，不支持 TLA）冲突，
     直接构建报 `Top-level await is not available in the configured target environment`。
     已改为显式异步 `__initMupdf(wasmBinary)`：wasm 胶水初始化 + `_wasm_init_context`
     + **32 条原模块级求值语句**全部收拢其中——26 条类静态赋值（`Class._drop` ×21、
     `ColorSpace.Device*` 5 个单例）+ `PDFObject.Null = new PDFObject(null, 0)`
     + 6 个 scratch 堆指针（`_wasm_int/_wasm_point/_wasm_rect/_wasm_matrix/_wasm_color/_wasm_quad`，
     `const X = Malloc(...)` 改为 `let X = 0` 声明、分配移入 init）。Node fs 导入直接移除
     （本副本不走 Node 保存路径）。
     **排查教训**：仅扫描"顶层行内直接引用 libmupdf"会漏掉经 helper 的间接求值依赖
     （`Malloc()` 与 `new PDFObject()` 构造器），须以「模块加载期堆栈」逐步定位。
     延迟安全性依据：`Userdata` 构造器懒读 `ctor._drop`；所有函数内引用均在 init 后只读。
  4. **wrapper 调用方式**：`const mod = await import('./mupdf.js'); await mod.__initMupdf(bytes); const mupdf = mod.default`
     （上游为命名导出 + `export default { ... }` 对象，无 `_default` 变量可引用）。
- 注入链路（与 jsquash/pcre2/tesseract 同模式，利用上游原生 `wasmBinary` 支持
  `t.wasmBinary && (u = t.wasmBinary)`）：worker 入口收字节 → `__initMupdf(new Uint8Array(bytes))`
  → 胶水注入分支 → `mod.default` 取得完整 API。
- 用法（worker 内）：`const mod = await import('@/vendor/mupdf/mupdf.js'); await mod.__initMupdf(bytes); const mupdf = mod.default`
  → `mupdf.PDFDocument.openDocument(bytes, 'application/pdf')` / `new mupdf.PDFDocument()`
  → `page.toPixmap(mupdf.Matrix.scale(s,s), mupdf.ColorSpace.DeviceRGB, false, true)`
  → `pixmap.asPNG()` / `pixmap.asJPEG(90)`；`doc.graftPage(to, srcDoc, srcPage)`；
  `doc.saveToBuffer().asUint8Array()`；`page.toStructuredText(opts).asText()`。
- 已知取舍 / 注意：
  1. **wasm 9.9MB 是本站目前最大资产**（压缩版 3.5MB），一次性下载 + 缓存；下载期由
     WasmDownloadBar 展示进度，可取消。
  2. **视图即 WASM 堆内存**：`Buffer.asUint8Array()` 返回 `HEAPU8.subarray`，直接 postMessage
     转移会 detach 整个 wasm 内存——worker 内一律先 `copyBytes()` 复制再回传。
  3. mupdf 内部对不规范 PDF 会打 `format error` / `warning` 日志（慢速回退路径），worker 内
     以 `mupdf.setLog(() => {})` 静默。
  4. `PDFDocument.openDocument` 对加密文档返回可用对象，需显式 `needsPassword()` +
     `authenticatePassword(pw)`（返回权限位掩码，0 = 密码错误）。
  5. 授权：MuPDF 为 **AGPL-3.0**（Artifex 另有商业授权）。本站为纯前端开源工具站点形态，
     上线前需确认与 AGPL 的兼容策略（或联系 Artifex 商业授权）——**遗留合规待办**。

## sqlite-wasm/（来源：npm `@sqlite.org/sqlite-wasm@3.53.4-build2`，SQLite 官方 → WASM，Apache-2.0）

| 文件 | 来源 |
| --- | --- |
| `index.mjs` | `dist/index.mjs`（Emscripten 胶水 + SQLite API + OPFS VFS 异步初始化器，**已打补丁**） |
| `sqlite3-opfs-async-proxy.js` | 同名上游文件（OPFS VFS 的 counterpart worker，IIFE 自包含，**原样**） |

- 未 vendor：`dist/sqlite3-worker1.mjs`（635KB，Worker1/Promiser API，2026-04-15 起官方废弃，本站不用）。
- 二进制：`public/wasm/sqlite3.wasm`（**868KB**，从 `dist/sqlite3.wasm` 原样拷贝）。
- 配套 worker 入口（非 vendor，属本项目代码）：`src/workers/sqlite-worker.js`；
  主线程驱动：`src/composables/useSqlite.js`；工具组件：`src/components/data/SqliteTool.vue`。
- 补丁（2 处）：
  1. **胶水 `findWasmBinary()`**：原 `return new URL("sqlite3.wasm", import.meta.url).href;` —— 相对 URL
     回退会让 Vite 把 868KB 死资产吐进 dist。改为：**注入 `wasmBinary` 时返回占位名
     `"sqlite3.wasm"`**（`instantiateAsync` 有 `if (!binary)` 守卫，不会 fetch 该名；
     `getBinarySync` 的 `file == wasmBinaryFile && wasmBinary` 命中注入字节），未注入时抛错。
     *踩坑*：`wasmBinaryFile ??= findWasmBinary()` 是**无条件**调用的（与 mupdf 同样的坑），
     直接抛错会切断正向路径，必须走「有注入返占位名、无注入才抛错」。
  2. **`sqlite3Worker1Promiser.defaultConfig.worker()`**：原 `new Worker(new URL("sqlite3-worker1.mjs", import.meta.url), {type:"module"})`
     —— 废弃 API 的默认 worker 工厂，改为抛错（本站走自有 worker + oo1 API），
     同时避免 Vite 把 635KB 死资产 emit 进 dist。
- **保留未动的 `new URL("sqlite3-opfs-async-proxy.js", import.meta.url)`**（胶水 ~15559 行）：
  OPFS VFS 安装时用它 spawn counterpart worker（classic worker，SAB+Atomics 同步桥接），
  交给 Vite 的 asset 管线处理（dev 相对源码可用、build 落为 hashed asset，运行时再追加
  `?vfs=opfs` 查询参数）。这是 OPFS 持久化的必要组件，**不要按死资产清理**。
- 注入链路：`useWasmModule` 下载/缓存/进度 → `buffer.slice(0)` 转移 → worker
  `sqlite3InitModule({ wasmBinary })`（default 导出即 init，参数直接当 Emscripten `Module` 用）。
- 用法（worker 内）：
  ```js
  const { default: sqlite3InitModule } = await import('@/vendor/sqlite-wasm/index.mjs')
  const sqlite3 = await sqlite3InitModule({ wasmBinary })
  // OPFS 可用时（专用 worker + COOP/COEP 提供 SAB）：持久化库
  await sqlite3.oo1.OpfsDb.importDb('/name.sqlite3', bytes) // 校验文件头、强制关 WAL、失败清理
  const db = new sqlite3.oo1.OpfsDb('/name.sqlite3')
  // 降级：内存库（bytes 可选，经 capi 反序列化导入）
  const mem = new sqlite3.oo1.DB(':memory:', 'ct')
  sqlite3.capi.sqlite3_deserialize(mem.pointer, 'main', pData, n, n, 1 | 2) // FREEONCLOSE|RESIZEABLE
  // 查询 / 执行 / 导出
  db.selectObjects(sql, bindArray) // bind 必须是**数组**（传裸值会 falsy 导致不绑定）
  db.exec({ sql, rowMode: 'object', columnNames, resultRows }) // 多语句时只收首条 SELECT 的行
  sqlite3.capi.sqlite3_js_db_export(db.pointer) // → Uint8Array（内部 heap8u().slice() 副本，可安全转移）
  ```
- API 要点（实测踩坑）：
  1. `exec()` **不接受**数组形式的多语句混合，只接受单条 SQL 字符串或单个 `{sql, bind}` 对象；
     拼接多条语句用换行/分号写在同一个字符串里（内部 prepare 循环逐条执行）。
  2. `selectObjects(sql, bind)` / `selectValue(sql, bind)` 的 bind 是**单个数组参数**，
     传裸值（falsy）会导致参数不绑定 → `WHERE x > NULL` 恒空（已实证）。
  3. `wasm.scopedAlloc*` 需在 `wasm.scopedAllocPush()` 作用域内调用，否则抛
     `No scopedAllocPush() scope is active`。
  4. i64 参数（`sqlite3_deserialize` 的 szDb/szBuf）在 `bigIntEnabled` 下传普通 number 即可。
  5. sqlite-wasm 每条 SQL 都会打 `SQL TRACE` 日志，worker 内 `sqlite3.config.log(() => {})` 静默。
- OPFS 能力与降级：
  - `installOpfsVfs()` 经 `initializersAsync` **自动**安装，失败只 warn 不 fatal（Node/无 COOP/COEP
    环境自动降级为无 OPFS，`'opfs' in sqlite3 === false`，此时只有内存库可用）。
  - OPFS 库文件位于 OPFS 根目录（路径 `/name.sqlite3` → 根下同名文件），worker 内用
    `navigator.storage.getDirectory()` 直接枚举（只认 `.sqlite3/.sqlite3/.db` 后缀）与 `removeEntry` 删除。
  - `importDb` 会改写输出文件头字节 18-19（`[1,1]`）强制关闭 WAL，故主文件即完整数据，
    导出可直接读文件字节（本站统一用 `sqlite3_js_db_export`，对内存库同样有效，更稳）。
- 已知取舍：sql.js 已被本方案取代（无 OPFS、无官方持久化、wasm 手工拼装）；
  Worker1/Promiser API 按官方声明 actively discouraged，本副本未纳入。

## ffmpeg/（来源：npm `@ffmpeg/core@0.12.10`（FFmpeg 5.1 → WASM）+ `@ffmpeg/ffmpeg@0.12.15`，LGPL-2.1+）

| 文件 | 来源 |
| --- | --- |
| `ffmpeg-core.js` | `@ffmpeg/core/dist/esm/ffmpeg-core.js`（Emscripten 胶水 + FFmpeg 高层 API，**已打补丁**） |

- **未 vendor**：上游 `@ffmpeg/ffmpeg` 的主线程 `FFmpeg` 类与 worker —— 本站不用该路线（原因见下）。
- 二进制：`public/wasm/ffmpeg-core.wasm.gz`（gzip 压缩存储，约 **10MB**；运行时由
  `useWasmModule` 的 `decompress:'gzip'` 用浏览器原生 `DecompressionStream` 解压为原始
  32MB wasm）。**之所以压缩**：原始 32.2MB 超过 Cloudflare Pages 单文件 25MB 部署上限，
  压成 ~10MB 既能过部署，又把用户实际下载量从 32MB 降到 10MB。同法也用于 pandoc
  （`public/wasm/pandoc.wasm.gz`，约 16MB；由 `scripts/fetch-pandoc-assets.mjs`
  从 `node_modules/pandoc-wasm` 压缩生成，未提交 git）。
- 重新生成 ffmpeg 快照：`@ffmpeg/core@0.12.10` 取 `dist/esm/ffmpeg-core.wasm`，
  `gzip -9` 后落到 `public/wasm/ffmpeg-core.wasm.gz` 即可。**无 CI 重建，手动快照**。
- 配套 worker 入口（非 vendor，属本项目代码）：`src/workers/ffmpeg-worker.js`；
  主线程驱动：`src/composables/useFfmpeg.js`；工具组件：`src/components/media/MediaTool.vue`。
- **架构决策：自建单层 worker（不用上游 FFmpeg 类）**
  上游 `FFmpeg` 类会 spawn 自己的 worker 并**自行 fetch core wasm**，绕过 `useWasmModule`
  的进度条 / 取消 / Cache API 缓存——直接违背「所有 WASM 异步按需下载并展示进度、可取消」。
  故与 OCR / PDF / SQLite 一致：主线程下载 → `buffer.slice(0)` 转移 → worker 内
  `import` 补丁后的胶水 → `createFFmpegCore({ wasmBinary })`，ffmpeg 命令在 worker 内构造
  （组件只传结构化选项，不接触命令行参数）。
- 补丁（1 处）：
  `_locateFile` 的 `.wasm` 分支 `return wasmURL` → `return Module["wasmBinary"] ? "ffmpeg-core.wasm" : wasmURL`
  —— 注入场景返回占位名，使 `getBinary(file)` 的 `file == wasmBinaryFile && wasmBinary`
  命中注入字节，不触发任何 fetch。**注意**：本胶水的 `Module["locateFile"]` 被**无条件**
  赋值为 `_locateFile`，故顶层 `new URL("ffmpeg-core.wasm", import.meta.url)` 分支是死代码，
  不会像 tesseract/pcre2 那样被 Vite 解析成死资产。
- **胶水特性（与前几个库的关键差异，实测结论）**
  1. **必须在专用 worker 内运行**：硬编码 `ENVIRONMENT_IS_WORKER=true` / `ENVIRONMENT_IS_NODE=false`
     （**无 Node 分支可短路**，故不需要 mupdf/sqlite 那种环境补丁）。主线程会因 `self` 未定义崩溃
     —— worker 化是必需而非可选。
  2. **`ffprobe` 不可用**：无参调用返回 -1，带参写 JSON 文件直接 abort。
  3. **ffmpeg 自身 stderr 不经过胶水 logger**：`exec`/`ffprobe` 内 `catch` 掉 Aborted 只返回 `ret`，
     日志缓冲里通常只有 `Aborted()`。**故不能用错误文本判定失败原因**——
     改为按「命令 + 选项组合」映射错误码（音频提取失败即视为无音轨）；
     `extractError()` 会过滤掉 `Aborted()` 这类无信息量内容，避免把垃圾文案抛给用户。
  4. **读不到媒体时长/分辨率**（那些只在 stderr）→ probe job 只能给容器信息
     （`-f ffmetadata`）与文件大小；**UI 不得谎报时长**。转码进度只能是**不确定进度条**
     （`exec` 是同步阻塞的，且总时长未知），不得显示假百分比。
  5. `setProgress` 的 progress 实测**会返回负数**（ffmpeg time 是微秒基准差值，如 -900098），
     必须钳制后再上报，否则进度条跳负。
  6. FS 是 Emscripten MEMFS（全内存）：每个 job 结束**必须删输入/输出**，
     否则与 32MB wasm 同进程累积（大视频产物可达百 MB）。
  7. 文件名入 MEMFS 前过 `safePath()`（取 basename + 白名单字符），规避路径穿越。
- 实测能力（Node + worker shim 实证）：
  `-f lavfi` 合成带音轨视频 → 转码 mp4(+scale) / webm / 音频提取 mp3 / 转 GIF（palettegen+paletteuse）
  全部 `ret 0` 且产物字节合法；`-f null -` 可作文件类型校验（文本文件正确返回非 0）；
  空字节不注入时明确 `fetch failed`（无静默回退）。ffmpeg 5.1.4 含 libx264/x265/vpx/
  mp3lame/aac/vorbis/opus/webp/theora/ass。
- 授权：FFmpeg 为 **LGPL-2.1+**（core 构建带 `--enable-gpl --enable-libx264`，
  x264 本身是 GPL-2.0+，整体按 GPL 处理）。与 MuPDF 的 AGPL-3.0 不同，
  LGPL/GPL 在纯前端静态分发的合规压力较小，但**仍需上线前确认**（已记此备忘）。

## hash-wasm/（来源：npm `hash-wasm@4.12.0`，Dani Biro，Rust→WASM，MIT）

| 文件 | 来源 |
| --- | --- |
| `md5.js` `sha1.js` `sha256.js` `sha512.js` | `dist/<algo>.umd.min.js`（**已打补丁**，各约 5.9KB） |

- 二进制：`public/wasm/{md5,sha1,sha256,sha512}.wasm`（**3.5/5.6/9.7/13.5KB，合计 32KB**，从上游 glue 内嵌 base64 抽取）。
- 用途：给 `other/FileHash.vue` 提供**流式**文件哈希（GB 级文件，见下）。
- **为什么 vendor（而非直接 `import('hash-wasm/xxx')`）**：
  1. 上游**只提供 UMD 产物**（`dist/<algo>.umd.min.js`），无按算法的 ESM 入口，
     且 package.json **无 exports 字段** → 子路径 `hash-wasm/md5` 无法解析（实测构建报错）；
  2. 更关键：直接 import 时 **Rollup 会把 UMD 当 CJS 处理，其内部数据被丢弃**——
     构建产物里 `createSHA256` 函数在，但**内嵌 base64 载荷消失**，
     运行时 `WebAssembly.compile()` 会拿到空 BufferSource 而失败。
     这类问题构建期不报错、只在运行时暴露，故必须 vendor 后逐字节验证。
- 补丁（每个算法 1 处，共 4 处）：
  `if(!MAP.has(A.name)){const V=DECODE(A.data),W=WebAssembly.compile(V);MAP.set(A.name,W)}`
  → `const V = self.__toolhubHashWasm && self.__toolhubHashWasm["<algo>"] || DECODE(A.data)`
  —— 优先取主线程 loader 下载的字节（带进度/取消/Cache 缓存），未注入才回退内嵌载荷。
  同时**剥离内嵌 base64 载荷**（`data:"..."` 清空），vendor 体积从 66KB 降到 23KB。
- **反向验证**：不注入时明确失败 `WebAssembly.compile(): BufferSource argument is empty`
  —— 不会静默产出错误哈希值（这是校验工具最不能接受的失败模式）。
- 用法（浏览器组件内）：
  ```js
  const bytes = { /* 四个 wasm 的 Uint8Array，经 useWasmModule 下载 */ }
  globalThis.__toolhubHashWasm = bytes
  const { createSHA256 } = (await import('@/vendor/hash-wasm/sha256.js')).default ?? mod
  const h = await createSHA256()   // 工厂是**异步**的（内部编译 wasm）
  for (let off = 0; off < file.size; off += CHUNK) {
    h.update(new Uint8Array(await file.slice(off, off + CHUNK).arrayBuffer()))
  }
  h.digest()   // ← 注意：**没有 hex() 方法**，digest() 直接返回 hex 字符串
  ```
- **API 坑（实测）**：
  1. 导出是**具名对象** `{ createSHA256, sha256 }`，不是默认导出函数；
  2. `createXXX()` 返回 **Promise**（内部要编译 wasm），须 await；
  3. **没有 `hex()` 方法** —— `digest()` 的返回值就是 hex 字符串（旧示例里的 `.digest().hex()` 会报 undefined）；
  4. 工厂名是 `createMD5` / `createSHA1` / `createSHA256` / `createSHA512`（注意 `MD5` 全大写，
     由 `create${name[0].toUpperCase()}` 拼出的是 `createMd5`，**不匹配**）；
  5. 四个算法共用一个 `r`/`MAP` 缓存 Map（模块级），但实例互相独立，可并发。
- 正确性实证（Node E2E，与原生 `crypto` 逐字节比对，全部 MATCH）：
  2MB 分块 / 1 字节分块 ×1000 / 空输入 / 非 2 的幂次分块（3876543 字节）/
  3MB+777 字节任意分块 —— 四种算法在以上全部场景与 Node `crypto.createHash` 结果一致。
  性能：MD5 ~455MB/s、SHA-1 ~714MB/s、SHA-256 ~312MB/s、SHA-512 ~500MB/s
  （即 **1GB 文件约 1–3 秒**）；**100MB 文件流式哈希堆内存增量仅约 0.6MB**。


