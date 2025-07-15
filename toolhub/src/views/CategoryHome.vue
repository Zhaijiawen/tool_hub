<template>
  <div class="category-home">
    <n-card :title="t(`common.${category}`)">
      <n-grid :cols="categoryGridCols" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="tool in tools" :key="tool.path">
          <n-card :title="t(tool.name)" hoverable>
            <div>{{ t(tool.description) }}</div>
            <template #footer>
              <router-link :to="tool.path">
                <n-button type="primary" size="small">{{ t('common.go') }}</n-button>
              </router-link>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getToolsByCategory } from '@/api/tools'

const route = useRoute()
const { t, locale } = useI18n()
const category = ref(route.path.replace('/', ''))
const tools = ref([])

// 响应式网格列数
const categoryGridCols = ref(2)

// 更新网格列数的函数
const updateCategoryGridCols = () => {
  const width = window.innerWidth
  if (width < 768) {
    categoryGridCols.value = 1  // 小屏幕：1列
  } else {
    categoryGridCols.value = 2  // 大屏幕：2列
  }
}

const fetchCategoryTools = async () => {
  const categoryTools = await getToolsByCategory(category.value, locale.value)
  tools.value = categoryTools
}

onMounted(() => {
  fetchCategoryTools()
  updateCategoryGridCols()  // 初始化网格列数
  window.addEventListener('resize', updateCategoryGridCols)  // 监听窗口大小变化
})

// 组件卸载时清理监听器
onUnmounted(() => {
  window.removeEventListener('resize', updateCategoryGridCols)
})

// 监听路由变化，切换分类时自动刷新
watch(() => route.path, (newPath) => {
  category.value = newPath.replace('/', '')
  fetchCategoryTools()
})
</script>

<style scoped>
.category-home {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .category-home {
    margin: 10px auto;
    padding: 0 12px;
  }
  
  /* 确保卡片标题不换行 */
  :deep(.n-card-header__main) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  
  /* 优化卡片内间距 */
  :deep(.n-card) {
    margin-bottom: 12px;
  }
  
  /* 工具描述文字优化 */
  :deep(.n-card__content) {
    line-height: 1.5;
  }
}

/* 小屏幕进一步优化 */
@media (max-width: 480px) {
  .category-home {
    padding: 0 8px;
    margin: 8px auto;
  }
  
  /* 减少卡片内边距 */
  :deep(.n-card-header) {
    padding: 16px 12px 8px 12px;
  }
  
  :deep(.n-card__content) {
    padding: 8px 12px;
  }
  
  :deep(.n-card__footer) {
    padding: 8px 12px 16px 12px;
  }
}
</style>