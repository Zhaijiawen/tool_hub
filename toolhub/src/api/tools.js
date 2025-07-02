// 工具API - 前端本地实现

// 工具列表数据
const tools = [
  // 格式化工具
  {
    id: 'json',
    name: 'format.json.title',
    path: '/format/json',
    description: 'format.json.description',
    category: 'format'
  },
  {
    id: 'xml',
    name: 'format.xml.title',
    path: '/format/xml',
    description: 'format.xml.description',
    category: 'format'
  },
  {
    id: 'yaml',
    name: 'format.yaml.title',
    path: '/format/yaml',
    description: 'format.yaml.description',
    category: 'format'
  },
  {
    id: 'js',
    name: 'format.js.title',
    path: '/format/js',
    description: 'format.js.description',
    category: 'format'
  },
  {
    id: 'html',
    name: 'format.html.title',
    path: '/format/html',
    description: 'format.html.description',
    category: 'format'
  },
  {
    id: 'css',
    name: 'format.css.title',
    path: '/format/css',
    description: 'format.css.description',
    category: 'format'
  },
  {
    id: 'java',
    name: 'format.java.title',
    path: '/format/java',
    description: 'format.java.description',
    category: 'format'
  },
  {
    id: 'php',
    name: 'format.php.title',
    path: '/format/php',
    description: 'format.php.description',
    category: 'format'
  },
  {
    id: 'ruby',
    name: 'format.ruby.title',
    path: '/format/ruby',
    description: 'format.ruby.description',
    category: 'format'
  },
  {
    id: 'shell',
    name: 'format.shell.title',
    path: '/format/shell',
    description: 'format.shell.description',
    category: 'format'
  },
  {
    id: 'sql',
    name: 'format.sql.title',
    path: '/format/sql',
    description: 'format.sql.description',
    category: 'format'
  },
  {
    id: 'markdown',
    name: 'format.markdown.title',
    path: '/format/markdown',
    description: 'format.markdown.description',
    category: 'format'
  },
  {
    id: 'vue',
    name: 'format.vue.title',
    path: '/format/vue',
    description: 'format.vue.description',
    category: 'format'
  },

  // 加密工具
  {
    id: 'aes',
    name: 'encrypt.aes.title',
    path: '/encrypt/aes',
    description: 'encrypt.aes.description',
    category: 'encrypt'
  },
  {
    id: 'chacha20',
    name: 'encrypt.chacha20.title',
    path: '/encrypt/chacha20',
    description: 'encrypt.chacha20.description',
    category: 'encrypt'
  },
  {
    id: 'des',
    name: 'encrypt.des.title',
    path: '/encrypt/des',
    description: 'encrypt.des.description',
    category: 'encrypt'
  },
  {
    id: 'rsa',
    name: 'encrypt.rsa.title',
    path: '/encrypt/rsa',
    description: 'encrypt.rsa.description',
    category: 'encrypt'
  },
  {
    id: 'ecc',
    name: 'encrypt.ecc.title',
    path: '/encrypt/ecc',
    description: 'encrypt.ecc.description',
    category: 'encrypt'
  },
  {
    id: 'sha',
    name: 'encrypt.sha.title',
    path: '/encrypt/sha',
    description: 'encrypt.sha.description',
    category: 'encrypt'
  },
  {
    id: 'bcrypt',
    name: 'encrypt.bcrypt.title',
    path: '/encrypt/bcrypt',
    description: 'encrypt.bcrypt.description',
    category: 'encrypt'
  },
  {
    id: 'argon2',
    name: 'encrypt.argon2.title',
    path: '/encrypt/argon2',
    description: 'encrypt.argon2.description',
    category: 'encrypt'
  },
  {
    id: 'ecdh-key-exchange',
    name: 'encrypt.ecdh-key-exchange.title',
    path: '/encrypt/ecdh-key-exchange',
    description: 'encrypt.ecdh-key-exchange.description',
    category: 'encrypt'
  },
  {
    id: 'x25519',
    name: 'encrypt.x25519.title',
    path: '/encrypt/x25519',
    description: 'encrypt.x25519.description',
    category: 'encrypt'
  },
  {
    id: 'rsa-sign',
    name: 'encrypt.rsa-sign.title',
    path: '/encrypt/rsa-sign',
    description: 'encrypt.rsa-sign.description',
    category: 'encrypt'
  },
  {
    id: 'ecdsa-sign',
    name: 'encrypt.ecdsa-sign.title',
    path: '/encrypt/ecdsa-sign',
    description: 'encrypt.ecdsa-sign.description',
    category: 'encrypt'
  },
  {
    id: 'ed25519-sign',
    name: 'encrypt.ed25519-sign.title',
    path: '/encrypt/ed25519-sign',
    description: 'encrypt.ed25519-sign.description',
    category: 'encrypt'
  },
  {
    id: 'base64',
    name: 'encrypt.base64.title',
    path: '/encrypt/base64',
    description: 'encrypt.base64.description',
    category: 'encrypt'
  },
  {
    id: 'hex',
    name: 'encrypt.hex.title',
    path: '/encrypt/hex',
    description: 'encrypt.hex.description',
    category: 'encrypt'
  },
  {
    id: 'url',
    name: 'encrypt.url.title',
    path: '/encrypt/url',
    description: 'encrypt.url.description',
    category: 'encrypt'
  },
  {
    id: 'html',
    name: 'encrypt.html.title',
    path: '/encrypt/html',
    description: 'encrypt.html.description',
    category: 'encrypt'
  },
  {
    id: 'jwt',
    name: 'encrypt.jwt.title',
    path: '/encrypt/jwt',
    description: 'encrypt.jwt.description',
    category: 'encrypt'
  },

  // 转换工具
  {
    id: 'timestamp',
    name: 'convert.timestamp.title',
    path: '/convert/timestamp',
    description: 'convert.timestamp.description',
    category: 'convert'
  },
  {
    id: 'dateCalc',
    name: 'convert.dateCalc.title',
    path: '/convert/date-calc',
    description: 'convert.dateCalc.description',
    category: 'convert'
  },
  {
    id: 'dateDiff',
    name: 'convert.dateDiff.title',
    path: '/convert/date-diff',
    description: 'convert.dateDiff.description',
    category: 'convert'
  },
  {
    id: 'number',
    name: 'convert.number.title',
    path: '/convert/number',
    description: 'convert.number.description',
    category: 'convert'
  },
  {
    id: 'number-base',
    name: 'convert.numberBase.title',
    path: '/convert/number-base',
    description: 'convert.numberBase.description',
    category: 'convert'
  },
  {
    id: 'storage-time',
    name: 'convert.storageTime.title',
    path: '/convert/storage-time',
    description: 'convert.storageTime.description',
    category: 'convert'
  },
  {
    id: 'unit',
    name: 'convert.unit.title',
    path: '/convert/unit',
    description: 'convert.unit.description',
    category: 'convert'
  },
  {
    id: 'color',
    name: 'convert.color.title',
    path: '/convert/color',
    description: 'convert.color.description',
    category: 'convert'
  },
  {
    id: 'regex',
    name: 'convert.regex.title',
    path: '/convert/regex',
    description: 'convert.regex.description',
    category: 'convert'
  },
  {
    id: 'markdown',
    name: 'convert.markdown.title',
    path: '/convert/markdown',
    description: 'convert.markdown.description',
    category: 'convert'
  },
  {
    id: 'http-status',
    name: 'convert.httpStatus.title',
    path: '/convert/http-status',
    description: 'convert.httpStatus.description',
    category: 'convert'
  },
  {
    id: 'user-agent',
    name: 'convert.userAgent.title',
    path: '/convert/user-agent',
    description: 'convert.userAgent.description',
    category: 'convert'
  },
  {
    id: 'char-code',
    name: 'convert.charCode.title',
    path: '/convert/char-code',
    description: 'convert.charCode.description',
    category: 'convert'
  },

  // 图片工具
  {
    id: 'convert',
    name: 'image.convert.title',
    path: '/image/convert',
    description: 'image.convert.description',
    category: 'image'
  },
  {
    id: 'rotate',
    name: 'image.rotate.title',
    path: '/image/rotate',
    description: 'image.rotate.description',
    category: 'image'
  },
  {
    id: 'crop',
    name: 'image.crop.title',
    path: '/image/crop',
    description: 'image.crop.description',
    category: 'image'
  },
  {
    id: 'watermark',
    name: 'image.watermark.title',
    path: '/image/watermark',
    description: 'image.watermark.description',
    category: 'image'
  },

  // 文本工具
  {
    id: 'case',
    name: 'text.case.title',
    path: '/text/case',
    description: 'text.case.description',
    category: 'text'
  },
  {
    id: 'reverse',
    name: 'text.reverse.title',
    path: '/text/reverse',
    description: 'text.reverse.description',
    category: 'text'
  },
  {
    id: 'whitespace',
    name: 'text.whitespace.title',
    path: '/text/whitespace',
    description: 'text.whitespace.description',
    category: 'text'
  },
  {
    id: 'replace',
    name: 'text.replace.title',
    path: '/text/replace',
    description: 'text.replace.description',
    category: 'text'
  },

  // 其他工具
  {
    id: 'qrcode',
    name: 'other.qrcode.title',
    path: '/other/qrcode',
    description: 'other.qrcode.description',
    category: 'other'
  },
  {
    id: 'calculator',
    name: 'other.calculator.title',
    path: '/other/calculator',
    description: 'other.calculator.description',
    category: 'other'
  }
]

/**
 * 获取所有工具
 * @param {string} locale - 语言环境 (保持接口兼容性)
 * @returns {Promise<Array>} 工具列表
 */
export async function getAllTools(locale = 'zh-CN') {
  // 直接返回工具数据，国际化由调用组件处理
  return Promise.resolve(tools)
}

/**
 * 按分类获取工具
 * @param {string} category - 工具分类
 * @param {string} locale - 语言环境
 * @returns {Promise<Array>} 工具列表
 */
export async function getToolsByCategory(category, locale = 'zh-CN') {
  const filteredTools = tools.filter(tool => tool.category === category)
  return Promise.resolve(filteredTools)
}

/**
 * 搜索工具
 * @param {string} keyword - 搜索关键词
 * @param {string} locale - 语言环境
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchTools(keyword, locale = 'zh-CN') {
  const filteredTools = tools.filter(tool => {
    const searchText = keyword.toLowerCase()
    return (
      tool.name.toLowerCase().includes(searchText) ||
      tool.description.toLowerCase().includes(searchText) ||
      tool.id.toLowerCase().includes(searchText)
    )
  })
  return Promise.resolve(filteredTools)
} 