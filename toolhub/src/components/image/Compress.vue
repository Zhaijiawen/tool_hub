<template>
  <n-card :title="$t('image.compress.title')">
    <n-upload
      accept="image/*"
      :max="1"
      :show-file-list="false"
      @change="handleFileChange"
    >
      <n-upload-dragger>
        <div class="upload-trigger">
          <n-icon size="48" :depth="3">
            <upload-outlined />
          </n-icon>
          <n-text style="margin-top: 8px">
            {{ $t('image.compress.upload') }}
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>

    <div v-if="originalImage" class="mt-4">
      <n-form>
        <n-form-item :label="$t('image.compress.quality')">
          <n-slider
            v-model:value="quality"
            :min="0"
            :max="100"
            :step="1"
          />
          <div class="text-right">{{ quality }}%</div>
        </n-form-item>

        <n-form-item :label="$t('image.compress.format')">
          <n-select
            v-model:value="format"
            :options="formatOptions"
          />
        </n-form-item>

        <n-space>
          <n-button type="primary" @click="compressImage">
            {{ $t('image.compress.compress') }}
          </n-button>
          <n-button @click="downloadImage" :disabled="!compressedImage">
            {{ $t('image.compress.download') }}
          </n-button>
        </n-space>
      </n-form>

      <div class="preview-container mt-4">
        <div class="preview-item">
          <h3>{{ $t('image.compress.original') }}</h3>
          <n-image
            :src="originalImage"
            :alt="$t('image.compress.original')"
            width="300"
          />
          <div class="size-info">
            {{ $t('image.compress.size') }}: {{ formatFileSize(originalSize) }}
          </div>
        </div>

        <div v-if="compressedImage" class="preview-item">
          <h3>{{ $t('image.compress.compressed') }}</h3>
          <n-image
            :src="compressedImage"
            :alt="$t('image.compress.compressed')"
            width="300"
          />
          <div class="size-info">
            {{ $t('image.compress.size') }}: {{ formatFileSize(compressedSize) }}
          </div>
        </div>
      </div>
    </div>

    <n-alert
      v-if="error"
      type="error"
      :title="$t('common.error')"
      :content="error"
      class="mt-4"
    />
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'

const { t } = useI18n()
const message = useMessage()

// 图片格式选项
const formatOptions = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG', value: 'image/png' },
  { label: 'WebP', value: 'image/webp' }
]

// 状态变量
const originalImage = ref('')
const originalSize = ref(0)
const compressedImage = ref('')
const compressedSize = ref(0)
const quality = ref(80)
const format = ref('image/jpeg')
const error = ref('')

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    // 检查文件类型
    if (!file.file.type.startsWith('image/')) {
      throw new Error(t('image.compress.invalidFileType'))
    }

    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage.value = e.target.result
      originalSize.value = file.file.size
      compressedImage.value = ''
      compressedSize.value = 0
      error.value = ''
    }
    reader.readAsDataURL(file.file)
  } catch (err) {
    error.value = err.message
  }
}

// 压缩图片
async function compressImage() {
  try {
    if (!originalImage.value) {
      throw new Error(t('image.compress.noImage'))
    }

    // 创建图片对象
    const img = new Image()
    img.src = originalImage.value

    // 等待图片加载
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    // 创建canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 设置canvas尺寸
    canvas.width = img.width
    canvas.height = img.height

    // 绘制图片
    ctx.drawImage(img, 0, 0)

    // 压缩图片
    const compressedDataUrl = canvas.toDataURL(format.value, quality.value / 100)

    // 计算压缩后的大小
    const base64str = compressedDataUrl.split(',')[1]
    const compressedBytes = atob(base64str).length
    compressedSize.value = compressedBytes

    // 更新压缩后的图片
    compressedImage.value = compressedDataUrl
    error.value = ''
  } catch (err) {
    error.value = err.message
  }
}

// 下载压缩后的图片
function downloadImage() {
  if (!compressedImage.value) return

  const link = document.createElement('a')
  link.href = compressedImage.value
  link.download = `compressed.${format.value.split('/')[1]}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}

.text-right {
  text-align: right;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.preview-item {
  text-align: center;
}

.size-info {
  margin-top: 8px;
  color: var(--n-text-color-3);
}
</style> 