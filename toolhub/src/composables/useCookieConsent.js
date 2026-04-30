import { ref } from 'vue'

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
 * 调用 Consent Mode v2 的 gtag update，通知 AdSense 更新同意状态
 * AdSense 脚本已静态加载，此处仅更新 consent 信号
 * @param {boolean} granted - true = 全部允许；false = 仅功能性（NPA 模式）
 */
function updateConsentMode(granted) {
  try {
    if (typeof window.gtag === 'function') {
      if (granted) {
        // accept-all：个性化广告完全开启
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted',
          'ad_personalization': 'granted',
          'ad_user_data': 'granted'
        })
      } else {
        // necessary-only：保持 denied，AdSense 展示非个性化广告（NPA），完全合规
        window.gtag('consent', 'update', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied',
          'ad_personalization': 'denied',
          'ad_user_data': 'denied'
        })
      }
    }
  } catch {
    // gtag 不可用时静默失败，不影响页面运行
  }
}

/**
 * Cookie 同意管理
 * consent 取值：null（未响应）| 'all'（全部接受）| 'necessary'（仅必要）
 *
 * AdSense 广告策略（基于 Consent Mode v2）：
 *   - 'all'      → gtag update granted → 个性化广告（收益最高）
 *   - 'necessary'→ gtag update denied  → 非个性化广告 NPA（基于内容，不跟踪用户）
 *   - null       → 默认 denied（index.html 中已声明），等待用户响应
 */
export function useCookieConsent() {
  // 是否已做过选择
  const hasResponded = ref(consentValue.value !== null)
  // 是否接受了全部 cookie（含广告/分析）
  const acceptedAll = ref(consentValue.value === 'all')

  /**
   * 接受全部 cookie → Consent Mode update granted → 个性化广告
   */
  function acceptAll() {
    consentValue.value = 'all'
    hasResponded.value = true
    acceptedAll.value = true
    try {
      localStorage.setItem(CONSENT_KEY, 'all')
    } catch {}
    updateConsentMode(true)
  }

  /**
   * 仅接受必要 cookie → Consent Mode 保持 denied → NPA 非个性化广告
   * 非个性化广告基于页面内容定向，不需要用户跟踪 Cookie，符合 GDPR
   */
  function acceptNecessary() {
    consentValue.value = 'necessary'
    hasResponded.value = true
    acceptedAll.value = false
    try {
      localStorage.setItem(CONSENT_KEY, 'necessary')
    } catch {}
    updateConsentMode(false)
  }

  // 页面加载时，若用户之前已选择，立即恢复同意状态
  // （AdSense 脚本静态加载，wait_for_update: 2000 会等待此处更新）
  if (consentValue.value === 'all') {
    updateConsentMode(true)
  }
  // necessary 时无需 update，默认 denied 即可

  return {
    hasResponded,
    acceptedAll,
    acceptAll,
    acceptNecessary
  }
}

