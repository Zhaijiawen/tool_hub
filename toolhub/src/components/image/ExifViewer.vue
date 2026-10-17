<template>
  <div class="exif-viewer">
    <!-- 工具简介 -->
    <ToolIntro toolKey="exif" />

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

        <!-- 隐私清理（写入能力：exifr 只读，擦除依赖 piexifjs） -->
        <div v-if="imagePreview" class="sanitize-panel">
          <n-text style="font-size: 13px; font-weight: 600;">{{ t('image.exif.sanitizeTitle') }}</n-text>
          <n-text depth="3" style="font-size: 12px;">{{ t('image.exif.sanitizeHint') }}</n-text>

          <n-alert v-if="!isJpeg" type="warning" :show-icon="true" :bordered="true" style="margin-top: 8px;">
            {{ t('image.exif.jpegOnly') }}
          </n-alert>

          <n-alert v-else-if="!hasGps && !hasExif" type="success" :show-icon="true" :bordered="true" style="margin-top: 8px;">
            {{ t('image.exif.nothingToClean') }}
          </n-alert>

          <n-space v-else align="center" style="margin-top: 8px;" :wrap="true">
            <n-tag v-if="hasGps" type="warning" :bordered="false" size="small">
              {{ t('image.exif.gpsDetected') }}
            </n-tag>
            <n-button
              v-if="hasGps"
              type="warning"
              :loading="processing"
              :disabled="processing"
              @click="runStrip('gps')"
            >
              {{ t('image.exif.stripGps') }}
            </n-button>
            <n-button
              type="error"
              ghost
              :loading="processing"
              :disabled="processing"
              @click="runStrip('all')"
            >
              {{ t('image.exif.stripAll') }}
            </n-button>
          </n-space>
        </div>

        <!-- 处理结果 -->
        <div v-if="sanitizeMessage" class="sanitize-result">
          <n-alert :type="sanitizeMessage.type" :show-icon="true" closable @close="sanitizeMessage = ''">
            {{ sanitizeMessage.text }}
          </n-alert>
          <n-button
            v-if="pendingDownload"
            type="primary"
            size="small"
            style="margin-top: 8px;"
            @click="downloadCleaned"
          >
            {{ t('image.exif.downloadCleaned') }}
          </n-button>
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
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

const fileInputRef = ref(null)
const imagePreview = ref('')
const fileName = ref('')
const fileSize = ref(0)
const isDragging = ref(false)
const loading = ref(false)
const exifData = ref(null)
const currentFile = ref(null)

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
  currentFile.value = file
  fileName.value = file.name
  fileSize.value = file.size
  rawBytes.value = null
  pendingDownload.value = null
  sanitizeMessage.value = ''
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = URL.createObjectURL(file)
  loading.value = true
  exifData.value = null
  try {
    const { parse } = await import('exifr')
    const result = await parse(file, { all: true, tiff: true, xmp: true, icc: false, iptc: true, gps: true })
    exifData.value = result
    // 仅 JPEG 需要保留原始字节供擦除使用（其余格式不支持写入）
    if (file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name)) {
      rawBytes.value = await file.arrayBuffer()
    }
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
  processing.value = false
  sanitizeMessage.value = ''
  rawBytes.value = null
}

// ================= 隐私清理（写入 / 擦除） =================
// 读取用 exifr（快、支持格式多），擦除用 piexifjs（MIT，85KB 纯 JS）。
// 未选 wasm：浏览器端可用的 EXIF 写入方案里，wasm 版（exiftool）要么不存在、
// 要么是 Node 专用包；piexifjs 体积小、无下载成本、能力足够（可精确控制 IFD）。
const processing = ref(false)
const sanitizeMessage = ref('') // { type, text }
const rawBytes = ref(null) // 原始字节（擦除需基于原图反复操作）

/** JPEG 才能写 EXIF（piexifjs 仅支持 JPEG 的 APP1 段） */
const isJpeg = computed(() => {
  const f = currentFile.value
  return !!f && (f.type === 'image/jpeg' || /\.jpe?g$/i.test(f.name))
})

const hasGps = computed(() => {
  if (!exifData.value) return false
  const d = exifData.value
  return !!(d.GPSLatitude || d.GPSLongitude || d.GPSAltitude || d.GPSLatitudeRef)
})

const hasExif = computed(() => Object.keys(exifData.value || {}).length > 0)

/**
 * 加载 piexifjs（UMD，走 default 导出）。
 * 该库无 .d.ts，故以运行时取用避免类型报错。
 */
async function loadPiexif() {
  const mod = await import('piexifjs')
  const p = mod.default || mod
  if (!p || typeof p.load !== 'function') throw new Error('PIEXIF_LOAD_FAILED')
  return p
}

/** ArrayBuffer → binary string（piexifjs 只接受 binary string，不吃 ArrayBuffer/Uint8Array） */
function toBinaryString(buffer) {
  const bytes = new Uint8Array(buffer)
  let out = ''
  // 分块拼接，避免 apply 参数上限（大图可达数 MB）
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
  }
  return out
}

/** binary string → Uint8Array */
function fromBinaryString(bin) {
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 0xff
  return out
}

/**
 * 执行擦除。
 * @param {'gps'|'all'} mode gps=只删 GPS（保留其他 EXIF）；all=删全部 EXIF
 */
async function runStrip(mode) {
  if (!isJpeg.value || processing.value) return
  processing.value = true
  sanitizeMessage.value = ''
  try {
    if (!rawBytes.value) throw new Error('NO_SOURCE')

    const piexif = await loadPiexif()
    const bin = toBinaryString(rawBytes.value)

    // 无 EXIF 时 piexif.load 也能工作（返回空 IFD），实测通过
    const exifObj = piexif.load(bin)

    const hadGps = Object.keys(exifObj.GPS || {}).length > 0
    const hadExif =
      Object.keys(exifObj['0th'] || {}).length > 0 ||
      Object.keys(exifObj.Exif || {}).length > 0 ||
      hadGps

    if (mode === 'gps') {
      if (!hadGps) {
        sanitizeMessage.value = { type: 'info', text: t('image.exif.noGpsFound') }
        return
      }
      exifObj.GPS = {}
    } else {
      exifObj['0th'] = {}
      exifObj.Exif = {}
      exifObj.GPS = {}
      exifObj['1st'] = {}
      exifObj.Interop = {}
      exifObj.thumbnail = null
      if (!hadExif) {
        sanitizeMessage.value = { type: 'info', text: t('image.exif.noExifFound') }
        return
      }
    }

    const outBin = piexif.insert(piexif.dump(exifObj), bin)
    const outBytes = fromBinaryString(outBin)

    // 用**独立的 exifr** 复核结果：擦除必须真的生效，不能只看 UI 提示
    const { parse } = await import('exifr')
    const verify = await parse(new Blob([outBytes], { type: 'image/jpeg' }), { gps: true, tiff: true })
    const stillGps = !!(verify && (verify.GPSLatitude || verify.GPSLongitude))
    if (mode === 'gps' && stillGps) {
      // 校验失败不产出文件，避免给用户"已擦除"的错觉
      throw new Error('VERIFY_FAILED')
    }

    // 校验通过 → 更新源字节与预览，可继续操作或下载
    rawBytes.value = outBytes.buffer
    fileSize.value = outBytes.byteLength
    const blobUrl = URL.createObjectURL(new Blob([outBytes], { type: 'image/jpeg' }))
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = blobUrl

    // 重新读取展示当前状态
    const after = await parse(new Blob([outBytes], { type: 'image/jpeg' }), { all: true, tiff: true, xmp: true, icc: false, iptc: true, gps: true })
    exifData.value = after || null

    pendingDownload.value = { bytes: outBytes, name: outputName(mode) }
    sanitizeMessage.value = {
      type: 'success',
      text: mode === 'gps'
        ? t('image.exif.gpsRemoved')
        : t('image.exif.exifRemoved')
    }
  } catch (err) {
    const msg = String(err && err.message ? err.message : err)
    if (msg === 'NO_SOURCE') {
      sanitizeMessage.value = { type: 'error', text: t('image.exif.errors.noSource') }
    } else if (msg === 'VERIFY_FAILED') {
      sanitizeMessage.value = { type: 'error', text: t('image.exif.errors.verifyFailed') }
    } else if (msg.includes('invalid file data') || msg.includes('invalid type')) {
      sanitizeMessage.value = { type: 'error', text: t('image.exif.errors.jpegParseFailed') }
    } else if (msg === 'PIEXIF_LOAD_FAILED') {
      sanitizeMessage.value = { type: 'error', text: t('image.exif.errors.libLoadFailed') }
    } else {
      sanitizeMessage.value = { type: 'error', text: `${t('image.exif.failed')}: ${msg}` }
    }
  } finally {
    processing.value = false
  }
}

const pendingDownload = ref(null)

function outputName(mode) {
  const base = fileName.value.replace(/\.[^.]+$/, '') || 'image'
  const suffix = mode === 'gps' ? '_no-gps' : '_clean'
  return `${base}${suffix}.jpg`
}

const downloadCleaned = () => {
  const d = pendingDownload.value
  if (!d) return
  const url = URL.createObjectURL(new Blob([d.bytes], { type: 'image/jpeg' }))
  const a = document.createElement('a')
  a.href = url
  a.download = d.name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
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

.sanitize-panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 12px 14px;
}

.sanitize-result {
  margin-top: 8px;
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

