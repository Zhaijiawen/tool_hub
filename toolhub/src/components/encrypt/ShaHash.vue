<template>
  <div class="sha-hash">
    <n-card :title="t('encrypt.sha.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.sha.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.sha.algorithm')">
            <n-select
              v-model:value="formData.algorithm"
              :options="algorithmOptions"
              :placeholder="t('encrypt.sha.algorithmPlaceholder')"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.sha.outputFormat')">
            <n-select
              v-model:value="formData.outputFormat"
              :options="outputFormatOptions"
              :placeholder="t('encrypt.sha.outputFormatPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="hash" type="primary">
            {{ t('encrypt.sha.hash') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.sha.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
          readonly
        />

        <n-alert
          v-if="error"
          type="error"
          :title="t('common.error')"
          :content="error"
          class="error-alert"
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CryptoJS from 'crypto-js'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  algorithm: 'SHA-256',
  outputFormat: 'hex'
})

const algorithmOptions = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-512', value: 'SHA-512' }
]

const outputFormatOptions = [
  { label: 'HEX', value: 'hex' },
  { label: 'Base64', value: 'base64' }
]

const hash = () => {
  try {
    if (!input.value) {
      throw new Error(t('encrypt.sha.inputRequired'))
    }

    let hashed
    switch (formData.algorithm) {
      case 'SHA-1':
        hashed = CryptoJS.SHA1(input.value)
        break
      case 'SHA-256':
        hashed = CryptoJS.SHA256(input.value)
        break
      case 'SHA-512':
        hashed = CryptoJS.SHA512(input.value)
        break
      default:
        throw new Error(t('encrypt.sha.invalidAlgorithm'))
    }

    output.value = formData.outputFormat === 'hex' 
      ? hashed.toString(CryptoJS.enc.Hex)
      : hashed.toString(CryptoJS.enc.Base64)
    
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
.sha-hash {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 