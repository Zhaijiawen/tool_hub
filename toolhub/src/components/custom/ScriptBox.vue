<template>
  <div class="script-box">
    <!-- 脚本列表侧边栏 + 主编辑区 -->
    <div class="layout">
      <!-- 左侧脚本列表 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">{{ t('custom.scriptBox.myScripts') }}</span>
          <n-button size="tiny" type="primary" @click="openNewScriptDialog">
            + {{ t('custom.scriptBox.newScript') }}
          </n-button>
        </div>

        <div class="script-list">
          <div
            v-for="script in scripts"
            :key="script.id"
            class="script-item"
            :class="{ active: activeScriptId === script.id }"
            @click="selectScript(script.id)"
          >
            <div class="script-item-name">{{ script.name }}</div>
            <div class="script-item-meta">{{ getCategoryLabel(script.category) }}</div>
          </div>
          <n-empty v-if="scripts.length === 0" size="small" :description="t('custom.scriptBox.noScripts')" style="margin-top: 24px" />
        </div>

        <!-- 导入/导出 -->
        <div class="sidebar-footer">
          <n-button size="small" block @click="exportScripts">
            ↑ {{ t('custom.scriptBox.export') }}
          </n-button>
          <n-button size="small" block @click="triggerImport">
            ↓ {{ t('custom.scriptBox.import') }}
          </n-button>
          <input
            ref="importInputRef"
            type="file"
            accept=".toolhub.json,.json"
            style="display: none"
            @change="onImportFileChange"
          />
        </div>
      </div>

      <!-- 主编辑区 -->
      <div class="main-panel" v-if="activeScript">
        <!-- 工具栏 -->
        <div class="editor-toolbar">
          <div class="script-info">
            <n-tag size="small" :type="getCategoryType(activeScript.category)">
              {{ getCategoryLabel(activeScript.category) }}
            </n-tag>
            <span class="script-name-display">{{ activeScript.name }}</span>
            <span v-if="activeScript.desc" class="script-desc-display">— {{ activeScript.desc }}</span>
          </div>
          <n-space>
            <n-button size="small" @click="openEditScriptDialog(activeScript)">{{ t('common.edit') }}</n-button>
            <n-popconfirm @positive-click="deleteScript(activeScript.id)">
              <template #trigger>
                <n-button size="small" type="error">{{ t('common.delete') }}</n-button>
              </template>
              {{ t('custom.scriptBox.deleteConfirm') }}
            </n-popconfirm>
          </n-space>
        </div>

        <!-- 编辑器区 + 输入区并排 -->
        <div class="editor-input-row">
          <!-- 脚本编辑器 -->
          <div class="editor-section">
            <div class="section-label">
              {{ t('custom.scriptBox.scriptCode') }}
              <n-tooltip>
                <template #trigger>
                  <n-button size="tiny" quaternary circle style="margin-left: 4px">?</n-button>
                </template>
                <div style="max-width: 260px; font-size: 12px; line-height: 1.6">
                  <div>{{ t('custom.scriptBox.codeHint1') }}</div>
                  <pre style="margin: 6px 0; font-size: 11px">{{ FUNCTION_HINT }}</pre>
                  <div>{{ t('custom.scriptBox.codeHint2') }}</div>
                </div>
              </n-tooltip>
            </div>
            <CodeEditor
              v-model="activeScript.code"
              language="javascript"
              :style="{ height: editorHeight }"
              @update:model-value="onCodeChange"
            />
          </div>

          <!-- 输入区 -->
          <div class="input-section">
            <div class="section-label">{{ t('custom.scriptBox.inputData') }}</div>
            <n-input
              v-model:value="inputData"
              type="textarea"
              :placeholder="t('custom.scriptBox.inputPlaceholder')"
              :style="{ height: editorHeight }"
              style="font-family: 'Fira Code', monospace; font-size: 13px"
            />
          </div>
        </div>

        <!-- 执行按钮 -->
        <div class="run-bar">
          <n-button type="primary" :loading="running" @click="runScript" size="medium">
            ▶ {{ t('custom.scriptBox.run') }}
          </n-button>
          <n-button @click="clearOutput" size="medium">
            {{ t('common.clear') }}
          </n-button>
          <n-button @click="copyOutput" size="medium" :disabled="!outputData">
            {{ t('common.copy') }}
          </n-button>
          <span class="run-time" v-if="lastRunTime !== null">
            {{ t('custom.scriptBox.runTime', { ms: lastRunTime }) }}
          </span>
        </div>

        <!-- 输出区 -->
        <div class="output-section">
          <div class="section-label">{{ t('custom.scriptBox.output') }}</div>
          <div
            class="output-box"
            :class="{ 'has-error': outputIsError }"
          >
            <pre v-if="outputData" class="output-pre">{{ outputData }}</pre>
            <n-empty v-else size="small" :description="t('custom.scriptBox.outputEmpty')" />
          </div>
        </div>

        <!-- helpers 参考 -->
        <n-collapse style="margin-top: 8px">
          <n-collapse-item :title="t('custom.scriptBox.helpersRef')" name="helpers">
            <div class="helpers-grid">
              <div v-for="h in HELPERS_REF" :key="h.name" class="helper-item">
                <code class="helper-name">{{ h.name }}</code>
                <span class="helper-desc">{{ h.desc }}</span>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>

      <!-- 空状态 -->
      <div class="main-empty" v-else>
        <n-empty :description="t('custom.scriptBox.selectOrCreate')" />
      </div>
    </div>

    <!-- 新增/编辑脚本弹窗 -->
    <n-modal
      v-model:show="scriptDialogVisible"
      :title="editingScript.id ? t('custom.scriptBox.editScriptTitle') : t('custom.scriptBox.newScriptTitle')"
      preset="card"
      style="width: min(500px, 95vw)"
    >
      <n-form :model="editingScript" label-placement="top">
        <n-form-item :label="t('custom.scriptBox.fieldName')" required>
          <n-input v-model:value="editingScript.name" :placeholder="t('custom.scriptBox.namePlaceholder')" />
        </n-form-item>
        <n-form-item :label="t('custom.scriptBox.fieldCategory')">
          <n-select v-model:value="editingScript.category" :options="categoryOptions" />
        </n-form-item>
        <n-form-item :label="t('custom.scriptBox.fieldDesc')">
          <n-input v-model:value="editingScript.desc" :placeholder="t('custom.scriptBox.descPlaceholder')" />
        </n-form-item>
        <n-alert v-if="!editingScript.id" type="warning" :show-icon="true" style="margin-bottom: 12px">
          {{ t('custom.scriptBox.localStorageHint') }}
        </n-alert>
        <n-space justify="end">
          <n-button @click="scriptDialogVisible = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" @click="saveScriptMeta">{{ t('common.save') }}</n-button>
        </n-space>
      </n-form>
    </n-modal>

    <!-- 教程与文档 -->
    <TutorialAndDocs toolKey="scriptBox" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CodeEditor from '@/components/common/CodeEditor.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t, locale } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_scriptBox_scripts'

// ── 常量 ──────────────────────────────────────────────────────

const FUNCTION_HINT = `async function transform(input, helpers) {
  // input: string
  // return: string | object | any
  return input.toUpperCase()
}`

const HELPERS_REF = computed(() => [
  { name: 'helpers.dayjs', desc: t('custom.scriptBox.helperDayjs') },
  { name: 'helpers._', desc: t('custom.scriptBox.helperLodash') },
  { name: 'helpers.CryptoJS', desc: t('custom.scriptBox.helperCryptoJS') },
  { name: 'helpers.yaml', desc: t('custom.scriptBox.helperYaml') },
  { name: 'helpers.math', desc: t('custom.scriptBox.helperMath') },
  { name: 'helpers.uuid', desc: t('custom.scriptBox.helperUuid') },
  { name: 'helpers.nanoid', desc: t('custom.scriptBox.helperNanoid') },
  { name: 'helpers.diff', desc: t('custom.scriptBox.helperDiff') },
  { name: 'helpers.marked', desc: t('custom.scriptBox.helperMarked') },
  { name: 'helpers.DOMPurify', desc: t('custom.scriptBox.helperDOMPurify') },
  { name: 'helpers.xmlParser', desc: t('custom.scriptBox.helperXml') },
  { name: 'helpers.sparkMD5', desc: t('custom.scriptBox.helperSparkMD5') },
  { name: 'fetch / JSON / btoa / atob', desc: t('custom.scriptBox.helperBuiltin') },
  { name: 'crypto.subtle', desc: t('custom.scriptBox.helperCrypto') },
])

const getDefaultCode = () => {
  const isChinese = locale.value === 'zh' || locale.value.startsWith('zh')
  return isChinese
    ? `// 在这里编写你的转换函数
// input: 左侧输入框的内容（字符串）
// helpers: 内置工具库，参见下方「可用 helpers」
// 返回值会显示在输出区，支持同步和 async 函数

async function transform(input, helpers) {
  return input
}
`
    : `// Write your transform function here
// input: content from the input box (string)
// helpers: built-in library, see "Available helpers" below
// Return value is shown in the output area; async/await supported

async function transform(input, helpers) {
  return input
}
`
}

const CATEGORY_LIST = ['text', 'json', 'crypto', 'datetime', 'network', 'util']

// ── 状态 ──────────────────────────────────────────────────────

const scripts = ref([])
const activeScriptId = ref(null)
const inputData = ref('')
const outputData = ref('')
const outputIsError = ref(false)
const running = ref(false)
const lastRunTime = ref(null)
const editorHeight = '280px'

const scriptDialogVisible = ref(false)
const editingScript = ref({ id: '', name: '', category: 'util', desc: '' })

// ── 计算 ──────────────────────────────────────────────────────

const activeScript = computed(() => scripts.value.find(s => s.id === activeScriptId.value) || null)

const categoryOptions = computed(() => CATEGORY_LIST.map(c => ({
  label: t(`custom.scriptBox.cat_${c}`),
  value: c
})))

// ── i18n 工具 ─────────────────────────────────────────────────

const getCategoryLabel = (cat) => t(`custom.scriptBox.cat_${cat}`)

const getCategoryType = (cat) => {
  const map = { text: 'default', json: 'info', crypto: 'error', datetime: 'warning', network: 'success', util: 'default' }
  return map[cat] || 'default'
}

// ── helpers 懒加载 ─────────────────────────────────────────────

let _helpers = null

const loadHelpers = async () => {
  if (_helpers) return _helpers
  const [
    { default: dayjs },
    lodashModule,
    { default: CryptoJS },
    yaml,
    mathModule,
    { v4: uuidv4 },
    { nanoid },
    diffModule,
    { marked },
    { default: DOMPurify },
    { XMLParser },
    { default: sparkMD5 },
  ] = await Promise.all([
    import('dayjs'),
    import('lodash-es'),
    import('crypto-js'),
    import('js-yaml'),
    import('mathjs'),
    import('uuid'),
    import('nanoid'),
    import('diff'),
    import('marked'),
    import('dompurify'),
    import('fast-xml-parser'),
    import('spark-md5'),
  ])
  _helpers = {
    dayjs,
    _: lodashModule,
    CryptoJS,
    yaml,
    math: mathModule,
    uuid: uuidv4,
    nanoid,
    diff: diffModule,
    marked,
    DOMPurify,
    xmlParser: new XMLParser(),
    sparkMD5,
  }
  return _helpers
}

// ── 脚本执行 ──────────────────────────────────────────────────

const runScript = async () => {
  if (!activeScript.value) return
  running.value = true
  outputIsError.value = false
  outputData.value = ''
  const t0 = performance.now()
  try {
    const helpers = await loadHelpers()
    // 用 Function 构造执行，返回 transform 函数
    // eslint-disable-next-line no-new-func
    const wrapper = new Function(`
      ${activeScript.value.code}
      return typeof transform === 'function' ? transform : null
    `)
    const fn = wrapper()
    if (typeof fn !== 'function') {
      throw new Error(t('custom.scriptBox.errorNoTransform'))
    }
    const result = await fn(inputData.value, helpers)
    const elapsed = Math.round(performance.now() - t0)
    lastRunTime.value = elapsed
    if (result === undefined || result === null) {
      outputData.value = String(result)
    } else if (typeof result === 'object') {
      outputData.value = JSON.stringify(result, null, 2)
    } else {
      outputData.value = String(result)
    }
  } catch (err) {
    outputIsError.value = true
    outputData.value = `${err.name}: ${err.message}\n\n${err.stack || ''}`
    lastRunTime.value = Math.round(performance.now() - t0)
  } finally {
    running.value = false
  }
}

const clearOutput = () => {
  outputData.value = ''
  outputIsError.value = false
  lastRunTime.value = null
}

const copyOutput = () => {
  if (!outputData.value) return
  navigator.clipboard.writeText(outputData.value).then(() => {
    message.success(t('common.copySuccess'))
  })
}

// ── 代码修改保存 ──────────────────────────────────────────────

const onCodeChange = (val) => {
  if (!activeScript.value) return
  activeScript.value.code = val
  saveToStorage()
}

// ── 脚本管理 ──────────────────────────────────────────────────

const selectScript = (id) => {
  activeScriptId.value = id
  outputData.value = ''
  outputIsError.value = false
  lastRunTime.value = null
}

const openNewScriptDialog = () => {
  editingScript.value = { id: '', name: '', category: 'util', desc: '' }
  scriptDialogVisible.value = true
}

const openEditScriptDialog = (script) => {
  editingScript.value = { id: script.id, name: script.name, category: script.category, desc: script.desc }
  scriptDialogVisible.value = true
}

const saveScriptMeta = () => {
  if (!editingScript.value.name.trim()) {
    message.warning(t('custom.scriptBox.nameRequired'))
    return
  }
  if (editingScript.value.id) {
    // 编辑
    const idx = scripts.value.findIndex(s => s.id === editingScript.value.id)
    if (idx >= 0) {
      scripts.value[idx].name = editingScript.value.name
      scripts.value[idx].category = editingScript.value.category
      scripts.value[idx].desc = editingScript.value.desc
    }
  } else {
    // 新增
    const newScript = {
      id: `script-${Date.now()}`,
      name: editingScript.value.name,
      category: editingScript.value.category,
      desc: editingScript.value.desc,
      code: getDefaultCode(),
      createdAt: Date.now()
    }
    scripts.value.push(newScript)
    activeScriptId.value = newScript.id
  }
  saveToStorage()
  scriptDialogVisible.value = false
  message.success(t('common.saveSuccess'))
}

const deleteScript = (id) => {
  scripts.value = scripts.value.filter(s => s.id !== id)
  if (activeScriptId.value === id) {
    activeScriptId.value = scripts.value[0]?.id || null
  }
  saveToStorage()
  message.success(t('common.deleteSuccess'))
}

// ── 导入/导出 ────────────────────────────────────────────────

const exportScripts = () => {
  if (scripts.value.length === 0) {
    message.warning(t('custom.scriptBox.noScriptsToExport'))
    return
  }
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    scripts: scripts.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `toolhub-scripts-${Date.now()}.toolhub.json`
  a.click()
  URL.revokeObjectURL(url)
  message.success(t('custom.scriptBox.exportSuccess'))
}

const importInputRef = ref(null)

const triggerImport = () => {
  importInputRef.value?.click()
}

const onImportFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      const imported = data.scripts || (Array.isArray(data) ? data : [])
      if (!imported.length) throw new Error('empty')
      const now = Date.now()
      const toAdd = imported.map((s, i) => ({
        ...s,
        id: `script-${now + i}`
      }))
      scripts.value.push(...toAdd)
      saveToStorage()
      message.success(t('custom.scriptBox.importSuccess', { count: toAdd.length }))
    } catch {
      message.error(t('custom.scriptBox.importError'))
    } finally {
      // 清空 input 值，允许重复导入同一文件
      e.target.value = ''
    }
  }
  reader.readAsText(file)
}

// ── 持久化 ────────────────────────────────────────────────────

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts.value))
  } catch { /* ignore */ }
}

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) scripts.value = JSON.parse(saved)
} catch { /* ignore */ }
</script>

<style scoped>
.script-box {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  box-sizing: border-box;
  max-width: 1400px;
  margin: 0 auto;
}

.layout {
  display: flex;
  gap: 16px;
  height: calc(100vh - 160px);
  min-height: 500px;
}

/* ── 左侧边栏 ── */
.sidebar {
  width: 210px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--card-color);
  min-height: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
}

.script-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.script-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
  border-left: 3px solid transparent;
}

.script-item:hover {
  background-color: var(--n-color-hover, rgba(0,0,0,0.04));
}

.script-item.active {
  background-color: var(--n-color-primary-hover, rgba(24,160,88,0.08));
  border-left-color: var(--n-color-primary, #18a058);
}

.script-item-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.script-item-meta {
  font-size: 11px;
  color: var(--n-text-color-3, #aaa);
  margin-top: 2px;
}

.sidebar-footer {
  padding: 8px 10px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}


/* ── 主编辑区 ── */
.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  min-width: 0;
  min-height: 0;
}

.main-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.script-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.script-name-display {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.script-desc-display {
  font-size: 12px;
  color: var(--n-text-color-3, #aaa);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.editor-input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.editor-section,
.input-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.section-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--n-text-color-2, #666);
  display: flex;
  align-items: center;
}

.run-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.run-time {
  font-size: 12px;
  color: var(--n-text-color-3, #aaa);
  font-family: 'Fira Code', monospace;
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.output-box {
  min-height: 120px;
  max-height: 260px;
  overflow-y: auto;
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px 12px;
  transition: border-color 0.2s;
}

.output-box.has-error {
  border-color: var(--n-color-error, #d03050);
  background-color: rgba(208, 48, 80, 0.03);
}

.output-pre {
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--n-text-color);
}

.output-box.has-error .output-pre {
  color: var(--n-color-error, #d03050);
}

/* ── helpers 参考 ── */
.helpers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 6px 16px;
}

.helper-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
}

.helper-name {
  font-family: 'Fira Code', monospace;
  color: var(--n-color-primary, #18a058);
  white-space: nowrap;
  flex-shrink: 0;
}

.helper-desc {
  color: var(--n-text-color-2, #555);
}

/* ── 响应式 ── */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: 180px;
  }

  .script-list {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 4px 8px;
    gap: 4px;
  }

  .script-item {
    border-left: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    border-radius: 4px;
  }

  .script-item.active {
    border-bottom-color: var(--n-color-primary, #18a058);
  }

  .editor-input-row {
    grid-template-columns: 1fr;
  }
}
</style>

