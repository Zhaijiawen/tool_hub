<template>
  <div class="tool-search">
    <n-input-group>
      <n-input
        v-model:value="searchText"
        :placeholder="$t('common.searchPlaceholder')"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <n-icon><search-icon /></n-icon>
        </template>
      </n-input>
      <n-button type="primary" @click="handleSearch">
        {{ $t('common.search') }}
      </n-button>
    </n-input-group>

    <!-- 搜索结果 -->
    <div v-if="showResults" class="search-results">
      <n-card v-if="filteredTools.length > 0">
        <n-list>
          <n-list-item
            v-for="tool in filteredTools"
            :key="tool.path"
            @click="handleToolSelect(tool)"
          >
            <n-thing :title="tool.name" :description="tool.description">
              <template #header-extra>
                <n-tag>{{ tool.category }}</n-tag>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-card>
      <n-empty v-else :description="$t('common.noResults')" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search as SearchIcon } from '@vicons/ionicons5'
import { NInputGroup, NInput, NButton, NIcon, NCard, NList, NListItem, NThing, NTag, NEmpty } from 'naive-ui'

const props = defineProps({
  tools: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const searchText = ref('')
const showResults = ref(false)

// 过滤工具列表
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

// 处理搜索
const handleSearch = () => {
  showResults.value = true
}

// 处理工具选择
const handleToolSelect = (tool) => {
  router.push(tool.path)
  showResults.value = false
  searchText.value = ''
}

// 监听搜索文本变化
watch(searchText, (newValue) => {
  if (!newValue) {
    showResults.value = false
  }
})

// 点击外部关闭搜索结果
const handleClickOutside = (event) => {
  const searchElement = document.querySelector('.tool-search')
  if (searchElement && !searchElement.contains(event.target)) {
    showResults.value = false
  }
}

// 添加和移除点击事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.tool-search {
  position: relative;
  width: 100%;
  max-width: 600px;
}

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

:deep(.n-list-item) {
  cursor: pointer;
  transition: background-color 0.3s;
}

:deep(.n-list-item:hover) {
  background-color: #f5f5f5;
}
</style> 