<template>
  <div class="python-format">
    <n-card :title="t('format.python.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('format.python.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="formatPython" type="primary">
          {{ t('format.python.format') }}
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
import prettier from 'prettier'
import pythonPlugin from '@prettier/plugin-python'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const formatPython = () => {
  try {
    input.value = prettier.format(input.value, {
      parser: 'python',
      plugins: [pythonPlugin],
      printWidth: 80,
      tabWidth: 4,
      useTabs: false,
      semi: true,
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
.python-format {
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