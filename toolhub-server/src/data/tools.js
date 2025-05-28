const tools = [
  // 格式化工具
  {
    name: 'JSON 格式化',
    path: '/tools/json-format',
    description: '格式化、压缩和验证 JSON 数据',
    category: '格式化'
  },
  {
    name: 'SQL 格式化',
    path: '/tools/sql-format',
    description: '格式化 SQL 查询语句',
    category: '格式化'
  },
  {
    name: 'XML 格式化',
    path: '/tools/xml-format',
    description: '格式化 XML 文档',
    category: '格式化'
  },
  {
    name: 'YAML 格式化',
    path: '/tools/yaml-format',
    description: '格式化 YAML 文档',
    category: '格式化'
  },
  {
    name: 'Markdown 预览',
    path: '/tools/markdown-preview',
    description: '实时预览 Markdown 文档',
    category: '格式化'
  },
  {
    name: '代码格式化',
    path: '/tools/code-format',
    description: '支持多种编程语言的代码格式化',
    category: '格式化'
  },
  {
    name: 'CSS 格式化',
    path: '/tools/css-format',
    description: '格式化 CSS 样式代码',
    category: '格式化'
  },
  {
    name: 'HTML 格式化',
    path: '/tools/html-format',
    description: '格式化 HTML 文档',
    category: '格式化'
  },
  {
    name: 'Vue 格式化',
    path: '/tools/vue-format',
    description: '格式化 Vue 单文件组件',
    category: '格式化'
  },

  // 加密工具
  {
    name: 'MD5 加密',
    path: '/tools/md5',
    description: '计算文本的 MD5 哈希值',
    category: '加密'
  },
  {
    name: 'SHA 加密',
    path: '/tools/sha',
    description: '计算文本的 SHA 系列哈希值',
    category: '加密'
  },
  {
    name: 'Base64 编解码',
    path: '/tools/base64',
    description: 'Base64 编码和解码工具',
    category: '加密'
  },

  // 转换工具
  {
    name: '时间戳转换',
    path: '/tools/timestamp',
    description: '时间戳与日期时间互转',
    category: '转换'
  },
  {
    name: '进制转换',
    path: '/tools/radix',
    description: '二进制、八进制、十进制、十六进制互转',
    category: '转换'
  },
  {
    name: '单位转换',
    path: '/tools/unit',
    description: '长度、重量、面积等单位转换',
    category: '转换'
  },

  // 图片工具
  {
    name: '图片压缩',
    path: '/tools/image-compress',
    description: '压缩图片大小，保持质量',
    category: '图片'
  },
  {
    name: '图片格式转换',
    path: '/tools/image-convert',
    description: '支持多种图片格式互转',
    category: '图片'
  },
  {
    name: '图片裁剪',
    path: '/tools/image-crop',
    description: '在线裁剪和调整图片尺寸',
    category: '图片'
  },

  // 文本工具
  {
    name: '文本对比',
    path: '/tools/text-diff',
    description: '比较两段文本的差异',
    category: '文本'
  },
  {
    name: '文本统计',
    path: '/tools/text-stats',
    description: '统计文本字数、行数等信息',
    category: '文本'
  },
  {
    name: '文本替换',
    path: '/tools/text-replace',
    description: '批量替换文本内容',
    category: '文本'
  },

  // 其他工具
  {
    name: '二维码生成',
    path: '/tools/qrcode',
    description: '生成和解析二维码',
    category: '其他'
  },
  {
    name: '颜色选择器',
    path: '/tools/color-picker',
    description: '颜色选择和格式转换',
    category: '其他'
  },
  {
    name: '正则表达式',
    path: '/tools/regex',
    description: '正则表达式测试和验证',
    category: '其他'
  }
];

module.exports = tools; 