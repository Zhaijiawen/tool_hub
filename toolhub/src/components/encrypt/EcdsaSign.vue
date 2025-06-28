<template>
  <div class="ecdsa-sign">
    <n-card :title="t('encrypt.ecdsaSign.title')">
      <n-form>
        <n-form-item :label="t('encrypt.ecdsaSign.message')">
          <n-input v-model:value="messageText" type="textarea" :placeholder="t('encrypt.ecdsaSign.messagePlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" />
        </n-form-item>
        <n-form-item :label="t('encrypt.ecdsaSign.privateKey')">
          <n-input v-model:value="privateKey" type="textarea"
            :placeholder="t('encrypt.ecdsaSign.privateKeyPlaceholder')" :autosize="{ minRows: 3, maxRows: 10 }" />
        </n-form-item>
        <n-form-item :label="t('encrypt.ecdsaSign.publicKey')">
          <n-input v-model:value="publicKey" type="textarea" :placeholder="t('encrypt.ecdsaSign.publicKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" />
        </n-form-item>
        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ecdsaSign.generateKeyPair') }}
          </n-button>
          <n-button @click="sign" :disabled="!messageText || !privateKey">
            {{ t('encrypt.ecdsaSign.sign') }}
          </n-button>
          <n-button @click="verify" :disabled="!messageText || !signature || !publicKey">
            {{ t('encrypt.ecdsaSign.verify') }}
          </n-button>
        </n-space>
        <n-form-item v-if="signature" :label="t('encrypt.ecdsaSign.signature')">
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
import { ec as EC } from 'elliptic'

const { t } = useI18n()
const message = useMessage()

const ec = new EC('secp256k1')

const messageText = ref('')
const privateKey = ref('')
const publicKey = ref('')
const signature = ref('')
const error = ref('')

const generateKeyPair = () => {
  try {
    const key = ec.genKeyPair()
    privateKey.value = key.getPrivate('hex')
    publicKey.value = key.getPublic('hex')
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const sign = async () => {
  try {
    if (!messageText.value || !privateKey.value) {
      throw new Error(t('encrypt.ecdsaSign.allFieldsRequired'))
    }
    const key = ec.keyFromPrivate(privateKey.value, 'hex')
    const msgHash = await sha256(messageText.value)
    const sig = key.sign(msgHash)
    signature.value = sig.toDER('hex')
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const verify = async () => {
  try {
    if (!messageText.value || !signature.value || !publicKey.value) {
      throw new Error(t('encrypt.ecdsaSign.allFieldsRequired'))
    }
    const key = ec.keyFromPublic(publicKey.value, 'hex')
    const msgHash = await sha256(messageText.value)
    const isValid = key.verify(msgHash, signature.value)
    if (isValid) {
      message.success(t('encrypt.ecdsaSign.verificationSuccess'))
    } else {
      message.error(t('encrypt.ecdsaSign.verificationFailed'))
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

// 简单 sha256 工具
function sha256(msg) {
  if (window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder()
    return window.crypto.subtle.digest('SHA-256', encoder.encode(msg)).then(buf => {
      return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('')
    })
  } else {
    throw new Error('当前环境不支持SHA-256，请使用现代浏览器')
  }
}
</script>

<style scoped>
.ecdsa-sign {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style>