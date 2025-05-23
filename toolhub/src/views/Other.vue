<template>
  <!-- 其他工具视图容器 -->
  <div class="other-view">
    <!-- 工具卡片 -->
    <n-card>
      <!-- 卡片头部 -->
      <template #header>
        <div class="other-header">
          <!-- 搜索和工具导航区域 -->
          <n-space vertical>
            <!-- 工具搜索组件 -->
            <tool-search :tools="allTools" />
            <!-- 工具导航按钮组 -->
            <n-space>
              <n-button
                v-for="tool in otherTools"
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

// 其他工具列表配置
const otherTools = [
  { name: '二维码工具', path: '/other/qrcode', description: '生成和解析二维码，支持自定义样式', category: '实用工具' },
  { name: '时间戳转换', path: '/other/timestamp', description: '时间戳与日期时间互转，支持多种格式', category: '实用工具' }
]

// 计算属性：所有工具列表（用于搜索功能）
const allTools = computed(() => {
  return otherTools
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
/* 其他工具视图容器样式 */
.other-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 其他工具头部样式 */
.other-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 