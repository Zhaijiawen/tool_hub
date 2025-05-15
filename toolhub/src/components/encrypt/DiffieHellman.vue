<template>
  <div class="diffie-hellman">
    <n-card :title="t('encrypt.diffieHellman.title')">
      <n-space vertical>
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.diffieHellman.prime')">
            <n-input
              v-model:value="formData.prime"
              type="textarea"
              :placeholder="t('encrypt.diffieHellman.primePlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.diffieHellman.generator')">
            <n-input
              v-model:value="formData.generator"
              type="textarea"
              :placeholder="t('encrypt.diffieHellman.generatorPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.diffieHellman.privateKey')">
            <n-input
              v-model:value="formData.privateKey"
              type="textarea"
              :placeholder="t('encrypt.diffieHellman.privateKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.diffieHellman.publicKey')">
            <n-input
              v-model:value="formData.publicKey"
              type="textarea"
              :placeholder="t('encrypt.diffieHellman.publicKeyPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.diffieHellman.generateKeyPair') }}
          </n-button>
          <n-button @click="computeSharedSecret">
            {{ t('encrypt.diffieHellman.computeSharedSecret') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.diffieHellman.outputPlaceholder')"
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
import { createDiffieHellman } from 'crypto'

const { t } = useI18n()
const message = useMessage()

const output = ref('')
const error = ref('')

const formData = reactive({
  prime: '',
  generator: '',
  privateKey: '',
  publicKey: ''
})

const generateKeyPair = () => {
  try {
    if (!formData.prime || !formData.generator) {
      throw new Error(t('encrypt.diffieHellman.primeAndGeneratorRequired'))
    }

    const dh = createDiffieHellman(
      Buffer.from(formData.prime, 'hex'),
      Buffer.from(formData.generator, 'hex')
    )
    
    formData.privateKey = dh.getPrivateKey('hex')
    formData.publicKey = dh.getPublicKey('hex')
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const computeSharedSecret = () => {
  try {
    if (!formData.prime || !formData.generator || !formData.privateKey || !formData.publicKey) {
      throw new Error(t('encrypt.diffieHellman.allFieldsRequired'))
    }

    const dh = createDiffieHellman(
      Buffer.from(formData.prime, 'hex'),
      Buffer.from(formData.generator, 'hex')
    )
    
    dh.setPrivateKey(Buffer.from(formData.privateKey, 'hex'))
    const sharedSecret = dh.computeSecret(Buffer.from(formData.publicKey, 'hex'))
    
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
.diffie-hellman {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 