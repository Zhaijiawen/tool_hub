import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export function useSeo() {
  const { t, locale } = useI18n()
  const route = useRoute()

  // 缓存已创建的meta标签，避免重复DOM查询
  const metaCache = new Map()
  
  const updateSeoTags = (customTitle = '', customDescription = '') => {
    // 批量获取翻译，减少t()函数调用
    const translations = {
      title: customTitle || t('seo.title'),
      description: customDescription || t('seo.description'),
      keywords: t('seo.keywords'),
      ogTitle: t('seo.ogTitle'),
      ogDescription: t('seo.ogDescription'),
      twitterTitle: t('seo.twitterTitle'),
      twitterDescription: t('seo.twitterDescription'),
      schemaName: t('seo.schemaName'),
      schemaDescription: t('seo.schemaDescription'),
      schemaAuthor: t('seo.schemaAuthor')
    }

    // 更新页面标题
    document.title = translations.title

    // 优化的meta标签更新函数 - 使用缓存
    const updateMetaTag = (name, content, property = false) => {
      const cacheKey = property ? `prop:${name}` : `name:${name}`
      let meta = metaCache.get(cacheKey)
      
      if (!meta) {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
        meta = document.querySelector(selector)
        if (!meta) {
          meta = document.createElement('meta')
          if (property) {
            meta.setAttribute('property', name)
          } else {
            meta.setAttribute('name', name)
          }
          document.head.appendChild(meta)
        }
        metaCache.set(cacheKey, meta)
      }
      
      // 只在内容真的变化时才更新
      if (meta.getAttribute('content') !== content) {
        meta.setAttribute('content', content)
      }
    }

    // 优化的canonical URL更新 - 重新启用
    const updateCanonicalUrl = () => {
      const baseUrl = 'https://toolhub.studio'
      const canonicalUrl = baseUrl + route.path
      
      let canonical = metaCache.get('canonical')
      if (!canonical) {
        canonical = document.querySelector('link[rel="canonical"]')
        if (!canonical) {
          canonical = document.createElement('link')
          canonical.setAttribute('rel', 'canonical')
          document.head.appendChild(canonical)
        }
        metaCache.set('canonical', canonical)
      }
      
      // 只在URL真的变化时才更新
      if (canonical.getAttribute('href') !== canonicalUrl) {
        canonical.setAttribute('href', canonicalUrl)
      }
    }

    // 判断是否为中文（缓存结果）
    const isChinese = locale.value === 'zh'
    const languageCode = isChinese ? 'zh-CN' : 'en-US'
    const localeCode = isChinese ? 'zh_CN' : 'en_US'

    // 批量更新meta标签，减少DOM操作
    const metaUpdates = [
      ['description', translations.description],
      ['keywords', translations.keywords],
      ['language', languageCode],
      ['og:title', translations.ogTitle, true],
      ['og:description', translations.ogDescription, true],
      ['og:locale', localeCode, true],
      ['twitter:title', translations.twitterTitle],
      ['twitter:description', translations.twitterDescription]
    ]

    // 批量执行更新
    metaUpdates.forEach(([name, content, property = false]) => {
      updateMetaTag(name, content, property)
    })

    // 更新 canonical URL - 重新启用
    updateCanonicalUrl()

    // 优化结构化数据更新
    updateStructuredData(translations.schemaName, translations.schemaDescription, translations.schemaAuthor)

    // 只在语言真的变化时才更新HTML lang属性
    const currentLang = document.documentElement.lang
    const newLang = isChinese ? 'zh' : 'en'
    if (currentLang !== newLang) {
      document.documentElement.lang = newLang
    }
  }

  const updateStructuredData = (name, description, author) => {
    let script = metaCache.get('structured-data')
    if (!script) {
      script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      metaCache.set('structured-data', script)
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": name,
      "description": description,
      "url": "https://toolhub.studio" + route.path, // 添加当前路径
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

    const newContent = JSON.stringify(structuredData, null, 2)
    // 只在内容真的变化时才更新
    if (script.textContent !== newContent) {
      script.textContent = newContent
    }
  }

  // 清理缓存的方法（可选）
  const clearCache = () => {
    metaCache.clear()
  }

  return {
    updateSeoTags,
    clearCache
  }
} 