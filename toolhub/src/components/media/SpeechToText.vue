<template>
  <div class="speech-to-text">
    <!-- 工具简介 -->
    <ToolIntro toolKey="speechToText" />

    <n-card :title="t('media.speechToText.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 首次使用须知 -->
        <n-alert type="info" :show-icon="true" :title="t('media.speechToText.noticeTitle')">
          {{ t('media.speechToText.noticeContent') }}
        </n-alert>

        <!-- 文件上传 -->
        <n-upload
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.opus,.flac,.webm"
          :max="1"
          :show-file-list="false"
          :custom-request="() => {}"
          @change="handleFileChange"
        >
          <n-upload-dragger>
            <div class="upload-trigger">
              <n-icon size="48" :depth="3">
                <audio-outlined />
              </n-icon>
              <n-text style="margin-top: 8px">{{ t('media.speechToText.upload') }}</n-text>
              <n-text depth="3" style="margin-top: 4px; font-size: 13px;">
                {{ t('media.speechToText.uploadHint') }}
              </n-text>
            </div>
          </n-upload-dragger>
        </n-upload>

        <!-- 音频信息与播放 -->
        <div v-if="file" class="file-info">
          <n-space align="center" :wrap="true">
            <n-tag :bordered="false" type="primary">{{ file.name }}</n-tag>
            <n-text depth="3" style="font-size: 12px;">{{ formatSize(file.size) }}</n-text>
            <n-text v-if="durationText" depth="3" style="font-size: 12px;">{{ durationText }}</n-text>
            <n-button size="tiny" quaternary type="error" @click="clearFile">
              {{ t('common.clear') }}
            </n-button>
          </n-space>
          <audio v-if="audioUrl" :src="audioUrl" controls class="audio-player" />
        </div>

        <!-- 选项 -->
        <n-grid :cols="2" :x-gap="24" responsive="screen">
          <n-gi>
            <n-form-item :label="t('media.speechToText.task')">
              <n-select v-model:value="task" :options="taskOptions" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item :label="t('media.speechToText.language')">
              <n-select v-model:value="language" :options="languageOptions" filterable />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-space>
          <n-checkbox v-model:checked="timestamps">
            {{ t('media.speechToText.timestamps') }}
          </n-checkbox>
          <n-checkbox v-model:checked="stream">
            {{ t('media.speechToText.stream') }}
          </n-checkbox>
        </n-space>

        <!-- 操作 -->
        <div class="action-row">
          <n-button
            type="primary"
            :loading="running"
            :disabled="running || !file"
            @click="run"
          >
            {{ running ? workingLabel : t('media.speechToText.run') }}
          </n-button>
        </div>

        <!-- 进度 / 错误 -->
        <div v-if="running" class="progress-area">
          <n-progress
            v-if="stage === 'wasm' || stage === 'model'"
            type="line"
            :percentage="displayProgress ?? 0"
            :show-percentage="true"
            :height="8"
            indicator-placement="inside"
            processing
          />
          <n-progress
            v-else
            type="line"
            :percentage="100"
            :show-percentage="false"
            :height="8"
            indicator-placement="inside"
            processing
          />
          <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
            {{ workingLabel }}
            <template v-if="stage === 'wasm' || stage === 'model'">
              · {{ displayProgress ?? 0 }}%
              <template v-if="stage === 'model' && modelFile">（{{ modelFile }}）</template>
            </template>
          </n-text>
          <n-button
            v-if="stage === 'wasm'"
            size="tiny"
            quaternary
            style="margin-top: 6px;"
            @click="cancelDownload"
          >
            {{ t('common.cancel') }}
          </n-button>
        </div>
        <n-alert v-else-if="errorText" type="error" :show-icon="true">
          {{ errorText }}
        </n-alert>

        <!-- 流式中间结果 -->
        <div v-if="stream && partialText && running" class="partial">
          <n-text depth="3" style="font-size: 12px;">{{ t('media.speechToText.partial') }}</n-text>
          <n-input :value="partialText" type="textarea" readonly :rows="3" />
        </div>

        <!-- 结果 -->
        <div v-if="result" class="result">
          <n-space align="center" :wrap="true" style="margin-bottom: 8px;">
            <n-tag :bordered="false" type="success">
              {{ t('media.speechToText.chars') }}: {{ result.text.length }}
            </n-tag>
            <n-text v-if="result.elapsed" depth="3" style="font-size: 12px;">
              {{ t('media.speechToText.elapsed') }}: {{ result.elapsed }}s
            </n-text>
            <n-button size="small" @click="copyResult">{{ t('common.copy') }}</n-button>
            <n-button size="small" @click="downloadText">{{ t('media.speechToText.downloadTxt') }}</n-button>
            <n-button
              v-if="result.chunks && result.chunks.length"
              size="small"
              @click="downloadSrt"
            >
              {{ t('media.speechToText.downloadSrt') }}
            </n-button>
          </n-space>
          <n-input
            :value="result.text"
            type="textarea"
            readonly
            :rows="12"
            style="font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 12px;"
          />

          <!-- 分段时间戳 -->
          <div v-if="result.chunks && result.chunks.length" class="chunks">
            <n-text depth="3" style="font-size: 12px;">{{ t('media.speechToText.segments') }}</n-text>
            <div v-for="(chunk, i) in result.chunks" :key="i" class="chunk-row">
              <n-text depth="2" style="font-size: 12px; min-width: 110px;">
                [{{ formatTs(chunk.timestamp && chunk.timestamp[0]) }} → {{ formatTs(chunk.timestamp && chunk.timestamp[1]) }}]
              </n-text>
              <n-text style="font-size: 13px;">{{ chunk.text }}</n-text>
            </div>
          </div>
        </div>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="speechToText" />
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { AudioOutlined } from '@vicons/antd'
import ToolIntro from '@/components/common/ToolIntro.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import { useWhisper } from '@/composables/useWhisper'

const { t } = useI18n()
const message = useMessage()
const whisper = useWhisper()

const file = ref(null)
const audioUrl = ref('')
const durationText = ref('')
const task = ref('transcribe')
const language = ref(null)
const timestamps = ref(false)
const stream = ref(true)
const result = ref(null)
const errorText = ref('')

const taskOptions = computed(() => [
  { label: t('media.speechToText.taskTranscribe'), value: 'transcribe' },
  { label: t('media.speechToText.taskTranslate'), value: 'translate' }
])

// 自动检测 + 常用语言；whisper 支持约 99 种，这里列最常用的
const languageOptions = computed(() => [
  { label: t('media.speechToText.langAuto'), value: null },
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Español', value: 'es' },
  { label: 'Русский', value: 'ru' },
  { label: '한국어', value: 'ko' },
  { label: 'Português', value: 'pt' },
  { label: 'Italiano', value: 'it' },
  { label: 'العربية', value: 'ar' }
])

const running = computed(() => whisper.busy.value)
const stage = computed(() => whisper.stage.value)
const displayProgress = computed(() => whisper.displayProgress.value)
const partialText = computed(() => whisper.partialText.value)
const modelFile = computed(() => whisper.modelFile.value)

const workingLabel = computed(() => {
  if (stage.value === 'wasm') return t('media.speechToText.phaseWasm')
  if (stage.value === 'model') return t('media.speechToText.phaseModel')
  return t('media.speechToText.phaseRun')
})

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function formatTs(seconds) {
  if (seconds == null || isNaN(seconds)) return '--:--'
  const s = Math.max(0, Math.floor(seconds))
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

function srtTs(seconds) {
  if (seconds == null || isNaN(seconds)) return '00:00:00,000'
  const ms = Math.round(seconds * 1000)
  const hh = String(Math.floor(ms / 3600000)).padStart(2, '0')
  const mm = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')
  const ss = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
  const mmm = String(ms % 1000).padStart(3, '0')
  return `${hh}:${mm}:${ss},${mmm}`
}

async function handleFileChange({ file: f }) {
  if (!f || !f.file) return
  clearFile()
  file.value = f.file
  audioUrl.value = URL.createObjectURL(f.file)
  result.value = null
  errorText.value = ''
  // 读时长（给用户一个预期：whisper 速度约 1-3x 实时）
  try {
    const probe = new Audio()
    probe.preload = 'metadata'
    probe.src = audioUrl.value
    await new Promise((resolve) => {
      probe.onloadedmetadata = resolve
      probe.onerror = resolve
      setTimeout(resolve, 3000)
    })
    if (isFinite(probe.duration) && probe.duration > 0) {
      durationText.value = `${t('media.speechToText.duration')}: ${formatTs(probe.duration)}`
    }
  } catch { /* 拿不到时长不阻塞 */ }
}

function clearFile() {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  file.value = null
  audioUrl.value = ''
  durationText.value = ''
  result.value = null
  errorText.value = ''
}

function cancelDownload() {
  whisper.wasm.cancel()
  whisper.terminate()
  errorText.value = t('media.speechToText.cancelled')
}

async function run() {
  if (!file.value) return
  errorText.value = ''
  result.value = null
  const started = Date.now()
  try {
    const audio = await whisper.decodeAudio(file.value)
    const out = await whisper.transcribe(audio, {
      task: task.value,
      language: language.value,
      timestamps: timestamps.value,
      stream: stream.value
    })
    result.value = {
      text: out.text,
      chunks: out.chunks,
      elapsed: ((Date.now() - started) / 1000).toFixed(1)
    }
  } catch (err) {
    errorText.value = String(err && err.message ? err.message : err)
  }
}

async function copyResult() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.text)
    message.success(t('common.copied'))
  } catch {
    message.error(t('common.copyError'))
  }
}

function downloadText() {
  if (!result.value) return
  const blob = new Blob([result.value.text], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, `transcript-${Date.now()}.txt`)
}

function downloadSrt() {
  if (!result.value || !result.value.chunks) return
  const lines = result.value.chunks.map((c, i) => {
    const start = srtTs(c.timestamp && c.timestamp[0])
    const end = srtTs(c.timestamp && c.timestamp[1])
    return `${i + 1}\n${start} --> ${end}\n${(c.text || '').trim()}\n`
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, `transcript-${Date.now()}.srt`)
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onUnmounted(() => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})
</script>

<style scoped>
.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.audio-player {
  width: 100%;
  margin-top: 8px;
}

.action-row {
  display: flex;
  gap: 8px;
}

.progress-area {
  margin-top: 4px;
}

.partial {
  margin-top: 4px;
}

.result {
  margin-top: 4px;
}

.chunks {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chunk-row {
  display: flex;
  gap: 10px;
  align-items: baseline;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--card-color);
}
</style>
