<template>
  <div class="xml-format">
    <n-card :title="t('format.xml.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('format.xml.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="formatXml" type="primary">
          {{ t('format.xml.format') }}
        </n-button>
        <n-button @click="compressXml">
          {{ t('format.xml.compress') }}
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

const formatXml = () => {
  try {
    input.value = beautify.xml(input.value, {
      indent_size: 2,
      space_in_empty_paren: true
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const compressXml = () => {
  try {
    input.value = input.value.replace(/>\s+</g, '><').trim()
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
.xml-format {
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