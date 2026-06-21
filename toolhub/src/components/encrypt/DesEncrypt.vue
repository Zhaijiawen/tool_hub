<template>
  <div class="des-encrypt">
    <!-- 工具简介 -->
    <ToolIntro toolKey="des" />

    <n-card :title="t('encrypt.des.title')">
      <n-space vertical>
        <!-- 统一的输入/输出窗口 -->
        <div class="input-output-section">
          <n-text>{{ t('encrypt.des.inputLabel') }}</n-text>
          <n-input 
            v-model:value="input" 
            type="textarea" 
            :placeholder="t('encrypt.des.inputPlaceholder')"
            :autosize="{ minRows: 8, maxRows: 15 }" 
          />
          <div class="input-info">
            <n-text depth="3">{{ t('encrypt.des.charCount', { count: input.length }) }}</n-text>
          </div>
        </div>

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
          <n-button @click="clearAll">
            {{ t('common.clear') }}
          </n-button>
        </n-space>

        <!-- Key Information 区域 -->
        <div v-if="formData.key || formData.iv" class="key-info-overview">
          <n-alert type="info" :title="t('encrypt.des.keyInfo')" class="mb-4">
            <template #default>
              <div class="key-info-grid">
                <div class="key-info-item">
                  <strong>{{ t('encrypt.des.algorithm') }}:</strong> 
                  <n-tag type="info" size="small">{{ formData.type }}</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.des.keyLength') }}:</strong> 
                  <n-tag :type="formData.key.length === getKeyLength() ? 'success' : 'error'" size="small">
                    {{ formData.key.length }} {{ t('common.characters') }} ({{ formData.key.length * 8 }} bits)
                  </n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.des.mode') }}:</strong> 
                  <n-tag type="info" size="small">{{ formData.mode }}</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.des.padding') }}:</strong> 
                  <n-tag type="info" size="small">{{ formData.padding }}</n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.des.ivStatus') }}:</strong> 
                  <n-tag v-if="formData.mode === 'ECB'" type="warning" size="small">
                    {{ t('encrypt.des.notRequired') }}
                  </n-tag>
                  <n-tag v-else-if="formData.iv.length === 8" type="success" size="small">
                    {{ t('encrypt.des.valid') }} ({{ formData.iv.length }} {{ t('common.characters') }})
                  </n-tag>
                  <n-tag v-else type="error" size="small">
                    {{ t('encrypt.des.invalid') }} ({{ formData.iv.length }} {{ t('common.characters') }})
                  </n-tag>
                </div>
                <div class="key-info-item">
                  <strong>{{ t('encrypt.des.generated') }}:</strong> 
                  <n-tag type="info" size="small">{{ keyGeneratedTime || t('encrypt.des.notGenerated') }}</n-tag>
                </div>
              </div>
            </template>
          </n-alert>
        </div>

        <!-- 调试信息 -->
        <n-alert v-if="debugInfo" type="info" :title="t('encrypt.des.debugTitle')" class="debug-alert">
          <p>{{ t('encrypt.des.type') }}: {{ formData.type }}</p>
          <p>{{ t('encrypt.des.mode') }}: {{ formData.mode }}</p>
          <p>{{ t('encrypt.des.padding') }}: {{ formData.padding }}</p>
          <p>{{ t('encrypt.des.keyLength') }}: {{ formData.key.length }} {{ t('common.characters') }}
            <span v-if="getKeyLength() === formData.key.length" style="color: green;">✓ {{ t('encrypt.des.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('common.error') }}（{{ t('encrypt.des.keyLengthErrorShort') }}）</span>
          </p>
          <p>{{ t('encrypt.des.ivLength') }}: {{ formData.iv.length }} {{ t('common.characters') }}
            <span v-if="formData.mode === 'ECB'" style="color: #999;">（{{ t('encrypt.des.ivNotRequired') }}）</span>
            <span v-else-if="formData.iv.length === 8" style="color: green;">✓ {{ t('encrypt.des.correct') }}</span>
            <span v-else style="color: red;">✗ {{ t('common.error') }}（{{ t('encrypt.des.ivLengthErrorShort') }}）</span>
          </p>
          <p>{{ t('encrypt.des.inputLength') }}: {{ input.length }} {{ t('common.characters') }}
            <span v-if="formData.padding === 'NoPadding' && input.length % 8 === 0" style="color: green;">✓ {{ t('encrypt.des.correct') }}（{{ t('encrypt.des.noPaddingCorrect') }}）</span>
            <span v-else-if="formData.padding === 'NoPadding' && input.length % 8 !== 0" style="color: red;">✗ {{ t('common.error') }}（{{ t('encrypt.des.noPaddingError') }}）</span>
            <span v-else-if="formData.padding === 'Pkcs7'" style="color: #666;">（{{ t('encrypt.des.pkcs7Support') }}）</span>
            <span v-else style="color: #999;">（{{ t('encrypt.des.decryptMode') }}）</span>
          </p>
        </n-alert>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="des" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CryptoJS from 'crypto-js'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const debugInfo = ref(true)
const keyGeneratedTime = ref('') // 记录密钥生成时间

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

    input.value = encrypted.toString()
    message.success(t('encrypt.des.encryptSuccess'))
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    error.value = ''

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

    input.value = decrypted.toString(CryptoJS.enc.Utf8)
    message.success(t('encrypt.des.decryptSuccess'))
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

const generateKeyIV = () => {
  try {
    error.value = ''
    const keyLength = getKeyLength()
    const key = Array.from(crypto.getRandomValues(new Uint8Array(keyLength))).map(b => String.fromCharCode(97 + b % 26)).join('')
    const iv = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => String.fromCharCode(97 + b % 26)).join('')
    formData.key = key
    formData.iv = iv
    
    // 记录生成时间
    keyGeneratedTime.value = new Date().toLocaleString()
    
    message.success(t('encrypt.des.keyIVGenerated'))
  } catch (e) {
    error.value = e.message
    message.error(t('encrypt.des.generateFailed', { error: e.message }))
  }
}

const clearAll = () => {
  input.value = ''
  formData.key = ''
  formData.iv = ''
  keyGeneratedTime.value = ''
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.des-encrypt {
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

.debug-alert {
  margin-top: 16px;
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
