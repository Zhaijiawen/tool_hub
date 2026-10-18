<template>
  <div class="doc-convert">
    <ToolIntro toolKey="docConvert" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <!-- 首次使用须知：56MB 引擎 -->
      <n-alert type="info" :show-icon="true" style="margin-bottom: 16px;">
        {{ t('document.docConvert.engineNotice') }}
      </n-alert>

      <n-space vertical size="large">
        <!-- 输入方式 -->
        <div class="option-row">
          <span class="option-label">{{ t('document.docConvert.inputMode') }}</span>
          <n-radio-group v-model:value="inputMode" size="small">
            <n-radio value="text">{{ t('document.docConvert.inputText') }}</n-radio>
            <n-radio value="file">{{ t('document.docConvert.inputFile') }}</n-radio>
          </n-radio-group>
        </div>

        <!-- 文本输入 -->
        <div v-if="inputMode === 'text'">
          <n-input
            v-model:value="sourceText"
            type="textarea"
            :rows="10"
            :placeholder="t('document.docConvert.textPlaceholder')"
            style="font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px;"
          />
        </div>

        <!-- 文件输入 -->
        <div v-else>
          <div
            class="upload-area"
            :class="{ 'drag-over': dragging }"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
          >
            <input ref="fileInput" type="file" style="display:none" @change="onFileChange" />
            <div v-if="!fileInfo" class="upload-hint">
              <n-icon size="40" :depth="3">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
              </n-icon>
              <n-text depth="3">{{ t('document.docConvert.uploadHint') }}</n-text>
            </div>
            <div v-else class="file-info" @click.stop>
              <n-text>{{ fileInfo.name }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ formatSize(fileInfo.size) }}</n-text>
              <n-button size="tiny" quaternary @click="clearFile">{{ t('common.clear') }}</n-button>
            </div>
          </div>
        </div>

        <!-- 格式选择 -->
        <div class="options">
          <div class="option-row">
            <span class="option-label">{{ t('document.docConvert.fromLabel') }}</span>
            <n-select
              v-model:value="fromFormat"
              :options="fromOptions"
              size="small"
              filterable
              style="max-width: 260px;"
            />
          </div>
          <div class="option-row">
            <span class="option-label">{{ t('document.docConvert.toLabel') }}</span>
            <n-select
              v-model:value="toFormat"
              :options="toOptions"
              size="small"
              filterable
              style="max-width: 260px;"
            />
          </div>
          <div class="option-row">
            <n-space :size="16">
              <n-checkbox v-model:checked="standalone" size="small">
                {{ t('document.docConvert.standalone') }}
              </n-checkbox>
              <n-checkbox v-model:checked="toc" size="small">
                {{ t('document.docConvert.toc') }}
              </n-checkbox>
              <n-checkbox v-model:checked="extractMedia" size="small">
                {{ t('document.docConvert.extractMedia') }}
              </n-checkbox>
            </n-space>
          </div>
          <n-text depth="3" style="font-size: 12px;">{{ t('document.docConvert.optionHint') }}</n-text>
        </div>

        <!-- 操作 -->
        <div class="action-row">
          <n-button
            type="primary"
            :loading="converting"
            :disabled="converting || !canConvert"
            @click="runConvert"
          >
            {{ converting ? workingLabel : t('document.docConvert.convert') }}
          </n-button>
          <n-button v-if="result" quaternary @click="reset">{{ t('common.clear') }}</n-button>
        </div>

        <!-- 进度 / 错误 -->
        <div v-if="converting" class="progress-area">
          <n-progress
            v-if="pandoc.stage.value === 'download'"
            type="line"
            :percentage="pandoc.displayProgress.value ?? 0"
            :show-percentage="true"
            :height="8"
            indicator-placement="inside"
            processing
          />
          <n-progress
            v-else
            type="line"
            :percentage="100"
            :show-percentage="false"
            :height="8"
            indicator-placement="inside"
            processing
          />
          <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
            {{ workingLabel }}
            <template v-if="pandoc.stage.value === 'download'">
              · {{ pandoc.displayProgress.value ?? 0 }}%
              ({{ t('document.docConvert.downloadHint') }})
            </template>
          </n-text>
          <n-button
            v-if="pandoc.stage.value === 'download'"
            size="tiny"
            quaternary
            style="margin-top: 6px;"
            @click="cancelDownload"
          >
            {{ t('common.cancel') }}
          </n-button>
        </div>
        <n-alert v-else-if="errorText" type="error" :show-icon="true">
          {{ errorText }}
        </n-alert>

        <!-- 结果 -->
        <div v-if="result" class="result">
          <template v-if="result.outputFile">
            <n-space align="center" :wrap="true">
              <n-tag :bordered="false" type="success">{{ result.outputFile.name }}</n-tag>
              <n-text depth="3" style="font-size: 12px;">{{ formatSize(result.outputFile.bytes.byteLength) }}</n-text>
              <n-button size="small" @click="downloadOutputFile">
                {{ t('document.docConvert.downloadFile') }}
              </n-button>
            </n-space>
          </template>
          <template v-else>
            <n-space align="center" :wrap="true" style="margin-bottom: 8px;">
              <n-tag :bordered="false" type="success">
                {{ t('document.docConvert.chars') }}: {{ result.stdout.length }}
              </n-tag>
              <n-button size="small" @click="copyResult">{{ t('common.copy') }}</n-button>
              <n-button size="small" @click="downloadText">
                {{ t('document.docConvert.downloadText') }}
              </n-button>
            </n-space>
            <n-input
              :value="result.stdout"
              type="textarea"
              readonly
              :rows="12"
              style="font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 12px;"
            />
          </template>

          <div v-if="result.mediaZip" style="margin-top: 10px;">
            <n-space align="center" :wrap="true">
              <n-tag :bordered="false" type="info">media.zip</n-tag>
              <n-text depth="3" style="font-size: 12px;">{{ formatSize(result.mediaZip.bytes.byteLength) }}</n-text>
              <n-button size="small" @click="downloadMediaZip">
                {{ t('document.docConvert.downloadMedia') }}
              </n-button>
            </n-space>
          </div>

          <n-alert
            v-if="result.mediaNote"
            type="info"
            :show-icon="true"
            style="margin-top: 8px;"
          >
            {{ result.mediaNote }}
          </n-alert>

          <n-alert
            v-if="result.warnings && result.warnings.length"
            type="warning"
            :show-icon="true"
            style="margin-top: 8px;"
          >
            <div v-for="(w, i) in result.warnings.slice(0, 5)" :key="i">
              {{ formatWarning(w) }}
            </div>
          </n-alert>
        </div>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="docConvert" />
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import { usePandoc } from '@/composables/usePandoc'

const { t } = useI18n()
const message = useMessage()
const pandoc = usePandoc()

const fileInput = ref(null)
const dragging = ref(false)
const inputMode = ref('text')
const sourceText = ref(`# Hello Pandoc

This is **bold** and this is \`code\`.

- item one
- item two

| Feature | Local |
|---|---|
| Upload  | No    |
`)
const fileInfo = ref(null)
const fromFormat = ref('markdown')
const toFormat = ref('html')
const standalone = ref(true)
const toc = ref(false)
const extractMedia = ref(false)
const converting = ref(false)
const errorText = ref('')
const result = ref(null)

// 以下清单全部经 Node 端真实转换实测（见 commit message 的验证记录），
// 不包含「看似支持实则产出空内容」的格式。
// 刻意排除 slide 系（revealjs/slidy/s5/dzslides/slideous）：它们产出的 HTML
// 依赖 CDN 上的 reveal.js / CSS，违背本站「纯本地、无外部请求」的底线，
// 宁可少一个功能也不提供一个跑不起来的东西。pptx 实测输出为 0 字节，同样排除。
const TEXT_INPUT_FORMATS = [
  'markdown', 'commonmark', 'gfm', 'html', 'latex', 'rst', 'json', 'textile',
  'asciidoc', 'org', 'docbook', 'opml', 'jira', 'mediawiki', 'native', 'man',
  'csv', 'tsv', 'typst', 'muse', 'texinfo', 'ipynb'
]
const FILE_INPUT_FORMATS = [
  'docx', 'epub', 'odt', 'rtf', 'html', 'markdown', 'latex', 'rst', 'json',
  'textile', 'org', 'asciidoc', 'mediawiki', 'typst', 'fb2'
]
const TEXT_OUTPUT_FORMATS = [
  'html', 'markdown', 'gfm', 'commonmark', 'latex', 'rst', 'json', 'docbook',
  'opml', 'jira', 'man', 'asciidoc', 'org', 'mediawiki', 'textile', 'typst',
  'plain', 'native'
]
// 需要 output-file 的二进制目标（均已通过「生成后再读回」的往返验证）
const BINARY_OUTPUT_FORMATS = ['docx', 'epub', 'odt', 'rtf']

const fromOptions = computed(() => {
  const list = inputMode.value === 'file' ? FILE_INPUT_FORMATS : TEXT_INPUT_FORMATS
  return list.map((f) => ({ label: f, value: f }))
})

const toOptions = computed(() => {
  const list = [...TEXT_OUTPUT_FORMATS, ...BINARY_OUTPUT_FORMATS]
  return list.map((f) => ({ label: f, value: f }))
})

const canConvert = computed(() => {
  if (!toFormat.value) return false
  return inputMode.value === 'text'
    ? sourceText.value.trim().length > 0
    : !!fileInfo.value
})

const workingLabel = computed(() => {
  const s = pandoc.stage.value
  if (s === 'download') return t('document.docConvert.phaseDownloading')
  if (s === 'init') return t('document.docConvert.phaseStarting')
  return t('document.docConvert.phaseWorking')
})

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function extOf(name) {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name || '')
  return m ? m[1].toLowerCase() : ''
}

async function readFile(file) {
  return { name: file.name, size: file.size, buffer: await file.arrayBuffer(), ext: extOf(file.name) }
}

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) await loadFile(file)
  e.target.value = ''
}

async function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) await loadFile(file)
}

async function loadFile(file) {
  const info = await readFile(file)
  fileInfo.value = info
  result.value = null
  errorText.value = ''
  // 有把握的后缀自动切换来源格式，避免用户手动选
  const KNOWN = {
    md: 'markdown', mdown: 'markdown', markdown: 'markdown', commonmark: 'commonmark',
    html: 'html', htm: 'html', tex: 'latex', latex: 'latex', rst: 'rst',
    json: 'json', textile: 'textile', adoc: 'asciidoc', asciidoc: 'asciidoc',
    org: 'org', rtf: 'rtf', docx: 'docx', epub: 'epub', odt: 'odt',
    mediawiki: 'mediawiki', wiki: 'mediawiki', typ: 'typst', typst: 'typst',
    muse: 'muse', texi: 'texinfo', texinfo: 'texinfo', ipynb: 'ipynb', fb2: 'fb2'
  }
  const mapped = KNOWN[info.ext]
  if (mapped && FILE_INPUT_FORMATS.includes(mapped)) fromFormat.value = mapped
}

function clearFile() {
  fileInfo.value = null
  result.value = null
}

function reset() {
  result.value = null
  errorText.value = ''
}

function cancelDownload() {
  pandoc.wasm.cancel()
}

const EXT_BY_FORMAT = {
  html: 'html', markdown: 'md', gfm: 'md', commonmark: 'md', latex: 'tex',
  rst: 'rst', json: 'json', textile: 'textile', asciidoc: 'adoc', org: 'org',
  docbook: 'xml', opml: 'opml', jira: 'jira', man: 'man', native: 'hs',
  mediawiki: 'wiki', typst: 'typ', muse: 'muse', texinfo: 'texi', plain: 'txt',
  csv: 'csv', tsv: 'tsv', ipynb: 'ipynb', fb2: 'fb2',
  docx: 'docx', epub: 'epub', odt: 'odt', rtf: 'rtf'
}

async function runConvert() {
  errorText.value = ''
  result.value = null
  converting.value = true
  try {
    const options = { from: fromFormat.value, to: toFormat.value }
    if (standalone.value) options.standalone = true
    if (toc.value) options['table-of-contents'] = true

    const isBinaryOut = BINARY_OUTPUT_FORMATS.includes(toFormat.value)
    const outName = isBinaryOut ? `output.${EXT_BY_FORMAT[toFormat.value] || toFormat.value}` : null
    if (outName) options['output-file'] = outName

    let stdin = null
    const files = {}

    if (inputMode.value === 'file' && fileInfo.value) {
      // 文件路径：必须给出数组形式的 input-files，否则 pandoc 读不到输入
      const safeName = fileInfo.value.name.replace(/[\\/#]/g, '_')
      files[safeName] = fileInfo.value.buffer
      options['input-files'] = [safeName]
    } else {
      stdin = sourceText.value
    }

    if (extractMedia.value) {
      options['extract-media'] = 'media.zip'
    }

    const r = await pandoc.convert(options, stdin, files)

    let mediaNote = ''
    if (extractMedia.value) {
      // 以「是否真的解出 media.zip」为准，比在 stdout 里正则猜图片引用可靠：
      // 有的文档引用了图片但内嵌其实是空的，反过来也有抽到资源却没在正文
      // 留下引用的情形。实测确认无内嵌资源时 pandoc 不会生成 media.zip。
      mediaNote = r.mediaZip
        ? t('document.docConvert.mediaNote')
        : t('document.docConvert.mediaEmptyNote')
    }

    result.value = {
      stdout: r.stdout,
      warnings: r.warnings,
      outputFile: r.outputFile || null,
      mediaZip: r.mediaZip || null,
      mediaNote
    }

    if (r.stderr && r.stderr.trim() && !r.stdout && !r.outputFile) {
      errorText.value = r.stderr.trim().slice(0, 400)
    }
  } catch (err) {
    if (err && err.name === 'AbortError') {
      // 用户主动取消下载，不算失败
    } else {
      errorText.value = `${t('document.docConvert.failed')}: ${String(err && err.message ? err.message : err)}`
    }
  } finally {
    converting.value = false
  }
}

function formatWarning(w) {
  if (typeof w === 'string') return w
  return w?.message || w?.text || JSON.stringify(w)
}

function copyResult() {
  navigator.clipboard.writeText(result.value.stdout)
  message.success(t('common.copySuccess'))
}

function baseName() {
  if (inputMode.value === 'file' && fileInfo.value) {
    return fileInfo.value.name.replace(/\.[^.]+$/, '')
  }
  return 'document'
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

function downloadOutputFile() {
  const f = result.value.outputFile
  downloadBytes(f.bytes, f.name, 'application/octet-stream')
}

function downloadMediaZip() {
  const f = result.value.mediaZip
  downloadBytes(f.bytes, f.name, 'application/zip')
}

function downloadText() {
  const ext = EXT_BY_FORMAT[toFormat.value] || 'txt'
  const mime = toFormat.value === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8'
  downloadBytes(new TextEncoder().encode(result.value.stdout), `${baseName()}.${ext}`, mime)
}

onUnmounted(() => pandoc.terminate())
</script>

<style scoped>
.doc-convert {
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--card-color);
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--primary-color);
  background-color: rgba(24, 160, 88, 0.04);
}

.upload-hint,
.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}

.file-info {
  pointer-events: auto;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.option-label {
  font-size: 13px;
  color: var(--text-color);
  flex-shrink: 0;
  min-width: 72px;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress-area {
  padding: 4px 0;
}

.result {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>
