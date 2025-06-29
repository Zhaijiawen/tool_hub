<template>
  <div class="hex-codec">
    <n-card :title="t('encrypt.hex.title')" :description="t('encrypt.hex.description')">
      <!-- 文本输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.hex.textInput') }}</n-text>
        <n-input 
          v-model:value="textInput" 
          type="textarea" 
          :placeholder="t('encrypt.hex.textInputPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }"
          @input="onTextInput"
        />
        <div class="input-info" v-if="textInput">
          <n-text depth="3">{{ t('common.charCount') }}：{{ textInput.length }} {{ t('common.characters') }}</n-text>
        </div>
      </div>

      <!-- 图片输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.hex.imageInput') }}</n-text>
        <div v-if="!imagePreview" class="upload-container">
          <n-upload
            v-model:file-list="fileList"
            :max="1"
            :show-file-list="false"
            accept="image/*"
            @change="onImageUpload"
          >
            <n-upload-dragger>
              <div class="upload-area">
                <n-icon size="48" :depth="3">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,4H5A3,3 0 0,0 2,7V17A3,3 0 0,0 5,20H19A3,3 0 0,0 22,17V7A3,3 0 0,0 19,4M19,18H5A1,1 0 0,1 4,17V7A1,1 0 0,1 5,6H19A1,1 0 0,1 20,7V17A1,1 0 0,1 19,18M17,8A2,2 0 0,0 15,6A2,2 0 0,0 13,8A2,2 0 0,0 15,10A2,2 0 0,0 17,8M17,18H5L8,13L10,15L13,11L17,18Z" />
                  </svg>
                </n-icon>
                <p>{{ t('encrypt.hex.uploadText') }}</p>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" :alt="t('encrypt.hex.imagePreview')" />
          <div class="image-info">
            <n-text depth="3">{{ t('encrypt.hex.imageSize') }}：{{ imageSize }}</n-text>
          </div>
          <n-button 
            @click="clearImageInput" 
            size="small" 
            type="error" 
            ghost
            style="margin-top: 8px;"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </template>
            {{ t('common.clear') }}
          </n-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="handleEncode" type="primary" :disabled="!hasInput">
          {{ t('encrypt.hex.encode') }}
        </n-button>
        <n-button @click="handleDecode" type="info" :disabled="!hasInput">
          {{ t('encrypt.hex.decode') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <n-text>{{ t('common.output') }}</n-text>
        <div v-if="textOutput">
          <n-input 
            v-model:value="textOutput" 
            type="textarea" 
            :placeholder="t('encrypt.hex.textOutputPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 10 }" 
            readonly 
          />
          <div class="output-actions">
            <n-space>
              <n-button @click="copyTextOutput" size="small">
                {{ t('common.copy') }}
              </n-button>
              <n-text depth="3">{{ t('common.charCount') }}：{{ textOutput.length }} {{ t('common.characters') }}</n-text>
            </n-space>
          </div>
        </div>
        <div v-if="decodedImage" class="decoded-image">
          <img :src="decodedImage" :alt="t('encrypt.hex.decodedImage')" />
          <div class="output-actions">
            <n-button @click="downloadImage" size="small">
              {{ t('encrypt.hex.downloadImage') }}
            </n-button>
          </div>
        </div>
        <div v-if="!textOutput && !decodedImage" class="output-placeholder">
          <n-text depth="3">{{ t('encrypt.hex.outputPlaceholder') }}</n-text>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const textInput = ref('')
const textOutput = ref('')
const error = ref('')
const isProcessing = ref(false)
const fileList = ref([])
const imagePreview = ref('')
const imageSize = ref('')
const decodedImage = ref('')

// 检查是否有输入
const hasInput = computed(() => {
  return textInput.value.trim() || imagePreview.value
})

// 文本输入时自动清空图片
const onTextInput = () => {
  if (textInput.value) {
    if (imagePreview.value || fileList.value.length > 0) {
      message.info(t('encrypt.hex.clearedImageByText'))
    }
    imagePreview.value = ''
    imageSize.value = ''
    fileList.value = []
  }
}

// 图片上传时自动清空文本
const onImageUpload = (options) => {
  if (textInput.value) {
    message.info(t('encrypt.hex.clearedTextByImage'))
  }
  textInput.value = ''
  textOutput.value = ''
  decodedImage.value = ''
  error.value = ''
  const file = options.file
  if (file && file.file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
      imageSize.value = formatFileSize(file.file.size)
    }
    reader.readAsDataURL(file.file)
  }
}

// 清除图片输入
const clearImageInput = () => {
  imagePreview.value = ''
  imageSize.value = ''
  fileList.value = []
}

// 清空所有内容
const clearAll = () => {
  textInput.value = ''
  textOutput.value = ''
  error.value = ''
  fileList.value = []
  imagePreview.value = ''
  imageSize.value = ''
  decodedImage.value = ''
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 智能判断Hex内容类型
const detectHexType = (hexString) => {
  try {
    // 清理hex字符串
    const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '')
    if (cleanHex.length % 2 !== 0) {
      return 'invalid'
    }
    
    // 转换为字节数组
    const bytes = new Uint8Array(cleanHex.length / 2)
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16)
    }
    
    // 检查是否为图片
    const imageHeaders = [
      [0xFF, 0xD8, 0xFF], // JPEG
      [0x89, 0x50, 0x4E, 0x47], // PNG
      [0x47, 0x49, 0x46], // GIF
      [0x52, 0x49, 0x46, 0x46], // WebP
      [0x42, 0x4D], // BMP
      [0x49, 0x49, 0x2A, 0x00], // TIFF little-endian
      [0x4D, 0x4D, 0x00, 0x2A], // TIFF big-endian
    ]
    
    for (const header of imageHeaders) {
      if (header.every((byte, index) => bytes[index] === byte)) {
        return 'image'
      }
    }
    
    // 尝试转换为文本
    try {
      const text = new TextDecoder().decode(bytes)
      if (/^[\s\S]*$/.test(text)) {
        return 'text'
      }
    } catch (e) {}
    
    return 'binary'
  } catch (e) {
    return 'invalid'
  }
}

// 编码处理
const handleEncode = () => {
  error.value = ''
  textOutput.value = ''
  decodedImage.value = ''
  
  if (textInput.value.trim()) {
    // 文本编码
    try {
      const text = textInput.value.trim()
      const encoder = new TextEncoder()
      const bytes = encoder.encode(text)
      textOutput.value = Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
    } catch (e) {
      error.value = t('common.invalidInput')
    }
  } else if (imagePreview.value) {
    // 图片编码
    try {
      // 从 data URL 提取 base64 数据
      const base64Data = imagePreview.value.split(',')[1]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      textOutput.value = Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
    } catch (e) {
      error.value = t('common.invalidInput')
    }
  } else {
    error.value = t('encrypt.hex.inputRequired')
  }
}

// 解码处理
const handleDecode = () => {
  error.value = ''
  textOutput.value = ''
  decodedImage.value = ''
  
  if (textInput.value.trim()) {
    // 文本解码
    const detectedType = detectHexType(textInput.value.trim())
    if (detectedType === 'image') {
      try {
        const cleanHex = textInput.value.trim().replace(/[^0-9a-fA-F]/g, '')
        const bytes = new Uint8Array(cleanHex.length / 2)
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16)
        }
        const blob = new Blob([bytes], { type: 'image/png' })
        decodedImage.value = URL.createObjectURL(blob)
      } catch (e) {
        error.value = t('common.invalidInput')
      }
    } else if (detectedType === 'text') {
      try {
        const cleanHex = textInput.value.trim().replace(/[^0-9a-fA-F]/g, '')
        const bytes = new Uint8Array(cleanHex.length / 2)
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16)
        }
        textOutput.value = new TextDecoder().decode(bytes)
      } catch (e) {
        error.value = t('common.invalidInput')
      }
    } else if (detectedType === 'binary') {
      try {
        const cleanHex = textInput.value.trim().replace(/[^0-9a-fA-F]/g, '')
        textOutput.value = `Binary data (${cleanHex.length / 2} bytes):\n${cleanHex.match(/.{2}/g).join(' ')}`
      } catch (e) {
        error.value = t('common.invalidInput')
      }
    } else {
      error.value = t('encrypt.hex.invalidHex')
    }
  } else if (imagePreview.value) {
    // 图片解码（其实就是显示图片）
    decodedImage.value = imagePreview.value
  } else {
    error.value = t('encrypt.hex.inputRequired')
  }
}

// 复制文本输出
const copyTextOutput = async () => {
  try {
    await navigator.clipboard.writeText(textOutput.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 下载图片
const downloadImage = () => {
  if (decodedImage.value) {
    const link = document.createElement('a')
    link.href = decodedImage.value
    link.download = 'decoded-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    message.success(t('encrypt.hex.downloadSuccess'))
  }
}
</script>

<style scoped>
.hex-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.input-section {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  background: none;
  padding: 0;
}
.input-info {
  margin-top: 8px;
}
.upload-container {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  text-align: center;
}
.upload-area {
  text-align: center;
  padding: 20px;
}
.image-preview {
  text-align: center;
  margin-bottom: 8px;
}
.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.image-info {
  margin-top: 8px;
}
.button-group {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.output-section {
  width: 100%;
  margin-bottom: 16px;
  border: none;
  background: none;
  padding: 0;
}
.output-actions {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.decoded-image {
  text-align: center;
}
.decoded-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.output-placeholder {
  text-align: center;
  padding: 40px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #fafafa;
}
.error-alert {
  margin-top: 16px;
}
</style>