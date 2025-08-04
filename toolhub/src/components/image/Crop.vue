<template>
  <div class="image-crop">
    <n-card :title="$t('image.crop.title')" :bordered="false">
      <n-space vertical size="large">
        <n-upload
          :max="1"
          accept="image/*"
          :show-file-list="false"
          @change="onFileChange"
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

        <div v-if="imgSrc" class="editor-container">
          <div class="cropper-wrapper">
            <cropper
              ref="cropperRef"
              class="advanced-cropper"
              :src="imgSrc"
              :stencil-props="{ aspectRatio: aspectRatio }"
              @change="onCropChange"
            />
          </div>
          <div class="preview-box">
            <h4>{{ $t('image.crop.preview') }}</h4>
            <img v-if="croppedImg" :src="croppedImg" alt="Cropped Result" style="max-width: 100%;" />
            <div v-else class="preview-placeholder">{{ $t('image.crop.preview') }}</div>
          </div>
          <n-divider>{{ $t('image.crop.options') }}</n-divider>
          <n-form-item :label="$t('image.crop.aspectRatio')">
            <n-radio-group v-model:value="aspectRatio" size="small">
              <n-radio-button :value="undefined">{{ $t('image.crop.aspectRatios.free') }}</n-radio-button>
              <n-radio-button :value="1">1:1</n-radio-button>
              <n-radio-button :value="4/3">4:3</n-radio-button>
              <n-radio-button :value="16/9">16:9</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="$t('image.crop.actions')">
            <n-button-group>
              <n-button @click="zoom(1.1)"><n-icon><zoom-in-outlined /></n-icon></n-button>
              <n-button @click="zoom(0.9)"><n-icon><zoom-out-outlined /></n-icon></n-button>
              <n-button @click="reset"><n-icon><reload-outlined /></n-icon></n-button>
            </n-button-group>
          </n-form-item>
          <n-divider />
          <n-space vertical>
            <n-button @click="downloadImage" type="primary" :disabled="!croppedImg">
              {{ $t('image.crop.download') }}
            </n-button>
          </n-space>
        </div>
        <!-- 使用说明 -->
        <div class="info-section" v-if="!imgSrc">
          <n-alert type="info" :title="t('image.crop.infoTitle')">
            {{ t('image.crop.infoContent') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="image" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useI18n } from 'vue-i18n'
import {
  NCard, NButton, NUpload, NSpace, NIcon, NUploadDragger, NText, NDivider,
  NRadioGroup, NRadioButton, NFormItem, NButtonGroup, NAlert
} from 'naive-ui'
import { UploadOutlined, ZoomInOutlined, ZoomOutOutlined, ReloadOutlined } from '@vicons/antd'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()

const imgSrc = ref('')
const croppedImg = ref('')
const cropperRef = ref(null)
const aspectRatio = ref(undefined)
let cropResult = null

function onFileChange({ file }) {
  if (file && file.file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imgSrc.value = e.target.result
    }
    reader.readAsDataURL(file.file)
  }
}

function onCropChange({ canvas, coordinates }) {
  cropResult = { canvas, coordinates }
  croppedImg.value = canvas.toDataURL()
}

function downloadImage() {
  if (cropResult && cropResult.canvas) {
    const link = document.createElement('a')
    link.href = cropResult.canvas.toDataURL()
    link.download = 'cropped-image.png'
    link.click()
  }
}

function zoom(factor) {
  if (cropperRef.value) {
    cropperRef.value.zoom(factor)
  }
}

function reset() {
  if (cropperRef.value) {
    cropperRef.value.reset()
  }
}
</script>

<style scoped>
.image-crop {
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

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cropper-wrapper {
  height: 400px;
  width: 100%;
  background-color: #f0f0f0;
}

.advanced-cropper {
  height: 100%;
  width: 100%;
}

.preview-box {
  width: 100%;
  height: 200px;
  border: 1px dashed var(--n-border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.preview-box img {
  max-width: 100%;
  max-height: 100%;
}

.preview-placeholder {
  color: var(--n-text-color-disabled);
}

.info-section {
  margin-top: 16px;
}
</style>
