<template>
  <div class="ed25519-sign">
    <n-card :title="t('encrypt.ed25519Sign.title')">
      <!-- 消息输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ed25519Sign.message') }}</n-text>
        <n-input 
          v-model:value="messageText" 
          type="textarea"
          :placeholder="t('encrypt.ed25519Sign.messagePlaceholder')" 
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.ed25519Sign.charCount', { count: messageText.length }) }}</n-text>
        </div>
      </div>

      <!-- 私钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ed25519Sign.privateKey') }}</n-text>
        <n-input 
          v-model:value="privateKey" 
          type="textarea"
          :placeholder="t('encrypt.ed25519Sign.privateKeyPlaceholder')" 
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="privateKey">
          <n-text depth="3">{{ t('encrypt.ed25519Sign.length') }}：{{ privateKey.length }} {{ t('encrypt.ed25519Sign.characters') }}</n-text>
        </div>
      </div>

      <!-- 公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ed25519Sign.publicKey') }}</n-text>
        <n-input 
          v-model:value="publicKey" 
          type="textarea"
          :placeholder="t('encrypt.ed25519Sign.publicKeyPlaceholder')" 
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="publicKey">
          <n-text depth="3">{{ t('encrypt.ed25519Sign.length') }}：{{ publicKey.length }} {{ t('encrypt.ed25519Sign.characters') }}</n-text>
        </div>
      </div>

      <!-- 签名区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ed25519Sign.signature') }}</n-text>
        <n-input 
          v-model:value="signature" 
          type="textarea"
          :placeholder="t('encrypt.ed25519Sign.signaturePlaceholder')" 
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="signature">
          <n-text depth="3">{{ t('encrypt.ed25519Sign.length') }}：{{ signature.length }} {{ t('encrypt.ed25519Sign.characters') }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
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
      </div>

      <!-- Signature Information 区域 -->
      <div v-if="publicKey || signature" class="signature-info-overview">
        <n-alert type="info" :title="t('encrypt.ed25519Sign.signatureInfo')" class="mb-4">
          <template #default>
            <div class="signature-info-grid">
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.algorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.ed25519Sign.ed25519Algorithm') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.curve') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.ed25519Sign.curve25519') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.keyLength') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.ed25519Sign.keyLengthValue') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.security') }}:</strong> 
                <n-tag :type="getSecurityType()" size="small">{{ getSecurityStatus() }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.signatureFormat') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.ed25519Sign.base64') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.keyStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ publicKey ? t('encrypt.ed25519Sign.generated') : t('encrypt.ed25519Sign.notGenerated') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.signatureStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ getSignatureStatus() }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.keyGenTime') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGenTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.signatureTime') }}:</strong> 
                <n-tag type="info" size="small">{{ signatureComputeTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.verificationTime') }}:</strong> 
                <n-tag type="info" size="small">{{ verificationTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.generated') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.ed25519Sign.notGenerated') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ed25519Sign.signed') }}:</strong> 
                <n-tag type="info" size="small">{{ signatureTime || t('encrypt.ed25519Sign.notSigned') }}</n-tag>
              </div>
            </div>
            <!-- 安全性说明 -->
            <div class="security-note">
              <n-text depth="3">
                <strong>{{ t('encrypt.ed25519Sign.securityNote') }}:</strong> {{ t('encrypt.ed25519Sign.securityDescription') }}
              </n-text>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 验证结果显示 -->
      <div v-if="verificationResult !== null" class="verification-section">
        <n-text>{{ t('encrypt.ed25519Sign.verificationResult') }}</n-text>
        <n-alert :type="verificationResult ? 'success' : 'error'" :title="verificationResult ? t('encrypt.ed25519Sign.verificationSuccess') : t('encrypt.ed25519Sign.verificationFailed')" />
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="ed25519" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import * as nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
// 导入工具描述组件
import ToolDescription from '@/components/common/ToolDescription.vue'

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
const keyGeneratedTime = ref('') // 密钥生成时间
const signatureTime = ref('') // 签名时间
const keyGenTime = ref(0) // 密钥生成耗时
const signatureComputeTime = ref(0) // 签名计算耗时
const verificationTime = ref(0) // 验证耗时

// 获取安全性状态
const getSecurityStatus = () => {
  return t('encrypt.ed25519Sign.highlySecure')
}

// 获取安全性类型（用于标签颜色）
const getSecurityType = () => {
  return 'success'
}

// 获取签名状态
const getSignatureStatus = () => {
  if (verificationResult.value === true) {
    return t('encrypt.ed25519Sign.verified')
  } else if (verificationResult.value === false) {
    return t('encrypt.ed25519Sign.verificationFailed')
  } else if (signature.value) {
    return t('encrypt.ed25519Sign.signed')
  } else {
    return t('encrypt.ed25519Sign.notSigned')
  }
}

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''
    verificationResult.value = null

    const startTime = performance.now()

    const keyPair = nacl.sign.keyPair()
    privateKey.value = encodeBase64(keyPair.secretKey)
    publicKey.value = encodeBase64(keyPair.publicKey)

    // 记录生成时间和耗时
    const endTime = performance.now()
    keyGenTime.value = Math.round(endTime - startTime)
    keyGeneratedTime.value = new Date().toLocaleString()
    
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

    const startTime = performance.now()

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

    // 记录签名时间和耗时
    const endTime = performance.now()
    signatureComputeTime.value = Math.round(endTime - startTime)
    signatureTime.value = new Date().toLocaleString()
    
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

    const startTime = performance.now()

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

    // 记录验证耗时
    const endTime = performance.now()
    verificationTime.value = Math.round(endTime - startTime)
    
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
  keyGeneratedTime.value = ''
  signatureTime.value = ''
  keyGenTime.value = 0
  signatureComputeTime.value = 0
  verificationTime.value = 0
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.ed25519-sign {
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

.verification-section {
  margin: 20px 0;
}

.verification-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.error-alert {
  margin-top: 16px;
}

.signature-info-overview {
  margin: 20px 0;
}

.signature-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.signature-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.security-note {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: rgba(40, 167, 69, 0.1);
  border-radius: 4px;
  border-left: 3px solid #28a745;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>