<template>
  <div class="ed25519-encrypt">
    <n-card :title="t('encrypt.ed25519.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.ed25519.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.ed25519.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.ed25519.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ed25519.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.ed25519.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ed25519.generateKeyPair') }}
          </n-button>
          <n-button @click="encrypt">
            {{ t('encrypt.ed25519.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.ed25519.decrypt') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.ed25519.outputPlaceholder')"
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
  publicKey: '',
  privateKey: ''
})

const generateKeyPair = async () => {
  try {
    const response = await fetch('/api/ed25519/generate')
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

const encrypt = () => {
  try {
    if (!formData.publicKey) {
      throw new Error(t('encrypt.ed25519.publicKeyRequired'))
    }

    const sign = createSign('ed25519')
    sign.update(input.value)
    const signature = sign.sign(formData.privateKey, 'hex')
    
    output.value = signature
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    if (!formData.privateKey) {
      throw new Error(t('encrypt.ed25519.privateKeyRequired'))
    }

    const verify = createVerify('ed25519')
    verify.update(input.value)
    const isValid = verify.verify(formData.publicKey, input.value, 'hex')
    
    output.value = isValid ? t('encrypt.ed25519.verificationSuccess') : t('encrypt.ed25519.verificationFailed')
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
.ed25519-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 