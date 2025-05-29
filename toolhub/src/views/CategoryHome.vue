<template>
  <div class="category-home">
    <n-card :title="t(`common.${category}`)">
      <n-list>
        <n-list-item v-for="tool in tools" :key="tool.id">
          <router-link :to="tool.path">{{ t(`${category}.${tool.id}.title`) }}</router-link>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getToolsByCategory } from '@/api/tools'

const route = useRoute()
const { t, locale } = useI18n()
const category = ref(route.path.replace('/', ''))
const tools = ref([])

const fetchCategoryTools = async () => {
  const res = await getToolsByCategory(category.value, locale.value)
  if (res.code === 0) tools.value = res.data
}

onMounted(fetchCategoryTools)

// 监听路由变化，切换分类时自动刷新
watch(() => route.path, (newPath) => {
  category.value = newPath.replace('/', '')
  fetchCategoryTools()
})
</script>

<style scoped>
.category-home {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}
</style> 