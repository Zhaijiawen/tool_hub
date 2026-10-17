# ToolHub 新工具落地路线图（Wave 4：AI 与离线专业工具）

> 目标：在已覆盖传统工具站 90% 能力的基础上，补齐"传统站没有 + 大众需要 + 本地/隐私有优势"的差异化工具。
> 原则：纯前端、文件不出浏览器；WASM 仅当性能/能力明显优于纯 JS 时使用；优先新工具、不重复造已有；体积克制。

---

## 0. 现状盘点（已覆盖，不重复）

项目（toolhub）现已具备传统工具站绝大多数能力，以下**一律不再做**：
- 密码学：`aes` / `chacha20` / `des` / `rsa` / `ecc` / `sha` / `bcrypt` / `argon2` / `ecdh` / `x25519` / `rsa-sign` / `ecdsa-sign` / `ed25519-sign` / `base64` / `hex` / `url` / `html` / `jwt`
- 转换：`timestamp` / `date-calc` / `date-diff` / `number` / `number-base` / `storage-time` / `unit` / `cidr` / `diff` / `json-schema` / `json-convert`
- 格式化：`json` / `xml` / `yaml` / `js` / `html` / `css` / `sql` / `markdown` / `vue`
- WASM 专项：OCR(Tesseract) / PDF(MuPDF) / SQLite(OPFS) / FFmpeg / Python(Pyodide) / PCRE2 / 归档(libarchive) / 文件压缩(Brotli/Zstd/Gzip) / PNG 优化(Oxipng) / WebP·AVIF(jsSquash) / EXIF 擦除 / FileHash(hash-wasm 流式) / 二维码**生成**

> 结论：传统站"有的"我们基本都有；差异在"他们没有的"——AI 时代新需求 + 离线专业能力。

---

## 1. 选型原则（决策记录）

1. **本地优先**：所有工具纯前端运行，用户文件不出浏览器。这是相对传统云端工具站的核心卖点。
2. **WASM 克制**：仅当性能/能力明显优于纯 JS 才用 WASM（沿用 Wave3 原则）。能用纯 JS 的（如 Token 计算器）就不上 WASM。
3. **优先新工具**：不补传统站已有功能，只做差异化。
4. **体积阈值**：
   - < 1MB：可直接按需 import；
   - 1–15MB：动态 import + Web Worker + 懒加载；
   - > 15MB：必须 Web Worker + 下载进度条（`WasmDownloadBar`）+ 模型/权重自托管（`public/`）；
   - > 30MB：二次评估（如 Whisper 完整版已否决）。

---

## 2. 技术架构约定（复用现有基建，9-pt 注册）

每个新工具须完成以下接入点（沿用 Wave3 已验证模式）：

| # | 接入点 | 文件 / 位置 |
|---|---|---|
| 1 | 组件 | `src/components/{category}/{Name}.vue`（`<script setup>` + `toolKey` prop） |
| 2 | 文档侧栏 | 组件内 `<TutorialAndDocs toolKey="{toolKey}" />` |
| 3 | 路由 | `src/router/index.js` 对应分类 children：`path` + `component: () => import(...)` |
| 4 | 分类导航 | 若新增分类，改 `AppLayout.vue` 导航 + 分类图标；否则挂现有分类 |
| 5 | 文档 | `public/docs/{toolKey}_{background,tutorial,examples}_{zh,en}.md`（6 份，内容对齐真实行为） |
| 6 | i18n 标题 | `locales/zh.js` / `locales/en.js` 对应分类段加工具名 |
| 7 | 描述/示例/SEO | `locales/toolDescriptions.js` / `toolExamples.js` / `seo.js` |
| 8 | WASM/Worker（如需） | `useWasmModule.js` + `WasmDownloadBar`；CPU 密集放 `src/workers/` |
| 9 | 构建校验 | 临时 `vite.config.check.js`（`publicDir:false` 绕过沙箱）跑 `vite build` 零报错 |

> 已有基建：`public/_headers` 已配 `COOP: same-origin` + `COEP: credentialless`，支持 SharedArrayBuffer 与 no-cors 跨源子资源（模型自托管优先，必要时 CDN 回退也不挡）。

---

## 3. 分类调整建议

- **新增 `ai` 分类**（`path: 'ai'`），统一收纳 AI 类工具：Token 计算器、AI 抠图、AI 超分、本地 TTS、语音转文字。
- 其余按现有分类挂接：
  - `image`：条码识别、图片转 SVG、SVG 优化
  - `document`：EPUB 解析
  - `media`：（TTS/语音转文字亦可挂此，若不想进 `ai`）
  - `encrypt`：本地 AES **文件**加密（与现有文本 aes 区分）
  - `data` / `convert`：隐私 CSV 清洗
  - `other`：离线图表（Mermaid/PlantUML/Graphviz）

---

## 4. 工具规格

### 🔥 P0 — 强差异 + 大众刚需（建议 M1 立即做）

#### P0-1 · AI Token 计算器
- **能力**：粘贴文本/JSON，选模型（GPT-4o / 4o-mini / Claude 3.5 / Opus 等），输出 token 数 + 估算费用（单价可配置）。
- **引擎**：`js-tiktoken`（纯 JS，BPE 词典 ~5MB，动态 import）；可选 `tiktoken-wasm`（~5MB）。
- **体积**：~5MB（首次加载，之后缓存）。
- **实现要点**：纯前端，计算快，**无需 Worker**；支持 `cl100k_base` / `o200k_base` 等编码；多模型单价表存 locales 或常量。
- **验收**：粘贴即出 token 数；切换模型计数正确；100KB 大文本无卡顿；费用估算合理。
- **分类**：`ai`。

#### P0-2 · 本地 AI 抠图 / 去背景
- **能力**：上传图片 → 输出去背景 PNG（人像/商品/物体）。
- **引擎**：`@imgly/background-removal`（onnxruntime-web，~8–12MB）或 `transformers.js` RMBG-1.4（~15MB）。
- **体积**：8–15MB 模型权重（**必须自托管**到 `public/`）。
- **实现要点**：Web Worker 跑推理；`WasmDownloadBar` 显示模型下载进度；首次慢、缓存后快；输出 PNG 透明背景下载。
- **验收**：常见人像/商品图去背景干净；全程不联网；失败有降级提示。
- **分类**：`ai`。
- **合规**：@imgly 为 MIT、transformers.js 为 Apache-2.0，**无 AGPL/GPL 风险**（优于 MuPDF/FFmpeg）。

#### P0-3 · 二维码 / 条码识别解码
- **能力**：图片 → 解码（QR / Code128 / EAN / UPC / DataMatrix 等），支持批量与摄像头可选。
- **引擎**：`@zxing/browser`（纯 JS）或 `zxing-wasm`（~0.6MB）。
- **体积**：~0.6MB。
- **实现要点**：canvas 取像素解码；传统站普遍"只生成不识别"，此工具填补空白；可选 `getUserMedia` 实时扫码。
- **验收**：清晰码 100% 识别；模糊/畸变码降级提示而非崩溃；批量图可逐张解码。
- **分类**：`image`（或 `ai`）。

### 🟡 P1 — 强差异 + 特定人群刚需（M2）

#### P1-1 · 离线图表渲染（Mermaid / PlantUML / Graphviz）
- **能力**：文本/代码 → 流程图 / 时序图 / UML / 网络拓扑 SVG。
- **引擎**：`mermaid`（~2.5MB）/ `plantuml-wasm`（~3MB）/ `wasm-graphviz`（~2.8MB）。
- **要点**：技术写作/开发者刚需，文本不泄露云端；Web Worker 渲染；导出 SVG/PNG。
- **验收**：常见语法渲染正确；导出矢量图；错误语法有提示。
- **分类**：`other`。

#### P1-2 · AI 图片超分放大（Real-ESRGAN / waifu2x）
- **能力**：老照片修复、动漫/插画放大（2x/4x），本地免费。
- **引擎**：`real-esrgan` WebGPU 优先 / `waifu2x-wasm`（~12MB）。
- **要点**：模型自托管；WebGPU 加速，回退 WASM；大图流式。
- **验收**：放大后细节明显提升；不联网；进度可见。
- **分类**：`ai`。

#### P1-3 · 本地文字转语音 TTS
- **能力**：文本 → 语音（多人声、多语言）。
- **引擎**：`piper-tts-wasm`（~10MB + 声学模型）/ `espeak-ng-wasm`（~6MB）。
- **要点**：隐私 TTS（传统 TTS 多在云端）；模型自托管；播放 + 下载 wav。
- **验收**：多语言合成正常；可下载音频；不联网。
- **分类**：`ai`（或 `media`）。

#### P1-4 · 图片转 SVG 矢量（potrace-wasm）
- **能力**：位图（PNG/JPG）→ 轮廓 SVG 矢量。
- **引擎**：`potrace-wasm`（~1.5MB）。
- **要点**：设计者 Logo 矢量化刚需；阈值/平滑参数可调；导出 SVG。
- **验收**：常见图矢量化可用；参数调节有效；导出 SVG 正确。
- **分类**：`image`。

### 🟢 P2 — 有差异但小众 / 需评估（M3，按需）

| 工具 | 引擎 | 要点 / 验收 | 分类 |
|---|---|---|---|
| **EPUB 解析** | `epub-parser-wasm`(~1.3MB) | 解包提取章节文本/插图；电子书工具传统站少 | `document` |
| **SVG 优化** | `svgo-wasm`(~1.1MB) | 剔除冗余属性/元数据；弱差异（传统站有），本地无损 | `image` |
| **语音转文字** | Whisper **tiny** 版(~5–8MB) | 需求巨大但完整版 71–139MB+CDN 已否决；等轻量模型再评估 | `ai`/`media` |
| **本地 AES 文件加密** | Web Crypto `AES-GCM` | 与现有文本 aes 区分，针对文件；弱差异（云端有风险） | `encrypt` |
| **隐私 CSV 清洗** | 纯 JS（Papaparse + 处理） | 去重/合并/筛选；弱差异 | `data`/`convert` |

---

## 5. 实施顺序与里程碑

- **M1（P0 三项）**：`ai` 分类骨架 → Token 计算器 → AI 抠图 → 条码识别。
  - 建议**先做 Token 计算器**（最小、最刚需、零隐私顾虑、半天可上），作为 `ai` 分类 opener。
- **M2（P1 四项）**：图表 → 超分 → TTS → 图片转 SVG。
- **M3（P2 五项）**：按需求/模型可用性滚动，不强制全做。
- **每里程碑收尾**：`vite build` 零报错 + 6 份文档补齐 + 单独 commit（不 push，验证后再提交）。

---

## 6. 风险与对策

| 风险 | 对策 |
|---|---|
| 大模型体积（抠图/超分/TTS 8–15MB） | Web Worker + `WasmDownloadBar` 进度条 + 权重自托管 `public/` + 缓存 |
| COEP 影响跨源模型 | `credentialless` 已允许 no-cors；**优先自托管**，CDN 仅作回退 |
| 合规 | 本轮引擎多为 MIT/Apache-2.0（@imgly / transformers.js / piper / espeak / potrace / mermaid），**无 AGPL/GPL 风险**；仅 Whisper 需确认许可证 |
| 模型稳定性 | 权重自托管，不依赖 HF CDN，保障隐私与可用性 |
| 过度工程 | 严格按 P0→P1→P2 推进，P2 非阻塞，不提前做 |

---

## 7. 明确不做（notepad top100 中已覆盖 / 超标）

- 已覆盖：二维码生成、Base64、UUID、哈希、gzip/brotli/zstd、PNG 优化、JSONPath/YAML 解析、minify、cron、semver、Diff、CIDR、JWT、bcrypt/argon2/ed25519（项目已有）。
- 超标/已否决：`pandoc-wasm`(58.6MB)、`duckdb-wasm`(与 SQLite 重叠)、`whisper` 完整版(体积)。

---

## 8. 下一步

从 **P0-1 AI Token 计算器** 开始落地（最小可行、最刚需、零隐私顾虑），完成后作为 `ai` 分类首个工具，再依次推进 AI 抠图与条码识别。
