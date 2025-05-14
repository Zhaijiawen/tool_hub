<template>
  <div class="image-watermarker">
    <n-card :title="t('tools.imageWatermarker.title')">
      <n-form>
        <n-form-item :label="t('tools.imageWatermarker.upload')">
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
                <n-text>{{ t('tools.imageWatermarker.selectImage') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>

        <template v-if="originalImage">
          <n-form-item :label="t('tools.imageWatermarker.watermarkText')">
            <n-input
              v-model:value="watermarkText"
              :placeholder="t('tools.imageWatermarker.watermarkTextPlaceholder')"
              @update:value="handleWatermarkChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageWatermarker.watermarkPosition')">
            <n-select
              v-model:value="watermarkPosition"
              :options="positionOptions"
              @update:value="handleWatermarkChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageWatermarker.watermarkColor')">
            <n-color-picker
              v-model:value="watermarkColor"
              :show-alpha="true"
              @update:value="handleWatermarkChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageWatermarker.watermarkSize')">
            <n-slider
              v-model:value="watermarkSize"
              :min="12"
              :max="72"
              :step="1"
              @update:value="handleWatermarkChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageWatermarker.watermarkOpacity')">
            <n-slider
              v-model:value="watermarkOpacity"
              :min="0"
              :max="1"
              :step="0.1"
              @update:value="handleWatermarkChange"
            />
          </n-form-item>

          <n-form-item :label="t('tools.imageWatermarker.preview')">
            <div class="preview-container">
              <div class="preview-item">
                <h4>{{ t('tools.imageWatermarker.original') }}</h4>
                <img :src="originalImage" alt="Original" />
                <div class="image-info">
                  <span>{{ formatFileSize(originalSize) }}</span>
                </div>
              </div>
              <div class="preview-item">
                <h4>{{ t('tools.imageWatermarker.watermarked') }}</h4>
                <img :src="watermarkedImage" alt="Watermarked" />
                <div class="image-info">
                  <span>{{ formatFileSize(watermarkedSize) }}</span>
                </div>
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button
                type="primary"
                @click="downloadWatermarkedImage"
                :disabled="!watermarkedImage"
              >
                {{ t('tools.imageWatermarker.download') }}
              </n-button>
              <n-button @click="resetWatermarker">
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

const { t } = useI18n();
const message = useMessage();

const originalImage = ref<string | null>(null);
const watermarkedImage = ref<string | null>(null);
const originalSize = ref(0);
const watermarkedSize = ref(0);
const watermarkText = ref('');
const watermarkPosition = ref('center');
const watermarkColor = ref('#ffffff');
const watermarkSize = ref(24);
const watermarkOpacity = ref(0.5);

const positionOptions = [
  { label: t('tools.imageWatermarker.topLeft'), value: 'topLeft' },
  { label: t('tools.imageWatermarker.topRight'), value: 'topRight' },
  { label: t('tools.imageWatermarker.center'), value: 'center' },
  { label: t('tools.imageWatermarker.bottomLeft'), value: 'bottomLeft' },
  { label: t('tools.imageWatermarker.bottomRight'), value: 'bottomRight' }
];

function handleFileChange(options: { file: File }) {
  const file = options.file;
  if (!file) return;

  originalSize.value = file.size;
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string;
    handleWatermarkChange();
  };
  reader.readAsDataURL(file);
}

function handleWatermarkChange() {
  if (!originalImage.value || !watermarkText.value) return;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    // 绘制原始图片
    ctx.drawImage(img, 0, 0);

    // 设置水印样式
    ctx.font = `${watermarkSize.value}px Arial`;
    ctx.fillStyle = watermarkColor.value;
    ctx.globalAlpha = watermarkOpacity.value;

    // 计算水印位置
    const textMetrics = ctx.measureText(watermarkText.value);
    const textWidth = textMetrics.width;
    const textHeight = watermarkSize.value;

    let x = 0;
    let y = 0;

    switch (watermarkPosition.value) {
      case 'topLeft':
        x = 20;
        y = textHeight + 20;
        break;
      case 'topRight':
        x = canvas.width - textWidth - 20;
        y = textHeight + 20;
        break;
      case 'center':
        x = (canvas.width - textWidth) / 2;
        y = (canvas.height + textHeight) / 2;
        break;
      case 'bottomLeft':
        x = 20;
        y = canvas.height - 20;
        break;
      case 'bottomRight':
        x = canvas.width - textWidth - 20;
        y = canvas.height - 20;
        break;
    }

    // 绘制水印文字
    ctx.fillText(watermarkText.value, x, y);

    watermarkedImage.value = canvas.toDataURL('image/png');
    watermarkedSize.value = Math.ceil((watermarkedImage.value.length * 3) / 4);
  };
  img.src = originalImage.value;
}

function downloadWatermarkedImage() {
  if (!watermarkedImage.value) return;

  const link = document.createElement('a');
  link.href = watermarkedImage.value;
  link.download = 'watermarked_image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success(t('tools.imageWatermarker.downloadSuccess'));
}

function resetWatermarker() {
  originalImage.value = null;
  watermarkedImage.value = null;
  originalSize.value = 0;
  watermarkedSize.value = 0;
  watermarkText.value = '';
  watermarkPosition.value = 'center';
  watermarkColor.value = '#ffffff';
  watermarkSize.value = 24;
  watermarkOpacity.value = 0.5;
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
.image-watermarker {
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