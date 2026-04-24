<template>
  <Transition name="cookie-slide">
    <div v-if="!hasResponded" class="cookie-consent-bar">
      <div class="cookie-consent-inner">
        <!-- 图标 + 文案 -->
        <div class="cookie-consent-text">
          <n-icon class="cookie-icon" size="18">
            <InformationCircleOutline />
          </n-icon>
          <span>
            {{ t('cookieConsent.message') }}
            <router-link to="/privacy" class="cookie-privacy-link">
              {{ t('cookieConsent.privacyLink') }}
            </router-link>
          </span>
        </div>
        <!-- 操作按钮 -->
        <div class="cookie-consent-actions">
          <n-button
            size="small"
            quaternary
            class="btn-necessary"
            @click="acceptNecessary"
          >
            {{ t('cookieConsent.necessary') }}
          </n-button>
          <n-button
            size="small"
            type="primary"
            class="btn-accept-all"
            @click="acceptAll"
          >
            {{ t('cookieConsent.acceptAll') }}
          </n-button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { InformationCircleOutline } from '@vicons/ionicons5'
import { useCookieConsent } from '@/composables/useCookieConsent'

const { t } = useI18n()
const { hasResponded, acceptAll, acceptNecessary } = useCookieConsent()
</script>

<style scoped>
.cookie-consent-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background-color: var(--card-color);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
  padding: 12px 24px;
}

.cookie-consent-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.cookie-consent-text {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-color);
  line-height: 1.5;
  flex: 1;
  min-width: 0;
}

.cookie-icon {
  flex-shrink: 0;
  margin-top: 1px;
  opacity: 0.7;
}

.cookie-privacy-link {
  color: var(--primary-color, #18a058);
  text-decoration: none;
  margin-left: 4px;
  white-space: nowrap;
}

.cookie-privacy-link:hover {
  text-decoration: underline;
}

.cookie-consent-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-necessary {
  white-space: nowrap;
}

.btn-accept-all {
  white-space: nowrap;
}

/* 滑入动画 */
.cookie-slide-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.cookie-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.cookie-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 移动端自适应 */
@media (max-width: 640px) {
  .cookie-consent-bar {
    padding: 12px 16px;
  }

  .cookie-consent-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .cookie-consent-text {
    font-size: 12px;
  }

  .cookie-consent-actions {
    justify-content: flex-end;
  }
}
</style>

