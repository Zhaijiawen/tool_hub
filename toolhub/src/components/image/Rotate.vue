<template>
  <n-card :title="$t('image.rotate.title')">
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
            {{ $t('image.rotate.upload') }}
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>

    <div v-if="originalImage" class="mt-4">
      <n-form>
        <n-form-item :label="$t('image.rotate.angle')">
          <n-slider
            v-model:value="angle"
            :min="0"
            :max="360"
            :step="90"
            :marks="angleMarks"
          />
          <div class="text-right">{{ angle }}°</div>
        </n-form-item>

        <n-space>
          <n-button type="primary" @click="rotateImage">
            {{ $t('image.rotate.rotate') }}
          </n-button>
          <n-button @click="downloadImage" :disabled="!rotatedImage">
            {{ $t('image.rotate.download') }}
          </n-button>
        </n-space>
      </n-form>

      <div class="preview-container mt-4">
        <div class="preview-item">
          <h3>{{ $t('image.rotate.original') }}</h3>
          <n-image
            :src="originalImage"
            :alt="$t('image.rotate.original')"
            width="300"
          />
        </div>

        <div v-if="rotatedImage" class="preview-item">
          <h3>{{ $t('image.rotate.rotated') }}</h3>
          <n-image
            :src="rotatedImage"
            :alt="$t('image.rotate.rotated')"
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'

const { t } = useI18n()
const message = useMessage()

// 角度标记
const angleMarks = {
  0: '0°',
  90: '90°',
  180: '180°',
  270: '270°',
  360: '360°'
}

// 状态变量
const originalImage = ref('')
const rotatedImage = ref('')
const angle = ref(90)
const error = ref('')

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    // 检查文件类型
    if (!file.file.type.startsWith('image/')) {
      throw new Error(t('image.rotate.invalidFileType'))
    }

    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage.value = e.target.result
      rotatedImage.value = ''
      error.value = ''
    }
    reader.readAsDataURL(file.file)
  } catch (err) {
    error.value = err.message
  }
}

// 旋转图片
async function rotateImage() {
  try {
    if (!originalImage.value) {
      throw new Error(t('image.rotate.noImage'))
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

    // 计算旋转后的尺寸
    const radian = (angle.value * Math.PI) / 180
    const sin = Math.abs(Math.sin(radian))
    const cos = Math.abs(Math.cos(radian))
    const width = img.width * cos + img.height * sin
    const height = img.width * sin + img.height * cos

    // 设置canvas尺寸
    canvas.width = width
    canvas.height = height

    // 移动原点到中心
    ctx.translate(width / 2, height / 2)
    // 旋转
    ctx.rotate(radian)
    // 绘制图片
    ctx.drawImage(img, -img.width / 2, -img.height / 2)

    // 更新旋转后的图片
    rotatedImage.value = canvas.toDataURL()
    error.value = ''
  } catch (err) {
    error.value = err.message
  }
}

// 下载旋转后的图片
function downloadImage() {
  if (!rotatedImage.value) return

  const link = document.createElement('a')
  link.href = rotatedImage.value
  link.download = `rotated_${angle.value}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
</style> 