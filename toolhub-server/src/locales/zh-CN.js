export default {
  // 通用
  common: {
    format: '格式化',
    encrypt: '加密',
    convert: '转换',
    image: '图片',
    text: '文本',
    other: '其他',
    more: '更多',
    search: '搜索',
    searchPlaceholder: '搜索工具...',
    noResults: '没有找到相关工具'
  },

  // 格式化工具
  format: {
    json: {
      title: 'JSON 格式化',
      description: '格式化、压缩和验证 JSON 数据'
    },
    xml: {
      title: 'XML 格式化',
      description: '格式化 XML 文档'
    },
    yaml: {
      title: 'YAML 格式化',
      description: '格式化 YAML 文档'
    },
    js: {
      title: 'JavaScript 格式化',
      description: '格式化 JavaScript 代码'
    },
    html: {
      title: 'HTML 格式化',
      description: '格式化 HTML 文档'
    },
    css: {
      title: 'CSS 格式化',
      description: '格式化 CSS 样式'
    },
    java: {
      title: 'Java 格式化',
      description: '格式化 Java 代码'
    },
    php: {
      title: 'PHP 格式化',
      description: '格式化 PHP 代码'
    },
    ruby: {
      title: 'Ruby 格式化',
      description: '格式化 Ruby 代码'
    },
    shell: {
      title: 'Shell 格式化',
      description: '格式化 Shell 脚本'
    },
    sql: {
      title: 'SQL 格式化',
      description: '格式化 SQL 查询'
    },
    markdown: {
      title: 'Markdown 格式化',
      description: '格式化 Markdown 文档'
    },
    vue: {
      title: 'Vue 格式化',
      description: '格式化 .vue 单文件组件代码'
    }
  },

  // 加密工具
  encrypt: {
    aes: {
      title: 'AES 加密',
      description: 'AES 对称加密算法'
    },
    chacha20: {
      title: 'ChaCha20 加密',
      description: 'ChaCha20 流加密算法'
    },
    des: {
      title: 'DES 加密',
      description: 'DES 对称加密算法'
    },
    rsa: {
      title: 'RSA 加密',
      description: 'RSA 非对称加密算法'
    },
    ecc: {
      title: 'ECC 加密',
      description: '椭圆曲线加密'
    },
    ed25519: {
      title: 'Ed25519 加密',
      description: 'Ed25519 数字签名算法'
    },
    sha: {
      title: 'SHA 哈希',
      description: 'SHA 系列哈希算法'
    },
    bcrypt: {
      title: 'Bcrypt 哈希',
      description: 'Bcrypt 密码哈希算法'
    },
    argon2: {
      title: 'Argon2 哈希',
      description: 'Argon2 密码哈希算法'
    },
    'ecdh-key-exchange': {
      title: 'ECDH 密钥交换',
      description: '椭圆曲线 Diffie-Hellman 密钥交换'
    },
    x25519: {
      title: 'X25519 密钥交换',
      description: 'X25519 密钥交换算法'
    },
    'rsa-sign': {
      title: 'RSA 签名',
      description: 'RSA 数字签名算法'
    },
    'ecdsa-sign': {
      title: 'ECDSA 签名',
      description: '椭圆曲线数字签名算法'
    },
    'ed25519-sign': {
      title: 'Ed25519 签名',
      description: 'Ed25519 数字签名算法'
    },
    base64: {
      title: 'Base64 编解码',
      description: 'Base64 编码和解码'
    },
    hex: {
      title: 'Hex 编解码',
      description: '十六进制编码和解码'
    },
    url: {
      title: 'URL 编解码',
      description: 'URL 编码和解码'
    },
    html: {
      title: 'HTML 编解码',
      description: 'HTML 实体编码和解码'
    },
    jwt: {
      title: 'JWT 编解码',
      description: 'JWT 令牌编码和解码'
    }
  },

  // 转换工具
  convert: {
    timestamp: {
      title: '时间戳转换',
      description: '时间戳和日期时间互转'
    },
    'date-calc': {
      title: '日期计算',
      description: '日期加减计算'
    },
    'date-diff': {
      title: '日期差值',
      description: '计算两个日期之间的差值'
    },
    number: {
      title: '数字转换',
      description: '数字格式转换'
    },
    'number-format': {
      title: '数字格式化',
      description: '数字格式化显示'
    },
    'number-base': {
      title: '进制转换',
      description: '二进制、八进制、十进制、十六进制互转'
    },
    'storage-time': {
      title: '存储时间转换',
      description: '存储单位时间转换'
    },
    unit: {
      title: '单位转换',
      description: '长度、重量、面积等单位转换'
    },
    color: {
      title: '颜色转换',
      description: '颜色格式转换'
    },
    regex: {
      title: '正则表达式',
      description: '正则表达式测试和验证'
    },
    markdown: {
      title: 'Markdown 预览',
      description: '实时 Markdown 预览'
    },
    'http-status': {
      title: 'HTTP 状态码',
      description: 'HTTP 状态码查询和解释'
    },
    'user-agent': {
      title: 'User-Agent 解析',
      description: '解析 User-Agent 字符串'
    },
    'ip-lookup': {
      title: 'IP 地址查询',
      description: 'IP 地址信息查询'
    },
    'char-code': {
      title: '字符编码转换',
      description: '字符编码转换工具'
    }
  },

  // 图片工具
  image: {
    convert: {
      title: '图片格式转换',
      description: '各种图片格式互转'
    },
    rotate: {
      title: '图片旋转',
      description: '旋转和翻转图片'
    },
    crop: {
      title: '图片裁剪',
      description: '在线图片裁剪和调整大小'
    },
    watermark: {
      title: '图片水印',
      description: '添加图片水印'
    },
    'remove-watermark': {
      title: '去除水印',
      description: '去除图片水印'
    }
  },

  // 文本工具
  text: {
    case: {
      title: '文本大小写转换',
      description: '转换文本大小写'
    },
    reverse: {
      title: '文本反转',
      description: '反转文本内容'
    },
    whitespace: {
      title: '空白字符处理',
      description: '处理文本中的空白字符'
    },
    replace: {
      title: '文本替换',
      description: '批量文本替换'
    }
  },

  // 其他工具
  other: {
    qrcode: {
      title: '二维码生成',
      description: '生成和解析二维码'
    },
    'short-url': {
      title: '短链接生成',
      description: '生成短链接'
    },
    ip: {
      title: 'IP 工具',
      description: 'IP 地址相关工具'
    },
    calculator: {
      title: '计算器',
      description: '在线计算器'
    }
  }
} 