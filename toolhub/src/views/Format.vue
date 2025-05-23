<template>
  <!-- 格式化工具视图容器 -->
  <div class="format-view">
    <!-- 工具卡片 -->
    <n-card>
      <!-- 卡片头部 -->
      <template #header>
        <div class="format-header">
          <!-- 搜索和工具导航区域 -->
          <n-space vertical>
            <!-- 工具搜索组件 -->
            <tool-search :tools="allTools" />
            <!-- 工具导航按钮组 -->
            <n-space>
              <n-button
                v-for="tool in formatTools"
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

// 格式化工具列表配置
const formatTools = [
  { name: 'JSON格式化', path: '/format/json', description: '格式化JSON数据，支持压缩和美化', category: '数据格式' },
  { name: 'XML格式化', path: '/format/xml', description: '格式化XML数据，支持压缩和美化', category: '数据格式' },
  { name: 'YAML格式化', path: '/format/yaml', description: '格式化YAML数据，支持压缩和美化', category: '数据格式' },
  { name: 'JS格式化', path: '/format/js', description: '格式化JavaScript代码，支持压缩和美化', category: '编程语言' },
  { name: 'HTML格式化', path: '/format/html', description: '格式化HTML代码，支持压缩和美化', category: '编程语言' },
  { name: 'CSS格式化', path: '/format/css', description: '格式化CSS代码，支持压缩和美化', category: '编程语言' },
  { name: 'Python格式化', path: '/format/python', description: '格式化Python代码，支持压缩和美化', category: '编程语言' },
  { name: 'Java格式化', path: '/format/java', description: '格式化Java代码，支持压缩和美化', category: '编程语言' },
  { name: 'C#格式化', path: '/format/csharp', description: '格式化C#代码，支持压缩和美化', category: '编程语言' },
  { name: 'Go格式化', path: '/format/go', description: '格式化Go代码，支持压缩和美化', category: '编程语言' },
  { name: 'PHP格式化', path: '/format/php', description: '格式化PHP代码，支持压缩和美化', category: '编程语言' },
  { name: 'Ruby格式化', path: '/format/ruby', description: '格式化Ruby代码，支持压缩和美化', category: '编程语言' },
  { name: 'Kotlin格式化', path: '/format/kotlin', description: '格式化Kotlin代码，支持压缩和美化', category: '编程语言' },
  { name: 'Rust格式化', path: '/format/rust', description: '格式化Rust代码，支持压缩和美化', category: '编程语言' },
  { name: 'Shell格式化', path: '/format/shell', description: '格式化Shell脚本，支持压缩和美化', category: '其他语言' },
  { name: 'SQL格式化', path: '/format/sql', description: '格式化SQL语句，支持压缩和美化', category: '其他语言' },
  { name: 'Markdown格式化', path: '/format/markdown', description: '格式化Markdown文档，支持压缩和美化', category: '其他语言' },
  { name: 'Dart格式化', path: '/format/dart', description: '格式化Dart代码，支持压缩和美化', category: '其他语言' }
]

// 计算属性：所有工具列表（用于搜索功能）
const allTools = computed(() => {
  return formatTools
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
/* 格式化工具视图容器样式 */
.format-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 格式化工具头部样式 */
.format-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 