// 工具详细描述数据 - 避免i18n转义问题
export const toolDescriptions = {
  // 格式化工具
  json: {
    title: 'JSON 格式化工具',
    description: '专业的 JSON 数据格式化工具，支持美化、压缩、转义等多种操作',
    features: [
      '智能语法高亮显示',
      '自动错误检测和提示',
      '支持多种格式化选项',
      '一键复制和下载'
    ],
    useCases: [
      'API 响应数据调试',
      '配置文件格式化和验证',
      '代码审查和文档编写',
      '数据交换格式处理'
    ],
    technicalBackground: `JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，基于 JavaScript 编程语言的一个子集。它采用完全独立于编程语言的文本格式，但也使用了类似于 C 语言家族的习惯。

JSON 具有以下特点：
• 易于人阅读和编写
• 易于机器解析和生成
• 支持嵌套数据结构
• 支持数组和对象类型

JSON 广泛应用于：
• Web API 数据交换
• 配置文件存储
• 数据库数据序列化
• 跨平台数据通信`,
    usageSteps: [
      '将 JSON 数据粘贴到输入框',
      '选择格式化选项（美化/压缩/转义）',
      '点击相应按钮进行处理',
      '复制或下载处理结果'
    ],
    bestPractices: [
      '使用 2 或 4 个空格进行缩进',
      '保持键名的一致性',
      '避免过深的嵌套结构',
      '及时验证 JSON 格式的正确性'
    ]
  },

  xml: {
    title: 'XML 格式化工具',
    description: '专业的 XML 文档格式化工具，支持美化、压缩、验证等功能',
    features: [
      'XML 语法高亮显示',
      '自动缩进和格式化',
      'XML 有效性验证',
      '支持 DTD 和 Schema 验证'
    ],
    useCases: [
      '配置文件格式化和验证',
      'Web 服务数据交换',
      '文档结构优化',
      'XML 文档编辑和调试'
    ],
    technicalBackground: `XML（Extensible Markup Language）是一种标记语言，用于存储和传输数据。它被设计为具有自我描述性，并且是 W3C 的推荐标准。

XML 的主要特点：
• 可扩展的标记语言
• 严格的语法规则
• 支持命名空间
• 支持 DTD 和 Schema 验证

XML 广泛应用于：
• 配置文件格式
• Web 服务数据交换
• 文档存储和传输
• 数据序列化`,
    usageSteps: [
      '将 XML 内容粘贴到输入框',
      '选择格式化选项',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用有意义的标签名',
      '保持文档结构清晰',
      '适当使用注释说明',
      '遵循 XML 命名规范'
    ]
  },

  // 加密工具
  base64: {
    title: 'Base64 编码解码工具',
    description: '专业的 Base64 编码解码工具，支持文本和图片的编码转换',
    features: [
      '支持文本和图片编码',
      '智能内容类型检测',
      '批量处理功能',
      '多种编码标准支持'
    ],
    useCases: [
      '图片内嵌到 HTML/CSS',
      '二进制数据传输',
      'API 认证信息编码',
      '文件附件编码'
    ],
    technicalBackground: `Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方法。它使用 A-Z、a-z、0-9、+、/ 这 64 个字符来表示二进制数据。

Base64 编码原理：
• 将二进制数据按 6 位分组
• 每组转换为对应的可打印字符
• 不足 6 位时用 = 填充
• 编码后数据量增加约 33%

应用场景：
• 图片内嵌到网页
• 二进制数据在文本协议中传输
• 简单的数据混淆
• 文件附件编码`,
    usageSteps: [
      '输入要编码的文本或上传图片',
      '选择编码或解码操作',
      '点击相应按钮进行处理',
      '复制或下载结果'
    ],
    bestPractices: [
      '注意编码后的数据量会增加',
      '大文件建议使用专门的工具',
      '注意字符编码的一致性',
      '验证解码结果的正确性'
    ]
  },

  aes: {
    title: 'AES 加密解密工具',
    description: '高级加密标准（AES）工具，提供强大的数据加密保护',
    features: [
      '支持 128/192/256 位密钥',
      '多种加密模式（CBC、ECB、CFB、OFB）',
      '安全的密钥生成',
      '实时加密解密'
    ],
    useCases: [
      '敏感数据加密存储',
      'API 通信数据保护',
      '文件内容加密',
      '密码和密钥管理'
    ],
    technicalBackground: `AES（Advanced Encryption Standard）是一种对称加密算法，被美国国家标准与技术研究院（NIST）采用为联邦信息处理标准。

AES 特点：
• 对称加密算法
• 支持 128、192、256 位密钥长度
• 分组密码，块大小为 128 位
• 经过广泛的安全验证

加密模式：
• ECB：电子密码本模式
• CBC：密码分组链接模式
• CFB：密文反馈模式
• OFB：输出反馈模式`,
    usageSteps: [
      '输入要加密的文本',
      '设置密钥和加密参数',
      '选择加密或解密操作',
      '获取处理结果'
    ],
    bestPractices: [
      '使用强密钥（随机生成）',
      '避免使用 ECB 模式',
      '安全保存密钥信息',
      '定期更换加密密钥'
    ]
  },

  ecc: {
    title: 'ECC 椭圆曲线加密工具',
    description: '专业的椭圆曲线密码学工具，提供高效的公钥加密和数字签名',
    features: [
      '支持多种椭圆曲线（secp256k1、P-256等）',
      '公钥加密和数字签名',
      '密钥对生成和验证',
      '高效的加密算法'
    ],
    useCases: [
      '区块链和加密货币',
      'SSL/TLS 安全通信',
      '数字证书和身份验证',
      '移动设备安全'
    ],
    technicalBackground: `ECC（Elliptic Curve Cryptography）是一种基于椭圆曲线数学的公钥密码学方法。

ECC 优势：
• 相比 RSA，在相同安全级别下密钥更短
• 计算效率更高，适合资源受限环境
• 支持多种椭圆曲线标准
• 广泛应用于现代密码学

常用椭圆曲线：
• secp256k1：比特币使用的曲线
• P-256：NIST 标准曲线
• P-384：高安全级别曲线
• P-521：最高安全级别曲线

应用场景：
• 数字签名算法（ECDSA）
• 密钥交换协议（ECDH）
• 加密算法（ECIES）
• 身份验证和证书`,
    usageSteps: [
      '选择椭圆曲线类型',
      '生成密钥对',
      '输入要加密的数据',
      '执行加密或签名操作'
    ],
    bestPractices: [
      '使用标准化的椭圆曲线',
      '安全保存私钥',
      '验证公钥的有效性',
      '定期更新密钥对'
    ]
  },

  ecdh: {
    title: 'ECDH 椭圆曲线密钥交换工具',
    description: '专业的椭圆曲线 Diffie-Hellman 密钥交换工具，用于安全生成共享密钥',
    features: [
      '支持多种椭圆曲线标准',
      '安全的密钥交换协议',
      '实时密钥生成',
      '密钥验证功能'
    ],
    useCases: [
      '安全通信协议',
      'VPN 和隧道连接',
      '移动应用安全',
      'IoT 设备通信'
    ],
    technicalBackground: `ECDH（Elliptic Curve Diffie-Hellman）是一种基于椭圆曲线的密钥交换协议，是传统 DH 算法的椭圆曲线版本。

ECDH 工作原理：
• 双方各自生成私钥和公钥
• 交换公钥信息
• 使用自己的私钥和对方的公钥计算共享密钥
• 双方得到相同的共享密钥

安全优势：
• 基于椭圆曲线离散对数问题
• 相比传统 DH，密钥更短但安全性更高
• 计算效率更高
• 适合资源受限环境

常用椭圆曲线：
• secp256k1：比特币标准
• P-256：NIST 标准
• P-384：高安全级别
• Curve25519：现代高性能曲线

应用场景：
• TLS/SSL 握手协议
• 安全消息传递
• 端到端加密
• 密钥派生基础`,
    usageSteps: [
      '选择椭圆曲线类型',
      '生成本地密钥对',
      '输入对方公钥',
      '计算共享密钥'
    ],
    bestPractices: [
      '使用标准化的椭圆曲线',
      '验证对方公钥的有效性',
      '定期更新密钥对',
      '安全传输公钥信息'
    ]
  },

  ecdsa: {
    title: 'ECDSA 椭圆曲线数字签名工具',
    description: '专业的椭圆曲线数字签名算法工具，提供高效的数字签名和验证',
    features: [
      '支持多种椭圆曲线标准',
      '数字签名生成和验证',
      '密钥对管理',
      '签名格式转换'
    ],
    useCases: [
      '区块链交易签名',
      '软件包完整性验证',
      '数字证书签名',
      '安全通信认证'
    ],
    technicalBackground: `ECDSA（Elliptic Curve Digital Signature Algorithm）是一种基于椭圆曲线的数字签名算法，是 DSA 算法的椭圆曲线版本。

ECDSA 工作原理：
• 使用私钥对消息哈希进行签名
• 生成两个数值（r, s）作为签名
• 使用公钥验证签名的有效性
• 确保消息的完整性和来源认证

安全优势：
• 基于椭圆曲线离散对数问题
• 相比 RSA 签名，密钥更短但安全性更高
• 计算效率更高
• 广泛用于现代密码学应用

签名过程：
• 计算消息的哈希值
• 生成随机数 k
• 计算椭圆曲线点 R = k * G
• 计算 r = R.x mod n
• 计算 s = k^(-1) * (hash + r * privateKey) mod n

验证过程：
• 计算消息哈希值
• 计算 w = s^(-1) mod n
• 计算 u1 = hash * w mod n
• 计算 u2 = r * w mod n
• 计算点 P = u1 * G + u2 * publicKey
• 验证 r == P.x mod n`,
    usageSteps: [
      '选择椭圆曲线类型',
      '生成或导入密钥对',
      '输入要签名的消息',
      '生成签名或验证签名'
    ],
    bestPractices: [
      '使用标准化的椭圆曲线',
      '安全保存私钥',
      '使用强随机数生成器',
      '定期更新密钥对'
    ]
  },

  // 转换工具
  timestamp: {
    title: '时间戳转换工具',
    description: '专业的时间戳转换工具，支持多种时间格式和时区转换',
    features: [
      '支持秒级和毫秒级时间戳',
      '多种日期格式转换',
      '时区自动识别和转换',
      '相对时间计算'
    ],
    useCases: [
      'API 时间参数处理',
      '日志时间分析',
      '数据库时间字段处理',
      '跨时区应用开发'
    ],
    technicalBackground: `时间戳是表示特定时间点的数字，通常是从某个固定时间点（如 Unix 纪元）开始计算的秒数或毫秒数。

时间戳类型：
• Unix 时间戳：从 1970-01-01 00:00:00 UTC 开始的秒数
• 毫秒时间戳：从 1970-01-01 00:00:00 UTC 开始的毫秒数
• JavaScript 时间戳：与毫秒时间戳相同

常见格式：
• ISO 8601：2023-12-18T15:10:56Z
• RFC 2822：Mon, 18 Dec 2023 15:10:56 GMT
• 自定义格式：2023/12/18 15:10:56`,
    usageSteps: [
      '输入时间戳或日期时间',
      '选择转换方向',
      '设置目标格式',
      '获取转换结果'
    ],
    bestPractices: [
      '注意时区差异',
      '使用标准时间格式',
      '考虑闰秒影响',
      '验证时间范围的有效性'
    ]
  },

  // 图像工具
  imageConvert: {
    title: '图像格式转换工具',
    description: '专业的图像格式转换工具，支持多种格式间的无损转换',
    features: [
      '支持 JPG、PNG、WebP、GIF 等格式',
      '质量参数可调节',
      '批量转换功能',
      '保持图像质量'
    ],
    useCases: [
      '网页图片优化',
      '移动应用图片处理',
      '图片格式标准化',
      '存储空间优化'
    ],
    technicalBackground: `不同的图像格式具有不同的特点和适用场景：

JPG（JPEG）：
• 有损压缩，文件小
• 适合照片和复杂图像
• 不支持透明背景

PNG：
• 无损压缩，质量高
• 支持透明背景
• 适合图标和简单图像

WebP：
• Google 开发的现代格式
• 更好的压缩率
• 支持动画和透明

GIF：
• 支持动画
• 颜色数量有限
• 适合简单动画`,
    usageSteps: [
      '上传要转换的图像',
      '选择目标格式',
      '调整质量参数',
      '下载转换结果'
    ],
    bestPractices: [
      '根据用途选择合适的格式',
      '注意图像质量和文件大小的平衡',
      '保持原始图像的备份',
      '考虑浏览器兼容性'
    ]
  },

  // 文本工具
  textCase: {
    title: '文本大小写转换工具',
    description: '专业的文本大小写转换工具，支持多种命名规范',
    features: [
      '支持多种大小写格式',
      '批量转换功能',
      '实时预览效果',
      '保持特殊字符'
    ],
    useCases: [
      '编程变量命名',
      '文档标题格式化',
      '数据库字段命名',
      'API 参数标准化'
    ],
    technicalBackground: `不同的编程语言和场景使用不同的大小写命名规范：

命名规范：
• camelCase：首单词小写，后续单词首字母大写（JavaScript 变量）
• PascalCase：所有单词首字母大写（类名）
• snake_case：单词间用下划线连接（Python 变量）
• kebab-case：单词间用连字符连接（CSS 类名）
• UPPER_SNAKE_CASE：全大写加下划线（常量）

应用场景：
• JavaScript：camelCase 用于变量，PascalCase 用于类
• Python：snake_case 用于变量和函数
• CSS：kebab-case 用于类名
• 数据库：snake_case 用于字段名`,
    usageSteps: [
      '输入要转换的文本',
      '选择目标格式',
      '点击转换按钮',
      '复制转换结果'
    ],
    bestPractices: [
      '保持命名的一致性',
      '遵循语言规范',
      '使用有意义的名称',
      '避免过长的名称'
    ]
  },

  // 其他工具
  qrcode: {
    title: '二维码生成工具',
    description: '专业的二维码生成和解析工具，支持多种数据类型',
    features: [
      '支持文本、URL、WiFi 等多种内容',
      '可调节二维码大小和纠错级别',
      '支持自定义颜色和样式',
      '二维码解析功能'
    ],
    useCases: [
      '产品信息展示',
      'WiFi 密码分享',
      '网址快速访问',
      '联系方式交换'
    ],
    technicalBackground: `二维码（QR Code）是一种矩阵式二维条码，能够存储比传统条码更多的信息。

二维码特点：
• 高密度编码
• 支持多种数据类型
• 具有纠错能力
• 支持中文等字符

纠错级别：
• L（Low）：7% 纠错能力
• M（Medium）：15% 纠错能力
• Q（Quartile）：25% 纠错能力
• H（High）：30% 纠错能力

支持的数据类型：
• 文本信息
• URL 链接
• 电子邮件
• 电话号码
• WiFi 配置`,
    usageSteps: [
      '输入要编码的内容',
      '选择二维码类型',
      '调整样式参数',
      '生成并下载二维码'
    ],
    bestPractices: [
      '选择合适的纠错级别',
      '确保二维码清晰可读',
      '测试扫描效果',
      '考虑打印尺寸'
    ]
  },

  // 更多格式化工具
  yaml: {
    title: 'YAML 格式化工具',
    description: '专业的 YAML 数据序列化格式化工具，支持配置文件和数据结构格式化',
    features: [
      'YAML 语法高亮显示',
      '自动缩进和格式化',
      'YAML 语法验证',
      '支持复杂数据结构'
    ],
    useCases: [
      'Docker 配置文件格式化',
      'Kubernetes 配置管理',
      'CI/CD 配置文件处理',
      'API 文档格式化'
    ],
    technicalBackground: `YAML（YAML Ain't Markup Language）是一种人类可读的数据序列化语言，常用于配置文件和数据交换。

YAML 特点：
• 人类可读的格式
• 支持复杂数据结构
• 支持注释和文档
• 与 JSON 兼容

数据结构支持：
• 标量：字符串、数字、布尔值
• 序列：数组和列表
• 映射：键值对和对象
• 锚点和别名：引用和复用

应用场景：
• 配置文件格式
• 数据交换格式
• API 文档
• 系统配置管理`,
    usageSteps: [
      '将 YAML 内容粘贴到输入框',
      '选择格式化选项',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用 2 个空格进行缩进',
      '保持键名的一致性',
      '适当使用注释说明',
      '避免过深的嵌套结构'
    ]
  },

  js: {
    title: 'JavaScript 格式化工具',
    description: '专业的 JavaScript 代码格式化工具，支持 ES6+ 语法和现代开发规范',
    features: [
      'JavaScript 语法高亮',
      'ES6+ 语法支持',
      '代码风格统一',
      '自动分号和括号处理'
    ],
    useCases: [
      '代码审查和格式化',
      '团队代码风格统一',
      '开源项目贡献',
      '代码质量提升'
    ],
    technicalBackground: `JavaScript 是一种动态类型、解释型的编程语言，广泛应用于 Web 开发和服务器端开发。

现代 JavaScript 特点：
• ES6+ 语法支持
• 模块化开发
• 异步编程支持
• 函数式编程特性

代码格式化标准：
• 缩进：2 或 4 个空格
• 分号：可选，建议使用
• 引号：单引号或双引号
• 行长度：80-120 字符

工具生态：
• ESLint：代码质量检查
• Prettier：代码格式化
• Babel：语法转换
• TypeScript：类型检查`,
    usageSteps: [
      '粘贴 JavaScript 代码',
      '选择格式化选项',
      '点击格式化按钮',
      '复制格式化后的代码'
    ],
    bestPractices: [
      '遵循团队代码规范',
      '使用现代 JavaScript 语法',
      '保持代码简洁清晰',
      '适当添加注释说明'
    ]
  },

  html: {
    title: 'HTML 格式化工具',
    description: '专业的 HTML 标记语言格式化工具，规范文档结构和提升代码质量',
    features: [
      'HTML 语法高亮',
      '标签自动缩进',
      '属性排序和格式化',
      'HTML5 标准支持'
    ],
    useCases: [
      '网页开发代码格式化',
      '模板文件处理',
      'HTML 文档优化',
      'SEO 友好格式化'
    ],
    technicalBackground: `HTML（HyperText Markup Language）是用于创建网页的标准标记语言，是 Web 开发的基础。

HTML 特点：
• 语义化标记
• 结构化文档
• 可访问性支持
• SEO 友好

HTML5 新特性：
• 语义化标签
• 多媒体支持
• 表单增强
• Canvas 和 WebGL

最佳实践：
• 使用语义化标签
• 保持文档结构清晰
• 确保可访问性
• 优化 SEO 效果`,
    usageSteps: [
      '粘贴 HTML 代码',
      '选择格式化选项',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用语义化标签',
      '保持代码结构清晰',
      '确保标签正确闭合',
      '优化页面加载性能'
    ]
  },

  css: {
    title: 'CSS 格式化工具',
    description: '专业的 CSS 样式表格式化工具，美化代码结构并提升可维护性',
    features: [
      'CSS 语法高亮',
      '属性自动排序',
      '选择器格式化',
      'CSS3 特性支持'
    ],
    useCases: [
      '样式表代码格式化',
      'CSS 代码优化',
      '团队协作开发',
      '样式维护和重构'
    ],
    technicalBackground: `CSS（Cascading Style Sheets）是用于描述网页样式的样式表语言，控制页面的外观和布局。

CSS 特点：
• 层叠样式规则
• 选择器系统
• 盒模型布局
• 响应式设计

CSS3 新特性：
• Flexbox 布局
• Grid 布局
• 动画和过渡
• 媒体查询

代码组织：
• 模块化 CSS
• BEM 命名规范
• CSS 预处理器
• 后处理器工具`,
    usageSteps: [
      '粘贴 CSS 代码',
      '选择格式化选项',
      '点击格式化按钮',
      '复制格式化结果'
    ],
    bestPractices: [
      '使用 BEM 命名规范',
      '保持选择器简洁',
      '避免过度嵌套',
      '优化选择器性能'
    ]
  },

  sql: {
    title: 'SQL 格式化工具',
    description: '专业的 SQL 查询语句格式化工具，规范数据库查询代码并提升可读性',
    features: [
      'SQL 语法高亮',
      '关键字大写处理',
      '子查询格式化',
      '多数据库方言支持'
    ],
    useCases: [
      '数据库查询优化',
      'SQL 代码审查',
      '数据库文档编写',
      '查询性能分析'
    ],
    technicalBackground: `SQL（Structured Query Language）是用于管理关系数据库的标准语言，支持数据查询、插入、更新和删除。

SQL 特点：
• 声明式语言
• 关系代数基础
• 事务处理支持
• 数据完整性约束

主要操作：
• SELECT：数据查询
• INSERT：数据插入
• UPDATE：数据更新
• DELETE：数据删除

性能优化：
• 索引使用
• 查询计划优化
• 连接查询优化
• 子查询优化`,
    usageSteps: [
      '粘贴 SQL 查询语句',
      '选择格式化选项',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用有意义的表别名',
      '避免 SELECT *',
      '合理使用索引',
      '优化 JOIN 查询'
    ]
  },

  // 更多加密工具
  hex: {
    title: '十六进制编码工具',
    description: '专业的十六进制编码解码工具，支持二进制数据转换和颜色值处理',
    features: [
      '十六进制编码解码',
      '二进制数据转换',
      '颜色值处理',
      '批量转换功能'
    ],
    useCases: [
      '二进制数据分析',
      '颜色值转换',
      '网络协议分析',
      '数据调试和验证'
    ],
    technicalBackground: `十六进制（Hexadecimal）是一种基于 16 的计数系统，在计算机科学中广泛应用。

十六进制特点：
• 每个数字表示 4 位二进制
• 使用 0-9 和 A-F 表示
• 便于表示二进制数据
• 在编程中常用

应用场景：
• 内存地址表示
• 颜色值编码
• 二进制数据查看
• 网络协议分析

转换关系：
• 1 个十六进制位 = 4 个二进制位
• 2 个十六进制位 = 1 个字节
• 6 个十六进制位 = 24 位颜色值`,
    usageSteps: [
      '输入要转换的数据',
      '选择转换方向',
      '点击转换按钮',
      '查看转换结果'
    ],
    bestPractices: [
      '注意大小写一致性',
      '验证转换结果',
      '处理特殊字符',
      '考虑数据完整性'
    ]
  },

  // 更多转换工具
  color: {
    title: '颜色格式转换工具',
    description: '专业的颜色格式转换工具，支持 HEX、RGB、HSL 等多种颜色格式',
    features: [
      '多种颜色格式支持',
      '实时颜色预览',
      '颜色选择器',
      '批量转换功能'
    ],
    useCases: [
      '网页设计颜色处理',
      'CSS 样式开发',
      '图像处理颜色调整',
      '品牌色彩管理'
    ],
    technicalBackground: `颜色是视觉设计的重要元素，不同的颜色格式适用于不同的应用场景。

颜色格式：
• HEX：十六进制颜色值
• RGB：红绿蓝三原色
• HSL：色相饱和度亮度
• CMYK：印刷四色模式

颜色空间：
• sRGB：标准 RGB 色彩空间
• Adobe RGB：专业色彩空间
• P3：广色域显示色彩空间
• LAB：设备无关色彩空间

应用场景：
• Web 开发：HEX、RGB
• 设计软件：HSL、CMYK
• 移动开发：ARGB
• 印刷设计：CMYK`,
    usageSteps: [
      '输入颜色值或使用选择器',
      '选择目标格式',
      '查看转换结果',
      '复制颜色值'
    ],
    bestPractices: [
      '考虑色彩空间差异',
      '注意透明度处理',
      '验证颜色准确性',
      '考虑可访问性'
    ]
  },

  // 更多文本工具
  replace: {
    title: '文本替换工具',
    description: '强大的文本替换工具，支持简单替换和正则表达式替换',
    features: [
      '简单文本替换',
      '正则表达式支持',
      '批量替换功能',
      '实时预览效果'
    ],
    useCases: [
      '代码重构和修改',
      '数据格式转换',
      '文档批量处理',
      '文本清理和标准化'
    ],
    technicalBackground: `文本替换是文本处理的基础操作，支持多种替换模式和规则。

替换模式：
• 简单替换：直接字符串替换
• 正则替换：模式匹配替换
• 条件替换：基于条件的替换
• 批量替换：多规则同时替换

正则表达式：
• 字符类：匹配特定字符
• 量词：控制匹配次数
• 分组：捕获和引用
• 断言：位置匹配

应用技巧：
• 使用非贪婪匹配
• 合理使用分组
• 注意转义字符
• 测试替换效果`,
    usageSteps: [
      '输入要处理的文本',
      '设置查找和替换规则',
      '选择替换模式',
      '执行替换操作'
    ],
    bestPractices: [
      '备份原始数据',
      '测试替换规则',
      '使用非贪婪匹配',
      '验证替换结果'
    ]
  },

  reverse: {
    title: '文本反转工具',
    description: '专业的文本反转和排序工具，支持多种反转和排序方式',
    features: [
      '文本字符反转',
      '行级反转排序',
      '单词级反转',
      '自定义排序规则'
    ],
    useCases: [
      '数据处理和分析',
      '文本加密和解密',
      '代码混淆处理',
      '文本格式转换'
    ],
    technicalBackground: `文本反转是字符串处理的基本操作，有多种反转方式和应用场景。

反转类型：
• 字符反转：逐字符反转
• 单词反转：按单词反转
• 行反转：按行反转
• 部分反转：指定范围反转

排序方式：
• 字母顺序：A-Z 或 Z-A
• 数字顺序：升序或降序
• 长度排序：按字符串长度
• 自定义排序：用户定义规则

应用场景：
• 数据验证和测试
• 文本加密算法
• 代码混淆技术
• 数据处理流程`,
    usageSteps: [
      '输入要处理的文本',
      '选择反转或排序方式',
      '设置处理参数',
      '查看处理结果'
    ],
    bestPractices: [
      '理解反转规则',
      '注意编码问题',
      '验证处理结果',
            '考虑性能影响'
    ]
  },

  calculator: {
    title: '科学计算器',
    description: '功能强大的在线科学计算器，支持基础运算和高级数学函数',
    features: [
      '基础四则运算',
      '科学计算函数',
      '进制转换功能',
      '计算历史记录'
    ],
    useCases: [
      '日常数学计算',
      '科学研究和工程计算',
      '编程中的数值计算',
      '学习和教学辅助'
    ],
    technicalBackground: `科学计算器提供多种数学运算功能，满足不同场景的计算需求。

基础运算：
• 加减乘除四则运算
• 百分比计算
• 正负号转换

科学函数：
• 三角函数：sin、cos、tan
• 反三角函数：asin、acos、atan
• 对数函数：log、ln
• 指数函数：exp、pow

进制转换：
• 二进制、八进制、十进制、十六进制
• 支持整数和小数转换
• 保持数值精度`,
    usageSteps: [
      '选择计算模式',
      '输入数学表达式',
      '点击计算按钮',
      '查看计算结果'
    ],
    bestPractices: [
      '注意运算符优先级',
      '使用括号明确运算顺序',
      '验证计算结果的合理性',
      '保存重要的计算历史'
    ]
  },

  // 更多转换工具
  regex: {
    title: '正则表达式工具',
    description: '专业的正则表达式测试和生成工具，支持多种正则语法和实时匹配测试',
    features: [
      '正则表达式测试',
      '实时匹配预览',
      '多种正则语法支持',
      '正则表达式生成'
    ],
    useCases: [
      '文本模式匹配',
      '数据验证规则',
      '字符串搜索替换',
      '编程中的文本处理'
    ],
    technicalBackground: `正则表达式是一种强大的文本模式匹配工具，广泛应用于编程和文本处理。

正则表达式特点：
• 模式匹配和搜索
• 字符串替换和验证
• 支持复杂匹配规则
• 跨语言通用性

常用语法：
• 字符类：\\d（数字）、\\w（单词字符）
• 量词：*（0或多）、+（1或多）、?（0或1）
• 分组：() 捕获组、(?:) 非捕获组
• 断言：^（行首）、$（行尾）、\\b（词边界）

应用场景：
• 表单验证
• 日志分析
• 文本搜索
• 数据清洗`,
    usageSteps: [
      '输入正则表达式',
      '提供测试文本',
      '查看匹配结果',
      '调整正则表达式'
    ],
    bestPractices: [
      '使用非贪婪匹配',
      '合理使用分组',
      '注意转义字符',
      '测试边界情况'
    ]
  },

  markdown: {
    title: 'Markdown 编辑器',
    description: '专业的 Markdown 编辑和预览工具，支持实时预览和多种 Markdown 语法',
    features: [
      '实时 Markdown 预览',
      '语法高亮显示',
      '多种 Markdown 扩展',
      '导出多种格式'
    ],
    useCases: [
      '文档编写和编辑',
      '技术博客创作',
      '项目文档维护',
      '笔记整理和分享'
    ],
    technicalBackground: `Markdown 是一种轻量级标记语言，设计目标是让文档易于阅读和编写。

Markdown 特点：
• 纯文本格式
• 易于学习和使用
• 可转换为多种格式
• 专注于内容而非格式

基础语法：
• 标题：# 一级标题
• 列表：- 无序列表、1. 有序列表
• 链接：[文本](URL)
• 图片：![alt](图片URL)
• 代码：\`行内代码\`、\`\`\`代码块

扩展功能：
• 表格支持
• 任务列表
• 数学公式
• 图表支持`,
    usageSteps: [
      '在编辑区输入 Markdown 文本',
      '实时查看预览效果',
      '调整格式和内容',
      '导出或复制结果'
    ],
    bestPractices: [
      '保持文档结构清晰',
      '使用有意义的标题',
      '适当添加链接和图片',
      '定期备份重要文档'
    ]
  },

  number: {
    title: '数字转换工具',
    description: '专业的数字格式转换工具，支持科学计数法、货币格式等多种数字表示',
    features: [
      '科学计数法转换',
      '货币格式处理',
      '数字精度控制',
      '批量数字处理'
    ],
    useCases: [
      '科学计算数据处理',
      '财务报表格式化',
      '数据分析和统计',
      '编程中的数值处理'
    ],
    technicalBackground: `数字在不同场景下需要不同的表示格式，数字转换工具提供多种格式支持。

数字格式：
• 科学计数法：1.23e+10
• 货币格式：$1,234.56
• 百分比：12.34%
• 分数：1/3

精度控制：
• 固定小数位数
• 有效数字控制
• 舍入规则设置
• 零值处理

应用场景：
• 科学计算
• 财务数据处理
• 统计分析
• 数据可视化`,
    usageSteps: [
      '输入要转换的数字',
      '选择目标格式',
      '设置精度参数',
      '查看转换结果'
    ],
    bestPractices: [
      '注意数值精度损失',
      '选择合适的格式',
      '验证转换结果',
      '考虑国际化需求'
    ]
  },

  unit: {
    title: '单位转换工具',
    description: '专业的物理单位转换工具，支持长度、重量、温度等多种单位转换',
    features: [
      '多种物理单位支持',
      '实时转换计算',
      '单位分类管理',
      '转换历史记录'
    ],
    useCases: [
      '工程计算和设计',
      '科学研究和实验',
      '国际贸易和物流',
      '日常生活计算'
    ],
    technicalBackground: `单位转换是科学计算和工程应用中的基础需求，涉及多种物理量。

常用单位类型：
• 长度：米、英尺、英寸、公里
• 重量：千克、磅、盎司、吨
• 温度：摄氏度、华氏度、开尔文
• 面积：平方米、平方英尺、公顷

转换原理：
• 基于标准单位定义
• 使用转换系数
• 保持物理量不变
• 考虑精度和误差

应用领域：
• 工程计算
• 科学研究
• 国际贸易
• 日常生活`,
    usageSteps: [
      '选择单位类型',
      '输入数值和原单位',
      '选择目标单位',
      '查看转换结果'
    ],
    bestPractices: [
      '注意单位精度',
      '验证转换系数',
      '考虑温度转换特殊性',
      '保存常用转换'
    ]
  },

  httpStatus: {
    title: 'HTTP 状态码查询工具',
    description: '专业的 HTTP 状态码查询和解释工具，提供详细的状态码说明和最佳实践',
    features: [
      '完整的状态码数据库',
      '详细的状态码说明',
      '使用场景和最佳实践',
      '状态码分类管理'
    ],
    useCases: [
      'Web 开发调试',
      'API 设计和开发',
      '网络问题诊断',
      '系统监控和运维'
    ],
    technicalBackground: `HTTP 状态码是 HTTP 协议中用于表示请求处理结果的数字代码。

状态码分类：
• 1xx：信息性状态码
• 2xx：成功状态码
• 3xx：重定向状态码
• 4xx：客户端错误状态码
• 5xx：服务器错误状态码

常见状态码：
• 200：OK，请求成功
• 404：Not Found，资源未找到
• 500：Internal Server Error，服务器内部错误
• 301：Moved Permanently，永久重定向

应用场景：
• Web 开发
• API 设计
• 网络调试
• 系统监控`,
    usageSteps: [
      '输入状态码或搜索关键词',
      '查看详细说明',
      '了解使用场景',
      '参考最佳实践'
    ],
    bestPractices: [
      '使用标准状态码',
      '提供有意义的错误信息',
      '合理使用重定向',
      '监控错误状态码'
    ]
  },

  charCode: {
    title: '字符编码转换工具',
    description: '专业的字符编码转换工具，支持 ASCII、Unicode、UTF-8 等多种编码格式',
    features: [
      '多种编码格式支持',
      '字符编码表查询',
      '批量编码转换',
      '编码问题诊断'
    ],
    useCases: [
      '文本编码处理',
      '国际化应用开发',
      '数据导入导出',
      '编码问题排查'
    ],
    technicalBackground: `字符编码是计算机中表示字符的标准方式，不同的编码格式适用于不同场景。

常用编码格式：
• ASCII：7位编码，支持英文字符
• UTF-8：变长编码，支持全球字符
• UTF-16：16位编码，支持 Unicode
• ISO-8859：欧洲语言编码

编码特点：
• ASCII：简单高效，仅支持英文
• UTF-8：向后兼容，广泛使用
• UTF-16：固定长度，处理效率高
• Unicode：统一字符集标准

应用场景：
• 文本处理
• 国际化开发
• 数据交换
• 系统集成`,
    usageSteps: [
      '输入要转换的文本',
      '选择源编码和目标编码',
      '执行编码转换',
      '查看转换结果'
    ],
    bestPractices: [
      '统一使用 UTF-8 编码',
      '注意编码兼容性',
      '处理特殊字符',
      '验证转换结果'
    ]
  },

  dateCalc: {
    title: '日期计算工具',
    description: '专业的日期计算工具，支持日期加减、工作日计算、时区转换等功能',
    features: [
      '日期加减计算',
      '工作日计算',
      '时区转换',
      '日期格式转换'
    ],
    useCases: [
      '项目计划制定',
      '财务计算',
      '日程安排',
      '数据分析'
    ],
    technicalBackground: `日期计算涉及复杂的历法规则和时区处理，需要考虑多种因素。

计算类型：
• 日期加减：天、周、月、年
• 工作日计算：排除周末和节假日
• 时区转换：考虑夏令时
• 日期差值：计算两个日期之间的间隔

历法系统：
• 公历（格里高利历）
• 农历（中国传统历法）
• 伊斯兰历
• 犹太历

时区处理：
• UTC 协调世界时
• 时区偏移量
• 夏令时规则
• 时区数据库`,
    usageSteps: [
      '选择计算类型',
      '输入日期参数',
      '设置计算规则',
      '查看计算结果'
    ],
    bestPractices: [
      '注意时区差异',
      '考虑闰年规则',
      '处理边界情况',
      '验证计算结果'
    ]
  },

  // 更多加密工具
  rsa: {
    title: 'RSA 加密解密工具',
    description: '专业的 RSA 非对称加密工具，支持公钥加密和私钥解密',
    features: [
      'RSA 密钥生成',
      '公钥加密私钥解密',
      '数字签名验证',
      '多种密钥长度支持'
    ],
    useCases: [
      '安全通信加密',
      '数字证书管理',
      'API 安全认证',
      '文件加密保护'
    ],
    technicalBackground: `RSA 是一种非对称加密算法，基于大数分解的数学难题。

RSA 原理：
• 公钥加密，私钥解密
• 基于大素数分解难题
• 支持数字签名
• 密钥长度影响安全性

密钥长度：
• 1024 位：基本安全
• 2048 位：推荐使用
• 4096 位：高安全要求

应用场景：
• SSL/TLS 协议
• 数字证书
• 安全通信
• 身份认证`,
    usageSteps: [
      '生成 RSA 密钥对',
      '使用公钥加密数据',
      '使用私钥解密数据',
      '验证数字签名'
    ],
    bestPractices: [
      '使用足够长的密钥',
      '安全保存私钥',
      '定期更换密钥',
      '验证密钥有效性'
    ]
  },

  sha: {
    title: 'SHA 哈希计算工具',
    description: '专业的 SHA 哈希算法工具，支持 SHA-1、SHA-256、SHA-512 等多种算法',
    features: [
      '多种 SHA 算法支持',
      '文件哈希计算',
      '哈希值验证',
      '批量哈希处理'
    ],
    useCases: [
      '文件完整性验证',
      '密码哈希存储',
      '数字签名',
      '数据去重'
    ],
    technicalBackground: `SHA（Secure Hash Algorithm）是一系列密码学哈希函数，用于生成数据的数字指纹。

SHA 算法：
• SHA-1：160 位哈希值
• SHA-256：256 位哈希值
• SHA-512：512 位哈希值
• SHA-3：新一代哈希算法

哈希特点：
• 确定性：相同输入产生相同输出
• 雪崩效应：输入微小变化导致输出巨大变化
• 单向性：无法从哈希值反推原始数据
• 抗碰撞性：难以找到相同哈希值的不同输入

应用场景：
• 文件完整性检查
• 密码安全存储
• 数字签名
• 区块链技术`,
    usageSteps: [
      '选择 SHA 算法',
      '输入要哈希的数据',
      '计算哈希值',
      '验证哈希结果'
    ],
    bestPractices: [
      '使用 SHA-256 或更高版本',
      '加盐处理密码哈希',
      '验证文件完整性',
      '安全存储哈希值'
    ]
  },

  jwt: {
    title: 'JWT 编码解码工具',
    description: '专业的 JWT（JSON Web Token）编码解码工具，支持令牌生成和验证',
    features: [
      'JWT 令牌生成',
      '令牌解码和验证',
      '多种签名算法',
      '令牌过期时间设置'
    ],
    useCases: [
      '用户身份认证',
      'API 访问控制',
      '单点登录系统',
      '微服务通信'
    ],
    technicalBackground: `JWT 是一种开放标准，用于在各方之间安全地传输信息作为 JSON 对象。

JWT 结构：
• Header：算法和令牌类型
• Payload：声明和数据
• Signature：签名验证

JWT 特点：
• 自包含：包含所有必要信息
• 无状态：服务器无需存储会话
• 可扩展：支持自定义声明
• 标准化：RFC 7519 标准

签名算法：
• HMAC：对称密钥签名
• RSA：非对称密钥签名
• ECDSA：椭圆曲线签名

应用场景：
• 身份认证
• 信息交换
• 授权控制
• 会话管理`,
    usageSteps: [
      '设置 JWT 参数',
      '生成 JWT 令牌',
      '解码和验证令牌',
      '查看令牌内容'
    ],
    bestPractices: [
      '使用强密钥签名',
      '设置合理的过期时间',
      '验证令牌签名',
      '保护敏感信息'
    ]
  },

  shortUrl: {
    title: '短链接生成工具',
    description: '专业的短链接生成和管理工具，支持自定义短链接和访问统计',
    features: [
      '短链接生成',
      '自定义短链接',
      '访问统计',
      '链接有效期设置'
    ],
    useCases: [
      '社交媒体分享',
      '营销活动推广',
      '链接追踪分析',
      '长链接简化'
    ],
    technicalBackground: `短链接是一种将长 URL 转换为短 URL 的服务，便于分享和传播。

短链接原理：
• 长 URL 映射到短标识符
• 重定向机制实现访问
• 数据库存储映射关系
• 统计访问数据

生成算法：
• 随机字符串生成
• 哈希算法生成
• 自增 ID 编码
• 自定义标识符

应用场景：
• 社交媒体
• 电子邮件营销
• 短信营销
• 二维码链接`,
    usageSteps: [
      '输入长链接',
      '选择生成方式',
      '生成短链接',
      '分享和追踪'
    ],
    bestPractices: [
      '使用 HTTPS 协议',
      '设置合理的过期时间',
      '监控链接访问',
      '保护用户隐私'
    ]
  },

  ipTools: {
    title: 'IP 地址工具',
    description: '专业的 IP 地址查询和分析工具，支持 IP 信息查询、地理位置定位等功能',
    features: [
      'IP 地址信息查询',
      '地理位置定位',
      'IP 地址转换',
      '网络诊断工具'
    ],
    useCases: [
      '网络故障排查',
      '地理位置分析',
      '网络安全监控',
      '网络配置管理'
    ],
    technicalBackground: `IP 地址是互联网协议中用于标识网络设备的数字地址。

IP 地址类型：
• IPv4：32 位地址，如 192.168.1.1
• IPv6：128 位地址，如 2001:db8::1
• 公网 IP：互联网可访问
• 私网 IP：局域网使用

IP 地址分类：
• A 类：1.0.0.0 - 126.255.255.255
• B 类：128.0.0.0 - 191.255.255.255
• C 类：192.0.0.0 - 223.255.255.255
• D 类：224.0.0.0 - 239.255.255.255

应用场景：
• 网络配置
• 安全监控
• 地理位置服务
• 网络诊断`,
    usageSteps: [
      '输入 IP 地址',
      '查询详细信息',
      '查看地理位置',
      '进行网络诊断'
    ],
    bestPractices: [
      '验证 IP 地址格式',
      '注意隐私保护',
      '使用可靠的查询服务',
      '定期更新 IP 数据库'
    ]
  },

  markdownFormat: {
    title: 'Markdown 格式化工具',
    description: '专业的 Markdown 文档格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Markdown 语法高亮显示',
      '自动缩进和格式化',
      '语法错误检测',
      '多种格式化选项'
    ],
    useCases: [
      '文档格式化和美化',
      '技术文档编写',
      '博客文章编辑',
      'README 文件优化'
    ],
    technicalBackground: `Markdown 是一种轻量级标记语言，由 John Gruber 于 2004 年创建，旨在让写作变得简单易读。

Markdown 特点：
• 易读易写：语法简单直观
• 纯文本格式：不依赖特定编辑器
• 可转换为多种格式：HTML、PDF、Word 等
• 广泛支持：GitHub、GitLab、Stack Overflow 等平台

Markdown 语法：
• 标题：使用 # 符号
• 列表：使用 - 或 * 符号
• 链接：使用 [文本](URL) 格式
• 代码：使用 \`代码\` 或 \`\`\`代码块\`\`\` 格式
• 表格：使用 | 分隔列，- 分隔表头

应用场景：
• 技术文档编写
• 博客文章创作
• 项目说明文档
• 学术论文写作`,
    usageSteps: [
      '将 Markdown 内容粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用标准的 Markdown 语法',
      '保持文档结构清晰',
      '适当使用标题层级',
      '注意代码块的语法高亮'
    ]
  },

  javaFormat: {
    title: 'Java 代码格式化工具',
    description: '专业的 Java 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Java 语法高亮显示',
      '自动缩进和格式化',
      '代码风格统一',
      '多种格式化选项'
    ],
    useCases: [
      'Java 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `Java 是一种面向对象的编程语言，由 Sun Microsystems 于 1995 年发布，具有跨平台、安全性高等特点。

Java 语言特点：
• 面向对象：支持封装、继承、多态
• 跨平台：一次编写，到处运行
• 强类型：编译时类型检查
• 自动内存管理：垃圾回收机制

Java 代码规范：
• 类名：使用 PascalCase（如 MyClass）
• 方法名：使用 camelCase（如 myMethod）
• 常量：使用 UPPER_SNAKE_CASE（如 MAX_SIZE）
• 包名：使用小写字母（如 com.example）

应用场景：
• 企业级应用开发
• Android 移动应用开发
• Web 后端服务开发
• 大数据处理应用`,
    usageSteps: [
      '将 Java 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 Java 编码规范',
      '保持代码结构清晰',
      '适当添加注释说明',
      '使用有意义的变量和方法名'
    ]
  },

  php: {
    title: 'PHP 代码格式化工具',
    description: '专业的 PHP 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'PHP 语法高亮显示',
      '自动缩进和格式化',
      'PSR 标准支持',
      '多种格式化选项'
    ],
    useCases: [
      'PHP 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `PHP 是一种服务器端脚本语言，主要用于 Web 开发，具有简单易学、功能强大等特点。

PHP 语言特点：
• 服务器端执行：在服务器上运行，生成 HTML
• 跨平台：支持 Windows、Linux、macOS
• 开源免费：社区活跃，资源丰富
• 数据库支持：支持多种数据库系统

PHP 代码规范（PSR）：
• PSR-1：基础编码标准
• PSR-2：编码风格指南
• PSR-4：自动加载标准
• PSR-12：扩展编码风格

应用场景：
• Web 网站开发
• API 接口开发
• CMS 系统开发
• 企业级应用开发`,
    usageSteps: [
      '将 PHP 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 PSR 编码规范',
      '使用有意义的变量名',
      '适当添加注释说明',
      '保持代码结构清晰'
    ]
  },

  ruby: {
    title: 'Ruby 代码格式化工具',
    description: '专业的 Ruby 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Ruby 语法高亮显示',
      '自动缩进和格式化',
      'Ruby 风格指南支持',
      '多种格式化选项'
    ],
    useCases: [
      'Ruby 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `Ruby 是一种动态、面向对象的编程语言，由松本行弘于 1995 年创建，以简洁优雅的语法著称。

Ruby 语言特点：
• 面向对象：一切都是对象
• 动态类型：运行时类型检查
• 简洁语法：优雅的代码风格
• 元编程：强大的反射能力

Ruby 代码风格：
• 使用 2 个空格缩进
• 方法名使用 snake_case
• 类名使用 CamelCase
• 常量使用 UPPER_SNAKE_CASE

应用场景：
• Web 应用开发（Ruby on Rails）
• 脚本自动化
• 系统管理工具
• 原型开发`,
    usageSteps: [
      '将 Ruby 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 Ruby 风格指南',
      '使用有意义的变量名',
      '保持代码简洁优雅',
      '适当添加注释说明'
    ]
  },

  shell: {
    title: 'Shell 脚本格式化工具',
    description: '专业的 Shell 脚本格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Shell 语法高亮显示',
      '自动缩进和格式化',
      '多种 Shell 方言支持',
      '多种格式化选项'
    ],
    useCases: [
      'Shell 脚本格式化和美化',
      '系统管理脚本编写',
      '自动化脚本开发',
      '脚本代码规范统一'
    ],
    technicalBackground: `Shell 脚本是一种用于自动化系统管理任务的脚本语言，在 Unix/Linux 系统中广泛使用。

Shell 脚本特点：
• 解释执行：无需编译，直接运行
• 系统集成：与操作系统紧密集成
• 文本处理：强大的文本处理能力
• 管道操作：支持命令管道和重定向

常见 Shell 类型：
• Bash：最常用的 Shell，功能强大
• Zsh：增强的 Shell，支持插件
• Fish：用户友好的 Shell
• Dash：轻量级 Shell

应用场景：
• 系统管理自动化
• 部署脚本编写
• 日志处理和分析
• 批量文件操作`,
    usageSteps: [
      '将 Shell 脚本粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用有意义的变量名',
      '添加适当的注释说明',
      '处理错误和异常情况',
      '遵循 Shell 脚本最佳实践'
    ]
  },

  vue: {
    title: 'Vue 代码格式化工具',
    description: '专业的 Vue 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Vue 语法高亮显示',
      '自动缩进和格式化',
      'Vue 风格指南支持',
      '多种格式化选项'
    ],
    useCases: [
      'Vue 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面，具有易学易用、功能强大等特点。

Vue 框架特点：
• 渐进式：可以逐步采用，从简单到复杂
• 响应式：数据变化自动更新视图
• 组件化：可复用的组件系统
• 轻量级：体积小，性能优秀

Vue 代码风格：
• 使用 2 个空格缩进
• 组件名使用 PascalCase
• 属性名使用 kebab-case
• 方法名使用 camelCase

应用场景：
• 单页应用开发
• 组件库开发
• 企业级应用开发
• 移动端应用开发`,
    usageSteps: [
      '将 Vue 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 Vue 风格指南',
      '使用有意义的组件名',
      '保持代码结构清晰',
      '适当添加注释说明'
    ]
  },

  ed25519: {
    title: 'Ed25519 数字签名工具',
    description: '专业的 Ed25519 数字签名工具，支持密钥生成、签名和验证功能',
    features: [
      'Ed25519 密钥对生成',
      '数字签名生成',
      '签名验证',
      '高性能椭圆曲线算法'
    ],
    useCases: [
      '数字签名和验证',
      '身份认证',
      '软件包签名',
      '区块链应用'
    ],
    technicalBackground: `Ed25519 是一种基于 Edwards25519 椭圆曲线的数字签名算法，由 Daniel J. Bernstein 等人设计。

Ed25519 特点：
• 高性能：签名和验证速度快
• 安全性高：基于椭圆曲线密码学
• 密钥长度短：公钥和私钥都是 32 字节
• 抗量子攻击：比 RSA 更安全

算法优势：
• 签名速度快：比 RSA 快 10-100 倍
• 密钥生成快：比 RSA 快 1000 倍
• 密钥长度短：公钥和私钥都是 256 位
• 安全性高：基于椭圆曲线离散对数问题

应用场景：
• 软件包签名验证
• 身份认证系统
• 区块链和加密货币
• 安全通信协议`,
    usageSteps: [
      '生成 Ed25519 密钥对',
      '使用私钥对数据进行签名',
      '使用公钥验证签名',
      '查看签名结果'
    ],
    bestPractices: [
      '安全保存私钥',
      '定期更换密钥对',
      '验证公钥的真实性',
      '使用安全的随机数生成器'
    ]
  },

  rsaSign: {
    title: 'RSA 数字签名工具',
    description: '专业的 RSA 数字签名工具，支持密钥生成、签名和验证功能',
    features: [
      'RSA 密钥对生成',
      '数字签名生成',
      '签名验证',
      '多种哈希算法支持'
    ],
    useCases: [
      '数字签名和验证',
      '身份认证',
      '软件包签名',
      '安全通信'
    ],
    technicalBackground: `RSA 数字签名是一种基于 RSA 公钥密码体制的数字签名算法，广泛用于身份认证和数据完整性验证。

RSA 签名特点：
• 非对称加密：使用公钥验证，私钥签名
• 安全性高：基于大整数分解问题
• 标准化：广泛支持的标准算法
• 兼容性好：与多种系统兼容

签名过程：
• 使用私钥对消息哈希进行加密
• 生成数字签名
• 使用公钥验证签名
• 确保消息完整性和身份认证

应用场景：
• 软件包签名验证
• SSL/TLS 证书
• 身份认证系统
• 安全通信协议`,
    usageSteps: [
      '生成 RSA 密钥对',
      '使用私钥对数据进行签名',
      '使用公钥验证签名',
      '查看签名结果'
    ],
    bestPractices: [
      '安全保存私钥',
      '使用强密钥长度（2048位以上）',
      '定期更换密钥对',
      '验证公钥的真实性'
    ]
  },

  url: {
    title: 'URL 编码解码工具',
    description: '专业的 URL 编码解码工具，支持 URL 安全字符转换',
    features: [
      'URL 编码和解码',
      '特殊字符处理',
      '批量处理功能',
      '多种编码标准支持'
    ],
    useCases: [
      'URL 参数编码',
      'Web 开发调试',
      'API 接口开发',
      '数据传输安全'
    ],
    technicalBackground: `URL 编码是一种将特殊字符转换为 URL 安全格式的方法，确保数据在 URL 中正确传输。

URL 编码原理：
• 将非 ASCII 字符转换为 %XX 格式
• 保留字母、数字和部分特殊字符
• 空格转换为 %20 或 +
• 确保 URL 的兼容性

编码规则：
• 字母 A-Z, a-z 保持不变
• 数字 0-9 保持不变
• 特殊字符 -_.~ 保持不变
• 其他字符转换为 %XX 格式

应用场景：
• Web 表单提交
• API 参数传递
• 文件下载链接
• 跨平台数据交换`,
    usageSteps: [
      '输入要编码或解码的文本',
      '选择编码或解码操作',
      '点击相应按钮进行处理',
      '复制或下载结果'
    ],
    bestPractices: [
      '注意字符编码的一致性',
      '验证解码结果的正确性',
      '处理特殊字符时要小心',
      '在 URL 中使用编码后的数据'
    ]
  },

  x25519: {
    title: 'X25519 密钥交换工具',
    description: '专业的 X25519 密钥交换工具，支持安全密钥协商',
    features: [
      'X25519 密钥对生成',
      '密钥交换计算',
      '共享密钥生成',
      '高性能椭圆曲线算法'
    ],
    useCases: [
      '密钥协商和交换',
      '安全通信协议',
      '端到端加密',
      '密钥派生'
    ],
    technicalBackground: `X25519 是一种基于 Curve25519 椭圆曲线的密钥交换算法，用于安全地协商共享密钥。

X25519 特点：
• 高性能：密钥交换速度快
• 安全性高：基于椭圆曲线密码学
• 密钥长度短：公钥和私钥都是 32 字节
• 抗量子攻击：比传统算法更安全

密钥交换过程：
• 双方生成各自的密钥对
• 交换公钥
• 使用自己的私钥和对方的公钥计算共享密钥
• 生成相同的共享密钥用于加密

应用场景：
• TLS/SSL 协议
• 端到端加密通信
• 密钥协商协议
• 安全消息传递`,
    usageSteps: [
      '生成 X25519 密钥对',
      '输入对方的公钥',
      '计算共享密钥',
      '查看密钥交换结果'
    ],
    bestPractices: [
      '安全保存私钥',
      '验证公钥的真实性',
      '定期更换密钥对',
      '使用安全的随机数生成器'
    ]
  },

  argon2: {
    title: 'Argon2 密码哈希工具',
    description: '专业的 Argon2 密码哈希工具，支持多种变体和参数配置',
    features: [
      'Argon2d/Argon2i/Argon2id 支持',
      '可调节内存和时间成本',
      '抗侧信道攻击',
      '密码哈希验证'
    ],
    useCases: [
      '密码安全存储',
      '用户认证系统',
      '密钥派生',
      '安全哈希计算'
    ],
    technicalBackground: `Argon2 是一种密码哈希函数，在 2015 年密码哈希竞赛中获胜，被设计为抗 GPU 和专用硬件攻击。

Argon2 特点：
• 内存硬性：需要大量内存，抗硬件攻击
• 可调节参数：内存成本、时间成本、并行度
• 三种变体：Argon2d、Argon2i、Argon2id
• 抗侧信道攻击：保护敏感信息

算法变体：
• Argon2d：数据依赖的内存访问
• Argon2i：数据独立的内存访问
• Argon2id：混合模式，推荐使用

应用场景：
• 密码存储和验证
• 密钥派生函数
• 区块链挖矿算法
• 安全系统设计`,
    usageSteps: [
      '选择 Argon2 变体',
      '设置哈希参数',
      '输入密码进行哈希',
      '验证哈希结果'
    ],
    bestPractices: [
      '使用 Argon2id 变体',
      '设置足够的内存成本',
      '定期更新哈希参数',
      '安全存储哈希结果'
    ]
  },

  bcrypt: {
    title: 'Bcrypt 密码哈希工具',
    description: '专业的 Bcrypt 密码哈希工具，支持自适应成本因子',
    features: [
      '自适应成本因子',
      '盐值自动生成',
      '密码验证功能',
      '抗暴力破解'
    ],
    useCases: [
      '密码安全存储',
      '用户认证系统',
      '密码强度验证',
      '安全哈希计算'
    ],
    technicalBackground: `Bcrypt 是一种基于 Blowfish 密码的密码哈希函数，由 Niels Provos 和 David Mazières 设计。

Bcrypt 特点：
• 自适应成本：可调节计算复杂度
• 内置盐值：自动生成随机盐值
• 抗暴力破解：计算密集型算法
• 时间可调：根据硬件性能调整

工作原理：
• 使用 Blowfish 密码算法
• 自动生成随机盐值
• 可调节轮数（成本因子）
• 输出固定长度哈希值

应用场景：
• 用户密码存储
• 身份认证系统
• 密码强度评估
• 安全系统设计`,
    usageSteps: [
      '设置成本因子',
      '输入密码进行哈希',
      '生成哈希结果',
      '验证密码哈希'
    ],
    bestPractices: [
      '使用成本因子 12 或更高',
      '定期更新成本因子',
      '安全存储哈希结果',
      '验证密码强度'
    ]
  },

  chacha20: {
    title: 'ChaCha20 加密工具',
    description: '专业的 ChaCha20 流密码加密工具，支持高速加密',
    features: [
      'ChaCha20 流密码加密',
      '多种密钥长度支持',
      '高速加密解密',
      '抗侧信道攻击'
    ],
    useCases: [
      '数据加密保护',
      '安全通信协议',
      '文件加密',
      '流媒体加密'
    ],
    technicalBackground: `ChaCha20 是一种流密码算法，由 Daniel J. Bernstein 设计，被广泛用于 TLS 协议和移动设备。

ChaCha20 特点：
• 高速加密：比 AES 在某些平台上更快
• 简单实现：易于软件实现
• 抗侧信道攻击：时序攻击防护
• 标准化：RFC 8439 标准

算法优势：
• 无专利限制：开源算法
• 硬件友好：适合移动设备
• 安全性高：经过广泛分析
• 性能优秀：在 ARM 处理器上表现优异

应用场景：
• TLS/SSL 协议
• 移动应用加密
• 实时通信加密
• 文件系统加密`,
    usageSteps: [
      '生成或输入密钥',
      '设置随机数（nonce）',
      '输入数据进行加密',
      '查看加密结果'
    ],
    bestPractices: [
      '使用强随机密钥',
      '每次使用不同的 nonce',
      '安全传输密钥',
      '验证加密结果'
    ]
  },

  des: {
    title: 'DES 加密解密工具',
    description: '专业的 DES 对称加密工具，支持多种加密模式和密钥长度',
    features: [
      '支持 ECB、CBC 等多种加密模式',
      '密钥长度可选',
      '实时加密解密',
      '支持十六进制/文本输入输出'
    ],
    useCases: [
      '数据加密保护',
      '历史系统兼容',
      '安全通信',
      '文件加密'
    ],
    technicalBackground: `DES（Data Encryption Standard）是一种对称加密算法，广泛应用于早期数据加密场景。
    
主要特点：
• 对称加密，密钥长度56位
• 支持多种加密模式（ECB、CBC等）
• 现已被更安全的算法（如AES）取代，但在部分场景仍有兼容需求
`,
    usageSteps: [
      '输入要加密/解密的数据',
      '设置密钥和加密模式',
      '选择加密或解密操作',
      '获取处理结果'
    ],
    bestPractices: [
      '避免用于高安全场景',
      '密钥妥善保管',
      '优先考虑更安全的算法（如AES）',
      '验证加密结果'
    ]
  }
}

// 英文版本
export const toolDescriptionsEn = {
  // 格式化工具
  json: {
    title: 'JSON Formatter',
    description: 'Professional JSON data formatting tool supporting beautification, compression, and escaping operations',
    features: [
      'Smart syntax highlighting',
      'Automatic error detection and prompts',
      'Multiple formatting options',
      'One-click copy and download'
    ],
    useCases: [
      'API response data debugging',
      'Configuration file formatting and validation',
      'Code review and documentation',
      'Data exchange format processing'
    ],
    technicalBackground: `JSON (JavaScript Object Notation) is a lightweight data exchange format based on a subset of the JavaScript programming language. It uses a text format that is completely independent of programming languages but also uses conventions similar to the C language family.

JSON characteristics:
• Easy to read and write for humans
• Easy to parse and generate for machines
• Supports nested data structures
• Supports array and object types

JSON is widely used in:
• Web API data exchange
• Configuration file storage
• Database data serialization
• Cross-platform data communication`,
    usageSteps: [
      'Paste JSON data into the input box',
      'Select formatting options (beautify/compress/escape)',
      'Click the corresponding button to process',
      'Copy or download the processed result'
    ],
    bestPractices: [
      'Use 2 or 4 spaces for indentation',
      'Maintain consistency in key names',
      'Avoid overly deep nested structures',
      'Validate JSON format correctness promptly'
    ]
  },

  xml: {
    title: 'XML Formatter',
    description: 'Professional XML document formatting tool supporting beautification, compression, and validation',
    features: [
      'XML syntax highlighting',
      'Automatic indentation and formatting',
      'XML validity validation',
      'DTD and Schema validation support'
    ],
    useCases: [
      'Configuration file formatting and validation',
      'Web service data exchange',
      'Document structure optimization',
      'XML document editing and debugging'
    ],
    technicalBackground: `XML (Extensible Markup Language) is a markup language used for storing and transmitting data. It is designed to be self-descriptive and is a W3C recommendation.

Main characteristics of XML:
• Extensible markup language
• Strict syntax rules
• Namespace support
• DTD and Schema validation support

XML is widely used in:
• Configuration file formats
• Web service data exchange
• Document storage and transmission
• Data serialization`,
    usageSteps: [
      'Paste XML content into the input box',
      'Select formatting options',
      'Click the format button',
      'View the formatted result'
    ],
    bestPractices: [
      'Use meaningful tag names',
      'Keep document structure clear',
      'Use comments appropriately',
      'Follow XML naming conventions'
    ]
  },

  // 加密工具
  base64: {
    title: 'Base64 Encoder/Decoder',
    description: 'Professional Base64 encoding and decoding tool supporting text and image encoding conversion',
    features: [
      'Text and image encoding support',
      'Intelligent content type detection',
      'Batch processing functionality',
      'Multiple encoding standard support'
    ],
    useCases: [
      'Image embedding in HTML/CSS',
      'Binary data transmission',
      'API authentication information encoding',
      'File attachment encoding'
    ],
    technicalBackground: `Base64 is an encoding method based on 64 printable characters to represent binary data. It uses A-Z, a-z, 0-9, +, / to represent binary data.

Base64 encoding principle:
• Group binary data by 6 bits
• Convert each group to corresponding printable characters
• Pad with = when less than 6 bits
• Encoded data increases by about 33%

Application scenarios:
• Image embedding in web pages
• Binary data transmission in text protocols
• Simple data obfuscation
• File attachment encoding`,
    usageSteps: [
      'Enter text to encode or upload image',
      'Select encode or decode operation',
      'Click the corresponding button to process',
      'Copy or download the result'
    ],
    bestPractices: [
      'Note that encoded data size increases',
      'Use specialized tools for large files',
      'Ensure character encoding consistency',
      'Verify the correctness of decoded results'
    ]
  },

  aes: {
    title: 'AES Encryption/Decryption',
    description: 'Advanced Encryption Standard (AES) tool providing powerful data encryption protection',
    features: [
      '128/192/256 bit key support',
      'Multiple encryption modes (CBC, ECB, CFB, OFB)',
      'Secure key generation',
      'Real-time encryption and decryption'
    ],
    useCases: [
      'Sensitive data encrypted storage',
      'API communication data protection',
      'File content encryption',
      'Password and key management'
    ],
    technicalBackground: `AES (Advanced Encryption Standard) is a symmetric encryption algorithm adopted by the National Institute of Standards and Technology (NIST) as a Federal Information Processing Standard.

AES characteristics:
• Symmetric encryption algorithm
• Supports 128, 192, 256 bit key lengths
• Block cipher with 128-bit block size
• Widely validated for security

Encryption modes:
• ECB: Electronic Codebook mode
• CBC: Cipher Block Chaining mode
• CFB: Cipher Feedback mode
• OFB: Output Feedback mode`,
    usageSteps: [
      'Enter text to encrypt',
      'Set key and encryption parameters',
      'Select encrypt or decrypt operation',
      'Get the processed result'
    ],
    bestPractices: [
      'Use strong keys (randomly generated)',
      'Avoid using ECB mode',
      'Securely store key information',
      'Regularly change encryption keys'
    ]
  },

  ecc: {
    title: 'ECC Elliptic Curve Encryption',
    description: 'Professional elliptic curve cryptography tool providing efficient public key encryption and digital signatures',
    features: [
      'Support for multiple elliptic curves (secp256k1, P-256, etc.)',
      'Public key encryption and digital signatures',
      'Key pair generation and verification',
      'Efficient encryption algorithms'
    ],
    useCases: [
      'Blockchain and cryptocurrency',
      'SSL/TLS secure communication',
      'Digital certificates and authentication',
      'Mobile device security'
    ],
    technicalBackground: `ECC (Elliptic Curve Cryptography) is a public key cryptography method based on elliptic curve mathematics.

ECC advantages:
• Shorter keys compared to RSA at the same security level
• Higher computational efficiency, suitable for resource-constrained environments
• Support for multiple elliptic curve standards
• Widely used in modern cryptography

Common elliptic curves:
• secp256k1: Curve used by Bitcoin
• P-256: NIST standard curve
• P-384: High security level curve
• P-521: Highest security level curve

Application scenarios:
• Digital signature algorithms (ECDSA)
• Key exchange protocols (ECDH)
• Encryption algorithms (ECIES)
• Authentication and certificates`,
    usageSteps: [
      'Select elliptic curve type',
      'Generate key pair',
      'Enter data to encrypt',
      'Perform encryption or signature operation'
    ],
    bestPractices: [
      'Use standardized elliptic curves',
      'Securely store private keys',
      'Verify public key validity',
      'Regularly update key pairs'
    ]
  },

  ecdh: {
    title: 'ECDH Elliptic Curve Key Exchange',
    description: 'Professional Elliptic Curve Diffie-Hellman key exchange tool for secure shared key generation',
    features: [
      'Support for multiple elliptic curve standards',
      'Secure key exchange protocol',
      'Real-time key generation',
      'Key verification functionality'
    ],
    useCases: [
      'Secure communication protocols',
      'VPN and tunnel connections',
      'Mobile app security',
      'IoT device communication'
    ],
    technicalBackground: `ECDH (Elliptic Curve Diffie-Hellman) is a key exchange protocol based on elliptic curves, the elliptic curve version of the traditional DH algorithm.

ECDH working principle:
• Both parties generate their own private and public keys
• Exchange public key information
• Calculate shared key using own private key and other party\'s public key
• Both parties obtain the same shared key

Security advantages:
• Based on elliptic curve discrete logarithm problem
• Shorter keys but higher security compared to traditional DH
• Higher computational efficiency
• Suitable for resource-constrained environments

Common elliptic curves:
• secp256k1: Bitcoin standard
• P-256: NIST standard
• P-384: High security level
• Curve25519: Modern high-performance curve

Application scenarios:
• TLS/SSL handshake protocols
• Secure message transmission
• End-to-end encryption
• Key derivation foundation`,
    usageSteps: [
      'Select elliptic curve type',
      'Generate local key pair',
      'Enter other party\'s public key',
      'Calculate shared key'
    ],
    bestPractices: [
      'Use standardized elliptic curves',
      'Verify other party\'s public key validity',
      'Regularly update key pairs',
      'Securely transmit public key information'
    ]
  },

  ecdsa: {
    title: 'ECDSA Elliptic Curve Digital Signature',
    description: 'Professional Elliptic Curve Digital Signature Algorithm tool providing efficient digital signature and verification',
    features: [
      'Support for multiple elliptic curve standards',
      'Digital signature generation and verification',
      'Key pair management',
      'Signature format conversion'
    ],
    useCases: [
      'Blockchain transaction signing',
      'Software package integrity verification',
      'Digital certificate signing',
      'Secure communication authentication'
    ],
    technicalBackground: `ECDSA (Elliptic Curve Digital Signature Algorithm) is a digital signature algorithm based on elliptic curves, the elliptic curve version of the DSA algorithm.

ECDSA working principle:
• Use private key to sign message hash
• Generate two values (r, s) as signature
• Use public key to verify signature validity
• Ensure message integrity and source authentication

Security advantages:
• Based on elliptic curve discrete logarithm problem
• Shorter keys but higher security compared to RSA signatures
• Higher computational efficiency
• Widely used in modern cryptography applications

Signature process:
• Calculate message hash value
• Generate random number k
• Calculate elliptic curve point R = k * G
• Calculate r = R.x mod n
• Calculate s = k^(-1) * (hash + r * privateKey) mod n

Verification process:
• Calculate message hash value
• Calculate w = s^(-1) mod n
• Calculate u1 = hash * w mod n
• Calculate u2 = r * w mod n
• Calculate point P = u1 * G + u2 * publicKey
• Verify r == P.x mod n`,
    usageSteps: [
      'Select elliptic curve type',
      'Generate or import key pair',
      'Enter message to sign',
      'Generate signature or verify signature'
    ],
    bestPractices: [
      'Use standardized elliptic curves',
      'Securely store private keys',
      'Use strong random number generators',
      'Regularly update key pairs'
    ]
  },

  // 转换工具
  timestamp: {
    title: 'Timestamp Converter',
    description: 'Professional timestamp conversion tool supporting multiple time formats and timezone conversion',
    features: [
      'Second and millisecond timestamp support',
      'Multiple date format conversion',
      'Automatic timezone recognition and conversion',
      'Relative time calculation'
    ],
    useCases: [
      'API time parameter processing',
      'Log time analysis',
      'Database time field processing',
      'Cross-timezone application development'
    ],
    technicalBackground: `A timestamp is a number representing a specific point in time, usually calculated in seconds or milliseconds from a fixed point in time (such as the Unix epoch).

Timestamp types:
• Unix timestamp: Seconds from 1970-01-01 00:00:00 UTC
• Millisecond timestamp: Milliseconds from 1970-01-01 00:00:00 UTC
• JavaScript timestamp: Same as millisecond timestamp

Common formats:
• ISO 8601: 2023-12-18T15:10:56Z
• RFC 2822: Mon, 18 Dec 2023 15:10:56 GMT
• Custom format: 2023/12/18 15:10:56`,
    usageSteps: [
      'Enter timestamp or date time',
      'Select conversion direction',
      'Set target format',
      'Get conversion result'
    ],
    bestPractices: [
      'Pay attention to timezone differences',
      'Use standard time formats',
      'Consider leap second effects',
      'Validate timestamp range validity'
    ]
  },

  // 图像工具
  imageConvert: {
    title: 'Image Format Converter',
    description: 'Professional image format conversion tool supporting lossless conversion between multiple formats',
    features: [
      'Support for JPG, PNG, WebP, GIF formats',
      'Adjustable quality parameters',
      'Batch conversion functionality',
      'Maintains image quality'
    ],
    useCases: [
      'Web image optimization',
      'Mobile app image processing',
      'Image format standardization',
      'Storage space optimization'
    ],
    technicalBackground: `Different image formats have different characteristics and application scenarios:

JPG (JPEG):
• Lossy compression, small file size
• Suitable for photos and complex images
• No transparent background support

PNG:
• Lossless compression, high quality
• Supports transparent background
• Suitable for icons and simple images

WebP:
• Modern format developed by Google
• Better compression ratio
• Supports animation and transparency

GIF:
• Animation support
• Limited color count
• Suitable for simple animations`,
    usageSteps: [
      'Upload image to convert',
      'Select target format',
      'Adjust quality parameters',
      'Download conversion result'
    ],
    bestPractices: [
      'Choose appropriate format based on usage',
      'Balance image quality and file size',
      'Keep backup of original images',
      'Consider browser compatibility'
    ]
  },

  // 文本工具
  textCase: {
    title: 'Text Case Converter',
    description: 'Professional text case conversion tool supporting multiple naming conventions',
    features: [
      'Multiple case format support',
      'Batch conversion functionality',
      'Real-time preview effects',
      'Preserves special characters'
    ],
    useCases: [
      'Programming variable naming',
      'Document title formatting',
      'Database field naming',
      'API parameter standardization'
    ],
    technicalBackground: `Different programming languages and scenarios use different case naming conventions:

Naming conventions:
• camelCase: First word lowercase, subsequent words capitalized (JavaScript variables)
• PascalCase: All words capitalized (class names)
• snake_case: Words connected with underscores (Python variables)
• kebab-case: Words connected with hyphens (CSS class names)
• UPPER_SNAKE_CASE: All uppercase with underscores (constants)

Application scenarios:
• JavaScript: camelCase for variables, PascalCase for classes
• Python: snake_case for variables and functions
• CSS: kebab-case for class names
• Database: snake_case for field names`,
    usageSteps: [
      'Enter text to convert',
      'Select target format',
      'Click convert button',
      'Copy conversion result'
    ],
    bestPractices: [
      'Maintain naming consistency',
      'Follow language conventions',
      'Use meaningful names',
      'Avoid overly long names'
    ]
  },

  // 其他工具
  qrcode: {
    title: 'QR Code Generator',
    description: 'Professional QR code generation and parsing tool supporting multiple data types',
    features: [
      'Support for text, URL, WiFi and other content',
      'Adjustable QR code size and error correction level',
      'Custom color and style support',
      'QR code parsing functionality'
    ],
    useCases: [
      'Product information display',
      'WiFi password sharing',
      'Quick URL access',
      'Contact information exchange'
    ],
    technicalBackground: `QR Code is a matrix-type two-dimensional barcode that can store more information than traditional barcodes.

QR Code characteristics:
• High-density encoding
• Supports multiple data types
• Error correction capability
• Supports Chinese and other characters

Error correction levels:
• L (Low): 7% error correction capability
• M (Medium): 15% error correction capability
• Q (Quartile): 25% error correction capability
• H (High): 30% error correction capability

Supported data types:
• Text information
• URL links
• Email addresses
• Phone numbers
• WiFi configuration`,
    usageSteps: [
      'Enter content to encode',
      'Select QR code type',
      'Adjust style parameters',
      'Generate and download QR code'
    ],
    bestPractices: [
      'Choose appropriate error correction level',
      'Ensure QR code is clear and readable',
      'Test scanning effect',
      'Consider print size'
    ]
  },

  calculator: {
    title: 'Scientific Calculator',
    description: 'Powerful online scientific calculator supporting basic operations and advanced mathematical functions',
    features: [
      'Basic arithmetic operations',
      'Scientific calculation functions',
      'Base conversion functionality',
      'Calculation history'
    ],
    useCases: [
      'Daily mathematical calculations',
      'Scientific research and engineering calculations',
      'Numerical calculations in programming',
      'Learning and teaching assistance'
    ],
    technicalBackground: `Scientific calculators provide various mathematical operations to meet calculation needs in different scenarios.

Basic operations:
• Addition, subtraction, multiplication, division
• Percentage calculations
• Sign conversion

Scientific functions:
• Trigonometric functions: sin, cos, tan
• Inverse trigonometric functions: asin, acos, atan
• Logarithmic functions: log, ln
• Exponential functions: exp, pow

Base conversion:
• Binary, octal, decimal, hexadecimal
• Supports integer and decimal conversion
• Maintains numerical precision`,
    usageSteps: [
      'Select calculation mode',
      'Enter mathematical expression',
      'Click calculate button',
      'View calculation result'
    ],
    bestPractices: [
      'Pay attention to operator precedence',
      'Use parentheses to clarify operation order',
      'Verify calculation result reasonableness',
      'Save important calculation history'
    ]
  },

  // More formatting tools
  yaml: {
    title: 'YAML Formatter',
    description: 'Professional YAML data serialization formatting tool supporting configuration files and data structure formatting',
    features: [
      'YAML syntax highlighting',
      'Automatic indentation and formatting',
      'YAML syntax validation',
      'Complex data structure support'
    ],
    useCases: [
      'Docker configuration file formatting',
      'Kubernetes configuration management',
      'CI/CD configuration file processing',
      'API documentation formatting'
    ],
    technicalBackground: `YAML (YAML Ain't Markup Language) is a human-readable data serialization language commonly used for configuration files and data exchange.

YAML characteristics:
• Human-readable format
• Complex data structure support
• Comment and documentation support
• JSON compatibility

Data structure support:
• Scalars: strings, numbers, booleans
• Sequences: arrays and lists
• Mappings: key-value pairs and objects
• Anchors and aliases: references and reuse

Application scenarios:
• Configuration file formats
• Data exchange formats
• API documentation
• System configuration management`,
    usageSteps: [
      'Paste YAML content into input box',
      'Select formatting options',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Use 2 spaces for indentation',
      'Maintain consistency in key names',
      'Use comments appropriately',
      'Avoid overly deep nested structures'
    ]
  },

  js: {
    title: 'JavaScript Formatter',
    description: 'Professional JavaScript code formatting tool supporting ES6+ syntax and modern development standards',
    features: [
      'JavaScript syntax highlighting',
      'ES6+ syntax support',
      'Code style unification',
      'Automatic semicolon and bracket handling'
    ],
    useCases: [
      'Code review and formatting',
      'Team code style unification',
      'Open source project contribution',
      'Code quality improvement'
    ],
    technicalBackground: `JavaScript is a dynamic, interpreted programming language widely used in web development and server-side development.

Modern JavaScript characteristics:
• ES6+ syntax support
• Modular development
• Asynchronous programming support
• Functional programming features

Code formatting standards:
• Indentation: 2 or 4 spaces
• Semicolons: optional, recommended
• Quotes: single or double quotes
• Line length: 80-120 characters

Tool ecosystem:
• ESLint: code quality checking
• Prettier: code formatting
• Babel: syntax transformation
• TypeScript: type checking`,
    usageSteps: [
      'Paste JavaScript code',
      'Select formatting options',
      'Click format button',
      'Copy formatted code'
    ],
    bestPractices: [
      'Follow team code standards',
      'Use modern JavaScript syntax',
      'Keep code clean and clear',
      'Add comments appropriately'
    ]
  },

  html: {
    title: 'HTML Formatter',
    description: 'Professional HTML markup language formatting tool to standardize document structure and improve code quality',
    features: [
      'HTML syntax highlighting',
      'Tag auto-indentation',
      'Attribute sorting and formatting',
      'HTML5 standard support'
    ],
    useCases: [
      'Web development code formatting',
      'Template file processing',
      'HTML document optimization',
      'SEO-friendly formatting'
    ],
    technicalBackground: `HTML (HyperText Markup Language) is the standard markup language for creating web pages and is the foundation of web development.

HTML characteristics:
• Semantic markup
• Structured documents
• Accessibility support
• SEO friendly

HTML5 new features:
• Semantic tags
• Multimedia support
• Form enhancements
• Canvas and WebGL

Best practices:
• Use semantic tags
• Keep document structure clear
• Ensure accessibility
• Optimize SEO effects`,
    usageSteps: [
      'Paste HTML code',
      'Select formatting options',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Use semantic tags',
      'Keep code structure clear',
      'Ensure proper tag closure',
      'Optimize page loading performance'
    ]
  },

  css: {
    title: 'CSS Formatter',
    description: 'Professional CSS stylesheet formatting tool to beautify code structure and improve maintainability',
    features: [
      'CSS syntax highlighting',
      'Property auto-sorting',
      'Selector formatting',
      'CSS3 feature support'
    ],
    useCases: [
      'Stylesheet code formatting',
      'CSS code optimization',
      'Team collaboration development',
      'Style maintenance and refactoring'
    ],
    technicalBackground: `CSS (Cascading Style Sheets) is a stylesheet language used to describe the appearance and layout of web pages.

CSS characteristics:
• Cascading style rules
• Selector system
• Box model layout
• Responsive design

CSS3 new features:
• Flexbox layout
• Grid layout
• Animations and transitions
• Media queries

Code organization:
• Modular CSS
• BEM naming convention
• CSS preprocessors
• Post-processor tools`,
    usageSteps: [
      'Paste CSS code',
      'Select formatting options',
      'Click format button',
      'Copy formatted result'
    ],
    bestPractices: [
      'Use BEM naming convention',
      'Keep selectors concise',
      'Avoid excessive nesting',
      'Optimize selector performance'
    ]
  },

  sql: {
    title: 'SQL Formatter',
    description: 'Professional SQL query statement formatting tool to standardize database query code and improve readability',
    features: [
      'SQL syntax highlighting',
      'Keyword capitalization',
      'Subquery formatting',
      'Multi-database dialect support'
    ],
    useCases: [
      'Database query optimization',
      'SQL code review',
      'Database documentation writing',
      'Query performance analysis'
    ],
    technicalBackground: `SQL (Structured Query Language) is the standard language for managing relational databases, supporting data query, insert, update and delete operations.

SQL characteristics:
• Declarative language
• Relational algebra foundation
• Transaction processing support
• Data integrity constraints

Main operations:
• SELECT: data query
• INSERT: data insertion
• UPDATE: data update
• DELETE: data deletion

Performance optimization:
• Index usage
• Query plan optimization
• Join query optimization
• Subquery optimization`,
    usageSteps: [
      'Paste SQL query statement',
      'Select formatting options',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Use meaningful table aliases',
      'Avoid SELECT *',
      'Use indexes appropriately',
      'Optimize JOIN queries'
    ]
  },

  // More encryption tools
  hex: {
    title: 'Hexadecimal Encoder',
    description: 'Professional hexadecimal encoding and decoding tool supporting binary data conversion and color value processing',
    features: [
      'Hexadecimal encoding and decoding',
      'Binary data conversion',
      'Color value processing',
      'Batch conversion functionality'
    ],
    useCases: [
      'Binary data analysis',
      'Color value conversion',
      'Network protocol analysis',
      'Data debugging and validation'
    ],
    technicalBackground: `Hexadecimal is a base-16 number system widely used in computer science.

Hexadecimal characteristics:
• Each digit represents 4 binary bits
• Uses 0-9 and A-F representation
• Convenient for binary data representation
• Commonly used in programming

Application scenarios:
• Memory address representation
• Color value encoding
• Binary data viewing
• Network protocol analysis

Conversion relationships:
• 1 hexadecimal digit = 4 binary bits
• 2 hexadecimal digits = 1 byte
• 6 hexadecimal digits = 24-bit color value`,
    usageSteps: [
      'Enter data to convert',
      'Select conversion direction',
      'Click convert button',
      'View conversion result'
    ],
    bestPractices: [
      'Maintain case consistency',
      'Verify conversion results',
      'Handle special characters',
      'Consider data integrity'
    ]
  },

  // More conversion tools
  color: {
    title: 'Color Format Converter',
    description: 'Professional color format conversion tool supporting HEX, RGB, HSL and other color formats',
    features: [
      'Multiple color format support',
      'Real-time color preview',
      'Color picker',
      'Batch conversion functionality'
    ],
    useCases: [
      'Web design color processing',
      'CSS style development',
      'Image processing color adjustment',
      'Brand color management'
    ],
    technicalBackground: `Color is an important element in visual design, with different color formats suitable for different application scenarios.

Color formats:
• HEX: hexadecimal color values
• RGB: red green blue primary colors
• HSL: hue saturation lightness
• CMYK: printing four-color mode

Color spaces:
• sRGB: standard RGB color space
• Adobe RGB: professional color space
• P3: wide color gamut display color space
• LAB: device-independent color space

Application scenarios:
• Web development: HEX, RGB
• Design software: HSL, CMYK
• Mobile development: ARGB
• Print design: CMYK`,
    usageSteps: [
      'Enter color value or use picker',
      'Select target format',
      'View conversion result',
      'Copy color value'
    ],
    bestPractices: [
      'Consider color space differences',
      'Handle transparency properly',
      'Verify color accuracy',
      'Consider accessibility'
    ]
  },

  // More text tools
  replace: {
    title: 'Text Replace Tool',
    description: 'Powerful text replacement tool supporting simple replacement and regular expression replacement',
    features: [
      'Simple text replacement',
      'Regular expression support',
      'Batch replacement functionality',
      'Real-time preview effects'
    ],
    useCases: [
      'Code refactoring and modification',
      'Data format conversion',
      'Document batch processing',
      'Text cleaning and standardization'
    ],
    technicalBackground: `Text replacement is a fundamental operation in text processing, supporting various replacement modes and rules.

Replacement modes:
• Simple replacement: direct string replacement
• Regular replacement: pattern matching replacement
• Conditional replacement: condition-based replacement
• Batch replacement: multiple rules simultaneously

Regular expressions:
• Character classes: match specific characters
• Quantifiers: control match frequency
• Groups: capture and reference
• Assertions: position matching

Application techniques:
• Use non-greedy matching
• Use groups appropriately
• Pay attention to escape characters
• Test replacement effects`,
    usageSteps: [
      'Enter text to process',
      'Set find and replace rules',
      'Select replacement mode',
      'Execute replacement operation'
    ],
    bestPractices: [
      'Backup original data',
      'Test replacement rules',
      'Use non-greedy matching',
      'Verify replacement results'
    ]
  },

  reverse: {
    title: 'Text Reverse Tool',
    description: 'Professional text reversal and sorting tool supporting various reversal and sorting methods',
    features: [
      'Text character reversal',
      'Line-level reversal sorting',
      'Word-level reversal',
      'Custom sorting rules'
    ],
    useCases: [
      'Data processing and analysis',
      'Text encryption and decryption',
      'Code obfuscation processing',
      'Text format conversion'
    ],
    technicalBackground: `Text reversal is a basic operation in string processing with various reversal methods and application scenarios.

Reversal types:
• Character reversal: character-by-character reversal
• Word reversal: word-by-word reversal
• Line reversal: line-by-line reversal
• Partial reversal: specified range reversal

Sorting methods:
• Alphabetical order: A-Z or Z-A
• Numerical order: ascending or descending
• Length sorting: by string length
• Custom sorting: user-defined rules

Application scenarios:
• Data validation and testing
• Text encryption algorithms
• Code obfuscation techniques
• Data processing workflows`,
    usageSteps: [
      'Enter text to process',
      'Select reversal or sorting method',
      'Set processing parameters',
      'View processing result'
    ],
    bestPractices: [
      'Understand reversal rules',
      'Pay attention to encoding issues',
      'Verify processing results',
      'Consider performance impact'
    ]
  },

  calculator: {
    title: 'Scientific Calculator',
    description: 'Powerful online scientific calculator supporting basic operations and advanced mathematical functions',
    features: [
      'Basic arithmetic operations',
      'Scientific calculation functions',
      'Base conversion functionality',
      'Calculation history'
    ],
    useCases: [
      'Daily mathematical calculations',
      'Scientific research and engineering calculations',
      'Numerical calculations in programming',
      'Learning and teaching assistance'
    ],
    technicalBackground: `Scientific calculators provide various mathematical operations to meet calculation needs in different scenarios.

Basic operations:
• Addition, subtraction, multiplication, division
• Percentage calculations
• Sign conversion

Scientific functions:
• Trigonometric functions: sin, cos, tan
• Inverse trigonometric functions: asin, acos, atan
• Logarithmic functions: log, ln
• Exponential functions: exp, pow

Base conversion:
• Binary, octal, decimal, hexadecimal
• Supports integer and decimal conversion
• Maintains numerical precision`,
    usageSteps: [
      'Select calculation mode',
      'Enter mathematical expression',
      'Click calculate button',
      'View calculation result'
    ],
    bestPractices: [
      'Pay attention to operator precedence',
      'Use parentheses to clarify operation order',
      'Verify calculation result reasonableness',
      'Save important calculation history'
    ]
  },

  // More conversion tools
  regex: {
    title: 'Regex Tool',
    description: 'Professional regex testing and generation tool supporting multiple regex syntax and real-time matching test',
    features: [
      'Regex testing',
      'Real-time matching preview',
      'Multiple regex syntax support',
      'Regex generation'
    ],
    useCases: [
      'Text pattern matching',
      'Data validation rules',
      'String search and replace',
      'Text processing in programming'
    ],
    technicalBackground: `Regex is a powerful text pattern matching tool widely used in programming and text processing.

Regex characteristics:
• Pattern matching and search
• String replacement and validation
• Supports complex matching rules
• Cross-language universality

Common syntax:
• Character classes: \\d (digit), \\w (word character)
• Quantifiers: * (0 or more), + (1 or more), ? (0 or 1)
• Groups: () capture group, (?:) non-capturing group
• Assertions: ^ (line start), $ (line end), \\b (word boundary)

Application scenarios:
• Form validation
• Log analysis
• Text search
• Data cleaning`,
    usageSteps: [
      'Enter regex expression',
      'Provide test text',
      'View matching results',
      'Adjust regex expression'
    ],
    bestPractices: [
      'Use non-greedy matching',
      'Reasonable use of groups',
      'Pay attention to escape characters',
      'Test boundary cases'
    ]
  },

  markdown: {
    title: 'Markdown Editor',
    description: 'Professional Markdown editing and preview tool supporting real-time preview and multiple Markdown syntax',
    features: [
      'Real-time Markdown preview',
      'Syntax highlighting',
      'Multiple Markdown extensions',
      'Export multiple formats'
    ],
    useCases: [
      'Document writing and editing',
      'Technical blog creation',
      'Project document maintenance',
      'Note taking and sharing'
    ],
    technicalBackground: `Markdown is a lightweight markup language designed to make documents easy to read and write.

Markdown characteristics:
• Pure text format
• Easy to learn and use
• Can be converted to multiple formats
• Focuses on content rather than format

Basic syntax:
• Headings: # Level 1 heading
• Lists: - Unordered list, 1. Ordered list
• Links: [Text](URL)
• Images: ![alt](image URL)
• Code: \`inline code\`,\`\`\`code block

Extended features:
• Table support
• Task lists
• Mathematical formulas
• Chart support`,
    usageSteps: [
      'Enter Markdown text in the editing area',
      'Real-time preview effect',
      'Adjust format and content',
      'Export or copy results'
    ],
    bestPractices: [
      'Keep document structure clear',
      'Use meaningful headings',
      'Add links and images appropriately',
      'Regularly back up important documents'
    ]
  },

  number: {
    title: 'Number Conversion Tool',
    description: 'Professional number format conversion tool supporting scientific notation, currency format, and multiple number representations',
    features: [
      'Scientific notation conversion',
      'Currency format handling',
      'Number precision control',
      'Batch number processing'
    ],
    useCases: [
      'Scientific data processing',
      'Financial report formatting',
      'Data analysis and statistics',
      'Numerical processing in programming'
    ],
    technicalBackground: `Numbers need different representations in different scenarios, and number conversion tools provide multiple format support.

Number formats:
• Scientific notation: 1.23e+10
• Currency format: $1,234.56
• Percentage: 12.34%
• Fraction: 1/3

Precision control:
• Fixed decimal places
• Effective digits control
• Rounding rule setting
• Zero value handling

Application scenarios:
• Scientific calculation
• Financial data processing
• Statistical analysis
• Data visualization`,
    usageSteps: [
      'Enter the number to convert',
      'Select target format',
      'Set precision parameters',
      'View conversion result'
    ],
    bestPractices: [
      'Note number precision loss',
      'Choose appropriate format',
      'Verify conversion results',
      'Consider internationalization needs'
    ]
  },

  unit: {
    title: 'Unit Conversion Tool',
    description: 'Professional physical unit conversion tool supporting length, weight, temperature, and other unit conversions',
    features: [
      'Multiple physical units support',
      'Real-time conversion calculation',
      'Unit classification management',
      'Conversion history'
    ],
    useCases: [
      'Engineering calculation and design',
      'Scientific research and experiments',
      'International trade and logistics',
      'Daily life calculation'
    ],
    technicalBackground: `Unit conversion is a basic requirement in scientific calculation and engineering applications, involving various physical quantities.

Common unit types:
• Length: meter, foot, inch, kilometer
• Weight: kilogram, pound, ounce, ton
• Temperature: Celsius, Fahrenheit, Kelvin
• Area: square meter, square foot, hectare

Conversion principle:
• Based on standard unit definitions
• Using conversion factors
• Maintaining physical quantity
• Considering accuracy and error

Application areas:
• Engineering calculation
• Scientific research
• International trade
• Daily life`,
    usageSteps: [
      'Select unit type',
      'Enter value and original unit',
      'Select target unit',
      'View conversion result'
    ],
    bestPractices: [
      'Pay attention to unit precision',
      'Verify conversion factors',
      'Consider temperature conversion specificity',
      'Save common conversions'
    ]
  },

  httpStatus: {
    title: 'HTTP Status Code Query Tool',
    description: 'Professional HTTP status code query and explanation tool providing detailed status code explanations and best practices',
    features: [
      'Complete status code database',
      'Detailed status code explanations',
      'Usage scenarios and best practices',
      'Status code classification management'
    ],
    useCases: [
      'Web 开发调试',
      'API 设计和开发',
      '网络问题诊断',
      '系统监控和运维'
    ],
    technicalBackground: `HTTP 状态码是 HTTP 协议中用于表示请求处理结果的数字代码。

状态码分类：
• 1xx：信息性状态码
• 2xx：成功状态码
• 3xx：重定向状态码
• 4xx：客户端错误状态码
• 5xx：服务器错误状态码

常见状态码：
• 200：OK，请求成功
• 404：Not Found，资源未找到
• 500：Internal Server Error，服务器内部错误
• 301：Moved Permanently，永久重定向

应用场景：
• Web 开发
• API 设计
• 网络调试
• 系统监控`,
    usageSteps: [
      '输入状态码或搜索关键词',
      '查看详细说明',
      '了解使用场景',
      '参考最佳实践'
    ],
    bestPractices: [
      '使用标准状态码',
      '提供有意义的错误信息',
      '合理使用重定向',
      '监控错误状态码'
    ]
  },

  charCode: {
    title: 'Character Encoding Conversion Tool',
    description: 'Professional character encoding conversion tool supporting ASCII, Unicode, UTF-8, and other encoding formats',
    features: [
      'Multiple encoding formats support',
      'Character encoding table query',
      'Batch encoding conversion',
      'Encoding problem diagnosis'
    ],
    useCases: [
      '文本编码处理',
      '国际化应用开发',
      '数据导入导出',
      '编码问题排查'
    ],
    technicalBackground: `字符编码是计算机中表示字符的标准方式，不同的编码格式适用于不同场景。

常用编码格式：
• ASCII：7位编码，支持英文字符
• UTF-8：变长编码，支持全球字符
• UTF-16：16位编码，支持 Unicode
• ISO-8859：欧洲语言编码

编码特点：
• ASCII：简单高效，仅支持英文
• UTF-8：向后兼容，广泛使用
• UTF-16：固定长度，处理效率高
• Unicode：统一字符集标准

应用场景：
• 文本处理
• 国际化开发
• 数据交换
• 系统集成`,
    usageSteps: [
      '输入要转换的文本',
      '选择源编码和目标编码',
      '执行编码转换',
      '查看转换结果'
    ],
    bestPractices: [
      '统一使用 UTF-8 编码',
      '注意编码兼容性',
      '处理特殊字符',
      '验证转换结果'
    ]
  },

  dateCalc: {
    title: '日期计算工具',
    description: '专业的日期计算工具，支持日期加减、工作日计算、时区转换等功能',
    features: [
      '日期加减计算',
      '工作日计算',
      '时区转换',
      '日期格式转换'
    ],
    useCases: [
      '项目计划制定',
      '财务计算',
      '日程安排',
      '数据分析'
    ],
    technicalBackground: `日期计算涉及复杂的历法规则和时区处理，需要考虑多种因素。

计算类型：
• 日期加减：天、周、月、年
• 工作日计算：排除周末和节假日
• 时区转换：考虑夏令时
• 日期差值：计算两个日期之间的间隔

历法系统：
• 公历（格里高利历）
• 农历（中国传统历法）
• 伊斯兰历
• 犹太历

时区处理：
• UTC 协调世界时
• 时区偏移量
• 夏令时规则
• 时区数据库`,
    usageSteps: [
      '选择计算类型',
      '输入日期参数',
      '设置计算规则',
      '查看计算结果'
    ],
    bestPractices: [
      '注意时区差异',
      '考虑闰年规则',
      '处理边界情况',
      '验证计算结果'
    ]
  },

  // 更多加密工具
  rsa: {
    title: 'RSA 加密解密工具',
    description: '专业的 RSA 非对称加密工具，支持公钥加密和私钥解密',
    features: [
      'RSA 密钥生成',
      '公钥加密私钥解密',
      '数字签名验证',
      '多种密钥长度支持'
    ],
    useCases: [
      '安全通信加密',
      '数字证书管理',
      'API 安全认证',
      '文件加密保护'
    ],
    technicalBackground: `RSA 是一种非对称加密算法，基于大数分解的数学难题。

RSA 原理：
• 公钥加密，私钥解密
• 基于大素数分解难题
• 支持数字签名
• 密钥长度影响安全性

密钥长度：
• 1024 位：基本安全
• 2048 位：推荐使用
• 4096 位：高安全要求

应用场景：
• SSL/TLS 协议
• 数字证书
• 安全通信
• 身份认证`,
    usageSteps: [
      '生成 RSA 密钥对',
      '使用公钥加密数据',
      '使用私钥解密数据',
      '验证数字签名'
    ],
    bestPractices: [
      '使用足够长的密钥',
      '安全保存私钥',
      '定期更换密钥',
      '验证密钥有效性'
    ]
  },

  sha: {
    title: 'SHA 哈希计算工具',
    description: '专业的 SHA 哈希算法工具，支持 SHA-1、SHA-256、SHA-512 等多种算法',
    features: [
      '多种 SHA 算法支持',
      '文件哈希计算',
      '哈希值验证',
      '批量哈希处理'
    ],
    useCases: [
      '文件完整性验证',
      '密码哈希存储',
      '数字签名',
      '数据去重'
    ],
    technicalBackground: `SHA（Secure Hash Algorithm）是一系列密码学哈希函数，用于生成数据的数字指纹。

SHA 算法：
• SHA-1：160 位哈希值
• SHA-256：256 位哈希值
• SHA-512：512 位哈希值
• SHA-3：新一代哈希算法

哈希特点：
• 确定性：相同输入产生相同输出
• 雪崩效应：输入微小变化导致输出巨大变化
• 单向性：无法从哈希值反推原始数据
• 抗碰撞性：难以找到相同哈希值的不同输入

应用场景：
• 文件完整性检查
• 密码安全存储
• 数字签名
• 区块链技术`,
    usageSteps: [
      '选择 SHA 算法',
      '输入要哈希的数据',
      '计算哈希值',
      '验证哈希结果'
    ],
    bestPractices: [
      '使用 SHA-256 或更高版本',
      '加盐处理密码哈希',
      '验证文件完整性',
      '安全存储哈希值'
    ]
  },

  jwt: {
    title: 'JWT 编码解码工具',
    description: '专业的 JWT（JSON Web Token）编码解码工具，支持令牌生成和验证',
    features: [
      'JWT 令牌生成',
      '令牌解码和验证',
      '多种签名算法',
      '令牌过期时间设置'
    ],
    useCases: [
      '用户身份认证',
      'API 访问控制',
      '单点登录系统',
      '微服务通信'
    ],
    technicalBackground: `JWT 是一种开放标准，用于在各方之间安全地传输信息作为 JSON 对象。

JWT 结构：
• Header：算法和令牌类型
• Payload：声明和数据
• Signature：签名验证

JWT 特点：
• 自包含：包含所有必要信息
• 无状态：服务器无需存储会话
• 可扩展：支持自定义声明
• 标准化：RFC 7519 标准

签名算法：
• HMAC：对称密钥签名
• RSA：非对称密钥签名
• ECDSA：椭圆曲线签名

应用场景：
• 身份认证
• 信息交换
• 授权控制
• 会话管理`,
    usageSteps: [
      '设置 JWT 参数',
      '生成 JWT 令牌',
      '解码和验证令牌',
      '查看令牌内容'
    ],
    bestPractices: [
      '使用强密钥签名',
      '设置合理的过期时间',
      '验证令牌签名',
      '保护敏感信息'
    ]
  },

  shortUrl: {
    title: '短链接生成工具',
    description: '专业的短链接生成和管理工具，支持自定义短链接和访问统计',
    features: [
      '短链接生成',
      '自定义短链接',
      '访问统计',
      '链接有效期设置'
    ],
    useCases: [
      '社交媒体分享',
      '营销活动推广',
      '链接追踪分析',
      '长链接简化'
    ],
    technicalBackground: `短链接是一种将长 URL 转换为短 URL 的服务，便于分享和传播。

短链接原理：
• 长 URL 映射到短标识符
• 重定向机制实现访问
• 数据库存储映射关系
• 统计访问数据

生成算法：
• 随机字符串生成
• 哈希算法生成
• 自增 ID 编码
• 自定义标识符

应用场景：
• 社交媒体
• 电子邮件营销
• 短信营销
• 二维码链接`,
    usageSteps: [
      '输入长链接',
      '选择生成方式',
      '生成短链接',
      '分享和追踪'
    ],
    bestPractices: [
      '使用 HTTPS 协议',
      '设置合理的过期时间',
      '监控链接访问',
      '保护用户隐私'
    ]
  },

  ipTools: {
    title: 'IP 地址工具',
    description: '专业的 IP 地址查询和分析工具，支持 IP 信息查询、地理位置定位等功能',
    features: [
      'IP 地址信息查询',
      '地理位置定位',
      'IP 地址转换',
      '网络诊断工具'
    ],
    useCases: [
      '网络故障排查',
      '地理位置分析',
      '网络安全监控',
      '网络配置管理'
    ],
    technicalBackground: `IP 地址是互联网协议中用于标识网络设备的数字地址。

IP 地址类型：
• IPv4：32 位地址，如 192.168.1.1
• IPv6：128 位地址，如 2001:db8::1
• 公网 IP：互联网可访问
• 私网 IP：局域网使用

IP 地址分类：
• A 类：1.0.0.0 - 126.255.255.255
• B 类：128.0.0.0 - 191.255.255.255
• C 类：192.0.0.0 - 223.255.255.255
• D 类：224.0.0.0 - 239.255.255.255

应用场景：
• 网络配置
• 安全监控
• 地理位置服务
• 网络诊断`,
    usageSteps: [
      '输入 IP 地址',
      '查询详细信息',
      '查看地理位置',
      '进行网络诊断'
    ],
    bestPractices: [
      '验证 IP 地址格式',
      '注意隐私保护',
      '使用可靠的查询服务',
      '定期更新 IP 数据库'
    ]
  },

  markdownFormat: {
    title: 'Markdown 格式化工具',
    description: '专业的 Markdown 文档格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Markdown 语法高亮显示',
      '自动缩进和格式化',
      '语法错误检测',
      '多种格式化选项'
    ],
    useCases: [
      '文档格式化和美化',
      '技术文档编写',
      '博客文章编辑',
      'README 文件优化'
    ],
    technicalBackground: `Markdown 是一种轻量级标记语言，由 John Gruber 于 2004 年创建，旨在让写作变得简单易读。

Markdown 特点：
• 易读易写：语法简单直观
• 纯文本格式：不依赖特定编辑器
• 可转换为多种格式：HTML、PDF、Word 等
• 广泛支持：GitHub、GitLab、Stack Overflow 等平台

Markdown 语法：
• 标题：使用 # 符号
• 列表：使用 - 或 * 符号
• 链接：使用 [文本](URL) 格式
• 代码：使用 \`代码\` 或 \`\`\`代码块\`\`\` 格式
• 表格：使用 | 分隔列，- 分隔表头

应用场景：
• 技术文档编写
• 博客文章创作
• 项目说明文档
• 学术论文写作`,
    usageSteps: [
      '将 Markdown 内容粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用标准的 Markdown 语法',
      '保持文档结构清晰',
      '适当使用标题层级',
      '注意代码块的语法高亮'
    ]
  },

  javaFormat: {
    title: 'Java 代码格式化工具',
    description: '专业的 Java 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Java 语法高亮显示',
      '自动缩进和格式化',
      '代码风格统一',
      '多种格式化选项'
    ],
    useCases: [
      'Java 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `Java 是一种面向对象的编程语言，由 Sun Microsystems 于 1995 年发布，具有跨平台、安全性高等特点。

Java 语言特点：
• 面向对象：支持封装、继承、多态
• 跨平台：一次编写，到处运行
• 强类型：编译时类型检查
• 自动内存管理：垃圾回收机制

Java 代码规范：
• 类名：使用 PascalCase（如 MyClass）
• 方法名：使用 camelCase（如 myMethod）
• 常量：使用 UPPER_SNAKE_CASE（如 MAX_SIZE）
• 包名：使用小写字母（如 com.example）

应用场景：
• 企业级应用开发
• Android 移动应用开发
• Web 后端服务开发
• 大数据处理应用`,
    usageSteps: [
      '将 Java 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 Java 编码规范',
      '保持代码结构清晰',
      '适当添加注释说明',
      '使用有意义的变量和方法名'
    ]
  },

  php: {
    title: 'PHP 代码格式化工具',
    description: '专业的 PHP 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'PHP 语法高亮显示',
      '自动缩进和格式化',
      'PSR 标准支持',
      '多种格式化选项'
    ],
    useCases: [
      'PHP 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `PHP 是一种服务器端脚本语言，主要用于 Web 开发，具有简单易学、功能强大等特点。

PHP 语言特点：
• 服务器端执行：在服务器上运行，生成 HTML
• 跨平台：支持 Windows、Linux、macOS
• 开源免费：社区活跃，资源丰富
• 数据库支持：支持多种数据库系统

PHP 代码规范（PSR）：
• PSR-1：基础编码标准
• PSR-2：编码风格指南
• PSR-4：自动加载标准
• PSR-12：扩展编码风格

应用场景：
• Web 网站开发
• API 接口开发
• CMS 系统开发
• 企业级应用开发`,
    usageSteps: [
      '将 PHP 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 PSR 编码规范',
      '使用有意义的变量名',
      '适当添加注释说明',
      '保持代码结构清晰'
    ]
  },

  ruby: {
    title: 'Ruby 代码格式化工具',
    description: '专业的 Ruby 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Ruby 语法高亮显示',
      '自动缩进和格式化',
      'Ruby 风格指南支持',
      '多种格式化选项'
    ],
    useCases: [
      'Ruby 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `Ruby 是一种动态、面向对象的编程语言，由松本行弘于 1995 年创建，以简洁优雅的语法著称。

Ruby 语言特点：
• 面向对象：一切都是对象
• 动态类型：运行时类型检查
• 简洁语法：优雅的代码风格
• 元编程：强大的反射能力

Ruby 代码风格：
• 使用 2 个空格缩进
• 方法名使用 snake_case
• 类名使用 CamelCase
• 常量使用 UPPER_SNAKE_CASE

应用场景：
• Web 应用开发（Ruby on Rails）
• 脚本自动化
• 系统管理工具
• 原型开发`,
    usageSteps: [
      '将 Ruby 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 Ruby 风格指南',
      '使用有意义的变量名',
      '保持代码简洁优雅',
      '适当添加注释说明'
    ]
  },

  shell: {
    title: 'Shell 脚本格式化工具',
    description: '专业的 Shell 脚本格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Shell 语法高亮显示',
      '自动缩进和格式化',
      '多种 Shell 方言支持',
      '多种格式化选项'
    ],
    useCases: [
      'Shell 脚本格式化和美化',
      '系统管理脚本编写',
      '自动化脚本开发',
      '脚本代码规范统一'
    ],
    technicalBackground: `Shell 脚本是一种用于自动化系统管理任务的脚本语言，在 Unix/Linux 系统中广泛使用。

Shell 脚本特点：
• 解释执行：无需编译，直接运行
• 系统集成：与操作系统紧密集成
• 文本处理：强大的文本处理能力
• 管道操作：支持命令管道和重定向

常见 Shell 类型：
• Bash：最常用的 Shell，功能强大
• Zsh：增强的 Shell，支持插件
• Fish：用户友好的 Shell
• Dash：轻量级 Shell

应用场景：
• 系统管理自动化
• 部署脚本编写
• 日志处理和分析
• 批量文件操作`,
    usageSteps: [
      '将 Shell 脚本粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '使用有意义的变量名',
      '添加适当的注释说明',
      '处理错误和异常情况',
      '遵循 Shell 脚本最佳实践'
    ]
  },

  vue: {
    title: 'Vue 代码格式化工具',
    description: '专业的 Vue 代码格式化工具，支持美化、压缩、语法检查等功能',
    features: [
      'Vue 语法高亮显示',
      '自动缩进和格式化',
      'Vue 风格指南支持',
      '多种格式化选项'
    ],
    useCases: [
      'Vue 代码格式化和美化',
      '团队协作开发',
      '代码审查和重构',
      '项目代码规范统一'
    ],
    technicalBackground: `Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面，具有易学易用、功能强大等特点。

Vue 框架特点：
• 渐进式：可以逐步采用，从简单到复杂
• 响应式：数据变化自动更新视图
• 组件化：可复用的组件系统
• 轻量级：体积小，性能优秀

Vue 代码风格：
• 使用 2 个空格缩进
• 组件名使用 PascalCase
• 属性名使用 kebab-case
• 方法名使用 camelCase

应用场景：
• 单页应用开发
• 组件库开发
• 企业级应用开发
• 移动端应用开发`,
    usageSteps: [
      '将 Vue 代码粘贴到输入框',
      '选择格式化选项（美化/压缩）',
      '点击格式化按钮',
      '查看格式化结果'
    ],
    bestPractices: [
      '遵循 Vue 风格指南',
      '使用有意义的组件名',
      '保持代码结构清晰',
      '适当添加注释说明'
    ]
  },

  ed25519: {
    title: 'Ed25519 数字签名工具',
    description: '专业的 Ed25519 数字签名工具，支持密钥生成、签名和验证功能',
    features: [
      'Ed25519 密钥对生成',
      '数字签名生成',
      '签名验证',
      '高性能椭圆曲线算法'
    ],
    useCases: [
      '数字签名和验证',
      '身份认证',
      '软件包签名',
      '区块链应用'
    ],
    technicalBackground: `Ed25519 是一种基于 Edwards25519 椭圆曲线的数字签名算法，由 Daniel J. Bernstein 等人设计。

Ed25519 特点：
• 高性能：签名和验证速度快
• 安全性高：基于椭圆曲线密码学
• 密钥长度短：公钥和私钥都是 32 字节
• 抗量子攻击：比 RSA 更安全

算法优势：
• 签名速度快：比 RSA 快 10-100 倍
• 密钥生成快：比 RSA 快 1000 倍
• 密钥长度短：公钥和私钥都是 256 位
• 安全性高：基于椭圆曲线离散对数问题

应用场景：
• 软件包签名验证
• 身份认证系统
• 区块链和加密货币
• 安全通信协议`,
    usageSteps: [
      '生成 Ed25519 密钥对',
      '使用私钥对数据进行签名',
      '使用公钥验证签名',
      '查看签名结果'
    ],
    bestPractices: [
      '安全保存私钥',
      '定期更换密钥对',
      '验证公钥的真实性',
      '使用安全的随机数生成器'
    ]
  },

  rsaSign: {
    title: 'RSA 数字签名工具',
    description: '专业的 RSA 数字签名工具，支持密钥生成、签名和验证功能',
    features: [
      'RSA 密钥对生成',
      '数字签名生成',
      '签名验证',
      '多种哈希算法支持'
    ],
    useCases: [
      '数字签名和验证',
      '身份认证',
      '软件包签名',
      '安全通信'
    ],
    technicalBackground: `RSA 数字签名是一种基于 RSA 公钥密码体制的数字签名算法，广泛用于身份认证和数据完整性验证。

RSA 签名特点：
• 非对称加密：使用公钥验证，私钥签名
• 安全性高：基于大整数分解问题
• 标准化：广泛支持的标准算法
• 兼容性好：与多种系统兼容

签名过程：
• 使用私钥对消息哈希进行加密
• 生成数字签名
• 使用公钥验证签名
• 确保消息完整性和身份认证

应用场景：
• 软件包签名验证
• SSL/TLS 证书
• 身份认证系统
• 安全通信协议`,
    usageSteps: [
      '生成 RSA 密钥对',
      '使用私钥对数据进行签名',
      '使用公钥验证签名',
      '查看签名结果'
    ],
    bestPractices: [
      '安全保存私钥',
      '使用强密钥长度（2048位以上）',
      '定期更换密钥对',
      '验证公钥的真实性'
    ]
  },

  url: {
    title: 'URL 编码解码工具',
    description: '专业的 URL 编码解码工具，支持 URL 安全字符转换',
    features: [
      'URL 编码和解码',
      '特殊字符处理',
      '批量处理功能',
      '多种编码标准支持'
    ],
    useCases: [
      'URL 参数编码',
      'Web 开发调试',
      'API 接口开发',
      '数据传输安全'
    ],
    technicalBackground: `URL 编码是一种将特殊字符转换为 URL 安全格式的方法，确保数据在 URL 中正确传输。

URL 编码原理：
• 将非 ASCII 字符转换为 %XX 格式
• 保留字母、数字和部分特殊字符
• 空格转换为 %20 或 +
• 确保 URL 的兼容性

编码规则：
• 字母 A-Z, a-z 保持不变
• 数字 0-9 保持不变
• 特殊字符 -_.~ 保持不变
• 其他字符转换为 %XX 格式

应用场景：
• Web 表单提交
• API 参数传递
• 文件下载链接
• 跨平台数据交换`,
    usageSteps: [
      '输入要编码或解码的文本',
      '选择编码或解码操作',
      '点击相应按钮进行处理',
      '复制或下载结果'
    ],
    bestPractices: [
      '注意字符编码的一致性',
      '验证解码结果的正确性',
      '处理特殊字符时要小心',
      '在 URL 中使用编码后的数据'
    ]
  },

  x25519: {
    title: 'X25519 密钥交换工具',
    description: '专业的 X25519 密钥交换工具，支持安全密钥协商',
    features: [
      'X25519 密钥对生成',
      '密钥交换计算',
      '共享密钥生成',
      '高性能椭圆曲线算法'
    ],
    useCases: [
      '密钥协商和交换',
      '安全通信协议',
      '端到端加密',
      '密钥派生'
    ],
    technicalBackground: `X25519 是一种基于 Curve25519 椭圆曲线的密钥交换算法，用于安全地协商共享密钥。

X25519 特点：
• 高性能：密钥交换速度快
• 安全性高：基于椭圆曲线密码学
• 密钥长度短：公钥和私钥都是 32 字节
• 抗量子攻击：比传统算法更安全

密钥交换过程：
• 双方生成各自的密钥对
• 交换公钥
• 使用自己的私钥和对方的公钥计算共享密钥
• 生成相同的共享密钥用于加密

应用场景：
• TLS/SSL 协议
• 端到端加密通信
• 密钥协商协议
• 安全消息传递`,
    usageSteps: [
      '生成 X25519 密钥对',
      '输入对方的公钥',
      '计算共享密钥',
      '查看密钥交换结果'
    ],
    bestPractices: [
      '安全保存私钥',
      '验证公钥的真实性',
      '定期更换密钥对',
      '使用安全的随机数生成器'
    ]
  },

  argon2: {
    title: 'Argon2 密码哈希工具',
    description: '专业的 Argon2 密码哈希工具，支持多种变体和参数配置',
    features: [
      'Argon2d/Argon2i/Argon2id 支持',
      '可调节内存和时间成本',
      '抗侧信道攻击',
      '密码哈希验证'
    ],
    useCases: [
      '密码安全存储',
      '用户认证系统',
      '密钥派生',
      '安全哈希计算'
    ],
    technicalBackground: `Argon2 是一种密码哈希函数，在 2015 年密码哈希竞赛中获胜，被设计为抗 GPU 和专用硬件攻击。

Argon2 特点：
• 内存硬性：需要大量内存，抗硬件攻击
• 可调节参数：内存成本、时间成本、并行度
• 三种变体：Argon2d、Argon2i、Argon2id
• 抗侧信道攻击：保护敏感信息

算法变体：
• Argon2d：数据依赖的内存访问
• Argon2i：数据独立的内存访问
• Argon2id：混合模式，推荐使用

应用场景：
• 密码存储和验证
• 密钥派生函数
• 区块链挖矿算法
• 安全系统设计`,
    usageSteps: [
      '选择 Argon2 变体',
      '设置哈希参数',
      '输入密码进行哈希',
      '验证哈希结果'
    ],
    bestPractices: [
      '使用 Argon2id 变体',
      '设置足够的内存成本',
      '定期更新哈希参数',
      '安全存储哈希结果'
    ]
  },

  bcrypt: {
    title: 'Bcrypt 密码哈希工具',
    description: '专业的 Bcrypt 密码哈希工具，支持自适应成本因子',
    features: [
      '自适应成本因子',
      '盐值自动生成',
      '密码验证功能',
      '抗暴力破解'
    ],
    useCases: [
      '密码安全存储',
      '用户认证系统',
      '密码强度验证',
      '安全哈希计算'
    ],
    technicalBackground: `Bcrypt 是一种基于 Blowfish 密码的密码哈希函数，由 Niels Provos 和 David Mazières 设计。

Bcrypt 特点：
• 自适应成本：可调节计算复杂度
• 内置盐值：自动生成随机盐值
• 抗暴力破解：计算密集型算法
• 时间可调：根据硬件性能调整

工作原理：
• 使用 Blowfish 密码算法
• 自动生成随机盐值
• 可调节轮数（成本因子）
• 输出固定长度哈希值

应用场景：
• 用户密码存储
• 身份认证系统
• 密码强度评估
• 安全系统设计`,
    usageSteps: [
      '设置成本因子',
      '输入密码进行哈希',
      '生成哈希结果',
      '验证密码哈希'
    ],
    bestPractices: [
      '使用成本因子 12 或更高',
      '定期更新成本因子',
      '安全存储哈希结果',
      '验证密码强度'
    ]
  },

  chacha20: {
    title: 'ChaCha20 加密工具',
    description: '专业的 ChaCha20 流密码加密工具，支持高速加密',
    features: [
      'ChaCha20 流密码加密',
      '多种密钥长度支持',
      '高速加密解密',
      '抗侧信道攻击'
    ],
    useCases: [
      '数据加密保护',
      '安全通信协议',
      '文件加密',
      '流媒体加密'
    ],
    technicalBackground: `ChaCha20 是一种流密码算法，由 Daniel J. Bernstein 设计，被广泛用于 TLS 协议和移动设备。

ChaCha20 特点：
• 高速加密：比 AES 在某些平台上更快
• 简单实现：易于软件实现
• 抗侧信道攻击：时序攻击防护
• 标准化：RFC 8439 标准

算法优势：
• 无专利限制：开源算法
• 硬件友好：适合移动设备
• 安全性高：经过广泛分析
• 性能优秀：在 ARM 处理器上表现优异

应用场景：
• TLS/SSL 协议
• 移动应用加密
• 实时通信加密
• 文件系统加密`,
    usageSteps: [
      '生成或输入密钥',
      '设置随机数（nonce）',
      '输入数据进行加密',
      '查看加密结果'
    ],
    bestPractices: [
      '使用强随机密钥',
      '每次使用不同的 nonce',
      '安全传输密钥',
      '验证加密结果'
    ]
  },

  des: {
    title: 'DES Encryption/Decryption Tool',
    description: 'Professional DES symmetric encryption tool supporting multiple modes and key lengths',
    features: [
      'Supports ECB, CBC and other modes',
      'Configurable key length',
      'Real-time encryption and decryption',
      'Hex/text input and output'
    ],
    useCases: [
      'Data encryption protection',
      'Legacy system compatibility',
      'Secure communication',
      'File encryption'
    ],
    technicalBackground: `DES (Data Encryption Standard) is a symmetric encryption algorithm widely used in early data encryption scenarios.
    
Main characteristics:
• Symmetric encryption, 56-bit key length
• Supports multiple modes (ECB, CBC, etc.)
• Now replaced by more secure algorithms (such as AES), but still used for compatibility in some cases
`,
    usageSteps: [
      'Enter data to encrypt/decrypt',
      'Set key and encryption mode',
      'Select encrypt or decrypt operation',
      'Get the result'
    ],
    bestPractices: [
      'Avoid for high-security scenarios',
      'Keep the key safe',
      'Prefer more secure algorithms (such as AES)',
      'Verify encryption result'
    ]
  }
}

// 获取工具描述的辅助函数
export const getToolDescription = (toolKey, locale = 'zh-CN') => {
  // 支持多种中文 locale 格式
  const isChinese = locale === 'zh-CN' || locale === 'zh' || locale.startsWith('zh')
  const descriptions = isChinese ? toolDescriptions : toolDescriptionsEn
  return descriptions[toolKey] || null
} 