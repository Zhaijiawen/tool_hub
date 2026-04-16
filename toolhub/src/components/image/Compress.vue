<template>
  <div class="compress-tool">
    <n-card :title="t('image.compress.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 上传区域 -->
        <div class="upload-section">
          <n-upload
            :max="10"
            multiple
            accept="image/jpeg,image/png,image/webp"
            :show-file-list="false"
            :custom-request="handleUpload"
          >
            <n-upload-dragger>
              <div class="upload-inner">
                <n-icon size="48" :depth="3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </n-icon>
                <n-text class="upload-title">{{ t('image.compress.dragOrClick') }}</n-text>
                <n-text depth="3">{{ t('image.compress.supportedFormats') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>

        <!-- 质量设置 -->
        <div class="quality-section">
          <n-text class="section-title">{{ t('image.compress.quality') }}: {{ quality }}%</n-text>
          <n-slider v-model:value="quality" :min="10" :max="100" :step="5" @update:value="recompressAll" />
        </div>

        <!-- 批量操作 -->
        <div v-if="imageList.length > 0" class="batch-actions">
          <n-space>
            <n-button type="primary" @click="downloadAll" :disabled="!hasCompressed">
              {{ t('image.compress.downloadAll') }}
            </n-button>
            <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
          </n-space>
        </div>

        <!-- 图片列表 -->
        <div v-if="imageList.length > 0" class="image-list">
          <div v-for="(item, index) in imageList" :key="index" class="image-item">
            <!-- 对比预览 -->
            <div class="preview-row">
              <div class="preview-col">
                <n-text class="preview-label">{{ t('image.compress.original') }}</n-text>
                <img :src="item.originalUrl" class="preview-img" :alt="item.name" />
                <n-text depth="3" class="size-text">{{ formatSize(item.originalSize) }}</n-text>
              </div>
              <div class="arrow-col">→</div>
              <div class="preview-col">
                <n-text class="preview-label">{{ t('image.compress.compressed') }}</n-text>
                <n-spin :show="item.compressing">
                  <img v-if="item.compressedUrl" :src="item.compressedUrl" class="preview-img" :alt="item.name" />
                  <div v-else class="preview-placeholder">{{ t('image.compress.processing') }}</div>
                </n-spin>
                <div v-if="item.compressedSize" class="size-row">
                  <n-text depth="3" class="size-text">{{ formatSize(item.compressedSize) }}</n-text>
                  <n-tag
                    :type="getSavingType(item)"
                    size="small"
                    class="saving-tag"
                  >
                    -{{ getSavingPercent(item) }}%
                  </n-tag>
                </div>
              </div>
            </div>

            <!-- 操作 -->
            <div class="item-actions">
              <n-text class="file-name">{{ item.name }}</n-text>
              <n-button
                size="small"
                type="primary"
                :disabled="!item.compressedUrl"
                @click="downloadItem(item)"
              >
                {{ t('common.download') }}
              </n-button>
            </div>
          </div>
        </div>

        <!-- 说明 -->
        <n-alert type="info" :title="t('image.compress.note')">
          {{ t('image.compress.noteContent') }}
        </n-alert>

      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const quality = ref(80)
const imageList = ref([])

const hasCompressed = computed(() => imageList.value.some(i => i.compressedUrl))

const formatSize = (bytes) => {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const getSavingPercent = (item) => {
  if (!item.compressedSize || !item.originalSize) return 0
  return Math.round((1 - item.compressedSize / item.originalSize) * 100)
}

const getSavingType = (item) => {
  const pct = getSavingPercent(item)
  if (pct > 30) return 'success'
  if (pct > 10) return 'info'
  return 'warning'
}

const compressImage = async (file, qualityVal) => {
  const { default: imageCompression } = await import('browser-image-compression')
  const options = {
    maxSizeMB: 100,
    useWebWorker: true,
    initialQuality: qualityVal / 100,
    alwaysKeepResolution: true,
    fileType: file.type
  }
  return await imageCompression(file, options)
}

const handleUpload = async ({ file }) => {
  const f = file.file
  if (!f) return

  if (imageList.value.length >= 10) {
    message.warning(t('image.compress.maxFiles'))
    return
  }

  const originalUrl = URL.createObjectURL(f)
  const item = reactive({
    name: f.name,
    originalFile: f,
    originalUrl,
    originalSize: f.size,
    compressedUrl: null,
    compressedSize: null,
    compressedBlob: null,
    compressing: true
  })
  imageList.value.push(item)

  try {
    const compressed = await compressImage(f, quality.value)
    item.compressedUrl = URL.createObjectURL(compressed)
    item.compressedSize = compressed.size
    item.compressedBlob = compressed
  } catch (e) {
    message.error(t('common.error') + ': ' + e.message)
  } finally {
    item.compressing = false
  }
}

const recompressAll = async () => {
  for (const item of imageList.value) {
    if (!item.originalFile) continue
    item.compressing = true
    item.compressedUrl = null
    item.compressedSize = null
    try {
      const compressed = await compressImage(item.originalFile, quality.value)
      item.compressedUrl = URL.createObjectURL(compressed)
      item.compressedSize = compressed.size
      item.compressedBlob = compressed
    } catch (e) {
      /* ignore */
    } finally {
      item.compressing = false
    }
  }
}

const downloadItem = (item) => {
  if (!item.compressedBlob) return
  const ext = item.name.split('.').pop()
  const url = item.compressedUrl
  const a = document.createElement('a')
  a.href = url
  a.download = item.name.replace(/\.[^.]+$/, '') + '_compressed.' + ext
  a.click()
}

const downloadAll = () => {
  imageList.value.filter(i => i.compressedUrl).forEach(item => {
    downloadItem(item)
  })
}

const clearAll = () => {
  imageList.value.forEach(item => {
    if (item.originalUrl) URL.revokeObjectURL(item.originalUrl)
    if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
  })
  imageList.value = []
}
</script>

<style scoped>
.compress-tool {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
}

.quality-section {
  max-width: 500px;
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
}

.size-text {
  font-size: 12px;
}

.size-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.saving-tag {
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .compress-tool {
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

