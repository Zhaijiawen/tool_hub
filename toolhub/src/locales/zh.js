export default {
  common: {
    format: '格式化',
    encrypt: '加密',
    convert: '转换',
    image: '图片',
    text: '文本',
    other: '其他',
    copy: '复制',
    success: '成功',
    error: '错误',
    input: '输入',
    output: '输出',
    convert: '转换',
    required: '必填项',
    more: '更多',
    theme: {
      light: '浅色',
      dark: '深色'
    },
    search: '搜索',
    searchPlaceholder: '搜索工具...',
    noResults: '没有找到相关工具',
    loading: '加载中...',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    reset: '重置',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    finish: '完成',
    less: '收起',
    all: '全部',
    none: '无',
    unknown: '未知',
    optional: '可选',
    select: '请选择',
    upload: '上传',
    download: '下载',
    preview: '预览',
    paste: '粘贴',
    cut: '剪切',
    rename: '重命名',
    move: '移动',
    create: '创建',
    update: '更新',
    refresh: '刷新',
    filter: '筛选',
    sort: '排序',
    submit: '提交',
    close: '关闭',
    open: '打开',
    expand: '展开',
    collapse: '收起',
    zoomIn: '放大',
    zoomOut: '缩小',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    settings: '设置',
    help: '帮助',
    about: '关于',
    feedback: '反馈',
    report: '报告',
    share: '分享',
    like: '点赞',
    unlike: '取消点赞',
    follow: '关注',
    unfollow: '取消关注',
    block: '屏蔽',
    unblock: '取消屏蔽',
    mute: '静音',
    unmute: '取消静音',
    pin: '置顶',
    unpin: '取消置顶',
    archive: '归档',
    unarchive: '取消归档',
    star: '标星',
    unstar: '取消标星',
    bookmark: '收藏',
    unbookmark: '取消收藏',
    subscribe: '订阅',
    unsubscribe: '取消订阅',
    join: '加入',
    leave: '离开',
    invite: '邀请',
    kick: '踢出',
    ban: '封禁',
    unban: '解封',
    promote: '提升',
    demote: '降级',
    transfer: '转让',
    resign: '辞职',
    dismiss: '解散',
    merge: '合并',
    split: '拆分',
    duplicate: '复制',
    restore: '恢复',
    undelete: '恢复删除',
    hide: '隐藏',
    show: '显示',
    lock: '锁定',
    unlock: '解锁',
    enable: '启用',
    disable: '禁用',
    activate: '激活',
    deactivate: '停用',
    verify: '验证',
    unverify: '取消验证',
    approve: '批准',
    reject: '拒绝',
    accept: '接受',
    decline: '拒绝',
    grant: '授予',
    revoke: '撤销',
    assign: '分配',
    unassign: '取消分配',
    delegate: '委派',
    undelegate: '取消委派',
    return: '返回',
    forward: '转发',
    reply: '回复',
    quote: '引用',
    mention: '提及',
    tag: '标签',
    untag: '取消标签'
  },
  footer: {
    about: '关于我们',
    description: 'ToolHub是一个在线工具集合，提供各种实用的开发工具，帮助开发者提高工作效率。',
    links: '相关链接',
    contact: '联系我们',
    follow: '关注我们',
    rights: '保留所有权利',
    icp: '京ICP备XXXXXXXX号-1'
  },
  format: {
    json: {
      title: 'JSON格式化',
      placeholder: '请输入JSON数据',
      format: '格式化',
      compress: '压缩',
      escape: '转义',
      unescape: '去除转义'
    },
    xml: {
      title: 'XML格式化',
      placeholder: '请输入XML数据',
      format: '格式化',
      compress: '压缩'
    },
    kotlin: {
      title: 'Kotlin格式化',
      placeholder: '请输入Kotlin代码',
      format: '格式化'
    },
    rust: {
      title: 'Rust格式化',
      placeholder: '请输入Rust代码',
      format: '格式化'
    },
    shell: {
      title: 'Shell/Bash格式化',
      placeholder: '请输入Shell/Bash脚本',
      format: '格式化'
    },
    sql: {
      title: 'SQL格式化',
      placeholder: '请输入SQL语句',
      format: '格式化'
    },
    markdown: {
      title: 'Markdown格式化',
      placeholder: '请输入Markdown文本',
      format: '格式化'
    },
    dart: {
      title: 'Dart格式化',
      placeholder: '请输入Dart代码',
      format: '格式化'
    }
  },
  encrypt: {
    aes: {
      title: 'AES加密/解密',
      inputPlaceholder: '请输入要加密/解密的内容',
      outputPlaceholder: '加密/解密结果将显示在这里',
      key: '密钥',
      keyPlaceholder: '请输入密钥',
      keyRequired: '密钥不能为空',
      iv: 'IV',
      ivPlaceholder: '请输入IV（可选）',
      mode: '加密模式',
      modePlaceholder: '请选择加密模式',
      padding: '填充方式',
      paddingPlaceholder: '请选择填充方式',
      encrypt: '加密',
      decrypt: '解密'
    },
    chacha20: {
      title: 'ChaCha20加密/解密',
      inputPlaceholder: '请输入要加密/解密的文本',
      key: '密钥',
      keyPlaceholder: '32字节密钥（Base64编码）',
      nonce: 'Nonce',
      noncePlaceholder: '12字节Nonce（Base64编码）',
      counter: '计数器',
      counterPlaceholder: '计数器值（默认为0）',
      outputPlaceholder: '加密/解密结果',
      encrypt: '加密',
      decrypt: '解密',
      inputRequired: '请输入要加密/解密的文本',
      keyRequired: '请输入密钥',
      nonceRequired: '请输入Nonce'
    },
    des: {
      title: 'DES/3DES加密/解密',
      inputPlaceholder: '请输入要加密/解密的内容',
      outputPlaceholder: '加密/解密结果将显示在这里',
      key: '密钥',
      keyPlaceholder: '请输入密钥',
      keyRequired: '请输入密钥',
      iv: '初始化向量',
      ivPlaceholder: '请输入初始化向量（可选）',
      mode: '加密模式',
      modePlaceholder: '请选择加密模式',
      type: '加密类型',
      typePlaceholder: '请选择加密类型',
      encrypt: '加密',
      decrypt: '解密'
    },
    rsa: {
      title: 'RSA加密/解密',
      inputPlaceholder: '请输入要加密/解密的内容',
      outputPlaceholder: '加密/解密结果将显示在这里',
      publicKey: '公钥',
      publicKeyPlaceholder: '请输入公钥',
      publicKeyRequired: '请输入公钥',
      privateKey: '私钥',
      privateKeyPlaceholder: '请输入私钥',
      privateKeyRequired: '请输入私钥',
      keySize: '密钥长度',
      keySizePlaceholder: '请选择密钥长度',
      generateKeyPair: '生成密钥对',
      encrypt: '加密',
      decrypt: '解密',
      encryptionFailed: '加密失败',
      decryptionFailed: '解密失败'
    },
    ecc: {
      title: 'ECC加密/解密',
      inputPlaceholder: '请输入要加密/解密的内容',
      outputPlaceholder: '加密/解密结果将显示在这里',
      publicKey: '公钥',
      publicKeyPlaceholder: '请输入公钥',
      publicKeyRequired: '请输入公钥',
      privateKey: '私钥',
      privateKeyPlaceholder: '请输入私钥',
      privateKeyRequired: '请输入私钥',
      curve: '曲线',
      curvePlaceholder: '请选择曲线',
      generateKeyPair: '生成密钥对',
      encrypt: '加密',
      decrypt: '解密'
    },
    ed25519: {
      title: 'Ed25519加密/解密',
      inputPlaceholder: '请输入要加密/解密的内容',
      outputPlaceholder: '加密/解密结果将显示在这里',
      publicKey: '公钥',
      publicKeyPlaceholder: '请输入公钥',
      publicKeyRequired: '请输入公钥',
      privateKey: '私钥',
      privateKeyPlaceholder: '请输入私钥',
      privateKeyRequired: '请输入私钥',
      generateKeyPair: '生成密钥对',
      encrypt: '加密',
      decrypt: '解密',
      verificationSuccess: '验证成功',
      verificationFailed: '验证失败'
    },
    ed25519Sign: {
      title: 'Ed25519签名',
      inputPlaceholder: '请输入要签名的文本',
      privateKey: '私钥',
      privateKeyPlaceholder: '请输入私钥',
      publicKey: '公钥',
      publicKeyPlaceholder: '请输入公钥',
      generateKeyPair: '生成密钥对',
      sign: '签名',
      verify: '验证',
      outputPlaceholder: '签名或验证结果将显示在这里',
      privateKeyRequired: '请输入私钥',
      publicKeyRequired: '请输入公钥',
      verificationSuccess: '验证成功',
      verificationFailed: '验证失败'
    },
    sha: {
      title: 'SHA哈希算法',
      inputPlaceholder: '请输入要计算哈希的内容',
      outputPlaceholder: '哈希结果将显示在这里',
      algorithm: '算法',
      algorithmPlaceholder: '请选择哈希算法',
      outputFormat: '输出格式',
      outputFormatPlaceholder: '请选择输出格式',
      hash: '计算哈希',
      inputRequired: '请输入要计算哈希的内容',
      invalidAlgorithm: '无效的哈希算法'
    },
    bcrypt: {
      title: 'Bcrypt哈希算法',
      inputPlaceholder: '请输入要计算哈希的内容',
      outputPlaceholder: '哈希结果将显示在这里',
      saltRounds: '盐轮数',
      saltRoundsPlaceholder: '请输入盐轮数（4-31）',
      hash: '计算哈希',
      verify: '验证哈希',
      inputRequired: '请输入要计算哈希的内容',
      bothInputsRequired: '请输入要验证的内容和哈希值',
      verificationSuccess: '验证成功',
      verificationFailed: '验证失败'
    },
    argon2: {
      title: 'Argon2哈希算法',
      inputPlaceholder: '请输入要计算哈希的内容',
      outputPlaceholder: '哈希结果将显示在这里',
      type: '类型',
      typePlaceholder: '请选择Argon2类型',
      memoryCost: '内存消耗',
      memoryCostPlaceholder: '请输入内存消耗（1-65536）',
      timeCost: '时间消耗',
      timeCostPlaceholder: '请输入时间消耗（1-100）',
      parallelism: '并行度',
      parallelismPlaceholder: '请输入并行度（1-32）',
      hash: '计算哈希',
      verify: '验证哈希',
      inputRequired: '请输入要计算哈希的内容',
      bothInputsRequired: '请输入要验证的内容和哈希值',
      verificationSuccess: '验证成功',
      verificationFailed: '验证失败'
    },
    base64: {
      title: 'Base64编码/解码',
      inputPlaceholder: '请输入要编码/解码的内容',
      outputPlaceholder: '编码/解码结果将显示在这里',
      operation: '操作',
      operationPlaceholder: '请选择操作类型',
      encode: '编码',
      decode: '解码',
      process: '处理',
      inputRequired: '请输入要处理的内容'
    },
    hex: {
      title: 'Hex编码/解码',
      inputPlaceholder: '请输入要编码/解码的内容',
      outputPlaceholder: '编码/解码结果将显示在这里',
      operation: '操作',
      operationPlaceholder: '请选择操作类型',
      encode: '编码',
      decode: '解码',
      process: '处理',
      inputRequired: '请输入要处理的内容',
      invalidHex: '无效的Hex字符串'
    },
    url: {
      title: 'URL编码/解码',
      inputPlaceholder: '请输入要编码/解码的内容',
      outputPlaceholder: '编码/解码结果将显示在这里',
      operation: '操作',
      operationPlaceholder: '请选择操作类型',
      encode: '编码',
      decode: '解码',
      process: '处理',
      inputRequired: '请输入要处理的内容'
    },
    html: {
      title: 'HTML编码/解码',
      inputPlaceholder: '请输入要编码/解码的内容',
      outputPlaceholder: '编码/解码结果将显示在这里',
      operation: '操作',
      operationPlaceholder: '请选择操作类型',
      encode: '编码',
      decode: '解码',
      process: '处理',
      inputRequired: '请输入要处理的内容'
    },
    jwt: {
      title: 'JWT编码/解码',
      inputPlaceholder: '请输入要编码/解码的内容',
      outputPlaceholder: '编码/解码结果将显示在这里',
      operation: '操作',
      operationPlaceholder: '请选择操作类型',
      encode: '编码',
      decode: '解码',
      process: '处理',
      secret: '密钥',
      secretPlaceholder: '请输入密钥',
      secretRequired: '请输入密钥',
      algorithm: '算法',
      algorithmPlaceholder: '请选择算法',
      inputRequired: '请输入要处理的内容'
    },
    diffieHellman: {
      title: 'Diffie-Hellman密钥交换',
      prime: '质数',
      primePlaceholder: '请输入质数（十六进制）',
      generator: '生成元',
      generatorPlaceholder: '请输入生成元（十六进制）',
      privateKey: '私钥',
      privateKeyPlaceholder: '请输入私钥（十六进制）',
      publicKey: '公钥',
      publicKeyPlaceholder: '请输入公钥（十六进制）',
      generateKeyPair: '生成密钥对',
      computeSharedSecret: '计算共享密钥',
      outputPlaceholder: '共享密钥将显示在这里',
      primeAndGeneratorRequired: '请输入质数和生成元',
      allFieldsRequired: '请填写所有字段'
    },
    ecdh: {
      title: 'ECDH密钥交换',
      curve: '曲线',
      curvePlaceholder: '请选择椭圆曲线',
      privateKey: '私钥',
      privateKeyPlaceholder: '请输入私钥（十六进制）',
      publicKey: '公钥',
      publicKeyPlaceholder: '请输入公钥（十六进制）',
      generateKeyPair: '生成密钥对',
      computeSharedSecret: '计算共享密钥',
      outputPlaceholder: '共享密钥将显示在这里',
      allFieldsRequired: '请填写所有字段'
    },
    userAgent: {
      title: 'User-Agent解析',
      input: '输入',
      inputPlaceholder: '请输入User-Agent字符串',
      parse: '解析',
      copy: '复制',
      copied: '已复制到剪贴板',
      inputRequired: '请输入User-Agent字符串',
      browser: '浏览器',
      browserVersion: '浏览器版本',
      os: '操作系统',
      osVersion: '系统版本',
      device: '设备',
      deviceType: '设备类型',
      details: '详细信息'
    },
    ipLookup: {
      title: 'IP地址查询',
      input: '输入',
      inputPlaceholder: '请输入IP地址',
      lookup: '查询',
      copy: '复制',
      copied: '已复制到剪贴板',
      inputRequired: '请输入IP地址',
      invalidIP: '无效的IP地址格式',
      lookupFailed: 'IP地址查询失败',
      ip: 'IP地址',
      country: '国家',
      region: '地区',
      city: '城市',
      isp: '网络服务商',
      asn: 'ASN',
      location: '地理位置',
      latitude: '纬度',
      longitude: '经度',
      timezone: '时区'
    }
  },
  convert: {
    timestamp: {
      title: '时间戳转换',
      current: '当前时间戳',
      timestamp: '时间戳',
      date: '日期',
      timezone: '时区',
      result: '转换结果',
      unit: {
        second: '秒',
        millisecond: '毫秒'
      }
    },
    dateDiff: {
      title: '日期间计算',
      startDate: '开始日期',
      endDate: '结束日期',
      unit: '计算单位',
      unitPlaceholder: '请选择计算单位',
      calculate: '计算',
      result: '计算结果',
      units: {
        year: '年',
        month: '月',
        day: '天',
        hour: '小时',
        minute: '分钟',
        second: '秒',
        millisecond: '毫秒'
      }
    },
    dateCalc: {
      title: '日期加减',
      date: '日期',
      operation: '操作',
      add: '加',
      subtract: '减',
      value: '数值',
      unit: '单位',
      unitPlaceholder: '请选择单位',
      calculate: '计算',
      result: '计算结果',
      units: {
        year: '年',
        month: '月',
        day: '天',
        hour: '小时',
        minute: '分钟',
        second: '秒',
        millisecond: '毫秒'
      }
    },
    numberBase: {
      title: '进制转换',
      input: '输入',
      inputPlaceholder: '请输入要转换的数字',
      output: '输出',
      outputPlaceholder: '转换结果将显示在这里',
      invalidInput: '输入的数字格式不正确'
    },
    charCode: {
      title: '字符编码转换',
      input: '输入',
      inputPlaceholder: '请输入要转换的内容',
      operation: '操作',
      toCode: '字符转编码',
      toChar: '编码转字符',
      output: '输出',
      outputPlaceholder: '转换结果将显示在这里',
      invalidCode: '无效的Unicode编码'
    },
    number: {
      title: '数字转换',
      input: '输入',
      inputPlaceholder: '请输入要转换的数字或文字',
      operation: '操作',
      toChinese: '数字转中文',
      toRoman: '数字转罗马数字',
      toNumber: '中文/罗马数字转数字',
      output: '输出',
      outputPlaceholder: '转换结果将显示在这里',
      convert: '转换',
      copy: '复制',
      copied: '已复制到剪贴板',
      invalidNumber: '无效的数字',
      invalidInput: '无效的输入'
    },
    unit: {
      title: '单位转换',
      category: '类别',
      categoryPlaceholder: '请选择转换类别',
      input: '输入',
      inputPlaceholder: '请输入要转换的数值',
      fromUnit: '从',
      toUnit: '到',
      unitPlaceholder: '请选择单位',
      output: '输出',
      outputPlaceholder: '转换结果将显示在这里',
      convert: '转换',
      copy: '复制',
      copied: '已复制到剪贴板',
      inputRequired: '请输入要转换的数值',
      unitRequired: '请选择转换单位',
      categories: {
        length: '长度',
        weight: '重量',
        area: '面积',
        volume: '体积'
      }
    },
    numberFormat: {
      title: '数字格式化',
      input: '输入',
      inputPlaceholder: '请输入要格式化的数字',
      operation: '操作',
      toScientific: '转换为科学计数法',
      toNormal: '转换为普通数值',
      toThousands: '转换为千分位格式',
      output: '输出',
      outputPlaceholder: '格式化结果将显示在这里',
      convert: '转换',
      copy: '复制',
      copied: '已复制到剪贴板',
      inputRequired: '请输入要格式化的数字',
      invalidNumber: '无效的数字'
    },
    storageTime: {
      title: '存储/时间单位转换',
      category: '类别',
      input: '输入',
      inputPlaceholder: '请输入要转换的数值',
      fromUnit: '从',
      toUnit: '到',
      unitPlaceholder: '请选择单位',
      output: '输出',
      outputPlaceholder: '转换结果将显示在这里',
      convert: '转换',
      copy: '复制',
      copied: '已复制到剪贴板',
      inputRequired: '请输入要转换的数值',
      unitRequired: '请选择转换单位',
      categories: {
        storage: '存储单位',
        time: '时间单位'
      }
    },
    httpStatus: {
      title: 'HTTP状态码解释',
      input: '输入',
      inputPlaceholder: '请输入HTTP状态码',
      search: '查询',
      copy: '复制',
      copied: '已复制到剪贴板',
      inputRequired: '请输入HTTP状态码',
      codeNotFound: '未找到该状态码',
      code: '状态码',
      name: '名称',
      category: '类别',
      description: '描述',
      scenarios: '使用场景',
      solutions: '解决方案',
      categories: {
        informational: '信息响应',
        success: '成功响应',
        redirect: '重定向',
        clientError: '客户端错误',
        serverError: '服务器错误'
      },
      codes: {
        '100': {
          name: '继续',
          description: '服务器已收到请求的第一部分，正在等待其余部分。',
          scenarios: [
            '客户端发送了一个包含Expect: 100-continue头的请求',
            '服务器正在等待客户端发送请求的其余部分'
          ]
        },
        '101': {
          name: '切换协议',
          description: '服务器已理解并准备切换到新的协议。',
          scenarios: [
            '客户端请求切换到WebSocket协议',
            '服务器同意协议切换'
          ]
        },
        '102': {
          name: '处理中',
          description: '服务器正在处理请求，但尚未完成。',
          scenarios: [
            '服务器需要较长时间处理请求',
            '客户端需要等待服务器完成处理'
          ]
        },
        '200': {
          name: '成功',
          description: '请求已成功，请求所希望的响应头或数据体将随此响应返回。',
          scenarios: [
            'GET请求成功获取资源',
            'POST请求成功创建资源',
            'PUT请求成功更新资源'
          ]
        },
        '201': {
          name: '已创建',
          description: '请求已经被实现，而且有一个新的资源已经依据请求的需要而建立。',
          scenarios: [
            '成功创建新资源',
            'POST请求成功创建新实体'
          ]
        },
        '204': {
          name: '无内容',
          description: '服务器成功处理了请求，但不需要返回任何实体内容。',
          scenarios: [
            'DELETE请求成功删除资源',
            'PUT请求成功更新资源但不需要返回内容'
          ]
        },
        '301': {
          name: '永久移动',
          description: '请求的资源已被永久移动到新位置。',
          scenarios: [
            '网站域名变更',
            'URL结构改变',
            '资源永久移动到新位置'
          ],
          solutions: [
            '更新所有指向旧URL的链接',
            '在服务器端设置301重定向'
          ]
        },
        '302': {
          name: '临时重定向',
          description: '请求的资源临时从不同的URI响应请求。',
          scenarios: [
            '临时重定向到其他页面',
            '用户需要登录才能访问资源'
          ]
        },
        '304': {
          name: '未修改',
          description: '客户端缓存的资源仍然有效。',
          scenarios: [
            '资源未被修改',
            '客户端使用缓存版本'
          ]
        },
        '400': {
          name: '错误请求',
          description: '服务器无法理解请求的语法。',
          scenarios: [
            '请求参数格式错误',
            '请求体格式不正确',
            '缺少必要的请求参数'
          ],
          solutions: [
            '检查请求参数格式',
            '确保请求体格式正确',
            '添加必要的请求参数'
          ]
        },
        '401': {
          name: '未授权',
          description: '请求需要用户认证。',
          scenarios: [
            '用户未登录',
            '认证令牌无效或过期',
            '缺少认证信息'
          ],
          solutions: [
            '用户需要登录',
            '更新认证令牌',
            '添加正确的认证信息'
          ]
        },
        '403': {
          name: '禁止访问',
          description: '服务器理解请求但拒绝执行。',
          scenarios: [
            '用户没有权限访问资源',
            'IP地址被禁止访问',
            '资源访问受限'
          ],
          solutions: [
            '检查用户权限',
            '联系管理员获取访问权限',
            '检查IP是否被封禁'
          ]
        },
        '404': {
          name: '未找到',
          description: '服务器找不到请求的资源。',
          scenarios: [
            'URL不存在',
            '资源已被删除',
            '路径错误'
          ],
          solutions: [
            '检查URL是否正确',
            '确认资源是否存在',
            '检查文件路径'
          ]
        },
        '429': {
          name: '请求过多',
          description: '用户在给定的时间内发送了太多请求。',
          scenarios: [
            'API调用频率超限',
            '爬虫请求过于频繁',
            'DDoS攻击'
          ],
          solutions: [
            '降低请求频率',
            '使用请求限流',
            '实现请求队列'
          ]
        },
        '500': {
          name: '服务器内部错误',
          description: '服务器遇到了一个未曾预料的状况，导致它无法完成对请求的处理。',
          scenarios: [
            '服务器内部错误',
            '程序异常',
            '数据库连接失败'
          ],
          solutions: [
            '检查服务器日志',
            '排查程序错误',
            '检查数据库连接'
          ]
        },
        '502': {
          name: '网关错误',
          description: '作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。',
          scenarios: [
            '上游服务器无响应',
            '网关超时',
            '代理服务器配置错误'
          ],
          solutions: [
            '检查上游服务器状态',
            '调整网关超时设置',
            '检查代理配置'
          ]
        },
        '503': {
          name: '服务不可用',
          description: '由于临时的服务器维护或者过载，服务器当前无法处理请求。',
          scenarios: [
            '服务器维护中',
            '服务器负载过高',
            '服务暂时不可用'
          ],
          solutions: [
            '等待服务恢复',
            '实现负载均衡',
            '增加服务器资源'
          ]
        },
        '504': {
          name: '网关超时',
          description: '作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器收到响应。',
          scenarios: [
            '上游服务器响应超时',
            '网关等待时间过长',
            '网络连接问题'
          ],
          solutions: [
            '检查上游服务器状态',
            '增加网关超时时间',
            '检查网络连接'
          ]
        }
      }
    }
  },
  image: {
    compress: {
      title: '图片压缩',
      upload: '点击或拖拽图片到此处',
      quality: '压缩质量',
      format: '输出格式',
      compress: '压缩',
      download: '下载',
      original: '原图',
      compressed: '压缩后',
      size: '文件大小',
      invalidFileType: '请上传图片文件',
      noImage: '请先上传图片'
    },
    convert: {
      title: '图片转换',
      upload: '点击或拖拽图片到此处',
      format: '输出格式',
      quality: '质量',
      convert: '转换',
      download: '下载',
      original: '原图',
      converted: '转换后',
      size: '文件大小',
      invalidFileType: '请上传图片文件',
      noImage: '请先上传图片'
    },
    rotate: {
      title: '图片旋转',
      upload: '点击或拖拽图片到此处',
      angle: '旋转角度',
      rotate: '旋转',
      download: '下载',
      original: '原图',
      rotated: '旋转后',
      invalidFileType: '请上传图片文件',
      noImage: '请先上传图片'
    },
    crop: {
      title: '图片裁剪',
      upload: '点击或拖拽图片到此处',
      crop: '裁剪',
      download: '下载',
      original: '原图',
      cropped: '裁剪后',
      invalidFileType: '请上传图片文件',
      noImage: '请先上传图片'
    },
    watermark: {
      title: '图片水印',
      upload: '点击或拖拽图片到此处',
      text: '水印文字',
      textPlaceholder: '请输入水印文字',
      fontSize: '字体大小',
      color: '颜色',
      opacity: '透明度',
      rotation: '旋转角度',
      add: '添加水印',
      download: '下载',
      original: '原图',
      watermarked: '水印后',
      invalidFileType: '请上传图片文件',
      noImage: '请先上传图片',
      noText: '请输入水印文字'
    },
    removeWatermark: {
      title: '图片去水印',
      upload: '点击或拖拽图片到此处',
      brushSize: '画笔大小',
      start: '开始去水印',
      download: '下载',
      original: '原图',
      removed: '去水印后',
      invalidFileType: '请上传图片文件',
      noImage: '请先上传图片'
    }
  },
  text: {
    case: {
      title: '大小写转换',
      input: '输入文本',
      inputPlaceholder: '请输入要转换的文本',
      output: '输出文本',
      outputPlaceholder: '转换后的文本将显示在这里',
      upperCase: '转换为大写',
      lowerCase: '转换为小写',
      titleCase: '转换为标题格式',
      sentenceCase: '转换为句子格式',
      alternatingCase: '转换为交替大小写',
      copy: '复制',
      clear: '清空',
      noInput: '请输入要转换的文本',
      copied: '已复制到剪贴板'
    },
    reverse: {
      title: '字符串反转',
      input: '输入文本',
      inputPlaceholder: '请输入要反转的文本',
      output: '输出文本',
      outputPlaceholder: '反转后的文本将显示在这里',
      reverse: '反转整个文本',
      reverseWords: '反转单词顺序',
      reverseLines: '反转行顺序',
      copy: '复制',
      clear: '清空',
      noInput: '请输入要反转的文本',
      copied: '已复制到剪贴板'
    },
    whitespace: {
      title: '空白字符处理',
      input: '输入文本',
      inputPlaceholder: '请输入要处理的文本',
      output: '输出文本',
      outputPlaceholder: '处理后的文本将显示在这里',
      trim: '去除首尾空白',
      normalize: '规范化空白字符',
      removeAll: '移除所有空白',
      singleLine: '转换为单行',
      copy: '复制',
      clear: '清空',
      noInput: '请输入要处理的文本',
      copied: '已复制到剪贴板'
    },
    replace: {
      title: '文本替换',
      input: '输入文本',
      inputPlaceholder: '请输入要替换的文本',
      find: '查找',
      findPlaceholder: '请输入要查找的文本',
      replace: '替换',
      replacePlaceholder: '请输入要替换成的文本',
      output: '输出文本',
      outputPlaceholder: '替换后的文本将显示在这里',
      replaceAll: '替换所有',
      caseSensitive: '区分大小写',
      useRegex: '使用正则表达式',
      copy: '复制',
      clear: '清空',
      noInput: '请输入要替换的文本',
      invalidRegex: '无效的正则表达式',
      copied: '已复制到剪贴板'
    }
  },
  other: {
    qrcode: {
      title: '二维码工具',
      generate: '生成二维码',
      decode: '解码二维码',
      content: '内容',
      contentPlaceholder: '请输入要生成二维码的内容',
      contentRequired: '请输入要生成二维码的内容',
      size: '尺寸',
      level: '纠错级别',
      download: '下载',
      uploadTip: '点击或拖拽图片到此处',
      preview: '预览',
      decodeResult: '解码结果',
      decodeError: '解码错误',
      noQRCodeFound: '未找到二维码'
    },
    shortUrl: {
      title: '短网址工具',
      generate: '生成短网址',
      decode: '解码短网址',
      url: '网址',
      urlPlaceholder: '请输入要缩短的网址',
      urlRequired: '请输入要缩短的网址',
      shortUrl: '短网址',
      shortUrlPlaceholder: '请输入要解码的短网址',
      shortUrlRequired: '请输入要解码的短网址',
      expires: '有效期',
      result: '结果',
      copy: '复制',
      copied: '已复制到剪贴板',
      generateError: '生成短网址失败',
      decodeError: '解码短网址失败'
    },
    calculator: {
      title: '网页计算器',
      history: '计算历史',
      invalidExpression: '无效的表达式',
      clear: '清除',
      backspace: '退格',
      equals: '等于',
      error: '错误'
    },
    ipTools: {
      title: 'IP工具',
      lookup: 'IP查询',
      reverse: 'IP反查',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      ipRequired: '请输入IP地址',
      domain: '域名',
      domainPlaceholder: '请输入域名',
      domainRequired: '请输入域名',
      lookupResult: '查询结果',
      reverseResult: '反查结果',
      country: '国家',
      region: '地区',
      city: '城市',
      isp: '网络服务商',
      asn: 'ASN',
      location: '地理位置',
      timezone: '时区',
      copy: '复制',
      copied: '已复制到剪贴板',
      lookupError: 'IP查询失败',
      reverseError: 'IP反查失败'
    }
  },
  color: {
    title: '颜色转换',
    operation: '操作',
    picker: '颜色选择器',
    converter: '颜色格式转换',
    pickColor: '选择颜色',
    hex: 'HEX',
    hexPlaceholder: 'HEX颜色值',
    rgb: 'RGB',
    rgbPlaceholder: 'RGB颜色值',
    hsl: 'HSL',
    hslPlaceholder: 'HSL颜色值',
    input: '输入',
    inputPlaceholder: '请输入颜色值',
    fromFormat: '从',
    toFormat: '到',
    formatPlaceholder: '请选择颜色格式',
    output: '输出',
    outputPlaceholder: '转换结果将显示在这里',
    convert: '转换',
    copy: '复制',
    copied: '已复制到剪贴板',
    inputRequired: '请输入颜色值',
    invalidInput: '无效的颜色值'
  },
  regex: {
    title: '正则表达式工具',
    pattern: '正则表达式',
    patternPlaceholder: '请输入正则表达式',
    flags: '标志',
    testString: '测试文本',
    testStringPlaceholder: '请输入要测试的文本',
    test: '测试',
    generate: '生成',
    result: '结果',
    resultPlaceholder: '测试结果将显示在这里',
    copy: '复制',
    copied: '已复制到剪贴板',
    patternRequired: '请输入正则表达式',
    testStringRequired: '请输入要测试的文本',
    noMatch: '没有匹配项',
    generated: '生成的正则表达式：{pattern}'
  },
  markdown: {
    title: 'Markdown转HTML',
    input: '输入',
    inputPlaceholder: '请输入Markdown文本',
    convert: '转换',
    copy: '复制',
    preview: '预览',
    output: '输出',
    outputPlaceholder: 'HTML代码将显示在这里',
    copied: '已复制到剪贴板',
    inputRequired: '请输入Markdown文本'
  }
} 