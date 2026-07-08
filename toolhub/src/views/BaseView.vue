<template>
  <!-- 工具视图容器 -->
  <div class="tool-view">
    <router-view></router-view>

    <div
      v-if="shouldShowAds"
      class="ad-banner-wrapper"
    >
      <span class="ad-banner-placeholder">{{ $t('ads.sponsored') }}</span>
      <div
        ref="bannerContainerRef"
        class="ad-banner-container"
        :class="{ 'banner-large': currentBannerSize === 'large', 'banner-small': currentBannerSize === 'small' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import { useAds } from '@/composables/useAds'

// 初始化路由
const router = useRouter()
const route = useRoute()

// SEO优化
const { updatePageMeta } = useSeo()

// 广告管理 — Banner
const { shouldShowAds, currentBannerSize, getBannerConfig, injectBannerIntoContainer } = useAds()

// Banner 容器 DOM 引用
const bannerContainerRef = ref(null)

// 当前挂载的 banner 清理函数
let bannerCleanup = null

// 挂载/更新 Banner 广告
function mountBanner() {
  if (!shouldShowAds.value || !bannerContainerRef.value) return

  // 先清理旧广告
  if (bannerCleanup) {
    bannerCleanup()
    bannerCleanup = null
  }

  const config = getBannerConfig()
  bannerCleanup = injectBannerIntoContainer(bannerContainerRef.value, config)
}

// 响应式切换：窗口大小变化导致 banner 尺寸切换时重新挂载
watch(currentBannerSize, () => {
  nextTick(mountBanner)
})

// 路由变化时重新挂载
watch(() => route.path, () => {
  nextTick(mountBanner)
})

onMounted(() => {
  nextTick(mountBanner)
})

onUnmounted(() => {
  if (bannerCleanup) {
    bannerCleanup()
    bannerCleanup = null
  }
})

// 监听路由变化，更新页面元数据
watch(() => route.path, () => {
  nextTick(() => {
    updatePageMeta()
  })
}, { immediate: true })
</script>

<style scoped>
/* 工具视图容器样式 */
.tool-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ====================== Adsterra Banner 广告 ====================== */
.ad-banner-wrapper {
  margin: 24px auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ad-banner-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  color: var(--text-color-3);
  pointer-events: none;
  z-index: 0;
}

.ad-banner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.banner-large {
  min-height: 90px;
  max-width: 728px;
  width: 100%;
}

.banner-small {
  min-height: 50px;
  max-width: 320px;
  width: 100%;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .tool-view {
    padding: 12px;
  }

  .ad-banner-wrapper {
    margin: 16px auto;
  }
}

@media (max-width: 480px) {
  .tool-view {
    padding: 8px;
  }

  .ad-banner-wrapper {
    margin: 12px auto;
  }
}
</style>