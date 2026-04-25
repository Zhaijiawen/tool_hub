<template>
  <Transition name="bar-slide">
    <div v-if="!hasResponded" class="cookie-bar">
      <div class="cookie-bar-inner">

        <!-- 左侧：终端风格文案 -->
        <div class="bar-text">
          <span class="bar-prompt">$</span>
          <span class="bar-cmd">cookie-policy</span>
          <span class="bar-sep">·</span>
          <span class="bar-desc">{{ t('cookieConsent.barMessage') }}</span>
          <router-link to="/privacy" class="bar-link">{{ t('cookieConsent.privacyLink') }}</router-link>
        </div>

        <!-- 右侧：按钮 -->
        <div class="bar-actions">
          <button class="btn-necessary" @click="acceptNecessary">
            {{ t('cookieConsent.necessary') }}
          </button>
          <button class="btn-accept-all" @click="acceptAll">
            {{ t('cookieConsent.acceptAll') }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted } from 'vue'
import { useCookieConsent } from '@/composables/useCookieConsent'

const { t } = useI18n()
const { hasResponded, acceptAll, acceptNecessary } = useCookieConsent()

// 30s 无操作 → 静默执行 necessary-only（用户无感知）
let timer = null

onMounted(() => {
  if (hasResponded.value) return
  timer = setTimeout(() => {
    acceptNecessary()
  }, 30000)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
/* 底部横幅：不遮挡任何内容 */
.cookie-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background: #0d1117;
  border-top: 1px solid #30363d;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', ui-monospace, monospace;
}

.cookie-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 24px;
}

/* 左侧文案 */
.bar-text {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  font-size: 12px;
  line-height: 1.5;
}

.bar-prompt {
  color: #3fb950;
  font-weight: 700;
  flex-shrink: 0;
}

.bar-cmd {
  color: #e6edf3;
  font-weight: 600;
  flex-shrink: 0;
}

.bar-sep {
  color: #484f58;
  flex-shrink: 0;
}

.bar-desc {
  color: #8b949e;
  font-size: 11.5px;
}

.bar-link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 11.5px;
  white-space: nowrap;
  flex-shrink: 0;
}
.bar-link:hover {
  text-decoration: underline;
}

/* 右侧操作区 */
.bar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

/* 按钮 */
.btn-necessary,
.btn-accept-all {
  height: 28px;
  padding: 0 14px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  line-height: 1;
}

.btn-necessary {
  background: transparent;
  border-color: #30363d;
  color: #8b949e;
}
.btn-necessary:hover {
  border-color: #8b949e;
  color: #e6edf3;
}

.btn-accept-all {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}
.btn-accept-all:hover {
  background: #2ea043;
}

/* 滑入动画 */
.bar-slide-enter-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.3s ease;
}
.bar-slide-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.bar-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.bar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 移动端 */
@media (max-width: 640px) {
  .cookie-bar-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 16px;
  }

  .bar-text {
    font-size: 11px;
  }

  .bar-actions {
    justify-content: flex-end;
  }

  .bar-countdown {
    display: none;
  }
}
</style>

