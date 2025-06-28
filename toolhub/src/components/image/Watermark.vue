<template>
  <div class="image-watermark">
    <n-card :title="$t('image.watermark.title')">
      <n-space vertical>
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

          <n-form-item :label="$t('image.watermark.position')">
            <n-select v-model:value="formData.position" :options="positionOptions"
              :placeholder="$t('image.watermark.positionPlaceholder')" />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="addWatermark" type="primary" :disabled="!originalImage">
            {{ $t('image.watermark.add') }}
          </n-button>
          <n-button @click="downloadImage" :disabled="!watermarkedImage">
            {{ $t('image.watermark.download') }}
          </n-button>
        </n-space>

        <div v-if="originalImage || watermarkedImage" class="preview-container">
          <div class="preview-item">
            <h3>{{ $t('image.watermark.original') }}</h3>
            <n-image :src="originalImage" :alt="$t('image.watermark.original')" width="300" />
          </div>
          <div class="preview-item">
            <h3>{{ $t('image.watermark.watermarked') }}</h3>
            <n-image :src="watermarkedImage" :alt="$t('image.watermark.watermarked')" width="300" />
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="t('common.error')" :title="error" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
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
  position: 'center',
  rotation: 0
})

const positionOptions = [
  { label: t('image.watermark.positions.topLeft'), value: 'topLeft' },
  { label: t('image.watermark.positions.topRight'), value: 'topRight' },
  { label: t('image.watermark.positions.center'), value: 'center' },
  { label: t('image.watermark.positions.bottomLeft'), value: 'bottomLeft' },
  { label: t('image.watermark.positions.bottomRight'), value: 'bottomRight' }
]

const handleFileChange = (options) => {
  const file = options.file?.file
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = t('image.watermark.invalidFileType')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target.result
    error.value = ''
  }
  reader.readAsDataURL(file)
}

const addWatermark = async () => {
  try {
    if (!originalImage.value) {
      throw new Error(t('image.watermark.noImage'))
    }

    if (!formData.text) {
      throw new Error(t('image.watermark.noText'))
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

    // 设置水印样式
    ctx.font = `${formData.fontSize}px Arial`
    ctx.fillStyle = formData.color
    ctx.globalAlpha = formData.opacity / 100

    // 计算水印位置
    const textMetrics = ctx.measureText(formData.text)
    const textWidth = textMetrics.width
    const textHeight = formData.fontSize

    let x, y
    switch (formData.position) {
      case 'topLeft':
        x = 20
        y = formData.fontSize + 20
        break
      case 'topRight':
        x = canvas.width - textWidth - 20
        y = formData.fontSize + 20
        break
      case 'center':
        x = (canvas.width - textWidth) / 2
        y = (canvas.height + textHeight) / 2
        break
      case 'bottomLeft':
        x = 20
        y = canvas.height - 20
        break
      case 'bottomRight':
        x = canvas.width - textWidth - 20
        y = canvas.height - 20
        break
    }

    // 保存当前状态
    ctx.save()

    // 移动到中心点
    ctx.translate(x + textWidth / 2, y)
    // 旋转
    ctx.rotate((formData.rotation * Math.PI) / 180)
    // 绘制文字
    ctx.fillText(formData.text, -textWidth / 2, 0)

    // 恢复状态
    ctx.restore()

    // 更新水印图片
    watermarkedImage.value = canvas.toDataURL()
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

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

.preview-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.preview-item {
  flex: 1;
  text-align: center;
}

.text-right {
  text-align: right;
}

.error-alert {
  margin-top: 16px;
}
</style>