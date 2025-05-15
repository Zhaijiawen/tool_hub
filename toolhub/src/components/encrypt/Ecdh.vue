<template>
  <div class="ecdh">
    <n-card :title="t('encrypt.ecdh.title')">
      <n-space vertical>
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.ecdh.curve')">
            <n-select
              v-model:value="formData.curve"
              :options="curveOptions"
              :placeholder="t('encrypt.ecdh.curvePlaceholder')"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecdh.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.ecdh.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecdh.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.ecdh.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ecdh.generateKeyPair') }}
          </n-button>
          <n-button @click="computeSharedSecret">
            {{ t('encrypt.ecdh.computeSharedSecret') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.ecdh.outputPlaceholder')"
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
import { createECDH } from 'crypto'

const { t } = useI18n()
const message = useMessage()

const output = ref('')
const error = ref('')

const formData = reactive({
  curve: 'secp256k1',
  privateKey: '',
  publicKey: ''
})

const curveOptions = [
  { label: 'secp256k1', value: 'secp256k1' },
  { label: 'prime256v1', value: 'prime256v1' },
  { label: 'secp384r1', value: 'secp384r1' },
  { label: 'secp521r1', value: 'secp521r1' }
]

const generateKeyPair = () => {
  try {
    const ecdh = createECDH(formData.curve)
    ecdh.generateKeys()
    
    formData.privateKey = ecdh.getPrivateKey('hex')
    formData.publicKey = ecdh.getPublicKey('hex')
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const computeSharedSecret = () => {
  try {
    if (!formData.privateKey || !formData.publicKey) {
      throw new Error(t('encrypt.ecdh.allFieldsRequired'))
    }

    const ecdh = createECDH(formData.curve)
    ecdh.setPrivateKey(Buffer.from(formData.privateKey, 'hex'))
    
    const sharedSecret = ecdh.computeSecret(Buffer.from(formData.publicKey, 'hex'))
    output.value = sharedSecret.toString('hex')
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
.ecdh {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 