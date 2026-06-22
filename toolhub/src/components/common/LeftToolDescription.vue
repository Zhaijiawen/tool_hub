<template>
  <div v-if="shouldShow && description" class="left-tool-description">
    <div class="description-panel left-panel">

      <!-- 功能特色 -->
      <n-card class="description-card" :title="t('common.features')">
        <ul class="feature-list">
          <li v-for="feature in description.features" :key="feature" class="feature-item">
            <n-icon size="14" color="#18a058">
              <CheckmarkIcon />
            </n-icon>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </n-card>

      <!-- 使用场景 -->
      <n-card class="description-card" :title="t('common.useCases')">
        <ul class="use-case-list">
          <li v-for="useCase in description.useCases" :key="useCase" class="use-case-item">
            <n-icon size="14" color="#1890ff">
              <BulbIcon />
            </n-icon>
            <span>{{ useCase }}</span>
          </li>
        </ul>
      </n-card>

      <!-- 使用步骤 -->
      <n-card class="description-card" :title="t('common.usageSteps')">
        <ol class="usage-steps">
          <li v-for="(step, index) in description.usageSteps" :key="index" class="step-item">
            <div class="step-number">{{ index + 1 }}</div>
            <span>{{ step }}</span>
          </li>
        </ol>
      </n-card>

      <!-- 最佳实践 -->
      <n-card class="description-card" :title="t('common.bestPractices')">
        <ul class="best-practices-list">
          <li v-for="practice in description.bestPractices" :key="practice" class="practice-item">
            <n-icon size="14" color="#52c41a">
              <CheckmarkCircleIcon />
            </n-icon>
            <span>{{ practice }}</span>
          </li>
        </ul>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getToolDescription } from '@/locales/toolDescriptions'
import {
  CheckmarkOutline as CheckmarkIcon,
  BulbOutline as BulbIcon,
  CheckmarkCircleOutline as CheckmarkCircleIcon
} from '@vicons/ionicons5'

const props = defineProps({
  toolKey: {
    type: String,
    required: true
  }
})

const route = useRoute()
const { t, locale } = useI18n()

// 控制显示逻辑
const shouldShow = computed(() => {
  const excludedPaths = ['/composer', '/about', '/privacy', '/terms']
  return !excludedPaths.includes(route.path) && window.innerWidth >= 1200
})

// 获取工具描述
const description = computed(() => {
  return getToolDescription(props.toolKey, locale.value)
})
</script>

<style scoped>
.left-tool-description {
  position: fixed;
  top: 84px;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 5;
}

.description-panel {
  position: fixed;
  width: 280px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.left-panel {
  left: calc((100vw - 1200px) / 2 - 300px);
}

.description-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.description-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.tool-info {
  margin-bottom: 16px;
}

.tool-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.tool-desc {
  font-size: 13px;
  color: var(--text-color-2);
  line-height: 1.5;
  margin: 0;
}

.feature-list,
.use-case-list,
.best-practices-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item,
.use-case-item,
.practice-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.4;
}

.usage-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.4;
}

.step-number {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  flex-shrink: 0;
}

.tech-background {
  margin-top: 8px;
}

.tech-content {
  background: var(--code-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-color-2);
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 响应式隐藏 */
@media (max-width: 1199px) {
  .left-tool-description {
    display: none;
  }
}

/* 超大屏幕优化 */
@media (min-width: 1800px) {
  .left-panel {
    left: calc((100vw - 1200px) / 2 - 320px);
  }
  
  .description-panel {
    width: 300px;
  }
}

/* 滚动条样式 */
.description-panel::-webkit-scrollbar {
  width: 4px;
}

.description-panel::-webkit-scrollbar-track {
  background: transparent;
}

.description-panel::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.description-panel::-webkit-scrollbar-thumb:hover {
  background: var(--text-color-3);
}
</style> 