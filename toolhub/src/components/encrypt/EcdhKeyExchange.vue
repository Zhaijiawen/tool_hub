<template>
  <div class="ecdh-key-exchange">
    <n-card :title="t('encrypt.ecdh-key-exchange.title')">
      <!-- 私钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdh-key-exchange.privateKey') }}</n-text>
        <n-input 
          v-model:value="privateKey" 
          type="textarea" 
          :placeholder="t('encrypt.ecdh-key-exchange.privateKeyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.ecdh-key-exchange.charCount', { count: privateKey.length }) }}</n-text>
        </div>
      </div>

      <!-- 公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdh-key-exchange.publicKey') }}</n-text>
        <n-input 
          v-model:value="publicKey" 
          type="textarea" 
          :placeholder="t('encrypt.ecdh-key-exchange.publicKeyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
          readonly 
        />
        <div class="input-info" v-if="publicKey">
          <n-text depth="3">{{ t('encrypt.ecdh-key-exchange.length') }}：{{ publicKey.length }} {{ t('encrypt.ecdh-key-exchange.characters') }}</n-text>
        </div>
      </div>

      <!-- 对方公钥区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.ecdh-key-exchange.peerPublicKey') }}</n-text>
        <n-input 
          v-model:value="peerPublicKey" 
          type="textarea" 
          :placeholder="t('encrypt.ecdh-key-exchange.peerPublicKeyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.ecdh-key-exchange.charCount', { count: peerPublicKey.length }) }}</n-text>
        </div>
        <!-- 测试按钮 -->
        <div class="test-buttons">
          <n-button @click="generateTestPeerKey" size="small" type="info">
            {{ t('encrypt.ecdh-key-exchange.generateTestPeerKey') }}
          </n-button>
          <n-button @click="copyPeerPublicKey" size="small" :disabled="!publicKey">
            {{ t('encrypt.ecdh-key-exchange.copyMyPublicKey') }}
          </n-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="generateKeyPair" type="primary" :loading="isGenerating">
          {{ t('encrypt.ecdh-key-exchange.generateKeyPair') }}
        </n-button>
        <n-button @click="computeSharedSecret" type="info" :disabled="!privateKey || !peerPublicKey" :loading="isComputing">
          {{ t('encrypt.ecdh-key-exchange.computeSharedSecret') }}
        </n-button>
        <n-button @click="copyToClipboard" :disabled="!sharedSecret">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 共享密钥区域 -->
      <div class="output-section" v-if="sharedSecret">
        <n-text>{{ t('encrypt.ecdh-key-exchange.sharedSecret') }}</n-text>
        <n-input 
          v-model:value="sharedSecret" 
          type="textarea" 
          :placeholder="t('encrypt.ecdh-key-exchange.sharedSecretPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
          readonly 
        />
        <div class="output-info">
          <n-text depth="3">{{ t('encrypt.ecdh-key-exchange.length') }}：{{ sharedSecret.length }} {{ t('encrypt.ecdh-key-exchange.characters') }}</n-text>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="ecdh" />
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
const privateKey = ref('')
const publicKey = ref('')
const peerPublicKey = ref('')
const sharedSecret = ref('')
const error = ref('')
const isGenerating = ref(false)
const isComputing = ref(false)

// 将ArrayBuffer转换为十六进制字符串
const arrayBufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
};

// 将十六进制字符串转换为ArrayBuffer
const hexToArrayBuffer = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
};

// 生成密钥对
const generateKeyPair = async () => {
  try {
    isGenerating.value = true
    error.value = ''

    // 使用Web Crypto API生成ECDH密钥对
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    );

    // 导出私钥
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    privateKey.value = arrayBufferToHex(privateKeyBuffer);

    // 导出公钥
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    publicKey.value = arrayBufferToHex(publicKeyBuffer);

    message.success(t('encrypt.ecdh-key-exchange.keyPairGenerated'))
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
      error.value = t('encrypt.ecdh-key-exchange.allFieldsRequired')
      return
    }

    isComputing.value = true
    error.value = ''

    // 验证密钥格式
    if (!/^[0-9a-fA-F]+$/.test(privateKey.value) || !/^[0-9a-fA-F]+$/.test(peerPublicKey.value)) {
      throw new Error(t('encrypt.ecdh-key-exchange.invalidKeyFormat'))
    }

    // 导入私钥
    const privateKeyBuffer = hexToArrayBuffer(privateKey.value);
    const privateKeyObj = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      false,
      ['deriveKey', 'deriveBits']
    );

    // 导入对方公钥
    const peerPublicKeyBuffer = hexToArrayBuffer(peerPublicKey.value);
    const peerPublicKeyObj = await crypto.subtle.importKey(
      'spki',
      peerPublicKeyBuffer,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      false,
      [] // 公钥不需要指定用途
    );

    // 计算共享密钥
    const sharedSecretBuffer = await crypto.subtle.deriveBits(
      {
        name: 'ECDH',
        public: peerPublicKeyObj
      },
      privateKeyObj,
      256
    );

    sharedSecret.value = arrayBufferToHex(sharedSecretBuffer);
    message.success(t('encrypt.ecdh-key-exchange.sharedSecretComputed'))
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
    // 生成一个新的密钥对作为"对方"
    const testKeyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    );

    // 导出公钥
    const testPublicKeyBuffer = await crypto.subtle.exportKey('spki', testKeyPair.publicKey);
    peerPublicKey.value = arrayBufferToHex(testPublicKeyBuffer);
    
    message.success(t('encrypt.ecdh-key-exchange.testPeerKeyGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 复制我的公钥
const copyPeerPublicKey = async () => {
  try {
    await navigator.clipboard.writeText(publicKey.value)
    message.success(t('encrypt.ecdh-key-exchange.publicKeyCopied'))
  } catch (e) {
    message.error(t('encrypt.ecdh-key-exchange.copyError'))
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(sharedSecret.value)
    message.success(t('encrypt.ecdh-key-exchange.copySuccess'))
  } catch (e) {
    message.error(t('encrypt.ecdh-key-exchange.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  privateKey.value = ''
  publicKey.value = ''
  peerPublicKey.value = ''
  sharedSecret.value = ''
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.ecdh-key-exchange {
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
</style> 