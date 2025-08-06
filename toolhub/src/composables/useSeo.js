import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useSeo() {
  const route = useRoute()
  const { t, locale } = useI18n()

  // 工具详细信息映射
  const toolDetails = {
    // 格式化工具
    json: {
      name: 'JSON Formatter',
      description: 'Format and validate JSON data with syntax highlighting and error detection',
      keywords: ['json formatter', 'json validator', 'json beautifier']
    },
    xml: {
      name: 'XML Formatter', 
      description: 'Format and validate XML documents with proper indentation and structure',
      keywords: ['xml formatter', 'xml validator', 'xml beautifier']
    },
    yaml: {
      name: 'YAML Formatter',
      description: 'Format YAML files with proper indentation and syntax validation',
      keywords: ['yaml formatter', 'yaml validator', 'yaml beautifier']
    },
    js: {
      name: 'JavaScript Formatter',
      description: 'Format JavaScript code with proper indentation and syntax highlighting',
      keywords: ['javascript formatter', 'js beautifier', 'code formatter']
    },
    html: {
      name: 'HTML Formatter',
      description: 'Format HTML code with proper indentation and structure validation',
      keywords: ['html formatter', 'html beautifier', 'html prettifier']
    },
    css: {
      name: 'CSS Formatter',
      description: 'Format CSS code with proper indentation and syntax validation',
      keywords: ['css formatter', 'css beautifier', 'css prettifier']
    },
    java: {
      name: 'Java Formatter',
      description: 'Format Java code with proper indentation and syntax highlighting',
      keywords: ['java formatter', 'java beautifier', 'code formatter']
    },
    php: {
      name: 'PHP Formatter',
      description: 'Format PHP code with proper indentation and syntax validation',
      keywords: ['php formatter', 'php beautifier', 'code formatter']
    },
    ruby: {
      name: 'Ruby Formatter',
      description: 'Format Ruby code with proper indentation and syntax highlighting',
      keywords: ['ruby formatter', 'ruby beautifier', 'code formatter']
    },
    shell: {
      name: 'Shell Formatter',
      description: 'Format shell scripts with proper indentation and syntax validation',
      keywords: ['shell formatter', 'bash formatter', 'script formatter']
    },
    sql: {
      name: 'SQL Formatter',
      description: 'Format SQL queries with proper indentation and syntax highlighting',
      keywords: ['sql formatter', 'sql beautifier', 'query formatter']
    },
    markdown: {
      name: 'Markdown Formatter',
      description: 'Format Markdown documents with proper structure and syntax validation',
      keywords: ['markdown formatter', 'md formatter', 'document formatter']
    },
    vue: {
      name: 'Vue.js Formatter',
      description: 'Format Vue.js components with proper indentation and syntax highlighting',
      keywords: ['vue formatter', 'vue.js formatter', 'component formatter']
    },

    // 加密工具
    aes: {
      name: 'AES Encryption Tool',
      description: 'Advanced Encryption Standard (AES) encryption and decryption tool with multiple key sizes',
      keywords: ['aes encryption', 'aes decrypt', 'aes cipher', 'encryption tool']
    },
    chacha20: {
      name: 'ChaCha20 Encryption Tool',
      description: 'ChaCha20 stream cipher encryption and decryption tool for high-performance security',
      keywords: ['chacha20 encryption', 'stream cipher', 'encryption tool']
    },
    des: {
      name: 'DES Encryption Tool',
      description: 'Data Encryption Standard (DES) encryption and decryption tool for legacy systems',
      keywords: ['des encryption', 'des decrypt', 'legacy encryption']
    },
    rsa: {
      name: 'RSA Encryption Tool',
      description: 'RSA public-key cryptography tool for encryption, decryption, and digital signatures',
      keywords: ['rsa encryption', 'public key cryptography', 'digital signature']
    },
    ecc: {
      name: 'ECC Encryption Tool',
      description: 'Elliptic Curve Cryptography tool for efficient public-key operations',
      keywords: ['ecc encryption', 'elliptic curve', 'public key cryptography']
    },
    sha: {
      name: 'SHA Hash Tool',
      description: 'Secure Hash Algorithm (SHA) family hashing tool for data integrity',
      keywords: ['sha hash', 'hash function', 'data integrity', 'checksum']
    },
    bcrypt: {
      name: 'bcrypt Hash Tool',
      description: 'bcrypt password hashing tool with adaptive cost factor',
      keywords: ['bcrypt hash', 'password hashing', 'secure hash']
    },
    argon2: {
      name: 'Argon2 Hash Tool',
      description: 'Argon2 password hashing tool with memory-hard properties',
      keywords: ['argon2 hash', 'password hashing', 'memory-hard']
    },
    'ecdh-key-exchange': {
      name: 'ECDH Key Exchange Tool',
      description: 'Elliptic Curve Diffie-Hellman key exchange tool for secure key generation',
      keywords: ['ecdh', 'key exchange', 'elliptic curve', 'key generation']
    },
    x25519: {
      name: 'X25519 Key Exchange Tool',
      description: 'X25519 key agreement tool for high-performance secure communication',
      keywords: ['x25519', 'key agreement', 'curve25519', 'key exchange']
    },
    'rsa-sign': {
      name: 'RSA Digital Signature Tool',
      description: 'RSA digital signature generation and verification tool',
      keywords: ['rsa signature', 'digital signature', 'signature verification']
    },
    'ecdsa-sign': {
      name: 'ECDSA Digital Signature Tool',
      description: 'Elliptic Curve Digital Signature Algorithm tool for efficient signatures',
      keywords: ['ecdsa', 'digital signature', 'elliptic curve signature']
    },
    'ed25519-sign': {
      name: 'Ed25519 Digital Signature Tool',
      description: 'Ed25519 digital signature tool for high-performance secure signatures',
      keywords: ['ed25519', 'digital signature', 'edwards curve']
    },
    base64: {
      name: 'Base64 Encoder/Decoder',
      description: 'Base64 encoding and decoding tool for binary data conversion',
      keywords: ['base64 encode', 'base64 decode', 'binary encoding']
    },
    hex: {
      name: 'Hexadecimal Encoder/Decoder',
      description: 'Hexadecimal encoding and decoding tool for binary data representation',
      keywords: ['hex encode', 'hex decode', 'hexadecimal']
    },
    url: {
      name: 'URL Encoder/Decoder',
      description: 'URL encoding and decoding tool for web-safe character conversion',
      keywords: ['url encode', 'url decode', 'percent encoding']
    },
    html: {
      name: 'HTML Encoder/Decoder',
      description: 'HTML entity encoding and decoding tool for web content',
      keywords: ['html encode', 'html decode', 'html entities']
    },
    jwt: {
      name: 'JWT Encoder/Decoder',
      description: 'JSON Web Token encoding and decoding tool with signature verification',
      keywords: ['jwt encode', 'jwt decode', 'json web token']
    },

    // 转换工具
    timestamp: {
      name: 'Timestamp Converter',
      description: 'Convert between Unix timestamps and human-readable date formats',
      keywords: ['timestamp converter', 'unix timestamp', 'date conversion']
    },
    'date-calc': {
      name: 'Date Calculator',
      description: 'Advanced date calculation tool for adding, subtracting, and manipulating dates',
      keywords: ['date calculator', 'date arithmetic', 'date manipulation']
    },
    'date-diff': {
      name: 'Date Difference Calculator',
      description: 'Calculate the difference between two dates in various units',
      keywords: ['date difference', 'date diff', 'time between dates']
    },
    number: {
      name: 'Number Converter',
      description: 'Convert numbers between different formats including scientific notation',
      keywords: ['number converter', 'scientific notation', 'number format']
    },
    'number-base': {
      name: 'Number Base Converter',
      description: 'Convert numbers between different number bases (binary, octal, decimal, hexadecimal)',
      keywords: ['base converter', 'binary converter', 'hex converter']
    },
    'storage-time': {
      name: 'Storage Time Calculator',
      description: 'Calculate data transfer times and storage requirements',
      keywords: ['storage calculator', 'transfer time', 'data storage']
    },
    unit: {
      name: 'Unit Converter',
      description: 'Convert between various units of measurement',
      keywords: ['unit converter', 'measurement converter', 'unit conversion']
    },
    color: {
      name: 'Color Converter',
      description: 'Convert colors between different formats (RGB, HEX, HSL, CMYK)',
      keywords: ['color converter', 'rgb converter', 'hex color']
    },
    regex: {
      name: 'Regular Expression Tester',
      description: 'Test and validate regular expressions with real-time matching',
      keywords: ['regex tester', 'regular expression', 'pattern matching']
    },
    'http-status': {
      name: 'HTTP Status Code Lookup',
      description: 'Look up HTTP status codes and their meanings',
      keywords: ['http status', 'status codes', 'http response']
    },
    'user-agent': {
      name: 'User Agent Parser',
      description: 'Parse and analyze user agent strings',
      keywords: ['user agent parser', 'browser detection', 'user agent analysis']
    },
    'char-code': {
      name: 'Character Code Converter',
      description: 'Convert between characters and their ASCII/Unicode codes',
      keywords: ['character code', 'ascii converter', 'unicode converter']
    },

    // 图像工具
    convert: {
      name: 'Image Converter',
      description: 'Convert images between different formats (JPEG, PNG, WebP, etc.)',
      keywords: ['image converter', 'format converter', 'image conversion']
    },
    rotate: {
      name: 'Image Rotator',
      description: 'Rotate images by specified angles with high quality',
      keywords: ['image rotate', 'image rotation', 'rotate picture']
    },
    crop: {
      name: 'Image Cropper',
      description: 'Crop images to specific dimensions and aspect ratios',
      keywords: ['image crop', 'image cropping', 'crop picture']
    },
    watermark: {
      name: 'Image Watermarker',
      description: 'Add watermarks to images with customizable text and positioning',
      keywords: ['image watermark', 'watermark tool', 'add watermark']
    },

    // 文本工具
    case: {
      name: 'Text Case Converter',
      description: 'Convert text between different cases (uppercase, lowercase, title case, etc.)',
      keywords: ['text case converter', 'uppercase converter', 'title case']
    },
    reverse: {
      name: 'Text Reverser',
      description: 'Reverse text characters, words, or lines',
      keywords: ['text reverser', 'reverse text', 'mirror text']
    },
    whitespace: {
      name: 'Whitespace Remover',
      description: 'Remove, normalize, or manipulate whitespace in text',
      keywords: ['whitespace remover', 'space remover', 'text cleaner']
    },
    replace: {
      name: 'Text Replacer',
      description: 'Find and replace text with support for regular expressions',
      keywords: ['text replacer', 'find and replace', 'text replacement']
    },

    // 其他工具
    qrcode: {
      name: 'QR Code Generator',
      description: 'Generate QR codes from text, URLs, or other data with customizable options',
      keywords: ['qr code generator', 'qr code maker', 'qr code creator']
    },
    calculator: {
      name: 'Online Calculator',
      description: 'Advanced online calculator with scientific functions',
      keywords: ['online calculator', 'scientific calculator', 'math calculator']
    }
  }

  // 获取当前工具信息
  const currentTool = computed(() => {
    const pathParts = route.path.split('/')
    if (pathParts.length >= 3) {
      const category = pathParts[1]
      const tool = pathParts[2]
      return {
        category,
        tool,
        details: toolDetails[tool] || {}
      }
    }
    return null
  })

  // 生成页面标题
  const pageTitle = computed(() => {
    if (!currentTool.value) return 'ToolHub - Developer Tools Collection'
    const { details } = currentTool.value
    return `${details.name} - ToolHub`
  })

  // 生成页面描述
  const pageDescription = computed(() => {
    if (!currentTool.value) return 'Professional developer tools collection providing code formatting, encryption/decryption, data conversion and various online tools'
    const { details } = currentTool.value
    return details.description || 'Professional online tool for developers'
  })

  // 生成关键词
  const pageKeywords = computed(() => {
    if (!currentTool.value) return 'developer tools, online tools, code formatter, encryption tools, data conversion'
    const { details } = currentTool.value
    return details.keywords ? details.keywords.join(', ') : 'online tool, developer tool'
  })

  // 生成结构化数据
  const structuredData = computed(() => {
    if (!currentTool.value) {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ToolHub",
        "url": "https://toolhub.studio",
        "description": "Professional developer tools collection providing code formatting, encryption/decryption, data conversion and various online tools",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "ToolHub"
        }
      }
    }

    const { category, tool, details } = currentTool.value
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": details.name,
      "url": `https://toolhub.studio/${category}/${tool}`,
      "description": details.description,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "ToolHub"
      },
      "keywords": details.keywords?.join(', ')
    }
  })

  // 更新页面元数据
  const updatePageMeta = () => {
    if (typeof document !== 'undefined') {
      // 更新标题
      document.title = pageTitle.value
      
      // 更新描述
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        document.head.appendChild(metaDescription)
      }
      metaDescription.content = pageDescription.value
      
      // 更新关键词
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = pageKeywords.value
      
      // 更新结构化数据
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]')
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script')
        structuredDataScript.type = 'application/ld+json'
        document.head.appendChild(structuredDataScript)
      }
      structuredDataScript.textContent = JSON.stringify(structuredData.value)
    }
  }

  return {
    currentTool,
    pageTitle,
    pageDescription,
    pageKeywords,
    structuredData,
    updatePageMeta
  }
} 