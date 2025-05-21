<template>
  <div class="ed25519-encrypt">
    <n-card :title="t('encrypt.ed25519.title')">
      <n-form>
        <n-form-item :label="t('encrypt.ed25519.message')">
          <n-input
            v-model:value="messageText"
            type="textarea"
            :placeholder="t('encrypt.ed25519.messagePlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-form-item>
        <n-form-item :label="t('encrypt.ed25519.privateKey')">
          <n-input
            v-model:value="privateKey"
            type="textarea"
            :placeholder="t('encrypt.ed25519.privateKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-form-item>
        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ed25519.generateKeyPair') }}
          </n-button>
          <n-button @click="sign" :disabled="!messageText || !privateKey">
            {{ t('encrypt.ed25519.sign') }}
          </n-button>
          <n-button @click="verify" :disabled="!messageText || !signature || !publicKey">
            {{ t('encrypt.ed25519.verify') }}
          </n-button>
        </n-space>
        <n-form-item v-if="signature" :label="t('encrypt.ed25519.signature')">
          <n-input
            v-model:value="signature"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
          <template #suffix>
            <n-button @click="copySignature" quaternary circle>
              <template #icon>
                <n-icon><copy-icon /></n-icon>
              </template>
            </n-button>
          </template>
        </n-form-item>
        <n-form-item v-if="publicKey" :label="t('encrypt.ed25519.publicKey')">
          <n-input
            v-model:value="publicKey"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
          <template #suffix>
            <n-button @click="copyPublicKey" quaternary circle>
              <template #icon>
                <n-icon><copy-icon /></n-icon>
              </template>
            </n-button>
          </template>
        </n-form-item>
        <n-alert
          v-if="error"
          type="error"
          :title="t('common.error')"
          :content="error"
          class="error-alert"
        />
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { CopyOutline as CopyIcon } from '@vicons/ionicons5'
import * as nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

const { t } = useI18n()
const message = useMessage()

const messageText = ref('')
const privateKey = ref('')
const publicKey = ref('')
const signature = ref('')
const error = ref('')

const generateKeyPair = () => {
  try {
    const keyPair = nacl.sign.keyPair()
    privateKey.value = encodeBase64(keyPair.secretKey)
    publicKey.value = encodeBase64(keyPair.publicKey)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const sign = () => {
  try {
    if (!messageText.value || !privateKey.value) {
      throw new Error(t('encrypt.ed25519.allFieldsRequired'))
    }

    const messageBytes = new TextEncoder().encode(messageText.value)
    const privateKeyBytes = decodeBase64(privateKey.value)
    const signatureBytes = nacl.sign.detached(messageBytes, privateKeyBytes)
    signature.value = encodeBase64(signatureBytes)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const verify = () => {
  try {
    if (!messageText.value || !signature.value || !publicKey.value) {
      throw new Error(t('encrypt.ed25519.allFieldsRequired'))
    }

    const messageBytes = new TextEncoder().encode(messageText.value)
    const signatureBytes = decodeBase64(signature.value)
    const publicKeyBytes = decodeBase64(publicKey.value)
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)

    if (isValid) {
      message.success(t('encrypt.ed25519.verificationSuccess'))
    } else {
      message.error(t('encrypt.ed25519.verificationFailed'))
    }
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copySignature = async () => {
  try {
    await navigator.clipboard.writeText(signature.value)
    message.success(t('common.copied'))
  } catch (e) {
    message.error(t('common.copyFailed'))
  }
}

const copyPublicKey = async () => {
  try {
    await navigator.clipboard.writeText(publicKey.value)
    message.success(t('common.copied'))
  } catch (e) {
    message.error(t('common.copyFailed'))
  }
}
</script>

<style scoped>
.ed25519-encrypt {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 