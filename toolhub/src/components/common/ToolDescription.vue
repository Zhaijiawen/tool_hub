<template>
  <div class="tool-description">
    <!-- 工具描述折叠面板 -->
    <n-collapse v-if="description" class="description-collapse">
      <n-collapse-item :title="t('common.toolDescription')" name="description">
        <template #header>
          <div class="collapse-header">
            <n-icon size="18" class="info-icon">
              <InformationCircleIcon />
            </n-icon>
            <span>{{ t('common.toolDescription') }}</span>
          </div>
        </template>

      <!-- 工具基本信息 -->
      <div class="tool-info">
        <h3 class="tool-title">{{ description.title }}</h3>
        <p class="tool-desc">{{ description.description }}</p>
      </div>

      <!-- 功能特色 -->
      <div class="section">
        <h4 class="section-title">
          <n-icon size="16" class="section-icon">
            <StarIcon />
          </n-icon>
          {{ t('common.features') }}
        </h4>
        <ul class="feature-list">
          <li v-for="feature in description.features" :key="feature" class="feature-item">
            {{ feature }}
          </li>
        </ul>
      </div>

      <!-- 使用场景 -->
      <div class="section">
        <h4 class="section-title">
          <n-icon size="16" class="section-icon">
            <BulbIcon />
          </n-icon>
          {{ t('common.useCases') }}
        </h4>
        <ul class="use-case-list">
          <li v-for="useCase in description.useCases" :key="useCase" class="use-case-item">
            {{ useCase }}
          </li>
        </ul>
      </div>

      <!-- 技术背景 -->
      <div class="section">
        <h4 class="section-title">
          <n-icon size="16" class="section-icon">
            <BookIcon />
          </n-icon>
          {{ t('common.technicalBackground') }}
        </h4>
        <div class="tech-background">
          <pre class="tech-content">{{ description.technicalBackground }}</pre>
        </div>
      </div>

      <!-- 使用步骤 -->
      <div class="section">
        <h4 class="section-title">
          <n-icon size="16" class="section-icon">
            <PlayIcon />
          </n-icon>
          {{ t('common.usageSteps') }}
        </h4>
        <ol class="usage-steps">
          <li v-for="(step, index) in description.usageSteps" :key="index" class="step-item">
            {{ step }}
          </li>
        </ol>
      </div>

      <!-- 最佳实践 -->
      <div class="section">
        <h4 class="section-title">
          <n-icon size="16" class="section-icon">
            <CheckmarkCircleIcon />
          </n-icon>
          {{ t('common.bestPractices') }}
        </h4>
        <ul class="best-practices-list">
          <li v-for="practice in description.bestPractices" :key="practice" class="practice-item">
            {{ practice }}
          </li>
        </ul>
      </div>
    </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCollapse, NCollapseItem } from 'naive-ui'
import { 
  InformationCircle as InformationCircleIcon,
  Star as StarIcon,
  Bulb as BulbIcon,
  Book as BookIcon,
  Play as PlayIcon,
  CheckmarkCircle as CheckmarkCircleIcon
} from '@vicons/ionicons5'
import { getToolDescription } from '@/utils/toolDescriptions'

const { t, locale } = useI18n()

// 定义组件属性
const props = defineProps({
  toolKey: {
    type: String,
    required: true
  }
})

// 获取工具描述
const description = computed(() => {
  return getToolDescription(props.toolKey, locale.value)
})
</script>

<style scoped>
.tool-description {
  margin-top: 20px;
}

.description-collapse {
  background: var(--n-color);
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.info-icon {
  color: #1890ff;
}

.tool-info {
  margin-bottom: 24px;
}

.tool-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--n-text-color);
}

.tool-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--n-text-color-2);
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-color);
}

.section-icon {
  color: #52c41a;
}

.feature-list,
.use-case-list,
.best-practices-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.feature-item,
.use-case-item,
.practice-item {
  position: relative;
  margin-bottom: 8px;
  padding-left: 16px;
  line-height: 1.6;
  color: var(--n-text-color-2);
}

.feature-item::before,
.use-case-item::before,
.practice-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1890ff;
  font-weight: bold;
}

.usage-steps {
  margin: 0;
  padding-left: 20px;
  list-style: decimal;
}

.step-item {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--n-text-color-2);
}

.tech-background {
  background: var(--n-color-modal);
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  padding: 16px;
}

.tech-content {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--n-text-color-2);
  white-space: pre-wrap;
  word-break: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-description {
    margin-top: 16px;
  }
  
  .tool-title {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .tech-content {
    font-size: 12px;
  }
}
</style> 