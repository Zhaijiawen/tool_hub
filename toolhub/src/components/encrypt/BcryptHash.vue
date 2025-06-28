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
        <n-form :model="formData" label-placement="left" label-width="auto">
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
        <n-button @click="verify" type="info" :disabled="!input.trim() || !output">
          {{ t('encrypt.bcrypt.verify') }}
        </n-button>
        <n-button @click="copyToClipboard" :disabled="!output">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
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

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import bcrypt from 'bcryptjs'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const output = ref('')
const error = ref('')

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

    // 生成盐并计算哈希
    const salt = bcrypt.genSaltSync(formData.saltRounds)
    const hashedPassword = bcrypt.hashSync(input.value, salt)
    
    output.value = hashedPassword
    error.value = ''
    message.success(t('encrypt.bcrypt.hashSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 验证哈希
const verify = () => {
  try {
    if (!input.value.trim() || !output.value.trim()) {
      error.value = t('encrypt.bcrypt.bothInputsRequired')
      return
    }

    // 验证密码是否匹配哈希值
    const isValid = bcrypt.compareSync(input.value, output.value)
    
    if (isValid) {
      message.success(t('encrypt.bcrypt.verificationSuccess'))
    } else {
      message.error(t('encrypt.bcrypt.verificationFailed'))
    }
    
    error.value = ''
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
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
  error.value = ''
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

.error-alert {
  margin-top: 16px;
}
</style>