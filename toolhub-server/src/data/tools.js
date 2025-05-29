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
    id: 'python',
    name: 'format.python.title',
    path: '/format/python',
    description: 'format.python.description',
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
    id: 'csharp',
    name: 'format.csharp.title',
    path: '/format/csharp',
    description: 'format.csharp.description',
    category: 'format'
  },
  {
    id: 'go',
    name: 'format.go.title',
    path: '/format/go',
    description: 'format.go.description',
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
    id: 'kotlin',
    name: 'format.kotlin.title',
    path: '/format/kotlin',
    description: 'format.kotlin.description',
    category: 'format'
  },
  {
    id: 'rust',
    name: 'format.rust.title',
    path: '/format/rust',
    description: 'format.rust.description',
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
    id: 'dart',
    name: 'format.dart.title',
    path: '/format/dart',
    description: 'format.dart.description',
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
    id: 'ed25519',
    name: 'encrypt.ed25519.title',
    path: '/encrypt/ed25519',
    description: 'encrypt.ed25519.description',
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
    id: 'diffie-hellman',
    name: 'encrypt.diffie-hellman.title',
    path: '/encrypt/diffie-hellman',
    description: 'encrypt.diffie-hellman.description',
    category: 'encrypt'
  },
  {
    id: 'ecdh',
    name: 'encrypt.ecdh.title',
    path: '/encrypt/ecdh',
    description: 'encrypt.ecdh.description',
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
    id: 'date-calc',
    name: 'convert.date-calc.title',
    path: '/convert/date-calc',
    description: 'convert.date-calc.description',
    category: 'convert'
  },
  {
    id: 'date-diff',
    name: 'convert.date-diff.title',
    path: '/convert/date-diff',
    description: 'convert.date-diff.description',
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
    id: 'number-format',
    name: 'convert.number-format.title',
    path: '/convert/number-format',
    description: 'convert.number-format.description',
    category: 'convert'
  },
  {
    id: 'number-base',
    name: 'convert.number-base.title',
    path: '/convert/number-base',
    description: 'convert.number-base.description',
    category: 'convert'
  },
  {
    id: 'storage-time',
    name: 'convert.storage-time.title',
    path: '/convert/storage-time',
    description: 'convert.storage-time.description',
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
    name: 'convert.http-status.title',
    path: '/convert/http-status',
    description: 'convert.http-status.description',
    category: 'convert'
  },
  {
    id: 'user-agent',
    name: 'convert.user-agent.title',
    path: '/convert/user-agent',
    description: 'convert.user-agent.description',
    category: 'convert'
  },
  {
    id: 'ip-lookup',
    name: 'convert.ip-lookup.title',
    path: '/convert/ip-lookup',
    description: 'convert.ip-lookup.description',
    category: 'convert'
  },
  {
    id: 'char-code',
    name: 'convert.char-code.title',
    path: '/convert/char-code',
    description: 'convert.char-code.description',
    category: 'convert'
  },

  // 图片工具
  {
    id: 'compress',
    name: 'image.compress.title',
    path: '/image/compress',
    description: 'image.compress.description',
    category: 'image'
  },
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
  {
    id: 'remove-watermark',
    name: 'image.remove-watermark.title',
    path: '/image/remove-watermark',
    description: 'image.remove-watermark.description',
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
    id: 'short-url',
    name: 'other.short-url.title',
    path: '/other/short-url',
    description: 'other.short-url.description',
    category: 'other'
  },
  {
    id: 'ip',
    name: 'other.ip.title',
    path: '/other/ip',
    description: 'other.ip.description',
    category: 'other'
  },
  {
    id: 'calculator',
    name: 'other.calculator.title',
    path: '/other/calculator',
    description: 'other.calculator.description',
    category: 'other'
  }
];

module.exports = tools; 