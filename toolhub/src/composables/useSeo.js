import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { seoConfig, defaultSeo } from '@/locales/seo'

export function useSeo() {
  const route = useRoute()
  const { t, locale } = useI18n()

  // 根据当前语言获取工具详细信息
  const toolDetails = computed(() => {
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    const details = {}
    
    // 遍历所有工具配置，根据语言返回对应内容
    Object.keys(seoConfig).forEach(toolKey => {
      const toolConfig = seoConfig[toolKey]
      if (toolConfig && toolConfig[lang]) {
        details[toolKey] = toolConfig[lang]
      }
    })
    
    return details
  })

  // 获取当前工具信息
  const currentTool = computed(() => {
    const pathParts = route.path.split('/')
    if (pathParts.length >= 3) {
      const category = pathParts[1]
      const tool = pathParts[2]
      return {
        category,
        tool,
        details: toolDetails.value[tool] || {}
      }
    }
    return null
  })

  // 生成页面标题
  const pageTitle = computed(() => {
    if (!currentTool.value) {
      const lang = locale.value === 'zh' ? 'zh' : 'en'
      return defaultSeo[lang].title
    }
    const { details } = currentTool.value
    return `${details.name} - ToolHub`
  })

  // 生成页面描述
  const pageDescription = computed(() => {
    if (!currentTool.value) {
      const lang = locale.value === 'zh' ? 'zh' : 'en'
      return defaultSeo[lang].description
    }
    const { details } = currentTool.value
    return details.description || 'Professional online tool for developers'
  })

  // 生成关键词
  const pageKeywords = computed(() => {
    if (!currentTool.value) {
      const lang = locale.value === 'zh' ? 'zh' : 'en'
      return defaultSeo[lang].keywords
    }
    const { details } = currentTool.value
    return details.keywords ? details.keywords.join(', ') : 'online tool, developer tool'
  })

  // 生成结构化数据
  const structuredData = computed(() => {
    if (!currentTool.value) {
      const lang = locale.value === 'zh' ? 'zh' : 'en'
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ToolHub",
        "url": "https://toolhub.studio",
        "description": defaultSeo[lang].description,
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