<template>
  <div class="number-format">
    <n-card :title="t('convert.numberFormat.title')">
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.numberFormat.input') }}</n-text>
        <n-input 
          v-model:value="formData.input" 
          :placeholder="t('convert.numberFormat.inputPlaceholder')"
          type="textarea" 
          :autosize="{ minRows: 3, maxRows: 5 }" 
        />
      </div>

      <!-- 操作选择区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.numberFormat.operation') }}</n-text>
        <n-radio-group v-model:value="formData.operation" name="operation">
          <n-radio value="toScientific">{{ t('convert.numberFormat.toScientific') }}</n-radio>
          <n-radio value="toThousands">{{ t('convert.numberFormat.toThousands') }}</n-radio>
        </n-radio-group>
      </div>

      <!-- 转换按钮 -->
      <div class="button-row">
        <n-button type="primary" @click="convert" :disabled="!formData.input">
          {{ t('convert.numberFormat.convert') }}
        </n-button>
      </div>

      <!-- 输出区域 -->
      <div class="input-section" v-if="formData.output">
        <n-text>{{ t('convert.numberFormat.output') }}</n-text>
        <div class="output-with-copy">
          <n-input 
            v-model:value="formData.output" 
            :placeholder="t('convert.numberFormat.outputPlaceholder')"
            type="textarea" 
            :autosize="{ minRows: 3, maxRows: 5 }" 
            readonly 
          />
          <n-button @click="copyOutput" size="small" type="info">
            {{ t('common.copy') }}
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
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  operation: 'toScientific',
  output: ''
})

const error = ref('')

// 转换为科学计数法
function toScientific(num) {
  return Number(num).toExponential()
}

// 转换为千分位格式
function toThousands(num) {
  return Number(num).toLocaleString()
}

function convert() {
  try {
    if (!formData.input.trim()) {
      error.value = t('convert.numberFormat.inputRequired')
      return
    }

    error.value = ''
    formData.output = ''

    const num = parseFloat(formData.input)
    if (isNaN(num)) {
      throw new Error(t('convert.numberFormat.invalidNumber'))
    }

    switch (formData.operation) {
      case 'toScientific':
        formData.output = toScientific(num)
        break
      case 'toThousands':
        formData.output = toThousands(num)
        break
    }
  } catch (err) {
    error.value = err.message
    message.error(t('common.error'))
  }
}

function copyOutput() {
  if (formData.output) {
    try {
      navigator.clipboard.writeText(formData.output)
      message.success(t('common.copy') + ' ' + t('common.success'))
    } catch (e) {
      message.error(t('common.copy') + ' ' + t('common.error'))
    }
  }
}
</script>

<style scoped>
.number-format {
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

.button-row {
  margin: 12px 0;
}

.output-with-copy {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.output-with-copy .n-input {
  flex: 1;
}

.error-alert {
  margin-top: 16px;
}
</style>