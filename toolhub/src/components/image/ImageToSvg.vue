<template>
  <div class="image-to-svg">
    <ToolIntro toolKey="trace" />

    <n-card :title="t('image.trace.title')" class="tool-card">
      <!-- 上传区 -->
      <div class="upload-zone" :class="{ 'has-file': previewUrl }">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input"
          @change="onFileChange"
        />
        <div v-if="!previewUrl" class="drop-hint" @click="fileInput?.click()">
          <div class="drop-icon">🖼️</div>
          <div class="drop-text">{{ t('image.trace.uploadHint') }}</div>
          <n-button tertiary size="small" @click.stop="fileInput?.click()">
            {{ t('image.trace.chooseBtn') }}
          </n-button>
        </div>
        <div v-else class="preview-wrap">
          <img :src="previewUrl" class="preview-img" alt="preview" />
          <n-button tertiary size="small" class="change-btn" @click="fileInput?.click()">
            {{ t('image.trace.changeBtn') }}
          </n-button>
        </div>
      </div>

      <div v-if="previewUrl" class="file-meta">{{ fileMetaText }}</div>

      <!-- 参数 -->
      <div v-if="previewUrl" class="params">
        <div class="param-row">
          <span class="param-label">{{ t('image.trace.threshold') }}</span>
          <n-slider v-model:value="threshold" :min="0" :max="255" :step="1" class="param-slider" />
          <span class="param-value">{{ threshold }}</span>
        </div>
        <div class="param-tip">{{ t('image.trace.thresholdTip') }}</div>

        <div class="param-row">
          <span class="param-label">{{ t('image.trace.maxWidth') }}</span>
          <n-select
            v-model:value="maxWidth"
            :options="maxWidthOptions"
            size="small"
            class="param-select"
          />
        </div>

        <div class="param-row">
          <span class="param-label">{{ t('image.trace.invert') }}</span>
          <n-switch v-model:value="invert" />
        </div>
        <div class="param-tip">{{ t('image.trace.invertTip') }}</div>
      </div>

      <!-- 操作 -->
      <div class="row actions">
        <n-button
          type="primary"
          :loading="converting"
          :disabled="!file || converting"
          @click="convert"
        >
          {{ converting ? t('image.trace.converting') : t('image.trace.convert') }}
        </n-button>
        <n-button v-if="svgText" tertiary @click="clearAll">
          {{ t('image.trace.clear') }}
        </n-button>
      </div>

      <!-- 错误 -->
      <n-alert v-if="errorMsg" type="warning" :show-icon="true" class="err-note">
        {{ errorMsg }}
      </n-alert>

      <!-- 结果 -->
      <div v-if="svgText" class="result-block">
        <div class="result-title">{{ t('image.trace.resultTitle') }}</div>

        <div class="compare">
          <div class="compare-cell">
            <div class="compare-head">{{ t('image.trace.originalLabel') }}</div>
            <div class="img-box">
              <img :src="previewUrl" alt="original" />
            </div>
          </div>
          <div class="compare-cell">
            <div class="compare-head">{{ t('image.trace.svgLabel') }}</div>
            <div class="img-box checker">
              <img :src="svgUrl" alt="svg result" />
            </div>
          </div>
        </div>

        <div class="stats">
          <span>{{ statsText }}</span>
        </div>

        <div class="row actions">
          <n-button tertiary size="small" @click="downloadSvg">
            {{ t('image.trace.download') }}
          </n-button>
          <n-button text size="tiny" @click="copy(svgText)">
            {{ copied ? t('image.trace.copied') : t('image.trace.copy') }}
          </n-button>
        </div>
      </div>
    </n-card>

    <div class="privacy-note">
      <span class="pin">🔒</span>
      <span>{{ t('image.trace.privacy') }}</span>
    </div>

    <TutorialAndDocs toolKey="trace" />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import ToolIntro from '@/components/common/ToolIntro.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const fileInput = ref(null)
const file = ref(null)
const previewUrl = ref('')
const svgText = ref('')
const svgUrl = ref('')
const threshold = ref(128)
const invert = ref(false)
const maxWidth = ref(1600)
const converting = ref(false)
const errorMsg = ref('')
const copied = ref(false)
const fileSize = ref(0)
const imgSize = ref({ w: 0, h: 0 })
const outSize = ref({ w: 0, h: 0 })
const elapsed = ref(0)

const maxWidthOptions = computed(() => [
  { label: t('image.trace.keepOriginal'), value: 0 },
  { label: '1600 px', value: 1600 },
  { label: '1000 px', value: 1000 },
  { label: '600 px', value: 600 }
])

const fileMetaText = computed(() => {
  const kb = fileSize.value ? (fileSize.value / 1024).toFixed(1) : '0'
  return `${file.value?.name || ''} · ${kb} KB · ${imgSize.value.w}×${imgSize.value.h}`
})

const statsText = computed(() => {
  const kb = svgText.value ? (new Blob([svgText.value]).size / 1024).toFixed(1) : '0'
  return t('image.trace.stats', {
    size: kb,
    time: elapsed.value,
    w: outSize.value.w,
    h: outSize.value.h
  })
})

function clearUrl(urlRef) {
  if (urlRef.value) URL.revokeObjectURL(urlRef.value)
}

function onFileChange(e) {
  const picked = e.target.files?.[0]
  if (!picked) return
  if (!picked.type.startsWith('image/')) {
    message.warning(t('image.trace.wrongType'))
    return
  }
  clearUrl(previewUrl)
  clearUrl(svgUrl)
  file.value = picked
  fileSize.value = picked.size
  previewUrl.value = URL.createObjectURL(picked)
  svgText.value = ''
  svgUrl.value = ''
  errorMsg.value = ''
  copied.value = false

  const img = new Image()
  img.onload = () => {
    imgSize.value = { w: img.naturalWidth, h: img.naturalHeight }
  }
  img.src = previewUrl.value
}

// 懒加载 potrace-wasm：该包内含内联 wasm（约 230KB），仅在首次转换时加载
let enginePromise = null
function ensureEngine() {
  if (!enginePromise) {
    enginePromise = import('potrace-wasm').then((mod) => {
      const api = mod.default || mod
      if (!api?.loadFromCanvas) throw new Error('potrace api missing')
      return api
    })
  }
  return enginePromise
}

// 按阈值二值化：potrace 以「黑色像素」为前景，故深色区域会被描摹为图形
function buildBinaryCanvas(img) {
  const scale =
    maxWidth.value && img.naturalWidth > maxWidth.value
      ? maxWidth.value / img.naturalWidth
      : 1
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  // 先铺白底，避免 PNG 透明区域被误判为黑色前景
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  const imageData = ctx.getImageData(0, 0, w, h)
  const px = imageData.data
  const th = threshold.value
  const inv = invert.value
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3] / 255
    const r = px[i] * a + 255 * (1 - a)
    const g = px[i + 1] * a + 255 * (1 - a)
    const b = px[i + 2] * a + 255 * (1 - a)
    let lum = 0.299 * r + 0.587 * g + 0.114 * b
    if (inv) lum = 255 - lum
    const v = lum < th ? 0 : 255
    px[i] = v
    px[i + 1] = v
    px[i + 2] = v
    px[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

async function convert() {
  if (!file.value) {
    message.warning(t('image.trace.pickFirst'))
    return
  }
  converting.value = true
  errorMsg.value = ''
  copied.value = false
  const t0 = performance.now()
  try {
    const img = await loadImage(previewUrl.value)
    const canvas = buildBinaryCanvas(img)
    outSize.value = { w: canvas.width, h: canvas.height }
    const api = await ensureEngine()
    const svg = await api.loadFromCanvas(canvas)
    if (typeof svg !== 'string' || svg.indexOf('<svg') < 0) {
      throw new Error('invalid svg output')
    }
    svgText.value = svg
    clearUrl(svgUrl)
    svgUrl.value = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    elapsed.value = Math.max(1, Math.round(performance.now() - t0))
  } catch (e) {
    errorMsg.value = t('image.trace.fail')
    svgText.value = ''
  } finally {
    converting.value = false
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image decode failed'))
    img.src = src
  })
}

function downloadSvg() {
  if (!svgText.value) return
  const base = (file.value?.name || 'image').replace(/\.[^.]+$/, '')
  const blob = new Blob([svgText.value], { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${base}.svg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    message.error(t('image.trace.copyFail'))
  }
}

function clearAll() {
  clearUrl(previewUrl)
  clearUrl(svgUrl)
  file.value = null
  previewUrl.value = ''
  svgText.value = ''
  svgUrl.value = ''
  errorMsg.value = ''
  copied.value = false
  if (fileInput.value) fileInput.value.value = ''
}

onBeforeUnmount(() => {
  clearUrl(previewUrl)
  clearUrl(svgUrl)
})
</script>

<style scoped>
.image-to-svg {
  max-width: 880px;
  margin: 0 auto;
}

.tool-card {
  margin-bottom: 16px;
}

.upload-zone {
  border: 1px dashed var(--n-border-color);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.file-input {
  display: none;
}

.drop-hint {
  cursor: pointer;
  padding: 12px 0;
}

.drop-icon {
  font-size: 32px;
  margin-bottom: 6px;
}

.drop-text {
  font-size: 13px;
  opacity: 0.75;
  margin-bottom: 10px;
}

.preview-wrap {
  position: relative;
  display: inline-block;
}

.preview-img {
  max-width: 100%;
  max-height: 240px;
  border-radius: 6px;
}

.change-btn {
  margin-top: 8px;
}

.file-meta {
  font-size: 12px;
  opacity: 0.7;
  margin: 8px 0 0;
  word-break: break-all;
}

.params {
  margin-top: 16px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.param-label {
  min-width: 110px;
  font-size: 13px;
}

.param-slider {
  flex: 1;
}

.param-value {
  width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.param-select {
  width: 140px;
}

.param-tip {
  font-size: 12px;
  opacity: 0.65;
  margin: 0 0 12px 122px;
}

.row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  margin-top: 14px;
}

.err-note {
  margin-top: 12px;
}

.result-block {
  margin-top: 20px;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.compare {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.compare-cell {
  flex: 1 1 260px;
}

.compare-head {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 6px;
}

.img-box {
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.img-box img {
  max-width: 100%;
  max-height: 220px;
}

.checker {
  background-image: linear-gradient(45deg, #d8d8d8 25%, transparent 25%),
    linear-gradient(-45deg, #d8d8d8 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d8d8d8 75%),
    linear-gradient(-45deg, transparent 75%, #d8d8d8 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}

.stats {
  font-size: 12px;
  opacity: 0.7;
  margin: 10px 0;
}

.privacy-note {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  opacity: 0.75;
  margin-bottom: 16px;
}

.pin {
  font-size: 14px;
}
</style>
