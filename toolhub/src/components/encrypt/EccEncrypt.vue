<template>
  <div class="ecc-encrypt">
    <n-card :title="t('encrypt.ecc.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.ecc.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.ecc.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.ecc.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecc.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.ecc.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecc.curve')">
            <n-select
              v-model:value="formData.curve"
              :options="curveOptions"
              :placeholder="t('encrypt.ecc.curvePlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ecc.generateKeyPair') }}
          </n-button>
          <n-button @click="encrypt">
            {{ t('encrypt.ecc.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.ecc.decrypt') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.ecc.outputPlaceholder')"
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
import { ec } from 'elliptic'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  publicKey: '',
  privateKey: '',
  curve: 'secp256k1'
})

const curveOptions = [
  { label: 'secp256k1', value: 'secp256k1' },
  { label: 'p256', value: 'p256' },
  { label: 'p384', value: 'p384' },
  { label: 'p521', value: 'p521' }
]

const generateKeyPair = async () => {
  try {
    const response = await fetch(`/api/ecc/generate?curve=${formData.curve}`)
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
      throw new Error(t('encrypt.ecc.publicKeyRequired'))
    }

    const elliptic = new ec(formData.curve)
    const key = elliptic.keyFromPublic(formData.publicKey, 'hex')
    
    const encrypted = key.encrypt(input.value)
    output.value = encrypted.toString('hex')
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    if (!formData.privateKey) {
      throw new Error(t('encrypt.ecc.privateKeyRequired'))
    }

    const elliptic = new ec(formData.curve)
    const key = elliptic.keyFromPrivate(formData.privateKey, 'hex')
    
    const decrypted = key.decrypt(input.value)
    output.value = decrypted.toString('utf8')
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
.ecc-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 