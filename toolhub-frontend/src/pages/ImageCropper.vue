<template>
  <div class="image-cropper">
    <n-card :title="t('tools.imageCropper.title')">
      <n-form>
        <n-form-item :label="t('tools.imageCropper.upload')">
          <n-upload
            accept="image/*"
            :max="1"
            :show-file-list="false"
            @change="handleFileChange"
          >
            <n-upload-dragger>
              <div class="upload-area">
                <n-icon size="48" :depth="3">
                  <image-icon />
                </n-icon>
                <n-text>{{ t('tools.imageCropper.selectImage') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>

        <template v-if="originalImage">
          <n-form-item :label="t('tools.imageCropper.aspectRatio')">
            <n-select
              v-model:value="aspectRatio"
              :options="aspectRatioOptions"
              @update:value="handleAspectRatioChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageCropper.preview')">
            <div class="preview-container">
              <div class="cropper-container">
                <vue-cropper
                  ref="cropper"
                  :img="originalImage"
                  :output-size="1"
                  :output-type="'png'"
                  :info="true"
                  :full="true"
                  :can-move="false"
                  :can-scale="true"
                  :auto-crop="true"
                  :fixed="true"
                  :fixed-number="aspectRatio"
                  :center-box="true"
                  :info-true="true"
                  :high="true"
                  @real-time="handleCrop"
                />
              </div>
              <div class="preview-item">
                <h4>{{ t('tools.imageCropper.cropped') }}</h4>
                <img :src="croppedImage" alt="Cropped" />
                <div class="image-info">
                  <span>{{ formatFileSize(croppedSize) }}</span>
                </div>
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button
                type="primary"
                @click="downloadCroppedImage"
                :disabled="!croppedImage"
              >
                {{ t('tools.imageCropper.download') }}
              </n-button>
              <n-button @click="resetCropper">
                {{ t('common.clear') }}
              </n-button>
            </n-space>
          </n-form-item>
        </template>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { Image as ImageIcon } from '@vicons/ionicons5';
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css';

const { t } = useI18n();
const message = useMessage();

const originalImage = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const croppedSize = ref(0);
const aspectRatio = ref([1, 1]);

const aspectRatioOptions = [
  { label: '1:1', value: [1, 1] },
  { label: '4:3', value: [4, 3] },
  { label: '16:9', value: [16, 9] },
  { label: '3:4', value: [3, 4] },
  { label: '9:16', value: [9, 16] },
  { label: '自由比例', value: [] }
];

function handleFileChange(options: { file: File }) {
  const file = options.file;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function handleAspectRatioChange(value: number[]) {
  aspectRatio.value = value;
}

function handleCrop(data: { base64: string }) {
  croppedImage.value = data.base64;
  
  // 计算裁剪后的大小
  const base64Str = data.base64.split(',')[1];
  croppedSize.value = Math.ceil((base64Str.length * 3) / 4);
}

function downloadCroppedImage() {
  if (!croppedImage.value) return;

  const link = document.createElement('a');
  link.href = croppedImage.value;
  link.download = 'cropped_image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success(t('tools.imageCropper.downloadSuccess'));
}

function resetCropper() {
  originalImage.value = null;
  croppedImage.value = null;
  croppedSize.value = 0;
  aspectRatio.value = [1, 1];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.image-cropper {
  max-width: 800px;
  margin: 0 auto;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 12px;
}

.preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 12px;
}

.cropper-container {
  width: 100%;
  height: 400px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.preview-item img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
}

.image-info {
  display: flex;
  gap: 12px;
  color: #666;
  font-size: 14px;
}
</style> 