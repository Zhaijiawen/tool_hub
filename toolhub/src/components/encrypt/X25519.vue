<template>
  <div class="x25519">
    <n-card :title="t('encrypt.x25519.title')">
      <n-space vertical>
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.x25519.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.x25519.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.x25519.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.x25519.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.x25519.generateKeyPair') }}
          </n-button>
          <n-button @click="computeSharedSecret">
            {{ t('encrypt.x25519.computeSharedSecret') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.x25519.outputPlaceholder')"
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
  privateKey: '',
  publicKey: ''
})

const generateKeyPair = () => {
  try {
    const ecdh = createECDH('x25519')
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
      throw new Error(t('encrypt.x25519.allFieldsRequired'))
    }

    const ecdh = createECDH('x25519')
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
.x25519 {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 