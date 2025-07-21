// 服务条款相关文本 - 避免i18n转义问题
export const termsText = {
  'zh-CN': {
    title: '服务条款',
    seo: {
      title: '服务条款 - ToolHub',
      description: 'ToolHub 服务条款，了解使用我们服务时的权利和义务。',
      keywords: '服务条款,服务协议,用户协议,ToolHub'
    },
    lastUpdated: '最后更新时间：2024年1月15日',
    agreement: '通过访问和使用本网站，您同意遵守以下服务条款。如果您不同意这些条款，请停止使用本服务。',
    service: {
      title: '服务说明',
      description: 'ToolHub 提供在线开发工具集合，包括但不限于格式化、加密、转换等功能。',
      availability: '我们努力确保服务的可用性，但不保证服务不会中断。',
      changes: '我们保留随时修改或终止服务的权利。'
    },
    usage: {
      title: '使用规范',
      lawful: '遵守当地法律法规和本服务条款',
      responsible: '负责任地使用服务，不得用于非法目的',
      interference: '不得干扰或破坏服务的正常运行',
      security: '不得尝试未经授权访问系统或数据',
      content: '不得上传或传播有害、违法或不当内容'
    },
    intellectual: {
      title: '知识产权',
      ownership: 'ToolHub 及其内容的知识产权归我们所有',
      license: '我们授予您有限的、非独占的使用许可',
      restrictions: '未经许可，不得复制、分发或修改我们的内容',
      userContent: '您保留对您上传内容的所有权'
    },
    liability: {
      title: '责任限制',
      disclaimer: '本服务按"现状"提供，不提供任何明示或暗示的保证',
      damages: '我们不对因使用服务而产生的任何直接或间接损失承担责任',
      maximum: '我们的责任限于您实际支付的费用金额'
    },
    privacy: {
      title: '7. 隐私保护',
      intro: '我们高度重视您的隐私保护：',
      policy: '我们遵循严格的隐私政策保护您的个人信息',
      data: '您的数据安全是我们的首要任务',
      policyLink: '隐私政策'
    },
    changes: {
      title: '8. 条款变更',
      description: '我们可能会根据法律要求、业务发展或服务改进需要更新这些服务条款。对于重大变更，我们会在网站上发布通知。',
      acceptance: '继续使用本服务意味着您接受更新后的条款。'
    },
    contact: {
      title: '9. 联系我们',
      intro: '如果您对这些服务条款有任何疑问或建议，请联系我们：',
      email: '邮箱：terms@toolhub.com',
      response: '我们会在收到消息后尽快回复您。'
    }
  },
  'en-US': {
    title: 'Terms of Service',
    seo: {
      title: 'Terms of Service - ToolHub',
      description: 'ToolHub Terms of Service, understand your rights and obligations when using our service.',
      keywords: 'terms of service,service agreement,user agreement,ToolHub'
    },
    lastUpdated: 'Last updated: January 15, 2024',
    agreement: 'By accessing and using this website, you agree to abide by the following terms of service. If you do not agree to these terms, please stop using this service.',
    service: {
      title: 'Service Description',
      description: 'ToolHub provides an online collection of development tools, including but not limited to formatting, encryption, conversion and other functions.',
      availability: 'We strive to ensure service availability, but do not guarantee that the service will not be interrupted.',
      changes: 'We reserve the right to modify or terminate the service at any time.'
    },
    usage: {
      title: 'Usage Guidelines',
      lawful: 'Comply with local laws and regulations and these terms of service',
      responsible: 'Use the service responsibly and not for illegal purposes',
      interference: 'Do not interfere with or disrupt the normal operation of the service',
      security: 'Do not attempt unauthorized access to systems or data',
      content: 'Do not upload or disseminate harmful, illegal or inappropriate content'
    },
    intellectual: {
      title: 'Intellectual Property',
      ownership: 'The intellectual property of ToolHub and its content belongs to us',
      license: 'We grant you a limited, non-exclusive license to use',
      restrictions: 'Without permission, you may not copy, distribute or modify our content',
      userContent: 'You retain ownership of the content you upload'
    },
    liability: {
      title: 'Liability Limitations',
      disclaimer: 'This service is provided "as is" without any express or implied warranties',
      damages: 'We are not responsible for any direct or indirect losses arising from the use of the service',
      maximum: 'Our liability is limited to the amount you actually paid'
    },
    privacy: {
      title: '7. Privacy Protection',
      intro: 'We highly value your privacy protection:',
      policy: 'We follow strict privacy policies to protect your personal information',
      data: 'Your data security is our top priority',
      policyLink: 'Privacy Policy'
    },
    changes: {
      title: '8. Terms Changes',
      description: 'We may update these terms of service according to legal requirements, business development or service improvement needs. For major changes, we will post notices on the website.',
      acceptance: 'Continuing to use this service means you accept the updated terms.'
    },
    contact: {
      title: '9. Contact Us',
      intro: 'If you have any questions or suggestions about these terms of service, please contact us:',
      email: 'Email: terms@toolhub.com',
      response: 'We will respond to your message as soon as possible.'
    }
  }
}

export const getTermsText = (key, locale = 'zh-CN') => {
  const texts = termsText[locale] || termsText['zh-CN']
  return key.split('.').reduce((obj, k) => obj?.[k], texts) || key
} 