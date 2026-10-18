# ToolHub 项目长期记忆

## 技术栈与环境事实

- **包管理器是 npm，不是 pnpm**。仓库根有 `package-lock.json`（lockfileVersion 3），无 `pnpm-lock.yaml`，`package.json` 无 `packageManager` 字段。所有安装/构建命令用 npm。
- 构建工具：Vite（`toolhub/` 子目录），UI 为 Vue 3 + naive-ui + vue-i18n，构建产物在 `toolhub/dist`。
- 生产部署依赖 `toolhub/public/_headers` 下发 COOP/COEP（`same-origin` + `credentialless`）以启用 SharedArrayBuffer；`vite.config.js` 的 `server.headers` 已与之对齐。本地静态预览必须自行补这两个响应头，否则多线程 wasm 静默降级为单线程。

## 依赖版本约束（踩过坑，勿轻易改动）

- **onnxruntime-web 必须双版本共存**，这是硬约束不是冗余：
  - `@xenova/transformers@2.17.2` 在 dependencies 中**硬 pin `onnxruntime-web@1.14.0`**。ort 自 1.17 起把 `Tensor.data` 改为原型 getter（自有数据存于 `cpuData`），而 transformers 用 `Object.assign(super, new ONNXTensor(...))` 浅拷贝 ONNX Tensor，拷不到 `data`，迭代 encoder 输出张量时抛 `Cannot use 'in' operator to search for 'subarray' in undefined`。
  - `@imgly/background-removal`（AI 抠图）走 `onnxruntime-web/webgpu` 子路径，其 peerDependency 精确要求 **1.21.0**。
  - 布局：顶层 1.21.0 供 imgly，嵌套 1.14.0 于 `@xenova/transformers/node_modules/` 供 transformers 推理；`vite.config.js` 用正则 alias `/^onnxruntime-web$/`（**必须锚定裸限定符**，否则会连带重写 `onnxruntime-web/webgpu` 子路径）指向嵌套版的 `dist/ort.wasm.min.js`。
  - `package.json` 中顶层声明为精确 `"onnxruntime-web": "1.21.0"`（不加 `^`，避免 peer 解析漂移）。
- **`package-lock.json` 必须提交**（2026-10-18 已从 .gitignore 移除该规则）。手工 `npm install` 造出的嵌套结构若不入锁文件，只是「本机恰好能跑」。**验收标准是 `npm ci` 后依赖布局等价，而非当前 node_modules 看起来正常。**
- ort 1.14 的 emscripten 胶水**内联在包 JS 内**，无独立 `.mjs` 线程代理文件；`scripts/fetch-whisper-assets.mjs` 取两个 `.wasm` 变体（`ort-wasm-simd-threaded.wasm` / `ort-wasm-simd.wasm`）即可。

## 已知未验证项

- **AI 抠图（@imgly/background-removal）已通过 Node 等价推理验证**（2026-10-18）：分片重组 7/7 通过、`isnet_quint8` 真实前向输出前景占比 23.5%（理论 19.2%）吻合。**仍未覆盖的只有浏览器内 imgly 自身的 wasm/webgpu 后端调度**——需真实点击 UI，而 agent-browser 合成事件对该页面无效。
- `public/imgly-bg/` 是 **imgly 的分片缓存格式**，不是直接可用的模型文件：87 个文件全是 4MB 切片、按 sha256 内容寻址命名，真正的索引是 `resources.json`（记录每逻辑文件的 chunks/offsets/size/mime，共 7 个逻辑文件：3 个模型 + 2 个 ort wasm + 2 个 .mjs 胶水）。要离线校验模型须按 offsets 重组。
- **`isnet_quint8` 输入必须是 1024×1024**，不是 ISNet 论文默认的 320，ORT 会直接报 `Expected: 1024`。
- pandoc 工具未做实机验证。


## 实机验证方法论（agent-browser）

- 页面路由前缀是分类名（`/media/speech-to-text`、`/ai/bg-removal`），**不是** `/tools/xxx`。用错路径时 SEO title 仍正确但路由视图为空，易误判为渲染故障。
- 测试服务器需自行下发 COOP/COEP，否则 `crossOriginIsolated: false`，多线程 wasm 降级。
- **合成事件对部分 naive-ui 组件无效**：n-select 下拉面板不展开、n-button 的 Vue handler 不触发（pointerdown/mousedown/click 全序列派发 + scrollIntoView 后仍无效）。生产构建剥离了 `__vueParentComponent`，无法从外部调用组件方法。遇到此类交互应改用底层逻辑验证（直接 import worker/chunk 驱动），不要反复尝试点击。
- 检查选择器时注意 naive-ui 类名：只传 `title` 的 `n-alert` 实际类名是 `n-alert n-alert--show-icon`，**不带** `n-alert--warning`/`--error` 修饰类。
- Bash 工具的管道在沙箱下行为不稳（`ls | grep` 可能返回空而 `ls -lh | grep` 正常；awk 会错位丢文件名），列文件名优先用 Glob/ls -1。
- 模型音频样本**不能只靠 Node harness 判定**：同一 fr.wav 在浏览器（Web Audio 重采样）能识别出 139 字符，在 Node（手写 WAV 解码器）返回空。
