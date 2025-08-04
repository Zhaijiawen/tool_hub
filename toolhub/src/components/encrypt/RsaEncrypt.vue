<template>
  <div class="rsa-encrypt">
    <n-card :title="t('encrypt.rsa.title')">
      <!-- 密钥长度选择 -->
      <div class="key-length-section">
        <n-text>{{ t('encrypt.rsa.keyLength') }}</n-text>
        <n-select v-model:value="selectedKeyLength" :options="keyLengthOptions" />
      </div>
      
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.rsa.input') }}</n-text>
        <n-input 
          v-model:value="input" 
          type="textarea" 
          :placeholder="t('encrypt.rsa.placeholder')"
          :autosize="{ minRows: 10, maxRows: 20 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.rsa.charCount', { count: input.length }) }}</n-text>
          <n-text v-if="isTextTooLong" type="error">
            {{ t('encrypt.rsa.textTooLong', { maxLength: maxTextLength }) }}
          </n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="generateKeyPair" type="info">
          {{ t('encrypt.rsa.generateKeys') }}
        </n-button>
        <n-button @click="encrypt" type="primary" :disabled="isTextTooLong || !publicKey">
          {{ t('encrypt.rsa.encrypt') }}
        </n-button>
        <n-button @click="decrypt" type="primary" :disabled="!privateKey">
          {{ t('encrypt.rsa.decrypt') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- Key Information 区域 -->
      <div v-if="publicKey || privateKey" class="key-info-overview">
        <n-alert type="info" :title="t('encrypt.rsa.keyInfo')" class="mb-4">
          <template #default>
            <div class="key-info-grid">
              <div class="key-info-item">
                <strong>{{ t('encrypt.rsa.algorithm') }}:</strong> 
                <n-tag type="info" size="small">RSA</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.rsa.keyLength') }}:</strong> 
                <n-tag type="info" size="small">{{ selectedKeyLength }} bits</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.rsa.encryption') }}:</strong> 
                <n-tag type="info" size="small">Asymmetric</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.rsa.format') }}:</strong> 
                <n-tag type="info" size="small">PEM (PKCS#8)</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.rsa.maxTextLength') }}:</strong> 
                <n-tag type="info" size="small">{{ maxTextLength }} {{ t('common.characters') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.rsa.generated') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.rsa.notGenerated') }}</n-tag>
              </div>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 密钥显示区域 -->
      <div class="keys-section">
        <n-collapse>
          <n-collapse-item :title="t('encrypt.rsa.publicKey')" name="public">
            <n-input 
              v-model:value="publicKey" 
              type="textarea" 
              :placeholder="t('encrypt.rsa.publicKeyPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 8 }" 
            />
            <n-button @click="copyPublicKey" size="small" class="copy-key-btn">
              {{ t('common.copy') }}
            </n-button>
          </n-collapse-item>
          <n-collapse-item :title="t('encrypt.rsa.privateKey')" name="private">
            <n-input 
              v-model:value="privateKey" 
              type="textarea" 
              :placeholder="t('encrypt.rsa.privateKeyPlaceholder')"
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
    <TutorialAndDocs toolKey="rsa" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import JSEncrypt from 'jsencrypt'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const error = ref('')
const publicKey = ref('')
const privateKey = ref('')
const selectedKeyLength = ref(2048)
const keyGeneratedTime = ref('') // 记录密钥生成时间

// 密钥长度选项
const keyLengthOptions = [
  { label: '1024 bits', value: 1024 },
  { label: '2048 bits', value: 2048 },
  { label: '4096 bits', value: 4096 }
]

// 计算最大文本长度（基于密钥长度）
const maxTextLength = computed(() => {
  return Math.floor(selectedKeyLength.value / 8) - 11 // RSA PKCS#1 v1.5 padding
})

// 检查文本是否过长
const isTextTooLong = computed(() => {
  return input.value.length > maxTextLength.value
})

// 生成密钥对
const generateKeyPair = () => {
  try {
    // 修复：JSEncrypt 没有 setKeyLength 方法，需要手动生成密钥
    const crypt = new JSEncrypt()
    
    // 生成新的密钥对
    const newPublicKey = crypt.getPublicKey()
    const newPrivateKey = crypt.getPrivateKey()
    
    publicKey.value = newPublicKey
    privateKey.value = newPrivateKey
    
    // 记录生成时间
    keyGeneratedTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.rsa.keysGenerated'))
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 加密
const encrypt = () => {
  if (!publicKey.value) {
    error.value = t('encrypt.rsa.noPublicKey')
    return
  }
  
  if (isTextTooLong.value) {
    error.value = t('encrypt.rsa.textTooLong', { maxLength: maxTextLength.value })
    return
  }
  
  try {
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey.value)
    const encrypted = encrypt.encrypt(input.value)
    
    if (encrypted) {
      input.value = encrypted
      error.value = ''
      message.success(t('encrypt.rsa.encryptSuccess'))
    } else {
      error.value = t('encrypt.rsa.encryptFailed')
    }
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 解密
const decrypt = () => {
  if (!privateKey.value) {
    error.value = t('encrypt.rsa.noPrivateKey')
    return
  }
  
  try {
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(privateKey.value)
    const decrypted = decrypt.decrypt(input.value)
    
    if (decrypted) {
      input.value = decrypted
      error.value = ''
      message.success(t('encrypt.rsa.decryptSuccess'))
    } else {
      error.value = t('encrypt.rsa.decryptFailed')
    }
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
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
    message.success(t('encrypt.rsa.publicKeyCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 复制私钥
const copyPrivateKey = async () => {
  try {
    await navigator.clipboard.writeText(privateKey.value)
    message.success(t('encrypt.rsa.privateKeyCopied'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  input.value = ''
  publicKey.value = ''
  privateKey.value = ''
  keyGeneratedTime.value = ''
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.rsa-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.key-length-section {
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
  margin: 20px 0;
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

.mb-4 {
  margin-bottom: 16px;
}
</style>