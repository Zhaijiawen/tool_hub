<template>
  <div class="rsa-sign">
    <n-card :title="t('encrypt.rsaSign.title')">
      <!-- 参数配置区域 -->
      <div class="parameters-section">
        <n-form :model="formData" label-placement="left" label-width="120px">
          <n-form-item :label="t('encrypt.rsaSign.keyLength')">
            <n-select v-model:value="selectedKeyLength" :options="keyLengthOptions" />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.rsaSign.hashAlgorithm')">
            <n-select v-model:value="selectedHashAlgorithm" :options="hashAlgorithmOptions" />
          </n-form-item>
        </n-form>
      </div>

      <!-- 消息输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.rsaSign.message') }}</n-text>
        <n-input 
          v-model:value="messageText" 
          type="textarea" 
          :placeholder="t('encrypt.rsaSign.messagePlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.rsaSign.charCount', { count: messageText.length }) }}</n-text>
        </div>
      </div>

      <!-- 私钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.rsaSign.privateKey') }}</n-text>
        <n-input 
          v-model:value="privateKey" 
          type="textarea" 
          :placeholder="t('encrypt.rsaSign.privateKeyPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="privateKey">
          <n-text depth="3">{{ t('encrypt.rsaSign.length') }}：{{ privateKey.length }} {{ t('encrypt.rsaSign.characters') }}</n-text>
        </div>
      </div>

      <!-- 公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.rsaSign.publicKey') }}</n-text>
        <n-input 
          v-model:value="publicKey" 
          type="textarea" 
          :placeholder="t('encrypt.rsaSign.publicKeyPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="publicKey">
          <n-text depth="3">{{ t('encrypt.rsaSign.length') }}：{{ publicKey.length }} {{ t('encrypt.rsaSign.characters') }}</n-text>
        </div>
      </div>

      <!-- 签名区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.rsaSign.signature') }}</n-text>
        <n-input 
          v-model:value="signature" 
          type="textarea" 
          :placeholder="t('encrypt.rsaSign.signaturePlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="signature">
          <n-text depth="3">{{ t('encrypt.rsaSign.length') }}：{{ signature.length }} {{ t('encrypt.rsaSign.characters') }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
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
      </div>

      <!-- Signature Information 区域 -->
      <div v-if="publicKey || signature" class="signature-info-overview">
        <n-alert type="info" :title="t('encrypt.rsaSign.signatureInfo')" class="mb-4">
          <template #default>
            <div class="signature-info-grid">
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.algorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.rsaSign.rsaAlgorithm') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.keyLength') }}:</strong> 
                <n-tag type="info" size="small">{{ selectedKeyLength }} {{ t('encrypt.rsaSign.bits') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.hashAlgorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ selectedHashAlgorithm }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.security') }}:</strong> 
                <n-tag :type="getSecurityType()" size="small">{{ getSecurityStatus() }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.signatureFormat') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.rsaSign.base64') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.keyStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ publicKey ? t('encrypt.rsaSign.generated') : t('encrypt.rsaSign.notGenerated') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.signatureStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ getSignatureStatus() }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.keyGenTime') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGenTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.signatureTime') }}:</strong> 
                <n-tag type="info" size="small">{{ signatureComputeTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.verificationTime') }}:</strong> 
                <n-tag type="info" size="small">{{ verificationTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.generated') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.rsaSign.notGenerated') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.rsaSign.signed') }}:</strong> 
                <n-tag type="info" size="small">{{ signatureTime || t('encrypt.rsaSign.notSigned') }}</n-tag>
              </div>
            </div>
            <!-- 安全性说明 -->
            <div class="security-note">
              <n-text depth="3">
                <strong>{{ t('encrypt.rsaSign.securityNote') }}:</strong> {{ t('encrypt.rsaSign.securityDescription') }}
              </n-text>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 验证结果显示 -->
      <div v-if="verificationResult !== null" class="verification-section">
        <n-text>{{ t('encrypt.rsaSign.verificationResult') }}</n-text>
        <n-alert :type="verificationResult ? 'success' : 'error'" :title="verificationResult ? t('encrypt.rsaSign.verificationSuccess') : t('encrypt.rsaSign.verificationFailed')" />
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="rsa" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
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
const keyGeneratedTime = ref('') // 密钥生成时间
const signatureTime = ref('') // 签名时间
const keyGenTime = ref(0) // 密钥生成耗时
const signatureComputeTime = ref(0) // 签名计算耗时
const verificationTime = ref(0) // 验证耗时

// 表单数据
const formData = reactive({
  keyLength: selectedKeyLength,
  hashAlgorithm: selectedHashAlgorithm
})

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

// 获取安全性状态
const getSecurityStatus = () => {
  if (selectedKeyLength.value === 1024) {
    return t('encrypt.rsaSign.insecure')
  } else if (selectedKeyLength.value === 2048) {
    return t('encrypt.rsaSign.secure')
  } else {
    return t('encrypt.rsaSign.highlySecure')
  }
}

// 获取安全性类型（用于标签颜色）
const getSecurityType = () => {
  if (selectedKeyLength.value === 1024) {
    return 'error'
  } else if (selectedKeyLength.value === 2048) {
    return 'success'
  } else {
    return 'success'
  }
}

// 获取签名状态
const getSignatureStatus = () => {
  if (verificationResult.value === true) {
    return t('encrypt.rsaSign.verified')
  } else if (verificationResult.value === false) {
    return t('encrypt.rsaSign.verificationFailed')
  } else if (signature.value) {
    return t('encrypt.rsaSign.signed')
  } else {
    return t('encrypt.rsaSign.notSigned')
  }
}

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

    const startTime = performance.now()

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

    // 记录生成时间和耗时
    const endTime = performance.now()
    keyGenTime.value = Math.round(endTime - startTime)
    keyGeneratedTime.value = new Date().toLocaleString()

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

    const startTime = performance.now()

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

    // 记录签名时间和耗时
    const endTime = performance.now()
    signatureComputeTime.value = Math.round(endTime - startTime)
    signatureTime.value = new Date().toLocaleString()

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

    const startTime = performance.now()

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

    // 记录验证耗时
    const endTime = performance.now()
    verificationTime.value = Math.round(endTime - startTime)

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
  keyGeneratedTime.value = ''
  signatureTime.value = ''
  keyGenTime.value = 0
  signatureComputeTime.value = 0
  verificationTime.value = 0
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.rsa-sign {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.parameters-section {
  margin-bottom: 20px;
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