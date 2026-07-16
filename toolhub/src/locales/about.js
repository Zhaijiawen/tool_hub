// 关于我们相关文本 - 避免i18n转义问题
export const aboutText = {
  'zh-CN': {
    title: '关于 ToolHub',
    seo: {
      title: '关于我们 - ToolHub 开发者工具箱',
      description: '了解 ToolHub 的使命、功能特色、技术架构。ToolHub 是一款面向开发者和技术人员的免费在线工具箱，提供 60+ 工具，所有计算在浏览器本地完成，无需注册，保护您的数据隐私。',
      keywords: '关于我们,ToolHub,开发者工具箱,免费在线工具,技术架构,隐私优先'
    },
    mission: {
      title: '我们的使命',
      description: 'ToolHub 是一款专为开发者、工程师和技术专业人员设计的免费在线工具箱。我们深知开发工作中频繁需要小工具来处理格式转换、加密编码、文本处理等日常任务，却往往找不到一个可信赖、快速且无需注册的工具站。ToolHub 正是为了解决这一痛点而生。我们的目标简单而明确：提供一套高质量、开放访问的开发者工具集合，所有计算均在浏览器本地运行，您的数据永远不会离开您的设备。',
      vision: '成为全球开发者最信赖的在线工具平台',
      highlights: {
        developer: {
          title: '专为开发者设计',
          desc: '每一款工具都以开发者的实际使用场景为出发点，注重效率与精准。从 JSON 格式化到 RSA 加密，从正则表达式测试到 HTTP 状态码查询，ToolHub 覆盖了开发日常中最高频的需求。'
        },
        privacy: {
          title: '隐私优先，数据不上传',
          desc: '所有工具均在您的浏览器中本地运行，加密密钥、密码、证书、代码等敏感数据不会发送到任何服务器。这是我们从设计之初就坚守的原则，不是承诺，是技术保证。'
        },
        fast: {
          title: '打开即用，无任何门槛',
          desc: '无需注册账号，无需安装插件，无需付费订阅。打开页面，选择工具，立即开始。我们认为开发者工具应该像命令行一样简洁直接，不应该设置任何障碍。'
        }
      }
    },
    features: {
      title: '工具分类与功能',
      intro: 'ToolHub 目前提供 60+ 款工具，涵盖 6 大类别，持续更新中：',
      format: {
        title: '格式化工具',
        desc: '支持 JSON、XML、YAML、JavaScript、CSS、SQL、HTML、Java、PHP、Ruby、Shell、Markdown、Vue 等十余种格式的代码美化与验证。提供语法高亮、缩进控制、折叠展开等功能，帮助开发者快速整理杂乱的代码和配置文件。'
      },
      encrypt: {
        title: '加密与编码工具',
        desc: '涵盖行业标准对称加密算法（AES-128/192/256、DES、3DES、ChaCha20）、非对称加密（RSA 1024/2048/4096、ECC P-256/P-384/P-521）、哈希函数（MD5、SHA-1/224/256/384/512、bcrypt、Argon2）、数字签名（ECDSA、Ed25519）以及各种编码工具（Base64、Hex、URL 编码、JWT 解析/生成）。所有加密操作均在客户端执行，密钥和明文不会上传服务器。'
      },
      convert: {
        title: '转换工具',
        desc: '提供时间戳与日期格式互转、存储与时间单位换算、数制转换（2/8/10/16 进制及任意进制）、物理单位换算（长度、质量、温度、面积、速度等）、颜色格式转换（HEX/RGB/HSL/HSV/CMYK）、正则表达式测试、CIDR 子网计算器、JSON Schema 生成器、User Agent 解析、HTTP 状态码查询、字符编码查询、Markdown 实时预览等实用工具。'
      },
      image: {
        title: '图片处理工具',
        desc: '提供图片格式转换（支持 JPG、PNG、WebP、BMP、GIF、AVIF 等格式互转，含尺寸调整）、图片裁剪、旋转与翻转、文字/图片水印添加、图片压缩（可控质量）、EXIF 元数据查看器等功能。所有图片处理均在浏览器本地完成，不上传任何图片数据到服务器。'
      },
      text: {
        title: '文本处理工具',
        desc: '包含大小写转换（支持驼峰、帕斯卡、蛇形、烤肉串等多种命名格式）、文本逆序、空白字符清理与压缩、查找与替换（支持正则表达式）、文本 Diff 对比、字符/单词/行数统计、JSONPath 查询与提取等工具。'
      },
      other: {
        title: '其他实用工具',
        desc: '二维码生成与解码、IP 地址查询（含 ISP 和地理位置）、DNS 解析查询、UUID v1/v4 批量生成、安全密码生成器（自定义字符集和长度）、文件 MD5/SHA 哈希校验、HTTP 客户端（支持自定义请求头）、SSL 证书解析器、Git Commit 规范消息生成器、Mock 数据生成器（支持 Faker.js 语法）、科学计算器、AI 提示词工具箱、脚本工具箱（内置 dayjs/lodash/CryptoJS 等库，浏览器端运行自定义 JavaScript 脚本）等。'
      }
    },
    technology: {
      title: '技术架构',
      intro: 'ToolHub 采用纯前端架构，充分利用现代浏览器的计算能力，确保数据安全和响应速度：',
      frontend: {
        title: '前端技术栈',
        vue: '渐进式 JavaScript 框架，提供响应式 UI 和组件化开发体验',
        naiveui: '基于 Vue 3 的高质量 UI 组件库，提供专业的交互组件',
        vite: '新一代前端构建工具，提供极速的开发热重载和优化的生产构建',
        router: '客户端路由管理，实现 SPA 单页应用的页面导航',
        i18n: '国际化框架，支持中英文双语界面切换'
      },
      backend: {
        title: '部署与托管',
        node: 'JavaScript 运行时，用于构建和开发',
        express: '纯静态站点，部署于 Cloudflare Pages，全球 CDN 加速',
        nginx: '无需后端服务器，所有工具在浏览器本地运行',
        pm2: '开源项目，代码托管于 GitHub'
      },
      security: {
        title: '安全设计',
        https: '全站 HTTPS 加密传输，确保通信安全',
        csp: '内容安全策略（CSP）头部配置，防止 XSS 攻击',
        client: {
          title: '纯客户端计算',
          desc: '敏感数据（加密内容、密钥、密码等）完全在浏览器沙箱内处理，不经过服务器'
        },
        validation: {
          title: '输入验证',
          desc: '对所有用户输入进行客户端验证，防止恶意数据注入'
        }
      }
    },
    contact: {
      title: '联系我们',
      intro: '我们重视每一位用户的反馈和建议。无论您发现了 Bug、希望新增某个工具，还是有任何使用问题，都欢迎通过 GitHub Issues 联系我们。',
      methods: {
        github: {
          title: 'GitHub Issues',
          support: 'github.com/Zhaijiawen/tool_hub/issues'
        }
      }
    },
    thanks: {
      title: '致谢',
      intro: 'ToolHub 的开发依托了大量优秀的开源项目，向以下项目和社区致以诚挚的感谢：',
      list: {
        vue: 'Vue.js 团队及全球社区贡献者——感谢打造了如此优雅的前端框架',
        naiveui: 'Naive UI 开发团队——感谢提供了美观且功能完善的 Vue 3 组件库',
        crypto: 'crypto-js、forge、elliptic 等加密库的维护者——感谢你们在浏览器端实现了严谨的密码学工具',
        users: '所有使用 ToolHub、提交反馈和建议的开发者们——你们的支持是我们持续改进的最大动力'
      },
      support: 'ToolHub 会持续更新和维护，不断新增工具，优化体验。感谢每一位信任我们的开发者！'
    }
  },
  'en-US': {
    title: 'About ToolHub',
    seo: {
      title: 'About Us - ToolHub Developer Toolbox',
      description: 'Learn about ToolHub\'s mission, features, and technical architecture. ToolHub is a free online toolbox for developers and technical professionals, offering 60+ tools with all processing done locally in your browser — no registration required, privacy guaranteed.',
      keywords: 'about us,ToolHub,developer toolbox,free online tools,technical architecture,privacy first'
    },
    mission: {
      title: 'Our Mission',
      description: 'ToolHub is a free online toolbox built specifically for developers, engineers, and technical professionals. We understand that development work constantly requires small utilities for format conversion, encryption, text processing, and countless other daily tasks — yet finding a trustworthy, fast, and registration-free tool site is often frustrating. ToolHub was created to solve exactly this problem. Our goal is straightforward: provide a collection of high-quality, openly accessible developer tools where all computation happens locally in your browser. Your data never leaves your device.',
      vision: 'Become the most trusted online tool platform for developers worldwide',
      highlights: {
        developer: {
          title: 'Built for Developers',
          desc: 'Every tool starts from the real workflows of developers. From JSON formatting to RSA encryption, from regex testing to HTTP status code lookup, ToolHub covers the highest-frequency needs in everyday development.'
        },
        privacy: {
          title: 'Privacy-First, Zero Uploads',
          desc: 'All tools run locally in your browser. Encryption keys, passwords, certificates, and code never get sent to any server. This is not a promise — it is a technical guarantee baked into our architecture from day one.'
        },
        fast: {
          title: 'Open and Use Instantly',
          desc: 'No account registration, no plugin installation, no paid subscription. Open a tool page and start working immediately. We believe developer tools should be as frictionless as a command line — no barriers, no friction.'
        }
      }
    },
    features: {
      title: 'Tool Categories & Features',
      intro: 'ToolHub currently provides 60+ tools across 6 categories, with new tools added regularly:',
      format: {
        title: 'Formatting Tools',
        desc: 'Beautify and validate over a dozen formats including JSON, XML, YAML, JavaScript, CSS, SQL, HTML, Java, PHP, Ruby, Shell, Markdown, and Vue. Features include syntax highlighting, indentation control, and expand/collapse, helping developers quickly clean up messy code and config files.'
      },
      encrypt: {
        title: 'Encryption & Encoding Tools',
        desc: 'Covers industry-standard symmetric encryption (AES-128/192/256, DES, 3DES, ChaCha20), asymmetric encryption (RSA 1024/2048/4096, ECC P-256/P-384/P-521), hash functions (MD5, SHA-1/224/256/384/512, bcrypt, Argon2), digital signatures (ECDSA, Ed25519), and encoding utilities (Base64, Hex, URL encoding, JWT parsing/generation). All cryptographic operations execute on the client side — keys and plaintext never touch the server.'
      },
      convert: {
        title: 'Conversion Tools',
        desc: 'Includes timestamp and date format conversion, storage and time unit converters, number base conversion (binary/octal/decimal/hex and arbitrary bases), physical unit conversion (length, mass, temperature, area, speed, etc.), color format conversion (HEX/RGB/HSL/HSV/CMYK), regex tester, CIDR subnet calculator, JSON Schema generator, User Agent parser, HTTP status code reference, character encoding lookup, and Markdown live preview.'
      },
      image: {
        title: 'Image Processing Tools',
        desc: 'Provides image format conversion (supports JPG, PNG, WebP, BMP, GIF, AVIF and more, with optional resize), image cropping, rotation and flipping, text/image watermark overlay, image compression with quality control, and EXIF metadata viewer. All image processing runs entirely in the browser — no image data is uploaded to any server.'
      },
      text: {
        title: 'Text Processing Tools',
        desc: 'Includes case conversion (camelCase, PascalCase, snake_case, kebab-case, and more), text reversal, whitespace cleanup and compression, find and replace (with regex support), text diff comparison, character/word/line statistics, and JSONPath query and extraction.'
      },
      other: {
        title: 'Other Utilities',
        desc: 'QR code generator and decoder, IP address lookup (including ISP and geolocation), DNS resolver, UUID v1/v4 batch generator, secure password generator (customizable charset and length), file MD5/SHA hash checker, HTTP client (with custom headers), SSL certificate parser, Git commit message generator following Conventional Commits, Mock data generator (with Faker.js syntax), scientific calculator, AI prompt toolbox, and Script Toolkit (built-in dayjs/lodash/CryptoJS libraries, run custom JavaScript scripts entirely in the browser).'
      }
    },
    technology: {
      title: 'Technical Architecture',
      intro: 'ToolHub uses a pure frontend architecture, leveraging the full computational power of modern browsers to ensure both data security and responsiveness:',
      frontend: {
        title: 'Frontend Stack',
        vue: 'Progressive JavaScript framework providing reactive UI and component-based development',
        naiveui: 'High-quality Vue 3 component library offering professional UI interactions',
        vite: 'Next-generation frontend build tool with instant hot reload and optimized production builds',
        router: 'Client-side routing management for SPA page navigation',
        i18n: 'Internationalization framework supporting seamless English/Chinese language switching'
      },
      backend: {
        title: 'Deployment & Hosting',
        node: 'JavaScript runtime for building and development',
        express: 'Pure static site, deployed on Cloudflare Pages with global CDN',
        nginx: 'No backend server required — all tools run locally in your browser',
        pm2: 'Open source project, hosted on GitHub'
      },
      security: {
        title: 'Security Design',
        https: 'Full-site HTTPS encrypted transmission for secure communications',
        csp: 'Content Security Policy (CSP) headers configured to prevent XSS attacks',
        client: {
          title: 'Pure Client-Side Computation',
          desc: 'Sensitive data (encrypted content, keys, passwords) is processed entirely within the browser sandbox and never passes through the server'
        },
        validation: {
          title: 'Input Validation',
          desc: 'All user inputs undergo client-side validation to prevent malicious data injection'
        }
      }
    },
    contact: {
      title: 'Contact Us',
      intro: 'We value feedback and suggestions from every user. Whether you have found a bug, want to request a new tool, or have any questions, feel free to reach out via GitHub Issues.',
      methods: {
        github: {
          title: 'GitHub Issues',
          support: 'github.com/Zhaijiawen/tool_hub/issues'
        }
      }
    },
    thanks: {
      title: 'Acknowledgments',
      intro: 'ToolHub is built on the shoulders of many outstanding open-source projects. We extend our sincere thanks to:',
      list: {
        vue: 'The Vue.js team and global community contributors — thank you for building such an elegant frontend framework',
        naiveui: 'The Naive UI development team — thank you for providing a beautiful and fully-featured Vue 3 component library',
        crypto: 'Maintainers of crypto-js, forge, elliptic, and other cryptographic libraries — thank you for making rigorous cryptography accessible in the browser',
        users: 'All developers who use ToolHub and submit feedback — your support is our greatest motivation for continuous improvement'
      },
      support: 'ToolHub is continuously updated and maintained, with new tools added and the experience improved regularly. Thank you to every developer who trusts us!'
    }
  }
}

export const getAboutText = (key, locale = 'zh-CN') => {
  // 支持多种中文 locale 格式
  const isChinese = locale === 'zh-CN' || locale === 'zh' || locale.startsWith('zh')
  const texts = isChinese ? aboutText['zh-CN'] : aboutText['en-US']
  return key.split('.').reduce((obj, k) => obj?.[k], texts) || key
} 