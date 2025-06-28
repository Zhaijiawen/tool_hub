<template>
  <div class="ed25519-encrypt">
    <n-card :title="t('encrypt.ed25519.title')">
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ed25519.message') }}</n-text>
        <n-input 
          v-model:value="messageText" 
          type="textarea" 
          :placeholder="t('encrypt.ed25519.messagePlaceholder')"
          :autosize="{ minRows: 10, maxRows: 20 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.ed25519.charCount', { count: messageText.length }) }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="generateKeyPair" type="info">
          {{ t('encrypt.ed25519.generateKeyPair') }}
        </n-button>
        <n-button @click="sign" type="primary" :disabled="!messageText || !privateKey">
          {{ t('encrypt.ed25519.sign') }}
        </n-button>
        <n-button @click="verify" type="primary" :disabled="!messageText || !signature || !publicKey">
          {{ t('encrypt.ed25519.verify') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 密钥和签名显示区域 -->
      <div class="keys-section">
        <n-collapse>
          <n-collapse-item :title="t('encrypt.ed25519.privateKey')" name="private">
            <n-input 
              v-model:value="privateKey" 
              type="textarea" 
              :placeholder="t('encrypt.ed25519.privateKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
            />
            <n-button @click="copyPrivateKey" size="small" class="copy-key-btn">
              {{ t('common.copy') }}
            </n-button>
          </n-collapse-item>
          <n-collapse-item :title="t('encrypt.ed25519.publicKey')" name="public">
            <n-input 
              v-model:value="publicKey" 
              type="textarea" 
              :placeholder="t('encrypt.ed25519.publicKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
              readonly
            />
            <n-button @click="copyPublicKey" size="small" class="copy-key-btn">
              {{ t('common.copy') }}
            </n-button>
          </n-collapse-item>
          <n-collapse-item v-if="signature" :title="t('encrypt.ed25519.signature')" name="signature">
            <n-input 
              v-model:value="signature" 
              type="textarea" 
              :placeholder="t('encrypt.ed25519.signaturePlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
              readonly
            />
            <n-button @click="copySignature" size="small" class="copy-key-btn">
              {{ t('common.copy') }}
            </n-button>
          </n-collapse-item>
        </n-collapse>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import * as nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const messageText = ref('')
const privateKey = ref('')
const publicKey = ref('')
const signature = ref('')
const error = ref('')

// 生成密钥对
const generateKeyPair = () => {
  try {
    const keyPair = nacl.sign.keyPair()
    privateKey.value = encodeBase64(keyPair.secretKey)
    publicKey.value = encodeBase64(keyPair.publicKey)
    
    message.success(t('encrypt.ed25519.keysGenerated'))
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 签名
const sign = () => {
  try {
    if (!messageText.value.trim()) {
      error.value = t('encrypt.ed25519.inputRequired')
      return
    }
    
    if (!privateKey.value) {
      error.value = t('encrypt.ed25519.privateKeyRequired')
      return
    }

    const messageBytes = new TextEncoder().encode(messageText.value)
    const privateKeyBytes = decodeBase64(privateKey.value)
    const signatureBytes = nacl.sign.detached(messageBytes, privateKeyBytes)
    signature.value = encodeBase64(signatureBytes)
    
    message.success(t('encrypt.ed25519.signSuccess'))
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 验证
const verify = () => {
  try {
    if (!messageText.value.trim()) {
      error.value = t('encrypt.ed25519.inputRequired')
      return
    }
    
    if (!signature.value) {
      error.value = t('encrypt.ed25519.signatureRequired')
      return
    }
    
    if (!publicKey.value) {
      error.value = t('encrypt.ed25519.publicKeyRequired')
      return
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
    message.error(t('common.error'))
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(messageText.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 复制私钥
const copyPrivateKey = async () => {
  try {
    await navigator.clipboard.writeText(privateKey.value)
    message.success(t('encrypt.ed25519.privateKeyCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 复制公钥
const copyPublicKey = async () => {
  try {
    await navigator.clipboard.writeText(publicKey.value)
    message.success(t('encrypt.ed25519.publicKeyCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 复制签名
const copySignature = async () => {
  try {
    await navigator.clipboard.writeText(signature.value)
    message.success(t('encrypt.ed25519.signatureCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  messageText.value = ''
  privateKey.value = ''
  publicKey.value = ''
  signature.value = ''
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.ed25519-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section {
  margin-bottom: 20px;
}

.input-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.input-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  margin: 20px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.keys-section {
  margin: 20px 0;
}

.copy-key-btn {
  margin-top: 8px;
}

.error-alert {
  margin-top: 16px;
}
</style>