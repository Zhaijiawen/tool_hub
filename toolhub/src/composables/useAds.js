/**
 * Adsterra 广告管理 — 集中管理所有广告配置、脚本注入和响应式逻辑
 *
 * 广告位说明：
 *   - Social Bar: 页面底部社交栏，宽窄屏均展示
 *   - Native Banner: 右侧边栏原生广告，仅宽屏(>=1200px)展示，位于"更多学习资源"下方
 *   - Banner: 工具页内容区横幅，宽屏728×90 / 窄屏320×50
 *
 * 排除页面：首页(/)、关于(/about)、隐私(/privacy)、条款(/terms)、composer(/composer)
 *
 * 模块级状态确保多个调用者（AppLayout、BaseView）共享同一 window.resize 监听器和脚本注入状态。
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// ======================== 广告配置 ========================

export const AD_CONFIG = {
  socialBar: {
    src: 'https://pl30226912.effectivecpmnetwork.com/4f/e7/b7/4fe7b7e3004c63b56168441e3749c4dd.js',
  },
  nativeBanner: {
    src: 'https://pl30226913.effectivecpmnetwork.com/06a313d44bc7d658550e1e59ae3efdc7/invoke.js',
    containerId: 'container-06a313d44bc7d658550e1e59ae3efdc7',
  },
  banners: {
    small: {
      key: '43986cd73443ed7abb539ed63aa0c09d',
      src: 'https://www.highperformanceformat.com/43986cd73443ed7abb539ed63aa0c09d/invoke.js',
      width: 320,
      height: 50,
    },
    large: {
      key: 'ccadb856674196ed9c076616671815c5',
      src: 'https://www.highperformanceformat.com/ccadb856674196ed9c076616671815c5/invoke.js',
      width: 728,
      height: 90,
    },
  },
}

export const NATIVE_BANNER_MIN_WIDTH = 1200
export const BANNER_BREAKPOINT = 768
const AD_EXCLUDED_PATHS = ['/', '/about', '/privacy', '/terms', '/composer']

// ======================== 工具函数 ========================

function injectScript(src, attrs = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return () => {}

  const script = document.createElement('script')
  script.src = src
  if (attrs.async) script.async = true
  if (attrs.dataCfasync) script.setAttribute('data-cfasync', 'false')
  document.body.appendChild(script)

  return () => {
    if (script.parentNode) script.parentNode.removeChild(script)
  }
}

export function injectBannerIntoContainer(containerEl, bannerConfig) {
  if (!containerEl) return () => {}

  containerEl.innerHTML = ''

  const configScript = document.createElement('script')
  configScript.textContent = `atOptions={key:'${bannerConfig.key}',format:'iframe',height:${bannerConfig.height},width:${bannerConfig.width},params:{}};`
  containerEl.appendChild(configScript)

  const invokeScript = document.createElement('script')
  invokeScript.src = bannerConfig.src
  containerEl.appendChild(invokeScript)

  return () => {
    containerEl.innerHTML = ''
  }
}

// ======================== 模块级共享状态 ========================

const windowWidth = ref(window.innerWidth)
let resizeListenerCount = 0

// 脚本注入的全局防重复标志
let socialBarMounted = false
let nativeBannerCleanup = null

// ======================== Composable ========================

export function useAds() {
  const route = useRoute()

  // 广告仅在工具页展示（非首页/关于/隐私/条款），不依赖 Cookie 同意（GDPR 合法利益，非个性化广告）
  const shouldShowAds = computed(() => !AD_EXCLUDED_PATHS.includes(route.path))
  const showNativeBanner = computed(() => shouldShowAds.value && windowWidth.value >= NATIVE_BANNER_MIN_WIDTH)
  const currentBannerSize = computed(() => windowWidth.value >= BANNER_BREAKPOINT ? 'large' : 'small')
  const getBannerConfig = () => AD_CONFIG.banners[currentBannerSize.value]

  function mountSocialBar() {
    if (socialBarMounted) return
    if (!shouldShowAds.value) return
    socialBarMounted = true
    injectScript(AD_CONFIG.socialBar.src, {})
  }

  function mountNativeBanner() {
    if (!showNativeBanner.value) return
    if (nativeBannerCleanup) return
    nativeBannerCleanup = injectScript(AD_CONFIG.nativeBanner.src, { async: true, dataCfasync: true })
  }

  function unmountNativeBanner() {
    if (nativeBannerCleanup) { nativeBannerCleanup(); nativeBannerCleanup = null }
    const s = document.querySelector(`script[src="${AD_CONFIG.nativeBanner.src}"]`)
    if (s) s.remove()
  }

  function handleResize() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    if (resizeListenerCount === 0) {
      window.addEventListener('resize', handleResize)
    }
    resizeListenerCount++
    mountSocialBar()
    mountNativeBanner()
  })

  onUnmounted(() => {
    resizeListenerCount--
    if (resizeListenerCount <= 0) {
      window.removeEventListener('resize', handleResize)
      resizeListenerCount = 0
    }
  })

  // 路由变化：从首页/静态页进入工具页时注入
  watch(shouldShowAds, (show) => {
    if (show) {
      mountSocialBar()
      mountNativeBanner()
    }
  })

  // 窗口宽度变化：Native Banner 注入/移除
  watch(showNativeBanner, (show) => {
    if (show) {
      mountNativeBanner()
    } else {
      unmountNativeBanner()
    }
  })

  return {
    shouldShowAds,
    showNativeBanner,
    nativeBannerContainerId: AD_CONFIG.nativeBanner.containerId,
    currentBannerSize,
    getBannerConfig,
    injectBannerIntoContainer,
  }
}
