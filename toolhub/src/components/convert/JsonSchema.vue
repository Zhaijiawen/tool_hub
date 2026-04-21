<template>
  <div class="json-schema">
    <n-card :title="t('convert.jsonSchema.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入区 -->
        <div>
          <n-text class="section-title">JSON</n-text>
          <n-input
            v-model:value="jsonInput"
            type="textarea"
            :placeholder="t('convert.jsonSchema.inputPlaceholder')"
            :rows="10"
            style="font-family: monospace; font-size: 13px"
            @input="onInput"
          />
        </div>

        <!-- 选项行 -->
        <n-space align="center" wrap>
          <n-form-item :label="t('convert.jsonSchema.outputFormat')" :show-feedback="false">
            <n-radio-group v-model:value="outputFormat">
              <n-radio value="schema">{{ t('convert.jsonSchema.formatSchema') }}</n-radio>
              <n-radio value="ts">{{ t('convert.jsonSchema.formatTs') }}</n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item v-if="outputFormat === 'schema'" :label="t('convert.jsonSchema.schemaTitle')" :show-feedback="false">
            <n-input
              v-model:value="schemaTitle"
              :placeholder="t('convert.jsonSchema.schemaTitlePlaceholder')"
              clearable
              style="width: 200px"
            />
          </n-form-item>
          <n-form-item v-if="outputFormat === 'schema'" :show-feedback="false" label=" ">
            <n-checkbox v-model:checked="allRequired">{{ t('convert.jsonSchema.allRequired') }}</n-checkbox>
          </n-form-item>
        </n-space>

        <n-space>
          <n-button type="primary" @click="generate" :disabled="!jsonInput.trim()">{{ t('convert.jsonSchema.generate') }}</n-button>
          <n-button v-if="output" @click="copyOutput">{{ copied ? t('convert.jsonSchema.copied') : t('convert.jsonSchema.copy') }}</n-button>
        </n-space>

        <!-- 错误 -->
        <n-alert v-if="errorMsg" type="error">{{ errorMsg }}</n-alert>

        <!-- 输出 -->
        <div v-if="output">
          <n-text class="section-title">{{ outputFormat === 'schema' ? 'JSON Schema' : 'TypeScript' }}</n-text>
          <n-input
            type="textarea"
            :value="output"
            readonly
            :rows="18"
            style="font-family: monospace; font-size: 13px"
          />
        </div>

        <n-alert type="info" :title="t('convert.jsonSchema.infoTitle')">
          {{ t('convert.jsonSchema.infoContent') }}
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="jsonSchema" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const jsonInput    = ref('')
const outputFormat = ref('schema')
const schemaTitle  = ref('')
const allRequired  = ref(true)
const output       = ref('')
const errorMsg     = ref('')
const copied       = ref(false)

const onInput = () => { errorMsg.value = ''; output.value = '' }

// ── 核心推断逻辑 ────────────────────────────────
const inferType = (value) => {
  if (value === null)            return { type: 'null' }
  if (typeof value === 'boolean') return { type: 'boolean' }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { type: 'integer' }
    return { type: 'number' }
  }
  if (typeof value === 'string') {
    // 简单格式检测
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { type: 'string', format: 'date' }
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return { type: 'string', format: 'date-time' }
    if (/^[^@]+@[^@]+\.[^@]+$/.test(value)) return { type: 'string', format: 'email' }
    if (/^https?:\/\//i.test(value))        return { type: 'string', format: 'uri' }
    return { type: 'string' }
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', items: {} }
    // 合并所有元素类型
    const itemSchemas = value.map(v => inferSchema(v))
    const merged = mergeSchemas(itemSchemas)
    return { type: 'array', items: merged }
  }
  if (typeof value === 'object') return inferObjectSchema(value)
  return {}
}

const inferSchema = (value) => {
  const t = inferType(value)
  return t
}

const inferObjectSchema = (obj, required = false) => {
  const properties = {}
  const requiredList = []
  for (const [k, v] of Object.entries(obj)) {
    properties[k] = inferSchema(v)
    requiredList.push(k)
  }
  const schema = { type: 'object', properties }
  if (required && requiredList.length > 0) schema.required = requiredList
  return schema
}

// 将多个 schema 合并为 anyOf（如果类型不同）或单个
const mergeSchemas = (schemas) => {
  const unique = []
  const seen = new Set()
  for (const s of schemas) {
    const key = JSON.stringify(s)
    if (!seen.has(key)) { seen.add(key); unique.push(s) }
  }
  if (unique.length === 1) return unique[0]
  return { anyOf: unique }
}

// ── 生成 JSON Schema ──────────────────────────
const toJsonSchema = (data, title, markAllRequired) => {
  const root = Array.isArray(data)
    ? { type: 'array', items: data.length > 0 ? inferObjectSchema(data[0], markAllRequired) : {} }
    : inferObjectSchema(data, markAllRequired)

  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...(title ? { title } : {}),
    ...root
  }
  return JSON.stringify(schema, null, 2)
}

// ── 生成 TypeScript Interface ──────────────────
const toTypeScript = (data, title) => {
  const rootName = title || 'Root'
  const lines = []
  const interfaces = new Map()

  const inferTsType = (value, key) => {
    if (value === null) return 'null'
    if (typeof value === 'boolean') return 'boolean'
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number'
    if (typeof value === 'string') return 'string'
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]'
      return inferTsType(value[0], key) + '[]'
    }
    if (typeof value === 'object') {
      const iName = capitalize(key || 'Object')
      buildInterface(iName, value)
      return iName
    }
    return 'unknown'
  }

  const buildInterface = (name, obj) => {
    if (interfaces.has(name)) return
    const fields = []
    for (const [k, v] of Object.entries(obj)) {
      fields.push(`  ${k}: ${inferTsType(v, k)};`)
    }
    interfaces.set(name, `export interface ${name} {\n${fields.join('\n')}\n}`)
  }

  const rootData = Array.isArray(data) && data.length > 0 ? data[0] : (Array.isArray(data) ? {} : data)
  buildInterface(rootName, rootData)

  // 先输出引用 interface（顺序：被引用的在前）
  for (const [, iface] of interfaces) lines.push(iface, '')
  if (Array.isArray(data)) lines.push(`export type ${rootName}List = ${rootName}[];`)

  return lines.join('\n').trim()
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// ── 入口 ─────────────────────────────────────
const generate = () => {
  errorMsg.value = ''
  output.value = ''
  const raw = jsonInput.value.trim()
  if (!raw) return

  let data
  try {
    data = JSON.parse(raw)
  } catch {
    errorMsg.value = t('convert.jsonSchema.invalidJson')
    return
  }

  try {
    if (outputFormat.value === 'schema') {
      output.value = toJsonSchema(data, schemaTitle.value.trim(), allRequired.value)
    } else {
      output.value = toTypeScript(data, schemaTitle.value.trim() || 'Root')
    }
  } catch (e) {
    errorMsg.value = e.message
  }
}

const copyOutput = () => {
  navigator.clipboard.writeText(output.value).then(() => {
    copied.value = true
    message.success(t('convert.jsonSchema.copied'))
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
.json-schema {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .json-schema { padding: 0 12px; }
}
</style>

