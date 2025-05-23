<template>
  <!-- 图片工具视图容器 -->
  <div class="image-view">
    <!-- 工具卡片 -->
    <n-card>
      <!-- 卡片头部 -->
      <template #header>
        <div class="image-header">
          <!-- 搜索和工具导航区域 -->
          <n-space vertical>
            <!-- 工具搜索组件 -->
            <tool-search :tools="allTools" />
            <!-- 工具导航按钮组 -->
            <n-space>
              <n-button
                v-for="tool in imageTools"
                :key="tool.path"
                :type="isActive(tool.path) ? 'primary' : 'default'"
                @click="navigateTo(tool.path)"
              >
                {{ tool.name }}
              </n-button>
            </n-space>
          </n-space>
        </div>
      </template>
      <!-- 路由视图 -->
      <router-view></router-view>
    </n-card>
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { computed } from 'vue'
// 导入路由相关功能
import { useRouter, useRoute } from 'vue-router'
// 导入Naive UI组件
import { NCard, NSpace, NButton } from 'naive-ui'
// 导入工具搜索组件
import ToolSearch from '@/components/common/ToolSearch.vue'

// 初始化路由
const router = useRouter()
const route = useRoute()

// 图片工具列表配置
const imageTools = [
  { name: '图片压缩', path: '/image/compress', description: '压缩图片大小，支持多种格式', category: '图片处理' }
]

// 计算属性：所有工具列表（用于搜索功能）
const allTools = computed(() => {
  return imageTools
})

/**
 * 判断当前路由是否激活
 * @param {string} path - 工具路径
 * @returns {boolean} - 是否激活
 */
const isActive = (path) => {
  return route.path === path
}

/**
 * 导航到指定工具
 * @param {string} path - 目标工具路径
 */
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 图片工具视图容器样式 */
.image-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 图片工具头部样式 */
.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 