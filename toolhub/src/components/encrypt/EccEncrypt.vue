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
        <n-collapse>
          <n-collapse-item :title="t('encrypt.ecc.publicKey')" name="public">
            <n-input 
              v-model:value="publicKey" 
              type="textarea" 
              :placeholder="t('encrypt.ecc.publicKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
            />
            <n-button @click="copyPublicKey" size="small" class="copy-key-btn">
              {{ t('common.copy') }}
            </n-button>
          </n-collapse-item>
          <n-collapse-item :title="t('encrypt.ecc.privateKey')" name="private">
            <n-input 
              v-model:value="privateKey" 
              type="textarea" 
              :placeholder="t('encrypt.ecc.privateKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
            />
            <n-button @click="copyPrivateKey" size="small" class="copy-key-btn">
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
import { ec } from 'elliptic'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const error = ref('')
const publicKey = ref('')
const privateKey = ref('')
const selectedCurve = ref('secp256k1')

// 椭圆曲线选项
const curveOptions = [
  { label: 'secp256k1 (Bitcoin)', value: 'secp256k1' },
  { label: 'secp256r1 (P-256)', value: 'p256' },
  { label: 'secp384r1 (P-384)', value: 'p384' },
  { label: 'secp521r1 (P-521)', value: 'p521' },
  { label: 'curve25519', value: 'curve25519' }
]

// 生成密钥对
const generateKeyPair = () => {
  try {
    const ellipticCurve = new ec(selectedCurve.value)
    const keyPair = ellipticCurve.genKeyPair()
    
    // 获取公钥和私钥
    const newPublicKey = keyPair.getPublic('hex')
    const newPrivateKey = keyPair.getPrivate('hex')
    
    publicKey.value = newPublicKey
    privateKey.value = newPrivateKey
    
    message.success(t('encrypt.ecc.keysGenerated'))
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// ECC加密（使用ECDH密钥交换）
const encrypt = () => {
  if (!publicKey.value) {
    error.value = t('encrypt.ecc.noPublicKey')
    return
  }
  
  if (!input.value.trim()) {
    error.value = t('encrypt.ecc.inputRequired')
    return
  }
  
  try {
    const ellipticCurve = new ec(selectedCurve.value)
    
    // 生成临时密钥对用于加密
    const tempKeyPair = ellipticCurve.genKeyPair()
    const tempPrivateKey = tempKeyPair.getPrivate('hex')
    
    // 从公钥恢复接收方的公钥点
    const recipientPublicKey = ellipticCurve.keyFromPublic(publicKey.value, 'hex')
    
    // 计算共享密钥
    const sharedSecret = tempKeyPair.derive(recipientPublicKey.getPublic())
    
    // 使用共享密钥加密数据（简单示例）
    const encryptedData = encryptWithSharedSecret(input.value, sharedSecret.toString('hex'))
    
    // 组合临时公钥和加密数据
    const tempPublicKey = tempKeyPair.getPublic('hex')
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
const decrypt = () => {
  if (!privateKey.value) {
    error.value = t('encrypt.ecc.noPrivateKey')
    return
  }
  
  if (!input.value.trim()) {
    error.value = t('encrypt.ecc.inputRequired')
    return
  }
  
  try {
    const ellipticCurve = new ec(selectedCurve.value)
    
    // 解析加密数据
    let encryptedData
    try {
      encryptedData = JSON.parse(input.value)
    } catch (e) {
      error.value = 'Invalid encrypted data format'
      return
    }
    
    // 从私钥恢复密钥对
    const recipientKeyPair = ellipticCurve.keyFromPrivate(privateKey.value, 'hex')
    
    // 从临时公钥恢复发送方的公钥点
    const tempPublicKey = ellipticCurve.keyFromPublic(encryptedData.tempPublicKey, 'hex')
    
    // 计算共享密钥
    const sharedSecret = recipientKeyPair.derive(tempPublicKey.getPublic())
    
    // 使用共享密钥解密数据
    const decryptedData = decryptWithSharedSecret(encryptedData.encryptedData, sharedSecret.toString('hex'))
    
    input.value = decryptedData
    error.value = ''
    message.success(t('encrypt.ecc.decryptSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 使用共享密钥加密数据（简单实现）
const encryptWithSharedSecret = (data, sharedSecret) => {
  // 这里使用简单的XOR加密作为示例
  // 在实际应用中应该使用更安全的加密算法
  const key = sharedSecret.substring(0, 32) // 取前32位作为密钥
  let result = ''
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ parseInt(key[i % key.length], 16)
    result += String.fromCharCode(charCode)
  }
  return btoa(result) // Base64编码
}

// 使用共享密钥解密数据（简单实现）
const decryptWithSharedSecret = (encryptedData, sharedSecret) => {
  try {
    const key = sharedSecret.substring(0, 32) // 取前32位作为密钥
    const decoded = atob(encryptedData) // Base64解码
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ parseInt(key[i % key.length], 16)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (e) {
    throw new Error('Decryption failed')
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

// 清空所有
const clearAll = () => {
  input.value = ''
  publicKey.value = ''
  privateKey.value = ''
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
</style>