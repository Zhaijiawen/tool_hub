<template>
  <div class="csv-viewer">
    <!-- 工具简介 -->
    <ToolIntro toolKey="csv" />

    <n-card :title="t('convert.csvViewer.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入区：粘贴 or 上传 -->
        <n-tabs v-model:value="inputTab" type="segment">
          <n-tab-pane name="paste" :tab="t('convert.csvViewer.tabPaste')">
            <n-input
              v-model:value="rawText"
              type="textarea"
              :placeholder="t('convert.csvViewer.pastePlaceholder')"
              :rows="6"
              @input="onRawInput"
            />
          </n-tab-pane>
          <n-tab-pane name="upload" :tab="t('convert.csvViewer.tabUpload')">
            <n-upload
              accept=".csv,.tsv,.txt"
              :max="1"
              :show-file-list="false"
              :custom-request="handleFileUpload"
            >
              <n-upload-dragger>
                <div class="upload-trigger">
                  <n-icon size="40" :depth="3"><upload-outlined /></n-icon>
                  <n-text style="margin-top: 8px">{{ t('convert.csvViewer.uploadHint') }}</n-text>
                  <n-text depth="3" style="font-size: 12px; margin-top: 4px">{{ t('convert.csvViewer.uploadLimit') }}</n-text>
                </div>
              </n-upload-dragger>
            </n-upload>
          </n-tab-pane>
        </n-tabs>

        <!-- 解析选项 -->
        <div v-if="rawText" class="parse-options">
          <n-space align="center" wrap>
            <n-form-item :label="t('convert.csvViewer.delimiter')" style="margin-bottom:0">
              <n-select
                v-model:value="delimiterMode"
                :options="delimiterOptions"
                style="width: 160px"
                @update:value="parse"
              />
            </n-form-item>
            <n-form-item :label="t('convert.csvViewer.hasHeader')" style="margin-bottom:0">
              <n-switch v-model:value="hasHeader" @update:value="parse" />
            </n-form-item>
          </n-space>
        </div>

        <!-- 统计信息行 -->
        <div v-if="rows.length > 0" class="stats-bar">
          <n-space align="center">
            <n-tag size="small" type="info">{{ t('convert.csvViewer.totalRows', { n: totalRows }) }}</n-tag>
            <n-tag size="small" type="success">{{ t('convert.csvViewer.totalCols', { n: columns.length }) }}</n-tag>
            <n-tag v-if="totalRows > MAX_DISPLAY" size="small" type="warning">
              {{ t('convert.csvViewer.truncated', { n: MAX_DISPLAY }) }}
            </n-tag>
            <n-input
              v-model:value="searchText"
              :placeholder="t('convert.csvViewer.search')"
              clearable
              size="small"
              style="width: 200px"
            />
            <n-space>
              <n-button size="small" type="primary" @click="exportJson">
                {{ t('convert.csvViewer.exportJson') }}
              </n-button>
              <n-button size="small" @click="exportCsv">
                {{ t('convert.csvViewer.exportCsv') }}
              </n-button>
              <n-button size="small" @click="clearAll">{{ t('common.clear') }}</n-button>
            </n-space>
          </n-space>
        </div>

        <!-- 数据表格 -->
        <div v-if="rows.length > 0" class="table-wrap">
          <n-data-table
            :columns="tableColumns"
            :data="filteredRows"
            :pagination="pagination"
            :bordered="true"
            size="small"
            striped
            :scroll-x="scrollX"
          />
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="parseError" type="error" :title="t('common.error')">{{ parseError }}</n-alert>

        <!-- 使用说明 -->
        <n-alert type="info" :title="t('convert.csvViewer.infoTitle')">
          <div>{{ t('convert.csvViewer.infoContent') }}</div>
        </n-alert>

      </n-space>
    </n-card>
  <TutorialAndDocs toolKey="csvViewer" />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NText } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
const { t } = useI18n()
const message = useMessage()

const MAX_DISPLAY = 10000
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// ── 状态 ─────────────────────────────────────────
const inputTab      = ref('paste')
const rawText       = ref('')
const delimiterMode = ref('auto')
const hasHeader     = ref(true)
const searchText    = ref('')
const parseError    = ref('')

const headers  = ref([])   // 列名数组
const rows     = ref([])   // 数据行数组（对象）
const totalRows = ref(0)   // 原始总行数（可能超过 MAX_DISPLAY）

// ── 分隔符选项 ────────────────────────────────────
const delimiterOptions = computed(() => [
  { label: t('convert.csvViewer.delimAuto'),      value: 'auto' },
  { label: t('convert.csvViewer.delimComma'),     value: ','    },
  { label: t('convert.csvViewer.delimTab'),       value: '\t'   },
  { label: t('convert.csvViewer.delimSemicolon'), value: ';'    },
  { label: t('convert.csvViewer.delimPipe'),      value: '|'    },
  { label: t('convert.csvViewer.delimSpace'),     value: ' '    },
])

// ── 轻量 CSV 解析器 ────────────────────────────────
const detectDelimiter = (text) => {
  const firstLine = text.split('\n')[0] || ''
  const scores = {
    ',': (firstLine.match(/,/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    '|': (firstLine.match(/\|/g) || []).length,
    ' ': (firstLine.match(/ /g) || []).length
  }
  // 空格出现频率过高易误判，降权处理
  scores[' '] = Math.floor(scores[' '] / 3)
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
}

const parseCSV = (text, delimiter) => {
  const result = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  while (i < text.length) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"'
        i += 2
        continue
      }
      inQuotes = !inQuotes
    } else if (!inQuotes && ch === delimiter) {
      row.push(field)
      field = ''
    } else if (!inQuotes && (ch === '\n' || (ch === '\r' && text[i + 1] === '\n'))) {
      row.push(field)
      field = ''
      result.push(row)
      row = []
      if (ch === '\r') i++
    } else if (!inQuotes && ch === '\r') {
      row.push(field)
      field = ''
      result.push(row)
      row = []
    } else {
      field += ch
    }
    i++
  }
  // 最后一行
  if (field || row.length > 0) {
    row.push(field)
    result.push(row)
  }
  // 过滤全空行
  return result.filter(r => r.some(c => c.trim() !== ''))
}

// ── 触发解析 ─────────────────────────────────────
const parse = () => {
  parseError.value = ''
  const text = rawText.value.trim()
  if (!text) { headers.value = []; rows.value = []; totalRows.value = 0; return }

  try {
    const delim = delimiterMode.value === 'auto' ? detectDelimiter(text) : delimiterMode.value
    const parsed = parseCSV(text, delim)
    if (parsed.length === 0) { headers.value = []; rows.value = []; totalRows.value = 0; return }

    let colNames, dataRows

    if (hasHeader.value) {
      colNames = parsed[0].map((c, i) => c.trim() || `Col${i + 1}`)
      dataRows = parsed.slice(1)
    } else {
      const maxCols = Math.max(...parsed.map(r => r.length))
      colNames = Array.from({ length: maxCols }, (_, i) => `Col${i + 1}`)
      dataRows = parsed
    }

    totalRows.value = dataRows.length
    const displayRows = dataRows.slice(0, MAX_DISPLAY)

    headers.value = colNames
    rows.value = displayRows.map((r, idx) => {
      const obj = { __idx: idx + 1 }
      colNames.forEach((col, i) => { obj[col] = r[i] ?? '' })
      return obj
    })
  } catch (e) {
    parseError.value = e.message
  }
}

const onRawInput = () => {
  // 防抖：输入 300ms 后再解析
  clearTimeout(onRawInput._timer)
  onRawInput._timer = setTimeout(parse, 300)
}

// ── 文件上传 ─────────────────────────────────────
const handleFileUpload = ({ file }) => {
  const f = file.file
  if (!f) return
  if (f.size > MAX_FILE_SIZE) {
    message.error(t('convert.csvViewer.fileTooLarge'))
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    rawText.value = e.target.result
    inputTab.value = 'paste'
    parse()
  }
  reader.readAsText(f, 'utf-8')
}

// ── 表格配置 ─────────────────────────────────────
const columns = computed(() => headers.value)

const tableColumns = computed(() => {
  if (columns.value.length === 0) return []
  return [
    {
      title: '#',
      key: '__idx',
      width: 50,
      fixed: 'left',
      render: (row) => h(NText, { depth: 3, style: 'font-size:12px' }, { default: () => row.__idx })
    },
    ...columns.value.map((col) => ({
      title: col,
      key: col,
      minWidth: 100,
      ellipsis: { tooltip: true },
      sorter: (a, b) => {
        const av = a[col] || ''
        const bv = b[col] || ''
        const an = parseFloat(av), bn = parseFloat(bv)
        if (!isNaN(an) && !isNaN(bn)) return an - bn
        return av.localeCompare(bv)
      }
    }))
  ]
})

const scrollX = computed(() => Math.max(600, columns.value.length * 120))

// ── 搜索过滤 ─────────────────────────────────────
const filteredRows = computed(() => {
  const kw = searchText.value.trim().toLowerCase()
  if (!kw) return rows.value
  return rows.value.filter(row =>
    columns.value.some(col => String(row[col] || '').toLowerCase().includes(kw))
  )
})

const pagination = ref({ page: 1, pageSize: 100, pageSizes: [50, 100, 200], showSizePicker: true })

// ── 导出 ─────────────────────────────────────────
const exportJson = () => {
  const data = filteredRows.value.map(row => {
    const obj = {}
    columns.value.forEach(col => { obj[col] = row[col] })
    return obj
  })
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(a.href)
}

const exportCsv = () => {
  const escapeCell = (v) => {
    const s = String(v ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [
    columns.value.map(escapeCell).join(','),
    ...filteredRows.value.map(row => columns.value.map(col => escapeCell(row[col])).join(','))
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'data.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

// ── 清空 ─────────────────────────────────────────
const clearAll = () => {
  rawText.value = ''
  headers.value = []
  rows.value = []
  totalRows.value = 0
  searchText.value = ''
  parseError.value = ''
}
</script>

<style scoped>
.csv-viewer {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.parse-options {
  padding: 12px 16px;
  background: var(--code-color, #f8f8f8);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
}

.stats-bar {
  padding: 8px 0;
}

.table-wrap {
  overflow-x: auto;
}

@media (max-width: 768px) {
  .csv-viewer {
    padding: 0 12px;
  }
}
</style>

