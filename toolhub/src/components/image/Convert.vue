<template>
  <div class="image-convert">
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
          <n-text v-if="isLossless" depth="3" style="display: block; margin-top: -12px; margin-bottom: 8px; font-size: 13px">
            {{ t('image.convert.losslessNotice') }}
          </n-text>
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

const { t } = useI18n()
const message = useMessage()

// ── 全局参数 ────────────────────────────────
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

// ── 核心转换逻辑（Canvas） ──────────────────
const convertBlob = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width  = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        // PNG/GIF 保留透明背景，其余填白（JPEG 不支持透明）
        if (globalFormat.value === 'image/jpeg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
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
    convertedUrl: null,
    convertedSize: null,
    convertedBlob: null,
    converting: true
  })
  imageList.value.push(item)

  try {
    const blob = await convertBlob(f)
    item.convertedUrl  = URL.createObjectURL(blob)
    item.convertedSize = blob.size
    item.convertedBlob = blob
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
    item.converting    = true
    item.convertedUrl  = null
    item.convertedSize = null
    try {
      const blob = await convertBlob(item.originalFile)
      item.convertedUrl  = URL.createObjectURL(blob)
      item.convertedSize = blob.size
      item.convertedBlob = blob
    } catch { /* ignore single item error */ }
    finally { item.converting = false }
  }
}

// ── 下载 ────────────────────────────────────
const downloadItem = (item) => {
  if (!item.convertedUrl) return
  const baseName = item.name.replace(/\.[^.]+$/, '')
  const a = document.createElement('a')
  a.href = item.convertedUrl
  a.download = `${baseName}.${getOutputExt()}`
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