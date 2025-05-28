<template>
  <!-- 其他工具视图容器 -->
  <div class="other-view">
    <router-view></router-view>
  </div>
</template>

<script setup>
// 导入路由相关功能
import { useRouter, useRoute } from 'vue-router'

// 初始化路由
const router = useRouter()
const route = useRoute()
</script>

<style scoped>
/* 其他工具视图容器样式 */
.other-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 