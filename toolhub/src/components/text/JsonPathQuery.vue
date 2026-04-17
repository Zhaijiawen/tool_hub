<template>
  <div class="jsonpath-query">
    <n-card :title="t('text.jsonPath.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 快捷示例 -->
        <div class="examples-row">
          <n-text class="section-label" style="margin-right: 8px;">{{ t('text.jsonPath.examples') }}：</n-text>
          <n-space :size="6" style="flex-wrap: wrap;">
            <n-button
              v-for="ex in quickExamples"
              :key="ex.label"
              size="small"
              tertiary
              @click="loadExample(ex)"
            >{{ ex.label }}</n-button>
          </n-space>
        </div>

        <!-- 主体：左右布局 -->
        <div class="main-layout">
          <!-- 左：JSON 输入 -->
          <div class="panel">
            <div class="panel-header">
              <n-text class="section-label">{{ t('text.jsonPath.jsonInput') }}</n-text>
              <n-button size="tiny" quaternary @click="formatJson">{{ t('text.jsonPath.formatJson') }}</n-button>
            </div>
            <n-input
              v-model:value="jsonInput"
              type="textarea"
              :placeholder="t('text.jsonPath.jsonPlaceholder')"
              :autosize="{ minRows: 12, maxRows: 20 }"
              class="code-input"
              @input="onJsonChange"
            />
            <n-tag v-if="jsonError" type="error" size="small" style="margin-top: 6px;">
              {{ jsonError }}
            </n-tag>
          </div>

          <!-- 右：路径 + 结果 -->
          <div class="panel">
            <div class="panel-header">
              <n-text class="section-label">JSONPath 表达式</n-text>
            </div>
            <n-input-group>
              <n-input
                v-model:value="pathExpr"
                :placeholder="t('text.jsonPath.pathPlaceholder')"
                clearable
                class="code-input"
                @input="runQuery"
                @keydown.enter="runQuery"
              />
              <n-button type="primary" @click="runQuery" :disabled="!!jsonError || !jsonInput">
                {{ t('text.jsonPath.query') }}
              </n-button>
            </n-input-group>

            <!-- 选项 -->
            <div class="options-row">
              <n-checkbox v-model:checked="resultAsArray" @update:checked="runQuery">
                {{ t('text.jsonPath.resultAsArray') }}
              </n-checkbox>
            </div>

            <!-- 结果 -->
            <div class="result-area">
              <div class="result-header" v-if="queryResult !== null">
                <n-tag type="success" size="small">
                  {{ Array.isArray(queryResult) ? queryResult.length : 1 }} {{ t('text.jsonPath.matchCount') }}
                </n-tag>
                <n-button size="tiny" quaternary @click="copyResult">{{ t('common.copy') }}</n-button>
              </div>
              <n-input
                v-if="queryResult !== null"
                :value="resultJson"
                type="textarea"
                readonly
                :autosize="{ minRows: 8, maxRows: 16 }"
                class="code-input"
              />
              <n-tag v-if="queryError" type="error" size="small">{{ queryError }}</n-tag>
              <div v-if="queryResult === null && !queryError && pathExpr" class="no-match">
                <n-text depth="3">{{ t('text.jsonPath.noMatch') }}</n-text>
              </div>
              <div v-if="!pathExpr" class="empty-placeholder-inner">
                <n-text depth="3">{{ t('text.jsonPath.emptyTip') }}</n-text>
              </div>
            </div>
          </div>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="jsonPath" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_jsonpath_input'

const jsonInput = ref('')
const pathExpr = ref('')
const jsonError = ref('')
const queryResult = ref(null)
const queryError = ref('')
const resultAsArray = ref(true)

const DEMO_JSON = JSON.stringify({
  store: {
    book: [
      { category: "reference", author: "Nigel Rees", title: "Sayings of the Century", price: 8.95 },
      { category: "fiction", author: "Evelyn Waugh", title: "Sword of Honour", price: 12.99 },
      { category: "fiction", author: "Herman Melville", title: "Moby Dick", isbn: "0-553-21311-3", price: 8.99 },
      { category: "fiction", author: "J. R. R. Tolkien", title: "The Lord of the Rings", isbn: "0-395-19395-8", price: 22.99 }
    ],
    bicycle: { color: "red", price: 19.95 }
  }
}, null, 2)

const quickExamples = [
  { label: '所有书名', json: DEMO_JSON, path: '$.store.book[*].title' },
  { label: '价格 < 10', json: DEMO_JSON, path: '$.store.book[?(@.price < 10)]' },
  { label: '所有价格', json: DEMO_JSON, path: '$..price' },
  { label: '第一本书', json: DEMO_JSON, path: '$.store.book[0]' },
  { label: '有 isbn 的书', json: DEMO_JSON, path: '$.store.book[?(@.isbn)]' }
]

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const s = JSON.parse(saved)
      if (s.jsonInput) jsonInput.value = s.jsonInput
      if (s.pathExpr) pathExpr.value = s.pathExpr
      validateJson()
      if (pathExpr.value) runQuery()
    } else {
      jsonInput.value = DEMO_JSON
      pathExpr.value = '$.store.book[*].title'
      validateJson()
      runQuery()
    }
  } catch {
    jsonInput.value = DEMO_JSON
    pathExpr.value = '$.store.book[*].title'
    validateJson()
    runQuery()
  }
})

const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      jsonInput: jsonInput.value,
      pathExpr: pathExpr.value
    }))
  } catch {}
}

const loadExample = (ex) => {
  jsonInput.value = ex.json
  pathExpr.value = ex.path
  validateJson()
  runQuery()
}

const validateJson = () => {
  const text = jsonInput.value.trim()
  if (!text) { jsonError.value = ''; return }
  try {
    JSON.parse(text)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = e.message
  }
}

const onJsonChange = () => {
  validateJson()
  saveState()
  if (!jsonError.value && pathExpr.value) runQuery()
}

const formatJson = () => {
  try {
    jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value), null, 2)
    jsonError.value = ''
  } catch (e) {
    message.error(t('text.jsonPath.invalidJson'))
  }
}

const runQuery = async () => {
  saveState()
  queryError.value = ''
  queryResult.value = null
  const expr = pathExpr.value.trim()
  const text = jsonInput.value.trim()
  if (!expr || !text || jsonError.value) return
  try {
    const data = JSON.parse(text)
    const { JSONPath } = await import('jsonpath-plus')
    const result = JSONPath({ path: expr, json: data, resultType: 'value' })
    if (result === undefined || result === null || (Array.isArray(result) && result.length === 0)) {
      queryResult.value = null
    } else {
      queryResult.value = result
    }
  } catch (e) {
    queryError.value = e.message
  }
}

const resultJson = computed(() => {
  if (queryResult.value === null) return ''
  return JSON.stringify(queryResult.value, null, 2)
})

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(resultJson.value)
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.jsonpath-query {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
}

.examples-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-input :deep(textarea),
.code-input :deep(input) {
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 13px;
}

.options-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-match,
.empty-placeholder-inner {
  text-align: center;
  padding: 40px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>

