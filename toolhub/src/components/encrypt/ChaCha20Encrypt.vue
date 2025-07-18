<template>
  <div class="chacha20-encrypt">
    <n-card :title="t('encrypt.chacha20.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.chacha20.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

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
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('encrypt.chacha20.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" readonly />

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
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="chacha20" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { streamXOR } from '@stablelib/chacha'
// 导入工具描述组件
import ToolDescription from '@/components/common/ToolDescription.vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')
const debugInfo = ref(true)

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
    if (!input.value) throw new Error(t('encrypt.chacha20.inputPlaceholder'))

    const key = toBytes(formData.key)
    const nonce = toBytes(formData.nonce)
    const plain = toBytes(input.value)
    const out = new Uint8Array(plain.length)
    streamXOR(key, nonce, plain, out, 0)
    output.value = toBase64(out)
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

const decrypt = () => {
  try {
    error.value = ''
    if (formData.key.length !== 32) throw new Error(t('encrypt.chacha20.keyLengthError'))
    if (formData.nonce.length !== 8) throw new Error(t('encrypt.chacha20.nonceLengthError'))
    if (!input.value) throw new Error(t('encrypt.chacha20.inputPlaceholder'))

    const key = toBytes(formData.key)
    const nonce = toBytes(formData.nonce)
    const ciphertext = fromBase64(input.value)
    const out = new Uint8Array(ciphertext.length)
    streamXOR(key, nonce, ciphertext, out, 0)
    output.value = fromBytes(out)
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

const copyToClipboard = async () => {
  try {
    error.value = ''
    await navigator.clipboard.writeText(output.value)
    message.success(t('common.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

const generateKeyNonce = () => {
  try {
    error.value = ''
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => String.fromCharCode(97 + b % 26)).join('')
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => String.fromCharCode(97 + b % 26)).join('')
    formData.key = key
    formData.nonce = nonce
    message.success(t('encrypt.chacha20.keyNonceGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('encrypt.chacha20.generateFailed', { error: e.message }))
  }
}
</script>

<style scoped>
.chacha20-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.error-alert {
  margin-top: 16px;
}
.debug-alert {
  margin-top: 16px;
}
</style>