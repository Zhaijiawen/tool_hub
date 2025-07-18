<template>
  <div class="rsa-sign">
    <n-card :title="t('encrypt.rsaSign.title')">
      <!-- 密钥长度选择 -->
      <div class="key-length-section">
        <n-text>{{ t('encrypt.rsaSign.keyLength') }}</n-text>
        <n-select v-model:value="selectedKeyLength" :options="keyLengthOptions" />
      </div>

      <!-- 哈希算法选择 -->
      <div class="hash-algorithm-section">
        <n-text>{{ t('encrypt.rsaSign.hashAlgorithm') }}</n-text>
        <n-select v-model:value="selectedHashAlgorithm" :options="hashAlgorithmOptions" />
      </div>

      <n-form>
        <n-form-item :label="t('encrypt.rsaSign.message')">
          <n-input 
            v-model:value="messageText" 
            type="textarea" 
            :placeholder="t('encrypt.rsaSign.messagePlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info">
            <n-text depth="3">{{ t('encrypt.rsaSign.charCount', { count: messageText.length }) }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.rsaSign.privateKey')">
          <n-input 
            v-model:value="privateKey" 
            type="textarea" 
            :placeholder="t('encrypt.rsaSign.privateKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="privateKey">
            <n-text depth="3">{{ t('encrypt.rsaSign.length') }}：{{ privateKey.length }} {{ t('encrypt.rsaSign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.rsaSign.publicKey')">
          <n-input 
            v-model:value="publicKey" 
            type="textarea" 
            :placeholder="t('encrypt.rsaSign.publicKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="publicKey">
            <n-text depth="3">{{ t('encrypt.rsaSign.length') }}：{{ publicKey.length }} {{ t('encrypt.rsaSign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.rsaSign.signature')">
          <n-input 
            v-model:value="signature" 
            type="textarea" 
            :placeholder="t('encrypt.rsaSign.signaturePlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="signature">
            <n-text depth="3">{{ t('encrypt.rsaSign.length') }}：{{ signature.length }} {{ t('encrypt.rsaSign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-space>
          <n-button @click="generateKeyPair" type="primary" :loading="isGenerating">
            {{ t('encrypt.rsaSign.generateKeyPair') }}
          </n-button>
          <n-button @click="sign" :disabled="!messageText || !privateKey" :loading="isSigning">
            {{ t('encrypt.rsaSign.sign') }}
          </n-button>
          <n-button @click="verify" :disabled="!messageText || !signature || !publicKey" :loading="isVerifying">
            {{ t('encrypt.rsaSign.verify') }}
          </n-button>
          <n-button @click="clearAll">
            {{ t('common.clear') }}
          </n-button>
        </n-space>
        
        <!-- 验证结果显示 -->
        <n-form-item v-if="verificationResult !== null" :label="t('encrypt.rsaSign.verificationResult')">
          <n-alert :type="verificationResult ? 'success' : 'error'" :title="verificationResult ? t('encrypt.rsaSign.verificationSuccess') : t('encrypt.rsaSign.verificationFailed')" />
        </n-form-item>
        
        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-form>
    </n-card>
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="rsaSign" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
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
const selectedKeyLength = ref(2048)
const selectedHashAlgorithm = ref('SHA-256')
const verificationResult = ref(null)

// 密钥长度选项
const keyLengthOptions = [
  { label: '1024 bits', value: 1024 },
  { label: '2048 bits', value: 2048 },
  { label: '4096 bits', value: 4096 }
]

// 哈希算法选项
const hashAlgorithmOptions = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' }
]

// 将ArrayBuffer转换为Base64字符串
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// 将Base64字符串转换为ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  try {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  } catch (e) {
    throw new Error(t('encrypt.rsaSign.invalidBase64Format'))
  }
}

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''

    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: selectedKeyLength.value,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: selectedHashAlgorithm.value
      },
      true,
      ['sign', 'verify']
    )

    // 导出私钥
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    privateKey.value = arrayBufferToBase64(privateKeyBuffer)

    // 导出公钥
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
    publicKey.value = arrayBufferToBase64(publicKeyBuffer)

    message.success(t('encrypt.rsaSign.keyPairGenerated'))
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
      throw new Error(t('encrypt.rsaSign.allFieldsRequired'))
    }

    isSigning.value = true
    error.value = ''
    verificationResult.value = null

    // 导入私钥
    const privateKeyBuffer = base64ToArrayBuffer(privateKey.value)
    const privateKeyObj = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: selectedHashAlgorithm.value
      },
      false,
      ['sign']
    )

    // 计算消息哈希
    const messageBytes = new TextEncoder().encode(messageText.value)
    const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.value, messageBytes)

    // 签名
    const signatureBuffer = await crypto.subtle.sign(
      {
        name: 'RSASSA-PKCS1-v1_5'
      },
      privateKeyObj,
      hashBuffer
    )

    signature.value = arrayBufferToBase64(signatureBuffer)
    message.success(t('encrypt.rsaSign.signatureCreated'))
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
      throw new Error(t('encrypt.rsaSign.allFieldsRequired'))
    }

    isVerifying.value = true
    error.value = ''
    verificationResult.value = null

    // 导入公钥
    const publicKeyBuffer = base64ToArrayBuffer(publicKey.value)
    const publicKeyObj = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: selectedHashAlgorithm.value
      },
      false,
      ['verify']
    )

    // 计算消息哈希
    const messageBytes = new TextEncoder().encode(messageText.value)
    const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.value, messageBytes)

    // 验证签名
    const signatureBuffer = base64ToArrayBuffer(signature.value)
    const isValid = await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5'
      },
      publicKeyObj,
      signatureBuffer,
      hashBuffer
    )

    verificationResult.value = isValid
    if (isValid) {
      message.success(t('encrypt.rsaSign.verificationSuccess'))
    } else {
      message.error(t('encrypt.rsaSign.verificationFailed'))
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
.rsa-sign {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.key-length-section,
.hash-algorithm-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>