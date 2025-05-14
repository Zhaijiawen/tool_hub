<template>
  <div class="image-converter">
    <n-card :title="t('tools.imageConverter.title')">
      <n-form>
        <n-form-item :label="t('tools.imageConverter.upload')">
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
                <n-text>{{ t('tools.imageConverter.selectImage') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>

        <template v-if="originalImage">
          <n-form-item :label="t('tools.imageConverter.targetFormat')">
            <n-select
              v-model:value="targetFormat"
              :options="formatOptions"
              @update:value="handleFormatChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageConverter.quality')">
            <n-slider
              v-model:value="quality"
              :min="0"
              :max="100"
              :step="1"
              :tooltip="true"
              @update:value="handleQualityChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageConverter.preview')">
            <div class="preview-container">
              <div class="preview-item">
                <h4>{{ t('tools.imageConverter.original') }}</h4>
                <img :src="originalImage" alt="Original" />
                <div class="image-info">
                  <span>{{ originalFormat }}</span>
                  <span>{{ formatFileSize(originalSize) }}</span>
                </div>
              </div>
              <div class="preview-item">
                <h4>{{ t('tools.imageConverter.converted') }}</h4>
                <img :src="convertedImage" alt="Converted" />
                <div class="image-info">
                  <span>{{ targetFormat }}</span>
                  <span>{{ formatFileSize(convertedSize) }}</span>
                </div>
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button
                type="primary"
                @click="downloadConvertedImage"
                :disabled="!convertedImage"
              >
                {{ t('tools.imageConverter.download') }}
              </n-button>
              <n-button @click="resetConverter">
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
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { Image as ImageIcon } from '@vicons/ionicons5';

const { t } = useI18n();
const message = useMessage();

const originalImage = ref<string | null>(null);
const convertedImage = ref<string | null>(null);
const originalSize = ref(0);
const convertedSize = ref(0);
const originalFormat = ref('');
const targetFormat = ref('image/jpeg');
const quality = ref(80);

const formatOptions = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG', value: 'image/png' },
  { label: 'WebP', value: 'image/webp' },
  { label: 'GIF', value: 'image/gif' }
];

function handleFileChange(options: { file: File }) {
  const file = options.file;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string;
    originalSize.value = file.size;
    originalFormat.value = file.type;
    convertImage(e.target?.result as string);
  };
  reader.readAsDataURL(file);
}

function handleFormatChange(value: string) {
  if (originalImage.value) {
    convertImage(originalImage.value);
  }
}

function handleQualityChange(value: number) {
  if (originalImage.value) {
    convertImage(originalImage.value);
  }
}

function convertImage(base64: string) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const convertedBase64 = canvas.toDataURL(targetFormat.value, quality.value / 100);
    convertedImage.value = convertedBase64;
    
    // 计算转换后的大小
    const base64Str = convertedBase64.split(',')[1];
    convertedSize.value = Math.ceil((base64Str.length * 3) / 4);
  };
  img.src = base64;
}

function downloadConvertedImage() {
  if (!convertedImage.value) return;

  const link = document.createElement('a');
  link.href = convertedImage.value;
  const extension = targetFormat.value.split('/')[1];
  link.download = `converted_image.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success(t('tools.imageConverter.downloadSuccess'));
}

function resetConverter() {
  originalImage.value = null;
  convertedImage.value = null;
  originalSize.value = 0;
  convertedSize.value = 0;
  originalFormat.value = '';
  targetFormat.value = 'image/jpeg';
  quality.value = 80;
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
.image-converter {
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