<template>
  <div class="image-compressor">
    <n-card :title="t('tools.imageCompressor.title')">
      <n-form>
        <n-form-item :label="t('tools.imageCompressor.upload')">
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
                <n-text>{{ t('tools.imageCompressor.selectImage') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>

        <template v-if="originalImage">
          <n-form-item :label="t('tools.imageCompressor.quality')">
            <n-slider
              v-model:value="quality"
              :min="0"
              :max="100"
              :step="1"
              @update:value="handleCompression"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageCompressor.preview')">
            <div class="preview-container">
              <div class="preview-item">
                <h4>{{ t('tools.imageCompressor.original') }}</h4>
                <img :src="originalImage" alt="Original" />
                <div class="image-info">
                  <span>{{ formatFileSize(originalSize) }}</span>
                </div>
              </div>
              <div class="preview-item">
                <h4>{{ t('tools.imageCompressor.compressed') }}</h4>
                <img :src="compressedImage" alt="Compressed" />
                <div class="image-info">
                  <span>{{ formatFileSize(compressedSize) }}</span>
                  <span>{{ compressionRatio }}%</span>
                </div>
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button
                type="primary"
                @click="downloadCompressedImage"
                :disabled="!compressedImage"
              >
                {{ t('tools.imageCompressor.download') }}
              </n-button>
              <n-button @click="resetCompressor">
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
const compressedImage = ref<string | null>(null);
const originalSize = ref(0);
const compressedSize = ref(0);
const quality = ref(80);

const compressionRatio = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0;
  return Math.round((1 - compressedSize.value / originalSize.value) * 100);
});

function handleFileChange(options: { file: File }) {
  const file = options.file;
  if (!file) return;

  originalSize.value = file.size;
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string;
    handleCompression();
  };
  reader.readAsDataURL(file);
}

function handleCompression() {
  if (!originalImage.value) return;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    // 绘制图片
    ctx.drawImage(img, 0, 0);

    // 压缩图片
    compressedImage.value = canvas.toDataURL('image/jpeg', quality.value / 100);
    compressedSize.value = Math.ceil((compressedImage.value.length * 3) / 4);
  };
  img.src = originalImage.value;
}

function downloadCompressedImage() {
  if (!compressedImage.value) return;

  const link = document.createElement('a');
  link.href = compressedImage.value;
  link.download = 'compressed_image.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success(t('tools.imageCompressor.downloadSuccess'));
}

function resetCompressor() {
  originalImage.value = null;
  compressedImage.value = null;
  originalSize.value = 0;
  compressedSize.value = 0;
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
.image-compressor {
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