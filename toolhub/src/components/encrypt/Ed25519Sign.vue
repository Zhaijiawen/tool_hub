<template>
  <div class="ed25519-sign">
    <n-card :title="t('encrypt.ed25519Sign.title')">
      <n-form>
        <n-form-item :label="t('encrypt.ed25519Sign.message')">
          <n-input 
            v-model:value="messageText" 
            type="textarea"
            :placeholder="t('encrypt.ed25519Sign.messagePlaceholder')" 
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info">
            <n-text depth="3">{{ t('encrypt.ed25519Sign.charCount', { count: messageText.length }) }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.ed25519Sign.privateKey')">
          <n-input 
            v-model:value="privateKey" 
            type="textarea"
            :placeholder="t('encrypt.ed25519Sign.privateKeyPlaceholder')" 
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="privateKey">
            <n-text depth="3">{{ t('encrypt.ed25519Sign.length') }}：{{ privateKey.length }} {{ t('encrypt.ed25519Sign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.ed25519Sign.publicKey')">
          <n-input 
            v-model:value="publicKey" 
            type="textarea"
            :placeholder="t('encrypt.ed25519Sign.publicKeyPlaceholder')" 
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="publicKey">
            <n-text depth="3">{{ t('encrypt.ed25519Sign.length') }}：{{ publicKey.length }} {{ t('encrypt.ed25519Sign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.ed25519Sign.signature')">
          <n-input 
            v-model:value="signature" 
            type="textarea"
            :placeholder="t('encrypt.ed25519Sign.signaturePlaceholder')" 
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="signature">
            <n-text depth="3">{{ t('encrypt.ed25519Sign.length') }}：{{ signature.length }} {{ t('encrypt.ed25519Sign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-space>
          <n-button @click="generateKeyPair" type="primary" :loading="isGenerating">
            {{ t('encrypt.ed25519Sign.generateKeyPair') }}
          </n-button>
          <n-button @click="sign" :disabled="!messageText || !privateKey" :loading="isSigning">
            {{ t('encrypt.ed25519Sign.sign') }}
          </n-button>
          <n-button @click="verify" :disabled="!messageText || !signature || !publicKey" :loading="isVerifying">
            {{ t('encrypt.ed25519Sign.verify') }}
          </n-button>
          <n-button @click="clearAll">
            {{ t('common.clear') }}
          </n-button>
        </n-space>
        
        <!-- 验证结果显示 -->
        <n-form-item v-if="verificationResult !== null" :label="t('encrypt.ed25519Sign.verificationResult')">
          <n-alert :type="verificationResult ? 'success' : 'error'" :title="verificationResult ? t('encrypt.ed25519Sign.verificationSuccess') : t('encrypt.ed25519Sign.verificationFailed')" />
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
const isGenerating = ref(false)
const isSigning = ref(false)
const isVerifying = ref(false)
const verificationResult = ref(null)

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''
    verificationResult.value = null

    const keyPair = nacl.sign.keyPair()
    privateKey.value = encodeBase64(keyPair.secretKey)
    publicKey.value = encodeBase64(keyPair.publicKey)
    
    message.success(t('encrypt.ed25519Sign.keyPairGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isGenerating.value = false
  }
}

// 签名
const sign = async () => {
  try {
    if (!messageText.value || !privateKey.value) {
      throw new Error(t('encrypt.ed25519Sign.allFieldsRequired'))
    }

    isSigning.value = true
    error.value = ''
    verificationResult.value = null

    // 验证私钥Base64格式
    let privateKeyBytes
    try {
      privateKeyBytes = decodeBase64(privateKey.value)
    } catch (e) {
      throw new Error(t('encrypt.ed25519Sign.invalidBase64Format'))
    }

    const messageBytes = new TextEncoder().encode(messageText.value)
    const signatureBytes = nacl.sign.detached(messageBytes, privateKeyBytes)
    signature.value = encodeBase64(signatureBytes)
    
    message.success(t('encrypt.ed25519Sign.signatureCreated'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isSigning.value = false
  }
}

// 验证签名
const verify = async () => {
  try {
    if (!messageText.value || !signature.value || !publicKey.value) {
      throw new Error(t('encrypt.ed25519Sign.allFieldsRequired'))
    }

    isVerifying.value = true
    error.value = ''
    verificationResult.value = null

    // 验证Base64格式并解码
    let signatureBytes, publicKeyBytes
    try {
      signatureBytes = decodeBase64(signature.value)
    } catch (e) {
      throw new Error(t('encrypt.ed25519Sign.invalidBase64Format'))
    }
    
    try {
      publicKeyBytes = decodeBase64(publicKey.value)
    } catch (e) {
      throw new Error(t('encrypt.ed25519Sign.invalidBase64Format'))
    }

    const messageBytes = new TextEncoder().encode(messageText.value)
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)
    
    verificationResult.value = isValid
    if (isValid) {
      message.success(t('encrypt.ed25519Sign.verificationSuccess'))
    } else {
      message.error(t('encrypt.ed25519Sign.verificationFailed'))
    }
  } catch (e) {
    error.value = e.message
    verificationResult.value = false
    message.error(t('common.error'))
  } finally {
    isVerifying.value = false
  }
}

// 清空所有
const clearAll = () => {
  messageText.value = ''
  privateKey.value = ''
  publicKey.value = ''
  signature.value = ''
  error.value = ''
  verificationResult.value = null
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.ed25519-sign {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-alert {
  margin-top: 16px;
}
</style>