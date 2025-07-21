// 博客相关文本和代码示例 - 避免i18n转义问题
export const blogText = {
  'zh-CN': {
    title: '开发技巧与教程',
    subtitle: '分享实用的开发技巧、工具使用方法和最佳实践',
    seo: {
      title: '开发技巧与教程 - ToolHub',
      description: '分享实用的开发技巧、工具使用方法和最佳实践。学习如何更高效地使用各种开发工具。',
      keywords: '开发技巧,编程教程,工具使用,最佳实践,代码示例,开发指南'
    },
    highlights: '要点',
    codeExample: '代码示例',
    readTime: '{minutes} 分钟阅读',
    categories: {
      format: '格式化',
      encrypt: '加密',
      convert: '转换',
      security: '安全',
      text: '文本',
      other: '其他',
      image: '图像'
    }
  },
  'en-US': {
    title: 'Development Tips & Tutorials',
    subtitle: 'Share practical development tips, tool usage methods and best practices',
    seo: {
      title: 'Development Tips & Tutorials - ToolHub',
      description: 'Share practical development tips, tool usage methods and best practices. Learn how to use various development tools more efficiently.',
      keywords: 'development tips,programming tutorials,tool usage,best practices,code examples,development guide'
    },
    highlights: 'Key Points',
    codeExample: 'Code Example',
    readTime: '{minutes} min read',
    categories: {
      format: 'Formatting',
      encrypt: 'Encryption',
      convert: 'Conversion',
      security: 'Security',
      text: 'Text',
      other: 'Other',
      image: 'Image'
    }
  }
}

// 博客文章内容 - 避免i18n转义问题
export const blogArticles = {
  'zh-CN': {
    jsonAdvanced: {
      title: 'JSON 格式化工具的高级用法',
      summary: 'JSON 是现代 Web 开发中最常用的数据格式之一。掌握 JSON 格式化工具的使用技巧，可以大大提高开发效率。本文介绍 JSON 工具的各种功能和用法场景。',
      highlights: {
        0: '支持多层嵌套 JSON 的格式化',
        1: '错误检测和语法高亮',
        2: '压缩和美化功能',
        3: '转义和反转义处理'
      },
      codeExample: `// 格式化前
{"name":"张三","age":25,"skills":["JavaScript","Vue","React"]}

// 格式化后
{
  &quot;name&quot;: &quot;张三&quot;,
  &quot;age&quot;: 25,
  &quot;skills&quot;: [
    &quot;JavaScript&quot;,
    &quot;Vue&quot;,
    &quot;React&quot;
  ]
}`
    },
    base64Guide: {
      title: 'Base64 编码解码详解',
      summary: 'Base64 是一种基于64个可打印字符来表示二进制数据的方法。在 Web 开发中，Base64 常用于数据传输、图片嵌入和 API 认证等场景。',
      highlights: {
        0: '理解 Base64 编码原理',
        1: '常见应用场景介绍',
        2: '编码安全性注意事项',
        3: '与其他编码方式的比较'
      },
      codeExample: `// 原始文本
Hello, 世界!

// Base64 编码
SGVsbG8sIOS4lueVjCE=

// JavaScript 中的使用
btoa(&quot;Hello, World!&quot;) // 编码
atob(&quot;SGVsbG8sIFdvcmxkIQ==&quot;) // 解码`
    },
    timestampScenarios: {
      title: '时间戳转换的常见场景',
      summary: '时间戳是计算机中表示时间的一种方式，在后端开发、数据分析、日志处理等场景中广泛使用。掌握时间戳的转换和计算对开发者非常重要。',
      highlights: {
        0: 'Unix 时间戳基本概念',
        1: '毫秒和秒级时间戳区别',
        2: '时区处理注意事项',
        3: '常见格式转换方法'
      },
      codeExample: `// 获取当前时间戳
Date.now() // 毫秒级
Math.floor(Date.now() / 1000) // 秒级

// 时间戳转日期
new Date(1642147200000) // 2022-01-14T08:00:00.000Z

// 日期转时间戳
new Date(&quot;2022-01-14&quot;).getTime() // 1642118400000`
    },
    aesSecurity: {
      title: 'AES 加密在前端的安全实践',
      summary: '虽然前端加密无法完全保证数据安全，但在某些场景下仍然很有用。了解 AES 加密的正确使用方法，可以为数据传输提供额外的保护层。',
      highlights: {
        0: 'AES 加密基本原理',
        1: '前端加密的局限性',
        2: '密钥管理最佳实践',
        3: '与后端加密配合使用'
      },
      codeExample: `// 注意：这只是示例，实际应用需要考虑更多安全因素
// 生成随机密钥（仅用于演示）
const key = crypto.getRandomValues(new Uint8Array(32));

// 加密数据
const encrypted = await crypto.subtle.encrypt(
  { name: &quot;AES-GCM&quot;, iv: new Uint8Array(12) },
  cryptoKey,
  textData
);`
    },
    regexDebugging: {
      title: '正则表达式调试技巧',
      summary: '正则表达式是文本处理的强大工具，但调试起来往往比较困难。掌握正确的调试方法和工具，可以让正则表达式的编写和优化变得更加高效。',
      highlights: {
        0: '正则表达式基础语法回顾',
        1: '常见匹配模式和示例',
        2: '性能优化技巧',
        3: '调试工具的使用方法'
      },
      codeExample: `// 邮箱验证正则
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// 手机号验证（中国）
const phoneRegex = /^1[3-9]\\d{9}$/;

// IP 地址匹配
const ipRegex = /^(\\d{1,3}\\.){3}\\d{1,3}$/;

// 测试
emailRegex.test(&quot;user@example.com&quot;) // true`
    },
    qrCodeTech: {
      title: '二维码技术原理与应用',
      summary: '二维码是一种二维条码，能够存储更多信息。在移动开发、营销推广等场景中广泛应用。了解二维码的生成原理和使用方法很有必要。',
      highlights: {
        0: '二维码的基本原理',
        1: '不同编码模式的特点',
        2: '错误纠正机制',
        3: '实际应用场景'
      },
      codeExample: `// 使用 qrcode 库生成二维码
import QRCode from 'qrcode';

// 生成文本二维码
const textQR = await QRCode.toDataURL('Hello World');

// 生成网址二维码
const urlQR = await QRCode.toDataURL('https://toolhub.com');

// 生成 WiFi 二维码
const wifiQR = await QRCode.toDataURL('WIFI:T:WPA;S:MyNetwork;P:password;;');`
    }
  },
  'en-US': {
    jsonAdvanced: {
      title: 'Advanced Usage of JSON Formatting Tools',
      summary: 'JSON is one of the most commonly used data formats in modern Web development. Mastering the usage skills of JSON formatting tools can greatly improve development efficiency. This article introduces various functions and usage scenarios of JSON tools.',
      highlights: {
        0: 'Support formatting of multi-level nested JSON',
        1: 'Error detection and syntax highlighting',
        2: 'Compression and beautification functions',
        3: 'Escape and unescape processing'
      },
      codeExample: `// Before formatting
{"name":"John","age":25,"skills":["JavaScript","Vue","React"]}

// After formatting
{
  &quot;name&quot;: &quot;John&quot;,
  &quot;age&quot;: 25,
  &quot;skills&quot;: [
    &quot;JavaScript&quot;,
    &quot;Vue&quot;,
    &quot;React&quot;
  ]
}`
    },
    base64Guide: {
      title: 'Base64 Encoding and Decoding Guide',
      summary: 'Base64 is a method of representing binary data based on 64 printable characters. In Web development, Base64 is commonly used for data transmission, image embedding, and API authentication scenarios.',
      highlights: {
        0: 'Understanding Base64 encoding principles',
        1: 'Introduction to common application scenarios',
        2: 'Encoding security considerations',
        3: 'Comparison with other encoding methods'
      },
      codeExample: `// Original text
Hello, World!

// Base64 encoding
SGVsbG8sIFdvcmxkIQ==

// Usage in JavaScript
btoa(&quot;Hello, World!&quot;) // encode
atob(&quot;SGVsbG8sIFdvcmxkIQ==&quot;) // decode`
    },
    timestampScenarios: {
      title: 'Common Scenarios for Timestamp Conversion',
      summary: 'Timestamp is a way to represent time in computers, widely used in backend development, data analysis, log processing and other scenarios. Mastering timestamp conversion and calculation is very important for developers.',
      highlights: {
        0: 'Basic concepts of Unix timestamps',
        1: 'Difference between millisecond and second-level timestamps',
        2: 'Time zone handling considerations',
        3: 'Common format conversion methods'
      },
      codeExample: `// Get current timestamp
Date.now() // millisecond level
Math.floor(Date.now() / 1000) // second level

// Timestamp to date
new Date(1642147200000) // 2022-01-14T08:00:00.000Z

// Date to timestamp
new Date(&quot;2022-01-14&quot;).getTime() // 1642118400000`
    },
    aesSecurity: {
      title: 'AES Encryption Security Practices in Frontend',
      summary: 'Although frontend encryption cannot completely guarantee data security, it is still useful in certain scenarios. Understanding the correct usage of AES encryption can provide an additional layer of protection for data transmission.',
      highlights: {
        0: 'Basic principles of AES encryption',
        1: 'Limitations of frontend encryption',
        2: 'Key management best practices',
        3: 'Coordinated use with backend encryption'
      },
      codeExample: `// Note: This is just an example, actual applications need to consider more security factors
// Generate random key (for demonstration only)
const key = crypto.getRandomValues(new Uint8Array(32));

// Encrypt data
const encrypted = await crypto.subtle.encrypt(
  { name: &quot;AES-GCM&quot;, iv: new Uint8Array(12) },
  cryptoKey,
  textData
);`
    },
    regexDebugging: {
      title: 'Regular Expression Debugging Techniques',
      summary: 'Regular expressions are powerful tools for text processing, but debugging them is often difficult. Mastering the correct debugging methods and tools can make writing and optimizing regular expressions more efficient.',
      highlights: {
        0: 'Review of basic regular expression syntax',
        1: 'Common matching patterns and examples',
        2: 'Performance optimization techniques',
        3: 'Usage methods of debugging tools'
      },
      codeExample: `// Email validation regex
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// Phone number validation (China)
const phoneRegex = /^1[3-9]\\d{9}$/;

// IP address matching
const ipRegex = /^(\\d{1,3}\\.){3}\\d{1,3}$/;

// Test
emailRegex.test(&quot;user@example.com&quot;) // true`
    },
    qrCodeTech: {
      title: 'QR Code Technology Principles and Applications',
      summary: 'QR codes are two-dimensional barcodes that can store more information. They are widely used in mobile development, marketing promotion and other scenarios. Understanding the generation principles and usage methods of QR codes is necessary.',
      highlights: {
        0: 'Basic principles of QR codes',
        1: 'Characteristics of different encoding modes',
        2: 'Error correction mechanisms',
        3: 'Practical application scenarios'
      },
      codeExample: `// Generate QR code using qrcode library
import QRCode from 'qrcode';

// Generate text QR code
const textQR = await QRCode.toDataURL('Hello World');

// Generate URL QR code
const urlQR = await QRCode.toDataURL('https://toolhub.com');

// Generate WiFi QR code
const wifiQR = await QRCode.toDataURL('WIFI:T:WPA;S:MyNetwork;P:password;;');`
    }
  }
}

export const getBlogText = (key, locale = 'zh-CN') => {
  const texts = blogText[locale] || blogText['zh-CN']
  return key.split('.').reduce((obj, k) => obj?.[k], texts) || key
}

export const getBlogArticle = (articleKey, locale = 'zh-CN') => {
  const articles = blogArticles[locale] || blogArticles['zh-CN']
  return articles[articleKey] || null
} 