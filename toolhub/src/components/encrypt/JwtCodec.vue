<template>
  <div class="jwt-codec">
    <n-card :title="t('encrypt.jwt.title')">
      <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.jwt.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }" />
      <div class="button-group">
        <n-button @click="encode" type="primary">
          {{ t('encrypt.jwt.encode') }}
        </n-button>
        <n-button @click="decode" type="primary">
          {{ t('encrypt.jwt.decode') }}
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
import jwt from 'jsonwebtoken'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const encode = () => {
  try {
    input.value = jwt.sign(input.value, 'YOUR_SECRET_KEY') // 替换为你的密钥
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decode = () => {
  try {
    input.value = jwt.verify(input.value, 'YOUR_SECRET_KEY') // 替换为你的密钥
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
.jwt-codec {
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