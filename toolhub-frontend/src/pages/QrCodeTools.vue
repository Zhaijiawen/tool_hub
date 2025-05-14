<template>
  <div class="qr-code-tools">
    <n-card :title="t('tools.qrCodeTools.title')">
      <n-tabs type="line" animated>
        <!-- 二维码生成器 -->
        <n-tab-pane :name="1" :tab="t('tools.qrCodeTools.generator')">
          <n-form>
            <n-form-item :label="t('tools.qrCodeTools.content')">
              <n-input
                v-model:value="content"
                type="textarea"
                :placeholder="t('tools.qrCodeTools.contentPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 8 }"
                @update:value="handleGenerate"
              />
            </n-form-item>
            <n-form-item :label="t('tools.qrCodeTools.options')">
              <n-space vertical>
                <n-space>
                  <n-text>{{ t('tools.qrCodeTools.size') }}:</n-text>
                  <n-input-number
                    v-model:value="options.size"
                    :min="100"
                    :max="1000"
                    :step="10"
                    @update:value="handleGenerate"
                  />
                </n-space>
                <n-space>
                  <n-text>{{ t('tools.qrCodeTools.margin') }}:</n-text>
                  <n-input-number
                    v-model:value="options.margin"
                    :min="0"
                    :max="50"
                    :step="1"
                    @update:value="handleGenerate"
                  />
                </n-space>
                <n-space>
                  <n-text>{{ t('tools.qrCodeTools.color') }}:</n-text>
                  <n-color-picker
                    v-model:value="options.color"
                    @update:value="handleGenerate"
                  />
                </n-space>
                <n-space>
                  <n-text>{{ t('tools.qrCodeTools.backgroundColor') }}:</n-text>
                  <n-color-picker
                    v-model:value="options.backgroundColor"
                    @update:value="handleGenerate"
                  />
                </n-space>
                <n-space>
                  <n-text>{{ t('tools.qrCodeTools.errorCorrectionLevel') }}:</n-text>
                  <n-select
                    v-model:value="options.errorCorrectionLevel"
                    :options="errorCorrectionLevels"
                    @update:value="handleGenerate"
                  />
                </n-space>
              </n-space>
            </n-form-item>
            <n-form-item :label="t('tools.qrCodeTools.preview')">
              <div class="preview">
                <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" />
              </div>
            </n-form-item>
            <div class="btn-group">
              <n-button @click="downloadQrCode" :disabled="!qrCodeUrl">
                {{ t('tools.qrCodeTools.download') }}
              </n-button>
              <n-button @click="clearGenerator">
                {{ t('common.clear') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 二维码解码器 -->
        <n-tab-pane :name="2" :tab="t('tools.qrCodeTools.decoder')">
          <n-form>
            <n-form-item :label="t('tools.qrCodeTools.upload')">
              <n-upload
                accept="image/*"
                :max="1"
                :show-file-list="false"
                @change="handleFileChange"
              >
                <n-button>{{ t('tools.qrCodeTools.selectImage') }}</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item v-if="decodedContent" :label="t('tools.qrCodeTools.decodedContent')">
              <n-input
                v-model:value="decodedContent"
                type="textarea"
                readonly
                :autosize="{ minRows: 3, maxRows: 8 }"
              />
            </n-form-item>
            <div class="btn-group">
              <n-button @click="copyDecodedContent" :disabled="!decodedContent">
                {{ t('common.copy') }}
              </n-button>
              <n-button @click="clearDecoder">
                {{ t('common.clear') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

const { t } = useI18n();
const message = useMessage();

// 二维码生成器相关
const content = ref('');
const qrCodeUrl = ref('');
const options = ref({
  size: 200,
  margin: 4,
  color: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'M'
});

const errorCorrectionLevels = [
  { label: 'L (7%)', value: 'L' },
  { label: 'M (15%)', value: 'M' },
  { label: 'Q (25%)', value: 'Q' },
  { label: 'H (30%)', value: 'H' }
];

async function handleGenerate() {
  if (!content.value) {
    qrCodeUrl.value = '';
    return;
  }

  try {
    qrCodeUrl.value = await QRCode.toDataURL(content.value, {
      width: options.value.size,
      margin: options.value.margin,
      color: {
        dark: options.value.color,
        light: options.value.backgroundColor
      },
      errorCorrectionLevel: options.value.errorCorrectionLevel
    });
  } catch (error) {
    message.error(t('tools.qrCodeTools.generateError'));
  }
}

function downloadQrCode() {
  if (!qrCodeUrl.value) return;

  const link = document.createElement('a');
  link.href = qrCodeUrl.value;
  link.download = 'qrcode.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function clearGenerator() {
  content.value = '';
  qrCodeUrl.value = '';
  options.value = {
    size: 200,
    margin: 4,
    color: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M'
  };
}

// 二维码解码器相关
const decodedContent = ref('');

async function handleFileChange({ file }: { file: File }) {
  if (!file) return;

  try {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      decodedContent.value = code.data;
    } else {
      message.error(t('tools.qrCodeTools.decodeError'));
    }
  } catch (error) {
    message.error(t('tools.qrCodeTools.decodeError'));
  }
}

function copyDecodedContent() {
  if (decodedContent.value) {
    navigator.clipboard.writeText(decodedContent.value);
    message.success(t('common.copySuccess'));
  }
}

function clearDecoder() {
  decodedContent.value = '';
}
</script>

<style scoped>
.qr-code-tools {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  background: #fff;
}
.preview img {
  max-width: 100%;
  height: auto;
}
</style> 