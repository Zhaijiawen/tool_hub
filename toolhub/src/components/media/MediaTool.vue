<template>
  <div class="media-tool">
    <ToolIntro toolKey="mediaTool" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <n-tabs v-model:value="activeTab" type="line" animated>
        <!-- ============ Tab 1: 视频转码 ============ -->
        <n-tab-pane name="transcode" :tab="t('media.mediaTool.tabs.transcode')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': videoDragging }"
              @dragover.prevent="videoDragging = true"
              @dragleave.prevent="videoDragging = false"
              @drop.prevent="onVideoDrop"
              @click="videoInput?.click()"
            >
              <input ref="videoInput" type="file" accept="video/*,.mp4,.mov,.webm,.mkv,.avi" style="display:none" @change="onVideoChange" />
              <div v-if="!videoFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17,10.5V7C17,5.9 16.1,5 15,5H3C1.9,5 1,5.9 1,7V17C1,18.1 1.9,19 3,19H15C16.1,19 17,18.1 17,17V13.5L21,17.5V6.5L17,10.5Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('media.mediaTool.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ videoFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(videoFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearVideo">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="videoFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('media.mediaTool.formatLabel') }}</span>
                <n-radio-group v-model:value="videoFormat" size="small">
                  <n-radio value="mp4">MP4 (H.264)</n-radio>
                  <n-radio value="webm">WebM (VP8)</n-radio>
                </n-radio-group>
              </div>
              <div v-if="videoFormat === 'mp4'" class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('media.mediaTool.qualityLabel') }}</span>
                <n-slider v-model:value="videoQuality" :min="18" :max="40" :step="1" style="max-width: 220px;" />
                <n-text depth="3" style="font-size: 12px;">CRF {{ videoQuality }}</n-text>
              </div>
              <div class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('media.mediaTool.scaleLabel') }}</span>
                <n-select v-model:value="videoScale" :options="scaleOptions" size="small" style="max-width: 180px;" />
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.scaleHint') }}</n-text>
            </div>

            <div v-if="videoFile" class="action-row">
              <n-button type="primary" :loading="busy" :disabled="busy" @click="runTranscode">
                {{ busy ? t('media.mediaTool.working') : t('media.mediaTool.startTranscode') }}
              </n-button>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 2: 提取音频 ============ -->
        <n-tab-pane name="audio" :tab="t('media.mediaTool.tabs.audio')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': audioDragging }"
              @dragover.prevent="audioDragging = true"
              @dragleave.prevent="audioDragging = false"
              @drop.prevent="onAudioDrop"
              @click="audioInput?.click()"
            >
              <input ref="audioInput" type="file" accept="video/*,audio/*,.mp4,.mov,.webm,.mkv,.mp3,.wav,.m4a,.ogg" style="display:none" @change="onAudioChange" />
              <div v-if="!audioFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,3V9.28C11,9.62 10.18,10.5 10.18,11.67C10.18,12.95 11.21,13.92 12.5,13.92C13.79,13.92 14.82,12.95 14.82,11.67L14.83,7H18V3H12M17.5,11C17.5,14 15.5,17 12.5,17C9.5,17 7.5,14 7.5,11H9.5C9.5,12.93 10.86,14.5 12.5,14.5C14.14,14.5 15.5,12.93 15.5,11H17.5Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('media.mediaTool.audioUploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.audioUploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ audioFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(audioFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearAudio">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="audioFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('media.mediaTool.audioFormatLabel') }}</span>
                <n-radio-group v-model:value="audioFormat" size="small">
                  <n-radio value="mp3">MP3</n-radio>
                  <n-radio value="m4a">M4A (AAC)</n-radio>
                  <n-radio value="wav">WAV</n-radio>
                  <n-radio value="ogg">OGG</n-radio>
                  <n-radio value="opus">Opus</n-radio>
                </n-radio-group>
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.audioHint') }}</n-text>
            </div>

            <div v-if="audioFile" class="action-row">
              <n-button type="primary" :loading="busy" :disabled="busy" @click="runAudio">
                {{ busy ? t('media.mediaTool.working') : t('media.mediaTool.startAudio') }}
              </n-button>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 3: 视频转 GIF ============ -->
        <n-tab-pane name="gif" :tab="t('media.mediaTool.tabs.gif')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': gifDragging }"
              @dragover.prevent="gifDragging = true"
              @dragleave.prevent="gifDragging = false"
              @drop.prevent="onGifDrop"
              @click="gifInput?.click()"
            >
              <input ref="gifInput" type="file" accept="video/*,.mp4,.mov,.webm,.mkv,.avi" style="display:none" @change="onGifChange" />
              <div v-if="!gifFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M11,15H6L13,1V8H18L11,23V15Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('media.mediaTool.gifUploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.gifUploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ gifFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(gifFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearGif">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="gifFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('media.mediaTool.gifFpsLabel') }}</span>
                <n-slider v-model:value="gifFps" :min="5" :max="30" :step="1" style="max-width: 200px;" />
                <n-text depth="3" style="font-size: 12px;">{{ gifFps }} fps</n-text>
              </div>
              <div class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('media.mediaTool.gifWidthLabel') }}</span>
                <n-slider v-model:value="gifWidth" :min="80" :max="800" :step="20" style="max-width: 200px;" />
                <n-text depth="3" style="font-size: 12px;">{{ gifWidth }}px</n-text>
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.gifHint') }}</n-text>
            </div>

            <div v-if="gifFile" class="action-row">
              <n-button type="primary" :loading="busy" :disabled="busy" @click="runGif">
                {{ busy ? t('media.mediaTool.working') : t('media.mediaTool.startGif') }}
              </n-button>
            </div>
          </n-space>
        </n-tab-pane>
      </n-tabs>

      <!-- 进度 -->
      <div v-if="busy" class="progress-area">
        <n-progress
          type="line"
          :percentage="displayProgress"
          :show-percentage="!indeterminate"
          :height="8"
          indicator-placement="inside"
          :processing="true"
        />
        <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
          {{ phaseText }}<template v-if="!indeterminate"> · {{ displayProgress }}%</template>
        </n-text>
        <n-text v-if="indeterminate" depth="3" style="font-size: 12px;">
          {{ t('media.mediaTool.execHint') }}
        </n-text>
      </div>

      <!-- 错误 -->
      <n-alert v-if="errorText" type="error" :show-icon="true" closable style="margin-top: 12px;" @close="errorText = ''">
        {{ errorText }}
      </n-alert>

      <!-- 结果（跨标签页共享：转码/音频/GIF 都产出文件） -->
      <div v-if="result" class="result-area">
        <n-space align="center" :wrap="true">
          <n-tag :bordered="false" type="success">{{ t('media.mediaTool.done') }}</n-tag>
          <n-text style="font-size: 13px;">{{ result.name }}</n-text>
          <n-tag :bordered="false" type="info">{{ formatSize(result.size) }}</n-tag>
          <n-button size="small" type="primary" @click="downloadResult">{{ t('media.mediaTool.download') }}</n-button>
        </n-space>
        <!-- 音视频预览（转码/GIF 结果可直接试听/观看） -->
        <video
          v-if="previewUrl && isVideoResult"
          :src="previewUrl"
          controls
          style="max-width: 100%; max-height: 320px; margin-top: 10px; border-radius: 6px;"
        />
        <audio
          v-else-if="previewUrl && isAudioResult"
          :src="previewUrl"
          controls
          style="width: 100%; margin-top: 10px;"
        />
        <img
          v-else-if="previewUrl && isGifResult"
          :src="previewUrl"
          :alt="result.name"
          style="max-width: 100%; max-height: 320px; margin-top: 10px; border-radius: 6px;"
        />
      </div>

      <n-alert type="info" :bordered="true" style="margin-top: 16px;">
        <n-text depth="3" style="font-size: 12px;">{{ t('media.mediaTool.engineNote') }}</n-text>
      </n-alert>
    </n-card>

    <TutorialAndDocs toolKey="mediaTool" />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useFfmpeg } from '@/composables/useFfmpeg'

const { t } = useI18n()
const message = useMessage()
const ffmpeg = useFfmpeg()

const { busy, errorMsg, stage, displayProgress, indeterminate } = ffmpeg

const activeTab = ref('transcode')
const errorText = ref('')
const result = ref(null) // { name, size, url, mime }

// worker 错误码 → i18n 键
const ERROR_KEYS = {
  NOT_MEDIA_FILE: 'media.mediaTool.errors.notMedia',
  NO_AUDIO_STREAM: 'media.mediaTool.errors.noAudio',
  UNSUPPORTED_FORMAT: 'media.mediaTool.errors.unsupported',
  OUTPUT_MISSING: 'media.mediaTool.errors.outputMissing',
  TRANSCODE_FAILED: 'media.mediaTool.errors.transcodeFailed',
  GIF_FAILED: 'media.mediaTool.errors.gifFailed',
  OUT_OF_MEMORY: 'media.mediaTool.errors.outOfMemory',
  WORKER_NOT_READY: 'media.mediaTool.errors.workerNotReady',
  WORKER_ERROR: 'media.mediaTool.errors.workerError',
  FFMPEG_INIT_TIMEOUT: 'media.mediaTool.errors.initTimeout'
}

// 单线程 ffmpeg-core 初始堆仅 32MB、增长路径不可靠，文件过大极易触发
// wasm 内存越界陷阱。这里设一个护栏：超过即拒绝并提示（仅拦截明显超限，
// 中等文件仍允许尝试；真正的上限由引擎内存决定）。
const VIDEO_MAX_MB = 200 // 视频转码 / 转 GIF 的输入
const AUDIO_MAX_MB = 300 // 音频处理 / 提取的输入

function checkSize(file, maxMB) {
  const mb = file.size / (1024 * 1024)
  if (mb > maxMB) {
    message.warning(
      t('media.mediaTool.errors.fileTooLarge', { size: mb.toFixed(1), max: maxMB })
    )
    return false
  }
  return true
}

function fail(err) {
  if (err && err.name === 'AbortError') return
  const msg = String(err && err.message ? err.message : err)
  // 形如 "TRANSCODE_FAILED:具体原因"（具体原因在 ffmpeg 不可达时通常为空）
  const [code, ...rest] = msg.split(':')
  const key = ERROR_KEYS[code]
  const detail = rest.join(':').trim()
  errorText.value = key
    ? (detail ? `${t(key)} (${detail})` : t(key))
    : `${t('media.mediaTool.failed')}: ${msg}`
}

const phaseText = computed(() => {
  if (stage.value === 'download') return t('media.mediaTool.phaseDownloading')
  if (stage.value === 'load') return t('media.mediaTool.phaseLoading')
  return t('media.mediaTool.phaseWorking')
})

// ---- 结果处理 ----
const previewUrl = computed(() => (result.value ? result.value.url : ''))
const isVideoResult = computed(() => result.value?.mime.startsWith('video/'))
const isAudioResult = computed(() => result.value?.mime.startsWith('audio/'))
const isGifResult = computed(() => result.value?.mime === 'image/gif')

function setResult(name, bytes) {
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  const mime = mimeOf(name)
  result.value = {
    name,
    size: bytes.byteLength,
    mime,
    url: URL.createObjectURL(new Blob([bytes], { type: mime }))
  }
}

function mimeOf(name) {
  const ext = String(name).split('.').pop().toLowerCase()
  const map = {
    mp4: 'video/mp4', webm: 'video/webm', gif: 'image/gif',
    mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav',
    ogg: 'audio/ogg', opus: 'audio/ogg'
  }
  return map[ext] || 'application/octet-stream'
}

function clearResult() {
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  result.value = null
}

function downloadResult() {
  if (!result.value) return
  downloadBytesFrom(result.value.url, result.value.name)
}

// ---- Tab 1: 视频转码 ----
const videoInput = ref(null)
const videoDragging = ref(false)
const videoFile = ref(null)
const videoFormat = ref('mp4')
const videoQuality = ref(28)
const videoScale = ref(0)

const scaleOptions = [
  { label: t('media.mediaTool.keepOriginal'), value: 0 },
  { label: '1280px', value: 1280 },
  { label: '960px', value: 960 },
  { label: '720px', value: 720 },
  { label: '480px', value: 480 }
]

function onVideoChange(e) {
  const f = e.target.files?.[0]
  if (f) setVideoFile(f)
  e.target.value = ''
}
function onVideoDrop(e) {
  videoDragging.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) setVideoFile(f)
}
function setVideoFile(f) {
  if (!f.type.startsWith('video/')) {
    message.warning(t('media.mediaTool.videoOnly'))
    return
  }
  if (!checkSize(f, VIDEO_MAX_MB)) return
  videoFile.value = f
  clearResult()
  errorText.value = ''
}
function clearVideo() {
  videoFile.value = null
  clearResult()
}

async function runTranscode() {
  if (!videoFile.value) return
  errorText.value = ''
  clearResult()
  try {
    const res = await ffmpeg.transcode(await videoFile.value.arrayBuffer(), videoFile.value.name, {
      format: videoFormat.value,
      quality: videoQuality.value,
      scale: videoScale.value
    })
    setResult(res.name, res.bytes)
  } catch (err) {
    fail(err)
  }
}

// ---- Tab 2: 提取音频 ----
const audioInput = ref(null)
const audioDragging = ref(false)
const audioFile = ref(null)
const audioFormat = ref('mp3')

function onAudioChange(e) {
  const f = e.target.files?.[0]
  if (f) setAudioFile(f)
  e.target.value = ''
}
function onAudioDrop(e) {
  audioDragging.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) setAudioFile(f)
}
function setAudioFile(f) {
  if (!f.type.startsWith('video/') && !f.type.startsWith('audio/')) {
    message.warning(t('media.mediaTool.audioFileOnly'))
    return
  }
  if (!checkSize(f, AUDIO_MAX_MB)) return
  audioFile.value = f
  clearResult()
  errorText.value = ''
}
function clearAudio() {
  audioFile.value = null
  clearResult()
}

async function runAudio() {
  if (!audioFile.value) return
  errorText.value = ''
  clearResult()
  try {
    const res = await ffmpeg.extractAudio(await audioFile.value.arrayBuffer(), audioFile.value.name, {
      format: audioFormat.value
    })
    setResult(res.name, res.bytes)
  } catch (err) {
    fail(err)
  }
}

// ---- Tab 3: 转 GIF ----
const gifInput = ref(null)
const gifDragging = ref(false)
const gifFile = ref(null)
const gifFps = ref(10)
const gifWidth = ref(320)

function onGifChange(e) {
  const f = e.target.files?.[0]
  if (f) setGifFile(f)
  e.target.value = ''
}
function onGifDrop(e) {
  gifDragging.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) setGifFile(f)
}
function setGifFile(f) {
  if (!f.type.startsWith('video/')) {
    message.warning(t('media.mediaTool.videoOnly'))
    return
  }
  if (!checkSize(f, VIDEO_MAX_MB)) return
  gifFile.value = f
  clearResult()
  errorText.value = ''
}
function clearGif() {
  gifFile.value = null
  clearResult()
}

async function runGif() {
  if (!gifFile.value) return
  errorText.value = ''
  clearResult()
  try {
    const res = await ffmpeg.toGif(await gifFile.value.arrayBuffer(), gifFile.value.name, {
      fps: gifFps.value,
      width: gifWidth.value
    })
    setResult(res.name, res.bytes)
  } catch (err) {
    fail(err)
  }
}

// ---- 通用 ----
function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function downloadBytesFrom(url, name) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

onUnmounted(() => {
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  ffmpeg.terminate()
})
</script>

<style scoped>
.media-tool {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  border: 1px dashed var(--n-border-color);
  border-radius: 8px;
  padding: 28px 16px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--n-color-primary);
}
.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.options {
  display: flex;
  flex-direction: column;
}
.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.option-label {
  font-size: 13px;
  min-width: 96px;
}

.action-row {
  display: flex;
  gap: 10px;
}

.progress-area {
  margin-top: 12px;
}

.result-area {
  margin-top: 12px;
  border-top: 1px solid var(--n-border-color);
  padding-top: 12px;
}
</style>