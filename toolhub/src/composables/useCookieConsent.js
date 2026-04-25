import {ref} from 'vue'

const CONSENT_KEY = 'toolhub_cookie_consent'
const ADSENSE_CLIENT = 'ca-pub-8381147251053054'

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
 *
 * AdSense 广告策略：
 *   - 'all'      → 个性化广告（默认，收益最高）
 *   - 'necessary'→ 非个性化广告 NPA（基于页面内容，不跟踪用户，合规且仍有收益）
 *   - null       → 不注入，等待用户响应
 */
export function useCookieConsent() {
  // 是否已做过选择
  const hasResponded = ref(consentValue.value !== null)
  // 是否接受了全部 cookie（含广告/分析）
  const acceptedAll = ref(consentValue.value === 'all')

  /**
   * 接受全部 cookie → 注入个性化广告
   */
  function acceptAll() {
    consentValue.value = 'all'
    hasResponded.value = true
    acceptedAll.value = true
    try {
      localStorage.setItem(CONSENT_KEY, 'all')
    } catch {}
    injectAdSense(false)
  }

  /**
   * 仅接受必要 cookie → 注入非个性化广告（NPA），不跟踪用户
   * 非个性化广告基于页面内容定向，不需要用户跟踪 Cookie，符合 GDPR
   */
  function acceptNecessary() {
    consentValue.value = 'necessary'
    hasResponded.value = true
    acceptedAll.value = false
    try {
      localStorage.setItem(CONSENT_KEY, 'necessary')
    } catch {}
    injectAdSense(true)
  }

  /**
   * 动态注入 Google AdSense 脚本
   * @param {boolean} nonPersonalized - true 则设置 NPA 模式（不跟踪用户）
   */
  function injectAdSense(nonPersonalized = false) {
    // 脚本已注入则跳过，避免重复加载或重复触发广告请求
    if (document.getElementById('toolhub-adsense-script')) return

    // NPA 模式：在 URL 追加 npa=1 参数，AdSense 脚本加载时即以非个性化模式初始化
    // 不向队列 push 任何命令，避免被误判为广告请求触发 TagError
    const npaParam = nonPersonalized ? '&npa=1' : ''

    const script = document.createElement('script')
    script.id = 'toolhub-adsense-script'
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}${npaParam}`
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
  }

  // 页面加载时，根据已存储的同意状态自动注入
  if (consentValue.value === 'all') {
    injectAdSense(false)
  } else if (consentValue.value === 'necessary') {
    injectAdSense(true)
  }

  return {
    hasResponded,
    acceptedAll,
    acceptAll,
    acceptNecessary
  }
}

