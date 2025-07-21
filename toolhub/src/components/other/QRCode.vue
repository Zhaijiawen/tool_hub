<template>
  <div class="qrcode-container">

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

            <!-- 高级定制选项 -->
            <n-collapse>
              <n-collapse-item :title="$t('other.qrcode.advancedOptions')" name="advanced">
                <!-- 颜色设置 -->
                <n-card :title="$t('other.qrcode.colors')" size="small" class="mb-4">
                  <n-space vertical>
                    <n-space>
                      <n-form-item :label="$t('other.qrcode.foregroundColor')">
                        <n-color-picker 
                          v-model:value="generateForm.foregroundColor" 
                          @update:value="onColorChange"
                          :show-alpha="false"
                        />
                      </n-form-item>
                      <n-form-item :label="$t('other.qrcode.backgroundColor')">
                        <n-color-picker 
                          v-model:value="generateForm.backgroundColor" 
                          @update:value="onColorChange"
                          :show-alpha="false"
                        />
                      </n-form-item>
                      <n-button size="small" @click="resetColors">
                        {{ $t('other.qrcode.resetColors') }}
                      </n-button>
                    </n-space>

                    <!-- 预设主题 -->
                    <div>
                      <n-text depth="3">{{ $t('other.qrcode.colorPresets') }}:</n-text>
                      <n-space class="mt-2">
                        <n-button 
                          v-for="preset in colorPresets" 
                          :key="preset.name"
                          size="small" 
                          @click="applyColorPreset(preset)"
                          :style="{ backgroundColor: preset.foreground, color: preset.background }"
                        >
                          {{ $t(`other.qrcode.preset${preset.name}`) }}
                        </n-button>
                      </n-space>
                    </div>
                  </n-space>
                </n-card>

                <!-- Logo设置 -->
                <n-card :title="$t('other.qrcode.logo')" size="small">
                  <n-alert 
                    v-if="logoFile" 
                    type="warning" 
                    size="small" 
                    :title="$t('other.qrcode.logoTips')"
                    class="mb-3"
                  />
                  <n-space vertical>
                    <!-- Logo上传 -->
                    <n-upload 
                      accept="image/*" 
                      :max="1" 
                      :show-file-list="false" 
                      @change="handleLogoUpload"
                      :custom-request="() => {}"
                    >
                      <n-upload-dragger v-if="!logoFile">
                        <div class="logo-upload-trigger">
                          <n-icon size="24" :depth="3">
                            <upload-outlined />
                          </n-icon>
                          <n-text style="margin-top: 8px; font-size: 12px;">
                            {{ $t('other.qrcode.logoUploadTip') }}
                          </n-text>
                        </div>
                      </n-upload-dragger>
                    </n-upload>

                    <!-- Logo预览和控制 -->
                    <div v-if="logoFile" class="logo-controls">
                      <n-space vertical>
                        <div class="logo-preview">
                          <n-image 
                            :src="logoUrl" 
                            width="60" 
                            height="60" 
                            object-fit="cover"
                            :preview-disabled="false"
                          />
                          <n-button size="tiny" @click="removeLogo" type="error" class="remove-logo-btn">
                            {{ $t('other.qrcode.removeLogo') }}
                          </n-button>
                        </div>

                        <n-form-item :label="$t('other.qrcode.logoSizePercent')">
                          <n-slider 
                            v-model:value="generateForm.logoSize" 
                            :min="8" 
                            :max="20" 
                            :step="1" 
                            @update:value="onLogoSettingChange"
                          />
                          <div class="text-right mt-1">{{ generateForm.logoSize }}%</div>
                          <n-text depth="3" style="font-size: 12px;">
                            {{ $t('other.qrcode.logoSizeWarning') }}
                          </n-text>
                        </n-form-item>

                        <n-form-item :label="$t('other.qrcode.logoOpacity')">
                          <n-slider 
                            v-model:value="generateForm.logoOpacity" 
                            :min="50" 
                            :max="100" 
                            :step="5" 
                            @update:value="onLogoSettingChange"
                          />
                          <div class="text-right mt-1">{{ generateForm.logoOpacity }}%</div>
                        </n-form-item>

                        <n-form-item :label="$t('other.qrcode.logoRadius')">
                          <n-slider 
                            v-model:value="generateForm.logoRadius" 
                            :min="0" 
                            :max="50" 
                            :step="5" 
                            @update:value="onLogoSettingChange"
                          />
                          <div class="text-right mt-1">{{ generateForm.logoRadius }}%</div>
                        </n-form-item>
                      </n-space>
                    </div>
                  </n-space>
                </n-card>
              </n-collapse-item>
            </n-collapse>

            <n-space class="mt-4" v-if="qrCodeUrl">
              <n-button @click="downloadQRCode">
                {{ $t('common.download') }}
              </n-button>
              <n-button @click="copyQRCodeToClipboard">
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
            ref="uploadRef"
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
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="qrcode" />
    
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import ToolDescription from '@/components/common/ToolDescription.vue'

const { t } = useI18n()
const message = useMessage()

// 生成状态
const generating = ref(false)
let generateTimeout = null

// 生成二维码表单
const generateForm = reactive({
  content: '',
  size: 200,
  level: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  logoSize: 15,
  logoOpacity: 90,
  logoRadius: 10
})

// Logo相关状态
const logoFile = ref(null)
const logoUrl = ref('')

// 颜色预设
const colorPresets = [
  { name: 'Default', foreground: '#000000', background: '#FFFFFF' },
  { name: 'Blue', foreground: '#1890ff', background: '#FFFFFF' },
  { name: 'Green', foreground: '#52c41a', background: '#FFFFFF' },
  { name: 'Red', foreground: '#f5222d', background: '#FFFFFF' },
  { name: 'Purple', foreground: '#722ed1', background: '#FFFFFF' },
  { name: 'Orange', foreground: '#fa8c16', background: '#FFFFFF' }
]

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

// 上传组件引用
const uploadRef = ref(null)

// 防抖生成二维码
function debouncedGenerate() {
  if (generateTimeout) {
    clearTimeout(generateTimeout)
  }
  generateTimeout = setTimeout(() => {
    generateQRCode()
  }, 300)
}

// 内容变化时自动生成
function onContentChange() {
  if (generateForm.content.trim()) {
    debouncedGenerate()
  } else {
    qrCodeUrl.value = ''
  }
}

// 尺寸变化时自动更新
function onSizeChange() {
  if (generateForm.content.trim()) {
    debouncedGenerate()
  }
}

// 级别变化时自动更新
function onLevelChange() {
  if (generateForm.content.trim()) {
    generateQRCode()
  }
}

// 颜色变化时自动更新
function onColorChange() {
  if (generateForm.content.trim()) {
    generateQRCode()
  }
}

// Logo设置变化时自动更新
function onLogoSettingChange() {
  if (generateForm.content.trim()) {
    debouncedGenerate()
  }
}

// 应用颜色预设
function applyColorPreset(preset) {
  generateForm.foregroundColor = preset.foreground
  generateForm.backgroundColor = preset.background
  if (generateForm.content.trim()) {
    generateQRCode()
  }
}

// 重置颜色
function resetColors() {
  generateForm.foregroundColor = '#000000'
  generateForm.backgroundColor = '#FFFFFF'
  if (generateForm.content.trim()) {
    generateQRCode()
  }
}

// 处理Logo上传
function handleLogoUpload({ file }) {
  if (!file) return
  
  logoFile.value = file.file
  logoUrl.value = URL.createObjectURL(file.file)
  
  // 建议使用更高的容错级别
  if (generateForm.level === 'L' || generateForm.level === 'M') {
    message.info(t('other.qrcode.logoErrorCorrectionTip'))
  }
  
  if (generateForm.content.trim()) {
    generateQRCode()
  }
}

// 移除Logo
function removeLogo() {
  if (logoUrl.value) {
    URL.revokeObjectURL(logoUrl.value)
  }
  logoFile.value = null
  logoUrl.value = ''
  
  if (generateForm.content.trim()) {
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
    
    // 生成基础二维码
    const baseQRCode = await QRCode.toDataURL(generateForm.content, {
      width: generateForm.size,
      height: generateForm.size,
      margin: 2,
      errorCorrectionLevel: generateForm.level,
      color: {
        dark: generateForm.foregroundColor,
        light: generateForm.backgroundColor
      }
    })

    // 如果有Logo，则在Canvas上合成
    if (logoFile.value) {
      qrCodeUrl.value = await addLogoToQR(baseQRCode, logoFile.value)
    } else {
      qrCodeUrl.value = baseQRCode
    }
  } catch (err) {
    message.error(err.message || t('other.qrcode.generateFailed'))
  } finally {
    generating.value = false
  }
}

// 在二维码上添加Logo
function addLogoToQR(qrDataURL, logoFile) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // roundRect polyfill for older browsers
    if (!ctx.roundRect) {
      ctx.roundRect = function(x, y, width, height, radius) {
        this.beginPath()
        this.moveTo(x + radius, y)
        this.lineTo(x + width - radius, y)
        this.quadraticCurveTo(x + width, y, x + width, y + radius)
        this.lineTo(x + width, y + height - radius)
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        this.lineTo(x + radius, y + height)
        this.quadraticCurveTo(x, y + height, x, y + height - radius)
        this.lineTo(x, y + radius)
        this.quadraticCurveTo(x, y, x + radius, y)
        this.closePath()
      }
    }
    
    const qrImg = new Image()
    const logoImg = new Image()
    
    qrImg.onload = () => {
      canvas.width = qrImg.width
      canvas.height = qrImg.height
      
      // 绘制二维码
      ctx.drawImage(qrImg, 0, 0)
      
      logoImg.onload = () => {
        // 计算Logo尺寸和位置
        const logoSizeRatio = generateForm.logoSize / 100
        const logoSize = Math.min(canvas.width, canvas.height) * logoSizeRatio
        
        // 添加白色背景区域（比Logo稍大）
        const backgroundSize = logoSize * 1.2
        const backgroundX = (canvas.width - backgroundSize) / 2
        const backgroundY = (canvas.height - backgroundSize) / 2
        
        // 计算Logo位置（在白色背景中心）
        const logoX = (canvas.width - logoSize) / 2
        const logoY = (canvas.height - logoSize) / 2
        
        // 保存当前状态
        ctx.save()
        
        // 绘制白色背景（提高识别率）
        ctx.fillStyle = generateForm.backgroundColor
        if (generateForm.logoRadius > 0) {
          const backgroundRadius = backgroundSize * (generateForm.logoRadius / 100)
          ctx.beginPath()
          ctx.roundRect(backgroundX, backgroundY, backgroundSize, backgroundSize, backgroundRadius)
          ctx.fill()
        } else {
          ctx.fillRect(backgroundX, backgroundY, backgroundSize, backgroundSize)
        }
        
        // 设置Logo透明度
        ctx.globalAlpha = generateForm.logoOpacity / 100
        
        // 创建Logo的圆角剪切路径
        if (generateForm.logoRadius > 0) {
          const logoRadius = logoSize * (generateForm.logoRadius / 100)
          ctx.beginPath()
          ctx.roundRect(logoX, logoY, logoSize, logoSize, logoRadius)
          ctx.clip()
        }
        
        // 绘制Logo
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
        
        // 恢复状态
        ctx.restore()
        
        resolve(canvas.toDataURL())
      }
      
      logoImg.onerror = () => reject(new Error('Logo加载失败'))
      logoImg.src = URL.createObjectURL(logoFile)
    }
    
    qrImg.onerror = () => reject(new Error('二维码加载失败'))
    qrImg.src = qrDataURL
  })
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
  if (generateForm.content.trim()) {
    generateQRCode()
  }
}

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    decodeError.value = ''
    decodeResult.value = ''
    
    // 清理之前的预览URL
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    
    // 创建新的预览
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
  } finally {
    // 清除上传组件的文件列表，允许重复上传同一文件
    if (uploadRef.value) {
      uploadRef.value.clear()
    }
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

.mt-1 {
  margin-top: 4px;
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

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
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

.logo-upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.logo-controls {
  width: 100%;
}

.logo-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  position: relative;
}

.remove-logo-btn {
  margin-left: auto;
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

/* 颜色预设按钮样式 */
.n-space .n-button {
  border: 2px solid #d9d9d9;
  font-weight: 500;
}

.n-space .n-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>