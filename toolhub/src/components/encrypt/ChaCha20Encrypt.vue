<template>
  <n-card :title="$t('encrypt.chacha20.title')">
    <n-form>
      <n-form-item :label="$t('encrypt.chacha20.inputPlaceholder')">
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="$t('encrypt.chacha20.inputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }"
        />
      </n-form-item>

      <n-form-item :label="$t('encrypt.chacha20.key')">
        <n-input
          v-model:value="key"
          :placeholder="$t('encrypt.chacha20.keyPlaceholder')"
          type="password"
          show-password-on="click"
        />
      </n-form-item>

      <n-form-item :label="$t('encrypt.chacha20.nonce')">
        <n-input
          v-model:value="nonce"
          :placeholder="$t('encrypt.chacha20.noncePlaceholder')"
        />
      </n-form-item>

      <n-form-item :label="$t('encrypt.chacha20.counter')">
        <n-input-number
          v-model:value="counter"
          :placeholder="$t('encrypt.chacha20.counterPlaceholder')"
          :min="0"
        />
      </n-form-item>

      <n-space>
        <n-button @click="encrypt">
          {{ $t('encrypt.chacha20.encrypt') }}
        </n-button>
        <n-button @click="decrypt">
          {{ $t('encrypt.chacha20.decrypt') }}
        </n-button>
      </n-space>

      <n-form-item :label="$t('encrypt.chacha20.outputPlaceholder')" class="mt-4">
        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="$t('encrypt.chacha20.outputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }"
          readonly
        />
      </n-form-item>

      <n-space>
        <n-button @click="copyOutput" :disabled="!output">
          {{ $t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ $t('common.clear') }}
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { encode as base64Encode, decode as base64Decode } from '@stablelib/base64'
import { ChaCha20 } from '@stablelib/chacha20'

const { t } = useI18n()
const message = useMessage()

// 状态变量
const input = ref('')
const key = ref('')
const nonce = ref('')
const counter = ref(0)
const output = ref('')

// 生成随机密钥
function generateRandomKey() {
  const keyBytes = new Uint8Array(32)
  crypto.getRandomValues(keyBytes)
  return base64Encode(keyBytes)
}

// 生成随机nonce
function generateRandomNonce() {
  const nonceBytes = new Uint8Array(12)
  crypto.getRandomValues(nonceBytes)
  return base64Encode(nonceBytes)
}

// 加密
async function encrypt() {
  try {
    if (!input.value) {
      message.warning(t('encrypt.chacha20.inputRequired'))
      return
    }
    if (!key.value) {
      message.warning(t('encrypt.chacha20.keyRequired'))
      return
    }
    if (!nonce.value) {
      message.warning(t('encrypt.chacha20.nonceRequired'))
      return
    }

    // 将输入转换为字节数组
    const inputBytes = new TextEncoder().encode(input.value)
    
    // 解码密钥和nonce
    const keyBytes = base64Decode(key.value)
    const nonceBytes = base64Decode(nonce.value)

    // 创建ChaCha20实例
    const cipher = new ChaCha20(keyBytes, nonceBytes, counter.value)

    // 加密
    const encryptedBytes = cipher.stream(inputBytes)

    // 将加密结果转换为Base64
    output.value = base64Encode(encryptedBytes)
  } catch (e) {
    message.error(e.message)
  }
}

// 解密
async function decrypt() {
  try {
    if (!input.value) {
      message.warning(t('encrypt.chacha20.inputRequired'))
      return
    }
    if (!key.value) {
      message.warning(t('encrypt.chacha20.keyRequired'))
      return
    }
    if (!nonce.value) {
      message.warning(t('encrypt.chacha20.nonceRequired'))
      return
    }

    // 解码输入
    const inputBytes = base64Decode(input.value)
    
    // 解码密钥和nonce
    const keyBytes = base64Decode(key.value)
    const nonceBytes = base64Decode(nonce.value)

    // 创建ChaCha20实例
    const cipher = new ChaCha20(keyBytes, nonceBytes, counter.value)

    // 解密
    const decryptedBytes = cipher.stream(inputBytes)

    // 将解密结果转换为文本
    output.value = new TextDecoder().decode(decryptedBytes)
  } catch (e) {
    message.error(e.message)
  }
}

// 复制输出
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('common.copied'))
}

// 清空所有
function clearAll() {
  input.value = ''
  key.value = ''
  nonce.value = ''
  counter.value = 0
  output.value = ''
}

// 初始化时生成随机密钥和nonce
key.value = generateRandomKey()
nonce.value = generateRandomNonce()
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style> 