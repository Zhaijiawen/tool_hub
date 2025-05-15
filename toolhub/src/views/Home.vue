<template>
  <div class="home">
    <n-card title="欢迎使用 ToolHub">
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="category in categories" :key="category.key">
          <n-card :title="t(category.title)" hoverable>
            <template #header-extra>
              <n-button text>
                {{ t('common.more') }}
              </n-button>
            </template>
            <n-list>
              <n-list-item v-for="tool in category.tools" :key="tool.key">
                <router-link :to="tool.path">{{ t(tool.title) }}</router-link>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const categories = [
  {
    key: 'format',
    title: 'common.format',
    tools: [
      { key: 'json', title: 'format.json.title', path: '/format/json' },
      { key: 'xml', title: 'format.xml.title', path: '/format/xml' }
    ]
  },
  {
    key: 'encrypt',
    title: 'common.encrypt',
    tools: [
      { key: 'aes', title: 'encrypt.aes.title', path: '/encrypt/aes' }
    ]
  },
  {
    key: 'convert',
    title: 'common.convert',
    tools: [
      { key: 'timestamp', title: 'convert.timestamp.title', path: '/convert/timestamp' }
    ]
  }
]
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
</style> 