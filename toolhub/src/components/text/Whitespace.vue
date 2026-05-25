<template>
  <div class="whitespace-handler">
    <n-card :title="t('text.whitespace.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('text.whitespace.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

        <n-space>
          <n-button @click="trimWhitespace">
            {{ t('text.whitespace.trim') }}
          </n-button>
          <n-button @click="compressWhitespace">
            {{ t('text.whitespace.compress') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('text.whitespace.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" readonly />

        <n-alert type="info" :title="t('text.whitespace.infoTitle')" class="info-section">
          {{ t('text.whitespace.infoContent') }}
        </n-alert>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>

  </div>
  <TutorialAndDocs toolKey="whitespace" />
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const trimWhitespace = () => {
  try {
    if (!input.value) {
      throw new Error(t('text.whitespace.inputRequired'))
    }
    output.value = input.value.trim()
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const compressWhitespace = () => {
  try {
    if (!input.value) {
      throw new Error(t('text.whitespace.inputRequired'))
    }
    output.value = input.value.replace(/\s+/g, ' ')
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.whitespace-handler {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.info-section {
  margin-top: 16px;
}

.error-alert {
  margin-top: 16px;
}
</style>