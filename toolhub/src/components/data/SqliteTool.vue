<template>
  <div class="sqlite-tool">
    <!-- 工具简介 -->
    <ToolIntro toolKey="sqlite" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <!-- ============ 未打开库：打开数据库面板 ============ -->
      <template v-if="!db">
        <n-space vertical size="large">
          <n-radio-group v-model:value="openMode" size="medium">
            <n-radio-button value="upload">{{ t('data.sqlite.modes.upload') }}</n-radio-button>
            <n-radio-button value="saved">{{ t('data.sqlite.modes.saved') }}</n-radio-button>
            <n-radio-button value="new">{{ t('data.sqlite.modes.new') }}</n-radio-button>
          </n-radio-group>

          <n-alert
            v-if="workerReady && !opfsAvailable"
            type="warning"
            :show-icon="true"
            :bordered="true"
          >
            {{ t('data.sqlite.opfsUnavailable') }}
          </n-alert>

          <!-- 上传导入 -->
          <n-space v-if="openMode === 'upload'" vertical size="medium">
            <div
              class="upload-area"
              :class="{ 'drag-over': dragging }"
              @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false"
              @drop.prevent="onDrop"
              @click="fileInput?.click()"
            >
              <input ref="fileInput" type="file" accept=".db,.sqlite,.sqlite3,application/x-sqlite3" style="display:none" @change="onFileChange" />
              <div v-if="!pickedFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('data.sqlite.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('data.sqlite.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ pickedFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(pickedFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="pickedFile = null">{{ t('common.clear') }}</n-button>
              </div>
            </div>
            <n-space align="center">
              <n-text depth="3" style="font-size: 13px;">{{ t('data.sqlite.dbNameLabel') }}</n-text>
              <n-input
                v-model:value="newName"
                size="small"
                :placeholder="t('data.sqlite.dbNamePlaceholder')"
                style="max-width: 280px;"
                :status="nameStatus"
              />
            </n-space>
            <n-text depth="3" style="font-size: 12px;">{{ t('data.sqlite.uploadNameHint') }}</n-text>
            <div>
              <n-button
                type="primary"
                :disabled="!canImport"
                :loading="busy"
                @click="runImport"
              >
                {{ t('data.sqlite.importButton') }}
              </n-button>
            </div>
          </n-space>

          <!-- 已保存的库 -->
          <n-space v-else-if="openMode === 'saved'" vertical size="medium">
            <n-space align="center">
              <n-button size="small" :loading="busy" @click="refreshSaved">{{ t('data.sqlite.refreshList') }}</n-button>
              <n-text depth="3" style="font-size: 12px;">{{ t('data.sqlite.savedHint') }}</n-text>
            </n-space>
            <n-data-table
              :columns="savedColumns"
              :data="savedFiles"
              :bordered="false"
              size="small"
              :loading="busy"
            />
            <n-text v-if="!busy && !savedFiles.length" depth="3" style="font-size: 13px;">
              {{ t('data.sqlite.noSaved') }}
            </n-text>
          </n-space>

          <!-- 新建数据库 -->
          <n-space v-else vertical size="medium">
            <n-space align="center">
              <n-text depth="3" style="font-size: 13px;">{{ t('data.sqlite.dbNameLabel') }}</n-text>
              <n-input
                v-model:value="newName"
                size="small"
                :placeholder="t('data.sqlite.newNamePlaceholder')"
                style="max-width: 280px;"
                :status="nameStatus"
              />
            </n-space>
            <n-radio-group v-model:value="newKind" size="small">
              <n-radio value="opfs" :disabled="!opfsAvailable">{{ t('data.sqlite.kindOpfs') }}</n-radio>
              <n-radio value="memory">{{ t('data.sqlite.kindMemory') }}</n-radio>
            </n-radio-group>
            <n-text depth="3" style="font-size: 12px;">
              {{ newKind === 'opfs' ? t('data.sqlite.kindOpfsHint') : t('data.sqlite.kindMemoryHint') }}
            </n-text>
            <div>
              <n-button
                type="primary"
                :disabled="!canCreate"
                :loading="busy"
                @click="runCreate"
              >
                {{ t('data.sqlite.createButton') }}
              </n-button>
            </div>
          </n-space>
        </n-space>
      </template>

      <!-- ============ 已打开库：工作台 ============ -->
      <template v-else>
        <n-space vertical size="medium">
          <!-- 顶栏 -->
          <n-space align="center" :wrap="true">
            <n-text strong style="font-size: 15px;">{{ db.name }}</n-text>
            <n-tag :bordered="false" :type="db.kind === 'opfs' ? 'success' : 'default'" size="small">
              {{ db.kind === 'opfs' ? t('data.sqlite.kindOpfs') : t('data.sqlite.kindMemory') }}
            </n-tag>
            <n-text depth="3" style="font-size: 12px;">{{ t('data.sqlite.sizeLabel') }}: {{ formatSize(db.size) }}</n-text>
            <n-text depth="3" style="font-size: 12px;">SQLite {{ sqliteVersion }}</n-text>
            <n-button size="small" :loading="busy" @click="runExport">{{ t('data.sqlite.exportButton') }}</n-button>
            <n-button size="small" quaternary :loading="busy" @click="runClose">{{ t('data.sqlite.closeButton') }}</n-button>
          </n-space>

          <n-grid :cols="4" responsive="screen" :x-gap="12">
            <!-- 左栏：表列表 -->
            <n-grid-item :span="1">
              <div class="table-panel">
                <div class="panel-title">{{ t('data.sqlite.tablesTitle') }}</div>
                <n-scrollbar style="max-height: 420px;">
                  <div
                    v-for="tb in db.tables"
                    :key="tb.name"
                    class="table-item"
                    :class="{ active: activeTable === tb.name }"
                    @click="browseTable(tb.name)"
                  >
                    <n-text style="font-size: 13px;">{{ tb.name }}</n-text>
                    <n-text depth="3" style="font-size: 11px;">{{ tb.type === 'view' ? t('data.sqlite.viewTag') : t('data.sqlite.tableTag') }}</n-text>
                  </div>
                  <n-text v-if="!db.tables.length" depth="3" style="font-size: 12px; padding: 8px; display: block;">
                    {{ t('data.sqlite.noTables') }}
                  </n-text>
                </n-scrollbar>
              </div>
            </n-grid-item>

            <!-- 右栏：SQL 编辑器 + 结果 -->
            <n-grid-item :span="3">
              <n-space vertical size="small">
                <div class="editor-wrap">
                  <CodeEditor v-model="sqlText" language="sql" :placeholder="t('data.sqlite.sqlPlaceholder')" />
                </div>
                <n-space align="center">
                  <n-button type="primary" size="small" :disabled="!sqlText.trim()" :loading="busy" @click="runExec">
                    {{ t('data.sqlite.runButton') }}
                  </n-button>
                  <n-text depth="3" style="font-size: 12px;">{{ t('data.sqlite.execHint') }}</n-text>
                  <n-button v-if="activeTable" size="tiny" quaternary @click="fillSelect">
                    {{ t('data.sqlite.fillSelect') }}
                  </n-button>
                </n-space>

                <!-- 执行结果 -->
                <div v-if="execResult" class="result-area">
                  <n-space align="center" :wrap="true" style="margin-bottom: 6px;">
                    <n-tag v-if="execResult.changes" :bordered="false" type="info" size="small">
                      {{ t('data.sqlite.changesLabel') }}: {{ execResult.changes }}
                    </n-tag>
                    <n-tag v-if="execResult.rows.length" :bordered="false" size="small">
                      {{ t('data.sqlite.rowsLabel') }}: {{ execResult.rows.length }}
                    </n-tag>
                    <n-button v-if="execResult.rows.length" size="tiny" secondary @click="downloadCsv">
                      {{ t('data.sqlite.exportCsv') }}
                    </n-button>
                  </n-space>
                  <n-data-table
                    v-if="execResult.rows.length"
                    :columns="resultColumns"
                    :data="execResult.rows"
                    :bordered="false"
                    size="small"
                    :scroll-x="600"
                    :max-height="320"
                    flex-height
                  />
                  <n-text v-else-if="!execResult.changes" depth="3" style="font-size: 12px;">
                    {{ t('data.sqlite.noRows') }}
                  </n-text>
                </div>
              </n-space>
            </n-grid-item>
          </n-grid>
        </n-space>
      </template>

      <!-- 下载 / 执行进度 -->
      <div v-if="busy" class="progress-area">
        <n-progress
          type="line"
          :percentage="displayProgress"
          :show-percentage="true"
          :height="8"
          indicator-placement="inside"
          processing
        />
        <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
          {{ phaseText }} · {{ displayProgress }}%
        </n-text>
      </div>
      <n-alert v-else-if="errorText" type="error" :show-icon="true" closable style="margin-top: 12px;" @close="errorText = ''">
        {{ errorText }}
      </n-alert>
    </n-card>

    <TutorialAndDocs toolKey="sqlite" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NButton } from 'naive-ui'
import CodeEditor from '@/components/common/CodeEditor.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useSqlite } from '@/composables/useSqlite'

const { t } = useI18n()
const message = useMessage()
const sqlite = useSqlite()

// ---- 驱动状态解构（保持响应式） ----
const { busy, errorMsg, stage, displayProgress, sqliteVersion, opfsAvailable, workerReady } = sqlite
const db = computed(() => sqlite.dbInfo.value)

const phaseText = computed(() =>
  stage.value === 'download' ? t('data.sqlite.phaseDownloading') : t('data.sqlite.phaseWorking')
)

const errorText = ref('')
watch(errorMsg, (v) => { if (v) errorText.value = translateError(v) })

// worker 错误码 / 原生异常 → i18n 键
const ERROR_KEYS = {
  NOT_SQLITE_FILE: 'data.sqlite.errors.notSqliteFile',
  IMPORT_FAILED: 'data.sqlite.errors.importFailed',
  OPEN_FAILED: 'data.sqlite.errors.openFailed',
  DESERIALIZE_FAILED: 'data.sqlite.errors.deserializeFailed',
  ALLOC_FAILED: 'data.sqlite.errors.openFailed',
  OPFS_UNAVAILABLE: 'data.sqlite.errors.opfsUnavailable',
  NAME_REQUIRED: 'data.sqlite.errors.nameRequired',
  DB_NOT_OPEN: 'data.sqlite.errors.dbNotOpen',
  WORKER_NOT_READY: 'data.sqlite.errors.workerNotReady',
  WORKER_ERROR: 'data.sqlite.errors.workerError',
  SQLITE_INIT_TIMEOUT: 'data.sqlite.errors.initTimeout'
}

function translateError(msg) {
  const key = ERROR_KEYS[msg]
  if (key) return t(key)
  // SQLite 执行错误（message 为 sqlite 原文）与未知错误：原文展示
  return `${t('data.sqlite.failed')}: ${msg}`
}

// ---- 打开面板 ----
const openMode = ref('upload')
const fileInput = ref(null)
const dragging = ref(false)
const pickedFile = ref(null)
const newName = ref('')
const newKind = ref('opfs')
const savedFiles = ref([])

const NAME_RE = /^[\w.-]{1,64}$/

const nameStatus = computed(() => {
  if (!newName.value) return undefined
  return NAME_RE.test(newName.value) ? undefined : 'error'
})

const canImport = computed(() =>
  !!pickedFile.value && NAME_RE.test(newName.value) && !busy.value
)
const canCreate = computed(() =>
  NAME_RE.test(newName.value) && !busy.value && (newKind.value === 'memory' || opfsAvailable.value)
)

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) pickFile(file)
  e.target.value = ''
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) pickFile(file)
}

function pickFile(file) {
  const ok = /\.(sqlite3?|db)$/i.test(file.name) || file.type === 'application/x-sqlite3'
  if (!ok) {
    message.warning(t('data.sqlite.errors.notDbFile'))
    return
  }
  pickedFile.value = file
  const base = file.name.replace(/\.[^.]+$/, '')
  newName.value = base.replace(/[^\w.-]/g, '_').slice(0, 64) || 'database'
}

async function runImport() {
  if (!canImport.value) return
  errorText.value = ''
  try {
    const bytes = await pickedFile.value.arrayBuffer()
    const name = newName.value.endsWith('.sqlite3') ? newName.value : `${newName.value}.sqlite3`
    await sqlite.importDb(name, bytes)
    message.success(t('data.sqlite.imported', { name }))
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

async function refreshSaved() {
  errorText.value = ''
  try {
    savedFiles.value = await sqlite.listOpfs()
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

const savedColumns = computed(() => [
  { title: t('data.sqlite.colName'), key: 'name', ellipsis: { tooltip: true } },
  { title: t('data.sqlite.colSize'), key: 'size', width: 110, render: (row) => formatSize(row.size) },
  {
    title: t('data.sqlite.colActions'),
    key: 'actions',
    width: 150,
    render: (row) => [
      h(NButton, { size: 'tiny', type: 'primary', quaternary: true, disabled: busy.value, onClick: () => openSaved(row.name) }, () => t('data.sqlite.open')),
      h(NButton, { size: 'tiny', type: 'error', quaternary: true, disabled: busy.value, onClick: () => removeSaved(row.name) }, () => t('common.delete'))
    ]
  }
])

async function openSaved(name) {
  errorText.value = ''
  try {
    await sqlite.openOpfs(name)
    sqlText.value = ''
    execResult.value = null
    activeTable.value = ''
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

async function removeSaved(name) {
  errorText.value = ''
  try {
    savedFiles.value = await sqlite.deleteOpfs(name)
    message.success(t('data.sqlite.deleted', { name }))
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

async function runCreate() {
  if (!canCreate.value) return
  errorText.value = ''
  try {
    const name = newName.value.endsWith('.sqlite3') ? newName.value : `${newName.value}.sqlite3`
    if (newKind.value === 'opfs') {
      await sqlite.openOpfs(name)
    } else {
      await sqlite.openMemory(name, null)
    }
    sqlText.value = ''
    execResult.value = null
    activeTable.value = ''
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

// 打开方式切换到「已保存」时自动刷新列表
watch(openMode, (m) => {
  if (m === 'saved' && workerReady.value) refreshSaved()
})
watch(workerReady, (r) => {
  if (r && openMode.value === 'saved') refreshSaved()
})

// ---- 工作台 ----
const sqlText = ref('')
const execResult = ref(null) // { columns, rows, changes }
const activeTable = ref('')

const resultColumns = computed(() => {
  if (!execResult.value || !execResult.value.columns.length) return []
  return execResult.value.columns.map((name) => ({
    title: name,
    key: name,
    ellipsis: { tooltip: true },
    render: (row) => formatCell(row[name])
  }))
})

function formatCell(v) {
  if (v === null || v === undefined) return 'NULL'
  if (v instanceof Uint8Array) return `BLOB(${v.byteLength})`
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

async function browseTable(table) {
  activeTable.value = table
  errorText.value = ''
  try {
    const result = await sqlite.browse(table, 200)
    execResult.value = result
    sqlText.value = `SELECT * FROM "${table}" LIMIT 200;`
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

function fillSelect() {
  if (activeTable.value) sqlText.value = `SELECT * FROM "${activeTable.value}" LIMIT 200;`
}

async function runExec() {
  if (!sqlText.value.trim()) return
  errorText.value = ''
  try {
    execResult.value = await sqlite.exec(sqlText.value)
  } catch (err) {
    if (err && err.name === 'AbortError') return
    execResult.value = null
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

async function runExport() {
  errorText.value = ''
  try {
    const { bytes } = await sqlite.exportDb()
    downloadBytes(bytes, db.value.name, 'application/x-sqlite3')
    message.success(t('data.sqlite.exported', { name: db.value.name }))
  } catch (err) {
    if (err && err.name === 'AbortError') return
    errorText.value = translateError(String(err && err.message ? err.message : err))
  }
}

async function runClose() {
  await sqlite.closeDb()
  savedFiles.value = []
}

function downloadCsv() {
  if (!execResult.value || !execResult.value.rows.length) return
  const { columns, rows } = execResult.value
  const esc = (v) => {
    if (v === null || v === undefined) return ''
    if (v instanceof Uint8Array) {
      const hex = Array.from(v.slice(0, 256)).map((b) => b.toString(16).padStart(2, '0')).join('')
      return '"' + (v.byteLength > 256 ? hex + '…' : hex) + '"'
    }
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = [columns.map(esc).join(',')]
  for (const row of rows) lines.push(columns.map((c) => esc(row[c])).join(','))
  downloadBytes(new TextEncoder().encode(lines.join('\r\n')), 'query-result.csv', 'text/csv')
}

// ---- 通用 ----
function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function downloadBytes(bytes, name, mime) {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

onUnmounted(() => {
  sqlite.terminate()
})
</script>

<style scoped>
.sqlite-tool {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  border: 1px dashed var(--n-border-color);
  border-radius: 8px;
  padding: 28px 16px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--n-color-primary);
}
.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.table-panel {
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  padding: 8px;
}
.panel-title {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.75;
  padding: 2px 4px 8px;
}
.table-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.table-item:hover {
  background: var(--n-color-hover);
}
.table-item.active {
  background: var(--n-color-primary-modal);
}

/* CodeEditor 默认高度 calc(100vh - 300px) 对工作台过高，压到 200px */
.editor-wrap :deep(.code-editor) {
  height: 200px;
}
.editor-wrap :deep(.cm-content) {
  min-height: 100%;
}

.result-area {
  border-top: 1px solid var(--n-border-color);
  padding-top: 8px;
}

.progress-area {
  margin-top: 12px;
}
</style>
