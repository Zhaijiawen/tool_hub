<template>
  <div class="ecdsa-sign">
    <!-- 工具简介 -->
    <ToolIntro toolKey="ecdsa" />

    <n-card :title="t('encrypt.ecdsaSign.title')">
      <!-- 参数配置区域 -->
      <div class="parameters-section">
        <n-form :model="formData" label-placement="left" label-width="120px">
          <n-form-item :label="t('encrypt.ecdsaSign.curve')">
            <n-select v-model:value="selectedCurve" :options="curveOptions" />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.ecdsaSign.hashAlgorithm')">
            <n-select v-model:value="selectedHashAlgorithm" :options="hashAlgorithmOptions" />
          </n-form-item>
        </n-form>
      </div>

      <!-- 消息输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdsaSign.message') }}</n-text>
        <n-input 
          v-model:value="messageText" 
          type="textarea" 
          :placeholder="t('encrypt.ecdsaSign.messagePlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.ecdsaSign.charCount', { count: messageText.length }) }}</n-text>
        </div>
      </div>

      <!-- 私钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdsaSign.privateKey') }}</n-text>
        <n-input 
          v-model:value="privateKey" 
          type="textarea"
          :placeholder="t('encrypt.ecdsaSign.privateKeyPlaceholder')" 
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="privateKey">
          <n-text depth="3">{{ t('encrypt.ecdsaSign.length') }}: {{ privateKey.length }} {{ t('encrypt.ecdsaSign.characters') }}</n-text>
        </div>
      </div>

      <!-- 公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdsaSign.publicKey') }}</n-text>
        <n-input 
          v-model:value="publicKey" 
          type="textarea" 
          :placeholder="t('encrypt.ecdsaSign.publicKeyPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="publicKey">
          <n-text depth="3">{{ t('encrypt.ecdsaSign.length') }}: {{ publicKey.length }} {{ t('encrypt.ecdsaSign.characters') }}</n-text>
        </div>
      </div>

      <!-- 签名区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdsaSign.signature') }}</n-text>
        <n-input 
          v-model:value="signature" 
          type="textarea"
          :placeholder="t('encrypt.ecdsaSign.signaturePlaceholder')" 
          :autosize="{ minRows: 3, maxRows: 10 }" 
        />
        <div class="input-info" v-if="signature">
          <n-text depth="3">{{ t('encrypt.ecdsaSign.length') }}: {{ signature.length }} {{ t('encrypt.ecdsaSign.characters') }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="generateKeyPair" type="primary" :loading="isGenerating">
          {{ t('encrypt.ecdsaSign.generateKeyPair') }}
        </n-button>
        <n-button @click="sign" :disabled="!messageText || !privateKey" :loading="isSigning">
          {{ t('encrypt.ecdsaSign.sign') }}
        </n-button>
        <n-button @click="verify" :disabled="!messageText || !signature || !publicKey" :loading="isVerifying">
          {{ t('encrypt.ecdsaSign.verify') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- Signature Information 区域 -->
      <div v-if="publicKey || signature" class="signature-info-overview">
        <n-alert type="info" :title="t('encrypt.ecdsaSign.signatureInfo')" class="mb-4">
          <template #default>
            <div class="signature-info-grid">
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.algorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.ecdsaSign.ecdsaAlgorithm') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.curve') }}:</strong> 
                <n-tag type="info" size="small">{{ selectedCurve }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.hashAlgorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ selectedHashAlgorithm }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.security') }}:</strong> 
                <n-tag :type="getSecurityType()" size="small">{{ getSecurityStatus() }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.signatureFormat') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.ecdsaSign.hexadecimal') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.keyStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ publicKey ? t('encrypt.ecdsaSign.generated') : t('encrypt.ecdsaSign.notGenerated') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.signatureStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ getSignatureStatus() }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.keyGenTime') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGenTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.signatureTime') }}:</strong> 
                <n-tag type="info" size="small">{{ signatureComputeTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.verificationTime') }}:</strong> 
                <n-tag type="info" size="small">{{ verificationTime }}ms</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.generated') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.ecdsaSign.notGenerated') }}</n-tag>
              </div>
              <div class="signature-info-item">
                <strong>{{ t('encrypt.ecdsaSign.signed') }}:</strong> 
                <n-tag type="info" size="small">{{ signatureTime || t('encrypt.ecdsaSign.notSigned') }}</n-tag>
              </div>
            </div>
            <!-- 安全性说明 -->
            <div class="security-note">
              <n-text depth="3">
                <strong>{{ t('encrypt.ecdsaSign.securityNote') }}:</strong> {{ t('encrypt.ecdsaSign.securityDescription') }}
              </n-text>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 验证结果显示 -->
      <div v-if="verificationResult !== null" class="verification-section">
        <n-text>{{ t('encrypt.ecdsaSign.verificationResult') }}</n-text>
        <n-alert :type="verificationResult ? 'success' : 'error'" :title="verificationResult ? t('encrypt.ecdsaSign.verificationSuccess') : t('encrypt.ecdsaSign.verificationFailed')" />
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="ecdsa" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

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
const selectedCurve = ref('P-256')
const selectedHashAlgorithm = ref('SHA-256')
const verificationResult = ref(null)
const keyGeneratedTime = ref('') // 密钥生成时间
const signatureTime = ref('') // 签名时间
const keyGenTime = ref(0) // 密钥生成耗时
const signatureComputeTime = ref(0) // 签名计算耗时
const verificationTime = ref(0) // 验证耗时

// 表单数据
const formData = reactive({
  curve: selectedCurve,
  hashAlgorithm: selectedHashAlgorithm
})

// 椭圆曲线选项 - 使用 Web Crypto API 支持的曲线
const curveOptions = [
  { label: 'P-256 (secp256r1)', value: 'P-256' },
  { label: 'P-384 (secp384r1)', value: 'P-384' }
]

// 哈希算法选项
const hashAlgorithmOptions = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' }
]

// 获取安全性状态
const getSecurityStatus = () => {
  if (selectedCurve.value === 'P-256') {
    return t('encrypt.ecdsaSign.secure')
  } else if (selectedCurve.value === 'P-384') {
    return t('encrypt.ecdsaSign.highlySecure')
  } else {
    return t('encrypt.ecdsaSign.secure')
  }
}

// 获取安全性类型（用于标签颜色）
const getSecurityType = () => {
  if (selectedCurve.value === 'P-256') {
    return 'success'
  } else if (selectedCurve.value === 'P-384') {
    return 'success'
  } else {
    return 'success'
  }
}

// 获取签名状态
const getSignatureStatus = () => {
  if (verificationResult.value === true) {
    return t('encrypt.ecdsaSign.verified')
  } else if (verificationResult.value === false) {
    return t('encrypt.ecdsaSign.verificationFailed')
  } else if (signature.value) {
    return t('encrypt.ecdsaSign.signed')
  } else {
    return t('encrypt.ecdsaSign.notSigned')
  }
}

// 计算消息哈希
const calculateHash = async (message) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.value, data)
  return Array.from(new Uint8Array(hashBuffer)).map(x => x.toString(16).padStart(2, '0')).join('')
}

// 将十六进制字符串转换为 ArrayBuffer
const hexToArrayBuffer = (hex) => {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

// 将 ArrayBuffer 转换为十六进制字符串
const arrayBufferToHex = (buffer) => {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''
    verificationResult.value = null

    const startTime = performance.now()

    // 使用 Web Crypto API 生成 ECDSA 密钥对
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: selectedCurve.value
      },
      true, // extractable
      ['sign', 'verify']
    )

    // 导出私钥
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    privateKey.value = arrayBufferToHex(privateKeyBuffer)

    // 导出公钥
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
    publicKey.value = arrayBufferToHex(publicKeyBuffer)

    // 记录生成时间和耗时
    const endTime = performance.now()
    keyGenTime.value = Math.round(endTime - startTime)
    keyGeneratedTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.ecdsaSign.keyPairGenerated'))
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
      throw new Error(t('encrypt.ecdsaSign.allFieldsRequired'))
    }

    isSigning.value = true
    error.value = ''
    verificationResult.value = null

    const startTime = performance.now()

    // 验证私钥格式
    if (!/^[0-9a-fA-F]+$/.test(privateKey.value)) {
      throw new Error(t('encrypt.ecdsaSign.invalidPrivateKeyFormat'))
    }

    // 导入私钥
    const privateKeyBuffer = hexToArrayBuffer(privateKey.value)
    const privateKeyObj = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'ECDSA',
        namedCurve: selectedCurve.value
      },
      false,
      ['sign']
    )

    // 计算消息哈希
    const encoder = new TextEncoder()
    const messageBuffer = encoder.encode(messageText.value)
    const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.value, messageBuffer)

    // 签名
    const signatureBuffer = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: selectedHashAlgorithm.value }
      },
      privateKeyObj,
      hashBuffer
    )

    signature.value = arrayBufferToHex(signatureBuffer)

    // 记录签名时间和耗时
    const endTime = performance.now()
    signatureComputeTime.value = Math.round(endTime - startTime)
    signatureTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.ecdsaSign.signatureCreated'))
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
      throw new Error(t('encrypt.ecdsaSign.allFieldsRequired'))
    }

    isVerifying.value = true
    error.value = ''
    verificationResult.value = null

    const startTime = performance.now()

    // 验证格式
    if (!/^[0-9a-fA-F]+$/.test(publicKey.value)) {
      throw new Error(t('encrypt.ecdsaSign.invalidPublicKeyFormat'))
    }
    if (!/^[0-9a-fA-F]+$/.test(signature.value)) {
      throw new Error(t('encrypt.ecdsaSign.invalidSignatureFormat'))
    }

    // 导入公钥
    const publicKeyBuffer = hexToArrayBuffer(publicKey.value)
    const publicKeyObj = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'ECDSA',
        namedCurve: selectedCurve.value
      },
      false,
      ['verify']
    )

    // 计算消息哈希
    const encoder = new TextEncoder()
    const messageBuffer = encoder.encode(messageText.value)
    const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.value, messageBuffer)

    // 验证签名
    const signatureBuffer = hexToArrayBuffer(signature.value)
    const isValid = await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: selectedHashAlgorithm.value }
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
      message.success(t('encrypt.ecdsaSign.verificationSuccess'))
    } else {
      message.error(t('encrypt.ecdsaSign.verificationFailed'))
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
.ecdsa-sign {
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
