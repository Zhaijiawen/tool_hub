<template>
  <div class="barcode-scanner">
    <ToolIntro toolKey="barcode" />

    <n-card :title="t('image.barcode.title')" class="tool-card">
      <!-- 模式切换 -->
      <n-tabs v-model:value="mode" type="segment" class="mode-tabs">
        <n-tab-pane name="upload" :tab="t('image.barcode.uploadTab')" />
        <n-tab-pane name="camera" :tab="t('image.barcode.cameraTab')" />
      </n-tabs>

      <!-- 上传模式 -->
      <div v-if="mode === 'upload'" class="upload-zone" :class="{ 'has-file': previewUrl }">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input"
          @change="onFileChange"
        />
        <div v-if="!previewUrl" class="drop-hint" @click="fileInput?.click()">
          <div class="drop-icon">📷</div>
          <div class="drop-text">{{ t('image.barcode.uploadHint') }}</div>
          <n-button tertiary size="small" @click.stop="fileInput?.click()">
            {{ t('image.barcode.chooseBtn') }}
          </n-button>
        </div>
        <div v-else class="preview-wrap">
          <img :src="previewUrl" class="preview-img" alt="preview" />
          <n-button tertiary size="small" class="change-btn" @click="fileInput?.click()">
            {{ t('image.barcode.changeBtn') }}
          </n-button>
        </div>
      </div>

      <!-- 摄像头模式 -->
      <div v-else class="camera-zone">
        <video ref="videoEl" class="camera-video" playsinline muted></video>
        <div v-if="!cameraOn" class="camera-hint">{{ t('image.barcode.cameraHint') }}</div>
      </div>

      <!-- 操作 -->
      <div class="row actions">
        <n-button
          v-if="mode === 'upload'"
          type="primary"
          :loading="scanning"
          :disabled="!file || scanning"
          @click="scanImage"
        >
          {{ scanning ? t('image.barcode.scanning') : t('image.barcode.scanBtn') }}
        </n-button>
        <n-button
          v-else
          type="primary"
          :disabled="cameraOn"
          @click="startCamera"
        >
          {{ t('image.barcode.startCamera') }}
        </n-button>
        <n-button
          v-if="mode === 'camera' && cameraOn"
          @click="stopCamera"
        >
          {{ t('image.barcode.stopBtn') }}
        </n-button>
        <n-button
          v-if="results.length"
          tertiary
          @click="clearResults"
        >
          {{ t('image.barcode.clearBtn') }}
        </n-button>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="errorMsg" type="warning" :show-icon="true" class="err-note">
        {{ errorMsg }}
      </n-alert>

      <!-- 结果 -->
      <div v-if="results.length" class="result-block">
        <div class="result-title">{{ t('image.barcode.resultTitle') }}</div>
        <div class="result-list">
          <div v-for="(r, idx) in results" :key="idx" class="result-item">
            <div class="result-meta">
              <n-tag size="small" type="info">{{ r.format }}</n-tag>
              <n-button text size="tiny" @click="copy(r.text)">
                {{ copiedIdx === idx ? t('image.barcode.copied') : t('image.barcode.copy') }}
              </n-button>
            </div>
            <div class="result-text">{{ r.text }}</div>
          </div>
        </div>
      </div>

      <!-- 隐私提示 -->
      <n-alert type="success" :show-icon="true" class="privacy-note">
        {{ t('image.barcode.privacyNote') }}
      </n-alert>
    </n-card>

    <TutorialAndDocs toolKey="barcode" />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser'
import ToolIntro from '@/components/common/ToolIntro.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const mode = ref('upload')
const fileInput = ref(null)
const file = ref(null)
const previewUrl = ref('')
const scanning = ref(false)
const errorMsg = ref('')
const results = ref([])
const copiedIdx = ref(-1)

// 摄像头相关
const videoEl = ref(null)
const cameraOn = ref(false)
let reader = null
let controls = null

function revoke(url) {
  if (url) URL.revokeObjectURL(url)
}

function onFileChange(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  if (!f.type.startsWith('image/')) {
    errorMsg.value = t('image.barcode.notImage')
    return
  }
  errorMsg.value = ''
  revoke(previewUrl.value)
  previewUrl.value = ''
  file.value = f
  previewUrl.value = URL.createObjectURL(f)
}

function getReader() {
  if (!reader) reader = new BrowserMultiFormatReader()
  return reader
}

function formatName(fmt) {
  try {
    return BarcodeFormat[fmt] || String(fmt)
  } catch {
    return String(fmt)
  }
}

async function scanImage() {
  if (!file.value) return
  scanning.value = true
  errorMsg.value = ''
  try {
    const blobUrl = URL.createObjectURL(file.value)
    const result = await getReader().decodeFromImageUrl(blobUrl)
    URL.revokeObjectURL(blobUrl)
    results.value.unshift({
      format: formatName(result.getBarcodeFormat()),
      text: result.getText()
    })
    copiedIdx.value = -1
  } catch (err) {
    errorMsg.value = t('image.barcode.noResult')
  } finally {
    scanning.value = false
  }
}

async function startCamera() {
  errorMsg.value = ''
  try {
    const r = getReader()
    controls = await r.decodeFromVideoDevice(undefined, videoEl.value, (result, err) => {
      if (result) {
        const text = result.getText()
        const fmt = formatName(result.getBarcodeFormat())
        // 去重：避免同一帧反复追加
        const last = results.value[0]
        if (!last || last.text !== text || last.format !== fmt) {
          results.value.unshift({ format: fmt, text })
          copiedIdx.value = -1
        }
      }
      // err 在持续扫描中常见（未识别到），忽略
    })
    cameraOn.value = true
  } catch (err) {
    console.error('[barcode] camera error:', err)
    errorMsg.value = t('image.barcode.cameraError')
  }
}

function stopCamera() {
  if (controls) {
    try { controls.stop() } catch { /* ignore */ }
    controls = null
  }
  cameraOn.value = false
}

function clearResults() {
  results.value = []
  copiedIdx.value = -1
}

function copy(text) {
  navigator.clipboard?.writeText(text).then(() => {
    message.success(t('image.barcode.copied'))
  }).catch(() => {})
}

onBeforeUnmount(() => {
  stopCamera()
  revoke(previewUrl.value)
})
</script>

<style scoped>
.barcode-scanner {
  max-width: 880px;
  margin: 0 auto;
}
.tool-card {
  margin-top: 12px;
}
.mode-tabs {
  margin-bottom: 8px;
}
.upload-zone {
  border: 2px dashed var(--n-border-color, #dcdfe6);
  border-radius: 10px;
  padding: 18px;
  text-align: center;
  transition: border-color 0.2s;
  cursor: pointer;
}
.upload-zone.has-file {
  border-style: solid;
  cursor: default;
}
.file-input {
  display: none;
}
.drop-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #8a8f99;
}
.drop-icon {
  font-size: 40px;
}
.drop-text {
  font-size: 14px;
}
.preview-wrap {
  position: relative;
  display: inline-block;
}
.preview-img {
  max-width: 100%;
  max-height: 320px;
  border-radius: 8px;
  display: block;
}
.change-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
}
.camera-zone {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.camera-video {
  width: 100%;
  max-height: 360px;
  display: block;
}
.camera-hint {
  position: absolute;
  color: #cfcfcf;
  font-size: 14px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.actions {
  margin-top: 16px;
}
.err-note {
  margin-top: 14px;
}
.result-block {
  margin-top: 20px;
}
.result-title {
  font-weight: 600;
  margin-bottom: 10px;
}
.result-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.result-item {
  border: 1px solid var(--n-border-color, #dcdfe6);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--card-color, #fff);
}
.result-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.result-text {
  font-size: 14px;
  word-break: break-all;
  color: var(--text-color, #333);
  font-family: 'Monaco', 'Menlo', monospace;
}
.privacy-note {
  margin-top: 18px;
}
</style>
