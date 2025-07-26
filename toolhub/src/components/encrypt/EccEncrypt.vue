<template>
  <div class="ecc-encrypt">
    <n-card :title="t('encrypt.ecc.title')">
      <!-- 椭圆曲线选择 -->
      <div class="curve-section">
        <n-text>{{ t('encrypt.ecc.curve') }}</n-text>
        <n-select v-model:value="selectedCurve" :options="curveOptions" />
      </div>
      
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecc.input') }}</n-text>
        <n-input 
          v-model:value="input" 
          type="textarea" 
          :placeholder="t('encrypt.ecc.placeholder')"
          :autosize="{ minRows: 10, maxRows: 20 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.ecc.charCount', { count: input.length }) }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="generateKeyPair" type="info">
          {{ t('encrypt.ecc.generateKeys') }}
        </n-button>
        <n-button @click="encrypt" type="primary" :disabled="!publicKey">
          {{ t('encrypt.ecc.encrypt') }}
        </n-button>
        <n-button @click="decrypt" type="primary" :disabled="!privateKey">
          {{ t('encrypt.ecc.decrypt') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 密钥显示区域 -->
      <div class="keys-section">
        <!-- 密钥信息概览 -->
        <div v-if="publicKey || privateKey" class="key-info-overview">
          <n-alert type="info" :title="t('encrypt.ecc.keyInfo')" class="mb-4">
            <template #default>
              <div class="key-info-grid">
                <div class="key-info-item">
                  <strong>{{ t('encrypt.ecc.curve') }}:</strong> 
                  <n-tag :type="keyPairCurve === selectedCurve ? 'success' : 'warning'" size="small">
                    {{ keyPairCurve || t('encrypt.ecc.notGenerated') }}
                  </n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.ecc.algorithm') }}:</strong> 
                  <n-tag type="info" size="small">ECDH</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.ecc.keyLength') }}:</strong> 
                  <n-tag type="info" size="small">{{ getKeyLength() }}</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.ecc.encryption') }}:</strong> 
                  <n-tag type="info" size="small">AES-GCM</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.ecc.format') }}:</strong> 
                  <n-tag type="info" size="small">Base64 (PKCS#8/SPKI)</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.ecc.generated') }}:</strong> 
                  <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.ecc.notGenerated') }}</n-tag>
                </div>
              </div>
            </template>
          </n-alert>
        </div>

        <n-collapse>
          <n-collapse-item :title="t('encrypt.ecc.publicKey')" name="public">
            <div class="key-header">
              <n-text depth="3">{{ t('encrypt.ecc.publicKeyDesc') }}</n-text>
            </div>
            <n-input 
              v-model:value="publicKey" 
              type="textarea" 
              :placeholder="t('encrypt.ecc.publicKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
            />
            <div class="key-actions">
              <n-button @click="copyPublicKey" size="small" class="copy-key-btn">
                {{ t('common.copy') }}
              </n-button>
              <n-button @click="exportPublicKey" size="small" class="export-key-btn">
                {{ t('encrypt.ecc.export') }}
              </n-button>
            </div>
          </n-collapse-item>
          <n-collapse-item :title="t('encrypt.ecc.privateKey')" name="private">
            <div class="key-header">
              <n-text depth="3">{{ t('encrypt.ecc.privateKeyDesc') }}</n-text>
              <n-alert type="warning" size="small" class="mt-2">
                {{ t('encrypt.ecc.privateKeyWarning') }}
              </n-alert>
            </div>
            <n-input 
              v-model:value="privateKey" 
              type="textarea" 
              :placeholder="t('encrypt.ecc.privateKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
              :show-password="isPrivateKeyHidden"
              :type="isPrivateKeyHidden ? 'password' : 'textarea'"
            />
            <div class="key-actions">
              <n-button @click="copyPrivateKey" size="small" class="copy-key-btn">
                {{ t('common.copy') }}
              </n-button>
              <n-button @click="exportPrivateKey" size="small" class="export-key-btn">
                {{ t('encrypt.ecc.export') }}
              </n-button>
              <n-button @click="hidePrivateKey" size="small" class="hide-key-btn">
                {{ t('encrypt.ecc.hide') }}
              </n-button>
            </div>
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
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const error = ref('')
const publicKey = ref('')
const privateKey = ref('')
const selectedCurve = ref('P-256')
const keyPairCurve = ref('') // 记录密钥对使用的曲线
const keyGeneratedTime = ref('') // 记录密钥生成时间
const isPrivateKeyHidden = ref(false) // 私钥是否隐藏

// 椭圆曲线选项
const curveOptions = [
  { label: 'P-256 (secp256r1)', value: 'P-256' },
  { label: 'P-384 (secp384r1)', value: 'P-384' }
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
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

// 生成密钥对
const generateKeyPair = async () => {
  try {
    // 验证曲线名称
    const validCurves = ['P-256', 'P-384']
    if (!validCurves.includes(selectedCurve.value)) {
      throw new Error(`Unsupported curve: ${selectedCurve.value}`)
    }
    
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: selectedCurve.value
      },
      true,
      ['deriveKey', 'deriveBits']
    )
    
    // 导出公钥和私钥
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    privateKey.value = arrayBufferToBase64(privateKeyBuffer)
    
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
    publicKey.value = arrayBufferToBase64(publicKeyBuffer)
    
    // 记录密钥对使用的曲线
    keyPairCurve.value = selectedCurve.value
    
    // 记录生成时间
    keyGeneratedTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.ecc.keysGenerated'))
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// ECC加密（使用ECDH密钥交换）
const encrypt = async () => {
  if (!publicKey.value) {
    error.value = t('encrypt.ecc.noPublicKey')
    return
  }
  
  if (!input.value.trim()) {
    error.value = t('encrypt.ecc.inputRequired')
    return
  }
  
  // 检查密钥对曲线是否匹配
  if (keyPairCurve.value && keyPairCurve.value !== selectedCurve.value) {
    error.value = t('encrypt.ecc.curveMismatch', {
      keyCurve: keyPairCurve.value,
      selectedCurve: selectedCurve.value
    })
    return
  }
  
  try {
    // 验证曲线名称
    const validCurves = ['P-256', 'P-384']
    if (!validCurves.includes(selectedCurve.value)) {
      throw new Error(`Unsupported curve: ${selectedCurve.value}`)
    }
    
    // 生成临时密钥对
    const tempKeyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: selectedCurve.value
      },
      true,
      ['deriveKey', 'deriveBits']
    )
    
    // 导入接收方公钥
    const recipientPublicKeyBuffer = base64ToArrayBuffer(publicKey.value)
    const recipientPublicKey = await crypto.subtle.importKey(
      'spki',
      recipientPublicKeyBuffer,
      {
        name: 'ECDH',
        namedCurve: selectedCurve.value
      },
      false,
      []
    )
    
    // 计算共享密钥
    const sharedSecret = await crypto.subtle.deriveBits(
      {
        name: 'ECDH',
        public: recipientPublicKey
      },
      tempKeyPair.privateKey,
      256
    )
    
    // 使用共享密钥加密数据
    const encryptedData = await encryptWithSharedSecret(input.value, sharedSecret)
    
    // 导出临时公钥
    const tempPublicKeyBuffer = await crypto.subtle.exportKey('spki', tempKeyPair.publicKey)
    const tempPublicKey = arrayBufferToBase64(tempPublicKeyBuffer)
    
    const result = {
      tempPublicKey: tempPublicKey,
      encryptedData: encryptedData
    }
    
    input.value = JSON.stringify(result, null, 2)
    error.value = ''
    message.success(t('encrypt.ecc.encryptSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// ECC解密
const decrypt = async () => {
  if (!privateKey.value) {
    error.value = t('encrypt.ecc.noPrivateKey')
    return
  }
  
  if (!input.value.trim()) {
    error.value = t('encrypt.ecc.inputRequired')
    return
  }
  
  // 检查密钥对曲线是否匹配
  if (keyPairCurve.value && keyPairCurve.value !== selectedCurve.value) {
    error.value = t('encrypt.ecc.curveMismatch', {
      keyCurve: keyPairCurve.value,
      selectedCurve: selectedCurve.value
    })
    return
  }
  
  try {
    // 解析加密数据
    let encryptedData
    try {
      encryptedData = JSON.parse(input.value)
    } catch (e) {
      error.value = 'Invalid encrypted data format'
      return
    }
    
    // 导入私钥
    const privateKeyBuffer = base64ToArrayBuffer(privateKey.value)
    const recipientPrivateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'ECDH',
        namedCurve: selectedCurve.value
      },
      false,
      ['deriveKey', 'deriveBits']
    )
    
    // 导入临时公钥
    const tempPublicKeyBuffer = base64ToArrayBuffer(encryptedData.tempPublicKey)
    const tempPublicKey = await crypto.subtle.importKey(
      'spki',
      tempPublicKeyBuffer,
      {
        name: 'ECDH',
        namedCurve: selectedCurve.value
      },
      false,
      []
    )
    
    // 计算共享密钥
    const sharedSecret = await crypto.subtle.deriveBits(
      {
        name: 'ECDH',
        public: tempPublicKey
      },
      recipientPrivateKey,
      256
    )
    
    // 使用共享密钥解密数据
    const decryptedData = await decryptWithSharedSecret(encryptedData.encryptedData, sharedSecret)
    
    input.value = decryptedData
    error.value = ''
    message.success(t('encrypt.ecc.decryptSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 使用共享密钥加密数据
const encryptWithSharedSecret = async (data, sharedSecret) => {
  try {
    // 将共享密钥转换为加密密钥
    const key = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )
    
    // 生成随机IV
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    // 加密数据
    const encodedData = new TextEncoder().encode(data)
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    )
    
    // 组合IV和加密数据
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encryptedBuffer), iv.length)
    
    return arrayBufferToBase64(combined.buffer)
  } catch (e) {
    throw new Error('Encryption failed: ' + e.message)
  }
}

// 使用共享密钥解密数据
const decryptWithSharedSecret = async (encryptedData, sharedSecret) => {
  try {
    // 将共享密钥转换为解密密钥
    const key = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )
    
    // 解码数据
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedData))
    
    // 提取IV和加密数据
    const iv = combined.slice(0, 12)
    const encryptedBuffer = combined.slice(12)
    
    // 解密数据
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    )
    
    return new TextDecoder().decode(decryptedBuffer)
  } catch (e) {
    throw new Error('Decryption failed: ' + e.message)
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 复制公钥
const copyPublicKey = async () => {
  try {
    await navigator.clipboard.writeText(publicKey.value)
    message.success(t('encrypt.ecc.publicKeyCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 复制私钥
const copyPrivateKey = async () => {
  try {
    await navigator.clipboard.writeText(privateKey.value)
    message.success(t('encrypt.ecc.privateKeyCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 监听曲线变化
watch(selectedCurve, (newCurve, oldCurve) => {
  if (keyPairCurve.value && keyPairCurve.value !== newCurve) {
    message.warning(t('encrypt.ecc.curveSwitchWarning', {
      oldCurve: oldCurve,
      newCurve: newCurve,
      keyCurve: keyPairCurve.value
    }))
  }
})

// 获取密钥长度
const getKeyLength = () => {
  if (!keyPairCurve.value) return t('encrypt.ecc.notGenerated')
  return keyPairCurve.value === 'P-256' ? '256 bits' : '384 bits'
}

// 导出公钥
const exportPublicKey = () => {
  if (!publicKey.value) {
    message.warning(t('encrypt.ecc.noPublicKey'))
    return
  }
  
  const blob = new Blob([publicKey.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ecc_public_key_${keyPairCurve.value}_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  message.success(t('encrypt.ecc.exportSuccess'))
}

// 导出私钥
const exportPrivateKey = () => {
  if (!privateKey.value) {
    message.warning(t('encrypt.ecc.noPrivateKey'))
    return
  }
  
  const blob = new Blob([privateKey.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ecc_private_key_${keyPairCurve.value}_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  message.success(t('encrypt.ecc.exportSuccess'))
}

// 隐藏私钥
const hidePrivateKey = () => {
  isPrivateKeyHidden.value = !isPrivateKeyHidden.value
  message.success(isPrivateKeyHidden.value ? t('encrypt.ecc.privateKeyHidden') : t('encrypt.ecc.privateKeyShown'))
}

// 清空所有
const clearAll = () => {
  input.value = ''
  publicKey.value = ''
  privateKey.value = ''
  keyPairCurve.value = '' // 清空曲线信息
  keyGeneratedTime.value = '' // 清空生成时间
  isPrivateKeyHidden.value = false // 重置隐藏状态
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.ecc-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.curve-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
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

.key-info-overview {
  margin-bottom: 20px;
}

.key-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.key-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-header {
  margin-bottom: 12px;
}

.key-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.copy-key-btn,
.export-key-btn,
.hide-key-btn {
  flex-shrink: 0;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-2 {
  margin-top: 8px;
}
</style>