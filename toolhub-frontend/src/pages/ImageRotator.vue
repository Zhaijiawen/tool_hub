<template>
  <div class="image-rotator">
    <n-card :title="t('tools.imageRotator.title')">
      <n-form>
        <n-form-item :label="t('tools.imageRotator.upload')">
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
                <n-text>{{ t('tools.imageRotator.selectImage') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>

        <template v-if="originalImage">
          <n-form-item :label="t('tools.imageRotator.angle')">
            <n-slider
              v-model:value="rotationAngle"
              :min="0"
              :max="360"
              :step="90"
              :marks="rotationMarks"
              @update:value="handleRotationChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageRotator.preview')">
            <div class="preview-container">
              <div class="preview-item">
                <h4>{{ t('tools.imageRotator.original') }}</h4>
                <img :src="originalImage" alt="Original" />
                <div class="image-info">
                  <span>{{ formatFileSize(originalSize) }}</span>
                </div>
              </div>
              <div class="preview-item">
                <h4>{{ t('tools.imageRotator.rotated') }}</h4>
                <img :src="rotatedImage" alt="Rotated" />
                <div class="image-info">
                  <span>{{ formatFileSize(rotatedSize) }}</span>
                </div>
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button
                type="primary"
                @click="downloadRotatedImage"
                :disabled="!rotatedImage"
              >
                {{ t('tools.imageRotator.download') }}
              </n-button>
              <n-button @click="resetRotator">
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
const rotatedImage = ref<string | null>(null);
const originalSize = ref(0);
const rotatedSize = ref(0);
const rotationAngle = ref(0);

const rotationMarks = {
  0: '0°',
  90: '90°',
  180: '180°',
  270: '270°',
  360: '360°'
};

function handleFileChange(options: { file: File }) {
  const file = options.file;
  if (!file) return;

  originalSize.value = file.size;
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string;
    handleRotationChange(rotationAngle.value);
  };
  reader.readAsDataURL(file);
}

function handleRotationChange(angle: number) {
  if (!originalImage.value) return;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算旋转后的画布尺寸
    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const width = img.width * cos + img.height * sin;
    const height = img.width * sin + img.height * cos;

    canvas.width = width;
    canvas.height = height;

    // 设置旋转中心点
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    rotatedImage.value = canvas.toDataURL('image/png');
    rotatedSize.value = Math.ceil((rotatedImage.value.length * 3) / 4);
  };
  img.src = originalImage.value;
}

function downloadRotatedImage() {
  if (!rotatedImage.value) return;

  const link = document.createElement('a');
  link.href = rotatedImage.value;
  link.download = `rotated_${rotationAngle.value}deg.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success(t('tools.imageRotator.downloadSuccess'));
}

function resetRotator() {
  originalImage.value = null;
  rotatedImage.value = null;
  originalSize.value = 0;
  rotatedSize.value = 0;
  rotationAngle.value = 0;
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
.image-rotator {
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