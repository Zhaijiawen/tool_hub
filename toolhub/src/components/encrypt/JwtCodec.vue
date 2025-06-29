<template>
  <div class="jwt-codec">
    <n-card :title="t('encrypt.jwt.title')" :description="t('encrypt.jwt.description')">
      <!-- 文本输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.jwt.textInput') }}</n-text>
        <n-input 
          v-model:value="textInput" 
          type="textarea" 
          :placeholder="t('encrypt.jwt.textInputPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
        <div class="input-info" v-if="textInput">
          <n-text depth="3">{{ t('common.charCount') }}：{{ textInput.length }} {{ t('common.characters') }}</n-text>
        </div>
      </div>

      <!-- 密钥输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.jwt.secret') }}</n-text>
        <n-input 
          v-model:value="secret" 
          type="textarea" 
          :placeholder="t('encrypt.jwt.secretPlaceholder')"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.jwt.secretInfo') }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="handleEncode" type="primary" :disabled="!hasInput">
          {{ t('encrypt.jwt.encode') }}
        </n-button>
        <n-button @click="handleDecode" type="info" :disabled="!hasInput">
          {{ t('encrypt.jwt.decode') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <n-text>{{ t('common.output') }}</n-text>
        <div v-if="textOutput">
          <n-input 
            v-model:value="textOutput" 
            type="textarea" 
            :placeholder="t('encrypt.jwt.textOutputPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 10 }" 
            readonly 
          />
          <div class="output-actions">
            <n-space>
              <n-button @click="copyTextOutput" size="small">
                {{ t('common.copy') }}
              </n-button>
              <n-text depth="3">{{ t('common.charCount') }}：{{ textOutput.length }} {{ t('common.characters') }}</n-text>
            </n-space>
          </div>
        </div>
        <div v-if="!textOutput" class="output-placeholder">
          <n-text depth="3">{{ t('encrypt.jwt.outputPlaceholder') }}</n-text>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const textInput = ref('')
const textOutput = ref('')
const error = ref('')
const secret = ref('')

// 检查是否有输入
const hasInput = computed(() => {
  return textInput.value.trim()
})

// Base64 URL 安全编码
const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Base64 URL 安全解码
const base64UrlDecode = (str) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return atob(str)
}

// 创建JWT头部
const createHeader = () => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  return base64UrlEncode(JSON.stringify(header))
}

// 创建JWT载荷
const createPayload = (data) => {
  const payload = {
    data: data,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24小时后过期
  }
  return base64UrlEncode(JSON.stringify(payload))
}

// 创建签名（使用HMAC-SHA256算法）
const createSignature = async (header, payload, secret) => {
  const data = header + '.' + payload
  
  // 使用 Web Crypto API 实现 HMAC-SHA256
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)
  
  // 导入密钥
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  // 签名
  const signature = await crypto.subtle.sign('HMAC', key, messageData)
  
  // 转换为 Base64 URL 安全格式
  const signatureArray = new Uint8Array(signature)
  const signatureString = String.fromCharCode.apply(null, signatureArray)
  return base64UrlEncode(signatureString)
}

// 验证签名
const verifySignature = async (header, payload, signature, secret) => {
  try {
    const expectedSignature = await createSignature(header, payload, secret)
    return signature === expectedSignature
  } catch (e) {
    console.error('Signature verification error:', e)
    return false
  }
}

// 清空所有内容
const clearAll = () => {
  textInput.value = ''
  textOutput.value = ''
  error.value = ''
  secret.value = ''
}

// 编码处理
const handleEncode = async () => {
  error.value = ''
  textOutput.value = ''
  
  if (!textInput.value.trim()) {
    error.value = t('encrypt.jwt.inputRequired')
    return
  }
  
  if (!secret.value.trim()) {
    error.value = t('encrypt.jwt.secretRequired')
    return
  }
  
  try {
    const header = createHeader()
    const payload = createPayload(textInput.value.trim())
    const signature = await createSignature(header, payload, secret.value.trim())
    
    textOutput.value = `${header}.${payload}.${signature}`
  } catch (e) {
    error.value = t('common.invalidInput')
  }
}

// 解码处理
const handleDecode = async () => {
  error.value = ''
  textOutput.value = ''
  
  if (!textInput.value.trim()) {
    error.value = t('encrypt.jwt.inputRequired')
    return
  }
  
  try {
    const parts = textInput.value.trim().split('.')
    if (parts.length !== 3) {
      throw new Error(t('encrypt.jwt.invalidJwtFormat'))
    }
    
    const [header, payload, signature] = parts
    
    // 解码头部和载荷
    let decodedHeader, decodedPayload
    try {
      decodedHeader = JSON.parse(base64UrlDecode(header))
    } catch (e) {
      throw new Error(t('encrypt.jwt.jsonParseError') + ' (header)')
    }
    
    try {
      decodedPayload = JSON.parse(base64UrlDecode(payload))
    } catch (e) {
      throw new Error(t('encrypt.jwt.jsonParseError') + ' (payload)')
    }
    
    let result = {
      header: decodedHeader,
      payload: decodedPayload,
      signature: signature
    }
    
    // 验证签名（如果提供了密钥）
    if (secret.value.trim()) {
      const isValid = await verifySignature(header, payload, signature, secret.value.trim())
      if (!isValid) {
        result.signatureValid = false
        result.warning = 'Invalid signature - JWT may have been tampered with'
      } else {
        result.signatureValid = true
        result.warning = 'Signature verified successfully'
      }
    } else {
      result.signatureValid = null
      result.warning = '⚠️ No secret provided - Signature not verified. JWT content may be tampered with!'
    }
    
    // 检查是否过期
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      result.expired = true
      result.message = 'Token has expired'
    }
    
    textOutput.value = JSON.stringify(result, null, 2)
  } catch (e) {
    error.value = e.message || t('encrypt.jwt.invalidJwt')
  }
}

// 复制文本输出
const copyTextOutput = async () => {
  try {
    await navigator.clipboard.writeText(textOutput.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.jwt-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.input-section {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  background: none;
  padding: 0;
}
.input-info {
  margin-top: 8px;
}
.button-group {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.output-section {
  width: 100%;
  margin-bottom: 16px;
  border: none;
  background: none;
  padding: 0;
}
.output-actions {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.output-placeholder {
  text-align: center;
  padding: 40px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #fafafa;
}
.error-alert {
  margin-top: 16px;
}
</style>