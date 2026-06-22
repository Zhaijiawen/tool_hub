<template>
  <div v-if="description" class="tool-intro">
    <div class="intro-grid">
      <!-- 功能特色 -->
      <div class="intro-section">
        <h3 class="section-title">
          <n-icon size="18" color="#18a058">
            <CheckmarkIcon />
          </n-icon>
          {{ t('common.features') }}
        </h3>
        <ul class="feature-list">
          <li v-for="feature in description.features" :key="feature" class="feature-item">
            {{ feature }}
          </li>
        </ul>
      </div>

      <!-- 使用场景 -->
      <div class="intro-section">
        <h3 class="section-title">
          <n-icon size="18" color="#1890ff">
            <BulbIcon />
          </n-icon>
          {{ t('common.useCases') }}
        </h3>
        <ul class="use-case-list">
          <li v-for="useCase in description.useCases" :key="useCase" class="use-case-item">
            {{ useCase }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getToolDescription } from '@/locales/toolDescriptions'
import {
  CheckmarkCircleOutline as CheckmarkIcon,
  BulbOutline as BulbIcon
} from '@vicons/ionicons5'

const props = defineProps({
  toolKey: {
    type: String,
    required: true
  }
})

const { t, locale } = useI18n()

const description = computed(() => {
  return getToolDescription(props.toolKey, locale.value)
})
</script>

<style scoped>
.tool-intro {
  margin-bottom: 16px;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.intro-section {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--primary-color);
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.intro-section:last-child {
  border-left-color: #1890ff;
}

.intro-section:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 10px 0;
}

.feature-list,
.use-case-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-item,
.use-case-item {
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.4;
  padding-left: 14px;
  position: relative;
}

.feature-item::before,
.use-case-item::before {
  content: '•';
  position: absolute;
  left: 4px;
  color: var(--primary-color);
  font-weight: bold;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .intro-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .intro-section {
    padding: 12px;
  }

  .section-title {
    font-size: 14px;
  }

  .feature-item,
  .use-case-item {
    font-size: 12px;
  }
}
</style>
