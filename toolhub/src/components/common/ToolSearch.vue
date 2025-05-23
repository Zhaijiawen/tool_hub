<template>
  <!-- 工具搜索组件容器 -->
  <div class="tool-search">
    <!-- 搜索输入组 -->
    <n-input-group>
      <!-- 搜索输入框 -->
      <n-input
        v-model:value="searchText"
        :placeholder="$t('common.searchPlaceholder')"
        clearable
        @keyup.enter="handleSearch"
      >
        <!-- 搜索图标前缀 -->
        <template #prefix>
          <n-icon><search-icon /></n-icon>
        </template>
      </n-input>
      <!-- 搜索按钮 -->
      <n-button type="primary" @click="handleSearch">
        {{ $t('common.search') }}
      </n-button>
    </n-input-group>

    <!-- 搜索结果展示区域 -->
    <div v-if="showResults" class="search-results">
      <!-- 有搜索结果时显示列表 -->
      <n-card v-if="filteredTools.length > 0">
        <n-list>
          <n-list-item
            v-for="tool in filteredTools"
            :key="tool.path"
            @click="handleToolSelect(tool)"
          >
            <n-thing :title="tool.name" :description="tool.description">
              <!-- 工具分类标签 -->
              <template #header-extra>
                <n-tag>{{ tool.category }}</n-tag>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-card>
      <!-- 无搜索结果时显示空状态 -->
      <n-empty v-else :description="$t('common.noResults')" />
    </div>
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
// 导入路由功能
import { useRouter } from 'vue-router'
// 导入搜索图标
import { Search as SearchIcon } from '@vicons/ionicons5'
// 导入Naive UI组件
import { NInputGroup, NInput, NButton, NIcon, NCard, NList, NListItem, NThing, NTag, NEmpty } from 'naive-ui'

// 定义组件属性
const props = defineProps({
  tools: {
    type: Array,
    required: true
  }
})

// 初始化路由
const router = useRouter()
// 搜索文本
const searchText = ref('')
// 是否显示搜索结果
const showResults = ref(false)

/**
 * 过滤工具列表
 * 根据搜索文本匹配工具名称、描述和分类
 */
const filteredTools = computed(() => {
  if (!searchText.value) return []
  
  const searchLower = searchText.value.toLowerCase()
  return props.tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(searchLower) ||
      tool.description?.toLowerCase().includes(searchLower) ||
      tool.category?.toLowerCase().includes(searchLower)
    )
  })
})

/**
 * 处理搜索操作
 * 显示搜索结果
 */
const handleSearch = () => {
  showResults.value = true
}

/**
 * 处理工具选择
 * 跳转到对应工具页面并重置搜索状态
 */
const handleToolSelect = (tool) => {
  router.push(tool.path)
  showResults.value = false
  searchText.value = ''
}

// 监听搜索文本变化，当清空时隐藏结果
watch(searchText, (newValue) => {
  if (!newValue) {
    showResults.value = false
  }
})

/**
 * 处理点击外部事件
 * 关闭搜索结果
 */
const handleClickOutside = (event) => {
  const searchElement = document.querySelector('.tool-search')
  if (searchElement && !searchElement.contains(event.target)) {
    showResults.value = false
  }
}

// 组件挂载时添加点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除点击事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 搜索组件容器样式 */
.tool-search {
  position: relative;
  width: 100%;
  max-width: 600px;
}

/* 搜索结果容器样式 */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 搜索结果项样式 */
:deep(.n-list-item) {
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 搜索结果项悬停效果 */
:deep(.n-list-item:hover) {
  background-color: #f5f5f5;
}
</style> 