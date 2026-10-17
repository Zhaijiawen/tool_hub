// 开源许可与版权声明相关文本 - 避免i18n转义问题
export const licensesText = {
  'zh-CN': {
    title: '开源许可与版权声明',
    seo: {
      title: '开源许可 - ToolHub 开发者工具箱',
      description: 'ToolHub 使用的开源组件许可声明，含 MuPDF (AGPL-3.0)、FFmpeg (GPL-2.0+)、@imgly/background-removal (AGPL-3.0) 与 Potrace (GPL-2.0) 的版权与对应源代码提供说明。',
      keywords: '开源许可,AGPL,GPL,MuPDF,FFmpeg,imgly,Potrace,版权,源代码,ToolHub'
    },
    intro: 'ToolHub 是一个 100% 前端、在浏览器本地运行的工具站点。我们在部分工具中以 WebAssembly 形式集成了开源组件。依据相应开源许可证的要求，我们在此声明这些组件的版权信息，并提供其对应源代码的获取方式。本页面不构成法律意见。',
    general: {
      title: '一、总体说明',
      desc: '除下列具有"强 copyleft"源码提供义务的组件外，本站其余依赖（如 Vue、Naive UI、CodeMirror 等）多为 MIT / Apache-2.0 / BSD 等宽松许可证，仅须保留版权与许可声明，已在仓库 package.json 中记录。本页重点说明需要向用户主动提供源代码的组件。',
      repo: '本站全部源代码（含对下列组件的封装 / 胶水适配修改）均开源于：',
      repoUrl: 'https://github.com/Zhaijiawen/tool_hub'
    },
    mupdf: {
      title: '二、MuPDF（PDF 工具集，AGPL-3.0）',
      desc: 'PDF 工具集（转图片 / 合并 / 拆分）基于 MuPDF 渲染与处理引擎。MuPDF 由 Artifex Software, Inc. 开发，以 GNU Affero General Public License v3.0（AGPL-3.0）授权。AGPL-3.0 第 13 条（Remote Network Interaction）要求：通过网络与受该许可证覆盖的程序交互的用户，有权获取其对应的完整源代码。',
      version: '使用版本：mupdf@1.28.1（官方 npm 构建，wasm 约 9.9MB）。',
      upstream: 'MuPDF 上游源代码：',
      upstreamUrl: 'https://mupdf.com/',
      modified: '我们对 MuPDF 的 JavaScript 封装层（mupdf.js / mupdf-wasm.js）做了适配性修改（去除顶层 await 以兼容构建目标），该修改部分的对应源代码已随本站仓库一同开源提供。',
      license: 'AGPL-3.0 许可证文本：',
      licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.html'
    },
    ffmpeg: {
      title: '三、FFmpeg（音视频工具集，GPL-2.0 或更高版本）',
      desc: '音视频处理（转码 / 提取音频 / 转 GIF）基于 FFmpeg。由于构建时启用了 --enable-gpl 与 --enable-libx264（x264 为 GPL-2.0+），整个 FFmpeg 核心以 GNU General Public License v2.0 或更高版本（GPL-2.0+）授权。GPL 要求在分发该二进制时提供其完整对应源代码。',
      version: '使用版本：@ffmpeg/core@0.12.10（基于 FFmpeg 5.1.4）+ @ffmpeg/ffmpeg@0.12.15。',
      upstream: 'FFmpeg 上游源代码：',
      upstreamUrl: 'https://github.com/FFmpeg/FFmpeg',
      x264: 'libx264 源代码：',
      x264Url: 'https://code.videolan.org/videolan/x264',
      modified: '我们对 FFmpeg 胶水层（ffmpeg-core.js）做了适配性修改（注入 wasm 字节以避免重复下载），该修改部分的对应源代码已随本站仓库一同开源提供。',
      license: 'GPL-2.0 许可证文本：',
      licenseUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html'
    },
    imgly: {
      title: '四、@imgly/background-removal（AI 抠图，AGPL-3.0）',
      desc: 'AI 抠图基于 IMG.LY 的 background-removal-js，以 GNU Affero General Public License v3.0（AGPL-3.0）授权。该库以 ONNX Runtime Web 在本地浏览器运行 ISNet 模型完成前景分割。依据 AGPL-3.0 第 13 条，我们在此提供其对应源代码的获取方式。',
      version: '使用版本：@imgly/background-removal@1.7.0（模型权重约 334MB，由本站自托管于同域 /imgly-bg/ 路径，运行时直接本地下载，不经过任何第三方 CDN）。',
      upstream: '项目上游源代码：',
      upstreamUrl: 'https://github.com/imgly/background-removal-js',
      modified: '我们以 npm 官方构建形式原样引入，未修改其源码；仅通过配置项将模型权重的加载路径指向本站自托管地址（同域名），避免向第三方 CDN 发起请求。',
      license: 'AGPL-3.0 许可证文本：',
      licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.html'
    },
    potrace: {
      title: '五、Potrace（图片转 SVG，GPL-2.0）',
      desc: '图片转 SVG 使用 Potrace 位图追踪算法。Potrace 由 Peter Selinger 开发，以 GNU General Public License v2.0（GPL-2.0）授权；本项目所用的 potrace-wasm 为 Potrace 的 Emscripten / WebAssembly 移植（wasm 已内联在包内，无需额外下载）。GPL 要求在分发该二进制时提供其完整对应源代码。',
      version: '使用版本：potrace-wasm@1.0.4（内含 wasm 约 230KB）。',
      upstream: 'Potrace 上游源代码：',
      upstreamUrl: 'http://potrace.sourceforge.net/',
      wasmPort: 'potrace-wasm 移植版本源代码：',
      wasmPortUrl: 'https://github.com/IguteChung/potrace-wasm',
      modified: '我们以 npm 官方构建形式原样引入 potrace-wasm，未修改其源码；本站仅在其上层做了图片二值化预处理（阈值 / 反色）后再送入引擎。',
      license: 'GPL-2.0 许可证文本：',
      licenseUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html'
    },
    duty: {
      title: '六、源代码提供方式',
      desc: '对于上述受 AGPL-3.0 / GPL-2.0+ / GPL-2.0 覆盖的组件，您可通过以下任一方式获取其对应源代码：（1）访问本站开源仓库，获取我们对胶水 / 封装层的修改；（2）访问上述各组件的上游仓库，获取其原始源代码。如需以物理介质形式获取，或对源码提供有任何疑问，可通过仓库 Issues 联系我们。'
    },
    disclaimer: {
      title: '免责声明',
      desc: '本页面仅用于履行开源许可证项下的声明与源代码提供义务，不构成法律意见。如您对许可证的适用性存在疑问，请自行咨询法律专业人士。'
    }
  },
  'en-US': {
    title: 'Open Source Licenses & Copyright Notices',
    seo: {
      title: 'Open Source Licenses - ToolHub Developer Toolkit',
      description: 'Open source license notices for ToolHub, including copyright and corresponding-source information for MuPDF (AGPL-3.0), FFmpeg (GPL-2.0+), @imgly/background-removal (AGPL-3.0) and Potrace (GPL-2.0).',
      keywords: 'open source,license,AGPL,GPL,MuPDF,FFmpeg,imgly,Potrace,copyright,source code,ToolHub'
    },
    intro: 'ToolHub is a 100% client-side toolkit that runs entirely in the browser. Some tools integrate open-source components distributed as WebAssembly. In accordance with the relevant open-source licenses, we state the copyright information of these components and provide access to their corresponding source code. This page is not legal advice.',
    general: {
      title: '1. Overview',
      desc: 'Except for the components below that carry a "strong copyleft" source-offer obligation, the rest of our dependencies (e.g. Vue, Naive UI, CodeMirror) are mostly permissively licensed (MIT / Apache-2.0 / BSD), requiring only that copyright and license notices be retained; they are recorded in the repository package.json. This page focuses on the components for which source code must be actively offered to users.',
      repo: 'All of our source code (including the wrapper / glue adaptations of the components below) is open-sourced at:',
      repoUrl: 'https://github.com/Zhaijiawen/tool_hub'
    },
    mupdf: {
      title: '2. MuPDF (PDF tools, AGPL-3.0)',
      desc: 'The PDF toolset (to image / merge / split) is based on the MuPDF rendering and processing engine. MuPDF is developed by Artifex Software, Inc. and licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). AGPL-3.0 §13 (Remote Network Interaction) requires that users who interact with a covered program over a network be offered the corresponding complete source code.',
      version: 'Version used: mupdf@1.28.1 (official npm build, wasm ~9.9MB).',
      upstream: 'MuPDF upstream source:',
      upstreamUrl: 'https://mupdf.com/',
      modified: 'We made adaptive modifications to MuPDF\'s JavaScript wrapper layer (mupdf.js / mupdf-wasm.js) — removing top-level await to match our build target. The corresponding source of these modifications is provided alongside this site\'s repository.',
      license: 'AGPL-3.0 license text:',
      licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.html'
    },
    ffmpeg: {
      title: '3. FFmpeg (audio/video tools, GPL-2.0 or later)',
      desc: 'Audio/video processing (transcode / audio extraction / GIF) is based on FFmpeg. Because the build enables --enable-gpl and --enable-libx264 (x264 is GPL-2.0+), the whole FFmpeg core is licensed under the GNU General Public License v2.0 or later (GPL-2.0+). The GPL requires that the complete corresponding source be offered when the binary is conveyed.',
      version: 'Version used: @ffmpeg/core@0.12.10 (based on FFmpeg 5.1.4) + @ffmpeg/ffmpeg@0.12.15.',
      upstream: 'FFmpeg upstream source:',
      upstreamUrl: 'https://github.com/FFmpeg/FFmpeg',
      x264: 'libx264 source:',
      x264Url: 'https://code.videolan.org/videolan/x264',
      modified: 'We made an adaptive modification to FFmpeg\'s glue layer (ffmpeg-core.js) — injecting the wasm bytes to avoid re-downloading. The corresponding source of this modification is provided alongside this site\'s repository.',
      license: 'GPL-2.0 license text:',
      licenseUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html'
    },
    imgly: {
      title: '4. @imgly/background-removal (AI background removal, AGPL-3.0)',
      desc: 'AI background removal is based on background-removal-js by IMG.LY, licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). It runs the ISNet model locally in the browser via ONNX Runtime Web for foreground segmentation. Under AGPL-3.0 §13 we provide access to its corresponding source code here.',
      version: 'Version used: @imgly/background-removal@1.7.0. The model weights (~334MB) are self-hosted on this site under the same-origin /imgly-bg/ path — they are downloaded directly from our own domain, never from a third-party CDN.',
      upstream: 'Project upstream source:',
      upstreamUrl: 'https://github.com/imgly/background-removal-js',
      modified: 'We use the official npm build unmodified; we only configure the model weight path to our self-hosted origin.',
      license: 'AGPL-3.0 license text:',
      licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.html'
    },
    potrace: {
      title: '5. Potrace (image to SVG, GPL-2.0)',
      desc: 'Image to SVG uses the Potrace bitmap tracing algorithm. Potrace was developed by Peter Selinger and is licensed under the GNU General Public License v2.0 (GPL-2.0). The potrace-wasm package used here is an Emscripten / WebAssembly port of Potrace, with the wasm inlined in the bundle so no extra download is required. The GPL requires offering its complete corresponding source when the binary is conveyed.',
      version: 'Version used: potrace-wasm@1.0.4 (inlined wasm ~230KB).',
      upstream: 'Potrace upstream source:',
      upstreamUrl: 'http://potrace.sourceforge.net/',
      wasmPort: 'potrace-wasm port source:',
      wasmPortUrl: 'https://github.com/IguteChung/potrace-wasm',
      modified: 'We use the official potrace-wasm npm build unmodified; we only binarize the image (threshold / invert) before feeding it to the engine.',
      license: 'GPL-2.0 license text:',
      licenseUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html'
    },
    duty: {
      title: '6. How to obtain source code',
      desc: 'For the components covered by AGPL-3.0 / GPL-2.0+ / GPL-2.0 above, you may obtain the corresponding source code by either of the following: (1) visit this site\'s open-source repository for our wrapper / glue modifications; (2) visit each component\'s upstream repository for its original source. If you need the source on physical media, or have any question about source availability, please reach us via the repository Issues.'
    },
    disclaimer: {
      title: 'Disclaimer',
      desc: 'This page is provided solely to fulfill the notice and corresponding-source obligations under the open-source licenses and does not constitute legal advice. If you have doubts about license applicability, please consult a qualified legal professional.'
    }
  }
}

export const getLicensesText = (key, locale = 'zh-CN') => {
  // 支持多种中文 locale 格式
  const isChinese = locale === 'zh-CN' || locale === 'zh' || locale.startsWith('zh')
  const texts = isChinese ? licensesText['zh-CN'] : licensesText['en-US']
  return key.split('.').reduce((obj, k) => obj?.[k], texts) || key
}
