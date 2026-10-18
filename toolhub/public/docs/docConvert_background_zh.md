# 文档格式转换 — 技术背景

这个工具把 **Pandoc**（文档转换领域的事实标准）编译成 WebAssembly，在浏览器里完成文档格式互转。Pandoc 本身是一个命令行程序，这里通过 worker 实例化它的 wasm 构建，输入输出都留在本地。

> 注意：Pandoc 采用 GPL-2.0-or-later 许可。本项目以纯客户端方式分发其 wasm 构建；若你要基于本项目代码做分发，需留意该许可证的合规要求（已在《开源许可》页声明）。

## 为什么值得为它付 56MB

浏览器里几乎没有第二个选择。主流的转换库基本是两类：

- 纯 JS 的单向转换器（如 `marked`、`turndown`），只能 HTML ↔ Markdown，碰到 Word / EPUB / LaTeX 就没有。
- 云端服务（各种在线转换站），文件必须上传——正是本站要避免的。

Pandoc 覆盖 **29 种输入格式、37 种输出格式**（本构建实测），是唯一能在本地完成这一整套的方案。56MB 是这个能力的代价，因此采用「首次下载 + 缓存 + 可取消」的加载方式，并且只在用户真正打开本工具时才下载。

## 输入格式（实测支持）

markdown、commonmark、gfm、html、latex、rst、docbook、opml、jira、man、native、asciidoc、org、json、textile、mediawiki、docx、epub、odt、rtf、typst、muse、texinfo、twiki、tikiwiki、vimwiki、csv、tsv、fb2、ipynb

## 输出格式（实测支持）

html、markdown、gfm、commonmark、latex、rst、json、docbook、opml、jira、man、asciidoc、org、mediawiki、textile、typst、plain、native，以及二进制目标 docx、epub、odt、rtf。

## 刻意没有提供的格式

**幻灯片系（revealjs / slidy / s5 / dzslides / slideous）虽然能转换成功，但产出的 HTML 需要从 CDN 加载 reveal.js 与样式表**，违背本站「无外部请求」的底线，因此不放进选项。`pptx` 在这个构建下实测输出为 0 字节，同样排除。宁可少一个功能，也不提供一个跑不起来或会偷偷联网的东西。

## 工程实现要点

- **不让 Rollup 打包 pandoc-wasm**：它的浏览器入口在 import 时就把 56MB wasm 一次性拉下来且带顶层 await，无法接入本站「进度 + 取消 + Cache 缓存」体系。做法与 imgly / mermaid 一致：`public/wasm/pandoc.wasm` 自托管（gitignore，由 `scripts/fetch-pandoc-assets.mjs` 从 npm 包复制），组件运行时经 worker 实例化。
- Vite 里用别名 `pandoc-wasm-core` 直取包内 `src/core.js`——该包的 `exports` 限制了深导入，不借别名拿不到纯逻辑部分。
- 转换跑在 Web Worker：FCCT 初始化与转换都是重活，放主线程会卡界面。
- **空 `input-files` 陷阱**：选项里带空数组的 `input-files` 会让 pandoc 走「无输入文件」分支，产出残缺文件（docx 体积明显偏小、回读为空）。worker 会把这个键删掉。
- **extract-media 此前是空头支票**：勾选后 pandoc 确实会生成 `media.zip`，但旧版 worker 只转发 `output-file`，媒体包被静默丢弃。现已改为同时交付，并以「是否真的解出 media.zip」作为界面提示的依据（比在输出文本里正则猜图片引用可靠）。

## 隐私

所有转换在本地完成，文档内容不会离开设备；引擎 wasm 从本站同域下载，无第三方请求。
