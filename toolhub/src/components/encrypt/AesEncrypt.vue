<template>
  <div class="aes-encrypt">

    <n-card :title="t('encrypt.aes.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.aes.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

        <n-form :model="formData" label-placement="left" label-width="200px">
          <n-form-item :label="t('encrypt.aes.key')">
            <n-input v-model:value="formData.key" :placeholder="t('encrypt.aes.keyPlaceholder')" />
            <template #feedback>
              <span style="font-size: 12px; color: #666;">
                {{ t('encrypt.aes.keyLengthTip') }}
              </span>
            </template>
          </n-form-item>

          <n-form-item :label="t('encrypt.aes.iv')">
            <n-input v-model:value="formData.iv" :placeholder="t('encrypt.aes.ivPlaceholder')" 
              :disabled="formData.mode === 'ECB'" />
            <template #feedback>
              <span v-if="formData.mode === 'ECB'" style="font-size: 12px; color: #999;">
                {{ t('encrypt.aes.ecbNoIV') }}
              </span>
              <span v-else style="font-size: 12px; color: #666;">
                {{ t('encrypt.aes.ivTip') }}
              </span>
            </template>
          </n-form-item>

          <n-form-item :label="t('encrypt.aes.mode')">
            <n-select v-model:value="formData.mode" :options="modeOptions"
              :placeholder="t('encrypt.aes.modePlaceholder')" />
          </n-form-item>

          <n-form-item :label="t('encrypt.aes.padding')">
            <n-select v-model:value="formData.padding" :options="paddingOptions"
              :placeholder="t('encrypt.aes.paddingPlaceholder')" />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="encrypt" type="primary">
            {{ t('encrypt.aes.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.aes.decrypt') }}
          </n-button>
          <n-button @click="generateKeyIV">
            {{ t('encrypt.aes.generateKeyIV') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('encrypt.aes.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" readonly />

        <!-- 调试信息 -->
        <n-alert v-if="debugInfo" type="info" :title="t('encrypt.aes.debugTitle')" class="debug-alert">
          <p>{{ t('encrypt.aes.mode') }}: {{ formData.mode }}</p>
          <p>{{ t('encrypt.aes.padding') }}: {{ formData.padding }}</p>
          <p>{{ t('encrypt.aes.keyLength') }}: {{ formData.key.length }} {{ t('common.characters') }}
            <span v-if="formData.key.length === 16" style="color: green;">✓ {{ t('encrypt.aes.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('encrypt.aes.error') }}（{{ t('encrypt.aes.keyLengthError') }}）</span>
          </p>
          <p>{{ t('encrypt.aes.ivLength') }}: {{ formData.iv.length }} {{ t('common.characters') }}
            <span v-if="formData.mode === 'ECB'" style="color: #999;">（{{ t('encrypt.aes.ivNotRequired') }}）</span>
            <span v-else-if="formData.iv.length === 16" style="color: green;">✓ {{ t('encrypt.aes.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('encrypt.aes.error') }}（{{ t('encrypt.aes.ivLengthError') }}）</span>
          </p>
          <p>{{ t('encrypt.aes.inputLength') }}: {{ input.length }} {{ t('common.characters') }}
            <span v-if="isEncrypting && formData.padding === 'NoPadding' && input.length % 16 === 0" style="color: green;">✓ {{ t('encrypt.aes.correct') }}（{{ t('encrypt.aes.noPaddingCorrect') }}）</span>
            <span v-else-if="isEncrypting && formData.padding === 'NoPadding' && input.length % 16 !== 0" style="color: red;">✗ {{ t('encrypt.aes.error') }}（{{ t('encrypt.aes.noPaddingError') }}）</span>
            <span v-else-if="isEncrypting && formData.padding === 'Pkcs7'" style="color: #666;">（{{ t('encrypt.aes.pkcs7Support') }}）</span>
            <span v-else style="color: #999;">（{{ t('encrypt.aes.decryptMode') }}）</span>
          </p>
        </n-alert>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
        <!-- 工具描述组件 -->
    <ToolDescription tool-key="aes" />
    
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CryptoJS from 'crypto-js'
import ToolDescription from '../common/ToolDescription.vue'

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
  padding: 'Pkcs7'
})

const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'CFB', value: 'CFB' },
  { label: 'CTR', value: 'CTR' },
  { label: 'ECB', value: 'ECB' },
  { label: 'OFB', value: 'OFB' }
]

const paddingOptions = [
  { label: 'PKCS7', value: 'Pkcs7' },
  { label: `NoPadding (${t('encrypt.aes.noPaddingTip')})`, value: 'NoPadding' }
]

const encrypt = () => {
  try {
    error.value = ''

    isEncrypting.value = true // 设置为加密状态
    
    if (!formData.key) {
      throw new Error(t('encrypt.aes.keyRequired'))
    }

    if (!input.value.trim()) {
      throw new Error(t('encrypt.aes.inputRequired'))
    }

    // 检查是否需要 IV
    const modesRequiringIV = ['CBC', 'CFB', 'CTR', 'OFB']
    if (modesRequiringIV.includes(formData.mode) && !formData.iv.trim()) {
      throw new Error(t('encrypt.aes.ivRequired', { mode: formData.mode }))
    }

    // 验证密钥长度
    if (formData.key.length !== 16) {
      throw new Error(t('encrypt.aes.keyLengthError'))
    }

    // 验证IV长度（如果需要）
    if (modesRequiringIV.includes(formData.mode) && formData.iv.length !== 16) {
      throw new Error(t('encrypt.aes.ivLengthError'))
    }

    // 验证 NoPadding 的数据长度
    if (formData.padding === 'NoPadding' && input.value.length % 16 !== 0) {
      throw new Error(t('encrypt.aes.noPaddingLengthError', { length: input.value.length }))
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

    const encrypted = CryptoJS.AES.encrypt(input.value, key, config)

    output.value = encrypted.toString()
  } catch (e) {
    error.value = e.message
    output.value = '' // 清空输出
  }
}

const decrypt = () => {
  try {
    error.value = ''

    isEncrypting.value = false // 设置为解密状态
    
    if (!formData.key) {
      throw new Error(t('encrypt.aes.keyRequired'))
    }

    if (!input.value.trim()) {
      throw new Error(t('encrypt.aes.decryptInputRequired'))
    }

    // 检查是否需要 IV
    const modesRequiringIV = ['CBC', 'CFB', 'CTR', 'OFB']
    if (modesRequiringIV.includes(formData.mode) && !formData.iv.trim()) {
      throw new Error(t('encrypt.aes.ivRequired', { mode: formData.mode }))
    }

    // 验证密钥长度
    if (formData.key.length !== 16) {
      throw new Error(t('encrypt.aes.keyLengthError'))
    }

    // 验证IV长度（如果需要）
    if (modesRequiringIV.includes(formData.mode) && formData.iv.length !== 16) {
      throw new Error(t('encrypt.aes.ivLengthError'))
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

    const decrypted = CryptoJS.AES.decrypt(input.value, key, config)
    
    // 对于 NoPadding，尝试不同的编码方式
    let decryptedText = ''
    if (formData.padding === 'NoPadding') {
      try {
        // 首先尝试 UTF-8
        decryptedText = decrypted.toString(CryptoJS.enc.Utf8)
      } catch (e) {
        try {
          // 如果 UTF-8 失败，尝试 Hex 编码
          decryptedText = decrypted.toString(CryptoJS.enc.Hex)
        } catch (e2) {
          try {
            // 最后尝试 Base64 编码
            decryptedText = decrypted.toString(CryptoJS.enc.Base64)
          } catch (e3) {
            // 如果都失败，显示原始字节数据
            decryptedText = '解密成功，但数据不是有效的文本格式。原始数据：' + decrypted.toString()
          }
        }
      }
    } else {
      // 对于其他 padding 方式，使用 UTF-8
      decryptedText = decrypted.toString(CryptoJS.enc.Utf8)
    }

    // 检查解密结果是否为空
    if (!decryptedText) {
      throw new Error(t('encrypt.aes.decryptFailed'))
    }

    output.value = decryptedText
  } catch (e) {
    error.value = e.message
    output.value = '' // 清空输出
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

const generateKeyIV = () => {
  try {
    error.value = ''
    // 生成16字节的随机密钥和IV
    const keyBytes = CryptoJS.lib.WordArray.random(16)
    const ivBytes = CryptoJS.lib.WordArray.random(16)
    
    // 转换为16字符的字符串
    formData.key = keyBytes.toString(CryptoJS.enc.Hex).substring(0, 16)
    formData.iv = ivBytes.toString(CryptoJS.enc.Hex).substring(0, 16)
    
    message.success(t('encrypt.aes.keyIVGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('encrypt.aes.generateFailed', { error: e.message }))
  }
}
</script>

<style scoped>
.aes-encrypt {
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