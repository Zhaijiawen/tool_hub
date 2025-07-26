<template>
  <div class="chacha20-encrypt">
    <n-card :title="t('encrypt.chacha20.title')">
      <n-space vertical>
        <!-- 统一的输入/输出窗口 -->
        <div class="input-output-section">
          <n-text>{{ t('encrypt.chacha20.inputLabel') }}</n-text>
          <n-input 
            v-model:value="input" 
            type="textarea" 
            :placeholder="t('encrypt.chacha20.inputPlaceholder')"
            :autosize="{ minRows: 8, maxRows: 15 }" 
          />
          <div class="input-info">
            <n-text depth="3">{{ t('encrypt.chacha20.charCount', { count: input.length }) }}</n-text>
          </div>
        </div>

        <n-form :model="formData" label-placement="left" label-width="200px">
          <n-form-item :label="t('encrypt.chacha20.key')">
            <n-input v-model:value="formData.key" :placeholder="t('encrypt.chacha20.keyPlaceholder')" />
            <template #feedback>
              <span style="font-size: 12px; color: #666;">
                {{ t('encrypt.chacha20.keyLengthError') }}
              </span>
            </template>
          </n-form-item>
          <n-form-item :label="t('encrypt.chacha20.nonce')">
            <n-input v-model:value="formData.nonce" :placeholder="t('encrypt.chacha20.noncePlaceholder')" />
            <template #feedback>
              <span style="font-size: 12px; color: #666;">
                {{ t('encrypt.chacha20.nonceLengthError') }}
              </span>
            </template>
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="encrypt" type="primary">
            {{ t('encrypt.chacha20.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.chacha20.decrypt') }}
          </n-button>
          <n-button @click="generateKeyNonce">
            {{ t('encrypt.chacha20.generateKeyNonce') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
          <n-button @click="clearAll">
            {{ t('common.clear') }}
          </n-button>
        </n-space>

        <!-- Key Information 区域 -->
        <div v-if="formData.key || formData.nonce" class="key-info-overview">
          <n-alert type="info" :title="t('encrypt.chacha20.keyInfo')" class="mb-4">
            <template #default>
              <div class="key-info-grid">
                <div class="key-info-item">
                  <strong>{{ t('encrypt.chacha20.algorithm') }}:</strong> 
                  <n-tag type="info" size="small">ChaCha20</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.chacha20.keyLength') }}:</strong> 
                  <n-tag :type="formData.key.length === 32 ? 'success' : 'error'" size="small">
                    {{ formData.key.length }} {{ t('common.characters') }} ({{ formData.key.length * 8 }} bits)
                  </n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.chacha20.nonceLength') }}:</strong> 
                  <n-tag :type="formData.nonce.length === 8 ? 'success' : 'error'" size="small">
                    {{ formData.nonce.length }} {{ t('common.characters') }} ({{ formData.nonce.length * 8 }} bits)
                  </n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.chacha20.encryption') }}:</strong> 
                  <n-tag type="info" size="small">Stream Cipher</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.chacha20.format') }}:</strong> 
                  <n-tag type="info" size="small">Base64</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.chacha20.generated') }}:</strong> 
                  <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.chacha20.notGenerated') }}</n-tag>
                </div>
              </div>
            </template>
          </n-alert>
        </div>

        <!-- 调试信息 -->
        <n-alert v-if="debugInfo" type="info" :title="t('encrypt.chacha20.debugTitle')" class="debug-alert">
          <p>{{ t('encrypt.chacha20.keyLength') }}: {{ formData.key.length }} {{ t('common.characters') }}
            <span v-if="formData.key.length === 32" style="color: green;">✓ {{ t('encrypt.chacha20.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('encrypt.chacha20.error') }}（{{ t('encrypt.chacha20.keyLengthErrorShort') }}）</span>
          </p>
          <p>{{ t('encrypt.chacha20.nonceLength') }}: {{ formData.nonce.length }} {{ t('common.characters') }}
            <span v-if="formData.nonce.length === 8" style="color: green;">✓ {{ t('encrypt.chacha20.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('encrypt.chacha20.error') }}（{{ t('encrypt.chacha20.nonceLengthErrorShort') }}）</span>
          </p>
          <p>{{ t('encrypt.chacha20.inputLength') }}: {{ input.length }} {{ t('common.characters') }}</p>
        </n-alert>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
    
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { streamXOR } from '@stablelib/chacha'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const debugInfo = ref(true)
const keyGeneratedTime = ref('') // 记录密钥生成时间

const formData = reactive({
  key: '',
  nonce: ''
})

function toBytes(str) {
  return new TextEncoder().encode(str)
}
function fromBytes(bytes) {
  return new TextDecoder().decode(bytes)
}
function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}
function fromBase64(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

const encrypt = () => {
  try {
    error.value = ''
    if (formData.key.length !== 32) throw new Error(t('encrypt.chacha20.keyLengthError'))
    if (formData.nonce.length !== 8) throw new Error(t('encrypt.chacha20.nonceLengthError'))
    if (!input.value) throw new Error(t('encrypt.chacha20.inputRequired'))

    const key = toBytes(formData.key)
    const nonce = toBytes(formData.nonce)
    const plain = toBytes(input.value)
    const out = new Uint8Array(plain.length)
    streamXOR(key, nonce, plain, out, 0)
    input.value = toBase64(out)
    message.success(t('encrypt.chacha20.encryptSuccess'))
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    error.value = ''
    if (formData.key.length !== 32) throw new Error(t('encrypt.chacha20.keyLengthError'))
    if (formData.nonce.length !== 8) throw new Error(t('encrypt.chacha20.nonceLengthError'))
    if (!input.value) throw new Error(t('encrypt.chacha20.decryptInputRequired'))

    const key = toBytes(formData.key)
    const nonce = toBytes(formData.nonce)
    const ciphertext = fromBase64(input.value)
    const out = new Uint8Array(ciphertext.length)
    streamXOR(key, nonce, ciphertext, out, 0)
    input.value = fromBytes(out)
    message.success(t('encrypt.chacha20.decryptSuccess'))
  } catch (e) {
    error.value = e.message
  }
}

const copyToClipboard = async () => {
  try {
    error.value = ''
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.copyError'))
  }
}

const generateKeyNonce = () => {
  try {
    error.value = ''
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => String.fromCharCode(97 + b % 26)).join('')
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => String.fromCharCode(97 + b % 26)).join('')
    formData.key = key
    formData.nonce = nonce
    
    // 记录生成时间
    keyGeneratedTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.chacha20.keyNonceGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('encrypt.chacha20.generateFailed', { error: e.message }))
  }
}

const clearAll = () => {
  input.value = ''
  formData.key = ''
  formData.nonce = ''
  keyGeneratedTime.value = ''
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.chacha20-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-output-section {
  margin-bottom: 20px;
}

.input-output-section .n-text {
  display: block;
  margin-bottom: 8px;
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

.debug-alert {
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