const tools = [
  // 格式化工具
  {
    name: 'format.json.title',
    path: '/format/json',
    description: 'format.json.description',
    category: 'format'
  },
  {
    name: 'format.xml.title',
    path: '/format/xml',
    description: 'format.xml.description',
    category: 'format'
  },
  {
    name: 'format.yaml.title',
    path: '/format/yaml',
    description: 'format.yaml.description',
    category: 'format'
  },
  {
    name: 'format.js.title',
    path: '/format/js',
    description: 'format.js.description',
    category: 'format'
  },
  {
    name: 'format.html.title',
    path: '/format/html',
    description: 'format.html.description',
    category: 'format'
  },
  {
    name: 'format.css.title',
    path: '/format/css',
    description: 'format.css.description',
    category: 'format'
  },
  {
    name: 'format.python.title',
    path: '/format/python',
    description: 'format.python.description',
    category: 'format'
  },
  {
    name: 'format.java.title',
    path: '/format/java',
    description: 'format.java.description',
    category: 'format'
  },
  {
    name: 'format.csharp.title',
    path: '/format/csharp',
    description: 'format.csharp.description',
    category: 'format'
  },
  {
    name: 'format.go.title',
    path: '/format/go',
    description: 'format.go.description',
    category: 'format'
  },
  {
    name: 'format.php.title',
    path: '/format/php',
    description: 'format.php.description',
    category: 'format'
  },
  {
    name: 'format.ruby.title',
    path: '/format/ruby',
    description: 'format.ruby.description',
    category: 'format'
  },
  {
    name: 'format.kotlin.title',
    path: '/format/kotlin',
    description: 'format.kotlin.description',
    category: 'format'
  },
  {
    name: 'format.rust.title',
    path: '/format/rust',
    description: 'format.rust.description',
    category: 'format'
  },
  {
    name: 'format.shell.title',
    path: '/format/shell',
    description: 'format.shell.description',
    category: 'format'
  },
  {
    name: 'format.sql.title',
    path: '/format/sql',
    description: 'format.sql.description',
    category: 'format'
  },
  {
    name: 'format.markdown.title',
    path: '/format/markdown',
    description: 'format.markdown.description',
    category: 'format'
  },
  {
    name: 'format.dart.title',
    path: '/format/dart',
    description: 'format.dart.description',
    category: 'format'
  },

  // 加密工具
  {
    name: 'encrypt.aes.title',
    path: '/encrypt/aes',
    description: 'encrypt.aes.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.chacha20.title',
    path: '/encrypt/chacha20',
    description: 'encrypt.chacha20.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.des.title',
    path: '/encrypt/des',
    description: 'encrypt.des.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.rsa.title',
    path: '/encrypt/rsa',
    description: 'encrypt.rsa.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.ecc.title',
    path: '/encrypt/ecc',
    description: 'encrypt.ecc.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.ed25519.title',
    path: '/encrypt/ed25519',
    description: 'encrypt.ed25519.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.sha.title',
    path: '/encrypt/sha',
    description: 'encrypt.sha.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.bcrypt.title',
    path: '/encrypt/bcrypt',
    description: 'encrypt.bcrypt.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.argon2.title',
    path: '/encrypt/argon2',
    description: 'encrypt.argon2.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.diffie-hellman.title',
    path: '/encrypt/diffie-hellman',
    description: 'encrypt.diffie-hellman.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.ecdh.title',
    path: '/encrypt/ecdh',
    description: 'encrypt.ecdh.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.x25519.title',
    path: '/encrypt/x25519',
    description: 'encrypt.x25519.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.rsa-sign.title',
    path: '/encrypt/rsa-sign',
    description: 'encrypt.rsa-sign.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.ecdsa-sign.title',
    path: '/encrypt/ecdsa-sign',
    description: 'encrypt.ecdsa-sign.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.ed25519-sign.title',
    path: '/encrypt/ed25519-sign',
    description: 'encrypt.ed25519-sign.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.base64.title',
    path: '/encrypt/base64',
    description: 'encrypt.base64.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.hex.title',
    path: '/encrypt/hex',
    description: 'encrypt.hex.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.url.title',
    path: '/encrypt/url',
    description: 'encrypt.url.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.html.title',
    path: '/encrypt/html',
    description: 'encrypt.html.description',
    category: 'encrypt'
  },
  {
    name: 'encrypt.jwt.title',
    path: '/encrypt/jwt',
    description: 'encrypt.jwt.description',
    category: 'encrypt'
  },

  // 转换工具
  {
    name: 'convert.timestamp.title',
    path: '/convert/timestamp',
    description: 'convert.timestamp.description',
    category: 'convert'
  },
  {
    name: 'convert.date-calc.title',
    path: '/convert/date-calc',
    description: 'convert.date-calc.description',
    category: 'convert'
  },
  {
    name: 'convert.date-diff.title',
    path: '/convert/date-diff',
    description: 'convert.date-diff.description',
    category: 'convert'
  },
  {
    name: 'convert.number.title',
    path: '/convert/number',
    description: 'convert.number.description',
    category: 'convert'
  },
  {
    name: 'convert.number-format.title',
    path: '/convert/number-format',
    description: 'convert.number-format.description',
    category: 'convert'
  },
  {
    name: 'convert.number-base.title',
    path: '/convert/number-base',
    description: 'convert.number-base.description',
    category: 'convert'
  },
  {
    name: 'convert.storage-time.title',
    path: '/convert/storage-time',
    description: 'convert.storage-time.description',
    category: 'convert'
  },
  {
    name: 'convert.unit.title',
    path: '/convert/unit',
    description: 'convert.unit.description',
    category: 'convert'
  },
  {
    name: 'convert.color.title',
    path: '/convert/color',
    description: 'convert.color.description',
    category: 'convert'
  },
  {
    name: 'convert.regex.title',
    path: '/convert/regex',
    description: 'convert.regex.description',
    category: 'convert'
  },
  {
    name: 'convert.markdown.title',
    path: '/convert/markdown',
    description: 'convert.markdown.description',
    category: 'convert'
  },
  {
    name: 'convert.http-status.title',
    path: '/convert/http-status',
    description: 'convert.http-status.description',
    category: 'convert'
  },
  {
    name: 'convert.user-agent.title',
    path: '/convert/user-agent',
    description: 'convert.user-agent.description',
    category: 'convert'
  },
  {
    name: 'convert.ip-lookup.title',
    path: '/convert/ip-lookup',
    description: 'convert.ip-lookup.description',
    category: 'convert'
  },
  {
    name: 'convert.char-code.title',
    path: '/convert/char-code',
    description: 'convert.char-code.description',
    category: 'convert'
  },

  // 图片工具
  {
    name: 'image.compress.title',
    path: '/image/compress',
    description: 'image.compress.description',
    category: 'image'
  },
  {
    name: 'image.convert.title',
    path: '/image/convert',
    description: 'image.convert.description',
    category: 'image'
  },
  {
    name: 'image.rotate.title',
    path: '/image/rotate',
    description: 'image.rotate.description',
    category: 'image'
  },
  {
    name: 'image.crop.title',
    path: '/image/crop',
    description: 'image.crop.description',
    category: 'image'
  },
  {
    name: 'image.watermark.title',
    path: '/image/watermark',
    description: 'image.watermark.description',
    category: 'image'
  },
  {
    name: 'image.remove-watermark.title',
    path: '/image/remove-watermark',
    description: 'image.remove-watermark.description',
    category: 'image'
  },

  // 文本工具
  {
    name: 'text.case.title',
    path: '/text/case',
    description: 'text.case.description',
    category: 'text'
  },
  {
    name: 'text.reverse.title',
    path: '/text/reverse',
    description: 'text.reverse.description',
    category: 'text'
  },
  {
    name: 'text.whitespace.title',
    path: '/text/whitespace',
    description: 'text.whitespace.description',
    category: 'text'
  },
  {
    name: 'text.replace.title',
    path: '/text/replace',
    description: 'text.replace.description',
    category: 'text'
  },

  // 其他工具
  {
    name: 'other.qrcode.title',
    path: '/other/qrcode',
    description: 'other.qrcode.description',
    category: 'other'
  },
  {
    name: 'other.short-url.title',
    path: '/other/short-url',
    description: 'other.short-url.description',
    category: 'other'
  },
  {
    name: 'other.ip.title',
    path: '/other/ip',
    description: 'other.ip.description',
    category: 'other'
  },
  {
    name: 'other.calculator.title',
    path: '/other/calculator',
    description: 'other.calculator.description',
    category: 'other'
  }
];

module.exports = tools; 