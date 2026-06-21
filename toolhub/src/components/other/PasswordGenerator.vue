<template>
  <div class="password-generator">
    <!-- 工具简介 -->
    <ToolIntro toolKey="password" />

    <n-card :title="t('other.password.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 长度配置 -->
        <div class="config-section">
          <div class="config-row">
            <n-text class="section-label">{{ t('other.password.length') }}：</n-text>
            <n-input-number
              v-model:value="pwdLength"
              :min="4"
              :max="128"
              style="width: 100px;"
              @update:value="onConfigChange"
            />
            <n-slider
              v-model:value="pwdLength"
              :min="4"
              :max="128"
              :step="1"
              style="flex: 1; min-width: 200px;"
              @update:value="onConfigChange"
            />
          </div>
        </div>

        <!-- 字符集配置 -->
        <div class="config-section">
          <n-text class="section-label">{{ t('other.password.charset') }}</n-text>
          <n-space>
            <n-checkbox v-model:checked="useUpper" @update:checked="onConfigChange">
              {{ t('other.password.uppercase') }} (A-Z)
            </n-checkbox>
            <n-checkbox v-model:checked="useLower" @update:checked="onConfigChange">
              {{ t('other.password.lowercase') }} (a-z)
            </n-checkbox>
            <n-checkbox v-model:checked="useDigits" @update:checked="onConfigChange">
              {{ t('other.password.digits') }} (0-9)
            </n-checkbox>
            <n-checkbox v-model:checked="useSymbols" @update:checked="onConfigChange">
              {{ t('other.password.symbols') }}
            </n-checkbox>
          </n-space>
          <div v-if="useSymbols" class="symbol-config">
            <n-text depth="3" style="font-size: 12px;">{{ t('other.password.customSymbols') }}：</n-text>
            <n-input
              v-model:value="symbolSet"
              style="width: 260px; font-family: monospace;"
              :placeholder="t('other.password.symbolsPlaceholder')"
              @update:value="onConfigChange"
            />
          </div>
          <div class="exclude-config">
            <n-checkbox v-model:checked="excludeAmbiguous" @update:checked="onConfigChange">
              {{ t('other.password.excludeAmbiguous') }} (0, O, l, 1, I)
            </n-checkbox>
          </div>
        </div>

        <!-- 强度指示 -->
        <div v-if="strength" class="strength-section">
          <n-text class="section-label">{{ t('other.password.strength') }}：</n-text>
          <span class="strength-badge" :class="`strength-${strength.level}`">
            {{ t(`other.password.strength_${strength.level}`) }}
          </span>
          <n-progress
            type="line"
            :percentage="strength.score"
            :color="strength.color"
            :rail-color="'var(--border-color)'"
            :height="8"
            :show-indicator="false"
            style="margin-top: 8px;"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="action-row">
          <n-text class="section-label">{{ t('other.password.count') }}：</n-text>
          <n-input-number
            v-model:value="generateCount"
            :min="1"
            :max="20"
            style="width: 90px;"
          />
          <n-button type="primary" @click="generate" :disabled="!hasCharset">
            {{ t('other.password.generate') }}
          </n-button>
          <n-button @click="copyAll" :disabled="results.length === 0">
            {{ t('other.password.copyAll') }}
          </n-button>
          <n-button @click="clearResults" :disabled="results.length === 0" quaternary>
            {{ t('common.clear') }}
          </n-button>
        </div>

        <n-alert v-if="!hasCharset" type="warning" :show-icon="false" style="padding: 8px 12px;">
          {{ t('other.password.noCharset') }}
        </n-alert>

        <!-- 结果列表 -->
        <div v-if="results.length > 0" class="result-section">
          <div class="result-header">
            <n-text class="section-label">
              {{ t('other.password.results') }}（{{ results.length }} {{ t('other.password.items') }}）
            </n-text>
            <n-text depth="3" style="font-size: 12px;">{{ t('other.password.clickToCopy') }}</n-text>
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
        <div v-else-if="hasCharset" class="empty-placeholder">
          <n-text depth="3">{{ t('other.password.emptyTip') }}</n-text>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="password" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_password_input'

const pwdLength = ref(16)
const useUpper = ref(true)
const useLower = ref(true)
const useDigits = ref(true)
const useSymbols = ref(true)
const symbolSet = ref('!@#$%^&*()_+-=[]{}|;:,.<>?')
const excludeAmbiguous = ref(false)
const generateCount = ref(5)
const results = ref([])

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const s = JSON.parse(saved)
      if (s.pwdLength) pwdLength.value = s.pwdLength
      if (s.useUpper !== undefined) useUpper.value = s.useUpper
      if (s.useLower !== undefined) useLower.value = s.useLower
      if (s.useDigits !== undefined) useDigits.value = s.useDigits
      if (s.useSymbols !== undefined) useSymbols.value = s.useSymbols
      if (s.symbolSet) symbolSet.value = s.symbolSet
      if (s.excludeAmbiguous !== undefined) excludeAmbiguous.value = s.excludeAmbiguous
      if (s.generateCount) generateCount.value = s.generateCount
    }
  } catch {}
})

const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pwdLength: pwdLength.value,
      useUpper: useUpper.value,
      useLower: useLower.value,
      useDigits: useDigits.value,
      useSymbols: useSymbols.value,
      symbolSet: symbolSet.value,
      excludeAmbiguous: excludeAmbiguous.value,
      generateCount: generateCount.value
    }))
  } catch {}
}

const onConfigChange = () => saveState()

const buildCharset = () => {
  const AMBIGUOUS = new Set('0Ol1I')
  let charset = ''
  if (useUpper.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (useLower.value) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (useDigits.value) charset += '0123456789'
  if (useSymbols.value) charset += symbolSet.value
  if (excludeAmbiguous.value) {
    charset = charset.split('').filter(c => !AMBIGUOUS.has(c)).join('')
  }
  return [...new Set(charset.split(''))].join('') // 去重
}

const hasCharset = computed(() => {
  return useUpper.value || useLower.value || useDigits.value || (useSymbols.value && symbolSet.value.length > 0)
})

// 密码强度评估
const strength = computed(() => {
  if (results.value.length === 0) return null
  const len = pwdLength.value
  const typeCount = [useUpper.value, useLower.value, useDigits.value, useSymbols.value].filter(Boolean).length
  let score = 0
  if (len >= 8) score += 20
  if (len >= 12) score += 20
  if (len >= 16) score += 20
  if (len >= 20) score += 10
  if (typeCount >= 2) score += 10
  if (typeCount >= 3) score += 10
  if (typeCount >= 4) score += 10
  score = Math.min(100, score)
  let level, color
  if (score < 40) { level = 'weak'; color = '#d03050' }
  else if (score < 60) { level = 'medium'; color = '#f0a020' }
  else if (score < 80) { level = 'strong'; color = '#18a058' }
  else { level = 'very_strong'; color = '#1677ff' }
  return { score, level, color }
})

const generateOne = (charset) => {
  const len = pwdLength.value
  const array = new Uint32Array(len)
  crypto.getRandomValues(array)
  return Array.from(array, n => charset[n % charset.length]).join('')
}

const generate = () => {
  saveState()
  const charset = buildCharset()
  if (!charset) return
  const count = generateCount.value
  results.value = Array.from({ length: count }, () => generateOne(charset))
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

const clearResults = () => { results.value = [] }
</script>

<style scoped>
.password-generator {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.symbol-config {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.exclude-config {
  margin-top: 4px;
}

.strength-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.strength-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.strength-weak { background: rgba(208,48,80,0.12); color: #d03050; }
.strength-medium { background: rgba(240,160,32,0.12); color: #f0a020; }
.strength-strong { background: rgba(24,160,88,0.12); color: #18a058; }
.strength-very_strong { background: rgba(22,119,255,0.12); color: #1677ff; }

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

.result-item:last-child { border-bottom: none; }
.result-item:hover { background-color: var(--card-color); }
.result-item:hover .copy-icon { opacity: 1; }

.result-index {
  font-size: 12px;
  min-width: 24px;
  text-align: right;
}

.result-value {
  flex: 1;
  font-size: 14px;
  word-break: break-all;
  letter-spacing: 0.05em;
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

