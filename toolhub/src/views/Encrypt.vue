<template>
  <!-- 加密工具视图容器 -->
  <div class="encrypt-view">
    <!-- 工具卡片 -->
    <n-card>
      <!-- 卡片头部 -->
      <template #header>
        <div class="encrypt-header">
          <!-- 搜索和工具导航区域 -->
          <n-space vertical>
            <!-- 工具搜索组件 -->
            <tool-search :tools="allTools" />
            <!-- 工具导航按钮组 -->
            <n-space>
              <n-button
                v-for="tool in encryptTools"
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

// 加密工具列表配置
const encryptTools = [
  { name: 'AES加密', path: '/encrypt/aes', description: 'AES对称加密算法，支持加密和解密', category: '对称加密' }
]

// 计算属性：所有工具列表（用于搜索功能）
const allTools = computed(() => {
  return encryptTools
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
/* 加密工具视图容器样式 */
.encrypt-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 加密工具头部样式 */
.encrypt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 