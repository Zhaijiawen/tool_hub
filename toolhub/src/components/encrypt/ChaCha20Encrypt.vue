<template>
  <div class="chacha20-encrypt">
    <n-card :title="t('encrypt.chacha20.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('encrypt.chacha20.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="encrypt" type="primary">
          {{ t('encrypt.chacha20.encrypt') }}
        </n-button>
        <n-button @click="decrypt" type="primary">
          {{ t('encrypt.chacha20.decrypt') }}
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

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const encrypt = () => {
  try {
    input.value = btoa(input.value)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    input.value = atob(input.value)
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
.chacha20-encrypt {
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