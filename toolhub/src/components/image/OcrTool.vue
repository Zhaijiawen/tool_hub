<template>
  <div class="ocr-tool">
    <!-- 工具简介 -->
    <ToolIntro toolKey="ocr" />

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
          <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="onFileChange" />
          <div v-if="!previewUrl" class="upload-hint">
            <n-icon size="40" :depth="3">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
            </n-icon>
            <n-text depth="3">{{ t('image.ocr.uploadHint') }}</n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('image.ocr.uploadSubHint') }}</n-text>
          </div>
          <div v-else class="preview-container">
            <img :src="previewUrl" class="preview-image" :alt="fileName" />
            <div class="file-info">
              <n-text>{{ fileName }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ fileSizeStr }}</n-text>
            </div>
          </div>
        </div>

        <!-- 参数 -->
        <div v-if="previewUrl" class="options">
          <div class="option-row">
            <span class="option-label">{{ t('image.ocr.langLabel') }}</span>
            <n-select
              v-model:value="selectedLangs"
              multiple
              filterable
              :options="langOptions"
              :placeholder="t('image.ocr.langPlaceholder')"
              style="flex: 1; max-width: 480px;"
              size="small"
            />
          </div>
          <n-text depth="3" style="font-size: 12px;">{{ t('image.ocr.langHint') }}</n-text>
          <div class="option-row" style="margin-top: 8px;">
            <span class="option-label">{{ t('image.ocr.psmLabel') }}</span>
            <n-select
              v-model:value="psm"
              :options="psmOptions"
              style="max-width: 280px;"
              size="small"
            />
          </div>
          <n-text depth="3" style="font-size: 12px;">{{ t('image.ocr.firstDownloadHint') }}</n-text>
        </div>

        <!-- 操作行 -->
        <div v-if="previewUrl" class="action-row">
          <n-button @click="clearImage">{{ t('common.clear') }}</n-button>
          <n-button
            type="primary"
            :loading="processing"
            :disabled="processing || !selectedLangs.length"
            @click="recognize"
          >
            {{ processing ? t(phaseTextKey) : (resultText ? t('image.ocr.reRecognize') : t('image.ocr.recognize')) }}
          </n-button>
        </div>

        <!-- 进度 -->
        <div v-if="processing" class="progress-area">
          <n-progress
            type="line"
            :percentage="overallPercent"
            :show-percentage="true"
            :height="8"
            indicator-placement="inside"
            processing
          />
          <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
            {{ t(phaseTextKey) }} · {{ overallPercent }}%
          </n-text>
        </div>

        <!-- 结果 -->
        <div v-if="resultText" class="result">
          <n-space align="center" :wrap="true" style="margin-bottom: 8px;">
            <n-tag :bordered="false" type="info">{{ t('image.ocr.chars') }}: {{ resultText.length }}</n-tag>
            <n-tag v-if="confidence !== null" :bordered="false" :type="confidence >= 80 ? 'success' : (confidence >= 60 ? 'warning' : 'error')">
              {{ t('image.ocr.confidence') }}: {{ confidence }}%
            </n-tag>
            <n-tag :bordered="false">{{ t('image.ocr.elapsed') }}: {{ elapsedStr }}</n-tag>
          </n-space>
          <n-input
            v-model:value="resultText"
            type="textarea"
            :placeholder="t('image.ocr.resultPlaceholder')"
            :autosize="{ minRows: 6, maxRows: 18 }"
          />
          <n-space style="margin-top: 12px;">
            <n-button @click="copyResult">{{ t('image.ocr.copy') }}</n-button>
            <n-button tag="a" :href="resultUrl" :download="downloadName" type="primary" ghost>
              {{ t('image.ocr.download') }}
            </n-button>
          </n-space>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!previewUrl" class="empty-placeholder">
          <n-text depth="3">{{ t('image.ocr.emptyTip') }}</n-text>
        </div>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="ocr" />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useWasmModule } from '@/composables/useWasmModule'
import { TesseractEngine, OCR_LANGS, OCR_PSM_OPTIONS, detectTesseractVariant } from '@/composables/useTesseract'

const { t } = useI18n()
const message = useMessage()

const fileInputRef = ref(null)
const isDragging = ref(false)
const fileName = ref('')
const fileSize = ref(0)
const fileBuffer = ref(null) // 原始图片 ArrayBuffer
const previewUrl = ref('')

const selectedLangs = ref(['eng'])
const psm = ref('3')

// 处理阶段：idle | preparing(下载引擎/语言包) | initializing | recognizing | done | error
const phase = ref('idle')
const engineProgress = ref(0) // worker 回报的当前阶段进度 0-1
const resultText = ref('')
const confidence = ref(null)
const elapsedMs = ref(0)
const resultUrl = ref('')
const downloadName = ref('ocr-result.txt')
const startTime = ref(0)

const processing = computed(() => ['preparing', 'initializing', 'recognizing'].includes(phase.value))

const phaseTextKey = computed(() => {
  switch (phase.value) {
    case 'preparing': return 'image.ocr.phasePreparing'
    case 'initializing': return 'image.ocr.phaseInitializing'
    case 'recognizing': return 'image.ocr.phaseRecognizing'
    default: return 'image.ocr.processing'
  }
})

// 分阶段映射到总体进度带：下载 0-50，初始化 50-85，识别 85-100
const overallPercent = computed(() => {
  if (phase.value === 'preparing') return Math.round(engineProgress.value * 50)
  if (phase.value === 'initializing') return Math.round(50 + engineProgress.value * 35)
  if (phase.value === 'recognizing') return Math.round(85 + engineProgress.value * 15)
  return 0
})

const langOptions = computed(() => OCR_LANGS.map((l) => ({
  label: `${langLabel(l.code)} · ${formatSize(l.size)}`,
  value: l.code,
})))

const psmOptions = computed(() => OCR_PSM_OPTIONS.map((p) => ({
  label: t(`image.ocr.psm.${p.key}`),
  value: p.value,
})))

function langLabel(code) {
  // langOptions 的 code 均来自 OCR_LANGS，必有对应翻译
  return t(`image.ocr.langs.${code}`)
}

const fileSizeStr = computed(() => formatSize(fileSize.value))
const elapsedStr = computed(() => {
  const s = Math.round(elapsedMs.value / 100) / 10
  return `${s}s`
})

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
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

const isImage = (file) => file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|tiff?)$/i.test(file.name)

const loadFile = async (file) => {
  if (!isImage(file)) {
    message.warning(t('image.ocr.invalidFileType'))
    return
  }
  fileName.value = file.name
  fileSize.value = file.size
  fileBuffer.value = await file.arrayBuffer()
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  resetResult()
}

function resetResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultText.value = ''
  confidence.value = null
  elapsedMs.value = 0
  resultUrl.value = ''
  phase.value = 'idle'
}

const clearImage = () => {
  fileName.value = ''
  fileSize.value = 0
  fileBuffer.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  resetResult()
}

// ---- WASM 资源加载（core + 语言包，均走 useWasmModule：进度/取消/缓存）----
let coreLoader = null
const langLoaders = new Map()

function getCoreLoader(variant) {
  if (!coreLoader) {
    coreLoader = useWasmModule('tesseract-core', {
      url: `/wasm/tesseract-core-${variant}.wasm`,
      name: 'Tesseract Core',
      compile: false, // Emscripten 胶水以 wasmBinary 自行实例化
    })
  }
  return coreLoader
}

function getLangLoader(code) {
  if (!langLoaders.has(code)) {
    langLoaders.set(code, useWasmModule(`tesseract-lang-${code}`, {
      url: `/lang/${code}.traineddata.gz`,
      name: `Tesseract ${code}`,
      compile: false,
    }))
  }
  return langLoaders.get(code)
}

// ---- 识别流程 ----
let engine = null

async function recognize() {
  if (!fileBuffer.value) {
    message.warning(t('image.ocr.noImage'))
    return
  }
  if (!selectedLangs.value.length) {
    message.warning(t('image.ocr.needLang'))
    return
  }
  phase.value = 'preparing'
  engineProgress.value = 0
  resultText.value = ''
  confidence.value = null
  startTime.value = performance.now()
  try {
    // 1. 探测变体 + 下载 core wasm 与所选语言包（进度条/取消由全局 WasmDownloadBar 提供）
    const variant = await detectTesseractVariant()
    const core = getCoreLoader(variant)
    const { buffer: wasmBuffer } = await core.load()
    engineProgress.value = 0.3

    const langData = []
    for (const code of selectedLangs.value) {
      const { buffer } = await getLangLoader(code).load()
      langData.push({ code, data: buffer })
      engineProgress.value += 0.7 / selectedLangs.value.length
    }

    // 2. worker init 握手（注入胶水工厂 + wasm 字节）
    phase.value = 'initializing'
    engineProgress.value = 0
    if (!engine) engine = new TesseractEngine()
    engine.onProgress = ({ status, progress }) => {
      if (status === 'loading tesseract core' || status === 'initializing tesseract' || status === 'loading language traineddata') {
        if (phase.value === 'initializing') engineProgress.value = progress
      } else if (status === 'recognizing text') {
        phase.value = 'recognizing'
        engineProgress.value = progress
      }
    }
    await engine.ensureReady({ glue: variant, wasm: wasmBuffer })

    // 3. 识别
    phase.value = 'recognizing'
    engineProgress.value = 0
    const data = await engine.recognize(
      fileBuffer.value,
      selectedLangs.value,
      langData,
      psm.value,
    )
    elapsedMs.value = performance.now() - startTime.value
    resultText.value = (data && data.text ? data.text : '').trim()
    confidence.value = data && typeof data.confidence === 'number' ? Math.round(data.confidence) : null
    downloadName.value = (fileName.value.replace(/\.[^.]+$/, '') || 'ocr') + '.txt'
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(new Blob([resultText.value], { type: 'text/plain;charset=utf-8' }))
    phase.value = 'done'
    if (!resultText.value) message.info(t('image.ocr.noTextFound'))
  } catch (e) {
    phase.value = 'error'
    // init 失败后 engine 的 _initPromise 已定型，必须销毁以便下次重建
    if (engine) {
      engine.terminate()
      engine = null
    }
    const msg = String(e && e.message ? e.message : e)
    message.error(`${t('image.ocr.failed')}: ${msg}`)
  }
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(resultText.value)
    message.success(t('image.ocr.copied'))
  } catch {
    message.warning(t('image.ocr.copyFailed'))
  }
}

onUnmounted(() => {
  if (engine) {
    engine.terminate()
    engine = null
  }
})
</script>

<style scoped>
.ocr-tool {
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
  flex-direction: column;
  align-items: center;
  gap: 12px;
  pointer-events: none;
}

.preview-image {
  max-height: 220px;
  max-width: 100%;
  border-radius: 8px;
  object-fit: contain;
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
  gap: 4px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
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

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>
