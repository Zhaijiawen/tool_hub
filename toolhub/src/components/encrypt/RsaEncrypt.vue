<template>
  <div class="rsa-encrypt">
    <n-card :title="t('encrypt.rsa.title')">
      <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.rsa.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }" />
      <div class="button-group">
        <n-button @click="encrypt" type="primary">
          {{ t('encrypt.rsa.encrypt') }}
        </n-button>
        <n-button @click="decrypt" type="primary">
          {{ t('encrypt.rsa.decrypt') }}
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
import JSEncrypt from 'jsencrypt'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const encrypt = () => {
  try {
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey('YOUR_PUBLIC_KEY') // 替换为你的公钥
    input.value = encrypt.encrypt(input.value)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey('YOUR_PRIVATE_KEY') // 替换为你的私钥
    input.value = decrypt.decrypt(input.value)
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
.rsa-encrypt {
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