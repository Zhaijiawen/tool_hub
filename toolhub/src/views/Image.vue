<template>
  <div class="image-view">
    <n-card>
      <template #header>
        <div class="image-header">
          <n-space vertical>
            <tool-search :tools="allTools" />
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
      <router-view></router-view>
    </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NSpace, NButton } from 'naive-ui'
import ToolSearch from '@/components/common/ToolSearch.vue'

const router = useRouter()
const route = useRoute()

// 图片工具列表
const imageTools = [
  { name: '图片压缩', path: '/image/compress', description: '压缩图片大小，支持多种格式', category: '图片处理' }
]

// 所有工具列表（用于搜索）
const allTools = computed(() => {
  return imageTools
})

// 判断当前路由是否激活
const isActive = (path) => {
  return route.path === path
}

// 导航到指定工具
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.image-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 