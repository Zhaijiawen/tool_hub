<template>
  <div class="rsa-sign">
    <n-card :title="t('encrypt.rsaSign.title')">
      <n-form>
        <n-form-item :label="t('encrypt.rsaSign.message')">
          <n-input v-model:value="messageText" type="textarea" :placeholder="t('encrypt.rsaSign.messagePlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" />
        </n-form-item>
        <n-form-item :label="t('encrypt.rsaSign.privateKey')">
          <n-input v-model:value="privateKey" type="textarea" :placeholder="t('encrypt.rsaSign.privateKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" />
        </n-form-item>
        <n-form-item :label="t('encrypt.rsaSign.publicKey')">
          <n-input v-model:value="publicKey" type="textarea" :placeholder="t('encrypt.rsaSign.publicKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" />
        </n-form-item>
        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.rsaSign.generateKeyPair') }}
          </n-button>
          <n-button @click="sign" :disabled="!messageText || !privateKey">
            {{ t('encrypt.rsaSign.sign') }}
          </n-button>
          <n-button @click="verify" :disabled="!messageText || !signature || !publicKey">
            {{ t('encrypt.rsaSign.verify') }}
          </n-button>
        </n-space>
        <n-form-item v-if="signature" :label="t('encrypt.rsaSign.signature')">
          <n-input v-model:value="signature" type="textarea" readonly :autosize="{ minRows: 3, maxRows: 10 }" />
          <template #suffix>
            <n-button @click="copySignature" quaternary circle>
              <template #icon>
                <n-icon><copy-icon /></n-icon>
              </template>
            </n-button>
          </template>
        </n-form-item>
        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
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
      throw new Error(t('encrypt.rsaSign.allFieldsRequired'))
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
      throw new Error(t('encrypt.rsaSign.allFieldsRequired'))
    }

    const messageBytes = new TextEncoder().encode(messageText.value)
    const signatureBytes = decodeBase64(signature.value)
    const publicKeyBytes = decodeBase64(publicKey.value)
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)

    if (isValid) {
      message.success(t('encrypt.rsaSign.verificationSuccess'))
    } else {
      message.error(t('encrypt.rsaSign.verificationFailed'))
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
</script>

<style scoped>
.rsa-sign {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style>