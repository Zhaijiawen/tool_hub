<template>
  <div class="number-convert">
    <n-card :title="t('convert.number.title')">
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.number.input') }}</n-text>
        <n-input 
          v-model:value="formData.input" 
          :placeholder="t('convert.number.inputPlaceholder')" 
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }" 
        />
      </div>

      <!-- 操作选择区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.number.operation') }}</n-text>
        <n-radio-group v-model:value="formData.operation" name="operation">
          <n-radio value="toChinese">{{ t('convert.number.toChinese') }}</n-radio>
          <n-radio value="toRoman">{{ t('convert.number.toRoman') }}</n-radio>
          <n-radio value="toNumber">{{ t('convert.number.toNumber') }}</n-radio>
        </n-radio-group>
      </div>

      <!-- 提示信息 -->
      <div class="info-section">
        <n-alert type="info" :title="t('convert.number.infoTitle')" class="info-alert">
          {{ t('convert.number.infoContent') }}
        </n-alert>
      </div>

      <!-- 转换按钮 -->
      <div class="button-row">
        <n-button type="primary" @click="convert" :disabled="!formData.input">
          {{ t('convert.number.convert') }}
        </n-button>
      </div>

      <!-- 输出区域 -->
      <div class="input-section" v-if="formData.output">
        <n-text>{{ t('convert.number.output') }}</n-text>
        <div class="output-with-copy">
          <n-input 
            v-model:value="formData.output" 
            :placeholder="t('convert.number.outputPlaceholder')" 
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
  operation: 'toChinese',
  output: ''
})

const error = ref('')

// 数字转中文
function numberToChinese(num) {
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿']
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

  if (num === 0) return '零'

  let result = ''
  let unitIndex = 0

  while (num > 0) {
    const digit = num % 10
    if (digit !== 0) {
      result = digits[digit] + units[unitIndex] + result
    } else if (result && result[0] !== '零') {
      result = '零' + result
    }
    num = Math.floor(num / 10)
    unitIndex++
  }

  return result
}

// 数字转罗马数字
function numberToRoman(num) {
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ]

  let result = ''
  for (const { value, symbol } of romanNumerals) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}

// 中文转数字
function chineseToNumber(str) {
  const digits = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
    '五': 5, '六': 6, '七': 7, '八': 8, '九': 9
  }
  const units = {
    '十': 10, '百': 100, '千': 1000, '万': 10000, '亿': 100000000
  }

  let result = 0
  let current = 0

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    if (digits[char] !== undefined) {
      // 数字
      current = digits[char]
    } else if (units[char] !== undefined) {
      // 单位
      const unitValue = units[char]
      
      if (current === 0) {
        // 如果前面没有数字，比如"十"表示10
        current = 1
      }
      
      if (unitValue >= 10000) {
        // 万、亿等大单位
        result = (result + current) * unitValue
        current = 0
      } else {
        // 十、百、千等小单位
        current *= unitValue
        result += current
        current = 0
      }
    }
  }

  // 处理最后的数字
  result += current

  return result
}

// 罗马数字转数字
function romanToNumber(str) {
  const romanNumerals = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
  }

  let result = 0
  for (let i = 0; i < str.length; i++) {
    const current = romanNumerals[str[i]]
    const next = romanNumerals[str[i + 1]]

    if (next && current < next) {
      result -= current
    } else {
      result += current
    }
  }

  return result
}

function convert() {
  try {
    if (!formData.input.trim()) {
      error.value = t('convert.number.inputRequired')
      return
    }

    error.value = ''
    formData.output = ''

    switch (formData.operation) {
      case 'toChinese':
        const num = parseInt(formData.input)
        if (isNaN(num)) {
          throw new Error(t('convert.number.invalidNumber'))
        }
        if (num < 0 || num > 999999999) {
          throw new Error(t('convert.number.outOfRange'))
        }
        formData.output = numberToChinese(num)
        break

      case 'toRoman':
        const num2 = parseInt(formData.input)
        if (isNaN(num2)) {
          throw new Error(t('convert.number.invalidNumber'))
        }
        if (num2 < 1 || num2 > 3999) {
          throw new Error(t('convert.number.romanOutOfRange'))
        }
        formData.output = numberToRoman(num2)
        break

      case 'toNumber':
        if (/^[零一二三四五六七八九十百千万亿]+$/.test(formData.input)) {
          formData.output = chineseToNumber(formData.input).toString()
        } else if (/^[IVXLCDM]+$/i.test(formData.input)) {
          formData.output = romanToNumber(formData.input.toUpperCase()).toString()
        } else {
          throw new Error(t('convert.number.invalidInput'))
        }
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
.number-convert {
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

.info-section {
  margin-bottom: 20px;
}

.info-alert {
  margin-top: 8px;
}
</style>