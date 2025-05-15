<template>
  <div class="other-view">
    <n-card>
      <template #header>
        <div class="other-header">
          <n-space vertical>
            <tool-search :tools="allTools" />
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

// 其他工具列表
const otherTools = [
  { name: '二维码工具', path: '/other/qrcode', description: '生成和解析二维码，支持自定义样式', category: '实用工具' },
  { name: '时间戳转换', path: '/other/timestamp', description: '时间戳与日期时间互转，支持多种格式', category: '实用工具' }
]

// 所有工具列表（用于搜索）
const allTools = computed(() => {
  return otherTools
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
.other-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.other-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 