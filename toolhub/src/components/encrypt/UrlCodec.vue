<template>
  <div class="url-codec">
    <n-card :title="t('encrypt.url.title')">
      <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.url.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }" />
      <div class="button-group">
        <n-button @click="encodeUrl" type="primary">
          {{ t('encrypt.url.encode') }}
        </n-button>
        <n-button @click="decodeUrl" type="primary">
          {{ t('encrypt.url.decode') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const encodeUrl = () => {
  try {
    input.value = encodeURIComponent(input.value)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decodeUrl = () => {
  try {
    input.value = decodeURIComponent(input.value)
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
.url-codec {
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