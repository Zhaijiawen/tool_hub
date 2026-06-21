<template>
  <div class="x25519">
    <!-- 工具简介 -->
    <ToolIntro toolKey="x25519" />

    <n-card :title="t('encrypt.x25519.title')">
      <!-- 私钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.x25519.privateKey') }}</n-text>
        <n-input 
          v-model:value="privateKey" 
          type="textarea" 
          :placeholder="t('encrypt.x25519.privateKeyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.x25519.charCount', { count: privateKey.length }) }}</n-text>
        </div>
      </div>

      <!-- 公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.x25519.publicKey') }}</n-text>
        <n-input 
          v-model:value="publicKey" 
          type="textarea" 
          :placeholder="t('encrypt.x25519.publicKeyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
          readonly 
        />
        <div class="input-info" v-if="publicKey">
          <n-text depth="3">{{ t('encrypt.x25519.length') }}：{{ publicKey.length }} {{ t('encrypt.x25519.characters') }}</n-text>
        </div>
      </div>

      <!-- 对方公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.x25519.peerPublicKey') }}</n-text>
        <n-input 
          v-model:value="peerPublicKey" 
          type="textarea" 
          :placeholder="t('encrypt.x25519.peerPublicKeyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.x25519.charCount', { count: peerPublicKey.length }) }}</n-text>
        </div>
        <!-- 测试按钮 -->
        <div class="test-buttons">
          <n-button @click="generateTestPeerKey" size="small" type="info">
            {{ t('encrypt.x25519.generateTestPeerKey') }}
          </n-button>
          <n-button @click="copyPeerPublicKey" size="small" :disabled="!publicKey">
            {{ t('encrypt.x25519.copyMyPublicKey') }}
          </n-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="generateKeyPair" type="primary" :loading="isGenerating">
          {{ t('encrypt.x25519.generateKeyPair') }}
        </n-button>
        <n-button @click="computeSharedSecret" type="info" :disabled="!privateKey || !peerPublicKey" :loading="isComputing">
          {{ t('encrypt.x25519.computeSharedSecret') }}
        </n-button>
        <n-button @click="copyToClipboard" :disabled="!sharedSecret">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- Key Information 区域 -->
      <div v-if="publicKey || sharedSecret" class="key-info-overview">
        <n-alert type="info" :title="t('encrypt.x25519.keyInfo')" class="mb-4">
          <template #default>
            <div class="key-info-grid">
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.algorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.x25519.x25519') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.curve') }}:</strong> 
                <n-tag type="info" size="small">Curve25519</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.keyLength') }}:</strong> 
                <n-tag type="info" size="small">256 {{ t('encrypt.x25519.bits') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.security') }}:</strong> 
                <n-tag type="success" size="small">{{ t('encrypt.x25519.secure') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.keyFormat') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.x25519.base64') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.keyStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ publicKey ? t('encrypt.x25519.generated') : t('encrypt.x25519.notGenerated') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.exchangeStatus') }}:</strong> 
                <n-tag type="info" size="small">{{ sharedSecret ? t('encrypt.x25519.completed') : t('encrypt.x25519.notCompleted') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.keyGenTime') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGenTime }}ms</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.exchangeTime') }}:</strong> 
                <n-tag type="info" size="small">{{ exchangeComputeTime }}ms</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.generated') }}:</strong> 
                <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.x25519.notGenerated') }}</n-tag>
              </div>
              <div class="key-info-item">
                <strong>{{ t('encrypt.x25519.exchanged') }}:</strong> 
                <n-tag type="info" size="small">{{ exchangeTime || t('encrypt.x25519.notExchanged') }}</n-tag>
              </div>
            </div>
            <!-- 安全性说明 -->
            <div class="security-note">
              <n-text depth="3">
                <strong>{{ t('encrypt.x25519.securityNote') }}:</strong> {{ t('encrypt.x25519.securityDescription') }}
              </n-text>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 共享密钥区域 -->
      <div class="output-section" v-if="sharedSecret">
        <n-text>{{ t('encrypt.x25519.sharedSecret') }}</n-text>
        <n-input 
          v-model:value="sharedSecret" 
          type="textarea" 
          :placeholder="t('encrypt.x25519.sharedSecretPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
          readonly 
        />
        <div class="output-info">
          <n-text depth="3">{{ t('encrypt.x25519.length') }}：{{ sharedSecret.length }} {{ t('encrypt.x25519.characters') }}</n-text>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="x25519" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import * as nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
const { t } = useI18n()
const message = useMessage()

// 响应式数据
const privateKey = ref('')
const publicKey = ref('')
const peerPublicKey = ref('')
const sharedSecret = ref('')
const error = ref('')
const isGenerating = ref(false)
const isComputing = ref(false)
const keyGeneratedTime = ref('') // 密钥生成时间
const exchangeTime = ref('') // 交换时间
const keyGenTime = ref(0) // 密钥生成耗时
const exchangeComputeTime = ref(0) // 交换计算耗时

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''

    const startTime = performance.now()

    const keyPair = nacl.box.keyPair()
    privateKey.value = encodeBase64(keyPair.secretKey)
    publicKey.value = encodeBase64(keyPair.publicKey)
    
    // 记录生成时间和耗时
    const endTime = performance.now()
    keyGenTime.value = Math.round(endTime - startTime)
    keyGeneratedTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.x25519.keyPairGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isGenerating.value = false
  }
}

// 计算共享密钥
const computeSharedSecret = async () => {
  try {
    if (!privateKey.value || !peerPublicKey.value) {
      error.value = t('encrypt.x25519.allFieldsRequired')
      return
    }

    isComputing.value = true
    error.value = ''

    const startTime = performance.now()

    // 验证密钥格式
    if (!/^[A-Za-z0-9+/=]+$/.test(privateKey.value) || !/^[A-Za-z0-9+/=]+$/.test(peerPublicKey.value)) {
      throw new Error(t('encrypt.x25519.invalidKeyFormat'))
    }

    const privateKeyBytes = decodeBase64(privateKey.value)
    const peerPublicKeyBytes = decodeBase64(peerPublicKey.value)
    const sharedSecretBytes = nacl.box.before(peerPublicKeyBytes, privateKeyBytes)
    sharedSecret.value = encodeBase64(sharedSecretBytes)
    
    // 记录交换时间和耗时
    const endTime = performance.now()
    exchangeComputeTime.value = Math.round(endTime - startTime)
    exchangeTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.x25519.sharedSecretComputed'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isComputing.value = false
  }
}

// 生成测试对方公钥
const generateTestPeerKey = async () => {
  try {
    const testKeyPair = nacl.box.keyPair()
    peerPublicKey.value = encodeBase64(testKeyPair.publicKey)
    
    message.success(t('encrypt.x25519.testPeerKeyGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 复制我的公钥
const copyPeerPublicKey = async () => {
  try {
    await navigator.clipboard.writeText(publicKey.value)
    message.success(t('encrypt.x25519.publicKeyCopied'))
  } catch (e) {
    message.error(t('encrypt.x25519.copyError'))
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(sharedSecret.value)
    message.success(t('encrypt.x25519.copySuccess'))
  } catch (e) {
    message.error(t('encrypt.x25519.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  privateKey.value = ''
  publicKey.value = ''
  peerPublicKey.value = ''
  sharedSecret.value = ''
  error.value = ''
  keyGeneratedTime.value = ''
  exchangeTime.value = ''
  keyGenTime.value = 0
  exchangeComputeTime.value = 0
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.x25519 {
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

.output-section {
  margin: 20px 0;
}

.output-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.output-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-alert {
  margin-top: 16px;
}

.test-buttons {
  margin-top: 8px;
  display: flex;
  gap: 8px;
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
