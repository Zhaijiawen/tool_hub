<template>
  <div class="home">
    <n-card title="在线工具集合">
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="tool in tools" :key="tool.path">
          <n-card :title="tool.name" hoverable @click="navigateTo(tool.path)">
            <template #header-extra>
              <n-icon size="24">
                <component :is="tool.icon" />
              </n-icon>
            </template>
            <p>{{ tool.description }}</p>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NGrid, NGridItem, NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  CodeSlash,
  FileCode,
  FileText,
  FileEarmarkCode,
  FileEarmarkText,
  FileEarmarkRichtext
} from '@vicons/ionicons5'

const router = useRouter()

const tools = [
  {
    name: 'JSON格式化',
    description: '格式化、压缩、转义JSON数据',
    path: '/format/json',
    icon: CodeSlash
  },
  {
    name: 'XML格式化',
    description: '格式化、压缩XML数据',
    path: '/format/xml',
    icon: FileCode
  },
  {
    name: 'JavaScript格式化',
    description: '格式化、压缩JavaScript代码',
    path: '/format/js',
    icon: FileEarmarkCode
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.n-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.n-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 