export default {
  // Format Tools
  format: {
    json: {
      title: 'JSON Formatter',
      description: 'Format, compress and validate JSON data'
    },
    xml: {
      title: 'XML Formatter',
      description: 'Format XML documents'
    },
    yaml: {
      title: 'YAML Formatter',
      description: 'Format YAML documents'
    },
    js: {
      title: 'JavaScript Formatter',
      description: 'Format JavaScript code'
    },
    html: {
      title: 'HTML Formatter',
      description: 'Format HTML documents'
    },
    css: {
      title: 'CSS Formatter',
      description: 'Format CSS styles'
    },
    java: {
      title: 'Java Formatter',
      description: 'Format Java code'
    },
    php: {
      title: 'PHP Formatter',
      description: 'Format PHP code'
    },
    ruby: {
      title: 'Ruby Formatter',
      description: 'Format Ruby code'
    },
    shell: {
      title: 'Shell Formatter',
      description: 'Format Shell scripts'
    },
    sql: {
      title: 'SQL Formatter',
      description: 'Format SQL queries'
    },
    markdown: {
      title: 'Markdown Formatter',
      description: 'Format Markdown documents'
    },
    vue: {
      title: 'Vue Formatter',
      description: 'Format .vue single file component code'
    }
  },

  // Encryption Tools
  encrypt: {
    aes: {
      title: 'AES Encryption',
      description: 'AES symmetric encryption algorithm'
    },
    chacha20: {
      title: 'ChaCha20 Encryption',
      description: 'ChaCha20 stream cipher'
    },
    des: {
      title: 'DES Encryption',
      description: 'DES symmetric encryption algorithm'
    },
    rsa: {
      title: 'RSA Encryption',
      description: 'RSA asymmetric encryption algorithm'
    },
    ecc: {
      title: 'ECC Encryption',
      description: 'Elliptic Curve Cryptography'
    },
    ed25519: {
      title: 'Ed25519 Encryption',
      description: 'Ed25519 digital signature algorithm'
    },
    sha: {
      title: 'SHA Hash',
      description: 'SHA series hash algorithms'
    },
    bcrypt: {
      title: 'Bcrypt Hash',
      description: 'Bcrypt password hashing algorithm'
    },
    argon2: {
      title: 'Argon2 Hash',
      description: 'Argon2 password hashing algorithm'
    },
    'diffie-hellman': {
      title: 'Diffie-Hellman Key Exchange',
      description: 'Diffie-Hellman key exchange algorithm'
    },
    ecdh: {
      title: 'ECDH Key Exchange',
      description: 'Elliptic Curve Diffie-Hellman key exchange'
    },
    x25519: {
      title: 'X25519 Key Exchange',
      description: 'X25519 key exchange algorithm'
    },
    'rsa-sign': {
      title: 'RSA Signature',
      description: 'RSA digital signature algorithm'
    },
    'ecdsa-sign': {
      title: 'ECDSA Signature',
      description: 'Elliptic Curve Digital Signature Algorithm'
    },
    'ed25519-sign': {
      title: 'Ed25519 Signature',
      description: 'Ed25519 digital signature algorithm'
    },
    base64: {
      title: 'Base64 Encode/Decode',
      description: 'Base64 encoding and decoding'
    },
    hex: {
      title: 'Hex Encode/Decode',
      description: 'Hexadecimal encoding and decoding'
    },
    url: {
      title: 'URL Encode/Decode',
      description: 'URL encoding and decoding'
    },
    html: {
      title: 'HTML Encode/Decode',
      description: 'HTML entity encoding and decoding'
    },
    jwt: {
      title: 'JWT Encode/Decode',
      description: 'JWT token encoding and decoding'
    }
  },

  // Conversion Tools
  convert: {
    timestamp: {
      title: 'Timestamp Converter',
      description: 'Convert between timestamp and datetime'
    },
    'date-calc': {
      title: 'Date Calculator',
      description: 'Date addition and subtraction'
    },
    'date-diff': {
      title: 'Date Difference',
      description: 'Calculate difference between dates'
    },
    number: {
      title: 'Number Converter',
      description: 'Number format conversion'
    },
    'number-format': {
      title: 'Number Formatter',
      description: 'Number formatting display'
    },
    'number-base': {
      title: 'Number Base Converter',
      description: 'Convert between binary, octal, decimal, and hexadecimal'
    },
    'storage-time': {
      title: 'Storage Time Converter',
      description: 'Storage unit time conversion'
    },
    unit: {
      title: 'Unit Converter',
      description: 'Convert length, weight, area and other units'
    },
    color: {
      title: 'Color Converter',
      description: 'Color format conversion'
    },
    regex: {
      title: 'Regex Tester',
      description: 'Regular expression testing and validation'
    },
    markdown: {
      title: 'Markdown Preview',
      description: 'Real-time Markdown preview'
    },
    'http-status': {
      title: 'HTTP Status Code Lookup',
      description: 'HTTP status code lookup and explanation'
    },
    'user-agent': {
      title: 'User-Agent Parser',
      description: 'Parse User-Agent string'
    },
    'ip-lookup': {
      title: 'IP Address Lookup',
      description: 'IP address information lookup'
    },
    'char-code': {
      title: 'Character Code Converter',
      description: 'Character encoding conversion tool'
    }
  },

  // Image Tools
  image: {
    compress: {
      title: 'Image Compression',
      description: 'Compress image size while maintaining quality'
    },
    convert: {
      title: 'Image Format Converter',
      description: 'Convert between various image formats'
    },
    rotate: {
      title: 'Image Rotation',
      description: 'Rotate and flip images'
    },
    crop: {
      title: 'Image Cropping',
      description: 'Online image cropping and resizing'
    },
    watermark: {
      title: 'Image Watermark',
      description: 'Add watermark to images'
    },
    'remove-watermark': {
      title: 'Watermark Removal',
      description: 'Remove watermark from images'
    }
  },

  // Text Tools
  text: {
    case: {
      title: 'Text Case Converter',
      description: 'Convert text case'
    },
    reverse: {
      title: 'Text Reverser',
      description: 'Reverse text content'
    },
    whitespace: {
      title: 'Whitespace Handler',
      description: 'Handle whitespace in text'
    },
    replace: {
      title: 'Text Replacer',
      description: 'Batch text replacement'
    }
  },

  // Other Tools
  other: {
    qrcode: {
      title: 'QR Code Generator',
      description: 'Generate and parse QR codes'
    },
    'short-url': {
      title: 'URL Shortener',
      description: 'Generate short URLs'
    },
    ip: {
      title: 'IP Tools',
      description: 'IP address related tools'
    },
    calculator: {
      title: 'Calculator',
      description: 'Online calculator'
    }
  }
} 