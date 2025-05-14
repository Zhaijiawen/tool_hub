<template>
  <div class="image-watermark-remover">
    <n-card :title="t('tools.imageWatermarkRemover.title')">
      <n-form>
        <n-form-item :label="t('tools.imageWatermarkRemover.upload')">
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
                <n-text>{{ t('tools.imageWatermarkRemover.selectImage') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>

        <template v-if="originalImage">
          <n-form-item :label="t('tools.imageWatermarkRemover.selectArea')">
            <div class="canvas-container">
              <canvas
                ref="canvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
              ></canvas>
              <div class="canvas-overlay" v-if="isDrawing">
                <div
                  class="selection-box"
                  :style="{
                    left: selectionBox.x + 'px',
                    top: selectionBox.y + 'px',
                    width: selectionBox.width + 'px',
                    height: selectionBox.height + 'px'
                  }"
                ></div>
              </div>
            </div>
          </n-form-item>

          <n-form-item :label="t('tools.imageWatermarkRemover.preview')">
            <div class="preview-container">
              <div class="preview-item">
                <h4>{{ t('tools.imageWatermarkRemover.original') }}</h4>
                <img :src="originalImage" alt="Original" />
                <div class="image-info">
                  <span>{{ formatFileSize(originalSize) }}</span>
                </div>
              </div>
              <div class="preview-item">
                <h4>{{ t('tools.imageWatermarkRemover.removed') }}</h4>
                <img :src="processedImage" alt="Processed" />
                <div class="image-info">
                  <span>{{ formatFileSize(processedSize) }}</span>
                </div>
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button
                type="primary"
                @click="processImage"
                :disabled="!hasSelection"
              >
                {{ t('tools.imageWatermarkRemover.process') }}
              </n-button>
              <n-button
                type="primary"
                @click="downloadProcessedImage"
                :disabled="!processedImage"
              >
                {{ t('tools.imageWatermarkRemover.download') }}
              </n-button>
              <n-button @click="resetRemover">
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

const canvas = ref<HTMLCanvasElement | null>(null);
const originalImage = ref<string | null>(null);
const processedImage = ref<string | null>(null);
const originalSize = ref(0);
const processedSize = ref(0);
const isDrawing = ref(false);
const startPoint = ref({ x: 0, y: 0 });
const selectionBox = ref({ x: 0, y: 0, width: 0, height: 0 });

const hasSelection = computed(() => {
  return selectionBox.value.width > 0 && selectionBox.value.height > 0;
});

function handleFileChange(options: { file: File }) {
  const file = options.file;
  if (!file) return;

  originalSize.value = file.size;
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string;
    resetCanvas();
  };
  reader.readAsDataURL(file);
}

function resetCanvas() {
  if (!canvas.value || !originalImage.value) return;

  const img = new Image();
  img.onload = () => {
    canvas.value!.width = img.width;
    canvas.value!.height = img.height;
    const ctx = canvas.value!.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
  };
  img.src = originalImage.value;
}

function startDrawing(event: MouseEvent) {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  isDrawing.value = true;
  startPoint.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  selectionBox.value = {
    x: startPoint.value.x,
    y: startPoint.value.y,
    width: 0,
    height: 0
  };
}

function draw(event: MouseEvent) {
  if (!isDrawing.value || !canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  const currentPoint = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  selectionBox.value = {
    x: Math.min(startPoint.value.x, currentPoint.x),
    y: Math.min(startPoint.value.y, currentPoint.y),
    width: Math.abs(currentPoint.x - startPoint.value.x),
    height: Math.abs(currentPoint.y - startPoint.value.y)
  };
}

function stopDrawing() {
  isDrawing.value = false;
}

function processImage() {
  if (!canvas.value || !originalImage.value || !hasSelection.value) return;

  const img = new Image();
  img.onload = () => {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 获取选中区域的图像数据
    const imageData = ctx.getImageData(
      selectionBox.value.x,
      selectionBox.value.y,
      selectionBox.value.width,
      selectionBox.value.height
    );

    // 使用内容感知填充算法处理选中区域
    const processedData = contentAwareFill(imageData);

    // 将处理后的数据放回画布
    ctx.putImageData(processedData, selectionBox.value.x, selectionBox.value.y);

    processedImage.value = tempCanvas.toDataURL('image/png');
    processedSize.value = Math.ceil((processedImage.value.length * 3) / 4);
  };
  img.src = originalImage.value;
}

function contentAwareFill(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  const result = new Uint8ClampedArray(data);

  // 简单的模糊处理
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // 计算周围像素的平均值
      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nidx = (ny * width + nx) * 4;
            sumR += data[nidx];
            sumG += data[nidx + 1];
            sumB += data[nidx + 2];
            count++;
          }
        }
      }

      // 应用模糊效果
      result[idx] = sumR / count;
      result[idx + 1] = sumG / count;
      result[idx + 2] = sumB / count;
      result[idx + 3] = a;
    }
  }

  return new ImageData(result, width, height);
}

function downloadProcessedImage() {
  if (!processedImage.value) return;

  const link = document.createElement('a');
  link.href = processedImage.value;
  link.download = 'watermark_removed_image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success(t('tools.imageWatermarkRemover.downloadSuccess'));
}

function resetRemover() {
  originalImage.value = null;
  processedImage.value = null;
  originalSize.value = 0;
  processedSize.value = 0;
  selectionBox.value = { x: 0, y: 0, width: 0, height: 0 };
  resetCanvas();
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
.image-watermark-remover {
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

.canvas-container {
  position: relative;
  margin-top: 12px;
}

canvas {
  max-width: 100%;
  border: 1px solid #eee;
  border-radius: 4px;
}

.canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.selection-box {
  position: absolute;
  border: 2px dashed #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
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