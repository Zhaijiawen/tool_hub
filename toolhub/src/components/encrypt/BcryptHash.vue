<template>
  <div class="bcrypt-hash">
    <n-card :title="t('encrypt.bcrypt.title')">
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.bcrypt.input') }}</n-text>
        <n-input 
          v-model:value="input" 
          type="textarea" 
          :placeholder="t('encrypt.bcrypt.inputPlaceholder')"
          :autosize="{ minRows: 8, maxRows: 15 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.bcrypt.charCount', { count: input.length }) }}</n-text>
        </div>
      </div>

      <!-- 盐轮数选择 -->
      <div class="options-section">
        <n-form :model="formData" label-placement="left" label-width="120px">
          <n-form-item :label="t('encrypt.bcrypt.saltRounds')">
            <n-input-number 
              v-model:value="formData.saltRounds" 
              :min="4" 
              :max="31" 
              :placeholder="t('encrypt.bcrypt.saltRoundsPlaceholder')"
            />
            <n-text depth="3" class="salt-info">
              {{ t('encrypt.bcrypt.saltRoundsInfo') }}
            </n-text>
          </n-form-item>
        </n-form>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="hash" type="primary" :disabled="!input.trim()">
          {{ t('encrypt.bcrypt.hash') }}
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
        <n-alert type="info" :title="t('encrypt.bcrypt.hashInfo')" class="mb-4">
          <template #default>
            <div class="hash-info-grid">
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.algorithm') }}:</strong> 
                <n-tag type="info" size="small">{{ t('encrypt.bcrypt.bcrypt') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.saltRounds') }}:</strong> 
                <n-tag type="info" size="small">{{ formData.saltRounds }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.security') }}:</strong> 
                <n-tag type="success" size="small">{{ t('encrypt.bcrypt.secure') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.workFactor') }}:</strong> 
                <n-tag type="info" size="small">2^{{ formData.saltRounds }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.inputLength') }}:</strong> 
                <n-tag type="info" size="small">{{ input.length }} {{ t('common.characters') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.outputLength') }}:</strong> 
                <n-tag type="info" size="small">{{ output.length }} {{ t('common.characters') }}</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.computeTime') }}:</strong> 
                <n-tag type="info" size="small">{{ computeTime }}ms</n-tag>
              </div>
              <div class="hash-info-item">
                <strong>{{ t('encrypt.bcrypt.computed') }}:</strong> 
                <n-tag type="info" size="small">{{ hashGeneratedTime || t('encrypt.bcrypt.notComputed') }}</n-tag>
              </div>
            </div>
            <!-- 安全性说明 -->
            <div class="security-note">
              <n-text depth="3">
                <strong>{{ t('encrypt.bcrypt.securityNote') }}:</strong> {{ t('encrypt.bcrypt.securityDescription') }}
              </n-text>
            </div>
          </template>
        </n-alert>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <n-text>{{ t('encrypt.bcrypt.output') }}</n-text>
        <n-input 
          v-model:value="output" 
          type="textarea" 
          :placeholder="t('encrypt.bcrypt.outputPlaceholder')"
          :autosize="{ minRows: 8, maxRows: 15 }" 
          readonly 
        />
        <div class="output-info" v-if="output">
          <n-text depth="3">{{ t('encrypt.bcrypt.length') }}：{{ output.length }} {{ t('encrypt.bcrypt.characters') }}</n-text>
        </div>
      </div>

      <!-- 验证区域 -->
      <div class="verify-section">
        <n-text>{{ t('encrypt.bcrypt.verify') }}</n-text>
        <n-input 
          v-model:value="verifyHash" 
          type="textarea" 
          :placeholder="t('encrypt.bcrypt.verifyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
        />
        <div class="button-group">
          <n-button @click="verify" type="info" :disabled="!input.trim() || !verifyHash.trim()" :loading="isVerifying">
            {{ t('encrypt.bcrypt.verify') }}
          </n-button>
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
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import bcrypt from 'bcryptjs'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const output = ref('')
const verifyHash = ref('')
const error = ref('')
const isVerifying = ref(false)
const computeTime = ref(0) // 计算时间
const hashGeneratedTime = ref('') // 哈希生成时间

const formData = reactive({
  saltRounds: 10
})

// 计算哈希
const hash = () => {
  try {
    if (!input.value.trim()) {
      error.value = t('encrypt.bcrypt.inputRequired')
      return
    }

    const startTime = performance.now()
    
    // 生成盐并计算哈希
    const salt = bcrypt.genSaltSync(formData.saltRounds)
    const hashedPassword = bcrypt.hashSync(input.value, salt)
    
    output.value = hashedPassword
    
    // 记录计算时间和生成时间
    const endTime = performance.now()
    computeTime.value = Math.round(endTime - startTime)
    hashGeneratedTime.value = new Date().toLocaleString()
    
    error.value = ''
    message.success(t('encrypt.bcrypt.hashSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 验证哈希
const verify = async () => {
  try {
    if (!input.value.trim() || !verifyHash.value.trim()) {
      error.value = t('encrypt.bcrypt.bothInputsRequired')
      return
    }

    isVerifying.value = true
    error.value = ''

    // 验证密码是否匹配哈希值
    const isValid = bcrypt.compareSync(input.value, verifyHash.value)
    
    if (isValid) {
      message.success(t('encrypt.bcrypt.verificationSuccess'))
    } else {
      message.error(t('encrypt.bcrypt.verificationFailed'))
    }
    
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isVerifying.value = false
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('encrypt.bcrypt.copySuccess'))
  } catch (e) {
    message.error(t('encrypt.bcrypt.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  input.value = ''
  output.value = ''
  verifyHash.value = ''
  error.value = ''
  computeTime.value = 0
  hashGeneratedTime.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.bcrypt-hash {
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

.salt-info {
  display: block;
  margin-top: 4px;
  font-size: 12px;
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

.verify-section {
  margin: 20px 0;
}

.verify-section .n-text {
  display: block;
  margin-bottom: 8px;
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