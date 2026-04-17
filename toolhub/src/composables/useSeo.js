import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {defaultSeo, seoConfig} from '@/locales/seo'

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

  // 首页专属 SEO 配置
  const homeSeo = {
    en: {
      title: 'ToolHub — Developer Tools, All in One Place | Free Online Toolbox',
      description: 'ToolHub is a free online developer toolbox: JSON/XML/YAML formatter, AES/RSA encryption, Base64/URL codec, timestamp converter, QR code generator, image tools and more. No registration, runs locally in your browser.',
      keywords: 'developer tools, online toolbox, json formatter, xml formatter, yaml formatter, aes encryption, rsa encryption, base64 encoder, url encoder, timestamp converter, qr code generator, image converter, code formatter, free tools'
    },
    zh: {
      title: 'ToolHub — 开发者工具，一站搞定 | 免费在线工具箱',
      description: 'ToolHub 是面向开发者的免费在线工具箱：JSON/XML/YAML 格式化、AES/RSA 加密解密、Base64/URL 编解码、时间戳转换、二维码生成、图片处理等 60+ 工具，无需注册，数据本地处理，安全可靠。',
      keywords: '开发者工具,在线工具箱,JSON格式化,XML格式化,YAML格式化,AES加密,RSA加密,Base64编码,URL编码,时间戳转换,二维码生成,图片工具,代码格式化,免费工具'
    }
  }

  // 获取当前工具信息
  const currentTool = computed(() => {
    // 首页路径（/）单独处理，不匹配工具路由
    if (route.path === '/') return null

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

  // 是否当前为首页
  const isHomePage = computed(() => route.path === '/')

  // 生成页面标题
  const pageTitle = computed(() => {
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    if (isHomePage.value) return homeSeo[lang].title
    if (!currentTool.value) return defaultSeo[lang].title
    const { details } = currentTool.value
    return `${details.name} - ToolHub`
  })

  // 生成页面描述
  const pageDescription = computed(() => {
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    if (isHomePage.value) return homeSeo[lang].description
    if (!currentTool.value) return defaultSeo[lang].description
    const { details } = currentTool.value
    return details.description || 'Professional online tool for developers'
  })

  // 生成关键词
  const pageKeywords = computed(() => {
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    if (isHomePage.value) return homeSeo[lang].keywords
    if (!currentTool.value) return defaultSeo[lang].keywords
    const { details } = currentTool.value
    return details.keywords ? details.keywords.join(', ') : 'online tool, developer tool'
  })

  // 生成结构化数据
  const structuredData = computed(() => {
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    if (!currentTool.value) {
      // 首页使用 WebSite 类型，对 SEO 更有利
      if (isHomePage.value) {
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ToolHub",
          "url": "https://toolhub.studio",
          "description": homeSeo[lang].description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://toolhub.studio/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "author": {
            "@type": "Organization",
            "name": "ToolHub",
            "url": "https://toolhub.studio"
          }
        }
      }
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