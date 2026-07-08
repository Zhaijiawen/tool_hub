import { ref } from 'vue'

const CONSENT_KEY = 'toolhub_cookie_consent'

// 模块级共享状态，跨组件同步
const consentValue = ref(loadConsent())
const adsAllowed = ref(consentValue.value === 'all')

function loadConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) || null
  } catch {
    return null
  }
}

/**
 * Cookie 同意管理
 * consent 取值：null（未响应）| 'all'（全部接受，含广告）| 'necessary'（仅必要，无广告）
 *
 * 广告策略：
 *   - 'all'      → 允许加载 Adsterra 广告
 *   - 'necessary'→ 不加载任何广告（仅功能性 Cookie）
 *   - null       → 未响应，不加载广告；30s 后自动执行 necessary-only
 */
export function useCookieConsent() {
  // 是否已做过选择
  const hasResponded = ref(consentValue.value !== null)
  // 是否接受了全部 cookie（含广告）
  const acceptedAll = ref(consentValue.value === 'all')

  /**
   * 接受全部 cookie → 允许展示广告
   */
  function acceptAll() {
    consentValue.value = 'all'
    hasResponded.value = true
    acceptedAll.value = true
    adsAllowed.value = true
    try {
      localStorage.setItem(CONSENT_KEY, 'all')
    } catch {}
  }

  /**
   * 仅接受必要 cookie → 不加载广告
   */
  function acceptNecessary() {
    consentValue.value = 'necessary'
    hasResponded.value = true
    acceptedAll.value = false
    adsAllowed.value = false
    try {
      localStorage.setItem(CONSENT_KEY, 'necessary')
    } catch {}
  }

  return {
    hasResponded,
    acceptedAll,
    /** 是否允许展示广告（模块级共享状态，useAds 会读取） */
    adsAllowed,
    acceptAll,
    acceptNecessary
  }
}
