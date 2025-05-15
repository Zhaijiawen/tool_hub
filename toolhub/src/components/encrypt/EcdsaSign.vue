<template>
  <div class="ecdsa-sign">
    <n-card :title="t('encrypt.ecdsaSign.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.ecdsaSign.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.ecdsaSign.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.ecdsaSign.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecdsaSign.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.ecdsaSign.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecdsaSign.curve')">
            <n-select
              v-model:value="formData.curve"
              :options="curveOptions"
              :placeholder="t('encrypt.ecdsaSign.curvePlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ecdsaSign.generateKeyPair') }}
          </n-button>
          <n-button @click="sign">
            {{ t('encrypt.ecdsaSign.sign') }}
          </n-button>
          <n-button @click="verify">
            {{ t('encrypt.ecdsaSign.verify') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.ecdsaSign.outputPlaceholder')"
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
  curve: 'secp256k1'
})

const curveOptions = [
  { label: 'secp256k1', value: 'secp256k1' },
  { label: 'prime256v1', value: 'prime256v1' },
  { label: 'secp384r1', value: 'secp384r1' },
  { label: 'secp521r1', value: 'secp521r1' }
]

const generateKeyPair = async () => {
  try {
    const response = await fetch(`/api/ecdsa/generate?curve=${formData.curve}`)
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
      throw new Error(t('encrypt.ecdsaSign.privateKeyRequired'))
    }

    const sign = createSign('ecdsa-with-SHA256')
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
      throw new Error(t('encrypt.ecdsaSign.publicKeyRequired'))
    }

    const verify = createVerify('ecdsa-with-SHA256')
    verify.update(input.value)
    const isValid = verify.verify(formData.publicKey, output.value, 'hex')
    
    output.value = isValid ? t('encrypt.ecdsaSign.verificationSuccess') : t('encrypt.ecdsaSign.verificationFailed')
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
.ecdsa-sign {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 