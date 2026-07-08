import { ref } from 'vue'

const CONSENT_KEY = 'toolhub_cookie_consent'

// 模块级共享状态
const consentValue = ref(loadConsent())

function loadConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) || null
  } catch {
    return null
  }
}

/**
 * Cookie 横幅管理（GDPR 合规）
 *
 * 网站使用：
 *   - 必要性 Cookie：语言/主题偏好，功能所需，无需同意
 *   - 广告：Adsterra 基于页面内容展示非个性化广告（不含追踪 Cookie，符合 GDPR 合法利益原则）
 *   - 分析 Cookie：Google Analytics，仅在用户同意后加载
 *
 * 横幅用于告知并获得分析 Cookie 的同意。广告不受同意状态影响。
 */
export function useCookieConsent() {
  const hasResponded = ref(consentValue.value !== null)
  const analyticsAllowed = ref(consentValue.value === 'all')

  function acceptAll() {
    consentValue.value = 'all'
    hasResponded.value = true
    analyticsAllowed.value = true
    try { localStorage.setItem(CONSENT_KEY, 'all') } catch {}
  }

  function acceptNecessary() {
    consentValue.value = 'necessary'
    hasResponded.value = true
    analyticsAllowed.value = false
    try { localStorage.setItem(CONSENT_KEY, 'necessary') } catch {}
  }

  return {
    hasResponded,
    analyticsAllowed,
    acceptAll,
    acceptNecessary,
  }
}
