<template>
  <div class="json-convert-tool">
    <n-card :title="t('convert.jsonConvert.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 格式选择 -->
        <div class="format-row">
          <div class="format-col">
            <n-text class="section-title">{{ t('convert.jsonConvert.inputFormat') }}</n-text>
            <n-select
              v-model:value="inputFormat"
              :options="formatOptions"
              @update:value="handleFormatChange"
            />
          </div>
          <div class="arrow-col">
            <n-button circle @click="swapFormats" :title="t('convert.jsonConvert.swap')">
              ⇄
            </n-button>
          </div>
          <div class="format-col">
            <n-text class="section-title">{{ t('convert.jsonConvert.outputFormat') }}</n-text>
            <n-select
              v-model:value="outputFormat"
              :options="formatOptions"
              @update:value="handleFormatChange"
            />
          </div>
        </div>

        <!-- 双栏编辑器 -->
        <div class="editor-row">
          <div class="editor-col">
            <div class="editor-header">
              <n-text class="section-title">{{ t('convert.jsonConvert.input') }}</n-text>
            </div>
            <n-input
              v-model:value="inputText"
              type="textarea"
              :placeholder="t('convert.jsonConvert.inputPlaceholder')"
              :autosize="{ minRows: 14, maxRows: 24 }"
              @input="handleInputChange"
            />
          </div>
          <div class="editor-col">
            <div class="editor-header">
              <n-text class="section-title">{{ t('convert.jsonConvert.output') }}</n-text>
              <n-space>
                <n-button size="tiny" @click="copyOutput" quaternary>{{ t('common.copy') }}</n-button>
                <n-button size="tiny" @click="downloadOutput" quaternary>{{ t('common.download') }}</n-button>
              </n-space>
            </div>
            <n-input
              v-model:value="outputText"
              type="textarea"
              readonly
              :placeholder="t('convert.jsonConvert.outputPlaceholder')"
              :autosize="{ minRows: 14, maxRows: 24 }"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <n-space>
            <n-button type="primary" @click="convert">{{ t('convert.jsonConvert.convert') }}</n-button>
            <n-button @click="swapContent">{{ t('convert.jsonConvert.swapContent') }}</n-button>
            <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
          </n-space>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="convertError" type="error" :title="t('common.error')" class="error-alert">
          {{ convertError }}
        </n-alert>

        <!-- 格式说明 -->
        <n-alert type="info" :title="t('convert.jsonConvert.supportedFormats')">
          {{ t('convert.jsonConvert.formatsDesc') }}
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="jsonConvert" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_jsonConvert_input'

const inputText = ref('')
const outputText = ref('')
const inputFormat = ref('json')
const outputFormat = ref('yaml')
const convertError = ref('')

const formatOptions = computed(() => [
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'CSV', value: 'csv' },
  { label: 'TOML', value: 'toml' },
  { label: 'XML', value: 'xml' }
])

const handleFormatChange = () => {
  if (inputText.value) convert()
}

const handleInputChange = () => {
  saveToStorage()
  convert()
}

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      input: inputText.value,
      inputFormat: inputFormat.value,
      outputFormat: outputFormat.value
    }))
  } catch (e) { /* ignore */ }
}

// JSON → 对象
const parseInput = async (text, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(text)
    case 'yaml': {
      const yaml = (await import('js-yaml')).default
      return yaml.load(text)
    }
    case 'csv': {
      return csvToJson(text)
    }
    case 'toml': {
      const toml = await import('@iarna/toml')
      return toml.parse(text)
    }
    case 'xml': {
      const { XMLParser } = await import('fast-xml-parser')
      const parser = new XMLParser({ ignoreAttributes: false })
      return parser.parse(text)
    }
    default:
      throw new Error('Unsupported format: ' + format)
  }
}

// 对象 → 目标格式字符串
const serializeOutput = async (data, format) => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2)
    case 'yaml': {
      const yaml = (await import('js-yaml')).default
      return yaml.dump(data, { indent: 2 })
    }
    case 'csv': {
      return jsonToCsv(data)
    }
    case 'toml': {
      const toml = await import('@iarna/toml')
      return toml.stringify(data)
    }
    case 'xml': {
      const { XMLBuilder } = await import('fast-xml-parser')
      const builder = new XMLBuilder({ ignoreAttributes: false, format: true })
      return builder.build(data)
    }
    default:
      throw new Error('Unsupported format: ' + format)
  }
}

// 简单 CSV ↔ JSON 实现（处理对象数组）
const csvToJson = (csv) => {
  const lines = csv.trim().split('\n')
  if (lines.length < 1) return []
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  if (lines.length === 1) return headers
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = values[i] !== undefined ? values[i] : ''
    })
    return obj
  })
}

const parseCsvLine = (line) => {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes
    } else if (line[i] === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += line[i]
    }
  }
  result.push(current.trim())
  return result
}

const jsonToCsv = (data) => {
  if (!Array.isArray(data)) {
    // 如果不是数组，把对象数组化为单行
    data = [data]
  }
  if (data.length === 0) return ''
  const headers = Object.keys(data[0])
  const csvLines = [headers.join(',')]
  for (const row of data) {
    const values = headers.map(h => {
      const val = row[h]
      if (val === null || val === undefined) return ''
      const str = String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"` : str
    })
    csvLines.push(values.join(','))
  }
  return csvLines.join('\n')
}

const convert = async () => {
  if (!inputText.value.trim()) {
    outputText.value = ''
    convertError.value = ''
    return
  }
  convertError.value = ''
  try {
    const data = await parseInput(inputText.value, inputFormat.value)
    outputText.value = await serializeOutput(data, outputFormat.value)
  } catch (e) {
    convertError.value = e.message
    outputText.value = ''
  }
}

const swapFormats = () => {
  const tmp = inputFormat.value
  inputFormat.value = outputFormat.value
  outputFormat.value = tmp
  if (inputText.value) convert()
}

const swapContent = () => {
  const tmpText = inputText.value
  const tmpFormat = inputFormat.value
  inputText.value = outputText.value
  inputFormat.value = outputFormat.value
  outputFormat.value = tmpFormat
  outputText.value = tmpText
  saveToStorage()
  if (inputText.value) convert()
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  convertError.value = ''
  localStorage.removeItem(STORAGE_KEY)
}

const copyOutput = () => {
  if (!outputText.value) return
  navigator.clipboard.writeText(outputText.value).then(() => {
    message.success(t('common.copySuccess'))
  })
}

const downloadOutput = () => {
  if (!outputText.value) return
  const extMap = { json: 'json', yaml: 'yaml', csv: 'csv', toml: 'toml', xml: 'xml' }
  const ext = extMap[outputFormat.value] || 'txt'
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `output.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { input, inputFormat: inf, outputFormat: outf } = JSON.parse(saved)
      inputText.value = input || ''
      inputFormat.value = inf || 'json'
      outputFormat.value = outf || 'yaml'
      if (inputText.value) convert()
    }
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.json-convert-tool {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.format-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.format-col {
  flex: 1;
}

.arrow-col {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
}

.editor-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.editor-col {
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.actions-section {
  margin: 4px 0;
}

.error-alert {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .json-convert-tool {
    padding: 0 12px;
  }
  .editor-row {
    grid-template-columns: 1fr;
  }
  .format-row {
    flex-direction: column;
    align-items: stretch;
  }
  .arrow-col {
    display: none;
  }
}
</style>

