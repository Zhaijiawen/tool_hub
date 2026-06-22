<template>
  <!-- 工具搜索组件容器 -->
  <div class="tool-search">
    <!-- 搜索输入组 -->
    <n-input-group>
      <!-- 搜索输入框 -->
      <n-input ref="inputRef" v-model:value="searchText" :placeholder="$t('common.searchPlaceholder')" clearable
        @keyup.enter="handleSearch">
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
      <n-card v-if="searchResults.length > 0">
        <n-list>
          <n-list-item v-for="tool in searchResults" :key="tool.path" @click="handleToolSelect(tool)">
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
// 导入路由功能
import { useRouter } from 'vue-router'
// 导入搜索图标
import { Search as SearchIcon } from '@vicons/ionicons5'
// 导入Naive UI组件
import { NInputGroup, NInput, NButton, NIcon, NCard, NList, NListItem, NThing, NTag, NEmpty } from 'naive-ui'
// 导入API服务
import { getAllToolsSync } from '@/api/tools'
// 导入i18n功能
import { useI18n } from 'vue-i18n'

// 初始化路由
const router = useRouter()
// 搜索输入框 DOM 引用
const inputRef = ref(null)
// 搜索文本
const searchText = ref('')
// 是否显示搜索结果
const showResults = ref(false)
// 搜索结果
const searchResults = ref([])
// 获取i18n实例
const { t, locale } = useI18n()

/**
 * 构建翻译后的搜索索引：{ tool, searchTexts }
 * tool.name / tool.description 都是 i18n key，需要 t() 翻译后才能搜中文
 */
const buildSearchIndex = () => {
  return getAllToolsSync().map(tool => ({
    tool,
    searchTexts: [t(tool.name), t(tool.description), t(`common.${tool.category}`), tool.id].join(' ').toLowerCase()
  }))
}

/**
 * 处理搜索操作
 * 在翻译后的文本中搜索，支持中英文
 */
const handleSearch = () => {
  if (!searchText.value.trim()) {
    showResults.value = false
    return
  }

  const kw = searchText.value.trim().toLowerCase()
  const index = buildSearchIndex()
  const matched = index
    .filter(item => item.searchTexts.includes(kw))
    .map(item => ({
      ...item.tool,
      name: t(item.tool.name),
      description: t(item.tool.description),
      category: t(`common.${item.tool.category}`)
    }))

  searchResults.value = matched
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

// 防抖函数
function debounce(fn, delay = 300) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const debouncedSearch = debounce(handleSearch, 300)

watch(searchText, (newValue) => {
  if (!newValue) {
    showResults.value = false
  } else {
    debouncedSearch()
  }
})

// 监听语言切换，自动刷新搜索结果
watch(locale, (newLocale) => {
  if (searchText.value) {
    handleSearch()
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

// 暴露 focusInput 方法，供父组件（如全局快捷键）调用
defineExpose({
  focusInput() {
    inputRef.value?.focus()
  }
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
  background: var(--card-color);
  border-radius: 4px;
  box-shadow: var(--shadow-md);
}

/* 搜索结果项样式 */
:deep(.n-list-item) {
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-panel :deep(.n-list-item:hover) {
  background-color: var(--n-color-hover, rgba(0,0,0,0.04));
}
</style>