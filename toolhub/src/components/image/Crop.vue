<template>
  <n-card :title="$t('image.crop.title')">
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
            {{ $t('image.crop.upload') }}
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>

    <div v-if="originalImage" class="mt-4">
      <div class="crop-container">
        <vue-cropper
          ref="cropper"
          :img="originalImage"
          :output-size="1"
          :output-type="'png'"
          :info="true"
          :full="true"
          :can-move="false"
          :can-scale="false"
          :auto-crop="true"
          :fixed="true"
          :fixed-number="[1, 1]"
          :center-box="true"
          :info-true="true"
          :high="true"
        />
      </div>

      <n-space class="mt-4">
        <n-button type="primary" @click="cropImage">
          {{ $t('image.crop.crop') }}
        </n-button>
        <n-button @click="downloadImage" :disabled="!croppedImage">
          {{ $t('image.crop.download') }}
        </n-button>
      </n-space>

      <div class="preview-container mt-4">
        <div class="preview-item">
          <h3>{{ $t('image.crop.original') }}</h3>
          <n-image
            :src="originalImage"
            :alt="$t('image.crop.original')"
            width="300"
          />
        </div>

        <div v-if="croppedImage" class="preview-item">
          <h3>{{ $t('image.crop.cropped') }}</h3>
          <n-image
            :src="croppedImage"
            :alt="$t('image.crop.cropped')"
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
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const { t } = useI18n()
const message = useMessage()

// 状态变量
const originalImage = ref('')
const croppedImage = ref('')
const error = ref('')
const cropper = ref(null)

// 处理文件上传
async function handleFileChange({ file }) {
  if (!file) return

  try {
    // 检查文件类型
    if (!file.file.type.startsWith('image/')) {
      throw new Error(t('image.crop.invalidFileType'))
    }

    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage.value = e.target.result
      croppedImage.value = ''
      error.value = ''
    }
    reader.readAsDataURL(file.file)
  } catch (err) {
    error.value = err.message
  }
}

// 裁剪图片
async function cropImage() {
  try {
    if (!originalImage.value) {
      throw new Error(t('image.crop.noImage'))
    }

    // 获取裁剪后的图片
    const canvas = await cropper.value.getCropData()
    croppedImage.value = canvas
    error.value = ''
  } catch (err) {
    error.value = err.message
  }
}

// 下载裁剪后的图片
function downloadImage() {
  if (!croppedImage.value) return

  const link = document.createElement('a')
  link.href = croppedImage.value
  link.download = 'cropped.png'
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

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.crop-container {
  width: 100%;
  height: 400px;
  background-color: #f5f5f5;
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