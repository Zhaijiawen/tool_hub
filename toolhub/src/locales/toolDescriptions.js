// 工具详细描述数据 - 避免i18n转义问题
export const toolDescriptions = {
  // 格式化工具
  json: {
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

  "ecdh-key-exchange": {
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

  "ecdsa-sign": {
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
  convert: {
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

  reverse: {
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

  "http-status": {
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

  "char-code": {
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

  "date-calc": {
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

  markdownFormat: {
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

  java: {
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

  "ed25519-sign": {
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

  "rsa-sign": {
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
  },

  "date-diff": {
    features: [
      '多种时间单位支持',
      '精确的差值计算',
      '时区处理',
      '实时计算'
    ],
    useCases: [
      '项目时间计算',
      '工期估算',
      '时间间隔分析',
      '日程安排'
    ],
    usageSteps: [
      '选择开始日期',
      '选择结束日期',
      '选择计算单位',
      '查看计算结果'
    ],
    bestPractices: [
      '注意时区设置',
      '验证日期范围',
      '选择合适的精度',
      '处理边界情况'
    ]
  },

  "number-base": {
    features: [
      '多种进制支持',
      '实时转换',
      '输入验证',
      '结果复制'
    ],
    useCases: [
      '编程开发',
      '计算机科学学习',
      '数字系统分析',
      '数据处理'
    ],
    usageSteps: [
      '输入源进制数字',
      '选择源进制',
      '选择目标进制',
      '查看转换结果'
    ],
    bestPractices: [
      '验证输入格式',
      '注意数值范围',
      '保持转换精度',
      '检查转换结果'
    ]
  },

  "storage-time": {
    features: [
      '存储容量转换',
      '时间单位转换',
      '实时计算',
      '精度控制'
    ],
    useCases: [
      '存储容量计算',
      '时间单位换算',
      '性能分析',
      '系统设计'
    ],
    usageSteps: [
      '选择转换类型',
      '输入数值',
      '选择源单位',
      '选择目标单位'
    ],
    bestPractices: [
      '注意单位类型',
      '验证输入数值',
      '选择合适的精度',
      '检查转换结果'
    ]
  },

  "user-agent": {
    features: [
      '浏览器信息解析',
      '操作系统识别',
      '设备类型检测',
      '引擎信息提取'
    ],
    useCases: [
      'Web 开发调试',
      '用户行为分析',
      '兼容性测试',
      '统计分析'
    ],
    usageSteps: [
      '输入 User Agent 字符串',
      '自动解析信息',
      '查看解析结果',
      '复制相关信息'
    ],
    bestPractices: [
      '使用真实 User Agent',
      '注意隐私保护',
      '验证解析结果',
      '处理异常情况'
    ]
  },

  imageConvert: {
    features: [
      '多种格式支持',
      '质量控制',
      '实时预览',
      '大小优化'
    ],
    useCases: [
      '网页图片优化',
      '格式兼容性',
      '文件大小减少',
      '图片处理工作流'
    ],
    usageSteps: [
      '上传源图片',
      '选择目标格式',
      '调整质量设置',
      '下载转换后的图片'
    ],
    bestPractices: [
      '根据用途选择合适的格式',
      '平衡质量和文件大小',
      '考虑浏览器兼容性',
      '在不同设备上测试'
    ]
  },

  crop: {
    features: [
      '交互式裁剪界面',
      '宽高比控制',
      '缩放和平移功能',
      '实时预览'
    ],
    useCases: [
      '照片编辑',
      '社交媒体准备',
      '缩略图创建',
      '内容裁剪'
    ],
    usageSteps: [
      '上传要裁剪的图片',
      '调整裁剪区域',
      '设置宽高比（如需要）',
      '下载裁剪结果'
    ],
    bestPractices: [
      '裁剪时保持图片质量',
      '考虑最终用途的尺寸',
      '使用合适的宽高比',
      '最终确定前预览'
    ]
  },

  rotate: {
    features: [
      '精确角度控制',
      '实时预览',
      '多种旋转选项',
      '质量保持'
    ],
    useCases: [
      '照片方向校正',
      '文档扫描',
      '创意图片编辑',
      '批量图片处理'
    ],
    usageSteps: [
      '上传要旋转的图片',
      '选择旋转角度',
      '预览旋转结果',
      '下载最终图片'
    ],
    bestPractices: [
      '尽可能使用标准角度',
      '旋转后检查图片质量',
      '考虑最终显示方向',
      '保持宽高比完整性'
    ]
  },

  watermark: {
    features: [
      '自定义文本水印',
      '字体大小和颜色控制',
      '透明度和旋转设置',
      '实时预览'
    ],
    useCases: [
      '版权保护',
      '品牌水印',
      '照片标识',
      '内容所有权标记'
    ],
    usageSteps: [
      '上传源图片',
      '输入水印文本',
      '调整样式选项',
      '下载带水印的图片'
    ],
    bestPractices: [
      '使用可读但不突兀的文本',
      '战略性地定位水印',
      '平衡可见性和美观性',
      '在不同背景上测试'
    ]
  },

  case: {
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

  whitespace: {
    features: [
      '去除多余空白',
      '去除行尾空白',
      '去除重复空白',
      '去除制表符'
    ],
    useCases: [
      '文本清理和标准化',
      '代码格式化',
      '文档准备',
      '数据导入'
    ],
    usageSteps: [
      '输入要处理的文本',
      '选择处理选项',
      '点击处理按钮',
      '复制处理后的文本'
    ],
    bestPractices: [
      '保持文本格式的一致性',
      '测试不同文本类型',
      '考虑编码问题',
      '验证处理结果'
    ]
  },

  replace: {
    features: [
      '精确查找替换',
      '正则表达式支持',
      '大小写敏感选项',
      '批量处理功能'
    ],
    useCases: [
      '文本编辑和修改',
      '数据清理和转换',
      '代码重构',
      '文档格式化'
    ],
    usageSteps: [
      '输入要处理的文本',
      '设置查找条件',
      '输入替换内容',
      '执行替换操作'
    ],
    bestPractices: [
      '使用精确的查找条件',
      '测试正则表达式',
      '备份原始数据',
      '验证替换结果'
    ]
  }
}

// 英文版本
export const toolDescriptionsEn = {
  // 格式化工具
  json: {
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

  "ecdh-key-exchange": {
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

  "ecdsa-sign": {
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
  case: {
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

  // More conversion tools
  regex: {
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

  "http-status": {
    features: [
      'Complete status code database',
      'Detailed status code explanations',
      'Usage scenarios and best practices',
      'Status code classification management'
    ],
    useCases: [
      'Web development debugging',
      'API design and development',
      'Network problem diagnosis',
      'System monitoring and operations'
    ],
    usageSteps: [
      'Enter status code or search keywords',
      'View detailed explanations',
      'Understand usage scenarios',
      'Reference best practices'
    ],
    bestPractices: [
      'Use standard status codes',
      'Provide meaningful error messages',
      'Use redirects appropriately',
      'Monitor error status codes'
    ]
  },

  "char-code": {
    features: [
      'Multiple encoding formats support',
      'Character encoding table query',
      'Batch encoding conversion',
      'Encoding problem diagnosis'
    ],
    useCases: [
      'Text encoding processing',
      'Internationalization application development',
      'Data import and export',
      'Encoding problem troubleshooting'
    ],
    usageSteps: [
      'Enter text to convert',
      'Select source and target encoding',
      'Execute encoding conversion',
      'View conversion results'
    ],
    bestPractices: [
      'Use UTF-8 encoding consistently',
      'Pay attention to encoding compatibility',
      'Handle special characters',
      'Verify conversion results'
    ]
  },

  "date-calc": {
    features: [
      'Multiple time unit support',
      'Precise difference calculation',
      'Timezone handling',
      'Real-time calculation'
    ],
    useCases: [
      'Project time calculation',
      'Duration estimation',
      'Time interval analysis',
      'Schedule planning'
    ],
    usageSteps: [
      'Select start date',
      'Select end date',
      'Choose calculation unit',
      'View calculation result'
    ],
    bestPractices: [
      'Pay attention to timezone settings',
      'Validate date ranges',
      'Choose appropriate precision',
      'Handle boundary cases'
    ]
  },

  // 更多加密工具
  rsa: {
    features: [
      'RSA key pair generation',
      'Public key encryption and private key decryption',
      'Digital signature verification',
      'Multiple key length support'
    ],
    useCases: [
      'Secure communication encryption',
      'Digital certificate management',
      'API security authentication',
      'File encryption protection'
    ],
    usageSteps: [
      'Generate RSA key pair',
      'Encrypt data with public key',
      'Decrypt data with private key',
      'Verify digital signature'
    ],
    bestPractices: [
      'Use sufficiently long keys',
      'Store private keys securely',
      'Rotate keys regularly',
      'Verify key validity'
    ]
  },

  sha: {
    features: [
      'Multiple SHA algorithm support',
      'File hash calculation',
      'Hash value verification',
      'Batch hash processing'
    ],
    useCases: [
      'File integrity verification',
      'Password hash storage',
      'Digital signature',
      'Data deduplication'
    ],
    usageSteps: [
      'Select SHA algorithm',
      'Enter data to hash',
      'Calculate hash value',
      'Verify hash result'
    ],
    bestPractices: [
      'Use SHA-256 or higher',
      'Salt password hashes',
      'Verify file integrity',
      'Store hash values securely'
    ]
  },

  jwt: {
    features: [
      'JWT token generation',
      'Token decoding and verification',
      'Multiple signature algorithms',
      'Token expiration time setting'
    ],
    useCases: [
      'User authentication',
      'API access control',
      'Single sign-on system',
      'Microservice communication'
    ],
    usageSteps: [
      'Set JWT parameters',
      'Generate JWT token',
      'Decode and verify token',
      'View token content'
    ],
    bestPractices: [
      'Use strong key signatures',
      'Set reasonable expiration time',
      'Verify token signature',
      'Protect sensitive information'
    ]
  },

  markdownFormat: {
    features: [
      'Markdown syntax highlighting',
      'Automatic indentation and formatting',
      'Syntax error detection',
      'Multiple formatting options'
    ],
    useCases: [
      'Document formatting and beautification',
      'Technical document writing',
      'Blog post editing',
      'README file optimization'
    ],
    usageSteps: [
      'Paste Markdown content into input box',
      'Select formatting options (beautify/compress)',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Use standard Markdown syntax',
      'Keep document structure clear',
      'Use appropriate heading levels',
      'Pay attention to syntax highlighting for code blocks'
    ]
  },

  java: {
    features: [
      'Java syntax highlighting',
      'Automatic indentation and formatting',
      'Code style unification',
      'Multiple formatting options'
    ],
    useCases: [
      'Java code formatting and beautification',
      'Team collaboration development',
      'Code review and refactoring',
      'Project code standardization'
    ],
    usageSteps: [
      'Paste Java code into input box',
      'Select formatting options (beautify/compress)',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Follow Java coding standards',
      'Keep code structure clear',
      'Add appropriate comments',
      'Use meaningful variable and method names'
    ]
  },

  php: {
    features: [
      'PHP syntax highlighting',
      'Automatic indentation and formatting',
      'PSR standard support',
      'Multiple formatting options'
    ],
    useCases: [
      'PHP code formatting and beautification',
      'Team collaboration development',
      'Code review and refactoring',
      'Project code standardization'
    ],
    usageSteps: [
      'Paste PHP code into input box',
      'Select formatting options (beautify/compress)',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Follow PHP coding standards',
      'Use meaningful variable names',
      'Add appropriate comments',
      'Keep code structure clear'
    ]
  },

  ruby: {
    features: [
      'Ruby syntax highlighting',
      'Automatic indentation and formatting',
      'Ruby style guide support',
      'Multiple formatting options'
    ],
    useCases: [
      'Ruby code formatting and beautification',
      'Team collaboration development',
      'Code review and refactoring',
      'Project code standardization'
    ],
    usageSteps: [
      'Paste Ruby code into input box',
      'Select formatting options (beautify/compress)',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Follow Ruby style guide',
      'Use meaningful variable names',
      'Keep code concise and elegant',
      'Add appropriate comments'
    ]
  },

  shell: {
    features: [
      'Shell syntax highlighting',
      'Automatic indentation and formatting',
      'Multiple Shell dialects support',
      'Multiple formatting options'
    ],
    useCases: [
      'Shell script formatting and beautification',
      'System management script writing',
      'Automated script development',
      'Standardized script code'
    ],
    usageSteps: [
      'Paste Shell script into input box',
      'Select formatting options (beautify/compress)',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Use meaningful variable names',
      'Add appropriate comments',
      'Handle errors and exceptions',
      'Follow Shell script best practices'
    ]
  },

  vue: {
    features: [
      'Vue syntax highlighting',
      'Automatic indentation and formatting',
      'Vue style guide support',
      'Multiple formatting options'
    ],
    useCases: [
      'Vue code formatting and beautification',
      'Team collaboration development',
      'Code review and refactoring',
      'Project code standardization'
    ],
    usageSteps: [
      'Paste Vue code into input box',
      'Select formatting options (beautify/compress)',
      'Click format button',
      'View formatted result'
    ],
    bestPractices: [
      'Follow Vue style guide',
      'Use meaningful component names',
      'Keep code structure clear',
      'Add appropriate comments'
    ]
  },

  "ed25519-sign": {
    features: [
      'Ed25519 key pair generation',
      'Digital signature generation',
      'Signature verification',
      'High-performance elliptic curve algorithm'
    ],
    useCases: [
      'Digital signature and verification',
      'Identity authentication',
      'Software package signing',
      'Blockchain application'
    ],
    usageSteps: [
      'Generate Ed25519 key pair',
      'Sign data with private key',
      'Verify signature with public key',
      'View signature result'
    ],
    bestPractices: [
      'Securely store private keys',
      'Rotate keys regularly',
      'Verify public key authenticity',
      'Use secure random number generator'
    ]
  },

  "rsa-sign": {
    features: [
      'RSA key pair generation',
      'Digital signature generation',
      'Signature verification',
      'Multiple hash algorithms support'
    ],
    useCases: [
      'Digital signature and verification',
      'Identity authentication',
      'Software package signing',
      'Secure communication'
    ],
    usageSteps: [
      'Generate RSA key pair',
      'Sign data with private key',
      'Verify signature with public key',
      'View signature result'
    ],
    bestPractices: [
      'Securely store private keys',
      'Use strong key length (2048 bits or above)',
      'Rotate keys regularly',
      'Verify public key authenticity'
    ]
  },

  url: {
    features: [
      'URL encoding and decoding',
      'Special character handling',
      'Batch processing functionality',
      'Multiple encoding standards support'
    ],
    useCases: [
      'URL parameter encoding',
      'Web development debugging',
      'API development',
      'Secure data transmission'
    ],
    usageSteps: [
      'Enter text to encode or decode',
      'Select encode or decode operation',
      'Click the corresponding button to process',
      'Copy or download the result'
    ],
    bestPractices: [
      'Ensure consistent character encoding',
      'Verify decoding results correctly',
      'Be careful with special characters',
      'Use URL-encoded data in URLs'
    ]
  },

  x25519: {
    features: [
      'X25519 key pair generation',
      'Key exchange calculation',
      'Shared key generation',
      'High-performance elliptic curve algorithm'
    ],
    useCases: [
      'Key negotiation and exchange',
      'Secure communication protocol',
      'End-to-end encryption',
      'Key derivation'
    ],
    usageSteps: [
      'Generate X25519 key pair',
      'Enter the other party\'s public key',
      'Calculate shared key',
      'View key exchange result'
    ],
    bestPractices: [
      'Securely store private keys',
      'Verify public key authenticity',
      'Rotate keys regularly',
      'Use secure random number generator'
    ]
  },

  argon2: {
    features: [
      'Support for Argon2d/Argon2i/Argon2id',
      'Adjustable memory and time costs',
      'Resistant to side-channel attacks',
      'Password hash verification'
    ],
    useCases: [
      'Secure password storage',
      'User authentication system',
      'Key derivation',
      'Secure hash calculation'
    ],
    usageSteps: [
      'Select Argon2 variant',
      'Set hash parameters',
      'Enter password for hashing',
      'Verify hashed result'
    ],
    bestPractices: [
      'Use Argon2id variant',
      'Set sufficient memory cost',
      'Regularly update hash parameters',
      'Securely store hashed results'
    ]
  },

  bcrypt: {
    features: [
      'Adaptive cost factor',
      'Salt value auto-generation',
      'Password verification functionality',
      'Resistant to brute force attacks'
    ],
    useCases: [
      'Secure password storage',
      'User authentication system',
      'Password strength verification',
      'Secure hash calculation'
    ],
    usageSteps: [
      'Set cost factor',
      'Enter password for hashing',
      'Generate hashed result',
      'Verify password hash'
    ],
    bestPractices: [
      'Use cost factor 12 or higher',
      'Regularly update cost factor',
      'Securely store hashed results',
      'Verify password strength'
    ]
  },

  chacha20: {
    features: [
      'ChaCha20 stream cipher encryption',
      'Multiple key length support',
      'High-speed encryption and decryption',
      'Resistant to side-channel attacks'
    ],
    useCases: [
      'Data encryption protection',
      'Secure communication protocol',
      'File encryption',
      'Streaming media encryption'
    ],
    usageSteps: [
      'Generate or enter key',
      'Set random number (nonce)',
      'Input data for encryption',
      'View encryption result'
    ],
    bestPractices: [
      'Use strong random key',
      'Use different nonce each time',
      'Securely transmit key',
      'Verify encryption result'
    ]
  },

  des: {
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
  },

  "date-diff": {
    features: [
      'Multiple time unit support',
      'Precise difference calculation',
      'Timezone handling',
      'Real-time calculation'
    ],
    useCases: [
      'Project time calculation',
      'Duration estimation',
      'Time interval analysis',
      'Schedule planning'
    ],
    usageSteps: [
      'Select start date',
      'Select end date',
      'Choose calculation unit',
      'View calculation result'
    ],
    bestPractices: [
      'Pay attention to timezone settings',
      'Validate date ranges',
      'Choose appropriate precision',
      'Handle boundary cases'
    ]
  },

  "number-base": {
    features: [
      'Multiple base support',
      'Real-time conversion',
      'Input validation',
      'Result copying'
    ],
    useCases: [
      'Programming development',
      'Computer science learning',
      'Number system analysis',
      'Data processing'
    ],
    usageSteps: [
      'Enter source base number',
      'Select source base',
      'Select target base',
      'View conversion result'
    ],
    bestPractices: [
      'Validate input format',
      'Pay attention to number ranges',
      'Maintain conversion precision',
      'Check conversion results'
    ]
  },

  "storage-time": {
    features: [
      'Storage capacity conversion',
      'Time unit conversion',
      'Real-time calculation',
      'Precision control'
    ],
    useCases: [
      'Storage capacity calculation',
      'Time unit conversion',
      'Performance analysis',
      'System design'
    ],
    usageSteps: [
      'Select conversion type',
      'Enter value',
      'Select source unit',
      'Select target unit'
    ],
    bestPractices: [
      'Pay attention to unit types',
      'Validate input values',
      'Choose appropriate precision',
      'Check conversion results'
    ]
  },

  "user-agent": {
    features: [
      'Browser information parsing',
      'Operating system identification',
      'Device type detection',
      'Engine information extraction'
    ],
    useCases: [
      'Web development debugging',
      'User behavior analysis',
      'Compatibility testing',
      'Statistical analysis'
    ],
    usageSteps: [
      'Enter User Agent string',
      'Automatically parse information',
      'View parsing results',
      'Copy relevant information'
    ],
    bestPractices: [
      'Use real User Agent',
      'Pay attention to privacy protection',
      'Verify parsing results',
      'Handle exceptional cases'
    ]
  },

  convert: {
    features: [
      'Multiple format support',
      'Quality control',
      'Real-time preview',
      'Size optimization'
    ],
    useCases: [
      'Web image optimization',
      'Format compatibility',
      'File size reduction',
      'Image processing workflow'
    ],
    usageSteps: [
      'Upload source image',
      'Select target format',
      'Adjust quality settings',
      'Download converted image'
    ],
    bestPractices: [
      'Choose appropriate format for use case',
      'Balance quality and file size',
      'Consider browser compatibility',
      'Test across different devices'
    ]
  },

  crop: {
    features: [
      'Interactive cropping interface',
      'Aspect ratio control',
      'Zoom and pan functionality',
      'Real-time preview'
    ],
    useCases: [
      'Photo editing',
      'Social media preparation',
      'Thumbnail creation',
      'Content cropping'
    ],
    usageSteps: [
      'Upload image to crop',
      'Adjust crop area',
      'Set aspect ratio if needed',
      'Download cropped result'
    ],
    bestPractices: [
      'Maintain image quality during cropping',
      'Consider final use case dimensions',
      'Use appropriate aspect ratios',
      'Preview before finalizing'
    ]
  },

  rotate: {
    features: [
      'Precise angle control',
      'Real-time preview',
      'Multiple rotation options',
      'Quality preservation'
    ],
    useCases: [
      'Photo orientation correction',
      'Document scanning',
      'Creative image editing',
      'Batch image processing'
    ],
    usageSteps: [
      'Upload image to rotate',
      'Select rotation angle',
      'Preview rotated result',
      'Download final image'
    ],
    bestPractices: [
      'Use standard angles when possible',
      'Check image quality after rotation',
      'Consider final display orientation',
      'Maintain aspect ratio integrity'
    ]
  },

  watermark: {
    features: [
      'Customizable text watermarks',
      'Font size and color control',
      'Opacity and rotation settings',
      'Real-time preview'
    ],
    useCases: [
      'Copyright protection',
      'Brand watermarking',
      'Photo identification',
      'Content ownership marking'
    ],
    usageSteps: [
      'Upload source image',
      'Enter watermark text',
      'Adjust styling options',
      'Download watermarked image'
    ],
    bestPractices: [
      'Use readable but unobtrusive text',
      'Position watermarks strategically',
      'Balance visibility and aesthetics',
      'Test on different backgrounds'
    ]
  },

  textCase: {
    features: [
      'Multiple case format support',
      'Real-time conversion',
      'Batch processing',
      'Special character preservation'
    ],
    useCases: [
      'Programming variable naming',
      'Document title formatting',
      'Database field naming',
      'API parameter standardization'
    ],
    usageSteps: [
      'Enter text to convert',
      'Select target case format',
      'Click conversion button',
      'Copy converted result'
    ],
    bestPractices: [
      'Maintain naming consistency',
      'Follow language conventions',
      'Use meaningful names',
      'Avoid overly long names'
    ]
  },

  whitespace: {
    features: [
      'Whitespace trimming',
      'Whitespace compression',
      'Real-time processing',
      'Format preservation'
    ],
    useCases: [
      'Text cleaning and formatting',
      'Data preprocessing',
      'Code formatting',
      'Document preparation'
    ],
    usageSteps: [
      'Enter text to process',
      'Select whitespace operation',
      'Click process button',
      'Copy cleaned result'
    ],
    bestPractices: [
      'Preserve intentional formatting',
      'Test with various text types',
      'Consider encoding requirements',
      'Verify processing accuracy'
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