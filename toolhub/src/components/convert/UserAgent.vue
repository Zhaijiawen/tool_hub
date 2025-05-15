<template>
  <n-card :title="$t('convert.userAgent.title')">
    <n-form>
      <n-form-item :label="$t('convert.userAgent.input')">
        <n-input
          v-model:value="formData.input"
          :placeholder="$t('convert.userAgent.inputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="parse">
          {{ $t('convert.userAgent.parse') }}
        </n-button>
        <n-button @click="copyResult">
          {{ $t('convert.userAgent.copy') }}
        </n-button>
      </n-space>

      <n-divider />

      <template v-if="formData.result">
        <n-descriptions bordered>
          <n-descriptions-item :label="$t('convert.userAgent.browser')">
            {{ formData.result.browser }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.userAgent.browserVersion')">
            {{ formData.result.browserVersion }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.userAgent.os')">
            {{ formData.result.os }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.userAgent.osVersion')">
            {{ formData.result.osVersion }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.userAgent.device')">
            {{ formData.result.device }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.userAgent.deviceType')">
            {{ formData.result.deviceType }}
          </n-descriptions-item>
        </n-descriptions>

        <n-card :title="$t('convert.userAgent.details')" class="mt-4">
          <n-list>
            <n-list-item v-for="(value, key) in formData.result.details" :key="key">
              <template #header>
                {{ key }}
              </template>
              {{ value }}
            </n-list-item>
          </n-list>
        </n-card>
      </template>
    </n-form>

    <n-alert
      v-if="error"
      type="error"
      :title="error"
      style="margin-top: 16px"
    />
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import UAParser from 'ua-parser-js'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  result: null
})

const error = ref('')

function parse() {
  error.value = ''
  
  try {
    if (!formData.input) {
      throw new Error(t('convert.userAgent.inputRequired'))
    }

    const parser = new UAParser(formData.input)
    const result = parser.getResult()

    formData.result = {
      browser: result.browser.name || 'Unknown',
      browserVersion: result.browser.version || 'Unknown',
      os: result.os.name || 'Unknown',
      osVersion: result.os.version || 'Unknown',
      device: result.device.model || 'Unknown',
      deviceType: result.device.type || 'Unknown',
      details: {
        'Engine': result.engine.name ? `${result.engine.name} ${result.engine.version}` : 'Unknown',
        'CPU': result.cpu.architecture || 'Unknown',
        'Mobile': result.device.vendor || 'Unknown',
        'Language': result.browser.language || 'Unknown'
      }
    }
  } catch (err) {
    error.value = err.message
  }
}

function copyResult() {
  if (formData.result) {
    const text = JSON.stringify(formData.result, null, 2)
    navigator.clipboard.writeText(text)
    message.success(t('convert.userAgent.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style> 