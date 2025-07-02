<template>
  <div class="category-home">
    <n-card :title="t(`common.${category}`)">
      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="tool in tools" :key="tool.id">
          <n-card :title="t(`${category}.${tool.id}.title`)" hoverable>
            <div>{{ t(`${category}.${tool.id}.description`) }}</div>
            <template #footer>
              <router-link :to="tool.path">
                <!-- <n-button type="primary" size="small">{{ t('common.more') }}</n-button> -->
              </router-link>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
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
  const categoryTools = await getToolsByCategory(category.value, locale.value)
  tools.value = categoryTools
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