<template>
  <n-card :title="$t('other.qrcode.title')">
    <n-tabs type="line" animated>
      <!-- 生成二维码 -->
      <n-tab-pane name="generate" :tab="$t('other.qrcode.generate')">
        <n-form>
          <n-form-item :label="$t('other.qrcode.content')">
            <n-input
              v-model:value="generateForm.content"
              type="textarea"
              :placeholder="$t('other.qrcode.contentPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>

          <n-form-item :label="$t('other.qrcode.size')">
            <n-slider
              v-model:value="generateForm.size"
              :min="100"
              :max="400"
              :step="10"
            />
            <div class="text-right">{{ generateForm.size }}px</div>
          </n-form-item>

          <n-form-item :label="$t('other.qrcode.level')">
            <n-select
              v-model:value="generateForm.level"
              :options="errorCorrectionLevels"
            />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="generateQRCode">
              {{ $t('other.qrcode.generate') }}
            </n-button>
            <n-button @click="downloadQRCode" :disabled="!qrCodeUrl">
              {{ $t('other.qrcode.download') }}
            </n-button>
          </n-space>

          <div v-if="qrCodeUrl" class="mt-4 text-center">
            <img :src="qrCodeUrl" :alt="$t('other.qrcode.title')" />
          </div>
        </n-form>
      </n-tab-pane>

      <!-- 解码二维码 -->
      <n-tab-pane name="decode" :tab="$t('other.qrcode.decode')">
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
                {{ $t('other.qrcode.uploadTip') }}
              </n-text>
            </div>
          </n-upload-dragger>
        </n-upload>

        <div v-if="previewUrl" class="mt-4">
          <n-image
            :src="previewUrl"
            :alt="$t('other.qrcode.preview')"
            width="200"
          />
        </div>

        <n-alert
          v-if="decodeResult"
          type="success"
          :title="$t('other.qrcode.decodeResult')"
          class="mt-4"
        >
          {{ decodeResult }}
        </n-alert>

        <n-alert
          v-if="decodeError"
          type="error"
          :title="$t('other.qrcode.decodeError')"
          class="mt-4"
        />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'
import QRCode from 'qrcode'
import jsQR from 'jsqr'

const { t } = useI18n()
const message = useMessage()

// 生成二维码表单
const generateForm = reactive({
  content: '',
  size: 200,
  level: 'M'
})

// 错误纠正级别选项
const errorCorrectionLevels = [
  { label: 'L (7%)', value: 'L' },
  { label: 'M (15%)', value: 'M' },
  { label: 'Q (25%)', value: 'Q' },
  { label: 'H (30%)', value: 'H' }
]

// 二维码URL
const qrCodeUrl = ref('')

// 预览URL
const previewUrl = ref('')

// 解码结果
const decodeResult = ref('')
const decodeError = ref('')

// 生成二维码
async function generateQRCode() {
  try {
    if (!generateForm.content) {
      throw new Error(t('other.qrcode.contentRequired'))
    }

    qrCodeUrl.value = await QRCode.toDataURL(generateForm.content, {
      width: generateForm.size,
      margin: 1,
      errorCorrectionLevel: generateForm.level
    })
  } catch (err) {
    message.error(err.message)
  }
}

// 下载二维码
function downloadQRCode() {
  if (!qrCodeUrl.value) return

  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = 'qrcode.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    // 创建预览
    previewUrl.value = URL.createObjectURL(file.file)

    // 读取图片数据
    const imageData = await readImageData(file.file)
    
    // 解码二维码
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    
    if (code) {
      decodeResult.value = code.data
      decodeError.value = ''
    } else {
      throw new Error(t('other.qrcode.noQRCodeFound'))
    }
  } catch (err) {
    decodeError.value = err.message
    decodeResult.value = ''
  }
}

// 读取图片数据
function readImageData(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, img.width, img.height))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
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

.text-center {
  text-align: center;
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
</style> 