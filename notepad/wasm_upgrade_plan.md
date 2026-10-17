# ToolHub WASM 升级计划

> 目标：用 WebAssembly 升级现有工具 + 引入一批"原来只能桌面端、现在 Web 也能做"的新工具（如 FFmpeg）。
> 约束：站点 100% 前端、托管 Cloudflare Pages；所有 WASM 异步按需下载并展示进度、可取消/继续；所有 WASM 工具带标识；全部 UI/i18n；文档后置统一补。
> 选型原则：**轻量化 / 性能好 / 不可替代性**（浏览器原生做不到，或 JS 方案有数量级差距）。

---

## 0. 结论先行（TL;DR）

- **升级现有工具**：约 10 个候选，但按"不可替代性"筛选后，**高价值仅 3 个**（EXIF 读写/擦除、图片现代格式 WebP/AVIF/MozJPEG、大文件 Hash 流式），其余多为纯 JS→WASM 的性能打磨，列为 P2/P3。
- **新增 WASM 工具**：按不可替代性挑出 **13 个**，分三波（轻量 → 中量 → 重型）。
- **架构**：建一个统一 `useWasmModule` 加载器（Cache API 缓存 + fetch 流式进度 + AbortController 取消 + 可续传），全局下载进度条，重计算进 Web Worker，配 COOP/COEP。
- **标识**：工具卡片 / 工具页标题加 "WASM" 小标签（n-tag）。
- **分类**：新增 3 个顶级分类（媒体 / 文档 / 数据），压缩归档暂挂"其他"；若顶栏过挤再引入"更多"溢出菜单。
- **文档**：功能完成后按 CLAUDE.md 的 6 文件规范统一补，本计划只做计划记录。

---

## 1. 现状盘点（有据可查）

依据 `toolhub/package.json`、`src/api/tools.js`、`vite.config.js`：

| 领域 | 当前实现 | 是否 WASM | 说明 |
| --- | --- | --- | --- |
| Argon2 | `argon2` (^0.43.0) | ✅ 已是 WASM | 该 npm 包即 argon2-browser，已是 wasm |
| bcrypt | `bcryptjs` (^3.0.2) | ❌ 纯 JS | 可升级 bcrypt-wasm 提速 |
| SHA/MD5/文件哈希 | `crypto-js` + `spark-md5` | ❌ 纯 JS | 可升级 hash-wasm（流式，利好大文件） |
| 二维码 | `qrcode` + `jsqr` | ❌ 纯 JS | 可升级 qr-code-generator-wasm（矢量） |
| Cron | `cron-parser` + `cronstrue` | ❌ 纯 JS | 可升级 cron-parser-wasm |
| Diff | `diff` (^9) | ❌ 纯 JS | 可升级 diff-match-patch-wasm |
| JSONPath | `jsonpath-plus` | ❌ 纯 JS | 可升级 jsonpath-wasm |
| XML | `fast-xml-parser` | ❌ 纯 JS | 已很快，升级收益低 |
| YAML | `js-yaml` | ❌ 纯 JS | 格式化目前部分走后端 `/api/format` |
| EXIF | `exifr` (^7) | ❌ 纯 JS，**只读** | 升级 exiftool-wasm 可获得**写/擦除**能力 |
| 图片处理 | `browser-image-compression`(Canvas) | ❌ 浏览器 API | **无法**产出 WebP/AVIF、无法 MozJPEG 质量调优 |
| 压缩/解压 | 无 | — | 浏览器仅 `DecompressionStream`(解压 gzip/deflate/br)，**无压缩、无 zstd/7z/rar** |
| OCR / PDF / 音视频 / 文档转换 / SQLite | 无 | — | 完全缺失，属**全新能力** |

> 部署：`public/_redirects` 存在（SPA 回退），**无 `_headers`**——需新增（见 §8）。`vite.config.js` 已为 argon2/bcrypt 单独分包。

---

## 2. 现有工具 WASM 升级（UPGRADE）

按"不可替代性 / 收益"分级。**原则：浏览器原生或现有 JS 已够用的，不做无谓升级。**

### 2.1 高价值升级（带来 JS 做不到的新能力）—— 建议 P1
| 现有工具 | 当前 | 建议 WASM | 体积 | 关键收益 | 理由 |
| --- | --- | --- | --- | --- | --- |
| 图片 EXIF `image.exif` | exifr 只读 | ~~exiftool-wasm~~ → **piexifjs（纯 JS）** | **85KB** | 读取 + **写入/擦除** GPS、批量元数据 | exifr 只能读；擦除隐私元数据是刚需。**注：原设想的 exiftool-wasm 在 npm 上不存在（404），exiftool-vendored 是 Node 专用包**，故改用 piexifjs ✅ 已完成 |
| 图片转换 `image.convert` | Canvas | **libwebp-wasm + mozjpeg-wasm + libavif-wasm** | ~1.0/1.1/1.8MB | 输出 **WebP/AVIF**、MozJPEG 高质量压缩 | 浏览器 Canvas 无法编码这些现代格式，**不可替代** |
| 文件哈希 `other.fileHash` | crypto.subtle + spark-md5（整读） | **hash-wasm（流式）** | **32KB** | **4MB 分块流式，内存与文件大小无关，支持 GB 级 + 可取消** | Web Crypto 的 `subtle.digest()` **不支持流式**，只能整文件进内存；旧实现还并发调 3 次 digest，1GB 文件产生约 4GB 峰值 ✅ 已完成 |
| 压缩解压 `other.fileCompress` | gzip 整读 + brotli/zstd 整读 | **gzip 改原生流式**（brotli/zstd 加体积防护） | — | **gzip 支持 GB 级流式 + 进度 + 取消**；brotli/zstd 2GB 上限保护 | gzip 走 `CompressionStream` 是**唯一真流式**的；brotli/zstd 的 wasm 绑定只有 whole-buffer API，流式化需自写分块 FFI（成本高，按用户原则不做） ✅ 已完成（gzip 部分） |
| 归档 `other.archive` | libarchive 整包展开 | 分级体积防护 | — | >2GB 禁用 + >1GB 警告 | libarchive 在 wasm 内存中展开，改流式需重写 VFS 层，成本高不做 ✅ 已完成（防护部分） |

### 2.2 性能型升级（同能力，WASM 更快）—— P2，视资源插入
| 现有工具 | 当前 | 建议 WASM | 体积 | 收益 |
| --- | --- | --- | --- | --- |
| bcrypt `encrypt.bcrypt` | bcryptjs | bcrypt-wasm | ~100KB | 哈希快 ~3-5x |
| 正则 `convert.regex` | JS 引擎 | pcre2-wasm | ~500KB | 支持 JS 正则缺失的高级特性（占有符量词等） |
| Cron `convert.cron` | cron-parser | cron-parser-wasm | ~60KB | 推演更快 |
| 二维码 `other.qrcode` | qrcode(JS) | qr-code-generator-wasm | ~80KB | 矢量 SVG 输出 |
| JSONPath `text.jsonPath` | jsonpath-plus | jsonpath-wasm | ~180KB | 大 JSON 查询更快 |
| 文本 Diff `convert.diff` | diff(JS) | diff-match-patch-wasm | ~120KB | 大文本 diff 更快 |
| XML `format.xml` | fast-xml-parser | fast-xml-parser-wasm | ~120KB | 巨型 XML 更快（收益有限） |

### 2.3 不做升级（避免过度工程）
- **uuid / base64 / sha 常规**：浏览器原生（crypto.randomUUID / atob / crypto.subtle）已足够快，WASM 无可感知收益——**不替换**。
- **YAML 格式化**：可用 yaml-wasm 摆脱后端依赖（契合"100% 前端"），但属独立议题，见 §11 待拍板。

---

## 3. 新增 WASM 工具（NEW）—— 按"不可替代性"精选 13 个

> 已剔除浏览器原生可做、或可用现有工具覆盖的项。分三波，波次即优先级。

### Wave 1 · 轻量高价值（< 2MB，先落地）— P1
| 新工具 | WASM | 体积 | 能力 | 拟归分类 | 状态 |
| --- | --- | --- | --- | --- | --- |
| **PNG 无损压缩** | oxipng-wasm | ~150KB | 极限 PNG 瘦身 | 图片 | ✅ 已完成（2026-10-17，`@jsquash/oxipng`） |
| **SVG 优化** | svgo-wasm | ~1.1MB | 剔除冗余、压缩 SVG | 图片 | ❌ **跳过**：npm 无 `svgo-wasm`（404）；`@resvg/resvg-wasm` 是 napi-rs 原生绑定非浏览器 wasm；svgo 纯 JS 已是行业标准且快，无可靠 wasm 版，属"不做无谓升级" |
| **文件压缩/解压（zstd/brotli/gzip）** | zstd-wasm + brotli-wasm | ~1.35MB | 前端压缩（浏览器只会解压 gzip/deflate） | 其他 | ✅ 已完成（2026-10-17，`@bokuweb/zstd-wasm` 246KB + `brotli-wasm` 1.0MB；gzip 走原生 CompressionStream 免下载） |
| **WebP/AVIF 转换** | libwebp-wasm + libavif-wasm | ~2.8MB | 现代图片格式（见 2.1，可合并为"图片转换"增强或独立） | 图片 | ✅ 已完成（2026-10-17，`@jsquash/webp@1.5.0` + `@jsquash/avif@2.1.1`，实际按需下载：WebP 275/338KB、AVIF 3.3MB；组件 `components/image/WebpAvifConvert.vue`，路由 `/image/webp-avif-convert`） |
| **PCRE2 正则** | pcre2-wasm | ~443KB | 高级正则（见 2.2，可作独立"高级正则"） | 转换 | ✅ 已完成（2026-10-17，`pcre2-wasm@10.49.2`；组件 `components/convert/Pcre2Regex.vue`，路由 `/convert/pcre2-regex`；wasm 从胶水内嵌载荷抽出为 `public/wasm/pcre2.wasm`） |

### Wave 2 · 中型刚需（2–6MB，第二梯队）— P2
| 新工具 | WASM | 体积 | 能力 | 拟归分类 | 状态 |
| --- | --- | --- | --- | --- | --- |
| **归档解压/压缩** | libarchive.js | 980KB | 解 `.7z/.rar/.tar.gz/.zip` + 打包（浏览器无原生） | 其他 | ✅ 已完成（2026-10-17，`libarchive.js@2.0.2`，组件 `components/other/ArchiveTool.vue`，路由 `/other/archive`） |
| **图片转文字 OCR** | tesseract.js | ~3.2MB + 语言包 | 离线识别图片文字（语言包按需） | 图片 | ✅ 已完成（2026-10-17，`tesseract.js@7.0.0` + `tesseract.js-core@7.0.0`；组件 `components/image/OcrTool.vue`，路由 `/image/ocr`；驱动 `composables/useTesseract.js`，worker 入口 `workers/tesseract-worker.js`；core 三变体 2.85–2.86MB + 9 种语言包 0.7–2.95MB 按需下载；详见 §12.1） |
| **PDF 工具集** | mupdf-wasm / pdf.js | 9.9MB（压缩 3.5MB） | PDF→图片、合并、拆分 | 文档 | ✅ 已完成（2026-10-17，`mupdf@1.28.1`；组件 `components/document/PdfTools.vue`，路由 `/document/pdf-tools`；驱动 `composables/useMupdf.js`，worker 入口 `workers/mupdf-worker.js`；新增「文档」顶级分类；详见 §12.1） |
| **SQLite 数据库** | @sqlite.org/sqlite-wasm | 868KB | 浏览器跑 SQL、加载 .db（OPFS 持久化） | 数据 | ✅ 已完成（2026-10-17，`@sqlite.org/sqlite-wasm@3.53.4-build2`，组件 `components/data/SqliteTool.vue`，路由 `/data/sqlite`；驱动 `composables/useSqlite.js`，worker 入口 `workers/sqlite-worker.js`；新增「数据」顶级分类；详见 §12.1） |
| **文档格式互转** | pandoc-wasm | **58.6MB** | MD↔DOCX↔HTML↔LaTeX | 文档 | ❌ 跳过（体积超标 12 倍，违反轻量化原则；包为 pandoc 官方，若未来拆分为按需格式子集可重评） |

### Wave 3 · 重型旗舰（> 5MB，需 Worker + 明确进度）— P3
| 新工具 | WASM | 体积 | 能力 | 拟归分类 |
| --- | --- | --- | --- | --- |
| **FFmpeg 音视频** | @ffmpeg/core + 自建 worker | 32.2MB（gzip 9.7MB） | 视频转码、音频提取、转 GIF（**旗舰，用户点名**） | 媒体 | ✅ 已完成（2026-10-17，`@ffmpeg/core@0.12.10` FFmpeg 5.1 + `@ffmpeg/ffmpeg@0.12.15`；组件 `components/media/MediaTool.vue`，路由 `/media/media-tool`；驱动 `composables/useFfmpeg.js`，worker 入口 `workers/ffmpeg-worker.js`；**新增「媒体」顶级分类**；详见 §12.1） |
| **语音听写** | whisper-wasm | ~15MB | 本地语音→文字 | 媒体 |
| **Python 运行环境** | pyodide | ~20MB（实测 11.9MB） | 标准库模式 Python 执行 | 数据 | ✅ 已完成（2026-10-17，`pyodide@0.28.3`（CPython 3.13），组件 `components/data/PythonTool.vue`，路由 `/data/python`；驱动 `composables/usePyodide.js`，worker 入口 `workers/pyodide-worker.js`；**标准库模式，不含科学栈**，详见 §12.1） |
| **大数据分析** | duckdb-wasm | ~15MB | 秒级分析百 MB 级 CSV/Parquet（可反哺 csv-viewer） | 数据 |

---

## 4. 统一 WASM 加载架构（核心，满足需求 4）

新建 `src/composables/useWasmModule.js` + `src/components/common/WasmDownloadBar.vue`。

### 4.1 加载器职责
```
useWasmModule(id, { url, threads=false, cacheable=true })
  → status: 'idle' | 'downloading' | 'compiling' | 'ready' | 'error'
  → progress: 0-100
  → load():    开始/继续（命中缓存则瞬时 ready）
  → cancel():  AbortController 中止，丢弃本次
  → instance:  实例化后的 WASM 模块
```
- **缓存优先**：先查 Cache API（`caches.open('toolhub-wasm-v1')`）。命中 → 直接 `instantiate`，秒开、无进度条。
- **流式进度**：`fetch(url,{signal})` → 读 `response.body` ReadableStream，结合 `Content-Length` 计算百分比。
- **取消/继续**：`cancel()` 调 `AbortController.abort()`；再次 `load()` 重新发起。**完成后的字节写入 Cache API**，跨会话复用——即"继续"最终表现为二次打开瞬时完成。
- **可续传（增强，仅 >15MB 如 FFmpeg）**：HTTP Range + IndexedDB 分片存盘，实现断点续传；小模块不必做。
- **instantiateStreaming**：仅在服务端返回 `Content-Type: application/wasm` 时用（配 §8 `_headers`），否则退化为 `compile(arrayBuffer)`。

### 4.2 全局下载指示（满足"打开页面后提示进度、可取消/继续"）
- 模块级 `reactive` 全局注册表 `wasmRegistry: Map<id,{name,status,progress}>`（仿现有 `useTheme`/`useFavorites` 的模块级 ref 模式）。
- `WasmDownloadBar` 挂载于 `AppLayout`：任一面触发下载即在底部/顶部弹出 `n-progress` + 名称 + 「取消」按钮；完成后自动收起。错误态给「重试」。

### 4.3 重计算进 Web Worker（满足性能、避免卡 UI）
- Hash 大文件、oxipng、tesseract、duckdb、ffmpeg 等 CPU 密集 → 放 Web Worker，主线程只传 `postMessage` + 进度回传。
- 多线程（ffmpeg/oxipng 的 SharedArrayBuffer）需 COOP/COEP，见 §8。

---

## 5. WASM 标识（满足需求 3）

- 组件：`src/components/common/WasmTag.vue`，`<n-tag size="tiny" :bordered="false">` + 立方/闪电图标 + "WASM"。
- i18n：`common.wasm.label = 'WASM'`；tooltip `common.wasm.tip = '本地 WebAssembly 加速 / 首次使用需下载'`。
- 展示位置（按成本排序）：
  1. 工具卡片（首页 / 搜索结果）——最直观；
  2. 工具页标题旁（BaseView 头部）；
  3. （可选）顶栏菜单项后缀——`n-menu` option 用 `render` 加后缀，成本略高，按需。
- 数据来源：`tools.js` 每条加 `wasm: true`（或 `wasmPkg`），卡片/页面据此渲染标签。

---

## 6. 菜单 / 分类重构（满足需求 5）

现顶级分类：`格式化 / 加密 / 转换 / 图片 / 文本 / 其他 / 自定义`。
新增工具较多，**建议新增 3 个顶级分类**（顶栏从 7 → 10 项，需关注密度）：

| 新分类 | key | 收录 |
| --- | --- | --- |
| 媒体 Media | `media` | FFmpeg 音视频、音频提取、视频转 GIF、Whisper 听写 |
| 文档 Document | `document` | PDF 工具集、Pandoc 文档互转 |
| 数据 Data | `data` | SQLite、DuckDB/CSV 分析、（可选）Python |

- **压缩/归档**：暂并入 `其他`，或与 Wave1 一起新增 `压缩` 分类（见待拍板）。
- **OCR**：归 `图片`（image→text）。
- **WebP/AVIF**：并入 `图片` 的转换能力（升级而非新分类）。
- **顶栏密度风险**：横向 `n-menu` 已较满。若 10 项过挤 → 引入"更多 ▾"溢出菜单收纳长尾，或将 `自定义` 等低频项下沉。**建议先实现 3 新分类，实测密度再决定是否加溢出。**

---

## 7. i18n 方案（满足需求 6）

沿用 CLAUDE.md「新增工具」清单，**每个新工具/新 UI 必须同步 7 处**：组件、`router/index.js`、`api/tools.js`、`locales/zh.js`、`locales/en.js`、`locales/toolDescriptions.js`、`locales/seo.js`、`AppLayout.vue` 菜单。
- 新增 i18n 命名空间：`media.*` / `document.*` / `data.*`。
- WASM 相关通用键：`common.wasm.*`（标签、tooltip）、`common.wasmDownload.*`（进度条：下载中/取消/重试/完成）。
- 加载器/进度条文案同样纳入 zh/en。

---

## 8. Cloudflare 部署配置（新增 `public/_headers`）

```-ini
# WASM 长效缓存 + 正确 MIME
/*.wasm
  Cache-Control: public, max-age=31536000, immutable
  Content-Type: application/wasm

# 多线程 SharedArrayBuffer（ffmpeg/oxipng 需要）
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```
- 用 `credentialless` 而非 `require-corp`，尽量避免破坏第三方资源（广告、外链）。
- `.wasm` 用内容哈希文件名 → `immutable` 安全。
- ⚠️ 启用 COEP 会影响整站跨域资源，需回归测试（尤其 AdSense/外链 iframe）。

---

## 9. 分阶段路线图

- **Phase 0 · 基建**（无新工具，先打地基）：`useWasmModule` + `WasmDownloadBar` + `WasmTag` + i18n 键 + `_headers` + argon2 迁到新加载器验证。
- **Phase 1 · Wave1 + 高价值升级**：PNG/SVG 优化、zstd/brotli、PCRE2 正则；EXIF 升级、图片现代格式、hash-wasm。→ 先拿到"能下载/有进度/有标识"的完整体验。
- **Phase 2 · Wave2**：归档解压、OCR、PDF、SQLite、Pandoc。
- **Phase 3 · Wave3 重型**：FFmpeg（旗舰，需 Worker+SAB+可续传）、Whisper、DuckDB、Pyodide。
- 每波完成即回归 i18n/暗色/响应式；文档在每波功能稳定后统一补（见 §10）。

---

## 10. 文档计划（后置，仅记录）

- 每个 WASM 工具仍按 CLAUDE.md 产 `public/docs/{toolKey}_{background,tutorial,examples}_{zh,en}.md` 6 文件。
- **时机**：功能开发完成、行为稳定后统一补，避免早期反复改。本计划即占位记录。

---

## 11. 已拍板决策（2026-10-17）

| # | 议题 | 决策 |
| --- | --- | --- |
| 1 | 新增范围 | **13 个全做**。定位：优化/丰富工具，用新工具对抗传统工具站。分波次推进，Wave3 重型不省略。 |
| 2 | 菜单/分类 | **增加分类，但要考虑排版**。新增 媒体/文档/数据 顶级分类，压缩归档暂挂"其他"；顶栏密度需专门设计，过挤则加"更多 ▾"溢出。 |
| 3 | 去后端 | **保持现状，后置**。`/api/format` 暂不动，本次只做 WASM 新能力与升级。 |
| 4 | 多线程 COOP/COEP | **Phase 0 就配好**（credentialless）。需在部署后回归验证 AdSense/外链 iframe。 |

> 注：决策 1「全做」指纳入路线图，不等于一次性全部上线——仍按 §9 波次交付，每波独立验证。

---

## 12. 待办 / 下一步

- **Phase 0 基建**（本计划落地第一步，已开工）：`useWasmModule` + `WasmDownloadBar` + `WasmTag` + i18n 键 + `public/_headers` + AppLayout 挂载。不触碰现有工具。
- Phase 0 完成后，以 **Wave1 首个工具**（建议 oxipng PNG 压缩）作为端到端验证样例，跑通"下载→进度→取消→缓存→标识"全链路，再批量迁移。

### 12.1 实施记录（2026-10-17）

- **Phase 0 基建** ✅：`useWasmModule.js` / `WasmDownloadBar.vue` / `WasmTag.vue` / `public/_headers`（COOP+COEP credentialless）/ i18n 键 / AppLayout 挂载。
- **Wave1-1 PNG 无损压缩** ✅：`@jsquash/oxipng`，组件 `components/image/PngOptimize.vue`，路由 `/image/png-optimize`，wasm 手动快照 `public/wasm/squoosh_oxipng_bg.wasm`（164KB）。已验证 jsSquash glue：多线程仅在 Worker 上下文启用，主线程喂单线程字节安全匹配。
- **Wave1-2 文件压缩/解压** ✅：`FileCompress.vue`（`/other/file-compress`），Brotli(`brotli-wasm@3.0.1`, 1.0MB) + Zstd(`@bokuweb/zstd-wasm@0.0.27`, 246KB) + Gzip(原生流)。**胶水层 vendor 到 `src/vendor/`**（原因：两库默认用 `new URL(..., import.meta.url)` 自抓 wasm，会绕过进度/缓存链路并让 Vite 把死资产吐进 dist；brotli 胶水已打补丁去掉默认 URL 回退）。详见 `src/vendor/README.md`。
- **Wave1-3 SVG 优化** ❌ 跳过（无浏览器可用 wasm 版，理由见 §3 表格）。
- **Wave1-4 WebP/AVIF 转换** ✅：`@jsquash/webp@1.5.0` + `@jsquash/avif@2.1.1`，组件 `components/image/WebpAvifConvert.vue`（`/image/webp-avif-convert`）。浏览器 decode 用 `createImageBitmap`，encode 走 WASM。胶水层同样 vendor 到 `src/vendor/jsquash/`（补丁去掉 `new URL(wasm, import.meta.url)` 回退，强制以编译好的 `WebAssembly.Module` 注入）。关键决策：**avif 强制 ST 单线程 glue**——上游包装层检测到 SAB（本站已开 COEP）会改用 MT glue，需 pthread worker 文件，与 Vite/主线程链路兼容性差；MT + Worker 化统一留待 Wave3。webp 的 simd/非 simd glue 选择上抛给组件（`wasm-feature-detect` 探测后下载匹配字节），保证字节与 glue 严格匹配。wasm 快照：`public/wasm/{webp_enc,webp_enc_simd,avif_enc}.wasm`（275/338/3320KB，按需只下一个）。
- **文案纠偏**（用户要求的真实性核查）：`about.js` 原称图片转换"支持 JPG、PNG、WebP、BMP、GIF、AVIF 等格式互转"——实际 `Convert.vue` 的 `formatOptions` 只有 JPEG/PNG/WebP/GIF（canvas.toBlob），BMP/AVIF 从未实现。已改为与实际 UI 一致的表述，并补入本轮新增的 WASM 能力描述。
- **Wave1-5 PCRE2 高级正则** ✅：`pcre2-wasm@10.49.2`，组件 `components/convert/Pcre2Regex.vue`（`/convert/pcre2-regex`）。与现有 JS 正则工具（`/convert/regex`）定位互补：PCRE2 独占特性（占有量词/原子组/递归/变长后视断言/Unicode 属性）在 UI 中附速查表。**wasm 提取方式特殊**：上游把 wasm 以"二进制字符串字面量"内嵌在单文件 glue `dist/pcre2.js`（523KB 中 453KB 是载荷）——先用字符串字面量扫描 + eval 抽出 `public/wasm/pcre2.wasm`（443KB，magic 校验通过），再清空 glue 内嵌载荷，仅保留 `Module.instantiateWasm` 注入点（与 jsquash 同模式）；胶水 `src/vendor/pcre2-wasm/pcre2_glue.js` 经 esbuild 语法校验。标志位 UI 直接 OR `FLAGS` 常量（parseFlags 只支持 i/m/s/x/u/U/A/D 子集，不含 UCP/n）。
- **架构备忘**：当前 WASM 计算在主线程（与 PngOptimize 一致）；大文件长时间计算卡 UI 的 Worker 化留待 Wave3（FFmpeg）统一做，届时把 `useWasmModule` + vendor 胶水搬进 Worker 即可。
- **Wave1 全部完成** ✅（4 个工具 + 1 个跳过：SVG）。
- **Wave2-1 归档解压/压缩** ✅：`libarchive.js@2.0.2`，组件 `components/other/ArchiveTool.vue`（`/other/archive`）。解压侧自动识别格式（ZIP/TAR/7Z/RAR/GZ/BZ2/XZ/ZST/CPIO/ISO），条目浏览 + 单条/全部解压 + 密码；压缩侧 ZIP/TAR/7Z × Deflate/Store/Gzip/Bzip2/XZ/Zstd/LZ4。**架构：Comlink + Web Worker**——主线程 loader 下载 wasm（980KB）→ postMessage 转移字节 → 自有 worker 入口收字节 → 动态 import 补丁后的 worker-bundle（`k(new S)` 补丁以 `wasmBinary` 注入，与 jsquash/pcre2 同模式）。**共 4 处补丁**（wasmBinary 注入 / wasm 默认 URL 抛错 / worker 默认 URL 抛错 / Node 分支短路），详见 `src/vendor/README.md`。配套：`vite.config.js` 增加 `worker: { format: 'es' }`（Vite worker 默认 IIFE 与 manualChunks 代码分割不兼容）。worker 入口 `src/workers/libarchive-worker.js`（等主线程字节再动态 import，comlink 握手时序经消息队列保证）。
- **Wave2 选型核查结论**：**Pandoc 跳过** ❌——`pandoc-wasm` 确为 pandoc 官方包，但 wasm **58.6MB**，超预估（~4.8MB）12 倍，严重违反轻量化原则；若未来拆分为按需格式子集可重评。OCR（tesseract.js）与 PDF（mupdf）包真实存在，SQLite 用官方 `@sqlite.org/sqlite-wasm`（非 sql.js）。
- **Wave2-2 图片转文字 OCR** ✅：`tesseract.js@7.0.0` + `tesseract.js-core@7.0.0`，组件 `components/image/OcrTool.vue`（`/image/ocr`），驱动 `composables/useTesseract.js`（TesseractEngine，自实现 job 协议 driver ~150 行），worker 入口 `workers/tesseract-worker.js`（Vite ESM worker）。**核心发现：core 胶水内嵌 base64 wasm 载荷**（`wa??=Ga("AGFzbQ...")`，3.8MB，与独立 .wasm 字节一致已校验）——按 pcre2 同模式剥离为 `wa=void 0`，令 `xa()` 的 `a==wa&&la` 注入分支生效，core wasm 改走 useWasmModule 下载（2.85–2.86MB × 3 变体：relaxedsimd-lstm/simd-lstm/lstm，wasm-feature-detect 探测只下一个）。语言包 9 种（eng/chi_sim/chi_tra/jpn/kor/deu/fra/spa/rus，`@tesseract.js-data/<lang>@1.0.0/4.0.0_best_int`，0.7–2.95MB）按用户选择下载。**worker-script 补丁 6 处**（load handler 注入 wasmBinary / initialize 对象语言用 l.code 修上游 bug / dispatchHandlers 忽略 init 消息 / getCore 重写用注入工厂 / setImage 移除 bmp-js 分支（Node Buffer 依赖，leptonica 原生可读 BMP 已实证）/ CJS→ESM 全量转换（仓库 type:module）+ Node 三分支短路），esbuild 打包 `vendor/tesseract/worker_bundle.js`（86KB）。完整链路（注入→语言包→Init→Recognize→文本+置信度）在 Node 实证通过（"HELLO WORLD 123"）。构建验证：6721 modules transformed（基线 6718），无 base64 载荷泄漏进 dist。
- 剩余 Wave2：PDF（mupdf）、SQLite（`@sqlite.org/sqlite-wasm`）。
- **Wave2-3 PDF 工具集** ✅：`mupdf@1.28.1`（Artifex，AGPL-3.0），组件 `components/document/PdfTools.vue`（`/document/pdf-tools`），驱动 `composables/useMupdf.js`，worker 入口 `workers/mupdf-worker.js`；vendor `src/vendor/mupdf/`（glue + wrapper 5 处补丁）。**新增「文档」顶级分类**（AppLayout 菜单 + Home.vue CATEGORY_META 📄 order 5，text/other/custom 顺延）；9 处注册全量（router / tools.js wasm:true / AppLayout / Home CATEGORY_META / zh.js+en.js `document.pdfTools.*` + `common.document` / toolDescriptions 中英双块 / seo.js / about.js 图片段后新增 document 段）。
  - **体积决策**：wasm 9.9MB（压缩版 3.5MB）超 Wave2 的 2–6MB 区间，但 PDF 渲染/编辑浏览器无原生能力、pdf.js 纯 JS 方案保真度与性能均有数量级差距，符合"不可替代性"；一次性下载 + 缓存，进度/取消由 WasmDownloadBar 承担。是站内最大资产（次大 avif 3.3MB）。
  - **工具范围**（3 个标签页，控制在计划列出的"PDF→图片、合并、拆分"内，"生成 PDF"未做）：转图片（PNG/JPEG 质量 90、1x/2x/3x 倍率、页码范围）；合并（多文件 ↑↓ 排序、graftPage 全页拼接）；拆分（每页一个文件 / 按范围如 1-3,5,8-）。支持加密 PDF（needsPassword + authenticatePassword，密码仅本地使用）。
  - **架构**：与 ArchiveTool/OCR 同型的 Worker 化——主线程 useWasmModule（compile:false，编译在 worker 内由胶水自行完成）下载 9.9MB → `buffer.slice(0)` 转移 → worker `__initMupdf(bytes)` 注入 → job 协议（render/merge/split + per-page/part 进度）。页码范围解析在 worker 内（打开后才知道总页数）；错误码标准化（PASSWORD_REQUIRED/PASSWORD_WRONG/OPEN_FAILED/RANGE_INVALID/EMPTY_DOC → i18n）。
  - **关键技术坑（去 TLA）**：上游 wrapper 模块顶部 2 处顶层 await，与构建目标（chrome87）冲突直接构建失败。改为显式 `__initMupdf()`，并把 **32 条模块级求值语句**收拢其中（26 条类静态赋值 + `PDFObject.Null` 实例化 + 6 个 `Malloc` scratch 指针）。教训：仅扫"顶层直接引用 libmupdf"会漏经 helper 的间接依赖（`Malloc()`、`new PDFObject()` 构造器），须以模块加载期堆栈逐步定位；延迟安全性依据 Userdata 构造器懒读 `ctor._drop`。
  - **实证**：Node E2E 全链路（注入→openDocument→toPixmap→asPNG/asJPEG→graftPage 合并→saveToBuffer 拆分→toStructuredText 文本提取）通过；空字节反向验证明确失败；leptonica/mupdf 对不规范合成 PDF 的 format warning 上游同现（非补丁引入，worker 内 setLog 静默）。构建 6724 modules transformed（基线 6718 +6）；dist 三 chunk（PdfTools 3.3KB / mupdf-worker 21KB / mupdf 模块 92.7KB）+ mupdf.wasm 9.9MB 就位，无 base64 载荷泄漏。
  - **遗留合规待办**：MuPDF 为 AGPL-3.0，上线前需确认开源工具站点的合规策略或联系 Artifex 商业授权（已记入 vendor README）。
- **Wave2-4 SQLite 数据库** ✅：`@sqlite.org/sqlite-wasm@3.53.4-build2`（SQLite 官方，Apache-2.0），组件 `components/data/SqliteTool.vue`（`/data/sqlite`），驱动 `composables/useSqlite.js`，worker 入口 `workers/sqlite-worker.js`；vendor `src/vendor/sqlite-wasm/`（胶水 + OPFS async proxy，2 处补丁）。**新增「数据」顶级分类**（AppLayout 菜单 + Home.vue CATEGORY_META 🗃️ order 6，text/other/custom 顺延至 7/8/9）；9 处注册全量（router 新增 `/data` 父路由 / tools.js wasm:true / AppLayout / Home CATEGORY_META / zh.js+en.js `data.sqlite.*` + `common.data` / toolDescriptions 中英双块 / seo.js / about.js 中英各新增 data 段）。
  - **工具范围**：三种打开方式（上传 .db 导入 / 打开已保存的 OPFS 库 / 新建库）+ 工作台（左侧表与视图列表一键浏览前 200 行、右侧 CodeMirror SQL 编辑器、结果表格、CSV 导出、整库导出 .db、OPFS 库列表删除）。内存库模式作为 OPFS 不可用时的降级。
  - **架构**：与 OCR/PDF 同型 Worker 化——主线程 useWasmModule（compile:false）下载 868KB → `buffer.slice(0)` 转移 → worker `sqlite3InitModule({ wasmBinary })` → job 协议 10 类（import/openOpfs/openMemory/exec/tables/browse/export/listOpfs/deleteOpfs/close）。OPFS 文件枚举/删除用 `navigator.storage.getDirectory()` 直连（opfsUtil 在非测试构建会被 `delete sqlite3.opfs`）。
  - **patch 2 处**：① `findWasmBinary()` 的 `new URL("sqlite3.wasm", import.meta.url)` 相对回退 → 注入时返占位名、否则抛错（868KB 死资产不进 dist）；② `sqlite3Worker1Promiser.defaultConfig.worker()` → 抛错（Worker1/Promiser API 官方 2026-04-15 起废弃，且避免 635KB `sqlite3-worker1.mjs` 进 dist）。**保留** `new URL("sqlite3-opfs-async-proxy.js", import.meta.url)`（OPFS VFS 必要组件，交给 Vite 资产管线；构建实测落为 `sqlite3-opfs-async-proxy-*.js` 32.5KB asset）。
  - **实证**：Node E2E 双向通过——正向注入 → libVersion 3.53.4 → exec/selectObjects/selectValue/columnNames/resultRows/transaction 全通；反向不注入明确抛错。`sqlite3_js_db_export` 导出 16KB、`sqlite3_deserialize` 内存库导入、changes 计数均实证通过（`sqlite3_serialize` + `sqlite3_free` 手写组合会 OOB 崩溃，必须用官方 `sqlite3_js_db_export`）。
  - **API 踩坑（已入 vendor README）**：`exec()` 不接受数组混合多语句，只收单条 SQL 或单个 `{sql,bind}`；`selectObjects(sql, bind)` 的 bind 必须是**数组**（传裸值 falsy → 不绑定 → `WHERE x > NULL` 恒空）；`wasm.scopedAlloc*` 须在 `scopedAllocPush()` 作用域内；`bigIntEnabled` 下 i64 参数传 number 即可；每条 SQL 会打 `SQL TRACE`，worker 内 `config.log(()=>{})` 静默。
  - **OPFS 与降级**：`installOpfsVfs()` 经 `initializersAsync` 自动安装、失败仅 warn 不 fatal（Node/无隔离环境自动无 OPFS，UI 显式提示降级为内存库）；`importDb` 校验 SQLite 文件头并强制关闭 WAL（改写头字节 18-19 为 `[1,1]`），失败自动清理残留文件。**dev server 补配 COOP/COEP**（`vite.config.js` server.headers，credentialless，与 `public/_headers` 一致）——缺此二者本地开发会静默降级为内存库。
  - **构建验证**：6727 modules transformed（基线 6724 +3）；dist 四产物（SqliteTool 17.9KB / sqlite-worker 3.6KB / vendor 胶水 chunk 218KB / opfs proxy asset 32.5KB）；`sqlite3-worker1` 无任何引用；无 base64 载荷泄漏；10 个 job 类型与 i18n 键均在产物中。
  - **验证方法改进**：沙箱禁止读取 `public/docs/*`，故常规构建恒在 `prepareOutDir` 失败；本次用**临时配置 `publicDir:false`**（并挂 `generateBundle` 报告插件）绕开 public 复制，完整写出 bundle 核对构成，验证后已删除临时配置与 `dist_check*` 目录。
- **Wave3-1 FFmpeg 音视频（旗舰，用户点名）** ✅：`@ffmpeg/core@0.12.10`（FFmpeg 5.1.4 → WASM）+ `@ffmpeg/ffmpeg@0.12.15`，组件 `components/media/MediaTool.vue`（`/media/media-tool`），驱动 `composables/useFfmpeg.js`，worker 入口 `workers/ffmpeg-worker.js`；vendor `src/vendor/ffmpeg/ffmpeg-core.js`（1 处补丁）；**新增「媒体」顶级分类**（AppLayout 菜单 + Home.vue CATEGORY_META 🎬 order 7，text/other/custom顺延至 8/9/10）；9 处注册全量。
  - **体积实测修正**：wasm **32.2MB**（计划预估 25-28MB；为 mupdf 的 3.2 倍，站内最大资产），但 gzip 后仅 **9.7MB**（Cloudflare 自动压缩）+ Cache API immutable 缓存，二次访问秒开。
  - **架构决策：自建单层 worker（方案 B，已与用户确认）**。放弃上游 `FFmpeg` 类的唯一理由：它 spawn 自己的 worker 并**自行 fetch core wasm**，绕过 useWasmModule → 进度条/取消/缓存全部失效，直接违背需求 4（异步下载+进度+可取消）。改为与 OCR/PDF/SQLite 同型：主线程下载 → `buffer.slice(0)` 转移 → worker 内 import 补丁胶水 → `createFFmpegCore({wasmBinary})`。
  - **ffmpeg 命令在 worker 内构造**（组件只传结构化选项 format/quality/scale/fps/width），命令行参数是外部输入面，集中校验便于后续收窄。
  - **patch 1 处**：`_locateFile` 的 `.wasm` 分支注入时返占位名。注意本胶水 `Module["locateFile"]` 被**无条件**赋值，故 `new URL("ffmpeg-core.wasm", import.meta.url)` 是**不可达死代码**（构建仍 warning，但不产生死资产——已实测 dist 未误生成 wasm 资产）。
  - **能力边界（实测纠正，勿再假设）**：① 胶水硬编码 `ENVIRONMENT_IS_WORKER=true` / `ENVIRONMENT_IS_NODE=false` → **必须在 worker 内跑**（主线程 `self` 未定义崩溃），且**无 Node 分支可短路**（故不需要 mupdf/sqlite 那种环境补丁）；② **`ffprobe` 不可用**（无参 -1、带参写 JSON abort）→ probe job 改用 `-f null -` 作类型校验 + `-f ffmetadata` 取容器信息；③ **ffmpeg 自身 stderr 不经胶水logger**（exec 内 catch Aborted 只返回 ret，日志里只有 `Aborted()`）→ **不能用错误文本判定失败原因**，改为按「命令+选项组合」映射错误码，extractError 过滤 `Aborted()` 垃圾文案；④ **读不到时长/分辨率**（只在 stderr）→ UI 不谎报时长，进度只能是**不确定进度条**（exec 同步阻塞 + 总时长未知，不得显示假百分比）；⑤ `setProgress` 的 progress **会返回负数**（实测 -900098，微秒基准差值），须钳制；⑥ MEMFS 全内存，每个 job 结束**必须删输入/输出**，否则与 32MB wasm 累积；⑦ 文件名入 MEMFS 前过 `safePath()` 规避路径穿越。
  - **工具范围**（3 个标签页）：视频转码（MP4/H.264 CRF 18-40 + WebM/VP8，输出宽度可选）、提取音频（MP3/M4A/WAV/OGG/Opus，输入无音轨时明确报 NO_AUDIO_STREAM 而非静默产出空文件）、视频转 GIF（fps 5-30 + 宽度 80-800，palettegen/paletteuse 双段滤镜）。结果页面内直接预览播放（video/audio/img 元素）+ 下载。
  - **实证**：Node E2E 双向通过——正向注入 32.2MB **56ms 加载**，lavfi 合成带音轨视频后转码 mp4(+scale)/webm/音频 mp3/转 GIF 全部 `ret 0` 且产物字节合法；`-f null -` 文件类型校验正确（文本文件返回非 0）；反向空字节明确 `fetch failed`。编解码覆盖 libx264/x265/vpx/mp3lame/aac/vorbis/opus/webp/theora/ass。
  - **构建验证**：6730 modules transformed（基线 6727 +3）；dist 五产物（MediaTool 17.2KB / ffmpeg-worker 4.0KB / vendor 胶水 68.8KB / worker_bundle 59.6KB / opfs proxy 31.7KB）；`ffmpeg-core.wasm` 等均**无误入 dist**；`_locateFile` 补丁在压缩产物中确认保留（`o.wasmBinary?"ffmpeg-core.wasm":e`）。
  - **合规**：FFmpeg 为 LGPL-2.1+，但 core 构建带 `--enable-gpl --enable-libx264`（x264 是 GPL-2.0+）→ 整体按 GPL 处理。比 MuPDF 的 AGPL-3.0 在纯前端静态分发下合规压力小，但**仍需上线前确认**（已记 vendor README）。
  - **Wave3 剩余**：Whisper 听写（实测需 71–139MB 模型，否决）、DuckDB（实测 34–39MB 且与 SQLite 工具重叠，暂缓）、Pyodide（实测 10MB，唯一体积合理但定位偏窄，待定）。**UPGRADE 类（计划 §2，10 项）仅 EXIF 一项完成**。**8+ 个新工具的 public/docs 六文件文档仍未产出**（后置）。
- **UPGRADE-1 EXIF 查看器增强为"查看 + 隐私清理"** ✅（**纯 JS，非 WASM** —— 经用户确认「WASM 是手段而非目的，只在性能/能力有明显优势时使用」）：
  - **选型纠错**：① `exiftool-wasm` **404 不存在**（计划 §2.1 的前提错误）；② `exiftool-vendored@39.0.1`（1.9MB MIT）是**纯 Node.js 包**（`require("node:fs")` + 加载 `.pl` Perl 脚本，README 明确 "Node.js access"），**无 wasm、浏览器不可用**；③ 最终选 **`piexifjs@1.0.6`（MIT，85KB 纯 JS）** —— 85KB 无需下载、可精确控制每个 IFD 段，对"删 GPS / 清 EXIF"这类操作能力充足。
  - **不选 WASM 的理由（已写入 UI 文案）**：浏览器端可用的 EXIF 写入方案里，wasm 版要么不存在要么是 Node 专用；piexifjs 体积小、无下载成本、能力够用，符合"有明显优势才用 wasm"的原则。
  - **改动**：**增强既有 `components/image/ExifViewer.vue`**（336 → 579 行）而非新增工具入口——避免同一能力两个入口。读取仍用 exifr（快、格式覆盖广），新增"隐私清理"面板：擦除 GPS（保留其他 EXIF）/ 清除全部 EXIF，检测到 GPS 时显示警告标签，PNG/WebP 明确提示不支持（EXIF 存于 JPEG APP1 段）。
  - **piexifjs 关键用法（踩坑记录）**：`load()` / `insert()` **只接受 binary string**，传 ArrayBuffer / Uint8Array / Node Buffer 都会抛 `'load' gots invalid type argument.`（浏览器侧对应 `FileReader.readAsBinaryString`）。此坑最初误判为"Node realm 跨域问题"，实为 API 用法错误。UMD 走 `exports` 分支（非 `window.piexif`）。
  - **擦除后强制复核**：擦除结果用**独立的 exifr** 重新解析，确认 GPS 确实消失才允许下载；复核不通过直接抛错、**不产出文件**，避免给用户"已擦除"的错觉。全量擦除后 exifr 返回 `undefined`（连空对象都没有），是最强证据。
  - **实证（Node + ffmpeg 生成真实 JPEG）**：注入 GPSLatitude `[39,54,26.64]` → 擦除后 exifr 读回 `undefined`，同时 Make 保留；全量擦除后读回 `undefined`；选择性删 Orientation 生效且其他字段与 GPS 保留；无 EXIF 裸图往返正常；PNG 输入正确报错。
  - **文案同步**：zh.js/en.js `image.exif.*` 新增 24 个键（0 缺失）、toolDescriptions 中英双块重写、seo.js 中英更新、about.js 中英 image 段补"隐私清理（擦除后自动复核）"。**期间 seo.js 编辑一度破坏括号结构导致构建失败（264 modules 即挂），已修复并复验 5 个 locale 文件均可正常 import**。
  - **UPGRADE-2 文件哈希改流式（GB 级）** ✅（**用户判断"只有 hash 值得做"，已核实并采纳**）：
  - **先核查发现旧实现是假分块**：`FileHash.vue` 虽定义了 `CHUNK_SIZE = 2MB`，但**该常量从未被使用** —— 实际走 `readAsArrayBuffer(file)` 整文件读入，且 `crypto.subtle.digest` **并发调用三次**（SHA-1/256/512 各复制一份），1GB 文件产生约 **4GB 峰值内存**；第 154 行的「大文件警告」只是弹窗不阻止。文案里已写「大文件分片处理」属**文案与实现不符**，一并修正。
  - **技术前提**：Web Crypto 的 `crypto.subtle.digest()` **不支持流式喂数据**，只能一次性吃完整数据 —— 这是必须换库的根本原因（不是"hash-wasm 更快"，而是"只有它能流式"）。
  - **方案**：`hash-wasm@4.12.0`（MIT，Dani Biro，Rust→WASM），四个算法模块共 32KB。4MB 分块 `file.slice()` 惰性读取（`slice` 不复制数据，只有 `arrayBuffer()` 才真读），逐块喂 `update()`，四种算法**单次遍历**同时算出。每块之间 `setTimeout(0)` 让出主线程，避免进度条被计算饿死。
  - **vendor 化（踩坑两次）**：① 上游只提供 **UMD** 且 package.json **无 exports** → 子路径 `hash-wasm/md5` 构建直接报"failed to resolve"；② 更隐蔽的问题：直接 import 时 **Rollup 把 UMD 当 CJS 处理，`createSHA256` 函数在产物里、但内嵌 base64 载荷被丢弃**，运行时 `WebAssembly.compile()` 拿空 BufferSource 失败 —— **构建期不报错、只在运行时暴露**。故 vendor 到 `src/vendor/hash-wasm/`（4 文件）并打补丁：注入点改为优先取 `self.__toolhubHashWasm[algo]`（loader 下载的字节），同时**剥离内嵌 base64**（vendor 从 66KB → 23KB）。
  - **wasm 字节抽取**：从上游 glue 的 `data:"AGFzbQ..."` 正则抽出 → `public/wasm/{md5,sha1,sha256,sha512}.wasm`（3.5/5.6/9.7/13.5KB），magic 校验通过，走 `useWasmModule` 带进度/取消/缓存。
  - **正确性实证（与 Node 原生 crypto 逐字节比对，全部 MATCH）**：2MB 分块 / 1 字节分块×1000 / 空输入 / 非 2 的幂次分块 / 3MB+777 任意分块 × 四种算法；**反向验证**：不注入时明确失败 `WebAssembly.compile(): BufferSource argument is empty`，**不会静默产出错误哈希值**（校验工具最不可接受的失败模式）。
  - **性能实测**：MD5 ~455MB/s、SHA-1 ~714MB/s、SHA-256 ~312MB/s、SHA-512 ~500MB/s → **1GB 文件约 1–3 秒**；**100MB 文件流式哈希堆内存增量仅约 0.6MB**。
  - **hash-wasm API 坑（已入 vendor README）**：导出是具名对象 `{createSHA256, sha256}` 非默认导出；`createXXX()` 返回 **Promise**；**没有 `hex()` 方法**（`digest()` 直接返回 hex）；工厂名 `createMD5` 全大写（`create${name[0].toUpperCase()}` 拼出的 `createMd5` 不匹配）。
  - **交互增强**：新增**取消计算**按钮（大文件计算期间可中止）、进度条实时百分比、大文件提示从"警告"改为"预期耗时"（`largeFileWarning` → `largeFileInfo`）、加 WASM 徽标、`tools.js` 加 `wasm: true`。
  - **构建验证**：6739 modules transformed（基线 6735 +4）；dist 五产物（FileHash 6.7KB + md5/sha1/sha256/sha512 各 ~5.6KB 独立 chunk）；**无 base64 载荷泄漏**。
  - **教训**：卸载 spark-md5 前我用了 `grep --include="*.vue" --include="*.js"` 过滤，漏掉了 `custom/ScriptBox.vue` 里的动态 import（它在别的文件里），导致构建失败 —— **卸载依赖前必须全量 grep，不加路径过滤**。已恢复 spark-md5（ScriptBox 仍在用）。
  - **其余工具的性能结论（已核查，可暂缓）**：文本/加密类走输入框无压力；图片/OCR/EXIF 类整读但单文件通常 <20MB；Archive/FileCompress 是第二优先（已有流式基础，且有 GB 级真实需求）；PDF/FFmpeg 受 MEMFS/WASM 堆上限约束，非算法问题。
- **Wave3-2 Python 运行器** ✅（**最后一个新工具**）：`pyodide@0.28.3`（CPython 3.13 → WASM，官方），组件 `components/data/PythonTool.vue`（`/data/python`），驱动 `composables/usePyodide.js`，worker 入口 `workers/pyodide-worker.js`；vendor `src/vendor/pyodide/pyodide.mjs`（2 处补丁）。
  - **定位决策：标准库模式（用户确认方案 A）** —— 数值实测 `pyodide.asm.wasm` 8.4MB + `python_stdlib.zip` 2.4MB + `pyodide.asm.js` 1.0MB + lock 107KB ≈ **11.9MB**（计划预估 20MB，实测更低）；**科学栈（numpy/pandas/scipy）不在 npm 包内**，须从 jsdelivr 拉取（scipy 实测 12MB），会重新引入外部 CDN 依赖——与已否决的 Whisper（71–139MB + 双 CDN）同类问题，故不做。UI 顶部常驻提示条明确标注"标准库模式，不含科学栈"，**不虚假宣传**。
  - **资产完全自持（关键优势）**：npm 包自带全部 4 项资产，`indexURL: '/pyodide/'` 即可全本地加载，**零外部 CDN**（与 Whisper/DuckDB 的决定性差异）。
  - **patch 2 处**（loader `pyodide.mjs`）：① 整个 `C()`（`initNodeModules`，Node 专用初始化）替换为 `if(!g)return; throw...` —— **关键：`loadPyodide` 内 `await C()` 是无条件调用的**，若让 C 恒抛错浏览器也会挂，故必须保留"浏览器(g=false)静默 return、Node(g=true)抛错"的原语义；② `calculateDirname` 的 `if(j)` 分支（`j=g&&!T`，Node ESM 标志）抛错，消除 Vite 对 `node:path`/`node:url` 的静态解析。补丁后**构建无 node 内置模块 externalized 告警**（与 pcre2/libarchive/mupdf 同一套路）。*踩坑*：首次补丁把整个函数体换成了无条件抛错，导致浏览器也挂；读 `at()` 源码发现 `await C()` 无条件调用后改正。
  - **wasm 注入手法（与既有工具不同）**：pyodide 的 `getInstantiateWasmFunc` 会自行 fetch `indexURL + pyodide.asm.wasm`。为避免重复下载 8.6MB，worker 内**临时拦一层 `self.fetch`**——遇到 `pyodide.asm.wasm` 返回缓存字节的 Response，其余请求透传；`loadPyodide` 完成后立即恢复 fetch（避免影响用户代码的网络请求）。
  - **实证（Node E2E）**：本地 `indexURL` 加载 **1051ms**，Python 3.13.2；标准库（json/re/datetime/math/statistics）、stdout 捕获、异常捕获、OOP/f-string、JS 互操作全通；反向验证资产缺失时明确失败无 CDN 静默回退。
  - **能力边界（已写入 toolDescriptions）**：`input()` 不可用（浏览器无 stdin）；`urllib/requests` 受沙箱限制不可用；执行耗时不可预知故进度条固定 95%（**不显示假百分比**）。
  - **5 个示例代码**：统计计算 / JSON 处理 / 正则提取 / 日期计算 / 算法实现（BFS + 手写堆排序 + heapq），让用户零成本体验标准库价值。
  - **构建验证**：6735 modules transformed（基线 6732 +3）；dist 四产物（pyodide loader 15.3KB / PythonTool 11.3KB / python worker 3.4KB / css 1.0KB）；wasm/zip 大资产**无误入 dist**；无 node externalized 告警。
  - **Wave3 与新工具全部收官** ✅：新工具共 10 个（PNG压缩 / 压缩解压 / WebP·AVIF / PCRE2 / 归档 / OCR / PDF / SQLite / FFmpeg / Python）+ EXIF 增强；否决 3 个（SVG无wasm版 / Pandoc 58.6MB / Whisper 71–139MB）+ DuckDB 暂缓（34–39MB 且与 SQLite 重叠）。**剩余仅文档后置**（10 个新工具的 public/docs 六文件）。
