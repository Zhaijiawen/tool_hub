<template>
  <div class="json-format">
    <n-card :title="t('format.json.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('format.json.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="formatJson" type="primary">
          {{ t('format.json.format') }}
        </n-button>
        <n-button @click="compressJson">
          {{ t('format.json.compress') }}
        </n-button>
        <n-button @click="escapeJson">
          {{ t('format.json.escape') }}
        </n-button>
        <n-button @click="unescapeJson">
          {{ t('format.json.unescape') }}
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
import { beautify } from 'js-beautify'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const formatJson = () => {
  try {
    const parsed = JSON.parse(input.value)
    input.value = beautify(JSON.stringify(parsed), {
      indent_size: 2,
      space_in_empty_paren: true
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const compressJson = () => {
  try {
    const parsed = JSON.parse(input.value)
    input.value = JSON.stringify(parsed)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const escapeJson = () => {
  try {
    input.value = JSON.stringify(input.value)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const unescapeJson = () => {
  try {
    input.value = JSON.parse(input.value)
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
.json-format {
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