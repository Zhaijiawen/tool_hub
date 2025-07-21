// 隐私政策相关文本 - 避免i18n转义问题
export const privacyText = {
  'zh-CN': {
    title: '隐私政策',
    seo: {
      title: '隐私政策 - ToolHub',
      description: 'ToolHub 隐私政策，了解我们如何收集、使用和保护您的个人信息。',
      keywords: '隐私政策,数据保护,个人信息,ToolHub'
    },
    lastUpdated: '最后更新时间：2024年1月15日',
    intro: 'ToolHub 致力于保护您的隐私。我们收集的信息类型包括：',
    collection: {
      title: '信息收集',
      intro: '我们收集以下类型的信息来提供和改进我们的服务：',
      usage: {
        title: '使用数据',
        desc: '我们收集您使用工具时的基本使用数据，包括工具使用频率、错误日志等，用于改进服务质量。'
      },
      technical: {
        title: '技术信息',
        desc: '浏览器类型、操作系统、IP地址等基本信息，用于确保服务正常运行。'
      },
      cookies: {
        title: 'Cookie 使用',
        desc: '我们使用必要的 Cookie 来记住您的语言偏好和主题设置。'
      }
    },
    usage: {
      title: '信息使用',
      intro: '我们使用收集的信息用于以下目的：',
      service: {
        title: '服务提供',
        desc: '使用收集的信息提供和改进我们的工具服务。'
      },
      improvement: {
        title: '服务改进',
        desc: '分析使用模式以优化用户体验和功能。'
      },
      security: {
        title: '安全保障',
        desc: '检测和防止欺诈、滥用等安全威胁。'
      }
    },
    sharing: {
      title: '信息共享',
      intro: '我们不会出售、交易或转让您的个人信息给第三方，除非：',
      legal: '法律要求或政府机构要求',
      service: '与我们的服务提供商共享必要信息',
      consent: '获得您的明确同意',
      disclaimer: '这些服务商有其自己的隐私政策，我们建议您查看相关条款。'
    },
    security: {
      title: '数据安全',
      measures: '我们采取多种安全措施保护您的信息：',
      encryption: '数据传输和存储加密',
      access: '严格的访问控制',
      monitoring: '持续的安全监控',
      updates: '定期安全更新'
    },
    rights: {
      title: '您的权利',
      access: '访问您的个人信息',
      correction: '更正不准确的信息',
      deletion: '删除您的个人信息',
      portability: '数据可携带性',
      contact: '随时联系我们处理隐私问题'
    },
    contact: {
      title: '联系我们',
      intro: '如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：',
      email: '邮箱：privacy@toolhub.com',
      response: '我们将在收到请求后30天内回复您。'
    },
    updates: {
      title: '政策更新',
      description: '我们可能会不时更新本隐私政策。对于重大变更，我们会在网站上发布通知。我们建议您定期查看本页面以获取最新信息。'
    }
  },
  'en-US': {
    title: 'Privacy Policy',
    seo: {
      title: 'Privacy Policy - ToolHub',
      description: 'ToolHub Privacy Policy, learn how we collect, use and protect your personal information.',
      keywords: 'privacy policy,data protection,personal information,ToolHub'
    },
    lastUpdated: 'Last updated: January 15, 2024',
    intro: 'ToolHub is committed to protecting your privacy. The types of information we collect include:',
    collection: {
      title: 'Information Collection',
      intro: 'We collect the following types of information to provide and improve our services:',
      usage: {
        title: 'Usage Data',
        desc: 'We collect basic usage data when you use our tools, including tool usage frequency, error logs, etc., to improve service quality.'
      },
      technical: {
        title: 'Technical Information',
        desc: 'Basic information such as browser type, operating system, IP address, etc., to ensure normal service operation.'
      },
      cookies: {
        title: 'Cookie Usage',
        desc: 'We use necessary cookies to remember your language preferences and theme settings.'
      }
    },
    usage: {
      title: 'Information Usage',
      intro: 'We use the collected information for the following purposes:',
      service: {
        title: 'Service Provision',
        desc: 'Use collected information to provide and improve our tool services.'
      },
      improvement: {
        title: 'Service Improvement',
        desc: 'Analyze usage patterns to optimize user experience and functionality.'
      },
      security: {
        title: 'Security Protection',
        desc: 'Detect and prevent security threats such as fraud and abuse.'
      }
    },
    sharing: {
      title: 'Information Sharing',
      intro: 'We do not sell, trade, or transfer your personal information to third parties, unless:',
      legal: 'Required by law or government agencies',
      service: 'Share necessary information with our service providers',
      consent: 'With your explicit consent',
      disclaimer: 'These services have their own privacy policies, and we recommend that you review the relevant terms.'
    },
    security: {
      title: 'Data Security',
      measures: 'We take various security measures to protect your information:',
      encryption: 'Data transmission and storage encryption',
      access: 'Strict access control',
      monitoring: 'Continuous security monitoring',
      updates: 'Regular security updates'
    },
    rights: {
      title: 'Your Rights',
      access: 'Access your personal information',
      correction: 'Correct inaccurate information',
      deletion: 'Delete your personal information',
      portability: 'Data portability',
      contact: 'Contact us at any time regarding privacy issues'
    },
    contact: {
      title: 'Contact Us',
      intro: 'If you have any questions about this privacy policy or need to exercise your rights, please contact us through the following ways:',
      email: 'Email: privacy@toolhub.com',
      response: 'We will respond to your request within 30 days of receipt.'
    },
    updates: {
      title: 'Policy Updates',
      description: 'We may update this privacy policy from time to time. For major changes, we will post notices on the website. We recommend that you check this page regularly for the latest information.'
    }
  }
}

export const getPrivacyText = (key, locale = 'zh-CN') => {
  // 支持多种中文 locale 格式
  const isChinese = locale === 'zh-CN' || locale === 'zh' || locale.startsWith('zh')
  const texts = isChinese ? privacyText['zh-CN'] : privacyText['en-US']
  return key.split('.').reduce((obj, k) => obj?.[k], texts) || key
} 