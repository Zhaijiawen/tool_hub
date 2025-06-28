<template>
  <div class="user-agent">
    <n-card :title="t('convert.userAgent.title')">
      <n-input v-model:value="input" type="textarea" :placeholder="t('convert.userAgent.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }" />
      <div class="button-group">
        <n-button @click="parse" type="primary">
          {{ t('convert.userAgent.parse') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <n-alert v-if="error" type="error" :title="t('common.error')" :content="error" class="error-alert" />
      <n-card v-if="result" :title="t('convert.userAgent.result')" class="result-card">
        <n-descriptions bordered>
          <n-descriptions-item :label="t('convert.userAgent.browser')">
            {{ result.browser.name }} {{ result.browser.version }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('convert.userAgent.os')">
            {{ result.os.name }} {{ result.os.version }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('convert.userAgent.device')">
            {{ result.device.type || 'Desktop' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('convert.userAgent.engine')">
            {{ result.engine.name }} {{ result.engine.version }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('convert.userAgent.cpu')">
            {{ result.cpu.architecture || 'Unknown' }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UAParser } from 'ua-parser-js'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const result = ref(null)

const parse = () => {
  try {
    if (!input.value) {
      throw new Error(t('convert.userAgent.inputRequired'))
    }
    const parser = new UAParser(input.value)
    result.value = parser.getResult()
    error.value = ''
  } catch (e) {
    error.value = e.message
    result.value = null
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
.user-agent {
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

.result-card {
  margin-top: 16px;
}
</style>