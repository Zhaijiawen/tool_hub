<template>
  <!-- 首页容器 -->
  <div class="home">
    <!-- 欢迎卡片 -->
    <n-card :title="t('home.welcome')">
      <!-- 工具分类网格布局 -->
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
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
              <!-- 遍历分类下的工具 -->
              <n-list-item v-for="tool in category.tools" :key="tool.id">
                <router-link :to="tool.path">{{ t(`${category.key}.${tool.id}.title`) }}</router-link>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getAllTools } from '@/api/tools'

// 初始化国际化
const { t, locale } = useI18n()
const router = useRouter()

// 工具分类数据
const categories = ref([])

// 获取工具列表
const fetchTools = async () => {
  try {
    console.log('Fetching tools with locale:', locale.value)
    const response = await getAllTools(locale.value)
    console.log('API Response:', response)
    
    if (response.code === 0) {
      // 按分类组织工具
      const toolsByCategory = response.data.reduce((acc, tool) => {
        console.log('Processing tool:', tool)
        const category = tool.category
        if (!acc[category]) {
          acc[category] = {
            key: category,
            tools: []
          }
        }
        acc[category].tools.push({
          id: tool.id,
          path: tool.path
        })
        return acc
      }, {})
      
      console.log('Organized tools:', toolsByCategory)
      categories.value = Object.values(toolsByCategory)
      console.log('Final categories:', categories.value)
      window._categories = categories.value
      console.log('window._categories', window._categories)
    } else {
      console.error('API returned error:', response)
    }
  } catch (error) {
    console.error('Failed to fetch tools:', error)
  }
}

// 导航到分类页面
const navigateToCategory = (category) => {
  router.push(`/${category}`)
}

// 组件挂载时获取工具列表
onMounted(() => {
  fetchTools()
})
</script>

<style scoped>
/* 首页容器样式 */
.home {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
</style> 