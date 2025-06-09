<template>
  <n-card :title="$t('other.calculator.title')">
    <div class="calculator">
      <div class="display">
        <div class="expression">{{ expression }}</div>
        <div class="result">{{ result }}</div>
      </div>

      <div class="keypad">
        <div class="row">
          <n-button @click="clear">{{ $t('other.calculator.clear') }}</n-button>
          <n-button @click="backspace">{{ $t('other.calculator.backspace') }}</n-button>
          <n-button @click="appendOperator('%')">{{ $t('other.calculator.percent') }}</n-button>
          <n-button @click="appendOperator('/')">{{ $t('other.calculator.divide') }}</n-button>
        </div>

        <div class="row">
          <n-button @click="appendNumber('7')">{{ $t('other.calculator.num7') }}</n-button>
          <n-button @click="appendNumber('8')">{{ $t('other.calculator.num8') }}</n-button>
          <n-button @click="appendNumber('9')">{{ $t('other.calculator.num9') }}</n-button>
          <n-button @click="appendOperator('*')">{{ $t('other.calculator.multiply') }}</n-button>
        </div>

        <div class="row">
          <n-button @click="appendNumber('4')">{{ $t('other.calculator.num4') }}</n-button>
          <n-button @click="appendNumber('5')">{{ $t('other.calculator.num5') }}</n-button>
          <n-button @click="appendNumber('6')">{{ $t('other.calculator.num6') }}</n-button>
          <n-button @click="appendOperator('-')">{{ $t('other.calculator.subtract') }}</n-button>
        </div>

        <div class="row">
          <n-button @click="appendNumber('1')">{{ $t('other.calculator.num1') }}</n-button>
          <n-button @click="appendNumber('2')">{{ $t('other.calculator.num2') }}</n-button>
          <n-button @click="appendNumber('3')">{{ $t('other.calculator.num3') }}</n-button>
          <n-button @click="appendOperator('+')">{{ $t('other.calculator.add') }}</n-button>
        </div>

        <div class="row">
          <n-button @click="appendNumber('0')">{{ $t('other.calculator.num0') }}</n-button>
          <n-button @click="appendDecimal">{{ $t('other.calculator.decimal') }}</n-button>
          <n-button @click="calculate" type="primary" class="equals">{{ $t('other.calculator.equals') }}</n-button>
        </div>
      </div>

      <div class="history">
        <n-divider>{{ $t('other.calculator.history') }}</n-divider>
        <n-list>
          <n-list-item v-for="(item, index) in history" :key="index">
            <div class="history-item">
              <span class="expression">{{ item.expression }}</span>
              <span class="result">= {{ item.result }}</span>
            </div>
          </n-list-item>
        </n-list>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const expression = ref('')
const result = ref('0')
const history = ref([])

// 添加数字
function appendNumber(num) {
  expression.value += num
  calculate()
}

// 添加小数点
function appendDecimal() {
  if (!expression.value || /[+\-*/]$/.test(expression.value)) {
    expression.value += '0.'
  } else if (!expression.value.includes('.')) {
    expression.value += '.'
  }
  calculate()
}

// 添加运算符
function appendOperator(op) {
  if (!expression.value) return
  
  const lastChar = expression.value.slice(-1)
  if (/[+\-*/%]/.test(lastChar)) {
    expression.value = expression.value.slice(0, -1) + op
  } else {
    expression.value += op
  }
  calculate()
}

// 清除
function clear() {
  expression.value = ''
  result.value = '0'
}

// 退格
function backspace() {
  expression.value = expression.value.slice(0, -1)
  calculate()
}

// 计算
function calculate() {
  try {
    if (!expression.value) {
      result.value = '0'
      return
    }

    // 使用Function构造器来安全地计算表达式
    const calculateResult = new Function(`return ${expression.value}`)()
    
    // 处理结果
    if (isNaN(calculateResult) || !isFinite(calculateResult)) {
      throw new Error(t('other.calculator.invalidExpression'))
    }

    // 格式化结果
    result.value = formatNumber(calculateResult)
  } catch (err) {
    result.value = t('other.calculator.error')
  }
}

// 计算并添加到历史记录
function calculateAndAddToHistory() {
  try {
    if (!expression.value) return

    const calculateResult = new Function(`return ${expression.value}`)()
    
    if (isNaN(calculateResult) || !isFinite(calculateResult)) {
      throw new Error(t('other.calculator.invalidExpression'))
    }

    // 添加到历史记录
    history.value.unshift({
      expression: expression.value,
      result: formatNumber(calculateResult)
    })

    // 限制历史记录数量
    if (history.value.length > 10) {
      history.value.pop()
    }

    // 清空表达式
    expression.value = ''
  } catch (err) {
    message.error(err.message)
  }
}

// 格式化数字
function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString()
  }
  return num.toFixed(8).replace(/\.?0+$/, '')
}
</script>

<style scoped>
.calculator {
  max-width: 400px;
  margin: 0 auto;
}

.display {
  background-color: var(--n-card-color);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.expression {
  font-size: 16px;
  color: var(--n-text-color-3);
  min-height: 24px;
  word-break: break-all;
}

.result {
  font-size: 24px;
  font-weight: bold;
  text-align: right;
  min-height: 32px;
}

.keypad {
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.equals {
  grid-column: span 2;
}

.history {
  margin-top: 24px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item .expression {
  color: var(--n-text-color-2);
}

.history-item .result {
  font-size: 16px;
  font-weight: normal;
}
</style> 