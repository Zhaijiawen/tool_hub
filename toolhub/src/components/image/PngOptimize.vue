<template>
  <div class="png-optimize">
    <!-- 工具简介 -->
    <ToolIntro toolKey="pngOptimize" />

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
          <input ref="fileInputRef" type="file" accept="image/png" style="display:none" @change="onFileChange" />
          <div v-if="!previewUrl" class="upload-hint">
            <n-icon size="40" :depth="3">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
            </n-icon>
            <n-text depth="3">{{ t('image.pngOptimize.uploadHint') }}</n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('image.pngOptimize.uploadSubHint') }}</n-text>
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
            <span class="option-label">{{ t('image.pngOptimize.level') }}</span>
            <n-slider
              v-model:value="level"
              :min="1"
              :max="6"
              :step="1"
              :marks="levelMarks"
              class="option-slider"
            />
            <n-text class="option-value">{{ level }}</n-text>
          </div>
          <n-text depth="3" style="font-size: 12px;">{{ t('image.pngOptimize.levelHint') }}</n-text>
          <div class="option-row option-switches">
            <n-switch v-model:value="interlace" size="small">
              <template #checked>{{ t('image.pngOptimize.interlace') }}</template>
              <template #unchecked>{{ t('image.pngOptimize.interlace') }}</template>
            </n-switch>
            <n-switch v-model:value="optimiseAlpha" size="small">
              <template #checked>{{ t('image.pngOptimize.optimiseAlpha') }}</template>
              <template #unchecked>{{ t('image.pngOptimize.optimiseAlpha') }}</template>
            </n-switch>
          </div>
        </div>

        <!-- 操作行 -->
        <div v-if="previewUrl" class="action-row">
          <n-button @click="clearImage">{{ t('common.clear') }}</n-button>
          <n-button
            type="primary"
            :loading="processing"
            :disabled="processing || wasmLoading"
            @click="optimize"
          >
            {{ processing ? t('image.pngOptimize.processing') : (wasmLoading ? t('image.pngOptimize.loadingWasm') : (optimizedSize ? t('image.pngOptimize.reoptimize') : t('image.pngOptimize.optimize'))) }}
          </n-button>
        </div>

        <!-- 结果 -->
        <div v-if="optimizedSize" class="result">
          <n-space align="center" :wrap="true">
            <n-tag :bordered="false" type="info">{{ t('image.pngOptimize.original') }}: {{ fileSizeStr }}</n-tag>
            <n-tag :bordered="false" type="success">{{ t('image.pngOptimize.optimized') }}: {{ optimizedSizeStr }}</n-tag>
            <n-tag :bordered="false" :type="savedPercent > 0 ? 'success' : 'default'">
              {{ t('image.pngOptimize.saved') }}: {{ savedPercent > 0 ? savedPercent + '%' : '0%' }}
            </n-tag>
          </n-space>
          <n-text v-if="savedPercent <= 0" depth="3" style="font-size:12px; display:block; margin-top:8px;">
            {{ t('image.pngOptimize.noGain') }}
          </n-text>
          <div style="margin-top: 12px;">
            <n-button tag="a" :href="optimizedUrl" :download="downloadName" type="primary" ghost>
              {{ t('image.pngOptimize.download') }}
            </n-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!previewUrl" class="empty-placeholder">
          <n-text depth="3">{{ t('image.pngOptimize.emptyTip') }}</n-text>
        </div>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="pngOptimize" />
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
// jsSquash Oxipng：默认导出 optimise，命名导出 init（可喂入我们下载+缓存的 wasm 字节）
import optimise, { init } from '@jsquash/oxipng/optimise'

const { t } = useI18n()
const message = useMessage()

const fileInputRef = ref(null)
const isDragging = ref(false)
const fileName = ref('')
const fileSize = ref(0)
const fileBuffer = ref(null) // 原始 PNG 的 ArrayBuffer
const previewUrl = ref('')
const optimizedUrl = ref('')
const optimizedSize = ref(0)
const processing = ref(false)

const level = ref(3)
const interlace = ref(false)
const optimiseAlpha = ref(true)

// WASM 加载器：下载 /wasm/squoosh_oxipng_bg.wasm（带进度、可取消、命中缓存秒开），
// 再把字节喂给 jsSquash 的 init()（主线程 → 单线程 glue，安全匹配）
const wasm = useWasmModule('oxipng', {
  url: '/wasm/squoosh_oxipng_bg.wasm',
  name: 'Oxipng',
  compile: false // 由 jsSquash 自行编译实例化
})

const wasmLoading = computed(() => ['downloading', 'compiling'].includes(wasm.status.value))

const levelMarks = computed(() => ({ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' }))

const fileSizeStr = computed(() => formatSize(fileSize.value))
const optimizedSizeStr = computed(() => formatSize(optimizedSize.value))
const savedPercent = computed(() => {
  if (!optimizedSize.value || !fileSize.value) return 0
  return Math.max(0, Math.round((1 - optimizedSize.value / fileSize.value) * 100))
})
const downloadName = computed(() => fileName.value.replace(/\.png$/i, '') + '.optimized.png')

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

const isPng = (file) => file.type === 'image/png' || /\.png$/i.test(file.name)

const loadFile = async (file) => {
  if (!isPng(file)) {
    message.warning(t('image.pngOptimize.invalidFileType'))
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
  if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
  optimizedUrl.value = ''
  optimizedSize.value = 0
}

async function ensureWasm() {
  const { buffer } = await wasm.load() // 命中缓存则瞬时返回
  await init(buffer) // 用我们下载+缓存的字节初始化（重复调用为 no-op）
}

async function optimize() {
  if (!fileBuffer.value) {
    message.warning(t('image.pngOptimize.noImage'))
    return
  }
  processing.value = true
  try {
    await ensureWasm()
    const out = await optimise(fileBuffer.value, {
      level: level.value,
      interlace: interlace.value,
      optimiseAlpha: optimiseAlpha.value
    })
    optimizedSize.value = out.byteLength
    const blob = new Blob([out], { type: 'image/png' })
    if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
    optimizedUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    message.error(t('common.error'))
  } finally {
    processing.value = false
  }
}

const clearImage = () => {
  fileName.value = ''
  fileSize.value = 0
  fileBuffer.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  resetResult()
}
</script>

<style scoped>
.png-optimize {
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

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>
