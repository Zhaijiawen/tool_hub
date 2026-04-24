import {ref} from 'vue'

const CONSENT_KEY = 'toolhub_cookie_consent'

// 模块级共享状态，跨组件同步
const consentValue = ref(loadConsent())

function loadConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) || null
  } catch {
    return null
  }
}

/**
 * Cookie 同意管理
 * consent 取值：null（未响应）| 'all'（全部接受）| 'necessary'（仅必要）
 */
export function useCookieConsent() {
  // 是否已做过选择
  const hasResponded = ref(consentValue.value !== null)
  // 是否接受了全部 cookie（含广告/分析）
  const acceptedAll = ref(consentValue.value === 'all')

  /**
   * 接受全部 cookie（含 AdSense）
   */
  function acceptAll() {
    consentValue.value = 'all'
    hasResponded.value = true
    acceptedAll.value = true
    try {
      localStorage.setItem(CONSENT_KEY, 'all')
    } catch {}
    injectAdSense()
  }

  /**
   * 仅接受必要 cookie（不注入 AdSense）
   */
  function acceptNecessary() {
    consentValue.value = 'necessary'
    hasResponded.value = true
    acceptedAll.value = false
    try {
      localStorage.setItem(CONSENT_KEY, 'necessary')
    } catch {}
    // 不注入 AdSense
  }

  /**
   * 动态注入 Google AdSense 脚本（仅在用户同意后调用）
   */
  function injectAdSense() {
    if (document.getElementById('toolhub-adsense-script')) return
    const script = document.createElement('script')
    script.id = 'toolhub-adsense-script'
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8381147251053054'
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
  }

  // 如果用户之前已经同意全部，页面加载时自动注入
  if (consentValue.value === 'all') {
    injectAdSense()
  }

  return {
    hasResponded,
    acceptedAll,
    acceptAll,
    acceptNecessary
  }
}

