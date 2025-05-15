<template>
  <div class="rsa-encrypt">
    <n-card :title="t('encrypt.rsa.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.rsa.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.rsa.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.rsa.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.rsa.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.rsa.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.rsa.keySize')">
            <n-select
              v-model:value="formData.keySize"
              :options="keySizeOptions"
              :placeholder="t('encrypt.rsa.keySizePlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.rsa.generateKeyPair') }}
          </n-button>
          <n-button @click="encrypt">
            {{ t('encrypt.rsa.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.rsa.decrypt') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.rsa.outputPlaceholder')"
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
import { JSEncrypt } from 'jsencrypt'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  publicKey: '',
  privateKey: '',
  keySize: 2048
})

const keySizeOptions = [
  { label: '1024 bits', value: 1024 },
  { label: '2048 bits', value: 2048 },
  { label: '4096 bits', value: 4096 }
]

const generateKeyPair = async () => {
  try {
    const response = await fetch(`/api/rsa/generate?bits=${formData.keySize}`)
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
      throw new Error(t('encrypt.rsa.publicKeyRequired'))
    }

    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(formData.publicKey)
    
    const encrypted = encrypt.encrypt(input.value)
    if (!encrypted) {
      throw new Error(t('encrypt.rsa.encryptionFailed'))
    }
    
    output.value = encrypted
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    if (!formData.privateKey) {
      throw new Error(t('encrypt.rsa.privateKeyRequired'))
    }

    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(formData.privateKey)
    
    const decrypted = decrypt.decrypt(input.value)
    if (!decrypted) {
      throw new Error(t('encrypt.rsa.decryptionFailed'))
    }
    
    output.value = decrypted
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
.rsa-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 