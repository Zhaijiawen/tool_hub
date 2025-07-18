<template>
  <div class="des-encrypt">
    <n-card :title="t('encrypt.des.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.des.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

        <n-form :model="formData" label-placement="left" label-width="200px">
          <n-form-item :label="t('encrypt.des.key')">
            <n-input v-model:value="formData.key" :placeholder="t('encrypt.des.keyPlaceholder')" />
            <template #feedback>
              <span style="font-size: 12px; color: #666;">
                {{ t('encrypt.des.keyLengthTip') }}
              </span>
            </template>
          </n-form-item>

          <n-form-item :label="t('encrypt.des.iv')">
            <n-input v-model:value="formData.iv" :placeholder="t('encrypt.des.ivPlaceholder')" 
              :disabled="formData.mode === 'ECB'" />
            <template #feedback>
              <span v-if="formData.mode === 'ECB'" style="font-size: 12px; color: #999;">
                {{ t('encrypt.des.ecbNoIV') }}
              </span>
              <span v-else style="font-size: 12px; color: #666;">
                {{ t('encrypt.des.ivTip') }}
              </span>
            </template>
          </n-form-item>

          <n-form-item :label="t('encrypt.des.mode')">
            <n-select v-model:value="formData.mode" :options="modeOptions"
              :placeholder="t('encrypt.des.modePlaceholder')" />
          </n-form-item>

          <n-form-item :label="t('encrypt.des.type')">
            <n-select v-model:value="formData.type" :options="typeOptions"
              :placeholder="t('encrypt.des.typePlaceholder')" />
          </n-form-item>

          <n-form-item :label="t('encrypt.des.padding')">
            <n-select v-model:value="formData.padding" :options="paddingOptions"
              :placeholder="t('encrypt.des.paddingPlaceholder')" />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="encrypt" type="primary">
            {{ t('encrypt.des.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.des.decrypt') }}
          </n-button>
          <n-button @click="generateKeyIV">
            {{ t('encrypt.des.generateKeyIV') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('encrypt.des.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" readonly />

        <!-- 调试信息 -->
        <n-alert v-if="debugInfo" type="info" :title="t('encrypt.des.debugTitle')" class="debug-alert">
          <p>{{ t('encrypt.des.type') }}: {{ formData.type }}</p>
          <p>{{ t('encrypt.des.mode') }}: {{ formData.mode }}</p>
          <p>{{ t('encrypt.des.padding') }}: {{ formData.padding }}</p>
          <p>{{ t('encrypt.des.keyLength') }}: {{ formData.key.length }} {{ t('common.characters') }}
            <span v-if="getKeyLength() === formData.key.length" style="color: green;">✓ {{ t('encrypt.des.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('encrypt.des.error') }}（{{ t('encrypt.des.keyLengthError') }}）</span>
          </p>
          <p>{{ t('encrypt.des.ivLength') }}: {{ formData.iv.length }} {{ t('common.characters') }}
            <span v-if="formData.mode === 'ECB'" style="color: #999;">（{{ t('encrypt.des.ivNotRequired') }}）</span>
            <span v-else-if="formData.iv.length === 8" style="color: green;">✓ {{ t('encrypt.des.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('encrypt.des.error') }}（{{ t('encrypt.des.ivLengthError') }}）</span>
          </p>
          <p>{{ t('encrypt.des.inputLength') }}: {{ input.length }} {{ t('common.characters') }}
            <span v-if="isEncrypting && formData.padding === 'NoPadding' && input.length % 8 === 0" style="color: green;">✓ {{ t('encrypt.des.correct') }}（{{ t('encrypt.des.noPaddingCorrect') }}）</span>
            <span v-else-if="isEncrypting && formData.padding === 'NoPadding' && input.length % 8 !== 0" style="color: red;">✗ {{ t('encrypt.des.error') }}（{{ t('encrypt.des.noPaddingError') }}）</span>
            <span v-else-if="isEncrypting && formData.padding === 'Pkcs7'" style="color: #666;">（{{ t('encrypt.des.pkcs7Support') }}）</span>
            <span v-else style="color: #999;">（{{ t('encrypt.des.decryptMode') }}）</span>
          </p>
        </n-alert>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="des" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CryptoJS from 'crypto-js'
// 导入工具描述组件
import ToolDescription from '@/components/common/ToolDescription.vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')
const debugInfo = ref(true)
const isEncrypting = ref(true)

const formData = reactive({
  key: '',
  iv: '',
  mode: 'CBC',
  type: 'DES',
  padding: 'Pkcs7'
})

const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'CFB', value: 'CFB' },
  { label: 'CTR', value: 'CTR' },
  { label: 'ECB', value: 'ECB' },
  { label: 'OFB', value: 'OFB' }
]

const typeOptions = [
  { label: 'DES', value: 'DES' },
  { label: 'TripleDES', value: 'TripleDES' }
]

const paddingOptions = [
  { label: 'PKCS7', value: 'Pkcs7' },
  { label: `NoPadding (${t('encrypt.des.noPaddingTip')})`, value: 'NoPadding' }
]

// 获取密钥长度要求
const getKeyLength = () => {
  return formData.type === 'DES' ? 8 : 24 // DES需要8字节，TripleDES需要24字节
}

// 获取数据块大小
const getBlockSize = () => {
  return 8 // DES和TripleDES都是8字节块大小
}

const encrypt = () => {
  try {
    error.value = ''
    isEncrypting.value = true

    if (!formData.key) {
      throw new Error(t('encrypt.des.keyRequired'))
    }

    if (!input.value.trim()) {
      throw new Error(t('encrypt.des.inputRequired'))
    }

    // 检查是否需要 IV
    const modesRequiringIV = ['CBC', 'CFB', 'CTR', 'OFB']
    if (modesRequiringIV.includes(formData.mode) && !formData.iv.trim()) {
      throw new Error(t('encrypt.des.ivRequired', { mode: formData.mode }))
    }

    // 验证密钥长度
    const requiredKeyLength = getKeyLength()
    if (formData.key.length !== requiredKeyLength) {
      throw new Error(t('encrypt.des.keyLengthError'))
    }

    // 验证IV长度（如果需要）
    if (modesRequiringIV.includes(formData.mode) && formData.iv.length !== 8) {
      throw new Error(t('encrypt.des.ivLengthError'))
    }

    // 验证 NoPadding 的数据长度
    if (formData.padding === 'NoPadding' && input.value.length % getBlockSize() !== 0) {
      throw new Error(t('encrypt.des.noPaddingLengthError', { length: input.value.length }))
    }

    const key = CryptoJS.enc.Utf8.parse(formData.key)
    const iv = formData.iv ? CryptoJS.enc.Utf8.parse(formData.iv) : undefined

    // 构建配置对象
    const config = {
      mode: CryptoJS.mode[formData.mode]
    }
    
    // 添加 IV（如果提供且模式需要）
    if (iv && modesRequiringIV.includes(formData.mode)) {
      config.iv = iv
    }

    // 添加 padding 配置
    if (formData.padding === 'Pkcs7') {
      config.padding = CryptoJS.pad.Pkcs7
    } else if (formData.padding === 'NoPadding') {
      config.padding = CryptoJS.pad.NoPadding
    }

    const encrypted = formData.type === 'DES'
      ? CryptoJS.DES.encrypt(input.value, key, config)
      : CryptoJS.TripleDES.encrypt(input.value, key, config)

    output.value = encrypted.toString()
    error.value = ''
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

const decrypt = () => {
  try {
    error.value = ''
    isEncrypting.value = false

    if (!formData.key) {
      throw new Error(t('encrypt.des.keyRequired'))
    }

    if (!input.value.trim()) {
      throw new Error(t('encrypt.des.decryptInputRequired'))
    }

    // 检查是否需要 IV
    const modesRequiringIV = ['CBC', 'CFB', 'CTR', 'OFB']
    if (modesRequiringIV.includes(formData.mode) && !formData.iv.trim()) {
      throw new Error(t('encrypt.des.ivRequired', { mode: formData.mode }))
    }

    // 验证密钥长度
    const requiredKeyLength = getKeyLength()
    if (formData.key.length !== requiredKeyLength) {
      throw new Error(t('encrypt.des.keyLengthError'))
    }

    // 验证IV长度（如果需要）
    if (modesRequiringIV.includes(formData.mode) && formData.iv.length !== 8) {
      throw new Error(t('encrypt.des.ivLengthError'))
    }

    const key = CryptoJS.enc.Utf8.parse(formData.key)
    const iv = formData.iv ? CryptoJS.enc.Utf8.parse(formData.iv) : undefined

    // 构建配置对象
    const config = {
      mode: CryptoJS.mode[formData.mode]
    }
    
    // 添加 IV（如果提供且模式需要）
    if (iv && modesRequiringIV.includes(formData.mode)) {
      config.iv = iv
    }

    // 添加 padding 配置
    if (formData.padding === 'Pkcs7') {
      config.padding = CryptoJS.pad.Pkcs7
    } else if (formData.padding === 'NoPadding') {
      config.padding = CryptoJS.pad.NoPadding
    }

    const decrypted = formData.type === 'DES'
      ? CryptoJS.DES.decrypt(input.value, key, config)
      : CryptoJS.TripleDES.decrypt(input.value, key, config)

    output.value = decrypted.toString(CryptoJS.enc.Utf8)
    error.value = ''
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
  }
}

const generateKeyIV = () => {
  try {
    error.value = ''
    const keyLength = getKeyLength()
    const key = Array.from(crypto.getRandomValues(new Uint8Array(keyLength))).map(b => String.fromCharCode(97 + b % 26)).join('')
    const iv = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => String.fromCharCode(97 + b % 26)).join('')
    formData.key = key
    formData.iv = iv
    message.success(t('encrypt.des.keyIVGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('encrypt.des.generateFailed', { error: e.message }))
  }
}
</script>

<style scoped>
.des-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.debug-alert {
  margin-top: 16px;
}

.error-alert {
  margin-top: 16px;
}
</style>