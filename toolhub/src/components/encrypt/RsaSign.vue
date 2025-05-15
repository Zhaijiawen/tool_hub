<template>
  <div class="rsa-sign">
    <n-card :title="t('encrypt.rsaSign.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.rsaSign.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.rsaSign.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.rsaSign.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.rsaSign.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.rsaSign.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.rsaSign.algorithm')">
            <n-select
              v-model:value="formData.algorithm"
              :options="algorithmOptions"
              :placeholder="t('encrypt.rsaSign.algorithmPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.rsaSign.generateKeyPair') }}
          </n-button>
          <n-button @click="sign">
            {{ t('encrypt.rsaSign.sign') }}
          </n-button>
          <n-button @click="verify">
            {{ t('encrypt.rsaSign.verify') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.rsaSign.outputPlaceholder')"
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
import { createSign, createVerify } from 'crypto'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  privateKey: '',
  publicKey: '',
  algorithm: 'SHA256'
})

const algorithmOptions = [
  { label: 'SHA256', value: 'SHA256' },
  { label: 'SHA384', value: 'SHA384' },
  { label: 'SHA512', value: 'SHA512' }
]

const generateKeyPair = async () => {
  try {
    const response = await fetch('/api/rsa/generate')
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    formData.publicKey = data.publicKey
    formData.privateKey = data.privateKey
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const sign = () => {
  try {
    if (!formData.privateKey) {
      throw new Error(t('encrypt.rsaSign.privateKeyRequired'))
    }

    const sign = createSign(formData.algorithm)
    sign.update(input.value)
    const signature = sign.sign(formData.privateKey, 'hex')
    
    output.value = signature
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const verify = () => {
  try {
    if (!formData.publicKey) {
      throw new Error(t('encrypt.rsaSign.publicKeyRequired'))
    }

    const verify = createVerify(formData.algorithm)
    verify.update(input.value)
    const isValid = verify.verify(formData.publicKey, output.value, 'hex')
    
    output.value = isValid ? t('encrypt.rsaSign.verificationSuccess') : t('encrypt.rsaSign.verificationFailed')
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
.rsa-sign {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 