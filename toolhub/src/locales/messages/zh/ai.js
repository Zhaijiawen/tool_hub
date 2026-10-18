// AI 工具
export default {
  ai: {
    tokenCalc: {
      title: "AI Token 计算器",
      description: "计算文本在大语言模型中的 token 数量，并估算 API 费用",
      inputLabel: "输入文本",
      inputPlaceholder: "粘贴或输入要统计的文本 / JSON / 代码...",
      modelLabel: "模型",
      modelPlaceholder: "选择模型",
      tokenCount: "Token 数量",
      charCount: "字符数",
      wordCount: "词数",
      estimateCost: "预估费用",
      copy: "复制",
      clear: "清空",
      pasteSample: "示例",
      errorEmpty: "请输入内容",
      encoding: "分词器",
      note: "纯本地计算，文本不会上传到任何服务器",
      approxNote: "Claude 采用自有分词器，此处 token 数为基于 cl100k_base 的近似值，仅供粗略估算。"
    },
    bgRemoval: {
      title: "AI 抠图",
      description: "在浏览器本地去除图片背景，无需上传服务器",
      uploadHint: "点击或拖拽图片到此处上传",
      chooseBtn: "选择图片",
      changeBtn: "更换图片",
      modelLabel: "模型",
      modelQuint8: "轻量（isnet_quint8，约 40MB，速度快）",
      modelFp16: "高清（isnet_fp16，约 80MB，精度高）",
      removeBtn: "去除背景",
      processing: "处理中…",
      loadingModel: "正在加载模型…",
      resultTitle: "处理结果",
      original: "原图",
      noBg: "去背景后",
      download: "下载 PNG",
      notImage: "请选择图片文件",
      done: "背景已去除",
      error: "处理失败，请换一张图片重试",
      privacyNote: "模型权重自托管在本站，图片仅在本地浏览器内处理，不会上传任何服务器。"
    }
  }
}
