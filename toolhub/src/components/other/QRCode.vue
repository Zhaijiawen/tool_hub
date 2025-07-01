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
              :autosize="{ minRows: 3, maxRows: 8 }" 
              @input="onContentChange"
            />
          </n-form-item>

          <n-form-item :label="$t('other.qrcode.size')">
            <n-slider 
              v-model:value="generateForm.size" 
              :min="100" 
              :max="500" 
              :step="10" 
              @update:value="onSizeChange"
            />
            <div class="text-right mt-2">{{ generateForm.size }}px</div>
          </n-form-item>

          <n-form-item :label="$t('other.qrcode.level')">
            <n-select 
              v-model:value="generateForm.level" 
              :options="errorCorrectionLevels" 
              @update:value="onLevelChange"
            />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="generateQRCode" :loading="generating">
              {{ $t('other.qrcode.generate') }}
            </n-button>
            <n-button @click="downloadQRCode" :disabled="!qrCodeUrl">
              {{ $t('common.download') }}
            </n-button>
            <n-button @click="copyQRCodeToClipboard" :disabled="!qrCodeUrl">
              {{ $t('common.copy') }}
            </n-button>
          </n-space>

          <!-- QR码预览区域 -->
          <div v-if="qrCodeUrl" class="qr-preview mt-4">
            <n-card embedded>
              <div class="qr-display">
                <img :src="qrCodeUrl" :alt="$t('other.qrcode.title')" class="qr-image" />
                <div class="qr-info">
                  <n-space vertical size="small">
                    <n-text depth="3">{{ $t('other.qrcode.size') }}: {{ generateForm.size }}px</n-text>
                    <n-text depth="3">{{ $t('other.qrcode.level') }}: {{ getCurrentLevelText() }}</n-text>
                    <n-text depth="3">{{ $t('other.qrcode.characterCount') }}: {{ generateForm.content.length }}</n-text>
                  </n-space>
                </div>
              </div>
            </n-card>
          </div>

          <!-- 快速模板 -->
          <n-card :title="$t('other.qrcode.quickTemplates')" size="small" class="mt-4">
            <n-space>
              <n-button size="small" @click="fillTemplate('wifi')">{{ $t('other.qrcode.templateWifi') }}</n-button>
              <n-button size="small" @click="fillTemplate('email')">{{ $t('other.qrcode.templateEmail') }}</n-button>
              <n-button size="small" @click="fillTemplate('phone')">{{ $t('other.qrcode.templatePhone') }}</n-button>
              <n-button size="small" @click="fillTemplate('sms')">{{ $t('other.qrcode.templateSms') }}</n-button>
              <n-button size="small" @click="fillTemplate('vcard')">{{ $t('other.qrcode.templateVcard') }}</n-button>
            </n-space>
          </n-card>
        </n-form>
      </n-tab-pane>

      <!-- 解码二维码 -->
      <n-tab-pane name="decode" :tab="$t('other.qrcode.decode')">
        <n-upload 
          accept="image/*" 
          :max="1" 
          :show-file-list="false" 
          @change="handleFileChange"
          :custom-request="() => {}"
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

        <!-- 图片预览 -->
        <div v-if="previewUrl" class="preview-section mt-4">
          <n-card embedded>
            <div class="preview-display">
              <n-image 
                :src="previewUrl" 
                :alt="$t('other.qrcode.preview')" 
                width="300"
                :preview-disabled="false"
              />
            </div>
          </n-card>
        </div>

        <!-- 解码结果 -->
        <n-alert 
          v-if="decodeResult" 
          type="success" 
          :title="$t('other.qrcode.decodeResult')" 
          class="mt-4"
        >
          <div class="decode-result">
            <n-text>{{ decodeResult }}</n-text>
            <n-space class="mt-3">
              <n-button size="small" @click="copyDecodeResult">
                {{ $t('common.copy') }}
              </n-button>
              <n-button size="small" @click="openAsUrl" v-if="isValidUrl(decodeResult)">
                {{ $t('other.qrcode.openLink') }}
              </n-button>
            </n-space>
          </div>
        </n-alert>

        <!-- 错误提示 -->
        <n-alert 
          v-if="decodeError" 
          type="error" 
          :title="$t('common.error')" 
          class="mt-4"
        >
          {{ decodeError }}
        </n-alert>
      </n-tab-pane>
    </n-tabs>

    <!-- 使用说明 -->
    <n-alert type="info" :title="$t('other.qrcode.infoTitle')" class="info-section">
      {{ $t('other.qrcode.infoContent') }}
    </n-alert>
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

// 生成状态
const generating = ref(false)

// 生成二维码表单
const generateForm = reactive({
  content: '',
  size: 200,
  level: 'M'
})

// 错误纠正级别选项
const errorCorrectionLevels = [
  { label: `L - ${t('other.qrcode.levelLow')} (7%)`, value: 'L' },
  { label: `M - ${t('other.qrcode.levelMedium')} (15%)`, value: 'M' },
  { label: `Q - ${t('other.qrcode.levelQuartile')} (25%)`, value: 'Q' },
  { label: `H - ${t('other.qrcode.levelHigh')} (30%)`, value: 'H' }
]

// 二维码URL
const qrCodeUrl = ref('')

// 预览URL
const previewUrl = ref('')

// 解码结果
const decodeResult = ref('')
const decodeError = ref('')

// 内容变化时自动生成
function onContentChange() {
  if (generateForm.content) {
    generateQRCode()
  } else {
    qrCodeUrl.value = ''
  }
}

// 尺寸变化时自动更新
function onSizeChange() {
  if (generateForm.content && qrCodeUrl.value) {
    generateQRCode()
  }
}

// 级别变化时自动更新
function onLevelChange() {
  if (generateForm.content && qrCodeUrl.value) {
    generateQRCode()
  }
}

// 生成二维码
async function generateQRCode() {
  if (!generateForm.content.trim()) {
    message.warning(t('other.qrcode.contentRequired'))
    return
  }

  try {
    generating.value = true
    qrCodeUrl.value = await QRCode.toDataURL(generateForm.content, {
      width: generateForm.size,
      height: generateForm.size,
      margin: 2,
      errorCorrectionLevel: generateForm.level,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (err) {
    message.error(err.message || t('other.qrcode.generateFailed'))
  } finally {
    generating.value = false
  }
}

// 获取当前级别文本
function getCurrentLevelText() {
  const level = errorCorrectionLevels.find(l => l.value === generateForm.level)
  return level ? level.label : generateForm.level
}

// 下载二维码
function downloadQRCode() {
  if (!qrCodeUrl.value) return

  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = `qrcode-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  message.success(t('other.qrcode.qrCodeDownloaded'))
}

// 复制二维码到剪贴板
async function copyQRCodeToClipboard() {
  if (!qrCodeUrl.value) return
  
  try {
    const response = await fetch(qrCodeUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ])
    message.success(t('other.qrcode.qrCodeCopied'))
  } catch (err) {
    message.error(t('other.qrcode.copyFailed'))
  }
}

// 填充模板
function fillTemplate(type) {
  const templates = {
    wifi: 'WIFI:T:WPA;S:WiFi名称;P:密码;H:false;;',
    email: 'mailto:example@email.com?subject=主题&body=邮件内容',
    phone: 'tel:+86-138-0013-8000',
    sms: 'smsto:138-0013-8000:短信内容',
    vcard: `BEGIN:VCARD
VERSION:3.0
FN:姓名
ORG:公司
TEL:+86-138-0013-8000
EMAIL:example@email.com
URL:https://www.example.com
END:VCARD`
  }
  
  generateForm.content = templates[type] || ''
  if (generateForm.content) {
    generateQRCode()
  }
}

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    decodeError.value = ''
    decodeResult.value = ''
    
    // 创建预览
    previewUrl.value = URL.createObjectURL(file.file)

    // 读取图片数据
    const imageData = await readImageData(file.file)

    // 解码二维码
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      decodeResult.value = code.data
      message.success(t('other.qrcode.decodeSuccess'))
    } else {
      throw new Error(t('other.qrcode.noQRCodeFound'))
    }
  } catch (err) {
    decodeError.value = err.message
    message.error(t('other.qrcode.decodeFailed'))
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

// 复制解码结果
function copyDecodeResult() {
  if (!decodeResult.value) return
  navigator.clipboard.writeText(decodeResult.value)
  message.success(t('common.copySuccess'))
}

// 检查是否为有效URL
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// 打开链接
function openAsUrl() {
  if (isValidUrl(decodeResult.value)) {
    window.open(decodeResult.value, '_blank')
  }
}
</script>

<style scoped>
.n-card {
  max-width: 1200px;
  margin: 0 auto;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.text-right {
  text-align: right;
}

.qr-preview {
  display: flex;
  justify-content: center;
}

.qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-image {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-info {
  text-align: center;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.preview-section {
  display: flex;
  justify-content: center;
}

.preview-display {
  text-align: center;
}

.decode-result {
  word-break: break-all;
}

.info-section {
  margin-top: 16px;
}
</style>