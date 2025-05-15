<template>
  <div class="encrypt-view">
    <n-card>
      <template #header>
        <div class="encrypt-header">
          <n-space vertical>
            <tool-search :tools="allTools" />
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

// 加密工具列表
const encryptTools = [
  { name: 'AES加密', path: '/encrypt/aes', description: 'AES对称加密算法，支持加密和解密', category: '对称加密' }
]

// 所有工具列表（用于搜索）
const allTools = computed(() => {
  return encryptTools
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
.encrypt-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.encrypt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 