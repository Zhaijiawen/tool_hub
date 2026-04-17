<template>
  <div class="number-chinese">
    <n-card :title="t('convert.numberChinese.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入区 -->
        <div class="input-section">
          <n-text class="section-label">{{ t('convert.numberChinese.input') }}</n-text>
          <n-input
            v-model:value="input"
            :placeholder="t('convert.numberChinese.placeholder')"
            clearable
            size="large"
            @input="convert"
          />
          <!-- 快捷示例 -->
          <div class="examples-row">
            <n-text depth="3" style="font-size: 12px; margin-right: 8px;">{{ t('convert.numberChinese.examples') }}：</n-text>
            <n-space :size="6">
              <n-button
                v-for="ex in quickExamples"
                :key="ex"
                size="small"
                tertiary
                @click="loadExample(ex)"
              >{{ ex }}</n-button>
            </n-space>
          </div>
        </div>

        <!-- 模式切换 -->
        <div class="mode-section">
          <n-text class="section-label">{{ t('convert.numberChinese.mode') }}</n-text>
          <n-radio-group v-model:value="mode" @update:value="convert">
            <n-space>
              <n-radio value="upper">{{ t('convert.numberChinese.modeUpper') }}</n-radio>
              <n-radio value="lower">{{ t('convert.numberChinese.modeLower') }}</n-radio>
              <n-radio value="financial">{{ t('convert.numberChinese.modeFinancial') }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 结果区 -->
        <div v-if="result && !error" class="result-section">
          <div class="result-header">
            <n-text class="section-label">{{ t('convert.numberChinese.result') }}</n-text>
            <n-button size="small" @click="copyResult">{{ t('common.copy') }}</n-button>
          </div>
          <div class="result-card">
            <n-text class="result-text">{{ result }}</n-text>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="warning" :show-icon="false" style="padding: 8px 12px;">
          {{ error }}
        </n-alert>

        <!-- 空状态 -->
        <div v-if="!input" class="empty-placeholder">
          <n-text depth="3">{{ t('convert.numberChinese.emptyTip') }}</n-text>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="numberChinese" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const result = ref('')
const error = ref('')
const mode = ref('upper')

const quickExamples = ['0', '1', '100', '1234', '10000', '123456789', '100.50', '1234567890.99']

const loadExample = (val) => {
  input.value = val
  convert()
}

// 数字到汉字的映射
const UPPER_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const LOWER_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const UPPER_UNITS = ['', '拾', '佰', '仟']
const LOWER_UNITS = ['', '十', '百', '千']
const SECTION_UNITS = ['', '万', '亿', '万亿']
const FINANCIAL_DECIMALS = ['角', '分']

const convertSection = (num, digits, units) => {
  // 处理四位数以内的节
  let result = ''
  let zero = false
  for (let i = 3; i >= 0; i--) {
    const d = Math.floor(num / Math.pow(10, i)) % 10
    if (d === 0) {
      if (!zero && result) zero = true
    } else {
      if (zero) { result += digits[0]; zero = false }
      result += digits[d] + units[i]
    }
  }
  return result
}

const numberToChineseInternal = (numStr, digits, units) => {
  const parts = numStr.split('.')
  const intStr = parts[0]
  const decStr = parts[1] || ''

  if (intStr.length > 16) return null // 太大

  // 整数部分，按4位一节处理
  const intNum = parseInt(intStr, 10)
  if (intNum === 0 && !decStr) return digits[0]

  const sections = []
  let tmp = intNum
  while (tmp > 0) {
    sections.unshift(tmp % 10000)
    tmp = Math.floor(tmp / 10000)
  }

  let intResult = ''
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i]
    const secStr = convertSection(sec, digits, units)
    const sectionUnit = SECTION_UNITS[sections.length - 1 - i]
    if (sec === 0) {
      // 节为0时只加零（如果下一节非零则加）
      if (intResult && i < sections.length - 1) intResult += digits[0]
    } else {
      // 如果上一节末尾不是零，且当前节首位是零，不需要额外加零（convertSection 已处理）
      // 但若当前节 < 1000，需要在节首补零
      if (intResult && sec < 1000) intResult += digits[0]
      intResult += secStr + sectionUnit
    }
  }

  if (!intResult) intResult = digits[0]

  // 小数部分
  let decResult = ''
  if (decStr) {
    for (let i = 0; i < Math.min(decStr.length, 2); i++) {
      const d = parseInt(decStr[i], 10)
      if (d !== 0) decResult += digits[d]
      // 下面根据模式添加单位
    }
  }

  return { intResult, decStr }
}

const convert = () => {
  error.value = ''
  result.value = ''
  const raw = input.value.trim()
  if (!raw) return

  // 验证输入
  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    error.value = t('convert.numberChinese.invalidInput')
    return
  }

  const isNeg = raw.startsWith('-')
  const numStr = isNeg ? raw.slice(1) : raw
  const parts = numStr.split('.')

  if (parts[0].length > 15) {
    error.value = t('convert.numberChinese.tooLarge')
    return
  }

  const digits = mode.value === 'lower' ? LOWER_DIGITS : UPPER_DIGITS
  const units = mode.value === 'lower' ? LOWER_UNITS : UPPER_UNITS

  const res = numberToChineseInternal(numStr, digits, units)
  if (!res) {
    error.value = t('convert.numberChinese.tooLarge')
    return
  }

  const { intResult, decStr } = res
  let finalResult = ''

  if (mode.value === 'financial') {
    // 财务模式：元、角、分、整
    if (parseInt(parts[0]) === 0 && !decStr) {
      finalResult = UPPER_DIGITS[0] + '元整'
    } else {
      finalResult = intResult + '元'
      if (!decStr || decStr === '00') {
        finalResult += '整'
      } else {
        const jiao = parseInt(decStr[0] || '0', 10)
        const fen = parseInt(decStr[1] || '0', 10)
        if (jiao !== 0) finalResult += UPPER_DIGITS[jiao] + '角'
        if (fen !== 0) finalResult += UPPER_DIGITS[fen] + '分'
        if (jiao === 0 && fen !== 0) finalResult = intResult + '元零' + UPPER_DIGITS[fen] + '分'
      }
    }
  } else if (decStr) {
    finalResult = intResult + '点'
    for (const c of decStr) finalResult += digits[parseInt(c, 10)]
  } else {
    finalResult = intResult
  }

  result.value = (isNeg ? '负' : '') + finalResult
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.number-chinese {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}

.input-section,
.mode-section,
.result-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.examples-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-card {
  padding: 20px 24px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
  text-align: center;
}

.result-text {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.05em;
  word-break: break-all;
  line-height: 1.6;
}

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>

