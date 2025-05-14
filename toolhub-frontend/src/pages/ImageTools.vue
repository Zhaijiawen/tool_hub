<template>
  <div class="image-tools">
    <n-card :title="t('tools.imageTools.title')">
      <n-tabs type="line" animated>
        <!-- 图片压缩 -->
        <n-tab-pane :name="1" :tab="t('tools.imageTools.compress')">
          <n-form>
            <n-form-item :label="t('tools.imageTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleCompressUpload"
              >
                <n-button>{{ t('tools.imageTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item :label="t('tools.imageTools.quality')">
              <n-slider
                v-model:value="compressQuality"
                :min="1"
                :max="100"
                :step="1"
                @update:value="handleCompress"
              />
            </n-form-item>
            <n-form-item v-if="compressedImage" :label="t('tools.imageTools.preview')">
              <div class="image-preview">
                <img :src="compressedImage" alt="Compressed" />
                <div class="image-info">
                  <p>{{ t('tools.imageTools.originalSize') }}: {{ originalSize }}</p>
                  <p>{{ t('tools.imageTools.compressedSize') }}: {{ compressedSize }}</p>
                </div>
              </div>
            </n-form-item>
            <div class="btn-group" v-if="compressedImage">
              <n-button @click="downloadCompressed">{{ t('tools.imageTools.download') }}</n-button>
              <n-button @click="clearCompress">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 图片转换 -->
        <n-tab-pane :name="2" :tab="t('tools.imageTools.convert')">
          <n-form>
            <n-form-item :label="t('tools.imageTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleConvertUpload"
              >
                <n-button>{{ t('tools.imageTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item :label="t('tools.imageTools.targetFormat')">
              <n-select
                v-model:value="targetFormat"
                :options="imageFormats"
                @update:value="handleConvert"
              />
            </n-form-item>
            <n-form-item v-if="convertedImage" :label="t('tools.imageTools.preview')">
              <div class="image-preview">
                <img :src="convertedImage" alt="Converted" />
              </div>
            </n-form-item>
            <div class="btn-group" v-if="convertedImage">
              <n-button @click="downloadConverted">{{ t('tools.imageTools.download') }}</n-button>
              <n-button @click="clearConvert">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 图片旋转 -->
        <n-tab-pane :name="3" :tab="t('tools.imageTools.rotate')">
          <n-form>
            <n-form-item :label="t('tools.imageTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleRotateUpload"
              >
                <n-button>{{ t('tools.imageTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item :label="t('tools.imageTools.angle')">
              <n-input-number
                v-model:value="rotateAngle"
                :min="0"
                :max="360"
                :step="90"
                @update:value="handleRotate"
              />
            </n-form-item>
            <n-form-item v-if="rotatedImage" :label="t('tools.imageTools.preview')">
              <div class="image-preview">
                <img :src="rotatedImage" alt="Rotated" />
              </div>
            </n-form-item>
            <div class="btn-group" v-if="rotatedImage">
              <n-button @click="downloadRotated">{{ t('tools.imageTools.download') }}</n-button>
              <n-button @click="clearRotate">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 图片裁剪 -->
        <n-tab-pane :name="4" :tab="t('tools.imageTools.crop')">
          <n-form>
            <n-form-item :label="t('tools.imageTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleCropUpload"
              >
                <n-button>{{ t('tools.imageTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item v-if="cropImage" :label="t('tools.imageTools.cropArea')">
              <div class="crop-container">
                <img :src="cropImage" alt="Crop" ref="cropImageRef" />
                <div class="crop-overlay" ref="cropOverlayRef"></div>
              </div>
            </n-form-item>
            <div class="btn-group" v-if="croppedImage">
              <n-button @click="downloadCropped">{{ t('tools.imageTools.download') }}</n-button>
              <n-button @click="clearCrop">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 图片水印 -->
        <n-tab-pane :name="5" :tab="t('tools.imageTools.watermark')">
          <n-form>
            <n-form-item :label="t('tools.imageTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleWatermarkUpload"
              >
                <n-button>{{ t('tools.imageTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item :label="t('tools.imageTools.watermarkText')">
              <n-input
                v-model:value="watermarkText"
                :placeholder="t('tools.imageTools.watermarkTextPlaceholder')"
                @update:value="handleWatermark"
              />
            </n-form-item>
            <n-form-item :label="t('tools.imageTools.watermarkPosition')">
              <n-select
                v-model:value="watermarkPosition"
                :options="watermarkPositions"
                @update:value="handleWatermark"
              />
            </n-form-item>
            <n-form-item v-if="watermarkedImage" :label="t('tools.imageTools.preview')">
              <div class="image-preview">
                <img :src="watermarkedImage" alt="Watermarked" />
              </div>
            </n-form-item>
            <div class="btn-group" v-if="watermarkedImage">
              <n-button @click="downloadWatermarked">{{ t('tools.imageTools.download') }}</n-button>
              <n-button @click="clearWatermark">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 图片去水印 -->
        <n-tab-pane :name="6" :tab="t('tools.imageTools.removeWatermark')">
          <n-form>
            <n-form-item :label="t('tools.imageTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleRemoveWatermarkUpload"
              >
                <n-button>{{ t('tools.imageTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item v-if="watermarkImage" :label="t('tools.imageTools.selectArea')">
              <div class="watermark-container">
                <img :src="watermarkImage" alt="Remove Watermark" ref="watermarkImageRef" />
                <div class="watermark-overlay" ref="watermarkOverlayRef"></div>
              </div>
            </n-form-item>
            <div class="btn-group" v-if="removedWatermarkImage">
              <n-button @click="downloadRemovedWatermark">{{ t('tools.imageTools.download') }}</n-button>
              <n-button @click="clearRemoveWatermark">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>

      <n-alert v-if="error" type="error" class="error-tip">{{ error }}</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const { t } = useI18n();

// 图片压缩相关
const compressQuality = ref(80);
const compressedImage = ref('');
const originalSize = ref('');
const compressedSize = ref('');

// 图片转换相关
const targetFormat = ref('jpeg');
const convertedImage = ref('');
const imageFormats = [
  { label: 'JPEG', value: 'jpeg' },
  { label: 'PNG', value: 'png' },
  { label: 'WebP', value: 'webp' }
];

// 图片旋转相关
const rotateAngle = ref(0);
const rotatedImage = ref('');

// 图片裁剪相关
const cropImage = ref('');
const croppedImage = ref('');
const cropImageRef = ref<HTMLImageElement | null>(null);
const cropOverlayRef = ref<HTMLDivElement | null>(null);
let cropper: Cropper | null = null;

// 图片水印相关
const watermarkText = ref('');
const watermarkPosition = ref('center');
const watermarkedImage = ref('');
const watermarkPositions = [
  { label: t('tools.imageTools.topLeft'), value: 'top-left' },
  { label: t('tools.imageTools.topRight'), value: 'top-right' },
  { label: t('tools.imageTools.center'), value: 'center' },
  { label: t('tools.imageTools.bottomLeft'), value: 'bottom-left' },
  { label: t('tools.imageTools.bottomRight'), value: 'bottom-right' }
];

// 图片去水印相关
const watermarkImage = ref('');
const removedWatermarkImage = ref('');
const watermarkImageRef = ref<HTMLImageElement | null>(null);
const watermarkOverlayRef = ref<HTMLDivElement | null>(null);
let watermarkRemover: Cropper | null = null;

const error = ref('');

// 图片压缩处理
async function handleCompressUpload(options: { file: File }) {
  try {
    error.value = '';
    const file = options.file;
    originalSize.value = formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              compressedImage.value = URL.createObjectURL(blob);
              compressedSize.value = formatFileSize(blob.size);
            }
          },
          'image/jpeg',
          compressQuality.value / 100
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } catch (e) {
    error.value = e.message;
  }
}

// 图片转换处理
async function handleConvertUpload(options: { file: File }) {
  try {
    error.value = '';
    const file = options.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              convertedImage.value = URL.createObjectURL(blob);
            }
          },
          `image/${targetFormat.value}`
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } catch (e) {
    error.value = e.message;
  }
}

// 图片旋转处理
async function handleRotateUpload(options: { file: File }) {
  try {
    error.value = '';
    const file = options.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 根据旋转角度调整画布大小
        if (rotateAngle.value === 90 || rotateAngle.value === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx?.translate(canvas.width / 2, canvas.height / 2);
        ctx?.rotate((rotateAngle.value * Math.PI) / 180);
        ctx?.drawImage(img, -img.width / 2, -img.height / 2);

        rotatedImage.value = canvas.toDataURL();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } catch (e) {
    error.value = e.message;
  }
}

// 图片裁剪处理
async function handleCropUpload(options: { file: File }) {
  try {
    error.value = '';
    const file = options.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      cropImage.value = e.target?.result as string;
      // 初始化裁剪器
      nextTick(() => {
        if (cropImageRef.value) {
          cropper = new Cropper(cropImageRef.value, {
            aspectRatio: NaN,
            viewMode: 1,
            autoCropArea: 1,
            crop: (event) => {
              const canvas = cropper?.getCroppedCanvas();
              if (canvas) {
                croppedImage.value = canvas.toDataURL();
              }
            }
          });
        }
      });
    };
    reader.readAsDataURL(file);
  } catch (e) {
    error.value = e.message;
  }
}

// 图片水印处理
async function handleWatermarkUpload(options: { file: File }) {
  try {
    error.value = '';
    const file = options.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        // 添加水印
        ctx!.font = '24px Arial';
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';

        let x = 0;
        let y = 0;
        switch (watermarkPosition.value) {
          case 'top-left':
            x = 50;
            y = 30;
            break;
          case 'top-right':
            x = canvas.width - 50;
            y = 30;
            break;
          case 'center':
            x = canvas.width / 2;
            y = canvas.height / 2;
            break;
          case 'bottom-left':
            x = 50;
            y = canvas.height - 30;
            break;
          case 'bottom-right':
            x = canvas.width - 50;
            y = canvas.height - 30;
            break;
        }

        ctx?.fillText(watermarkText.value, x, y);
        watermarkedImage.value = canvas.toDataURL();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } catch (e) {
    error.value = e.message;
  }
}

// 图片去水印处理
async function handleRemoveWatermarkUpload(options: { file: File }) {
  try {
    error.value = '';
    const file = options.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      watermarkImage.value = e.target?.result as string;
      // 初始化水印去除器
      nextTick(() => {
        if (watermarkImageRef.value) {
          watermarkRemover = new Cropper(watermarkImageRef.value, {
            aspectRatio: NaN,
            viewMode: 1,
            autoCropArea: 1,
            crop: (event) => {
              const canvas = watermarkRemover?.getCroppedCanvas();
              if (canvas) {
                removedWatermarkImage.value = canvas.toDataURL();
              }
            }
          });
        }
      });
    };
    reader.readAsDataURL(file);
  } catch (e) {
    error.value = e.message;
  }
}

// 下载处理后的图片
function downloadCompressed() {
  downloadImage(compressedImage.value, 'compressed.jpg');
}

function downloadConverted() {
  downloadImage(convertedImage.value, `converted.${targetFormat.value}`);
}

function downloadRotated() {
  downloadImage(rotatedImage.value, 'rotated.jpg');
}

function downloadCropped() {
  downloadImage(croppedImage.value, 'cropped.jpg');
}

function downloadWatermarked() {
  downloadImage(watermarkedImage.value, 'watermarked.jpg');
}

function downloadRemovedWatermark() {
  downloadImage(removedWatermarkImage.value, 'removed-watermark.jpg');
}

function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

// 清空处理
function clearCompress() {
  compressedImage.value = '';
  originalSize.value = '';
  compressedSize.value = '';
}

function clearConvert() {
  convertedImage.value = '';
}

function clearRotate() {
  rotatedImage.value = '';
  rotateAngle.value = 0;
}

function clearCrop() {
  cropImage.value = '';
  croppedImage.value = '';
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}

function clearWatermark() {
  watermarkedImage.value = '';
  watermarkText.value = '';
  watermarkPosition.value = 'center';
}

function clearRemoveWatermark() {
  watermarkImage.value = '';
  removedWatermarkImage.value = '';
  if (watermarkRemover) {
    watermarkRemover.destroy();
    watermarkRemover = null;
  }
}

// 工具函数
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 组件生命周期
onUnmounted(() => {
  if (cropper) {
    cropper.destroy();
  }
  if (watermarkRemover) {
    watermarkRemover.destroy();
  }
});
</script>

<style scoped>
.image-tools {
  max-width: 800px;
  margin: 0 auto;
}
.image-preview {
  max-width: 100%;
  margin: 16px 0;
}
.image-preview img {
  max-width: 100%;
  height: auto;
}
.image-info {
  margin-top: 8px;
  color: #666;
}
.crop-container,
.watermark-container {
  position: relative;
  max-width: 100%;
  height: 400px;
  margin: 16px 0;
}
.crop-container img,
.watermark-container img {
  max-width: 100%;
  max-height: 100%;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.error-tip {
  margin-top: 8px;
}
</style> 