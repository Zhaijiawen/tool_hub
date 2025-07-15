<template>
  <!-- 首页容器 -->
  <div class="home">
    <!-- 欢迎卡片 -->
    <n-card :title="t('home.welcome')">
      <!-- 工具分类网格布局（响应式） -->
      <n-grid 
        :cols="gridCols" 
        :x-gap="16" 
        :y-gap="16"
      >
        <!-- 遍历工具分类 -->
        <n-grid-item v-for="category in categories" :key="category.key">
          <!-- 分类卡片 -->
          <n-card :title="t(`common.${category.key}`)" hoverable>
            <!-- 卡片头部额外内容：更多按钮 -->
            <template #header-extra>
              <n-button text @click="navigateToCategory(category.key)">
                {{ t('common.more') }}
              </n-button>
            </template>
            <!-- 工具列表 -->
            <n-list>
              <!-- 只展示前6个工具 -->
              <n-list-item v-for="tool in category.tools.slice(0, 6)" :key="tool.path">
                <router-link :to="tool.path">{{ t(tool.name) }}</router-link>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getAllTools } from '@/api/tools'

// 初始化国际化
const { t, locale } = useI18n()
const router = useRouter()

// 工具分类数据
const categories = ref([])

// 响应式网格列数
const gridCols = ref(3)

// 更新网格列数的函数
const updateGridCols = () => {
  const width = window.innerWidth
  if (width < 640) {
    gridCols.value = 1  // 小屏幕：1列
  } else if (width < 1024) {
    gridCols.value = 2  // 中等屏幕：2列
  } else {
    gridCols.value = 3  // 大屏幕：3列
  }
}

// 获取工具列表
const fetchTools = async () => {
  try {
    const tools = await getAllTools(locale.value)
    
    // 按分类组织工具
    const toolsByCategory = tools.reduce((acc, tool) => {
      const category = tool.category
      if (!acc[category]) {
        acc[category] = {
          key: category,
          tools: []
        }
      }
      acc[category].tools.push({
        name: tool.name,
        path: tool.path
      })
      return acc
    }, {})

    categories.value = Object.values(toolsByCategory)
  } catch (error) {
    console.error('Failed to fetch tools:', error)
  }
}

// 导航到分类页面
const navigateToCategory = (category) => {
  router.push(`/${category}`)
}

// 组件挂载时获取工具列表和初始化响应式布局
onMounted(() => {
  fetchTools()
  updateGridCols()  // 初始化网格列数
  window.addEventListener('resize', updateGridCols)  // 监听窗口大小变化
})

// 组件卸载时清理监听器
onUnmounted(() => {
  window.removeEventListener('resize', updateGridCols)
})
</script>

<style scoped>
/* 首页容器样式 */
.home {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .home {
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
  
  /* 确保工具链接不换行 */
  :deep(.n-list-item) {
    padding: 8px 0;
  }
  
  :deep(.n-list-item a) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    width: 100%;
  }
}

/* 小屏幕进一步优化 */
@media (max-width: 480px) {
  .home {
    padding: 0 8px;
    margin: 8px auto;
  }
  
  /* 减少卡片内边距 */
  :deep(.n-card-header) {
    padding: 16px 12px 8px 12px;
  }
  
  :deep(.n-card__content) {
    padding: 8px 12px 16px 12px;
  }
}
</style>