<template>
  <div class="calculator">
    <n-card :title="t('tools.calculator.title')">
      <n-form>
        <n-form-item>
          <n-input
            v-model:value="expression"
            type="text"
            :placeholder="t('tools.calculator.expression')"
            readonly
          />
        </n-form-item>

        <div class="calculator-buttons">
          <n-grid :cols="4" :x-gap="8" :y-gap="8">
            <!-- 第一行 -->
            <n-grid-item>
              <n-button @click="clear" type="error" block>
                {{ t('tools.calculator.clear') }}
              </n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendOperator('/')" block>
                {{ t('tools.calculator.divide') }}
              </n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendOperator('*')" block>
                {{ t('tools.calculator.multiply') }}
              </n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="backspace" block>
                {{ t('tools.calculator.backspace') }}
              </n-button>
            </n-grid-item>

            <!-- 第二行 -->
            <n-grid-item>
              <n-button @click="appendNumber('7')" block>7</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendNumber('8')" block>8</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendNumber('9')" block>9</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendOperator('-')" block>
                {{ t('tools.calculator.subtract') }}
              </n-button>
            </n-grid-item>

            <!-- 第三行 -->
            <n-grid-item>
              <n-button @click="appendNumber('4')" block>4</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendNumber('5')" block>5</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendNumber('6')" block>6</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendOperator('+')" block>
                {{ t('tools.calculator.add') }}
              </n-button>
            </n-grid-item>

            <!-- 第四行 -->
            <n-grid-item>
              <n-button @click="appendNumber('1')" block>1</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendNumber('2')" block>2</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendNumber('3')" block>3</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="calculate" type="primary" block>
                {{ t('tools.calculator.equals') }}
              </n-button>
            </n-grid-item>

            <!-- 第五行 -->
            <n-grid-item>
              <n-button @click="appendNumber('0')" block>0</n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendDecimal" block>
                {{ t('tools.calculator.decimal') }}
              </n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendOperator('%')" block>
                {{ t('tools.calculator.percent') }}
              </n-button>
            </n-grid-item>
            <n-grid-item>
              <n-button @click="appendOperator('^')" block>
                {{ t('tools.calculator.power') }}
              </n-button>
            </n-grid-item>
          </n-grid>
        </div>

        <n-form-item>
          <n-space>
            <n-button @click="calculate" type="primary">
              {{ t('tools.calculator.calculate') }}
            </n-button>
            <n-button @click="clear">
              {{ t('common.clear') }}
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();

const expression = ref('');

function appendNumber(num: string) {
  expression.value += num;
}

function appendOperator(operator: string) {
  if (expression.value.length > 0) {
    const lastChar = expression.value[expression.value.length - 1];
    if ('+-*/%^'.includes(lastChar)) {
      expression.value = expression.value.slice(0, -1) + operator;
    } else {
      expression.value += operator;
    }
  }
}

function appendDecimal() {
  if (expression.value.length === 0) {
    expression.value = '0.';
    return;
  }

  const lastNumber = expression.value.split(/[\+\-\*\/\%\^]/).pop() || '';
  if (!lastNumber.includes('.')) {
    expression.value += '.';
  }
}

function backspace() {
  expression.value = expression.value.slice(0, -1);
}

function clear() {
  expression.value = '';
}

function calculate() {
  try {
    // 替换 ^ 为 ** 用于计算幂
    const evalExpression = expression.value.replace(/\^/g, '**');
    const result = eval(evalExpression);
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error('Invalid calculation');
    }
    
    expression.value = result.toString();
  } catch (error) {
    message.error(t('tools.calculator.invalidExpression'));
  }
}
</script>

<style scoped>
.calculator {
  max-width: 400px;
  margin: 0 auto;
}

.calculator-buttons {
  margin: 16px 0;
}

:deep(.n-button) {
  height: 48px;
  font-size: 18px;
}
</style> 