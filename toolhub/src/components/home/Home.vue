<template>
  <div class="home">
    <n-card>
      <template #header>
        <h1>欢迎使用 ToolHub</h1>
      </template>
      <n-grid :x-gap="12" :y-gap="8" :cols="4">
        <n-grid-item v-for="tool in tools" :key="tool.path">
          <n-card :title="tool.name" size="small" hoverable @click="navigateTo(tool.path)">
            {{ tool.description }}
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { NCard, NGrid, NGridItem } from 'naive-ui'

const { t } = useI18n()
const router = useRouter()

const tools = computed(() => [
  {
    name: t('format.java.title'),
    path: '/format/java',
    description: t('format.java.description')
  },
  {
    name: t('encrypt.aes.title'),
    path: '/encrypt/aes',
    description: t('encrypt.aes.description')
  },
  {
    name: t('other.qrcode.title'),
    path: '/other/qrcode',
    description: t('other.qrcode.description')
  },
  {
    name: t('convert.markdown.title'),
    path: '/convert/markdown',
    description: t('convert.markdown.description')
  }
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}
</style> 