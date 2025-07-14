import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export function useSeo() {
  const { t, locale } = useI18n()
  const route = useRoute()

  const updateSeoTags = (customTitle = '', customDescription = '') => {
    const title = customTitle || t('seo.title')
    const description = customDescription || t('seo.description')
    const keywords = t('seo.keywords')
    const ogTitle = t('seo.ogTitle')
    const ogDescription = t('seo.ogDescription')
    const twitterTitle = t('seo.twitterTitle')
    const twitterDescription = t('seo.twitterDescription')
    const schemaName = t('seo.schemaName')
    const schemaDescription = t('seo.schemaDescription')
    const schemaAuthor = t('seo.schemaAuthor')

    // 更新页面标题
    document.title = title

    // 更新或创建 meta 标签
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // 更新 canonical URL
    const updateCanonicalUrl = () => {
      const baseUrl = 'https://toolhub.studio'
      const canonicalUrl = baseUrl + route.path
      
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', canonicalUrl)
    }

    // 判断是否为中文
    const isChinese = locale.value === 'zh'

    // 更新基础 SEO 标签
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('language', isChinese ? 'zh-CN' : 'en-US')

    // 更新 Open Graph 标签
    updateMetaTag('og:title', ogTitle, true)
    updateMetaTag('og:description', ogDescription, true)
    updateMetaTag('og:locale', isChinese ? 'zh_CN' : 'en_US', true)

    // 更新 Twitter Card 标签
    updateMetaTag('twitter:title', twitterTitle)
    updateMetaTag('twitter:description', twitterDescription)

    // 更新 canonical URL (已有静态canonical，注释避免冲突)
    // updateCanonicalUrl()

    // 更新结构化数据
    updateStructuredData(schemaName, schemaDescription, schemaAuthor)

    // 更新 HTML lang 属性
    document.documentElement.lang = isChinese ? 'zh' : 'en'
  }

  const updateStructuredData = (name, description, author) => {
    let script = document.querySelector('script[type="application/ld+json"]')
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": name,
      "description": description,
      "url": "https://toolhub.studio",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": author
      }
    }

    script.textContent = JSON.stringify(structuredData, null, 2)
  }

  return {
    updateSeoTags
  }
} 