// 隐私政策相关文本 - 避免i18n转义问题
export const privacyText = {
  'zh-CN': {
    title: '隐私政策',
    seo: {
      title: '隐私政策 - ToolHub 开发者工具箱',
      description: 'ToolHub 隐私政策：了解我们如何收集、使用和保护您的数据。ToolHub 采用浏览器本地计算架构，敏感数据不上传服务器，您的隐私始终受到保护。',
      keywords: '隐私政策,数据保护,个人信息,Cookie 政策,ToolHub,GDPR'
    },
    lastUpdated: '最后更新时间：2025年7月21日',
    intro: 'ToolHub（以下简称"我们"或"本平台"）非常重视用户的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的信息，以及您所享有的隐私权利。请在使用 ToolHub 之前仔细阅读本政策。如您继续使用本平台，即表示您理解并接受本政策的内容。',
    collection: {
      title: '一、我们收集哪些信息',
      intro: '我们收集的信息分为以下几类，目的是为您提供更好的服务体验并维护平台的正常运行：',
      usage: {
        title: '使用统计数据',
        desc: '我们通过 Google Analytics 收集匿名的使用数据，包括页面访问量、工具使用频率、停留时长、来源地区等聚合信息。这些数据不包含任何可识别个人身份的信息，仅用于了解用户行为以改进产品功能和用户体验。您可以通过浏览器的"请勿追踪"设置或 Google Analytics 的退出插件来拒绝此类数据收集。'
      },
      technical: {
        title: '技术信息',
        desc: '当您访问 ToolHub 时，我们的服务器会自动记录基础技术信息，包括您的 IP 地址（用于地理区域统计和安全防护）、浏览器类型和版本、操作系统类型、请求时间和响应状态等。这些信息存储于服务器日志中，保留周期不超过 30 天，仅用于技术故障排查和安全审计，不用于个人识别。'
      },
      cookies: {
        title: 'Cookie 与本地存储',
        desc: '我们使用以下类型的 Cookie 和本地存储：（1）必要性 Cookie：用于记录您的语言偏好（中文/英文）和界面主题（明亮/暗色）设置，这类 Cookie 是平台正常运行所必需的，无法关闭；（2）分析性 Cookie：在您通过页面底部 Cookie 同意横幅明确授权后，我们才会启用 Google Analytics 统计 Cookie；（3）广告性 Cookie：在您明确同意后，我们会加载 Adsterra 广告服务，该服务会设置第三方广告追踪 Cookie，用于根据您的浏览历史展示个性化广告。您可以随时通过 Cookie 设置面板撤回对分析和广告 Cookie 的授权。'
      }
    },
    usage: {
      title: '二、我们如何使用您的信息',
      intro: '我们承诺仅将收集的信息用于以下明确的目的：',
      service: {
        title: '提供和维护服务',
        desc: '使用技术信息确保平台正常运行，处理您的请求，并在出现故障时进行诊断和修复。'
      },
      improvement: {
        title: '持续改进产品',
        desc: '基于匿名使用统计数据分析用户行为模式，了解哪些工具最受欢迎、哪些功能需要优化，从而有针对性地改进产品。'
      },
      security: {
        title: '安全防护',
        desc: '识别并防范异常访问、DDoS 攻击、爬虫滥用等安全威胁，保护平台和所有用户的正常使用体验。'
      }
    },
    sharing: {
      title: '三、信息共享与披露',
      intro: '我们不会出售、租借或以商业目的向第三方披露您的个人信息。以下情况除外：',
      legal: '法律合规：当法律法规要求、法院命令或政府主管机构依法要求时，我们可能需要披露必要的信息',
      service: '服务提供商：我们使用 Google Analytics（分析）和 Adsterra（广告）等第三方服务。这些服务商依据其各自的隐私政策处理数据，我们建议您查阅其隐私政策了解详情',
      consent: '用户授权：在获得您明确同意的情况下，与您指定的第三方共享相关信息',
      disclaimer: '以上第三方服务商拥有独立的数据处理规则和隐私政策，我们无法控制其行为。如您对此有所顾虑，可选择通过 Cookie 设置面板关闭对分析和广告服务的授权。'
    },
    security: {
      title: '四、数据安全',
      measures: '我们采取多层次的技术和管理措施来保护您的信息安全：',
      encryption: 'HTTPS 全站加密传输：所有数据在浏览器与服务器之间的传输均通过 TLS 协议加密，防止中间人攻击',
      access: '服务器访问控制：生产服务器仅允许授权人员访问，定期进行安全审计',
      monitoring: '实时安全监控：通过 Cloudflare 等服务对异常流量进行实时监测和过滤',
      updates: '定期安全更新：及时更新服务器软件和依赖库，修复已知安全漏洞'
    },
    clientSide: {
      title: '五、客户端计算承诺',
      desc: '这是 ToolHub 最核心的隐私保护措施：所有工具（加密、格式化、图片处理、文本转换等）均完全在您的浏览器内执行计算，无需将数据发送到我们的服务器。这意味着：您输入的密码、密钥、私人文本、代码片段、图片等内容，永远不会离开您的设备。这不仅是一个政策声明，更是我们产品架构的技术现实。'
    },
    rights: {
      title: '六、您的隐私权利',
      access: '知情权与访问权：您有权了解我们收集了哪些关于您的信息，并可请求获取您的数据副本',
      correction: '更正权：如发现我们持有的信息不准确，您有权要求我们更正',
      deletion: '删除权（被遗忘权）：您可以要求我们删除与您相关的个人数据，我们将在合理期限内完成',
      portability: '数据可携带权：您有权以结构化、通用格式获取您的个人数据',
      contact: '撤回同意权：您可以随时通过 Cookie 设置面板撤回对分析和广告 Cookie 的授权，撤回不影响此前基于授权的数据处理'
    },
    contact: {
      title: '七、联系我们',
      intro: '如果您对本隐私政策有任何疑问，或需要行使上述任何权利，请通过以下方式联系我们：',
      email: '邮箱：pinkmaaaaan03@2925.com',
      response: '我们承诺在收到您的请求后 30 个工作日内给予回复。对于涉及数据删除或访问的请求，我们可能需要核实您的身份以确保数据安全。'
    },
    updates: {
      title: '八、政策更新',
      description: '随着法律法规的变化或产品功能的迭代，我们可能会不定期更新本隐私政策。对于涉及您权利的重大变更，我们将在网站显著位置发布通知，并在政策顶部标注最新更新日期。我们建议您定期访问本页面以了解最新隐私政策。继续使用 ToolHub 即表示您接受更新后的政策。'
    }
  },
  'en-US': {
    title: 'Privacy Policy',
    seo: {
      title: 'Privacy Policy - ToolHub Developer Toolbox',
      description: 'ToolHub Privacy Policy: Learn how we collect, use, and protect your data. ToolHub uses a browser-local computation architecture — sensitive data is never uploaded to our servers, ensuring your privacy is always protected.',
      keywords: 'privacy policy,data protection,personal information,cookie policy,ToolHub,GDPR'
    },
    lastUpdated: 'Last updated: July 21, 2025',
    intro: 'ToolHub ("we", "us", or "the Platform") takes user privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your information, and the privacy rights you hold. Please read this policy carefully before using ToolHub. By continuing to use our platform, you acknowledge that you have read and understood this policy.',
    collection: {
      title: '1. What Information We Collect',
      intro: 'We collect the following categories of information to provide a better experience and maintain normal platform operation:',
      usage: {
        title: 'Usage Analytics',
        desc: 'We use Google Analytics to collect anonymous usage data, including page views, tool usage frequency, session duration, and geographic region aggregates. This data contains no personally identifiable information and is used solely to understand user behavior in order to improve product features and user experience. You can opt out via your browser\'s "Do Not Track" setting or the Google Analytics opt-out browser add-on.'
      },
      technical: {
        title: 'Technical Information',
        desc: 'When you visit ToolHub, our servers automatically log basic technical information including your IP address (used for geographic statistics and security protection), browser type and version, operating system, request timestamp, and HTTP response status. This information is stored in server logs for no more than 30 days and is used only for technical troubleshooting and security audits — not for personal identification.'
      },
      cookies: {
        title: 'Cookies & Local Storage',
        desc: 'We use the following types of cookies and local storage: (1) Necessary Cookies: used to remember your language preference (English/Chinese) and theme setting (light/dark); these are required for the platform to function and cannot be disabled; (2) Analytics Cookies: only enabled after you explicitly consent via the cookie banner at the bottom of the page; (3) Advertising Cookies: after your explicit consent, we load Adsterra, which sets third-party advertising tracking cookies to display personalized ads based on your browsing history. You may withdraw consent for analytics and advertising cookies at any time via the Cookie Settings panel.'
      }
    },
    usage: {
      title: '2. How We Use Your Information',
      intro: 'We commit to using collected information only for the following clearly defined purposes:',
      service: {
        title: 'Service Provision and Maintenance',
        desc: 'Using technical information to ensure platform reliability, process your requests, and diagnose and resolve failures when they occur.'
      },
      improvement: {
        title: 'Continuous Product Improvement',
        desc: 'Analyzing anonymous usage statistics to understand user behavior patterns — identifying which tools are most popular and which features need refinement — to drive targeted improvements.'
      },
      security: {
        title: 'Security Protection',
        desc: 'Identifying and defending against abnormal access, DDoS attacks, crawler abuse, and other security threats to protect the platform and all users\' normal usage experience.'
      }
    },
    sharing: {
      title: '3. Information Sharing & Disclosure',
      intro: 'We do not sell, rent, or disclose your personal information to third parties for commercial purposes. Exceptions include:',
      legal: 'Legal compliance: when required by applicable laws, court orders, or government authorities, we may be required to disclose necessary information',
      service: 'Service providers: we use third-party services including Google Analytics (analytics) and Adsterra (advertising). These providers process data according to their own privacy policies',
      consent: 'User authorization: sharing relevant information with third parties you specifically designate, with your explicit consent',
      disclaimer: 'The above third-party service providers have their own independent data processing rules and privacy policies that we cannot control. If you have concerns, you can disable authorization for analytics and advertising services through the Cookie Settings panel at any time.'
    },
    security: {
      title: '4. Data Security',
      measures: 'We implement multi-layered technical and administrative measures to protect the security of your information:',
      encryption: 'HTTPS full-site encrypted transmission: all data transmitted between your browser and our servers is encrypted via TLS protocol, preventing man-in-the-middle attacks',
      access: 'Server access control: production servers are accessible only to authorized personnel, with regular security audits conducted',
      monitoring: 'Real-time security monitoring: abnormal traffic is monitored and filtered in real time through services such as Cloudflare',
      updates: 'Regular security updates: server software and dependencies are updated promptly to patch known security vulnerabilities'
    },
    clientSide: {
      title: '5. Client-Side Computation Commitment',
      desc: 'This is ToolHub\'s most fundamental privacy protection measure: all tools (encryption, formatting, image processing, text conversion, etc.) perform their computations entirely within your browser without sending data to our servers. This means passwords, keys, private text, code snippets, images, and any other content you input never leave your device. This is not just a policy statement — it is a technical reality built into our product architecture.'
    },
    rights: {
      title: '6. Your Privacy Rights',
      access: 'Right to know and access: you have the right to know what information we hold about you and can request a copy of your data',
      correction: 'Right to rectification: if you find that information we hold is inaccurate, you have the right to request correction',
      deletion: 'Right to erasure (right to be forgotten): you may request deletion of personal data related to you, which we will complete within a reasonable timeframe',
      portability: 'Right to data portability: you have the right to receive your personal data in a structured, commonly used format',
      contact: 'Right to withdraw consent: you may withdraw consent for analytics and advertising cookies at any time via the Cookie Settings panel; withdrawal does not affect prior processing based on consent'
    },
    contact: {
      title: '7. Contact Us',
      intro: 'If you have any questions about this Privacy Policy or need to exercise any of the rights described above, please contact us at:',
      email: 'Email: pinkmaaaaan03@2925.com',
      response: 'We commit to responding to your request within 30 business days of receipt. For requests involving data deletion or access, we may need to verify your identity to ensure data security.'
    },
    updates: {
      title: '8. Policy Updates',
      description: 'We may update this Privacy Policy from time to time as laws and regulations change or product features evolve. For significant changes affecting your rights, we will post a prominent notice on our website and update the "Last updated" date at the top of this policy. We recommend visiting this page periodically to stay informed of the latest version. Continued use of ToolHub following an update constitutes acceptance of the revised policy.'
    }
  }
}

export const getPrivacyText = (key, locale = 'zh-CN') => {
  // 支持多种中文 locale 格式
  const isChinese = locale === 'zh-CN' || locale === 'zh' || locale.startsWith('zh')
  const texts = isChinese ? privacyText['zh-CN'] : privacyText['en-US']
  return key.split('.').reduce((obj, k) => obj?.[k], texts) || key
} 