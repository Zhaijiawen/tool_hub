<template>
  <div v-if="shouldShow" class="simple-right-nav">
    <div class="nav-panel right-panel">
      <!-- 学习资源导航 -->
      <div class="nav-card learning-nav">
        <n-card size="small" :title="t('tutorial.hintTitle')" class="nav-card-inner">
          <div class="nav-content">
            <div class="nav-icon">
              <n-icon size="24" color="#1890ff">
                <BookIcon />
              </n-icon>
            </div>
            <div class="nav-text">
              <p class="nav-description">{{ t('tutorial.hintContent') }}</p>
              <div class="nav-actions">
                <n-button 
                  size="small" 
                  type="primary"
                  @click="scrollToTutorial"
                  class="action-btn"
                >
                  {{ t('tutorial.viewTutorial') }}
                </n-button>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOutline as BookIcon } from '@vicons/ionicons5'

const props = defineProps({
  hasFavorites: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()

// 响应式窗口宽度和挂载状态
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1400)
const isMounted = ref(false)

// 更新窗口宽度
const updateWindowWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

// 组件挂载时监听窗口变化
onMounted(() => {
  isMounted.value = true
  updateWindowWidth()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

// 控制显示 - 只在客户端挂载后才显示
const shouldShow = computed(() => {
  return isMounted.value && windowWidth.value >= 1200
})

// 滚动到教程区域
const scrollToTutorial = () => {
  const tutorialElement = document.querySelector('.tutorial-and-docs')
  if (tutorialElement) {
    tutorialElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}
</script>

<style scoped>
.simple-right-nav {
  pointer-events: none;
}

.nav-panel {
  width: 250px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nav-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.nav-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.nav-card-inner {
  background: transparent;
  border: none;
  box-shadow: none;
}

.nav-card-inner:hover {
  box-shadow: none;
  transform: none;
}

.learning-nav {
  border: 1px solid #1890ff !important;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%) !important;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-icon {
  text-align: center;
  padding: 8px 0;
}

.nav-text {
  flex: 1;
}

.nav-description {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-color-2);
  margin: 0 0 12px 0;
}

.nav-actions {
  display: flex;
  justify-content: center;
}

.action-btn {
  font-size: 12px;
  height: 28px;
  padding: 0 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .simple-right-nav {
    display: none;
  }
}
</style> 