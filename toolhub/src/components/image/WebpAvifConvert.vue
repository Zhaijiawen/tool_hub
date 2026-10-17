<template>
  <div class="webp-avif-convert">
    <!-- 工具简介 -->
    <ToolIntro toolKey="webpAvifConvert" />

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
            <n-text depth="3">{{ t('image.webpAvifConvert.uploadHint') }}</n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('image.webpAvifConvert.uploadSubHint') }}</n-text>
          </div>
          <div v-else class="preview-container">
            <img :src="previewUrl" class="preview-image" :alt="fileName" />
            <div class="file-info">
              <n-text>{{ fileName }}</n-text>
              <n-text depth="3" style="font-size: 12px;">
                {{ fileSizeStr }}<template v-if="imageWidth"> · {{ imageWidth }} × {{ imageHeight }}</template>
              </n-text>
            </div>
          </div>
        </div>

        <!-- 参数 -->
        <div v-if="previewUrl" class="options">
          <div class="option-row">
            <span class="option-label">{{ t('image.webpAvifConvert.format') }}</span>
            <n-radio-group v-model:value="format" size="small" @update:value="onFormatChange">
              <n-radio-button value="webp">WebP</n-radio-button>
              <n-radio-button value="avif">AVIF</n-radio-button>
            </n-radio-group>
          </div>

          <div class="option-row">
            <span class="option-label">{{ t('image.webpAvifConvert.quality') }}</span>
            <n-slider
              v-model:value="activeQuality"
              :min="0"
              :max="100"
              :step="1"
              :marks="qualityMarks"
              :disabled="format === 'avif' && avifLossless"
              class="option-slider"
            />
            <n-text class="option-value">{{ activeQuality }}</n-text>
          </div>
          <n-text depth="3" style="font-size: 12px;">{{ t('image.webpAvifConvert.qualityHint') }}</n-text>

          <template v-if="format === 'avif'">
            <div class="option-row">
              <span class="option-label">{{ t('image.webpAvifConvert.speed') }}</span>
              <n-slider
                v-model:value="avifSpeed"
                :min="0"
                :max="10"
                :step="1"
                :marks="speedMarks"
                class="option-slider"
              />
              <n-text class="option-value">{{ avifSpeed }}</n-text>
            </div>
            <n-text depth="3" style="font-size: 12px;">{{ t('image.webpAvifConvert.speedHint') }}</n-text>
          </template>

          <div class="option-row option-switches">
            <n-switch v-if="format === 'webp'" v-model:value="webpLossless" size="small">
              <template #checked>{{ t('image.webpAvifConvert.lossless') }}</template>
              <template #unchecked>{{ t('image.webpAvifConvert.lossless') }}</template>
            </n-switch>
            <n-switch v-else v-model:value="avifLossless" size="small">
              <template #checked>{{ t('image.webpAvifConvert.lossless') }}</template>
              <template #unchecked>{{ t('image.webpAvifConvert.lossless') }}</template>
            </n-switch>
          </div>
          <n-text v-if="format === 'avif' && avifLossless" depth="3" style="font-size: 12px;">
            {{ t('image.webpAvifConvert.losslessAvifHint') }}
          </n-text>

          <n-text depth="3" style="font-size: 12px; display: block; margin-top: 4px;">
            {{ t('image.webpAvifConvert.firstDownloadHint') }}
          </n-text>
          <n-text depth="3" style="font-size: 12px; display: block;">
            {{ t('image.webpAvifConvert.largeImageHint') }}
          </n-text>
        </div>

        <!-- 操作行 -->
        <div v-if="previewUrl" class="action-row">
          <n-button @click="clearImage">{{ t('common.clear') }}</n-button>
          <n-button
            type="primary"
            :loading="processing"
            :disabled="processing || wasmLoading"
            @click="convert"
          >
            {{ processing ? t('image.webpAvifConvert.processing') : (wasmLoading ? t('image.webpAvifConvert.loadingWasm') : (resultSize ? t('image.webpAvifConvert.reconvert') : t('image.webpAvifConvert.convert'))) }}
          </n-button>
        </div>

        <!-- 结果 -->
        <div v-if="resultSize" class="result">
          <n-space align="center" :wrap="true">
            <n-tag :bordered="false" type="info">{{ t('image.webpAvifConvert.original') }}: {{ fileSizeStr }}</n-tag>
            <n-tag :bordered="false" type="success">
              {{ t('image.webpAvifConvert.result') }}: {{ resultSizeStr }} ({{ formatLabel }})
            </n-tag>
            <n-tag :bordered="false" :type="sizeDelta > 0 ? 'success' : (sizeDelta < 0 ? 'warning' : 'default')">
              {{ sizeDelta > 0 ? t('image.webpAvifConvert.saved') : (sizeDelta < 0 ? t('image.webpAvifConvert.enlarged') : '—') }}: {{ Math.abs(sizeDelta) }}%
            </n-tag>
            <n-tag :bordered="false" type="default">{{ t('image.webpAvifConvert.duration') }}: {{ encodeDuration }} ms</n-tag>
          </n-space>
          <div class="result-preview">
            <img :src="resultUrl" class="preview-image" :alt="formatLabel" />
          </div>
          <div style="margin-top: 12px;">
            <n-button tag="a" :href="resultUrl" :download="downloadName" type="primary" ghost>
              {{ t('image.webpAvifConvert.download') }}
            </n-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!previewUrl" class="empty-placeholder">
          <n-text depth="3">{{ t('image.webpAvifConvert.emptyTip') }}</n-text>
        </div>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="webpAvifConvert" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { simd } from 'wasm-feature-detect'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useWasmModule } from '@/composables/useWasmModule'
// jsSQuash webp/avif 编码器（本地 vendor glue，见 src/vendor/jsquash/）
import { createWebpEncoder, encodeWebp } from '@/vendor/jsquash/webp/index.js'
import { createAvifEncoder, encodeAvif } from '@/vendor/jsquash/avif/index.js'

const { t } = useI18n()
const message = useMessage()

const fileInputRef = ref(null)
const isDragging = ref(false)
const fileName = ref('')
const fileSize = ref(0)
const imageWidth = ref(0)
const imageHeight = ref(0)
const imageData = ref(null) // createImageBitmap → canvas 取得的 ImageData
const previewUrl = ref('')
const resultUrl = ref('')
const resultSize = ref(0)
const encodeDuration = ref(0)
const processing = ref(false)

const format = ref('webp') // 'webp' | 'avif'
const webpQuality = ref(75)
const avifQuality = ref(50)
const avifSpeed = ref(6)
const webpLossless = ref(false)
const avifLossless = ref(false)

// WASM 加载器：三个入口按运行时探测只触发其中一个
// - webp：simd() 为 true 下载 SIMD 版（~338KB），否则普通版（~275KB）
// - avif：仅 ST 版（~3.3MB），首次下载正好展示全局进度条
// compile:true → load() 返回 { buffer, module }，module 直接喂给 Emscripten glue
const webpSimdWasm = useWasmModule('webp-enc-simd', {
  url: '/wasm/webp_enc_simd.wasm',
  name: 'WebP encoder (SIMD)'
})
const webpWasm = useWasmModule('webp-enc', {
  url: '/wasm/webp_enc.wasm',
  name: 'WebP encoder'
})
const avifWasm = useWasmModule('avif-enc', {
  url: '/wasm/avif_enc.wasm',
  name: 'AVIF encoder'
})

// 编码器实例缓存（同一会话内重复转换不重复实例化）
const webpEncoder = ref(null)
const avifEncoder = ref(null)

const wasmLoading = computed(() => {
  const active = (s) => ['downloading', 'compiling'].includes(s.value)
  if (format.value === 'webp') return active(webpSimdWasm.status) || active(webpWasm.status)
  return active(avifWasm.status)
})

const qualityMarks = computed(() => ({ 0: '0', 50: '50', 100: '100' }))
const speedMarks = computed(() => ({ 0: '0', 5: '5', 10: '10' }))

const activeQuality = computed({
  get: () => (format.value === 'webp' ? webpQuality.value : avifQuality.value),
  set: (v) => {
    if (format.value === 'webp') webpQuality.value = v
    else avifQuality.value = v
  }
})

const formatLabel = computed(() => (format.value === 'webp' ? 'WebP' : 'AVIF'))

const fileSizeStr = computed(() => formatSize(fileSize.value))
const resultSizeStr = computed(() => formatSize(resultSize.value))

const sizeDelta = computed(() => {
  if (!resultSize.value || !fileSize.value) return 0
  return Math.round((1 - resultSize.value / fileSize.value) * 100) // >0 节省，<0 增大
})

const downloadName = computed(() => {
  const base = fileName.value.replace(/\.[^.]+$/, '') || 'image'
  return `${base}.${format.value}`
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

const onFormatChange = () => {
  // 结果属于旧格式，切换后作废，避免下载到错误格式的文件
  resetResult()
}

const loadFile = async (file) => {
  if (!file.type.startsWith('image/')) {
    message.warning(t('image.webpAvifConvert.invalidFileType'))
    return
  }
  try {
    // 浏览器原生解码（覆盖 JPG/PNG/WebP/GIF/BMP；现代浏览器亦可解 AVIF）
    const bitmap = await createImageBitmap(file)
    const w = bitmap.width
    const h = bitmap.height
    const canvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement('canvas'), { width: w, height: h })
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(bitmap, 0, 0)
    imageData.value = ctx.getImageData(0, 0, w, h)
    bitmap.close()

    fileName.value = file.name
    fileSize.value = file.size
    imageWidth.value = w
    imageHeight.value = h
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(file)
    resetResult()
  } catch (e) {
    console.error(e)
    message.error(t('image.webpAvifConvert.decodeFailed'))
  }
}

function resetResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultSize.value = 0
  encodeDuration.value = 0
}

async function convert() {
  if (!imageData.value) {
    message.warning(t('image.webpAvifConvert.noImage'))
    return
  }
  processing.value = true
  // 让 loading 态先渲染一帧，再进入同步的 WASM 计算（与 FileCompress 同款处理）
  await new Promise((resolve) => setTimeout(resolve, 0))
  const startedAt = performance.now()
  try {
    let out
    if (format.value === 'webp') {
      const useSimd = await simd()
      const loader = useSimd ? webpSimdWasm : webpWasm
      const { module } = await loader.load() // 命中缓存则瞬时返回
      if (!webpEncoder.value) {
        webpEncoder.value = await createWebpEncoder(module, useSimd)
      }
      out = await encodeWebp(webpEncoder.value, imageData.value, {
        quality: webpQuality.value,
        lossless: webpLossless.value ? 1 : 0
      })
    } else {
      const { module } = await avifWasm.load()
      if (!avifEncoder.value) {
        avifEncoder.value = await createAvifEncoder(module)
      }
      out = await encodeAvif(avifEncoder.value, imageData.value, {
        quality: avifQuality.value,
        speed: avifSpeed.value,
        lossless: avifLossless.value
      })
    }
    resultSize.value = out.byteLength
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = URL.createObjectURL(new Blob([out], { type: `image/${format.value}` }))
    encodeDuration.value = Math.round(performance.now() - startedAt)
  } catch (e) {
    if (e && e.name === 'AbortError') {
      // 用户取消下载：进度条已复位，不额外打扰
    } else {
      console.error(e)
      message.error(t('image.webpAvifConvert.encodeFailed'))
    }
  } finally {
    processing.value = false
  }
}

const clearImage = () => {
  fileName.value = ''
  fileSize.value = 0
  imageWidth.value = 0
  imageHeight.value = 0
  imageData.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  resetResult()
}
</script>

<style scoped>
.webp-avif-convert {
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
  gap: 8px;
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

.option-slider {
  flex: 1;
}

.option-value {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.option-switches {
  gap: 20px;
  margin-top: 4px;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.result {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}

.result-preview {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>
