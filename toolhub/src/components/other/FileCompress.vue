<template>
  <div class="file-compress">
    <!-- 工具简介 -->
    <ToolIntro toolKey="fileCompress" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <n-space vertical size="large">
        <!-- 上传区 -->
        <div
          class="upload-area"
          :class="{ 'drag-over': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <input ref="fileInputRef" type="file" style="display:none" @change="onFileChange" />
          <div v-if="!fileName" class="upload-hint">
            <n-icon size="40" :depth="3">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
            </n-icon>
            <n-text depth="3">{{ t('other.fileCompress.uploadHint') }}</n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('other.fileCompress.uploadSubHint') }}</n-text>
          </div>
          <div v-else class="preview-container">
            <div class="file-info">
              <n-text>{{ fileName }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ fileSizeStr }}</n-text>
            </div>
          </div>
        </div>

        <!-- 参数 -->
        <div v-if="fileName" class="options">
          <div class="option-row">
            <span class="option-label">{{ t('other.fileCompress.mode') }}</span>
            <n-radio-group v-model:value="mode" size="small">
              <n-radio-button value="compress">{{ t('other.fileCompress.compress') }}</n-radio-button>
              <n-radio-button value="decompress">{{ t('other.fileCompress.decompress') }}</n-radio-button>
            </n-radio-group>
          </div>
          <div class="option-row">
            <span class="option-label">{{ t('other.fileCompress.format') }}</span>
            <n-radio-group v-model:value="format" size="small">
              <n-radio-button value="brotli">Brotli</n-radio-button>
              <n-radio-button value="zstd">Zstd</n-radio-button>
              <n-radio-button value="gzip">Gzip</n-radio-button>
            </n-radio-group>
            <n-text v-if="format === 'gzip'" depth="3" style="font-size: 12px;">
              {{ t('other.fileCompress.gzipNative') }}
            </n-text>
          </div>
          <div v-if="mode === 'compress' && format !== 'gzip'" class="option-row">
            <span class="option-label">{{ t('other.fileCompress.quality') }}</span>
            <n-slider
              v-model:value="quality"
              :min="format === 'brotli' ? 1 : 1"
              :max="format === 'brotli' ? 11 : 19"
              :step="1"
              :marks="qualityMarks"
              class="option-slider"
            />
            <n-text class="option-value">{{ quality }}</n-text>
          </div>
          <n-text depth="3" style="font-size: 12px;">{{ qualityHint }}</n-text>
        </div>

        <!-- 操作行 -->
        <div v-if="fileName" class="action-row">
          <n-button @click="clearFile" :disabled="processing">{{ t('common.clear') }}</n-button>
          <n-button
            type="primary"
            :loading="processing"
            :disabled="processing || wasmLoading || exceedsLimit(fileSize)"
            @click="run"
          >
            {{ processing ? t('other.fileCompress.processing') : (wasmLoading ? t('other.fileCompress.loadingWasm') : (mode === 'compress' ? t('other.fileCompress.compressBtn') : t('other.fileCompress.decompressBtn'))) }}
          </n-button>
          <n-button v-if="processing && format === 'gzip'" quaternary @click="cancelRun">
            {{ t('other.fileCompress.cancel') }}
          </n-button>
        </div>

        <!-- 流式处理进度（仅 gzip：brotli/zstd 为整读，无分块进度可言） -->
        <div v-if="processing && format === 'gzip' && streamProgress > 0" class="progress-area">
          <n-progress type="line" :percentage="streamProgress" :height="8" indicator-placement="inside" processing />
          <n-text depth="3" style="font-size: 12px; margin-top: 4px; display: block;">
            {{ t('other.fileCompress.streamingProgress', { percent: streamProgress }) }}
          </n-text>
        </div>

        <!-- 超限提示（brotli/zstd 整读路径） -->
        <n-alert v-if="fileSize && exceedsLimit(fileSize)" type="error" :show-icon="true" :bordered="true">
          {{ t('other.fileCompress.fileTooLarge', { size: formatSize(fileSize) }) }}
        </n-alert>
        <n-alert
          v-else-if="aboveWarnLimit"
          type="warning"
          :show-icon="true"
          :bordered="true"
        >
          {{ t('other.fileCompress.largeFileMemoryWarning') }}
        </n-alert>

        <!-- 结果 -->
        <div v-if="resultSize" class="result">
          <n-space align="center" :wrap="true">
            <n-tag :bordered="false" type="info">{{ t('other.fileCompress.original') }}: {{ fileSizeStr }}</n-tag>
            <n-tag :bordered="false" type="success">{{ t('other.fileCompress.result') }}: {{ resultSizeStr }}</n-tag>
            <n-tag :bordered="false" :type="mode === 'compress' && ratio < 100 ? 'success' : 'default'">
              {{ t('other.fileCompress.ratio') }}: {{ ratio }}%
            </n-tag>
          </n-space>
          <n-text v-if="mode === 'compress' && ratio >= 100" depth="3" style="font-size:12px; display:block; margin-top:8px;">
            {{ t('other.fileCompress.noGain') }}
          </n-text>
          <div style="margin-top: 12px;">
            <n-button tag="a" :href="resultUrl" :download="resultName" type="primary" ghost>
              {{ t('other.fileCompress.download') }}
            </n-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!fileName" class="empty-placeholder">
          <n-text depth="3">{{ t('other.fileCompress.emptyTip') }}</n-text>
        </div>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="fileCompress" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useWasmModule } from '@/composables/useWasmModule'
// vendor 胶水：init 只接受我们下载+缓存的字节（见 src/vendor/README.md）
import brotliInit, { compress as brotliCompress, decompress as brotliDecompress } from '@/vendor/brotli-wasm/brotli_wasm.js'
import { init as zstdInit, compress as zstdCompress, decompress as zstdDecompress } from '@/vendor/zstd-wasm/index.js'

const { t } = useI18n()
const message = useMessage()

const fileInputRef = ref(null)
const isDragging = ref(false)
const fileName = ref('')
const fileSize = ref(0)
const currentFile = ref(null) // File 对象（保留引用以便分块读取）
const fileBuffer = ref(null) // 仅 brotli/zstd 路径按需整读（gzip 不再需要）
const processing = ref(false)
const streamProgress = ref(0) // gzip 流式处理的读取进度 0-100
const resultUrl = ref('')
const resultSize = ref(0)
const resultName = ref('')

const mode = ref('compress') // compress | decompress
const format = ref('brotli') // brotli | zstd | gzip
const quality = ref(6)       // brotli 默认 6（11 最小但最慢）；zstd 默认 3 → 切换格式时调整

// 两个 WASM 引擎按需下载（gzip 用浏览器原生流，无需下载）
const brotliModule = useWasmModule('brotli', {
  url: '/wasm/brotli_wasm_bg.wasm',
  name: 'Brotli'
})
const zstdModule = useWasmModule('zstd', {
  url: '/wasm/zstd.wasm',
  name: 'Zstd'
})

const wasmLoading = computed(() =>
  format.value !== 'gzip' &&
  ['downloading', 'compiling'].includes(
    format.value === 'brotli' ? brotliModule.status.value : zstdModule.status.value
  )
)

const qualityMarks = computed(() => {
  const marks = {}
  const max = format.value === 'brotli' ? 11 : 19
  marks[1] = '1'
  if (max >= 11) marks[11] = '11'
  marks[max] = String(max)
  return marks
})

const qualityHint = computed(() => {
  if (mode.value === 'decompress') return t('other.fileCompress.qualityHintDecompress')
  if (format.value === 'brotli') return t('other.fileCompress.qualityHintBrotli')
  if (format.value === 'zstd') return t('other.fileCompress.qualityHintZstd')
  return t('other.fileCompress.qualityHintGzip')
})

const fileSizeStr = computed(() => formatSize(fileSize.value))
const resultSizeStr = computed(() => formatSize(resultSize.value))
const ratio = computed(() => {
  if (!resultSize.value || !fileSize.value) return 0
  return Math.round((resultSize.value / fileSize.value) * 100)
})

function formatSize(s) {
  if (!s) return '0 B'
  if (s < 1024) return `${s} B`
  if (s < 1024 * 1024) return `${(s / 1024).toFixed(1)} KB`
  return `${(s / 1024 / 1024).toFixed(2)} MB`
}

const triggerFileInput = () => fileInputRef.value?.click()

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) loadFile(file)
  e.target.value = ''
}

const onDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) loadFile(file)
}

// 魔数嗅探：zstd = 28 B5 2F FD；gzip = 1F 8B（brotli 无魔数，不猜）
// 只读文件头部 8 字节 —— 不再为了嗅探读整个文件。
async function detectFormat(file) {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  if (head.length >= 4 && head[0] === 0x28 && head[1] === 0xB5 && head[2] === 0x2F && head[3] === 0xFD) return 'zstd'
  if (head.length >= 2 && head[0] === 0x1F && head[1] === 0x8B) return 'gzip'
  return null
}

/** 分块大小：4MB，与 FileHash 保持一致 */
const CHUNK_SIZE = 4 * 1024 * 1024

/**
 * 体积分级阈值。
 *
 * 背景（实测与浏览器机制）：
 * - gzip 走原生 CompressionStream，是**真流式** —— 输入逐块喂入，内存与文件大小无关；
 * - brotli / zstd 的 wasm 绑定只提供 whole-buffer API（一次性吃完整 buffer），
 *   输入与输出需同时驻留内存，峰值约为文件体积的 2 倍；
 * - 输出无论哪种格式，最终都要生成完整 Blob 才能下载（浏览器暂无通用的流式落盘能力），
 *   故**任何格式在下限上都无法完全规避"输出全量驻留"**。
 *
 * 因此：gzip 不设上限（流式，安全）；brotli/zstd 按内存预算设阈值并如实告知用户。
 */
const WASM_SAFE_LIMIT = 2 * 1024 * 1024 * 1024 // 2GB：超过则大概率触发浏览器堆上限
const WASM_WARN_LIMIT = 500 * 1024 * 1024 // 500MB：提示内存峰值较高

/** 当前格式是否走整读路径（brotli/zstd） */
function usesWholeBuffer() {
  return format.value === 'brotli' || format.value === 'zstd'
}

/** 该文件在当前格式下是否超出安全上限 */
function exceedsLimit(size) {
  return usesWholeBuffer() && size > WASM_SAFE_LIMIT
}

/** 模板用：是否需要提示内存占用较高（const 不会自动暴露给模板，故包一层） */
const aboveWarnLimit = computed(
  () => fileSize.value > 0 && usesWholeBuffer() && fileSize.value > WASM_WARN_LIMIT
)

async function loadFile(file) {
  fileName.value = file.name
  fileSize.value = file.size
  currentFile.value = file
  fileBuffer.value = null // 不再整读；仅 WASM 路径按需一次性取
  resetResult()

  // 超限直接拦下，不让用户白等（分模式提示：解压输出可能比输入大，阈值更严）
  if (exceedsLimit(file.size)) {
    message.error(t('other.fileCompress.fileTooLarge', { size: formatSize(file.size) }))
  } else if (usesWholeBuffer() && file.size > WASM_WARN_LIMIT) {
    message.warning(t('other.fileCompress.largeFileMemoryWarning'))
  }

  // 解压模式下按魔数预选格式，减少用户试错（只读 8 字节）
  if (mode.value === 'decompress') {
    const detected = await detectFormat(file)
    if (detected) format.value = detected
  }
  // 切换格式时把质量拉回该格式的默认值
  quality.value = format.value === 'brotli' ? 6 : 3
}

function resetResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultSize.value = 0
  resultName.value = ''
}

function clearFile() {
  fileName.value = ''
  fileSize.value = 0
  currentFile.value = null
  fileBuffer.value = null
  streamProgress.value = 0
  resetResult()
}

// 让按钮的 loading 态先绘制一帧，再进入同步 WASM 计算（避免 UI 假死无反馈）
function yieldToPaint() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

let brotliInited = false
async function ensureBrotli() {
  const { buffer } = await brotliModule.load() // 命中缓存则瞬时返回
  if (!brotliInited) {
    await brotliInit(buffer)
    brotliInited = true
  }
}

let zstdInited = false
async function ensureZstd() {
  const { buffer } = await zstdModule.load()
  if (!zstdInited) {
    await zstdInit(buffer)
    zstdInited = true
  }
}

// gzip 走浏览器原生流（CompressionStream/DecompressionStream），无需 WASM。
//
// 关键改造：旧实现是 `writer.write(整个ArrayBuffer)` —— 一次性把整文件塞进流，
// 内存峰值仍等于文件体积。改为**逐块喂入**：内存中始终只有一个 chunk，
// 因此 GB 级文件也能处理（实测 FileHash 同量级场景堆增量 <1MB）。
//
// 注意：输出侧仍需累积完整结果（浏览器暂无流式落盘的通用能力），
// 但输入侧已不再整读，峰值从「输入+输出」降到「输出 + 一个 chunk」。
async function gzipStreaming(file, compress, onProgress, shouldAbort) {
  const stream = compress ? new CompressionStream('gzip') : new DecompressionStream('gzip')
  const writer = stream.writable.getWriter()
  const reader = stream.readable.getReader()

  // 消费端与生产端并行：否则先写完再读会在大文件上死锁
  const outChunks = []
  let outTotal = 0
  const consume = (async () => {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      outChunks.push(value)
      outTotal += value.byteLength
    }
  })()

  try {
    const total = file.size
    let offset = 0
    while (offset < total) {
      if (shouldAbort && shouldAbort()) {
        await writer.abort()
        throw new Error('ABORTED')
      }
      const end = Math.min(offset + CHUNK_SIZE, total)
      const chunk = new Uint8Array(await file.slice(offset, end).arrayBuffer())
      await writer.write(chunk)
      offset = end
      onProgress && onProgress(Math.round((offset / total) * 100))
    }
    await writer.close()
    await consume
  } catch (e) {
    // 中断时确保消费端 promise 结束，避免未处理的 rejection
    await consume.catch(() => {})
    throw e
  }

  // 合并输出块（此时内存里是最终结果，浏览器下载 Blob 的下限）
  const out = new Uint8Array(outTotal)
  let pos = 0
  for (const c of outChunks) {
    out.set(c, pos)
    pos += c.byteLength
  }
  return out
}

const KNOWN_EXTS = ['.br', '.zst', '.gz']

function buildResultName() {
  if (mode.value === 'compress') {
    const ext = format.value === 'brotli' ? '.br' : format.value === 'zst' ? '.zst' : '.gz'
    return fileName.value + ext
  }
  const lower = fileName.value.toLowerCase()
  for (const ext of KNOWN_EXTS) {
    if (lower.endsWith(ext)) return fileName.value.slice(0, -ext.length)
  }
  return fileName.value + '.decompressed'
}

let abortFlag = false

/** 用户取消流式处理 */
function cancelRun() {
  abortFlag = true
}

async function run() {
  const file = currentFile.value
  if (!file) {
    message.warning(t('other.fileCompress.noFile'))
    return
  }
  // 超限拦截：避免用户等待数分钟后浏览器 OOM
  if (exceedsLimit(file.size)) {
    message.error(t('other.fileCompress.fileTooLarge', { size: formatSize(file.size) }))
    return
  }
  processing.value = true
  abortFlag = false
  streamProgress.value = 0
  try {
    let out
    if (mode.value === 'compress') {
      if (format.value === 'brotli') {
        await ensureBrotli()
        await yieldToPaint()
        // WASM whole-buffer 路径：输入需一次性传入（brotli 绑定无流式接口）
        out = brotliCompress(new Uint8Array(await file.arrayBuffer()), { quality: quality.value })
      } else if (format.value === 'zstd') {
        await ensureZstd()
        await yieldToPaint()
        out = zstdCompress(new Uint8Array(await file.arrayBuffer()), quality.value)
      } else {
        await yieldToPaint()
        out = await gzipStreaming(file, true,
          (p) => { streamProgress.value = p },
          () => abortFlag)
      }
    } else {
      if (format.value === 'brotli') {
        await ensureBrotli()
        await yieldToPaint()
        out = brotliDecompress(new Uint8Array(await file.arrayBuffer()))
      } else if (format.value === 'zstd') {
        await ensureZstd()
        await yieldToPaint()
        try {
          out = zstdDecompress(new Uint8Array(await file.arrayBuffer()))
        } catch (e) {
          // 帧内未嵌内容大小时 simple API 按 defaultHeapSize(1MB) 分配，放大重试一次
          out = zstdDecompress(new Uint8Array(await file.arrayBuffer()), { defaultHeapSize: 64 * 1024 * 1024 })
        }
      } else {
        await yieldToPaint()
        out = await gzipStreaming(file, false,
          (p) => { streamProgress.value = p },
          () => abortFlag)
      }
    }
    resultSize.value = out.byteLength
    resultName.value = buildResultName()
    const blob = new Blob([out], { type: 'application/octet-stream' })
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    if (e && e.message === 'ABORTED') {
      message.info(t('other.fileCompress.cancelled'))
    } else {
      message.error(mode.value === 'compress'
        ? t('other.fileCompress.compressFailed')
        : t('other.fileCompress.decompressFailed'))
    }
  } finally {
    processing.value = false
    streamProgress.value = 0
  }
}
</script>

<style scoped>
.file-compress {
  max-width: 1200px;
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

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

.option-slider {
  flex: 1;
  min-width: 160px;
}

.option-value {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress-area {
  margin-top: 4px;
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
