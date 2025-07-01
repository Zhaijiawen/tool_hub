<template>
  <n-card :title="$t('other.calculator.title')">
    <div class="calculator">
      <!-- 模式切换 -->
      <n-tabs v-model:value="currentMode" type="line" animated class="mode-tabs">
        <n-tab-pane name="basic" :tab="$t('other.calculator.basicMode')">
          <!-- 基础计算器 -->
          <div class="calculator-content">
            <div class="display">
              <div class="expression">{{ displayExpression }}</div>
              <div class="result">{{ displayResult }}</div>
            </div>

            <div class="keypad basic-keypad">
              <!-- 第一行 -->
              <div class="row">
                <n-button @click="clear" type="error" class="action-btn">{{ $t('other.calculator.clear') }}</n-button>
                <n-button @click="clearEntry" class="action-btn">CE</n-button>
                <n-button @click="backspace" class="action-btn">←</n-button>
                <n-button @click="appendOperator('/')" class="operator-btn">÷</n-button>
              </div>

              <!-- 第二行 -->
              <div class="row">
                <n-button @click="appendNumber('7')" class="number-btn">7</n-button>
                <n-button @click="appendNumber('8')" class="number-btn">8</n-button>
                <n-button @click="appendNumber('9')" class="number-btn">9</n-button>
                <n-button @click="appendOperator('*')" class="operator-btn">×</n-button>
              </div>

              <!-- 第三行 -->
              <div class="row">
                <n-button @click="appendNumber('4')" class="number-btn">4</n-button>
                <n-button @click="appendNumber('5')" class="number-btn">5</n-button>
                <n-button @click="appendNumber('6')" class="number-btn">6</n-button>
                <n-button @click="appendOperator('-')" class="operator-btn">-</n-button>
              </div>

              <!-- 第四行 -->
              <div class="row">
                <n-button @click="appendNumber('1')" class="number-btn">1</n-button>
                <n-button @click="appendNumber('2')" class="number-btn">2</n-button>
                <n-button @click="appendNumber('3')" class="number-btn">3</n-button>
                <n-button @click="appendOperator('+')" class="operator-btn">+</n-button>
              </div>

              <!-- 第五行 -->
              <div class="row">
                <n-button @click="appendNumber('0')" class="number-btn zero-btn">0</n-button>
                <n-button @click="appendDecimal" class="number-btn">.</n-button>
                <n-button @click="calculate" type="primary" class="equals-btn">=</n-button>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="scientific" :tab="$t('other.calculator.scientificMode')">
          <!-- 科学计算器 -->
          <div class="calculator-content">
            <div class="display">
              <div class="expression">{{ displayExpression }}</div>
              <div class="result">{{ displayResult }}</div>
            </div>

            <div class="keypad scientific-keypad">
              <!-- 第1行：二级函数 -->
              <div class="row">
                <n-button @click="appendFunction('sin')" class="function-btn">sin</n-button>
                <n-button @click="appendFunction('cos')" class="function-btn">cos</n-button>
                <n-button @click="appendFunction('tan')" class="function-btn">tan</n-button>
                <n-button @click="appendParenthesis('(')" class="function-btn">(</n-button>
                <n-button @click="appendParenthesis(')')" class="function-btn">)</n-button>
              </div>

              <!-- 第2行：高级函数 -->
              <div class="row">
                <n-button @click="appendFunction('log')" class="function-btn">log</n-button>
                <n-button @click="appendFunction('ln')" class="function-btn">ln</n-button>
                <n-button @click="appendFunction('sqrt')" class="function-btn">√</n-button>
                <n-button @click="appendOperator('^')" class="function-btn">x^y</n-button>
                <n-button @click="appendOperator('!')" class="function-btn">n!</n-button>
              </div>

              <!-- 第3行：常量和清除 -->
              <div class="row">
                <n-button @click="appendConstant('pi')" class="function-btn">π</n-button>
                <n-button @click="appendConstant('e')" class="function-btn">e</n-button>
                <n-button @click="clear" type="error" class="action-btn">{{ $t('other.calculator.clear') }}</n-button>
                <n-button @click="clearEntry" class="action-btn">CE</n-button>
                <n-button @click="backspace" class="action-btn">←</n-button>
              </div>

              <!-- 第4行：数字区域开始 -->
              <div class="row number-area">
                <n-button @click="appendNumber('7')" class="number-btn">7</n-button>
                <n-button @click="appendNumber('8')" class="number-btn">8</n-button>
                <n-button @click="appendNumber('9')" class="number-btn">9</n-button>
                <n-button @click="appendOperator('/')" class="operator-btn">÷</n-button>
              </div>

              <div class="row number-area">
                <n-button @click="appendNumber('4')" class="number-btn">4</n-button>
                <n-button @click="appendNumber('5')" class="number-btn">5</n-button>
                <n-button @click="appendNumber('6')" class="number-btn">6</n-button>
                <n-button @click="appendOperator('*')" class="operator-btn">×</n-button>
              </div>

              <div class="row number-area">
                <n-button @click="appendNumber('1')" class="number-btn">1</n-button>
                <n-button @click="appendNumber('2')" class="number-btn">2</n-button>
                <n-button @click="appendNumber('3')" class="number-btn">3</n-button>
                <n-button @click="appendOperator('-')" class="operator-btn">-</n-button>
              </div>

              <div class="row number-area">
                <n-button @click="appendNumber('0')" class="number-btn zero-btn">0</n-button>
                <n-button @click="appendDecimal" class="number-btn">.</n-button>
                <n-button @click="appendOperator('+')" class="operator-btn">+</n-button>
              </div>

              <!-- 等号单独一行，跨越整个宽度 -->
              <div class="row equals-row">
                <n-button @click="calculate" type="primary" class="equals-btn-full">=</n-button>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="expression" :tab="$t('other.calculator.expressionMode')">
          <!-- 表达式计算器 -->
          <div class="expression-calculator">
            <n-input 
              v-model:value="expressionInput" 
              :placeholder="$t('other.calculator.expressionPlaceholder')"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              @keyup.enter="calculateExpression"
              class="expression-input"
            />
            
            <n-space class="expression-actions">
              <n-button @click="calculateExpression" type="primary">
                {{ $t('other.calculator.calculate') }}
              </n-button>
              <n-button @click="clearExpression">
                {{ $t('other.calculator.clear') }}
              </n-button>
              <n-button @click="copyResult" :disabled="!expressionResult">
                {{ $t('common.copy') }}
              </n-button>
            </n-space>

            <div v-if="expressionResult" class="expression-result">
              <n-result status="success" :title="$t('other.calculator.result')">
                <template #footer>
                  <n-text copyable class="result-text">{{ expressionResult }}</n-text>
                </template>
              </n-result>
            </div>

            <div v-if="expressionError" class="expression-error">
              <n-alert type="error" :title="$t('common.error')">
                {{ expressionError }}
              </n-alert>
            </div>

            <!-- 示例和帮助 -->
            <n-collapse class="help-section">
              <!-- 基础示例 -->
              <n-collapse-item :title="$t('other.calculator.examples.basic')" name="basic-examples">
                <div class="examples">
                  <n-space vertical>
                    <div v-for="example in basicExamples" :key="example">
                      <n-text code @click="loadExample(example)" style="cursor: pointer;">{{ example }}</n-text>
                    </div>
                  </n-space>
                </div>
              </n-collapse-item>

              <!-- 科学计算示例 -->
              <n-collapse-item :title="$t('other.calculator.examples.scientific')" name="scientific-examples">
                <div class="examples">
                  <n-space vertical>
                    <div v-for="example in scientificExamples" :key="example">
                      <n-text code @click="loadExample(example)" style="cursor: pointer;">{{ example }}</n-text>
                    </div>
                  </n-space>
                </div>
              </n-collapse-item>

              <!-- 表达式计算示例 -->
              <n-collapse-item :title="$t('other.calculator.examples.expression')" name="expression-examples">
                <div class="examples">
                  <n-space vertical>
                    <div v-for="example in expressionExamples" :key="example">
                      <n-text code @click="loadExample(example)" style="cursor: pointer;">{{ example }}</n-text>
                    </div>
                  </n-space>
                </div>
              </n-collapse-item>
              
              <!-- 详细帮助文档 -->
              <n-collapse-item :title="$t('other.calculator.help.title')" name="help">
                <div class="help-content">
                  <n-tabs type="line" placement="left">
                    <!-- 基础运算符 -->
                    <n-tab-pane name="basic" :tab="$t('other.calculator.help.basic.title')">
                      <n-space vertical>
                        <div v-for="op in helpData.operators" :key="op">
                          <n-text>{{ op }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 常量 -->
                    <n-tab-pane name="constants" :tab="$t('other.calculator.help.constants.title')">
                      <n-space vertical>
                        <div v-for="constant in helpData.constants" :key="constant">
                          <n-text>{{ constant }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 基础函数 -->
                    <n-tab-pane name="basic-functions" :tab="$t('other.calculator.help.functions.basic.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.basicFunctions" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 三角函数 -->
                    <n-tab-pane name="trigonometric" :tab="$t('other.calculator.help.functions.trigonometric.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.trigonometric" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 双曲函数 -->
                    <n-tab-pane name="hyperbolic" :tab="$t('other.calculator.help.functions.hyperbolic.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.hyperbolic" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 对数和指数函数 -->
                    <n-tab-pane name="logarithmic" :tab="$t('other.calculator.help.functions.logarithmic.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.logarithmic" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 复数函数 -->
                    <n-tab-pane name="complex" :tab="$t('other.calculator.help.functions.complex.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.complex" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 矩阵函数 -->
                    <n-tab-pane name="matrix" :tab="$t('other.calculator.help.functions.matrix.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.matrix" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 统计函数 -->
                    <n-tab-pane name="statistical" :tab="$t('other.calculator.help.functions.statistical.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.statistical" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 概率和组合数学 -->
                    <n-tab-pane name="probability" :tab="$t('other.calculator.help.functions.probability.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.probability" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 位运算 -->
                    <n-tab-pane name="bitwise" :tab="$t('other.calculator.help.functions.bitwise.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.bitwise" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 逻辑函数 -->
                    <n-tab-pane name="logical" :tab="$t('other.calculator.help.functions.logical.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.logical" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 比较函数 -->
                    <n-tab-pane name="comparison" :tab="$t('other.calculator.help.functions.comparison.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.comparison" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 字符串和类型转换 -->
                    <n-tab-pane name="string" :tab="$t('other.calculator.help.functions.string.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.stringUtils" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 实用函数 -->
                    <n-tab-pane name="utils" :tab="$t('other.calculator.help.functions.utils.title')">
                      <n-space vertical>
                        <div v-for="func in helpData.utils" :key="func">
                          <n-text>{{ func }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 变量和函数定义 -->
                    <n-tab-pane name="variables" :tab="$t('other.calculator.help.variables.title')">
                      <n-space vertical>
                        <n-text>{{ $t('other.calculator.help.variables.description') }}</n-text>
                        <div v-for="example in helpData.variableExamples" :key="example">
                          <n-text code @click="loadExample(example)" style="cursor: pointer;">{{ example }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 单位转换 -->
                    <n-tab-pane name="units" :tab="$t('other.calculator.help.units.title')">
                      <n-space vertical>
                        <n-text>{{ $t('other.calculator.help.units.description') }}</n-text>
                        <div v-for="example in helpData.unitExamples" :key="example">
                          <n-text code @click="loadExample(example)" style="cursor: pointer;">{{ example }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>

                    <!-- 表达式示例 -->
                    <n-tab-pane name="expressions" :tab="$t('other.calculator.help.expressions.title')">
                      <n-space vertical>
                        <n-text>{{ $t('other.calculator.help.expressions.description') }}</n-text>
                        <div v-for="example in helpData.expressionHelpExamples" :key="example">
                          <n-text code @click="loadExample(example)" style="cursor: pointer;">{{ example }}</n-text>
                        </div>
                      </n-space>
                    </n-tab-pane>
                  </n-tabs>
                </div>
              </n-collapse-item>
            </n-collapse>
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- 历史记录 -->
      <div v-if="history.length > 0" class="history">
        <n-divider>{{ $t('other.calculator.history') }}</n-divider>
        <div class="history-controls">
          <n-button @click="clearHistory" size="small" type="error">
            {{ $t('other.calculator.clearHistory') }}
          </n-button>
        </div>
        <n-list>
          <n-list-item v-for="(item, index) in history" :key="index" class="history-item">
            <div class="history-content">
              <span class="expression" @click="loadFromHistory(item.expression)">{{ item.expression }}</span>
              <span class="result">= {{ item.result }}</span>
            </div>
          </n-list-item>
        </n-list>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { evaluate, format } from 'mathjs'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const currentMode = ref('basic')
const expression = ref('')
const result = ref('0')
const history = ref([])
const isError = ref(false)

// 表达式模式
const expressionInput = ref('')
const expressionResult = ref('')
const expressionError = ref('')

// 清除表达式输入框中的残留字符
expressionInput.value = ''

// 静态示例数据 - 避免i18n数组渲染问题
const basicExamples = ref([
  "2 + 3 * 4",
  "sqrt(16)", 
  "sin(pi/4)",
  "abs(-5)"
])

const scientificExamples = ref([
  "cos(45 deg)",
  "log(10, 2)",
  "pow(2, 8)", 
  "factorial(5)"
])

const expressionExamples = ref([
  "x = 5; y = 3; x^2 + y^2",
  "f(x) = x^2 + 2*x + 1; f(3)",
  "det([[1,2],[3,4]])",
  "2 + 3i",
  "complex(2, 3)",
  "abs(3 + 4i)"
])

// 帮助文档静态数据
const helpData = ref({
  operators: [
    "+ 加法",
    "- 减法",
    "* 乘法",
    "/ 除法", 
    "^ 或 ** 幂运算",
    "% 取模运算（求余数）",
    "! 阶乘"
  ],
  constants: [
    "pi 或 PI - 圆周率 (3.14159...)",
    "e 或 E - 自然对数底数 (2.71828...)",
    "i - 虚数单位 (√-1)",
    "phi - 黄金比例 (1.618...)",
    "tau - 2π",
    "LN2 - ln(2)",
    "LN10 - ln(10)",
    "LOG2E - log₂(e)",
    "LOG10E - log₁₀(e)",
    "SQRT1_2 - √(1/2)",
    "SQRT2 - √2"
  ],
  basicFunctions: [
    "abs(x) - 绝对值",
    "sqrt(x) - 平方根",
    "cbrt(x) - 立方根",
    "sign(x) - 符号函数",
    "ceil(x) - 向上取整",
    "floor(x) - 向下取整",
    "round(x) - 四舍五入",
    "trunc(x) - 截断小数部分",
    "mod(x, y) - 取模运算",
    "gcd(a, b) - 最大公约数",
    "lcm(a, b) - 最小公倍数",
    "factorial(n) - 阶乘"
  ],
  trigonometric: [
    "sin(x) - 正弦",
    "cos(x) - 余弦", 
    "tan(x) - 正切",
    "asin(x) - 反正弦",
    "acos(x) - 反余弦",
    "atan(x) - 反正切",
    "atan2(y, x) - 双参数反正切",
    "sec(x) - 正割",
    "csc(x) - 余割",
    "cot(x) - 余切"
  ],
  hyperbolic: [
    "sinh(x) - 双曲正弦",
    "cosh(x) - 双曲余弦",
    "tanh(x) - 双曲正切",
    "asinh(x) - 反双曲正弦",
    "acosh(x) - 反双曲余弦",
    "atanh(x) - 反双曲正切",
    "sech(x) - 双曲正割",
    "csch(x) - 双曲余割",
    "coth(x) - 双曲余切"
  ],
  logarithmic: [
    "exp(x) - e的x次方",
    "expm1(x) - e^x - 1",
    "log(x) - 自然对数",
    "log(x, base) - 指定底数的对数",
    "log2(x) - 以2为底的对数",
    "log10(x) - 以10为底的对数",
    "log1p(x) - ln(1+x)",
    "pow(x, y) - x的y次方",
    "nthRoot(x, n) - n次方根"
  ],
  complex: [
    "complex(re, im) - 创建复数",
    "re(x) - 实部",
    "im(x) - 虚部",
    "arg(x) - 幅角",
    "conj(x) - 共轭复数",
    "i - 虚数单位 (√-1)"
  ],
  matrix: [
    "matrix([[a,b],[c,d]]) - 创建矩阵",
    "det(A) - 行列式",
    "inv(A) - 逆矩阵",
    "transpose(A) - 转置",
    "trace(A) - 迹",
    "size(A) - 矩阵大小",
    "diag(A) - 对角线元素",
    "identity(n) - 单位矩阵",
    "zeros(m, n) - 零矩阵",
    "ones(m, n) - 全1矩阵"
  ],
  statistical: [
    "mean(A) - 平均值",
    "median(A) - 中位数",
    "mode(A) - 众数",
    "std(A) - 标准差",
    "var(A) - 方差",
    "min(A) - 最小值",
    "max(A) - 最大值",
    "sum(A) - 求和",
    "prod(A) - 乘积",
    "quantileSeq(A, p) - 分位数"
  ],
  probability: [
    "random() - 0到1的随机数",
    "randomInt(min, max) - 随机整数",
    "combinations(n, k) - 组合数",
    "permutations(n, k) - 排列数",
    "gamma(x) - 伽马函数",
    "factorial(n) - 阶乘",
    "multinomial(A) - 多项式系数"
  ],
  bitwise: [
    "bitAnd(x, y) - 按位与",
    "bitOr(x, y) - 按位或",
    "bitXor(x, y) - 按位异或",
    "bitNot(x) - 按位非",
    "leftShift(x, y) - 左移",
    "rightArithShift(x, y) - 算术右移",
    "rightLogShift(x, y) - 逻辑右移"
  ],
  logical: [
    "and(x, y) - 逻辑与",
    "or(x, y) - 逻辑或",
    "xor(x, y) - 逻辑异或",
    "not(x) - 逻辑非"
  ],
  comparison: [
    "equal(x, y) - 等于",
    "unequal(x, y) - 不等于",
    "smaller(x, y) - 小于",
    "smallerEq(x, y) - 小于等于",
    "larger(x, y) - 大于",
    "largerEq(x, y) - 大于等于",
    "compare(x, y) - 比较函数",
    "deepEqual(x, y) - 深度相等"
  ],
  stringUtils: [
    "string(x) - 转换为字符串",
    "number(x) - 转换为数字",
    "boolean(x) - 转换为布尔值",
    "format(value, precision) - 格式化数字",
    "print(template, values) - 格式化输出"
  ],
  utils: [
    "clone(x) - 深拷贝",
    "isNaN(x) - 检查是否为NaN",
    "isInteger(x) - 检查是否为整数",
    "isNumeric(x) - 检查是否为数值",
    "isPositive(x) - 检查是否为正数",
    "isNegative(x) - 检查是否为负数",
    "isZero(x) - 检查是否为零",
    "isPrime(x) - 检查是否为质数"
  ],
  variableExamples: [
    "x = 10; y = 20; x + y",
    "a = [1, 2, 3]; sum(a)",
    "f(x) = x^2; f(5)",
    "scope = {a: 1, b: 2}; scope.a + scope.b"
  ],
  unitExamples: [
    "5 inch to cm",
    "100 fahrenheit to celsius", 
    "2 hours to minutes",
    "1000 kg to pound"
  ],
  expressionHelpExamples: [
    "matrix([[1,2],[3,4]]) * [5,6]",
    "derivative('x^2 + 3*x', 'x')",
    "evaluate('sin(x)', {x: pi/4})",
    "simplify('2*x + 3*x')"
  ]
})

// 计算显示
const displayExpression = computed(() => {
  if (!expression.value) return ''
  return formatDisplayExpression(expression.value)
})

const displayResult = computed(() => {
  if (isError.value) return 'Error'
  return result.value
})



// 格式化显示表达式
function formatDisplayExpression(expr) {
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/pi/g, 'π')
    .replace(/sqrt/g, '√')
}

// 添加数字
function appendNumber(num) {
  if (isError.value) {
    clear()
  }
  expression.value += num
  calculateReal()
}

// 添加小数点
function appendDecimal() {
  if (isError.value) {
    clear()
  }
  
  // 检查当前数字是否已有小数点
  const parts = expression.value.split(/[+\-*/^()]/)
  const lastPart = parts[parts.length - 1]
  
  if (!lastPart.includes('.')) {
    if (!lastPart || /[+\-*/^()]$/.test(expression.value)) {
      expression.value += '0.'
    } else {
      expression.value += '.'
    }
  }
  calculateReal()
}

// 添加运算符
function appendOperator(op) {
  if (isError.value) {
    clear()
  }
  
  if (!expression.value) return
  
  // 处理阶乘
  if (op === '!') {
    // 阶乘直接添加到表达式末尾
    expression.value += '!'
    calculateReal()
    return
  }
  
  // 转换显示符号为计算符号
  const calcOp = op === '×' ? '*' : op === '÷' ? '/' : op
  
  const lastChar = expression.value.slice(-1)
  if (/[+\-*\/^]/.test(lastChar)) {
    expression.value = expression.value.slice(0, -1) + calcOp
  } else {
    expression.value += calcOp
  }
  calculateReal()
}

// 添加函数
function appendFunction(func) {
  if (isError.value) {
    clear()
  }
  
  // 处理特殊函数名
  const funcName = func === 'ln' ? 'log' : func
  expression.value += funcName + '('
}

// 添加常量
function appendConstant(constant) {
  if (isError.value) {
    clear()
  }
  expression.value += constant
  calculateReal()
}

// 添加括号
function appendParenthesis(paren) {
  if (isError.value) {
    clear()
  }
  expression.value += paren
  if (paren === ')') {
    calculateReal()
  }
}

// 实时计算
function calculateReal() {
  try {
    if (!expression.value) {
      result.value = '0'
      isError.value = false
      return
    }

    // 尝试计算表达式
    const calcResult = evaluate(expression.value)
    
    // 格式化结果
    result.value = formatResult(calcResult)
    isError.value = false
  } catch (err) {
    // 不在实时计算中显示错误，只在最终计算时显示
    result.value = '0'
    isError.value = false
  }
}

// 最终计算
function calculate() {
  try {
    if (!expression.value) return

    const calcResult = evaluate(expression.value)
    const formattedResult = formatResult(calcResult)
    
    // 添加到历史记录
    addToHistory(expression.value, formattedResult)
    
    // 设置结果为新的表达式
    expression.value = formattedResult
    result.value = formattedResult
    isError.value = false
    
    message.success(t('other.calculator.calculateSuccess'))
  } catch (err) {
    result.value = 'Error'
    isError.value = true
    message.error(t('other.calculator.calculateError'))
  }
}

// 表达式计算
function calculateExpression() {
  try {
    expressionError.value = ''
    
    if (!expressionInput.value.trim()) {
      expressionError.value = t('other.calculator.expressionRequired')
      return
    }

    const calcResult = evaluate(expressionInput.value)
    expressionResult.value = formatResult(calcResult)
    
    // 添加到历史记录
    addToHistory(expressionInput.value, expressionResult.value)
    
    message.success(t('other.calculator.calculateSuccess'))
  } catch (err) {
    expressionError.value = err.message
    expressionResult.value = ''
  }
}

// 格式化结果
function formatResult(result) {
  if (typeof result === 'number') {
    // 处理大数和小数
    if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
      return format(result, { notation: 'exponential', precision: 6 })
    }
    return format(result, { precision: 12 }).replace(/\.?0+$/, '')
  }
  
  // 处理复数、矩阵等其他类型
  return format(result, { precision: 6 })
}

// 清除
function clear() {
  expression.value = ''
  result.value = '0'
  isError.value = false
}

// 清除输入
function clearEntry() {
  const parts = expression.value.split(/([+\-*/^()])/g)
  if (parts.length > 1) {
    parts.pop()
    expression.value = parts.join('')
    calculateReal()
  } else {
    clear()
  }
}

// 退格
function backspace() {
  if (isError.value) {
    clear()
    return
  }
  
  expression.value = expression.value.slice(0, -1)
  calculateReal()
}

// 清除表达式
function clearExpression() {
  expressionInput.value = ''
  expressionResult.value = ''
  expressionError.value = ''
  // 强制清除任何残留状态
  nextTick(() => {
    expressionInput.value = ''
  })
}

// 复制结果
function copyResult() {
  const textToCopy = expressionResult.value || result.value
  navigator.clipboard.writeText(textToCopy)
  message.success(t('common.copySuccess'))
}

// 添加到历史记录
function addToHistory(expr, res) {
  history.value.unshift({
    expression: expr,
    result: res,
    timestamp: new Date().toLocaleString()
  })

  // 限制历史记录数量
  if (history.value.length > 20) {
    history.value.pop()
  }
  
  // 保存到本地存储
  saveHistory()
}

// 从历史记录加载
function loadFromHistory(expr) {
  if (currentMode.value === 'expression') {
    expressionInput.value = expr
  } else {
    expression.value = expr
    calculateReal()
  }
}

// 加载示例
function loadExample(expr) {
  // 清除错误状态
  expressionError.value = ''
  expressionResult.value = ''
  // 设置新的表达式
  expressionInput.value = expr
  // 自动切换到表达式模式
  currentMode.value = 'expression'
}

// 清除历史记录
function clearHistory() {
  history.value = []
  saveHistory()
  message.success(t('other.calculator.historyCleared'))
}

// 保存历史记录
function saveHistory() {
  localStorage.setItem('calculator-history', JSON.stringify(history.value))
}

// 加载历史记录
function loadHistory() {
  try {
    const saved = localStorage.getItem('calculator-history')
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch (err) {
    console.error('Failed to load history:', err)
  }
}

// 初始化组件
function initializeCalculator() {
  // 确保所有输入框都是空的
  expression.value = ''
  result.value = '0'
  expressionInput.value = ''
  expressionResult.value = ''
  expressionError.value = ''
  isError.value = false
  
  // 加载历史记录
  loadHistory()
}

// 组件挂载时初始化
onMounted(() => {
  initializeCalculator()
  // 调试：打印示例数组
  console.log('basicExamples:', basicExamples.value)
  console.log('scientificExamples:', scientificExamples.value)
  console.log('expressionExamples:', expressionExamples.value)
  console.log('helpData.operators:', helpData.value.operators)
  console.log('helpData.basicFunctions:', helpData.value.basicFunctions)
})
</script>

<style scoped>
.calculator {
  max-width: 600px;
  margin: 0 auto;
}

.mode-tabs {
  margin-bottom: 16px;
}

.calculator-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.display {
  background-color: var(--n-card-color);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
}

.expression {
  font-size: 16px;
  color: var(--n-text-color-2);
  min-height: 24px;
  word-break: break-all;
  text-align: right;
}

.result {
  font-size: 28px;
  font-weight: bold;
  text-align: right;
  min-height: 36px;
  color: var(--n-text-color-1);
}

.keypad {
  display: grid;
  gap: 8px;
}

.basic-keypad {
  grid-template-rows: repeat(5, 1fr);
}

.scientific-keypad {
  grid-template-rows: repeat(8, 1fr);
}

.row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

/* 科学计算器前3行使用5列布局 */
.scientific-keypad .row:nth-child(1),
.scientific-keypad .row:nth-child(2),
.scientific-keypad .row:nth-child(3) {
  grid-template-columns: repeat(5, 1fr);
}

/* 数字区域使用4列布局 */
.scientific-keypad .row.number-area {
  grid-template-columns: repeat(4, 1fr);
}

/* 等号行占满宽度 */
.scientific-keypad .row.equals-row {
  grid-template-columns: 1fr;
  margin-top: 8px;
}

.number-btn {
  height: 48px;
  font-size: 18px;
  font-weight: 500;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
}

.number-btn:hover {
  background-color: #f5f5f5;
}

.operator-btn {
  height: 48px;
  font-size: 18px;
  font-weight: 500;
  background-color: #18a058 !important;
  color: white !important;
  border: 1px solid #18a058 !important;
}

.operator-btn:hover {
  background-color: #36ad6a !important;
}

.function-btn {
  height: 48px;
  font-size: 14px;
  background-color: #2080f0 !important;
  color: white !important;
  border: 1px solid #2080f0 !important;
}

.function-btn:hover {
  background-color: #4098fc !important;
}

.action-btn {
  height: 48px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
}

.action-btn:hover {
  background-color: #f5f5f5;
}

/* 深色主题支持 */
[data-theme='dark'] .number-btn,
[data-theme='dark'] .action-btn {
  background-color: #48484e;
  color: #ffffff;
  border: 1px solid #5a5a5f;
}

[data-theme='dark'] .number-btn:hover,
[data-theme='dark'] .action-btn:hover {
  background-color: #5a5a5f;
}

/* 强制按钮可见性 */
.n-button {
  opacity: 1 !important;
  visibility: visible !important;
}

.n-button .n-button__content {
  opacity: 1 !important;
  visibility: visible !important;
}

.equals-btn {
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  grid-column: span 2;
  background-color: #18a058 !important;
  color: white !important;
  border: 1px solid #18a058 !important;
}

.equals-btn:hover {
  background-color: #36ad6a !important;
}

.equals-btn-full {
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  background-color: #18a058 !important;
  color: white !important;
  border: 1px solid #18a058 !important;
  width: 100%;
}

.equals-btn-full:hover {
  background-color: #36ad6a !important;
}

.zero-btn {
  grid-column: span 2;
}

.expression-calculator {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.expression-input {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.expression-actions {
  justify-content: flex-start;
}

.expression-result {
  margin-top: 16px;
}

.result-text {
  font-size: 18px;
  font-weight: bold;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.expression-error {
  margin-top: 16px;
}

.help-section {
  margin-top: 24px;
}

.help-content {
  min-height: 400px;
}

.help-content .n-tabs-content {
  padding: 16px;
}

.help-content .n-text {
  margin-bottom: 4px;
  display: block;
  line-height: 1.6;
}

.help-content .n-text[code] {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  transition: background-color 0.2s;
  cursor: pointer;
}

.help-content .n-text[code]:hover {
  background: #e6f7ff;
}

.examples {
  max-height: 200px;
  overflow-y: auto;
}

.examples .n-text:first-child {
  cursor: pointer;
  color: var(--n-color-primary);
}

.examples .n-text:first-child:hover {
  text-decoration: underline;
}

.functions-help {
  font-size: 14px;
}

.history {
  margin-top: 24px;
}

.history-controls {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}

.history-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--n-color-hover);
}

.history-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.history-content .expression {
  color: var(--n-text-color-2);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  flex: 1;
  cursor: pointer;
}

.history-content .expression:hover {
  color: var(--n-color-primary);
}

.history-content .result {
  font-size: 16px;
  font-weight: 500;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

@media (max-width: 768px) {
  .calculator {
    max-width: 100%;
  }
  
  .row {
    gap: 4px;
  }
  
  .number-btn, 
  .operator-btn, 
  .function-btn, 
  .action-btn {
    height: 40px;
    font-size: 14px;
  }
  
  .equals-btn {
    height: 40px;
    font-size: 16px;
  }
  
  .display {
    padding: 16px;
  }
  
  .result {
    font-size: 24px;
  }
}
</style>