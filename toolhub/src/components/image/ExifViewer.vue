<template>
  <div class="exif-viewer">
    <n-card :title="t('image.exif.title')" :bordered="false">
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
          <div v-if="!imagePreview" class="upload-hint">
            <n-icon size="40" :depth="3">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,20.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
            </n-icon>
            <n-text depth="3">{{ t('image.exif.uploadHint') }}</n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('image.exif.uploadSubHint') }}</n-text>
          </div>
          <div v-else class="preview-container">
            <img :src="imagePreview" class="preview-image" :alt="fileName" />
            <div class="file-info">
              <n-text>{{ fileName }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ fileSizeStr }}</n-text>
            </div>
          </div>
        </div>

        <!-- 操作行 -->
        <div v-if="imagePreview" class="action-row">
          <n-button @click="clearImage">{{ t('common.clear') }}</n-button>
          <n-button @click="copyAllExif" :disabled="!exifData">{{ t('image.exif.copyAll') }}</n-button>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="loading-placeholder">
          <n-spin size="small" />
          <n-text depth="3">{{ t('image.exif.loading') }}</n-text>
        </div>

        <!-- EXIF 数据 -->
        <div v-else-if="exifData && exifGroups.length > 0">
          <n-tabs type="line" animated>
            <n-tab-pane
              v-for="group in exifGroups"
              :key="group.name"
              :name="group.name"
              :tab="`${group.label} (${group.items.length})`"
            >
              <div class="exif-table">
                <div v-for="item in group.items" :key="item.key" class="exif-row">
                  <span class="exif-key">{{ item.key }}</span>
                  <span class="exif-value">{{ item.value }}</span>
                  <n-button size="tiny" quaternary @click="copyValue(item.value)">{{ t('common.copy') }}</n-button>
                </div>
              </div>
            </n-tab-pane>
          </n-tabs>
        </div>

        <!-- 无 EXIF -->
        <div v-else-if="imagePreview && !loading" class="empty-placeholder">
          <n-text depth="3">{{ t('image.exif.noExif') }}</n-text>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!imagePreview" class="empty-placeholder">
          <n-text depth="3">{{ t('image.exif.emptyTip') }}</n-text>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="exif" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const fileInputRef = ref(null)
const imagePreview = ref('')
const fileName = ref('')
const fileSize = ref(0)
const isDragging = ref(false)
const loading = ref(false)
const exifData = ref(null)

const fileSizeStr = computed(() => {
  const s = fileSize.value
  if (s < 1024) return `${s} B`
  if (s < 1024 * 1024) return `${(s / 1024).toFixed(1)} KB`
  return `${(s / 1024 / 1024).toFixed(1)} MB`
})

const triggerFileInput = () => { fileInputRef.value?.click() }

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) loadFile(file)
  e.target.value = ''
}

const onDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) loadFile(file)
}

const loadFile = async (file) => {
  fileName.value = file.name
  fileSize.value = file.size
  imagePreview.value = URL.createObjectURL(file)
  loading.value = true
  exifData.value = null
  try {
    const { parse } = await import('exifr')
    const result = await parse(file, { all: true, tiff: true, xmp: true, icc: false, iptc: true, gps: true })
    exifData.value = result
  } catch (e) {
    exifData.value = null
  } finally {
    loading.value = false
  }
}

const EXIF_GROUPS = {
  basic: {
    label: '基本信息',
    keys: ['Make', 'Model', 'Software', 'DateTime', 'DateTimeOriginal', 'ImageWidth', 'ImageHeight', 'Orientation', 'ColorSpace', 'BitsPerSample']
  },
  camera: {
    label: '拍摄参数',
    keys: ['ExposureTime', 'FNumber', 'ISO', 'ISOSpeedRatings', 'ShutterSpeedValue', 'ApertureValue', 'BrightnessValue', 'ExposureBiasValue', 'MeteringMode', 'Flash', 'FocalLength', 'FocalLengthIn35mmFilm', 'WhiteBalance', 'ExposureMode', 'ExposureProgram', 'DigitalZoomRatio', 'SceneCaptureType']
  },
  gps: {
    label: 'GPS',
    keys: ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSLatitudeRef', 'GPSLongitudeRef', 'GPSAltitudeRef', 'GPSImgDirection', 'GPSSpeed', 'GPSTimestamp', 'GPSDateStamp', 'GPSMeasureMode']
  },
  other: {
    label: '其他',
    keys: []
  }
}

const exifGroups = computed(() => {
  if (!exifData.value) return []
  const data = exifData.value
  const usedKeys = new Set()
  const groups = []

  for (const [groupKey, groupDef] of Object.entries(EXIF_GROUPS)) {
    if (groupKey === 'other') continue
    const items = []
    for (const key of groupDef.keys) {
      if (key in data && data[key] !== null && data[key] !== undefined) {
        items.push({ key, value: formatValue(data[key]) })
        usedKeys.add(key)
      }
    }
    if (items.length > 0) {
      groups.push({ name: groupKey, label: groupDef.label, items })
    }
  }

  // 其他字段
  const otherItems = Object.entries(data)
    .filter(([k]) => !usedKeys.has(k))
    .map(([k, v]) => ({ key: k, value: formatValue(v) }))
    .filter(item => item.value !== '[object Object]' && item.value.length < 200)

  if (otherItems.length > 0) {
    groups.push({ name: 'other', label: '其他', items: otherItems })
  }

  return groups
})

const formatValue = (val) => {
  if (val === null || val === undefined) return ''
  if (typeof val === 'number') return String(Math.round(val * 10000) / 10000)
  if (val instanceof Date) return val.toLocaleString()
  if (Array.isArray(val)) return val.map(v => formatValue(v)).join(', ')
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

const copyValue = async (val) => {
  try {
    await navigator.clipboard.writeText(val)
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}

const copyAllExif = async () => {
  if (!exifData.value) return
  const lines = Object.entries(exifData.value)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${formatValue(v)}`)
    .join('\n')
  await copyValue(lines)
}

const clearImage = () => {
  imagePreview.value = ''
  fileName.value = ''
  fileSize.value = 0
  exifData.value = null
  loading.value = false
}
</script>

<style scoped>
.exif-viewer {
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
  border-color: #18a058;
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
  max-height: 200px;
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

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
}

.exif-table {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.exif-row {
  display: grid;
  grid-template-columns: 200px 1fr 60px;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-color);
}

.exif-row:last-child { border-bottom: none; }
.exif-row:nth-child(even) { background-color: var(--card-color); }

.exif-key {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-2);
  word-break: break-word;
}

.exif-value {
  font-size: 13px;
  word-break: break-all;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
}

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>

