<template>
  <div class="archive-tool">
    <!-- 工具简介 -->
    <ToolIntro toolKey="archive" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <n-space vertical size="large">
        <!-- 模式切换 -->
        <div class="option-row">
          <span class="option-label">{{ t('other.archive.mode') }}</span>
          <n-radio-group v-model:value="mode" size="small" @update:value="resetAll">
            <n-radio-button value="extract">{{ t('other.archive.extract') }}</n-radio-button>
            <n-radio-button value="create">{{ t('other.archive.create') }}</n-radio-button>
          </n-radio-group>
        </div>

        <!-- ============ 解压模式 ============ -->
        <template v-if="mode === 'extract'">
          <div
            class="upload-area"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerFileInput"
          >
            <input ref="fileInputRef" type="file" style="display:none" @change="onFileChange" />
            <div v-if="!archiveFile" class="upload-hint">
              <n-icon size="40" :depth="3">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
              </n-icon>
              <n-text depth="3">{{ t('other.archive.uploadHint') }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ t('other.archive.uploadSubHint') }}</n-text>
            </div>
            <div v-else class="preview-container">
              <div class="file-info">
                <n-text>{{ archiveFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(archiveFile.size) }}</n-text>
              </div>
            </div>
          </div>

          <!-- 密码（可选） -->
          <div v-if="archiveFile" class="option-row">
            <span class="option-label">{{ t('other.archive.password') }}</span>
            <n-input
              v-model:value="password"
              type="password"
              show-password-on="click"
              :placeholder="t('other.archive.passwordPlaceholder')"
              style="max-width: 280px;"
            />
          </div>

          <!-- 操作行 -->
          <div v-if="archiveFile" class="action-row">
            <n-button @click="resetAll">{{ t('common.clear') }}</n-button>
            <n-button
              type="primary"
              :loading="processing"
              :disabled="processing || wasmLoading || archiveTooLarge"
              @click="openArchive"
            >
              {{ processing ? t('other.archive.processing') : (wasmLoading ? t('other.archive.loadingWasm') : t('other.archive.openArchive')) }}
            </n-button>
          </div>

          <!-- 体积分级提示：libarchive 在 wasm 内存中展开归档，超大文件会触及浏览器堆上限 -->
          <n-alert
            v-if="archiveTooLarge"
            type="error"
            :show-icon="true"
            :bordered="true"
          >
            {{ t('other.archive.fileTooLarge', { size: formatSize(archiveFileSize) }) }}
          </n-alert>
          <n-alert
            v-else-if="archiveAboveWarnLimit"
            type="warning"
            :show-icon="true"
            :bordered="true"
          >
            {{ t('other.archive.largeFileMemoryWarning') }}
          </n-alert>

          <n-alert v-if="extractError" type="error" closable @close="extractError = ''">
            {{ extractError }}
          </n-alert>

          <!-- 条目列表 -->
          <div v-if="entries.length" class="entries-section">
            <div class="entries-head">
              <n-text class="section-title">
                {{ t('other.archive.entries', { count: entries.length }) }}
              </n-text>
              <n-button size="small" :disabled="extracting" @click="extractAll">
                {{ t('other.archive.extractAll') }}
              </n-button>
            </div>
            <div class="entry-list">
              <div v-for="(entry, i) in entries" :key="i" class="entry-item">
                <div class="entry-info">
                  <n-text class="entry-name" :title="entry.path">{{ entry.path }}</n-text>
                  <n-text depth="3" style="font-size: 12px;">
                    {{ formatSize(entry.file.size) }}
                    <span v-if="entry.file.lastModified"> · {{ formatDate(entry.file.lastModified) }}</span>
                  </n-text>
                </div>
                <n-button size="small" :loading="extractingIdx === i" @click="extractEntry(i)">
                  {{ t('other.archive.extractOne') }}
                </n-button>
              </div>
            </div>
            <n-text depth="3" style="font-size: 12px; display: block; margin-top: 8px;">
              {{ t('other.archive.extractAllHint') }}
            </n-text>
          </div>

          <div v-else-if="!archiveFile" class="empty-placeholder">
            <n-text depth="3">{{ t('other.archive.emptyTipExtract') }}</n-text>
          </div>
        </template>

        <!-- ============ 压缩模式 ============ -->
        <template v-else>
          <div
            class="upload-area"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerFileInput"
          >
            <input ref="fileInputRef" type="file" multiple style="display:none" @change="onFileChange" />
            <div v-if="!createFiles.length" class="upload-hint">
              <n-icon size="40" :depth="3">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
              </n-icon>
              <n-text depth="3">{{ t('other.archive.createUploadHint') }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ t('other.archive.createUploadSubHint') }}</n-text>
            </div>
            <div v-else class="file-chips">
              <n-tag
                v-for="(f, i) in createFiles"
                :key="i"
                closable
                size="small"
                @close="removeCreateFile(i)"
                @click.stop
              >
                {{ f.name }} ({{ formatSize(f.size) }})
              </n-tag>
              <n-text depth="3" style="font-size: 12px;">{{ t('other.archive.addMore') }}</n-text>
            </div>
          </div>

          <!-- 压缩参数 -->
          <div v-if="createFiles.length" class="options">
            <div class="option-row">
              <span class="option-label">{{ t('other.archive.format') }}</span>
              <n-radio-group v-model:value="format" size="small">
                <n-radio-button value="zip">ZIP</n-radio-button>
                <n-radio-button value="tar">TAR</n-radio-button>
                <n-radio-button value="7zip">7Z</n-radio-button>
              </n-radio-group>
            </div>
            <div class="option-row">
              <span class="option-label">{{ t('other.archive.compression') }}</span>
              <n-select
                v-model:value="compression"
                :options="compressionOptions"
                size="small"
                style="max-width: 200px;"
              />
            </div>
            <div class="option-row">
              <span class="option-label">{{ t('other.archive.outputName') }}</span>
              <n-input v-model:value="outputName" size="small" style="max-width: 280px;" />
            </div>
          </div>

          <!-- 操作行 -->
          <div v-if="createFiles.length" class="action-row">
            <n-button @click="resetAll">{{ t('common.clear') }}</n-button>
            <n-button
              type="primary"
              :loading="processing"
              :disabled="processing || wasmLoading"
              @click="createArchive"
            >
              {{ processing ? t('other.archive.processing') : (wasmLoading ? t('other.archive.loadingWasm') : t('other.archive.createArchive')) }}
            </n-button>
          </div>

          <div v-if="createResultUrl" class="result">
            <n-space align="center" :wrap="true">
              <n-tag :bordered="false" type="success">{{ outputName }}</n-tag>
              <n-tag :bordered="false" type="info">{{ formatSize(createResultSize) }}</n-tag>
            </n-space>
            <div style="margin-top: 12px;">
              <n-button tag="a" :href="createResultUrl" :download="outputName" type="primary" ghost>
                {{ t('other.archive.download') }}
              </n-button>
            </div>
          </div>

          <div v-else-if="!createFiles.length" class="empty-placeholder">
            <n-text depth="3">{{ t('other.archive.emptyTipCreate') }}</n-text>
          </div>
        </template>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="archive" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useWasmModule } from '@/composables/useWasmModule'
// vendor 胶水：主入口与 worker-bundle 均已打补丁，wasm/worker 均由本站注入
import { Archive } from '@/vendor/libarchive/libarchive.js'

const { t } = useI18n()
const message = useMessage()

const mode = ref('extract') // extract | create

// ---- 解压模式状态 ----
const fileInputRef = ref(null)
const isDragging = ref(false)
const archiveFile = ref(null)       // 待解压的 File
const password = ref('')
const archiveRef = ref(null)        // 已打开的 Archive 实例
const entries = ref([])             // [{ file, path }]
const processing = ref(false)
const extractError = ref('')
const extracting = ref(false)
const extractingIdx = ref(-1)

/**
 * 体积分级阈值。
 *
 * libarchive 在 wasm 线性内存中展开归档内容：压缩包体积、解压后体积、
 * 以及单条目缓冲会同时驻留，超大文件会触及浏览器的 wasm 堆上限
 * （通常 2–4GB，取决于设备内存与是否支持 memory64）。
 * 压缩比高的包（大量重复文本）解压后可能膨胀数倍，故阈值按**包体积**保守设定。
 */
const ARCHIVE_SAFE_LIMIT = 2 * 1024 * 1024 * 1024
const ARCHIVE_WARN_LIMIT = 1024 * 1024 * 1024 // 1GB：提示解压后可能占用大量内存

const archiveFileSize = computed(() => archiveFile.value?.size || 0)
const archiveTooLarge = computed(() => archiveFileSize.value > ARCHIVE_SAFE_LIMIT)

/** 模板需要阈值做分级提示的条件判断（常量不会自动暴露给模板，故包一层） */
const archiveAboveWarnLimit = computed(() => archiveFileSize.value > ARCHIVE_WARN_LIMIT)

// ---- 压缩模式状态 ----
const createFiles = ref([])
const format = ref('zip')           // zip | tar | 7zip
const compression = ref('deflate')  // 见 compressionOptions
const outputName = ref('archive.zip')
const createResultUrl = ref('')
const createResultSize = ref(0)

// WASM 加载器：libarchive.wasm（980KB，首次操作时下载，带进度/可取消/缓存）
const wasm = useWasmModule('libarchive', {
  url: '/wasm/libarchive.wasm',
  name: 'libarchive',
  compile: false // Emscripten glue 以 wasmBinary 自行实例化，无需预编译 Module
})

const wasmLoading = computed(() => ['downloading', 'compiling'].includes(wasm.status.value))

const compressionOptions = computed(() => [
  { label: t('other.archive.compDeflate'), value: 'deflate' },
  { label: t('other.archive.compStore'), value: 'store' },
  { label: t('other.archive.compGzip'), value: 'gzip' },
  { label: t('other.archive.compBzip2'), value: 'bzip2' },
  { label: t('other.archive.compXz'), value: 'xz' },
  { label: t('other.archive.compZstd'), value: 'zstd' },
  { label: t('other.archive.compLz4'), value: 'lz4' }
])

// 切换格式时同步默认压缩算法与输出扩展名
const FORMAT_DEFAULTS = {
  zip: { compression: 'deflate', ext: '.zip' },
  tar: { compression: 'store', ext: '.tar' },
  '7zip': { compression: 'deflate', ext: '.7z' }
}

function formatSize(s) {
  if (!s) return '0 B'
  if (s < 1024) return `${s} B`
  if (s < 1024 * 1024) return `${(s / 1024).toFixed(1)} KB`
  return `${(s / 1024 / 1024).toFixed(2)} MB`
}

function formatDate(ms) {
  try {
    return new Date(ms).toLocaleString()
  } catch {
    return ''
  }
}

const triggerFileInput = () => fileInputRef.value?.click()

const onFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  if (files.length) handleFiles(files)
  e.target.value = ''
}

const onDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files || [])
  if (files.length) handleFiles(files)
}

function handleFiles(files) {
  if (mode.value === 'extract') {
    archiveFile.value = files[0]
    resetExtractResult()
  } else {
    createFiles.value.push(...files)
    resetCreateResult()
  }
}

function removeCreateFile(i) {
  createFiles.value.splice(i, 1)
  if (!createFiles.value.length) resetCreateResult()
}

function resetExtractResult() {
  closeArchive()
  entries.value = []
  extractError.value = ''
  extracting.value = false
  extractingIdx.value = -1
}

function resetCreateResult() {
  if (createResultUrl.value) URL.revokeObjectURL(createResultUrl.value)
  createResultUrl.value = ''
  createResultSize.value = 0
}

function resetAll() {
  archiveFile.value = null
  password.value = ''
  createFiles.value = []
  format.value = 'zip'
  compression.value = 'deflate'
  outputName.value = 'archive.zip'
  resetExtractResult()
  resetCreateResult()
}

function closeArchive() {
  if (archiveRef.value) {
    // close() 会 terminate 内部 worker
    Promise.resolve(archiveRef.value.close()).catch(() => {})
    archiveRef.value = null
  }
}

/**
 * 注入链路：loader 下载/缓存 libarchive.wasm → Archive.init({ getWorker }) →
 * 自有 worker 收字节（postMessage 转移）→ 动态 import 补丁后的 worker-bundle。
 *
 * 注意：useWasmModule.load() 缓存并复用同一个 ArrayBuffer；postMessage 转移会
 * detach 它，因此每次创建 worker 前必须 slice 一份新拷贝（980KB，成本可忽略）。
 */
async function ensureWasmInjected() {
  const { buffer } = await wasm.load() // 命中缓存则瞬时返回
  Archive.init({
    getWorker: () => {
      const worker = new Worker(
        new URL('../../workers/libarchive-worker.js', import.meta.url),
        { type: 'module' }
      )
      const copy = buffer.slice(0)
      worker.postMessage({ type: 'toolhub:wasm-binary', buffer: copy }, [copy])
      return worker
    }
  })
}

async function openArchive() {
  if (!archiveFile.value) {
    message.warning(t('other.archive.noFile'))
    return
  }
  processing.value = true
  extractError.value = ''
  try {
    await ensureWasmInjected()
    // yield 一帧让 loading 态先渲染（open 内部有 comlink 握手 + wasm 初始化）
    await new Promise((r) => setTimeout(r, 0))
    closeArchive()
    let archive
    try {
      archive = await Archive.open(archiveFile.value)
    } catch (e) {
      // 加密归档：带上密码重试一次
      if (password.value) {
        archive = await Archive.open(archiveFile.value)
        await archive.usePassword(password.value)
      } else {
        throw e
      }
    }
    if (password.value) {
      try {
        await archive.usePassword(password.value)
      } catch (_) { /* 密码错误在提取时才暴露 */ }
    }
    archiveRef.value = archive
    const list = await archive.getFilesArray()
    entries.value = list
      .filter((item) => item && item.file)
      .map((item) => ({ path: item.path || item.file.name, file: item.file }))
    if (!entries.value.length) {
      message.info(t('other.archive.noEntries'))
    }
  } catch (e) {
    entries.value = []
    extractError.value = String(e && e.message ? e.message : e) || t('other.archive.openFailed')
  } finally {
    processing.value = false
  }
}

function triggerDownload(file, name) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = name || file.name || 'download'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

async function extractEntry(i) {
  const entry = entries.value[i]
  if (!entry) return
  extractingIdx.value = i
  try {
    const file = await entry.file.extract()
    triggerDownload(file, entry.path.split('/').pop() || file.name)
  } catch (e) {
    message.error(t('other.archive.extractFailed'))
  } finally {
    extractingIdx.value = -1
  }
}

async function extractAll() {
  extracting.value = true
  try {
    for (let i = 0; i < entries.value.length; i++) {
      const entry = entries.value[i]
      const file = await entry.file.extract()
      triggerDownload(file, entry.path.split('/').pop() || file.name)
      // 间隔触发，避免浏览器拦截批量下载
      await new Promise((r) => setTimeout(r, 150))
    }
  } catch (e) {
    message.error(t('other.archive.extractFailed'))
  } finally {
    extracting.value = false
  }
}

async function createArchive() {
  if (!createFiles.value.length) {
    message.warning(t('other.archive.noFiles'))
    return
  }
  processing.value = true
  try {
    await ensureWasmInjected()
    await new Promise((r) => setTimeout(r, 0))
    // 1) createFiles 是 ref([])，其 .value 是 Vue reactive 代理数组；reactive Proxy 无法被
    //    comlink 的 postMessage 结构化克隆（与 OCR 的 selectedLangs.value 同源 bug）。
    //    map 经 Vue rawIterator 返回普通数组，File 元素本身不被代理，无需深拷贝。
    // 2) worker 的 write 期望 files 为 [{ file, pathname }]（会读 element.file.size），
    //    而不是裸 File[]；裸数组会让 element.file 为 undefined 而报 "reading 'size'"。
    //    pathname 省略时 worker 回退用 file.name 作为归档内条目名。
    const plainFiles = createFiles.value.map((f) => ({ file: f }))
    const out = await Archive.write({
      files: plainFiles,
      outputFileName: outputName.value || 'archive.zip',
      compression: compression.value,
      format: format.value
    })
    createResultSize.value = out.size
    if (createResultUrl.value) URL.revokeObjectURL(createResultUrl.value)
    createResultUrl.value = URL.createObjectURL(out)
    message.success(t('other.archive.createSuccess'))
  } catch (e) {
    message.error(String(e && e.message ? e.message : e) || t('other.archive.createFailed'))
  } finally {
    processing.value = false
  }
}

// 监听格式切换：同步默认压缩算法与输出名
watch(format, (f) => {
  const d = FORMAT_DEFAULTS[f]
  if (!d) return
  compression.value = d.compression
  const base = (outputName.value || 'archive').replace(/\.(zip|tar|7z)$/i, '') || 'archive'
  outputName.value = base + d.ext
})
</script>

<style scoped>
.archive-tool {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--card-color);
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--primary-color);
  background-color: rgba(24, 160, 88, 0.04);
}

.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.file-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
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

.entries-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  max-height: 420px;
  overflow-y: auto;
}

.entry-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}

.entry-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.entry-name {
  font-size: 13px;
  color: var(--text-color);
  word-break: break-all;
}

.result {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>
