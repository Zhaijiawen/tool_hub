<template>
  <!-- 工具视图容器 -->
  <div class="tool-view">
    <router-view></router-view>
  </div>
</template>

<script setup>
// 导入路由相关功能
import { useRouter, useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import { watch, nextTick } from 'vue'

// 初始化路由
const router = useRouter()
const route = useRoute()

// SEO优化
const { updatePageMeta } = useSeo()

// 监听路由变化，更新页面元数据
watch(() => route.path, () => {
  nextTick(() => {
    updatePageMeta()
  })
}, { immediate: true })
</script>

<style scoped>
/* 工具视图容器样式 */
.tool-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .tool-view {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .tool-view {
    padding: 8px;
  }
}
</style>