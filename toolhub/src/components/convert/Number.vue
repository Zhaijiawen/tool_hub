<template>
  <n-card :title="$t('convert.number.title')">
    <n-form>
      <n-form-item :label="$t('convert.number.input')">
        <n-input
          v-model:value="formData.input"
          :placeholder="$t('convert.number.inputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>

      <n-form-item :label="$t('convert.number.operation')">
        <n-radio-group v-model:value="formData.operation">
          <n-space>
            <n-radio value="toChinese">{{ $t('convert.number.toChinese') }}</n-radio>
            <n-radio value="toRoman">{{ $t('convert.number.toRoman') }}</n-radio>
            <n-radio value="toNumber">{{ $t('convert.number.toNumber') }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item :label="$t('convert.number.output')">
        <n-input
          v-model:value="formData.output"
          :placeholder="$t('convert.number.outputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          readonly
        />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="convert">
          {{ $t('convert.number.convert') }}
        </n-button>
        <n-button @click="copyOutput">
          {{ $t('convert.number.copy') }}
        </n-button>
      </n-space>
    </n-form>

    <n-alert
      v-if="error"
      type="error"
      :title="error"
      style="margin-top: 16px"
    />
  </n-card>
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
  let temp = 0
  let unit = 1
  
  for (let i = str.length - 1; i >= 0; i--) {
    const char = str[i]
    if (digits[char] !== undefined) {
      temp = digits[char]
    } else if (units[char] !== undefined) {
      if (temp === 0) temp = 1
      result += temp * units[char]
      temp = 0
    }
  }
  
  if (temp !== 0) {
    result += temp
  }
  
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
  error.value = ''
  
  try {
    switch (formData.operation) {
      case 'toChinese':
        const num = parseInt(formData.input)
        if (isNaN(num)) {
          throw new Error(t('convert.number.invalidNumber'))
        }
        formData.output = numberToChinese(num)
        break
        
      case 'toRoman':
        const num2 = parseInt(formData.input)
        if (isNaN(num2)) {
          throw new Error(t('convert.number.invalidNumber'))
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
  }
}

function copyOutput() {
  if (formData.output) {
    navigator.clipboard.writeText(formData.output)
    message.success(t('convert.number.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}
</style> 