# ToolHub 项目长期记忆

## 技术栈与环境事实

- **包管理器是 npm，不是 pnpm**。仓库根有 `package-lock.json`（lockfileVersion 3），无 `pnpm-lock.yaml`，`package.json` 无 `packageManager` 字段。所有安装/构建命令用 npm。
- 构建工具：Vite（`toolhub/` 子目录），UI 为 Vue 3 + naive-ui + vue-i18n，构建产物在 `toolhub/dist`。
- 生产部署依赖 `toolhub/public/_headers` 下发 COOP/COEP（`same-origin` + `credentialless`）以启用 SharedArrayBuffer；`vite.config.js` 的 `server.headers` 已与之对齐。本地静态预览必须自行补这两个响应头，否则多线程 wasm 静默降级为单线程。

## 依赖版本约束（踩过坑，勿轻易改动）

- **onnxruntime-web 必须双版本共存**，这是硬约束不是冗余：
  - `@xenova/transformers@2.17.2` 在 dependencies 中**硬 pin `onnxruntime-web@1.14.0`**。ort 自 1.17 起把 `Tensor.data` 改为原型 getter（自有数据存于 `cpuData`），而 transformers 用 `Object.assign(super, new ONNXTensor(...))` 浅拷贝 ONNX Tensor，拷不到 `data`，迭代 encoder 输出张量时抛 `Cannot use 'in' operator to search for 'subarray' in undefined`。
  - `@imgly/background-removal`（AI 抠图）走 `onnxruntime-web/webgpu` 子路径，其 peerDependency 精确要求 **1.21.0**。
  - 布局：顶层 1.21.0 供 imgly，嵌套 1.14.0 于 `@xenova/transformers/node_modules/` 供 transformers 推理。
  - **绝对不要给裸限定符 `onnxruntime-web` 加 vite alias**（2026-10-18 已删除曾加过的别名）。原因有二：①它会把 imgly 的 `import("onnxruntime-web")` 一并劫持到 1.14，与其自托管的 1.21 wasm 版本不匹配，session 创建直接失败；②**该别名对 transformers 本就无效**——transformers 的 dist 是 webpack 预打包，内部以**路径字符串** `"./node_modules/onnxruntime-web/dist/ort-web.min.js"` 硬引用，alias 管不到；而 `ort-web.min.js` 只存在于 1.14.x（1.17+ 已改名），顶层 1.21 里没有该文件，所以这个路径天然只会命中嵌套的 1.14.0。给 webpack 预打包的库加 alias 前，先确认它用的是模块解析还是路径字符串。
  - `package.json` 中顶层声明为精确 `"onnxruntime-web": "1.21.0"`（不加 `^`，避免 peer 解析漂移）。
- **imgly（AI 抠图）的两条硬性要求**，改动前必读：
  - `publicPath` 必须是**绝对 URL**：imgly 内部 `new URL("resources.json", publicPath)`，传相对路径会抛 `Failed to construct 'URL': Invalid base URL`。正确写法 `new URL('/imgly-bg/', location.origin).toString()`。
  - 站点根 `/onnxruntime-web/` 下必须有 `ort-wasm-simd-threaded.wasm` / `.mjs`（及 jsep 变体）。imgly 把 `ort.env.wasm.numThreads` 硬编码为 `hardwareConcurrency`，多线程 pthread 代理在 Worker 内无法沿用 blob URL，会回退到这个**站点根**硬编码路径；路径不存在时 SPA fallback 返回 index.html，wasm 实例化报 `expected magic word 00 61 73 6d, found 3c 21 64 6f`（即 `<!do`）。用 `scripts/assemble-imgly-resources.mjs` 从 `/imgly-bg/resources.json` 按 chunks/offsets 重组生成（输出到 `public/onnxruntime-web/`，**不是** publicPath 下）。
- **`package-lock.json` 必须提交**（2026-10-18 已从 .gitignore 移除该规则）。手工 `npm install` 造出的嵌套结构若不入锁文件，只是「本机恰好能跑」。**验收标准是 `npm ci` 后依赖布局等价，而非当前 node_modules 看起来正常。**
- ort 1.14 的 emscripten 胶水**内联在包 JS 内**，无独立 `.mjs` 线程代理文件；`scripts/fetch-whisper-assets.mjs` 取两个 `.wasm` 变体（`ort-wasm-simd-threaded.wasm` / `ort-wasm-simd.wasm`）即可。

## 组件约定（踩坑沉淀，改 upload 前必读）

- **naive-ui `n-upload` + `:max` 的静默丢弃是跨组件的系统性坑**。判定方法：`grep ':max="' src/components` 找出全部用法，再看每个是否用了 `v-model:file-list`。
  - **受控**（有 `v-model:file-list`）→ 安全，重置 `fileList.value = []` 即可。
  - **非受控 + 有 `:max`** → 内部 `uncontrolledFileListRef` 持续占用 max 名额，第二次选择被 `slice(0, max - len)` 丢成空数组，**不报错、无提示**。修法：`ref="uploadRef"` + 在文件成功进入组件状态后调 `uploadRef.value?.clear()`。
  - 已修：SpeechToText / Rotate / Watermark / Crop / CsvViewer / Convert。`FileHash.vue` 是正确范本（`v-model` + `ref` + `clear`）。
  - 排查时注意**症状隐蔽性**：Rotate/Watermark/Crop 没有「清空」按钮，用户唯一换图的途径（再选一次）正是失效路径，选错后完全无法纠正。

## 已知未验证项

- **AI 抠图已在浏览器内端到端验证通过**（2026-10-18）：真实点击「去除背景」后 4s 完成，输出 11906 字节 RGBA PNG（colorType=6，尺寸与原图一致），UI 正常显示对比视图。此前该功能因 publicPath 相对路径 + pthread 代理路径缺失 + vite alias 劫持 ort 导入而**从未真正成功过**（三个问题叠加）。
- `public/imgly-bg/` 是 **imgly 的分片缓存格式**，不是直接可用的模型文件：87 个文件全是 4MB 切片、按 sha256 内容寻址命名，真正的索引是 `resources.json`（记录每逻辑文件的 chunks/offsets/size/mime，共 7 个逻辑文件：3 个模型 + 2 个 ort wasm + 2 个 .mjs 胶水）。要离线校验模型须按 offsets 重组。
- **`isnet_quint8` 输入必须是 1024×1024**，不是 ISNet 论文默认的 320，ORT 会直接报 `Expected: 1024`。
- pandoc 工具未做实机验证。


## 实机验证方法论（agent-browser）

- 页面路由前缀是分类名（`/media/speech-to-text`、`/ai/bg-removal`），**不是** `/tools/xxx`。用错路径时 SEO title 仍正确但路由视图为空，易误判为渲染故障。
- **取元素 ref 必须用 `snapshot -i`**（交互元素模式）；默认 `snapshot` 在这些页面返回空。这个版本的浏览器窗口**视口高度仅 577px**，页面下方元素在视口外，CDP 点击会打空且不报错——`scrollintoview` 会报成功但 `scrollY` 仍为 0，必须显式 `window.scrollTo(0, N)`。**点击"无效"时先用 `elementFromPoint` 确认元素在视口内，再怀疑 ref 失效**。可用捕获阶段 `addEventListener('click', ..., true)` 自检事件是否真的到达。
- 生产构建剥离了 `__vueParentComponent`，无法从外部调用组件方法。必要时临时在组件里挂 `window.__xxxState` 钩子取证，**验证完必须移除并重建**（diff 里确认钩子已清干净）。
- 测试服务器需自行下发 COOP/COEP，否则 `crossOriginIsolated: false`，多线程 wasm 降级。
- **合成 DOM 事件对部分组件无效**：n-select 下拉面板不展开、Vue 的 `@change`（file input）不触发。文件上传优先用 `upload <sel> <file>` 命令（CDP setFileInputFiles），对 `display:none` 的隐藏 input 可能无效——改用页面自带的可见上传区（n-upload）而非隐藏 input。
- 检查选择器时注意 naive-ui 类名：只传 `title` 的 `n-alert` 实际类名是 `n-alert n-alert--show-icon`，**不带** `n-alert--warning`/`--error` 修饰类。
- Bash 工具的管道在沙箱下行为不稳（`ls | grep` 可能返回空而 `ls -lh | grep` 正常；awk 会错位丢文件名），列文件名优先用 Glob/ls -1。`$(cmd | grep ... | grep -o ...)` 提取 ref 容易静默失败，**已知 ref 时直接写死**更可靠。
- 模型音频样本**不能只靠 Node harness 判定**：同一 fr.wav 在浏览器（Web Audio 重采样）能识别出 139 字符，在 Node（手写 WAV 解码器）返回空。
