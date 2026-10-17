<template>
  <div class="token-calc">
    <ToolIntro toolKey="tokenCalc" />

    <n-card :title="t('ai.tokenCalc.title')" class="tool-card">
      <div class="calc-body">
        <!-- 模型选择 -->
        <div class="row">
          <span class="label">{{ t('ai.tokenCalc.modelLabel') }}</span>
          <n-select
            v-model:value="selectedModel"
            :options="modelOptions"
            :placeholder="t('ai.tokenCalc.modelPlaceholder')"
            class="model-select"
          />
        </div>

        <!-- 文本输入 -->
        <div class="row column">
          <span class="label">{{ t('ai.tokenCalc.inputLabel') }}</span>
          <n-input
            v-model:value="textInput"
            type="textarea"
            :placeholder="t('ai.tokenCalc.inputPlaceholder')"
            :autosize="{ minRows: 8, maxRows: 20 }"
            class="text-input"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="row actions">
          <n-button @click="loadSample" tertiary>{{ t('ai.tokenCalc.pasteSample') }}</n-button>
          <n-button @click="clearText" tertiary>{{ t('ai.tokenCalc.clear') }}</n-button>
          <n-button
            type="primary"
            :disabled="!tokenCount"
            @click="copyResult"
          >{{ t('ai.tokenCalc.copy') }}</n-button>
        </div>

        <!-- 编码加载提示 -->
        <n-alert v-if="loadingEnc" type="info" :show-icon="true" class="loading-alert">
          {{ t('ai.tokenCalc.encoding') }}…
        </n-alert>

        <!-- 结果 -->
        <div v-if="tokenCount || textInput" class="result-grid">
          <n-statistic :label="t('ai.tokenCalc.tokenCount')" tabular-nums>
            {{ tokenCount }}
          </n-statistic>
          <n-statistic :label="t('ai.tokenCalc.charCount')" tabular-nums>
            {{ charCount }}
          </n-statistic>
          <n-statistic :label="t('ai.tokenCalc.wordCount')" tabular-nums>
            {{ wordCount }}
          </n-statistic>
          <n-statistic
            v-if="price"
            :label="t('ai.tokenCalc.estimateCost')"
            tabular-nums
          >
            ${{ formatCost(estCostIn) }}
            <template #prefix>
              <n-tag size="small" :bordered="false" type="success">in</n-tag>
            </template>
            <template #suffix>
              <span class="cost-out">/ ${{ formatCost(estCostOut) }} out</span>
            </template>
          </n-statistic>
        </div>

        <!-- 近似提示 -->
        <n-alert
          v-if="currentModel && currentModel.approx"
          type="warning"
          :show-icon="true"
          class="approx-alert"
        >
          {{ t('ai.tokenCalc.approxNote') }}
        </n-alert>

        <!-- 隐私说明 -->
        <p class="privacy-note">{{ t('ai.tokenCalc.note') }}</p>
      </div>
    </n-card>

    <TutorialAndDocs toolKey="tokenCalc" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { Tiktoken } from 'js-tiktoken'
import ToolIntro from '@/components/common/ToolIntro.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t, locale } = useI18n()
const message = useMessage()

// ===== 模型清单（价格为单位：美元 / 每百万 token，仅供参考）=====
const MODELS = [
  {
    group: 'OpenAI',
    items: [
      { value: 'gpt-4o', label: 'GPT-4o', encoding: 'o200k_base', price: { in: 2.5, out: 10 } },
      { value: 'gpt-4o-mini', label: 'GPT-4o mini', encoding: 'o200k_base', price: { in: 0.15, out: 0.6 } },
      { value: 'o1', label: 'o1', encoding: 'o200k_base', price: { in: 15, out: 60 } },
      { value: 'o3-mini', label: 'o3-mini', encoding: 'o200k_base', price: { in: 1.1, out: 4.4 } },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', encoding: 'cl100k_base', price: { in: 10, out: 30 } },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', encoding: 'cl100k_base', price: { in: 0.5, out: 1.5 } },
      { value: 'text-embedding-3-small', label: 'text-embedding-3-small', encoding: 'cl100k_base', price: { in: 0.02, out: 0.02 } }
    ]
  },
  {
    group: 'Anthropic',
    approx: true,
    items: [
      { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', encoding: 'cl100k_base', approx: true, price: { in: 3, out: 15 } },
      { value: 'claude-3-opus', label: 'Claude 3 Opus', encoding: 'cl100k_base', approx: true, price: { in: 15, out: 75 } },
      { value: 'claude-3-haiku', label: 'Claude 3 Haiku', encoding: 'cl100k_base', approx: true, price: { in: 0.25, out: 1.25 } }
    ]
  }
]

const modelOptions = computed(() =>
  MODELS.map(g => ({
    type: 'group',
    label: g.group,
    key: g.group,
    children: g.items.map(m => ({ label: m.label, value: m.value }))
  }))
)

const selectedModel = ref('gpt-4o')
const currentModel = computed(() => {
  for (const g of MODELS) {
    const found = g.items.find(m => m.value === selectedModel.value)
    if (found) return found
  }
  return null
})
const price = computed(() => currentModel.value?.price || null)

// ===== 分词器（按需懒加载 rank 文件，完全离线）=====
const encCache = new Map()
const enc = shallowRef(null)
const loadingEnc = ref(false)

async function loadEncoding(name) {
  if (encCache.has(name)) {
    enc.value = encCache.get(name)
    return
  }
  loadingEnc.value = true
  try {
    const ranks = name === 'o200k_base'
      ? (await import('js-tiktoken/ranks/o200k_base')).default
      : (await import('js-tiktoken/ranks/cl100k_base')).default
    const instance = new Tiktoken(ranks)
    encCache.set(name, instance)
    enc.value = instance
  } catch (e) {
    message.error('Failed to load tokenizer: ' + (e?.message || e))
  } finally {
    loadingEnc.value = false
  }
}

watch(
  () => currentModel.value?.encoding,
  (encName) => { if (encName) loadEncoding(encName) },
  { immediate: true }
)

// ===== 输入与统计 =====
const textInput = ref('')

const tokenCount = computed(() => {
  if (!enc.value || !textInput.value) return 0
  try {
    return enc.value.encode(textInput.value).length
  } catch {
    return 0
  }
})
const charCount = computed(() => Array.from(textInput.value || '').length)
const wordCount = computed(() => {
  const txt = (textInput.value || '').trim()
  if (!txt) return 0
  const m = txt.match(/[A-Za-z0-9]+|[一-鿿]/g)
  return m ? m.length : 0
})

const estCostIn = computed(() =>
  price.value ? (tokenCount.value / 1e6) * price.value.in : 0
)
const estCostOut = computed(() =>
  price.value ? (tokenCount.value / 1e6) * price.value.out : 0
)

function formatCost(v) {
  if (v === 0) return '0.000000'
  if (v < 0.000001) return v.toExponential(2)
  return v.toFixed(6)
}

// ===== 操作 =====
function loadSample() {
  textInput.value = locale.value === 'zh-CN'
    ? '模型: GPT-4o\n帮我写一个快速排序算法，用 Python 实现，并加上注释。\n说明: 这段代码使用了分治思想，时间复杂度 O(n log n)。'
    : 'Model: GPT-4o\nWrite a quicksort algorithm in Python with comments.\nNote: This uses divide-and-conquer, O(n log n) time complexity.'
}
function clearText() {
  textInput.value = ''
}
async function copyResult() {
  const text = `${t('ai.tokenCalc.tokenCount')}: ${tokenCount.value}\n` +
    `${t('ai.tokenCalc.charCount')}: ${charCount.value}\n` +
    `${t('ai.tokenCalc.wordCount')}: ${wordCount.value}`
  try {
    await navigator.clipboard.writeText(text)
    message.success(t('ai.tokenCalc.copy') + ' ✓')
  } catch {
    message.error('Clipboard unavailable')
  }
}

onMounted(() => {
  if (currentModel.value) loadEncoding(currentModel.value.encoding)
})
</script>

<style scoped>
.token-calc {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}
.tool-card {
  margin-top: 12px;
}
.calc-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.row.column {
  flex-direction: column;
  align-items: stretch;
}
.label {
  font-weight: 600;
  min-width: 64px;
  white-space: nowrap;
}
.model-select {
  min-width: 260px;
  max-width: 360px;
}
.text-input {
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.actions {
  gap: 8px;
}
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 4px;
}
.cost-out {
  font-size: 12px;
  color: #888;
  margin-left: 4px;
}
.loading-alert,
.approx-alert {
  margin-top: 4px;
}
.privacy-note {
  margin: 0;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
