<template>
  <div class="image-convert">
    <!-- 工具简介 -->
    <ToolIntro toolKey="image" />

    <n-card :title="t('image.convert.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 上传区域 -->
        <n-upload
          accept="image/*"
          :max="10"
          multiple
          :show-file-list="false"
          :custom-request="handleUpload"
        >
          <n-upload-dragger>
            <div class="upload-trigger">
              <n-icon size="48" :depth="3">
                <upload-outlined />
              </n-icon>
              <n-text style="margin-top: 8px">{{ t('image.convert.upload') }}</n-text>
              <n-text depth="3" style="margin-top: 4px; font-size: 13px">{{ t('image.convert.uploadHint') }}</n-text>
            </div>
          </n-upload-dragger>
        </n-upload>

        <!-- 全局参数 -->
        <div v-if="imageList.length > 0" class="global-settings">
          <!-- 格式 & 质量 -->
          <n-grid :cols="2" :x-gap="24" responsive="screen">
            <n-gi>
              <n-form-item :label="t('image.convert.format')">
                <n-select v-model:value="globalFormat" :options="formatOptions" @update:value="reconvertAll" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="`${t('image.convert.quality')}: ${globalQuality}%`">
                <n-slider v-model:value="globalQuality" :min="10" :max="100" :step="5"
                  :disabled="isLossless" @update:value="reconvertAll" />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-text v-if="isLossless" depth="3" style="display: block; margin-top: -12px; margin-bottom: 12px; font-size: 13px">
            {{ t('image.convert.losslessNotice') }}
          </n-text>

          <!-- 尺寸调整 -->
          <n-divider style="margin: 4px 0 16px">{{ t('image.convert.resizeTitle') }}</n-divider>
          <n-grid :cols="3" :x-gap="16" responsive="screen">
            <!-- 缩放模式 -->
            <n-gi>
              <n-form-item :label="t('image.convert.resizeMode')">
                <n-radio-group v-model:value="resizeMode" @update:value="onResizeModeChange">
                  <n-radio value="none">{{ t('image.convert.resizeModeNone') }}</n-radio>
                  <n-radio value="pixel">{{ t('image.convert.resizeModePixel') }}</n-radio>
                  <n-radio value="percent">{{ t('image.convert.resizeModePercent') }}</n-radio>
                </n-radio-group>
              </n-form-item>
            </n-gi>
            <!-- 宽高输入 -->
            <n-gi v-if="resizeMode !== 'none'">
              <n-form-item :label="t('image.convert.resizeWidth')">
                <n-input-number
                  v-model:value="resizeWidth"
                  :min="1"
                  :max="resizeMode === 'pixel' ? 16384 : 500"
                  :precision="0"
                  :suffix="resizeMode === 'pixel' ? t('image.convert.resizePixelUnit') : t('image.convert.resizePercentUnit')"
                  style="width: 100%"
                  @update:value="onWidthChange"
                />
              </n-form-item>
            </n-gi>
            <n-gi v-if="resizeMode !== 'none'">
              <n-form-item :label="t('image.convert.resizeHeight')">
                <n-input-number
                  v-model:value="resizeHeight"
                  :min="1"
                  :max="resizeMode === 'pixel' ? 16384 : 500"
                  :precision="0"
                  :suffix="resizeMode === 'pixel' ? t('image.convert.resizePixelUnit') : t('image.convert.resizePercentUnit')"
                  style="width: 100%"
                  @update:value="onHeightChange"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
          <!-- 锁定宽高比 + 尺寸预览 -->
          <n-space v-if="resizeMode !== 'none'" align="center" style="margin-top: -8px; margin-bottom: 8px; flex-wrap: wrap; gap: 12px;">
            <n-checkbox v-model:checked="resizeLockRatio">{{ t('image.convert.resizeLockRatio') }}</n-checkbox>
            <n-text v-if="resizePreviewText" depth="3" style="font-size: 12px">{{ resizePreviewText }}</n-text>
            <n-button size="small" type="primary" ghost @click="reconvertAll">
              {{ t('image.convert.convert') }}
            </n-button>
          </n-space>
        </div>

        <!-- 批量操作 -->
        <div v-if="imageList.length > 0" class="batch-actions">
          <n-space>
            <n-button type="primary" @click="downloadAll" :disabled="!hasConverted">
              {{ t('image.convert.downloadAll') }}
            </n-button>
            <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
          </n-space>
        </div>

        <!-- 图片列表 -->
        <div v-if="imageList.length > 0" class="image-list">
          <div v-for="(item, index) in imageList" :key="index" class="image-item">
            <div class="preview-row">
              <!-- 原图 -->
              <div class="preview-col">
                <n-text class="preview-label">{{ t('image.convert.original') }}</n-text>
                <img :src="item.originalUrl" class="preview-img" :alt="item.name" />
                <div class="meta-row">
                  <n-text depth="3" class="size-text">{{ formatSize(item.originalSize) }}</n-text>
                  <n-tag size="small" type="default">{{ item.originalFormat }}</n-tag>
                  <n-text v-if="item.originalWidth" depth="3" class="size-text">
                    {{ item.originalWidth }}×{{ item.originalHeight }}
                  </n-text>
                </div>
              </div>

              <div class="arrow-col">→</div>

              <!-- 转换后 -->
              <div class="preview-col">
                <n-text class="preview-label">{{ t('image.convert.converted') }}</n-text>
                <n-spin :show="item.converting">
                  <img v-if="item.convertedUrl" :src="item.convertedUrl" class="preview-img" :alt="item.name" />
                  <div v-else class="preview-placeholder">{{ t('image.convert.processing') }}</div>
                </n-spin>
                <div v-if="item.convertedSize" class="meta-row">
                  <n-text depth="3" class="size-text">{{ formatSize(item.convertedSize) }}</n-text>
                  <n-tag :type="getSavingType(item)" size="small">
                    {{ getSavingLabel(item) }}
                  </n-tag>
                  <n-text v-if="item.convertedWidth" depth="3" class="size-text">
                    {{ item.convertedWidth }}×{{ item.convertedHeight }}
                  </n-text>
                </div>
              </div>
            </div>

            <!-- 文件操作行 -->
            <div class="item-actions">
              <n-text class="file-name">{{ item.name }}</n-text>
              <n-button size="small" type="primary" :disabled="!item.convertedUrl" @click="downloadItem(item)">
                {{ t('common.download') }}
              </n-button>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="globalError" type="error" :title="t('common.error')">{{ globalError }}</n-alert>

        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('image.convert.infoTitle')">
            <div>{{ t('image.convert.infoContent') }}</div>
          </n-alert>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="image" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

// ── 全局参数（格式 & 质量） ────────────────────
const globalFormat = ref('image/jpeg')
const globalQuality = ref(80)
const globalError = ref('')

const formatOptions = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG',  value: 'image/png'  },
  { label: 'WebP', value: 'image/webp' },
  { label: 'GIF',  value: 'image/gif'  }
]

const isLossless = computed(() =>
  globalFormat.value === 'image/png' || globalFormat.value === 'image/gif'
)

// ── 尺寸调整参数 ─────────────────────────────
// mode: 'none' | 'pixel' | 'percent'
const resizeMode    = ref('none')
const resizeWidth   = ref(100)
const resizeHeight  = ref(100)
const resizeLockRatio = ref(true)

// 用于计算锁定比例时的参考：取列表第一张图片的原始尺寸
const firstItemRatio = computed(() => {
  const first = imageList.value[0]
  if (first && first.originalWidth && first.originalHeight) {
    return first.originalWidth / first.originalHeight
  }
  return 1
})

// 预览文字：展示目标尺寸（仅 pixel 模式且第一张图已加载时可算出精确值）
const resizePreviewText = computed(() => {
  if (resizeMode.value === 'none') return ''
  const first = imageList.value[0]
  if (!first || !first.originalWidth) return ''
  const { w, h } = calcTargetSize(first.originalWidth, first.originalHeight)
  return `${t('image.convert.resizeOriginalSize')}: ${first.originalWidth}×${first.originalHeight}  →  ${t('image.convert.resizeTargetSize')}: ${w}×${h}`
})

// 计算某张图的目标尺寸
const calcTargetSize = (origW, origH) => {
  if (resizeMode.value === 'none') return { w: origW, h: origH }
  if (resizeMode.value === 'percent') {
    const wp = Math.max(1, resizeWidth.value)
    const hp = Math.max(1, resizeHeight.value)
    return {
      w: Math.round(origW * wp / 100),
      h: Math.round(origH * hp / 100)
    }
  }
  // pixel 模式
  return {
    w: Math.max(1, resizeWidth.value),
    h: Math.max(1, resizeHeight.value)
  }
}

// 切换缩放模式时重置为合理默认值
const onResizeModeChange = (val) => {
  if (val === 'percent') {
    resizeWidth.value  = 100
    resizeHeight.value = 100
  } else if (val === 'pixel') {
    const first = imageList.value[0]
    if (first && first.originalWidth) {
      resizeWidth.value  = first.originalWidth
      resizeHeight.value = first.originalHeight
    } else {
      resizeWidth.value  = 800
      resizeHeight.value = 600
    }
  }
}

// 宽度变化时，若锁定比例则联动高度
const onWidthChange = (val) => {
  if (!resizeLockRatio.value || !val) return
  if (resizeMode.value === 'pixel') {
    resizeHeight.value = Math.round(val / firstItemRatio.value)
  } else {
    resizeHeight.value = val
  }
}

// 高度变化时，若锁定比例则联动宽度
const onHeightChange = (val) => {
  if (!resizeLockRatio.value || !val) return
  if (resizeMode.value === 'pixel') {
    resizeWidth.value = Math.round(val * firstItemRatio.value)
  } else {
    resizeWidth.value = val
  }
}

// ── 图片列表 ────────────────────────────────
const imageList = ref([])

const hasConverted = computed(() => imageList.value.some(i => i.convertedUrl))

// ── 工具函数 ────────────────────────────────
const formatSize = (bytes) => {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const getSavingPercent = (item) => {
  if (!item.convertedSize || !item.originalSize) return 0
  return Math.round((1 - item.convertedSize / item.originalSize) * 100)
}

const getSavingLabel = (item) => {
  const pct = getSavingPercent(item)
  if (pct > 0) return `-${pct}%`
  if (pct < 0) return `+${Math.abs(pct)}%`
  return '0%'
}

const getSavingType = (item) => {
  const pct = getSavingPercent(item)
  if (pct > 20) return 'success'
  if (pct > 0)  return 'info'
  return 'warning'
}

const getOutputExt = () => {
  const map = {
    'image/jpeg': 'jpg',
    'image/png':  'png',
    'image/webp': 'webp',
    'image/gif':  'gif'
  }
  return map[globalFormat.value] || 'jpg'
}

// 生成下载文件名后缀（尺寸缩放信息）
const getResizeSuffix = (origW, origH) => {
  if (resizeMode.value === 'none') return ''
  const { w, h } = calcTargetSize(origW, origH)
  return `_${w}x${h}`
}

// ── 核心转换逻辑（Canvas） ──────────────────
const convertBlob = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const { w, h } = calcTargetSize(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        // PNG/GIF 保留透明背景，JPEG 填白
        if (globalFormat.value === 'image/jpeg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, w, h)
        }
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve({ blob, width: w, height: h, origWidth: img.width, origHeight: img.height })
            else reject(new Error('Canvas toBlob failed'))
          },
          globalFormat.value,
          isLossless.value ? undefined : globalQuality.value / 100
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('FileReader failed'))
    reader.readAsDataURL(file)
  })
}

// ── 上传处理 ────────────────────────────────
const handleUpload = async ({ file }) => {
  const f = file.file
  if (!f) return

  if (imageList.value.length >= 10) {
    message.warning(t('image.convert.maxFiles'))
    return
  }

  const originalUrl = URL.createObjectURL(f)
  const item = reactive({
    name: f.name,
    originalFile: f,
    originalUrl,
    originalSize: f.size,
    originalFormat: f.type.split('/')[1]?.toUpperCase() || '?',
    originalWidth: null,
    originalHeight: null,
    convertedUrl: null,
    convertedSize: null,
    convertedBlob: null,
    convertedWidth: null,
    convertedHeight: null,
    converting: true
  })
  imageList.value.push(item)

  try {
    const result = await convertBlob(f)
    item.originalWidth   = result.origWidth
    item.originalHeight  = result.origHeight
    item.convertedUrl    = URL.createObjectURL(result.blob)
    item.convertedSize   = result.blob.size
    item.convertedBlob   = result.blob
    item.convertedWidth  = result.width
    item.convertedHeight = result.height
  } catch (e) {
    globalError.value = e.message
    message.error(e.message)
  } finally {
    item.converting = false
  }
}

// ── 全局参数变更后重新转换所有 ───────────────
const reconvertAll = async () => {
  for (const item of imageList.value) {
    if (!item.originalFile) continue
    item.converting     = true
    item.convertedUrl   = null
    item.convertedSize  = null
    item.convertedWidth = null
    item.convertedHeight = null
    try {
      const result = await convertBlob(item.originalFile)
      item.originalWidth   = result.origWidth
      item.originalHeight  = result.origHeight
      item.convertedUrl    = URL.createObjectURL(result.blob)
      item.convertedSize   = result.blob.size
      item.convertedBlob   = result.blob
      item.convertedWidth  = result.width
      item.convertedHeight = result.height
    } catch { /* ignore single item error */ }
    finally { item.converting = false }
  }
}

// ── 下载 ────────────────────────────────────
const downloadItem = (item) => {
  if (!item.convertedUrl) return
  const baseName = item.name.replace(/\.[^.]+$/, '')
  const suffix   = getResizeSuffix(item.originalWidth || 0, item.originalHeight || 0)
  const a = document.createElement('a')
  a.href = item.convertedUrl
  a.download = `${baseName}${suffix}.${getOutputExt()}`
  a.click()
}

const downloadAll = () => {
  imageList.value.filter(i => i.convertedUrl).forEach(item => downloadItem(item))
}

// ── 清空 ────────────────────────────────────
const clearAll = () => {
  imageList.value.forEach(item => {
    if (item.originalUrl)  URL.revokeObjectURL(item.originalUrl)
    if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl)
  })
  imageList.value = []
  globalError.value = ''
}
</script>

<style scoped>
.image-convert {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
}

.global-settings {
  padding: 16px;
  background: var(--code-color, #f8f8f8);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e0e0e0);
}

.batch-actions {
  display: flex;
  align-items: center;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-item {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 16px;
}

.preview-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.preview-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.arrow-col {
  font-size: 24px;
  color: var(--text-color-3, #999);
  flex-shrink: 0;
}

.preview-label {
  font-size: 13px;
  font-weight: 500;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid var(--border-color, #e0e0e0);
}

.preview-placeholder {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color-secondary, #f5f5f5);
  border-radius: 4px;
  color: var(--text-color-3, #999);
  font-size: 13px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.size-text {
  font-size: 12px;
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.file-name {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
}

.info-section {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .image-convert {
    padding: 0 12px;
  }
  .preview-row {
    flex-direction: column;
  }
  .arrow-col {
    transform: rotate(90deg);
  }
}
</style>
