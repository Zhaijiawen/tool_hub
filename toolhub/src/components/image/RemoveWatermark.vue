<template>
  <n-card :title="$t('image.removeWatermark.title')">
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
            {{ $t('image.removeWatermark.upload') }}
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>

    <div v-if="originalImage" class="mt-4">
      <n-form>
        <n-form-item :label="$t('image.removeWatermark.brushSize')">
          <n-slider
            v-model:value="brushSize"
            :min="1"
            :max="50"
            :step="1"
          />
          <div class="text-right">{{ brushSize }}px</div>
        </n-form-item>

        <n-space>
          <n-button type="primary" @click="startRemoving">
            {{ $t('image.removeWatermark.start') }}
          </n-button>
          <n-button @click="downloadImage" :disabled="!removedImage">
            {{ $t('image.removeWatermark.download') }}
          </n-button>
        </n-space>
      </n-form>

      <div class="canvas-container mt-4">
        <canvas
          ref="canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        />
      </div>

      <div class="preview-container mt-4">
        <div class="preview-item">
          <h3>{{ $t('image.removeWatermark.original') }}</h3>
          <n-image
            :src="originalImage"
            :alt="$t('image.removeWatermark.original')"
            width="300"
          />
        </div>

        <div v-if="removedImage" class="preview-item">
          <h3>{{ $t('image.removeWatermark.removed') }}</h3>
          <n-image
            :src="removedImage"
            :alt="$t('image.removeWatermark.removed')"
            width="300"
          />
        </div>
      </div>
    </div>

    <n-alert
      v-if="error"
      type="error"
      :title="error"
      class="mt-4"
    />
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'

const { t } = useI18n()
const message = useMessage()

// 状态变量
const originalImage = ref('')
const removedImage = ref('')
const brushSize = ref(10)
const error = ref('')
const canvas = ref(null)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    // 检查文件类型
    if (!file.file.type.startsWith('image/')) {
      throw new Error(t('image.removeWatermark.invalidFileType'))
    }

    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage.value = e.target.result
      removedImage.value = ''
      error.value = ''
      initCanvas()
    }
    reader.readAsDataURL(file.file)
  } catch (err) {
    error.value = err.message
  }
}

// 初始化画布
function initCanvas() {
  const img = new Image()
  img.src = originalImage.value
  img.onload = () => {
    const ctx = canvas.value.getContext('2d')
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.drawImage(img, 0, 0)
  }
}

// 开始去水印
function startRemoving() {
  if (!originalImage.value) {
    error.value = t('image.removeWatermark.noImage')
    return
  }

  initCanvas()
  removedImage.value = ''
}

// 开始绘制
function startDrawing(e) {
  isDrawing.value = true
  const rect = canvas.value.getBoundingClientRect()
  lastX.value = e.clientX - rect.left
  lastY.value = e.clientY - rect.top
}

// 绘制
function draw(e) {
  if (!isDrawing.value) return

  const ctx = canvas.value.getContext('2d')
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 使用内容感知填充
  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineWidth = brushSize.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(x, y)
  ctx.stroke()

  lastX.value = x
  lastY.value = y
}

// 停止绘制
function stopDrawing() {
  isDrawing.value = false
  removedImage.value = canvas.value.toDataURL()
}

// 下载去水印后的图片
function downloadImage() {
  if (!removedImage.value) return

  const link = document.createElement('a')
  link.href = removedImage.value
  link.download = 'removed_watermark.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  if (canvas.value) {
    initCanvas()
  }
})
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

.canvas-container {
  width: 100%;
  overflow: auto;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

canvas {
  display: block;
  cursor: crosshair;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.preview-item {
  text-align: center;
}
</style> 