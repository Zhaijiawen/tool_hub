<template>
  <div class="image-convert">
    <n-card :title="$t('image.convert.title')" :bordered="false">
      <n-space vertical size="large">
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
                {{ $t('image.convert.upload') }}
              </n-text>
            </div>
          </n-upload-dragger>
        </n-upload>

        <n-form>
          <n-form-item :label="$t('image.convert.format')">
            <n-select v-model:value="format" :options="formatOptions" />
          </n-form-item>

          <n-form-item :label="$t('image.convert.quality')" :disabled="isLossless">
            <n-slider v-model:value="quality" :min="0" :max="100" :step="1" :disabled="isLossless" />
            <div class="text-right">{{ quality }}%</div>
          </n-form-item>
          <n-text v-if="isLossless" depth="3" style="margin-top: -12px; display: block; margin-bottom: 24px;">
            {{ t('image.convert.losslessNotice') }}
          </n-text>

          <n-space>
            <n-button @click="downloadImage" :disabled="!convertedImage">
              {{ $t('image.convert.download') }}
            </n-button>
          </n-space>
        </n-form>

        <div v-if="originalImage" class="mt-4">
          <div class="preview-container">
            <div class="preview-item">
              <h3>{{ $t('image.convert.original') }}</h3>
              <n-image :src="originalImage" :alt="$t('image.convert.original')" width="300" />
              <div class="info">
                <div>{{ $t('image.convert.format') }}: {{ originalFormat }}</div>
                <div>{{ $t('image.convert.size') }}: {{ formatFileSize(originalSize) }}</div>
              </div>
            </div>

            <div v-if="convertedImage" class="preview-item">
              <h3>{{ $t('image.convert.converted') }}</h3>
              <n-image :src="convertedImage" :alt="$t('image.convert.converted')" width="300" />
              <div class="info">
                <div>{{ $t('image.convert.format') }}: {{ format }}</div>
                <div>{{ $t('image.convert.size') }}: {{ formatFileSize(convertedSize) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="error" class="mt-4">
          {{ error }}
        </n-alert>
        
        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('image.convert.infoTitle')">
            <div>{{ t('image.convert.infoContent') }}</div>
          </n-alert>
        </div>
      </n-space>
    </n-card>
    
    <!-- 工具描述 -->
    <ToolDescription tool-key="imageConvert" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'
import ToolDescription from '@/components/common/ToolDescription.vue'

const { t } = useI18n()
const message = useMessage()

// 图片格式选项
const formatOptions = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG', value: 'image/png' },
  { label: 'WebP', value: 'image/webp' },
  { label: 'GIF', value: 'image/gif' }
]

// 状态变量
const originalImage = ref('')
const originalSize = ref(0)
const originalFormat = ref('')
const convertedImage = ref('')
const convertedSize = ref(0)
const quality = ref(80)
const format = ref('image/jpeg')
const error = ref('')

const isLossless = computed(() => {
  return format.value === 'image/png' || format.value === 'image/gif'
})

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file || !file.file) {
    originalImage.value = ''
    convertedImage.value = ''
    originalSize.value = 0
    convertedSize.value = 0
    error.value = ''
    return
  }

  try {
    // 检查文件类型
    if (!file.file.type.startsWith('image/')) {
      throw new Error(t('image.convert.invalidFileType'))
    }

    // 清空之前的结果
    convertedImage.value = ''
    convertedSize.value = 0
    error.value = ''

    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage.value = e.target.result
      originalSize.value = file.file.size
      originalFormat.value = file.file.type
    }
    reader.readAsDataURL(file.file)
  } catch (err) {
    error.value = err.message
    originalImage.value = ''
  }
}

// 转换图片
async function convertImage() {
  if (!originalImage.value) {
    return
  }

  try {
    // 创建图片对象
    const img = new Image()
    img.src = originalImage.value

    // 等待图片加载
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = (err) => {
        console.error("Image load error:", err);
        reject(new Error('Failed to load image for conversion.'))
      }
    })

    // 创建canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 设置canvas尺寸
    canvas.width = img.width
    canvas.height = img.height

    // 绘制图片
    ctx.drawImage(img, 0, 0)

    // 转换图片
    const convertedDataUrl = isLossless.value
      ? canvas.toDataURL(format.value)
      : canvas.toDataURL(format.value, quality.value / 100)

    // 计算转换后的大小
    const base64str = convertedDataUrl.split(',')[1]
    const convertedBytes = atob(base64str).length
    convertedSize.value = convertedBytes

    // 更新转换后的图片
    convertedImage.value = convertedDataUrl
    error.value = ''
  } catch (err) {
    error.value = err.message
    convertedImage.value = ''
    convertedSize.value = 0
  }
}

// 监听变更自动转换
watch(originalImage, (newValue) => {
  if (newValue) {
    convertImage()
  }
})

watch(format, () => {
  if (originalImage.value) {
    convertImage()
  }
})

watch(quality, () => {
  if (originalImage.value && !isLossless.value) {
    convertImage()
  }
})

// 下载转换后的图片
function downloadImage() {
  if (!convertedImage.value) return

  const link = document.createElement('a')
  link.href = convertedImage.value
  link.download = `converted.${format.value.split('/')[1]}`
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
.image-convert {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
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

.info {
  margin-top: 8px;
  color: var(--n-text-color-3);
}

.info-section {
  margin-top: 16px;
}
</style>