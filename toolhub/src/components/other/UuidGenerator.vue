<template>
  <div class="uuid-generator">
    <!-- 工具简介 -->
    <ToolIntro toolKey="uuid" />

    <n-card :title="t('other.uuid.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 类型 + 配置 -->
        <div class="config-row">
          <div class="config-item">
            <n-text class="section-label">{{ t('other.uuid.type') }}</n-text>
            <n-radio-group v-model:value="uuidType" @update:value="onTypeChange">
              <n-space>
                <n-radio value="v4">UUID v4</n-radio>
                <n-radio value="v1">UUID v1</n-radio>
                <n-radio value="v7">UUID v7</n-radio>
                <n-radio value="nanoid">NanoID</n-radio>
              </n-space>
            </n-radio-group>
          </div>

          <!-- UUID 格式选项 -->
          <div v-if="uuidType !== 'nanoid'" class="config-item">
            <n-text class="section-label">{{ t('other.uuid.format') }}</n-text>
            <n-space>
              <n-checkbox v-model:checked="withHyphens">{{ t('other.uuid.withHyphens') }}</n-checkbox>
              <n-checkbox v-model:checked="uppercase">{{ t('other.uuid.uppercase') }}</n-checkbox>
            </n-space>
          </div>

          <!-- NanoID 配置 -->
          <div v-if="uuidType === 'nanoid'" class="config-item nanoid-config">
            <n-text class="section-label">{{ t('other.uuid.length') }}</n-text>
            <n-input-number
              v-model:value="nanoidLength"
              :min="4"
              :max="128"
              style="width: 120px;"
            />
            <n-text class="section-label" style="margin-left: 16px;">{{ t('other.uuid.alphabet') }}</n-text>
            <n-input
              v-model:value="nanoidAlphabet"
              :placeholder="t('other.uuid.alphabetPlaceholder')"
              style="width: 280px;"
              clearable
            />
          </div>
        </div>

        <!-- 数量 + 生成按钮 -->
        <div class="action-row">
          <n-text class="section-label">{{ t('other.uuid.count') }}</n-text>
          <n-input-number
            v-model:value="generateCount"
            :min="1"
            :max="100"
            style="width: 100px;"
          />
          <n-button type="primary" @click="generate" :loading="generating">
            {{ t('other.uuid.generate') }}
          </n-button>
          <n-button @click="copyAll" :disabled="results.length === 0">
            {{ t('other.uuid.copyAll') }}
          </n-button>
          <n-button @click="clearResults" :disabled="results.length === 0" quaternary>
            {{ t('common.clear') }}
          </n-button>
        </div>

        <!-- 结果列表 -->
        <div v-if="results.length > 0" class="result-section">
          <div class="result-header">
            <n-text class="section-label">
              {{ t('other.uuid.results') }}（{{ results.length }} {{ t('other.uuid.items') }}）
            </n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('other.uuid.clickToCopy') }}</n-text>
          </div>
          <div class="result-list">
            <div
              v-for="(item, index) in results"
              :key="index"
              class="result-item"
              @click="copySingle(item)"
            >
              <n-text class="result-index" depth="3">{{ String(index + 1).padStart(2, '0') }}</n-text>
              <n-text class="result-value font-mono">{{ item }}</n-text>
              <n-icon class="copy-icon" :depth="3">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/></svg>
              </n-icon>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-placeholder">
          <n-text depth="3">{{ t('other.uuid.emptyTip') }}</n-text>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="uuid" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_uuid_input'

const uuidType = ref('v4')
const withHyphens = ref(true)
const uppercase = ref(false)
const nanoidLength = ref(21)
const nanoidAlphabet = ref('')
const generateCount = ref(10)
const results = ref([])
const generating = ref(false)

// 持久化
onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const s = JSON.parse(saved)
      if (s.uuidType) uuidType.value = s.uuidType
      if (s.generateCount) generateCount.value = s.generateCount
      if (s.uppercase !== undefined) uppercase.value = s.uppercase
      if (s.withHyphens !== undefined) withHyphens.value = s.withHyphens
      if (s.nanoidLength) nanoidLength.value = s.nanoidLength
      if (s.nanoidAlphabet !== undefined) nanoidAlphabet.value = s.nanoidAlphabet
    }
  } catch {}
})

const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      uuidType: uuidType.value,
      generateCount: generateCount.value,
      uppercase: uppercase.value,
      withHyphens: withHyphens.value,
      nanoidLength: nanoidLength.value,
      nanoidAlphabet: nanoidAlphabet.value
    }))
  } catch {}
}

const onTypeChange = () => saveState()

const formatUuid = (uuid) => {
  let result = uuid
  if (!withHyphens.value) result = result.replace(/-/g, '')
  if (uppercase.value) result = result.toUpperCase()
  return result
}

const generate = async () => {
  generating.value = true
  saveState()
  try {
    const count = generateCount.value
    const type = uuidType.value
    const newResults = []

    if (type === 'nanoid') {
      const { nanoid, customAlphabet } = await import('nanoid')
      const alphabet = nanoidAlphabet.value.trim()
      const generator = alphabet.length >= 2 ? customAlphabet(alphabet, nanoidLength.value) : () => nanoid(nanoidLength.value)
      for (let i = 0; i < count; i++) {
        newResults.push(generator())
      }
    } else {
      const uuidLib = await import('uuid')
      const generator = type === 'v1' ? uuidLib.v1 : type === 'v7' ? uuidLib.v7 : uuidLib.v4
      for (let i = 0; i < count; i++) {
        newResults.push(formatUuid(generator()))
      }
    }
    results.value = newResults
  } catch (e) {
    message.error(t('common.error') + ': ' + e.message)
  } finally {
    generating.value = false
  }
}

const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(results.value.join('\n'))
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}

const copySingle = async (val) => {
  try {
    await navigator.clipboard.writeText(val)
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}

const clearResults = () => {
  results.value = []
}
</script>

<style scoped>
.uuid-generator {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.config-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.nanoid-config {
  flex-wrap: wrap;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.result-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-color);
}

.result-list {
  max-height: 480px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-color);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: var(--card-color);
}

.result-item:hover .copy-icon {
  opacity: 1;
}

.result-index {
  font-size: 12px;
  min-width: 24px;
  text-align: right;
}

.result-value {
  flex: 1;
  font-size: 14px;
  word-break: break-all;
}

.font-mono {
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
}

.copy-icon {
  width: 16px;
  height: 16px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>

