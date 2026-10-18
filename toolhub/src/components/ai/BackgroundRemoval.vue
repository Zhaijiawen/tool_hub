<template>
  <div class="bg-removal">
    <ToolIntro toolKey="bgRemoval" />

    <n-card :title="t('ai.bgRemoval.title')" class="tool-card">
      <!-- 上传区 -->
      <div class="upload-zone" :class="{ 'has-file': previewUrl }">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input"
          @change="onFileChange"
        />
        <div v-if="!previewUrl" class="drop-hint" @click="fileInput?.click()">
          <div class="drop-icon">🖼️</div>
          <div class="drop-text">{{ t('ai.bgRemoval.uploadHint') }}</div>
          <n-button tertiary size="small" @click.stop="fileInput?.click()">
            {{ t('ai.bgRemoval.chooseBtn') }}
          </n-button>
        </div>
        <div v-else class="preview-wrap">
          <img :src="previewUrl" class="preview-img" alt="preview" />
          <n-button tertiary size="small" class="change-btn" @click="fileInput?.click()">
            {{ t('ai.bgRemoval.changeBtn') }}
          </n-button>
        </div>
      </div>

      <!-- 模型选择 -->
      <div class="row">
        <span class="label">{{ t('ai.bgRemoval.modelLabel') }}</span>
        <n-select
          v-model:value="selectedModel"
          :options="modelOptions"
          :disabled="processing"
          class="model-select"
        />
      </div>

      <!-- 操作 -->
      <div class="row actions">
        <n-button
          type="primary"
          :loading="processing"
          :disabled="!file || processing"
          @click="removeBg"
        >
          {{ processing ? t('ai.bgRemoval.processing') : t('ai.bgRemoval.removeBtn') }}
        </n-button>
      </div>

      <!-- 进度 -->
      <n-progress
        v-if="processing"
        type="line"
        :percentage="progress"
        :height="14"
        :processing="processing"
        class="prog"
      />
      <div v-if="processing && progressText" class="prog-text">{{ progressText }}</div>

      <!-- 失败详情：只弹 toast 会让 wasm/模型加载失败完全无从排查 -->
      <n-alert v-if="error && !processing" type="error" :show-icon="true" class="err">
        {{ error }}
      </n-alert>

      <!-- 结果对比 -->
      <div v-if="resultUrl" class="result-block">
        <div class="result-title">{{ t('ai.bgRemoval.resultTitle') }}</div>
        <div class="compare">
          <figure>
            <figcaption>{{ t('ai.bgRemoval.original') }}</figcaption>
            <img :src="previewUrl" class="cmp-img" alt="original" />
          </figure>
          <figure>
            <figcaption>{{ t('ai.bgRemoval.noBg') }}</figcaption>
            <div class="checker">
              <img :src="resultUrl" class="cmp-img" alt="result" />
            </div>
          </figure>
        </div>
        <n-button type="primary" tertiary @click="download">
          {{ t('ai.bgRemoval.download') }}
        </n-button>
      </div>

      <!-- 隐私提示 -->
      <n-alert type="success" :show-icon="true" class="privacy-note">
        {{ t('ai.bgRemoval.privacyNote') }}
      </n-alert>
    </n-card>

    <TutorialAndDocs toolKey="bgRemoval" />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal'
import ToolIntro from '@/components/common/ToolIntro.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const fileInput = ref(null)
const file = ref(null)
const previewUrl = ref('')
const resultUrl = ref('')
const processing = ref(false)
const progress = ref(0)
const progressText = ref('')

const modelOptions = computed(() => [
  { label: t('ai.bgRemoval.modelQuint8'), value: 'isnet_quint8' },
  { label: t('ai.bgRemoval.modelFp16'), value: 'isnet_fp16' }
])
const selectedModel = ref('isnet_quint8')

function revoke(url) {
  if (url) URL.revokeObjectURL(url)
}

function onFileChange(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  if (!f.type.startsWith('image/')) {
    message.error(t('ai.bgRemoval.notImage'))
    return
  }
  revoke(previewUrl.value)
  revoke(resultUrl.value)
  previewUrl.value = ''
  resultUrl.value = ''
  error.value = ''
  file.value = f
  previewUrl.value = URL.createObjectURL(f)
}

async function removeBg() {
  if (!file.value) return
  processing.value = true
  progress.value = 0
  error.value = ''
  progressText.value = t('ai.bgRemoval.loadingModel')
  try {
    const blob = await imglyRemoveBackground(file.value, {
      // 必须是绝对 URL：imgly 内部用 new URL('resources.json', publicPath) 拼接
      // 分片地址，base 非法会直接抛 "Failed to construct 'URL': Invalid base URL"，
      // 表现为静默失败（catch 后只弹一个笼统的错误提示）。
      publicPath: new URL('/imgly-bg/', window.location.origin).toString(),
      model: selectedModel.value,
      output: { format: 'image/png' },
      progress: (key, current, total) => {
        if (total) {
          const pct = Math.round((current / total) * 100)
          progress.value = pct
          progressText.value = `${key} ${pct}%`
        }
      }
    })
    revoke(resultUrl.value)
    resultUrl.value = URL.createObjectURL(blob)
    message.success(t('ai.bgRemoval.done'))
  } catch (err) {
    console.error('[bgRemoval] failed:', err)
    // 保留原始原因：imgly 的失败信息（如 wasm 实例化失败）藏在 err.message 里，
    // 只弹笼统提示会让排障完全失去线索
    error.value = String(err && err.message ? err.message : err)
    message.error(t('ai.bgRemoval.error'))
  } finally {
    processing.value = false
  }
}

function download() {
  if (!resultUrl.value) return
  const a = document.createElement('a')
  a.href = resultUrl.value
  a.download = 'no-background.png'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

onBeforeUnmount(() => {
  revoke(previewUrl.value)
  revoke(resultUrl.value)
})
</script>

<style scoped>
.bg-removal {
  max-width: 880px;
  margin: 0 auto;
}
.tool-card {
  margin-top: 12px;
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
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.label {
  font-size: 14px;
  color: #5a5f6b;
  min-width: 72px;
}
.model-select {
  min-width: 240px;
}
.actions {
  margin-top: 16px;
}
.prog {
  margin-top: 14px;
}
.prog-text {
  margin-top: 6px;
  font-size: 12px;
  color: #8a8f99;
  word-break: break-all;
}
.result-block {
  margin-top: 20px;
}
.result-title {
  font-weight: 600;
  margin-bottom: 10px;
}
.compare {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.compare figure {
  margin: 0;
  flex: 1 1 240px;
}
.compare figcaption {
  font-size: 12px;
  color: #8a8f99;
  margin-bottom: 6px;
}
.cmp-img {
  width: 100%;
  border-radius: 8px;
  display: block;
}
.checker {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  border-radius: 8px;
}
.privacy-note {
  margin-top: 18px;
}
.err {
  margin-top: 12px;
  font-size: 12px;
  word-break: break-word;
}
</style>
