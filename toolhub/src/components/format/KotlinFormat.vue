<template>
  <div class="kotlin-format">
    <n-card :title="t('format.kotlin.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('format.kotlin.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="formatKotlin" type="primary">
          {{ t('format.kotlin.format') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <n-alert
        v-if="error"
        type="error"
        :title="t('common.error')"
        :content="error"
        class="error-alert"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import prettier from 'prettier/standalone'
import parserKotlin from 'prettier/parser-kotlin'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const formatKotlin = () => {
  try {
    input.value = prettier.format(input.value, {
      parser: 'kotlin',
      plugins: [parserKotlin],
      printWidth: 100,
      tabWidth: 4,
      useTabs: false,
      semi: false,
      singleQuote: true,
      trailingComma: 'none'
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.kotlin-format {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.error-alert {
  margin-top: 16px;
}
</style> 