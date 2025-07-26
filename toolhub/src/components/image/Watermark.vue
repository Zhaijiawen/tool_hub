<template>
  <div class="image-watermark">
    <n-card :title="$t('image.watermark.title')">
      <n-space vertical size="large">
        <n-upload accept="image/*" :max="1" :show-file-list="false" @change="handleFileChange">
          <n-upload-dragger>
            <div class="upload-trigger">
              <n-icon size="48" :depth="3">
                <upload-outlined />
              </n-icon>
              <n-text style="margin-top: 8px">
                {{ $t('image.watermark.upload') }}
              </n-text>
            </div>
          </n-upload-dragger>
        </n-upload>

        <div v-if="originalImage" class="main-content">
          <div class="form-section">
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="$t('image.watermark.text')">
            <n-input v-model:value="formData.text" :placeholder="$t('image.watermark.textPlaceholder')" />
          </n-form-item>
          <n-form-item :label="$t('image.watermark.fontSize')">
            <n-slider v-model:value="formData.fontSize" :min="12" :max="72" :step="1" />
            <div class="text-right">{{ formData.fontSize }}px</div>
          </n-form-item>
          <n-form-item :label="$t('image.watermark.color')">
            <n-color-picker v-model:value="formData.color" :show-alpha="true" />
          </n-form-item>
          <n-form-item :label="$t('image.watermark.opacity')">
            <n-slider v-model:value="formData.opacity" :min="0" :max="100" :step="1" />
            <div class="text-right">{{ formData.opacity }}%</div>
          </n-form-item>
          <n-form-item :label="$t('image.watermark.rotation')">
            <n-slider v-model:value="formData.rotation" :min="-180" :max="180" :step="1" />
            <div class="text-right">{{ formData.rotation }}°</div>
          </n-form-item>
        </n-form>
        <n-space>
          <n-button @click="downloadImage" :disabled="!watermarkedImage">
            {{ $t('image.watermark.download') }}
          </n-button>
        </n-space>
          </div>
          <div class="preview-section">
            <div class="preview-row">
              <div class="preview-box">
            <h3>{{ $t('image.watermark.original') }}</h3>
            <n-image :src="originalImage" :alt="$t('image.watermark.original')" width="300" />
          </div>
              <div class="preview-box">
            <h3>{{ $t('image.watermark.watermarked') }}</h3>
                <template v-if="watermarkedImage">
            <n-image :src="watermarkedImage" :alt="$t('image.watermark.watermarked')" width="300" />
                </template>
                <template v-else>
                  <div class="preview-placeholder">{{ $t('image.watermark.noText') }}</div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="error" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
    
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'

const { t } = useI18n()
const message = useMessage()

const originalImage = ref(null)
const watermarkedImage = ref(null)
const error = ref('')

const formData = reactive({
  text: '',
  fontSize: 24,
  color: '#000000',
  opacity: 50,
  rotation: 0
})

const handleFileChange = (options) => {
  const file = options.file?.file
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = t('image.watermark.invalidFileType')
    originalImage.value = null
    watermarkedImage.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target.result
    watermarkedImage.value = null
    error.value = ''
  }
  reader.readAsDataURL(file)
}

const addWatermark = async () => {
  try {
    if (!originalImage.value) {
      watermarkedImage.value = null
      return
    }
    if (!formData.text) {
      watermarkedImage.value = null
      return
    }
    const img = new Image()
    img.src = originalImage.value
    await new Promise((resolve) => {
      img.onload = resolve
    })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    ctx.font = `${formData.fontSize}px Arial`
    ctx.fillStyle = formData.color
    ctx.globalAlpha = formData.opacity / 100
    ctx.save()
    ctx.rotate((formData.rotation * Math.PI) / 180)
    // 计算平铺间距
    const textMetrics = ctx.measureText(formData.text)
    const textWidth = textMetrics.width
    const textHeight = formData.fontSize * 1.5
    // 斜向平铺
    for (let y = -canvas.height; y < canvas.height * 2; y += textHeight) {
      for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + 80) {
        ctx.fillText(formData.text, x, y)
      }
    }
    ctx.restore()
    watermarkedImage.value = canvas.toDataURL()
    error.value = ''
  } catch (e) {
    error.value = e.message
    watermarkedImage.value = null
  }
}

watch([
  () => formData.text,
  () => formData.fontSize,
  () => formData.color,
  () => formData.opacity,
  () => formData.rotation,
  originalImage
], () => {
  addWatermark()
})

const downloadImage = () => {
  if (!watermarkedImage.value) return
  const link = document.createElement('a')
  link.download = 'watermarked.png'
  link.href = watermarkedImage.value
  link.click()
}
</script>

<style scoped>
.image-watermark {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.preview-section {
  display: block;
}

.preview-row {
  display: flex;
  flex-direction: row;
  gap: 40px;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
}

.preview-box {
  text-align: center;
  background: #fafbfc;
  border-radius: 8px;
  padding: 16px 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.text-right {
  text-align: right;
}

.error-alert {
  margin-top: 16px;
}
</style>