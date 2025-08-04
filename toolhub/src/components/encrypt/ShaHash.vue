<template>
  <div class="sha-hash">
    <n-card :title="t('encrypt.sha.title')">
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.sha.input') }}</n-text>
        <n-input 
          v-model:value="input" 
          type="textarea" 
          :placeholder="t('encrypt.sha.inputPlaceholder')"
          :autosize="{ minRows: 8, maxRows: 15 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.sha.charCount', { count: input.length }) }}</n-text>
        </div>
      </div>

      <!-- 算法和格式选择 -->
      <div class="options-section">
        <n-form :model="formData" label-placement="left" label-width="120px">
          <n-form-item :label="t('encrypt.sha.algorithm')">
            <n-select 
              v-model:value="formData.algorithm" 
              :options="algorithmOptions"
              :placeholder="t('encrypt.sha.algorithmPlaceholder')" 
            />
          </n-form-item>

          <n-form-item :label="t('encrypt.sha.outputFormat')">
            <n-select 
              v-model:value="formData.outputFormat" 
              :options="outputFormatOptions"
              :placeholder="t('encrypt.sha.outputFormatPlaceholder')" 
            />
          </n-form-item>
        </n-form>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="hash" type="primary" :disabled="!input.trim()">
          {{ t('encrypt.sha.hash') }}
        </n-button>
        <n-button @click="copyToClipboard" :disabled="!output">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- Hash Information 区域 -->
      <div v-if="output" class="hash-info-overview">
        <n-alert type="info" :title="t('encrypt.sha.hashInfo')" class="mb-4">
          <template #default>
            <div class="hash-info-grid">
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.algorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ formData.algorithm }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.bitLength') }}:</strong> 
                <n-tag type="info" size="small">{{ getBitLength() }} {{ t('encrypt.sha.bits') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.security') }}:</strong> 
                <n-tag :type="getSecurityType()" size="small">{{ getSecurityStatus() }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.outputFormat') }}:</strong> 
                <n-tag type="info" size="small">{{ getFormatDisplayName() }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.inputLength') }}:</strong> 
                <n-tag type="info" size="small">{{ input.length }} {{ t('common.characters') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.outputLength') }}:</strong> 
                <n-tag type="info" size="small">{{ output.length }} {{ t('common.characters') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.computeTime') }}:</strong> 
                <n-tag type="info" size="small">{{ computeTime }}ms</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.sha.computed') }}:</strong> 
                <n-tag type="info" size="small">{{ hashGeneratedTime || t('encrypt.sha.notComputed') }}</n-tag>
              </div>
            </div>
            <!-- 格式说明 -->
            <div v-if="formData.outputFormat === 'base64url'" class="format-note">
              <n-text depth="3">
                <strong>{{ t('encrypt.sha.formatNote') }}:</strong> {{ t('encrypt.sha.base64urlNote') }}
              </n-text>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <n-text>{{ t('encrypt.sha.output') }}</n-text>
        <n-input 
          v-model:value="output" 
          type="textarea" 
          :placeholder="t('encrypt.sha.outputPlaceholder')"
          :autosize="{ minRows: 8, maxRows: 15 }" 
          readonly 
        />
        <div class="output-info" v-if="output">
          <n-text depth="3">{{ t('encrypt.sha.length') }}：{{ output.length }} {{ t('encrypt.sha.characters') }}</n-text>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="sha" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CryptoJS from 'crypto-js'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const output = ref('')
const error = ref('')
const computeTime = ref(0) // 计算时间
const hashGeneratedTime = ref('') // 哈希生成时间

const formData = reactive({
  algorithm: 'SHA-256',
  outputFormat: 'hex'
})

// 算法选项
const algorithmOptions = [
  { label: `SHA-1 (160${t('encrypt.sha.bits')})`, value: 'SHA-1' },
  { label: `SHA-224 (224${t('encrypt.sha.bits')})`, value: 'SHA-224' },
  { label: `SHA-256 (256${t('encrypt.sha.bits')})`, value: 'SHA-256' },
  { label: `SHA-384 (384${t('encrypt.sha.bits')})`, value: 'SHA-384' },
  { label: `SHA-512 (512${t('encrypt.sha.bits')})`, value: 'SHA-512' },
  { label: `SHA-512/224 (224${t('encrypt.sha.bits')})`, value: 'SHA-512/224' },
  { label: `SHA-512/256 (256${t('encrypt.sha.bits')})`, value: 'SHA-512/256' },
  { label: `MD5 (128${t('encrypt.sha.bits')})`, value: 'MD5' }
]

// 输出格式选项
const outputFormatOptions = [
  { label: `HEX (${t('encrypt.sha.hexadecimal')})`, value: 'hex' },
  { label: `Base64 (${t('encrypt.sha.base64')})`, value: 'base64' },
  { label: `Base64URL (${t('encrypt.sha.base64url')})`, value: 'base64url' }
]

// 获取位数
const getBitLength = () => {
  const bitMap = {
    'MD5': 128,
    'SHA-1': 160,
    'SHA-224': 224,
    'SHA-256': 256,
    'SHA-384': 384,
    'SHA-512': 512,
    'SHA-512/224': 224,
    'SHA-512/256': 256
  }
  return bitMap[formData.algorithm] || 256
}

// 获取安全性状态
const getSecurityStatus = () => {
  const securityMap = {
    'MD5': t('encrypt.sha.insecure'),
    'SHA-1': t('encrypt.sha.deprecated'),
    'SHA-224': t('encrypt.sha.secure'),
    'SHA-256': t('encrypt.sha.secure'),
    'SHA-384': t('encrypt.sha.secure'),
    'SHA-512': t('encrypt.sha.secure'),
    'SHA-512/224': t('encrypt.sha.secure'),
    'SHA-512/256': t('encrypt.sha.secure')
  }
  return securityMap[formData.algorithm] || t('encrypt.sha.secure')
}

// 获取安全性类型（用于标签颜色）
const getSecurityType = () => {
  const typeMap = {
    'MD5': 'error',
    'SHA-1': 'warning',
    'SHA-224': 'success',
    'SHA-256': 'success',
    'SHA-384': 'success',
    'SHA-512': 'success',
    'SHA-512/224': 'success',
    'SHA-512/256': 'success'
  }
  return typeMap[formData.algorithm] || 'success'
}

// 获取格式显示名称
const getFormatDisplayName = () => {
  const formatMap = {
    'hex': 'HEX',
    'base64': t('encrypt.sha.base64'),
    'base64url': t('encrypt.sha.base64url')
  }
  return formatMap[formData.outputFormat] || 'HEX'
}

// 计算哈希
const hash = () => {
  try {
    if (!input.value.trim()) {
      error.value = t('encrypt.sha.inputRequired')
      return
    }

    const startTime = performance.now()
    let hashed
    switch (formData.algorithm) {
      case 'SHA-1':
        hashed = CryptoJS.SHA1(input.value)
        break
      case 'SHA-224':
        hashed = CryptoJS.SHA224(input.value)
        break
      case 'SHA-256':
        hashed = CryptoJS.SHA256(input.value)
        break
      case 'SHA-384':
        hashed = CryptoJS.SHA384(input.value)
        break
      case 'SHA-512':
        hashed = CryptoJS.SHA512(input.value)
        break
      case 'SHA-512/224':
        hashed = CryptoJS.SHA512(input.value, { outputLength: 224 })
        break
      case 'SHA-512/256':
        hashed = CryptoJS.SHA512(input.value, { outputLength: 256 })
        break
      case 'MD5':
        hashed = CryptoJS.MD5(input.value)
        break
      default:
        error.value = t('encrypt.sha.invalidAlgorithm')
        return
    }

    // 根据输出格式转换
    switch (formData.outputFormat) {
      case 'hex':
        output.value = hashed.toString(CryptoJS.enc.Hex)
        break
      case 'base64':
        output.value = hashed.toString(CryptoJS.enc.Base64)
        break
      case 'base64url':
        output.value = hashed.toString(CryptoJS.enc.Base64url)
        break
      default:
        output.value = hashed.toString(CryptoJS.enc.Hex)
    }

    // 记录计算时间和生成时间
    const endTime = performance.now()
    computeTime.value = Math.round(endTime - startTime)
    hashGeneratedTime.value = new Date().toLocaleString()

    error.value = ''
    message.success(t('encrypt.sha.hashSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('encrypt.sha.copySuccess'))
  } catch (e) {
    message.error(t('encrypt.sha.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
  computeTime.value = 0
  hashGeneratedTime.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.sha-hash {
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

.options-section {
  margin-bottom: 20px;
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

.hash-info-overview {
  margin: 20px 0;
}

.hash-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.hash-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.format-note {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 4px;
  border-left: 3px solid #007bff;
}
</style>