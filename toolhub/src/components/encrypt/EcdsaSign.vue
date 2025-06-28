<template>
  <div class="ecdsa-sign">
    <n-card :title="t('encrypt.ecdsaSign.title')">
      <!-- 椭圆曲线选择 -->
      <div class="curve-section">
        <n-text>{{ t('encrypt.ecdsaSign.curve') }}</n-text>
        <n-select v-model:value="selectedCurve" :options="curveOptions" />
      </div>

      <!-- 哈希算法选择 -->
      <div class="hash-algorithm-section">
        <n-text>{{ t('encrypt.ecdsaSign.hashAlgorithm') }}</n-text>
        <n-select v-model:value="selectedHashAlgorithm" :options="hashAlgorithmOptions" />
      </div>

      <n-form>
        <n-form-item :label="t('encrypt.ecdsaSign.message')">
          <n-input 
            v-model:value="messageText" 
            type="textarea" 
            :placeholder="t('encrypt.ecdsaSign.messagePlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info">
            <n-text depth="3">{{ t('encrypt.ecdsaSign.charCount', { count: messageText.length }) }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.ecdsaSign.privateKey')">
          <n-input 
            v-model:value="privateKey" 
            type="textarea"
            :placeholder="t('encrypt.ecdsaSign.privateKeyPlaceholder')" 
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="privateKey">
            <n-text depth="3">{{ t('encrypt.ecdsaSign.length') }}：{{ privateKey.length }} {{ t('encrypt.ecdsaSign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.ecdsaSign.publicKey')">
          <n-input 
            v-model:value="publicKey" 
            type="textarea" 
            :placeholder="t('encrypt.ecdsaSign.publicKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="publicKey">
            <n-text depth="3">{{ t('encrypt.ecdsaSign.length') }}：{{ publicKey.length }} {{ t('encrypt.ecdsaSign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-form-item :label="t('encrypt.ecdsaSign.signature')">
          <n-input 
            v-model:value="signature" 
            type="textarea"
            :placeholder="t('encrypt.ecdsaSign.signaturePlaceholder')" 
            :autosize="{ minRows: 3, maxRows: 10 }" 
          />
          <div class="input-info" v-if="signature">
            <n-text depth="3">{{ t('encrypt.ecdsaSign.length') }}：{{ signature.length }} {{ t('encrypt.ecdsaSign.characters') }}</n-text>
          </div>
        </n-form-item>
        
        <n-space>
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
        </n-space>
        
        <!-- 验证结果显示 -->
        <n-form-item v-if="verificationResult !== null" :label="t('encrypt.ecdsaSign.verificationResult')">
          <n-alert :type="verificationResult ? 'success' : 'error'" :title="verificationResult ? t('encrypt.ecdsaSign.verificationSuccess') : t('encrypt.ecdsaSign.verificationFailed')" />
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
import { ec as EC } from 'elliptic'

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
const selectedCurve = ref('secp256k1')
const selectedHashAlgorithm = ref('SHA-256')
const verificationResult = ref(null)

// 椭圆曲线选项
const curveOptions = [
  { label: 'secp256k1 (Bitcoin)', value: 'secp256k1' },
  { label: 'secp256r1 (P-256)', value: 'p256' },
  { label: 'secp384r1 (P-384)', value: 'p384' },
  { label: 'secp521r1 (P-521)', value: 'p521' }
]

// 哈希算法选项
const hashAlgorithmOptions = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' }
]

// 获取椭圆曲线实例
const getEC = () => {
  return new EC(selectedCurve.value)
}

// 计算消息哈希
const calculateHash = async (message) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.value, data)
  return Array.from(new Uint8Array(hashBuffer)).map(x => x.toString(16).padStart(2, '0')).join('')
}

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''
    verificationResult.value = null

    const ec = getEC()
    const key = ec.genKeyPair()
    privateKey.value = key.getPrivate('hex')
    publicKey.value = key.getPublic('hex')
    
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

    // 验证私钥格式
    if (!/^[0-9a-fA-F]+$/.test(privateKey.value)) {
      throw new Error(t('encrypt.ecdsaSign.invalidPrivateKeyFormat'))
    }

    const ec = getEC()
    const key = ec.keyFromPrivate(privateKey.value, 'hex')
    const msgHash = await calculateHash(messageText.value)
    const sig = key.sign(msgHash)
    signature.value = sig.toDER('hex')
    
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

    // 验证格式
    if (!/^[0-9a-fA-F]+$/.test(publicKey.value)) {
      throw new Error(t('encrypt.ecdsaSign.invalidPublicKeyFormat'))
    }
    if (!/^[0-9a-fA-F]+$/.test(signature.value)) {
      throw new Error(t('encrypt.ecdsaSign.invalidSignatureFormat'))
    }

    const ec = getEC()
    const key = ec.keyFromPublic(publicKey.value, 'hex')
    const msgHash = await calculateHash(messageText.value)
    const isValid = key.verify(msgHash, signature.value)
    
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
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.ecdsa-sign {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.curve-section,
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

.error-alert {
  margin-top: 16px;
}
</style>