<template>
  <div class="bcrypt-hash">
    <n-card :title="t('encrypt.bcrypt.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('encrypt.bcrypt.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="hash" type="primary">
          {{ t('encrypt.bcrypt.hash') }}
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
import bcrypt from 'bcryptjs'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const hash = () => {
  try {
    const salt = bcrypt.genSaltSync(10)
    input.value = bcrypt.hashSync(input.value, salt)
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
.bcrypt-hash {
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