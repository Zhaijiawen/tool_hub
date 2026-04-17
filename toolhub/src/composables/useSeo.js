import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { seoConfig, defaultSeo } from '@/locales/seo'

export function useSeo() {
  const route = useRoute()
  const { t, locale } = useI18n()
  
  // 强制更新标题的备用方法
  const forceUpdateTitle = (newTitle) => {
    try {
      // 方法1: 直接设置document.title
      document.title = newTitle
      
      // 方法2: 更新或创建title标签
      let titleTag = document.querySelector('title')
      if (!titleTag) {
        titleTag = document.createElement('title')
        document.head.appendChild(titleTag)
      }
      titleTag.textContent = newTitle
      
      // 方法3: 使用document.head.innerHTML (谨慎使用)
      // const headContent = document.head.innerHTML
      // if (!headContent.includes(`<title>${newTitle}</title>`)) {
      //   document.head.innerHTML = headContent.replace(
      //     /<title>.*?<\/title>/,
      //     `<title>${newTitle}</title>`
      //   )
      // }
      
      // 方法4: 触发自定义事件
      window.dispatchEvent(new CustomEvent('titlechange', { 
        detail: { title: newTitle } 
      }))
      
      console.log('Title force updated:', newTitle)
    } catch (error) {
      console.error('Force update title error:', error)
    }
  }

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

  // 辅助函数：设置或创建 meta 标签
  const setMeta = (selector, attrKey, attrValue, contentValue) => {
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attrKey, attrValue)
      document.head.appendChild(el)
    }
    el.setAttribute('content', contentValue)
  }

  // 辅助函数：设置或创建 link 标签
  const setLink = (rel, href) => {
    let el = document.querySelector(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', rel)
      document.head.appendChild(el)
    }
    el.setAttribute('href', href)
  }

  // 更新页面元数据
  const updatePageMeta = () => {
    if (typeof document !== 'undefined') {
      // 延迟执行，确保DOM完全加载
      const updateMeta = () => {
        try {
          const newTitle = pageTitle.value
          const desc = pageDescription.value
          const canonicalUrl = `https://toolhub.studio${window.location.pathname}`
          
          // 更新标题
          forceUpdateTitle(newTitle)
          setTimeout(() => {
            if (document.title !== newTitle) forceUpdateTitle(newTitle)
          }, 100)
          
          // 基础 meta
          setMeta('meta[name="description"]', 'name', 'description', desc)
          setMeta('meta[name="keywords"]', 'name', 'keywords', pageKeywords.value)
          
          // canonical
          setLink('canonical', canonicalUrl)
          
          // Open Graph
          setMeta('meta[property="og:title"]', 'property', 'og:title', newTitle)
          setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
          setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
          setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
          setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'ToolHub')
          setMeta('meta[property="og:image"]', 'property', 'og:image', 'https://toolhub.studio/toolbox.svg')

          // Twitter Card
          setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary')
          setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', newTitle)
          setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)

          // 结构化数据
          let structuredDataScript = document.querySelector('script[type="application/ld+json"]')
          if (!structuredDataScript) {
            structuredDataScript = document.createElement('script')
            structuredDataScript.type = 'application/ld+json'
            document.head.appendChild(structuredDataScript)
          }
          structuredDataScript.textContent = JSON.stringify(structuredData.value)
          
        } catch (error) {
          console.error('Error updating SEO meta:', error)
        }
      }
      
      if (document.readyState === 'complete') {
        updateMeta()
      } else {
        window.addEventListener('load', updateMeta)
        setTimeout(updateMeta, 1000)
      }
    }
  }

  return {
    currentTool,
    pageTitle,
    pageDescription,
    pageKeywords,
    structuredData,
    updatePageMeta,
    forceUpdateTitle
  }
} 