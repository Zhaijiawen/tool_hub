<template>
  <div class="diff-tool">
    <n-card :title="t('convert.diff.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 模式选择 -->
        <div class="mode-section">
          <n-text class="section-title">{{ t('convert.diff.mode') }}</n-text>
          <n-radio-group v-model:value="diffMode" @update:value="runDiff">
            <n-space>
              <n-radio value="lines">{{ t('convert.diff.lineMode') }}</n-radio>
              <n-radio value="chars">{{ t('convert.diff.charMode') }}</n-radio>
              <n-radio value="words">{{ t('convert.diff.wordMode') }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 双栏输入 -->
        <div class="editor-row">
          <div class="editor-col">
            <div class="editor-header">
              <n-text class="section-title">{{ t('convert.diff.original') }}</n-text>
              <n-button size="tiny" @click="copyLeft" quaternary>{{ t('common.copy') }}</n-button>
            </div>
            <n-input
              v-model:value="leftText"
              type="textarea"
              :placeholder="t('convert.diff.placeholder')"
              :autosize="{ minRows: 12, maxRows: 20 }"
              @input="handleInput"
            />
          </div>
          <div class="editor-col">
            <div class="editor-header">
              <n-text class="section-title">{{ t('convert.diff.modified') }}</n-text>
              <n-button size="tiny" @click="copyRight" quaternary>{{ t('common.copy') }}</n-button>
            </div>
            <n-input
              v-model:value="rightText"
              type="textarea"
              :placeholder="t('convert.diff.placeholder')"
              :autosize="{ minRows: 12, maxRows: 20 }"
              @input="handleInput"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <n-space>
            <n-button type="primary" @click="runDiff">{{ t('convert.diff.compare') }}</n-button>
            <n-button @click="swapTexts">{{ t('convert.diff.swap') }}</n-button>
            <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
          </n-space>
        </div>

        <!-- 统计信息 -->
        <div v-if="diffResult" class="stats-section">
          <n-space>
            <n-tag type="success">+{{ stats.added }} {{ t('convert.diff.linesAdded') }}</n-tag>
            <n-tag type="error">-{{ stats.removed }} {{ t('convert.diff.linesRemoved') }}</n-tag>
            <n-tag>{{ t('convert.diff.unchanged') }}: {{ stats.unchanged }}</n-tag>
          </n-space>
        </div>

        <!-- diff 结果 -->
        <div v-if="diffResult" class="result-section">
          <n-text class="section-title">{{ t('convert.diff.result') }}</n-text>
          <div class="diff-output">
            <div
              v-for="(part, index) in diffResult"
              :key="index"
              class="diff-line"
              :class="{
                'diff-added': part.added,
                'diff-removed': part.removed,
                'diff-unchanged': !part.added && !part.removed
              }"
            >
              <span class="diff-sign">{{ part.added ? '+' : part.removed ? '-' : ' ' }}</span>
              <span class="diff-content">{{ part.value }}</span>
            </div>
          </div>
        </div>

      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import * as Diff from 'diff'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_diff_input'

const leftText = ref('')
const rightText = ref('')
const diffMode = ref('lines')
const diffResult = ref(null)

const stats = computed(() => {
  if (!diffResult.value) return { added: 0, removed: 0, unchanged: 0 }
  let added = 0, removed = 0, unchanged = 0
  for (const part of diffResult.value) {
    const lines = part.value.split('\n').filter(l => l !== '')
    if (part.added) added += lines.length
    else if (part.removed) removed += lines.length
    else unchanged += lines.length
  }
  return { added, removed, unchanged }
})

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: leftText.value, right: rightText.value }))
  } catch (e) { /* ignore */ }
}

const handleInput = () => {
  saveToStorage()
  runDiff()
}

const runDiff = () => {
  if (!leftText.value && !rightText.value) {
    diffResult.value = null
    return
  }
  try {
    if (diffMode.value === 'lines') {
      diffResult.value = Diff.diffLines(leftText.value, rightText.value)
    } else if (diffMode.value === 'chars') {
      diffResult.value = Diff.diffChars(leftText.value, rightText.value)
    } else {
      diffResult.value = Diff.diffWords(leftText.value, rightText.value)
    }
  } catch (e) {
    message.error(t('common.error') + ': ' + e.message)
  }
}

const swapTexts = () => {
  const tmp = leftText.value
  leftText.value = rightText.value
  rightText.value = tmp
  runDiff()
}

const clearAll = () => {
  leftText.value = ''
  rightText.value = ''
  diffResult.value = null
  localStorage.removeItem(STORAGE_KEY)
}

const copyLeft = () => {
  navigator.clipboard.writeText(leftText.value).then(() => {
    message.success(t('common.copySuccess'))
  })
}

const copyRight = () => {
  navigator.clipboard.writeText(rightText.value).then(() => {
    message.success(t('common.copySuccess'))
  })
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { left, right } = JSON.parse(saved)
      leftText.value = left || ''
      rightText.value = right || ''
      runDiff()
    }
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.diff-tool {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.mode-section {
  margin-bottom: 4px;
}

.editor-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.editor-col {
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.actions-section {
  margin: 4px 0;
}

.stats-section {
  margin: 4px 0;
}

.result-section {
  margin-top: 4px;
}

.diff-output {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  overflow-x: auto;
  background: var(--background-color, #fff);
  padding: 8px 0;
}

.diff-line {
  display: flex;
  align-items: flex-start;
  padding: 2px 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.diff-added {
  background-color: rgba(82, 196, 26, 0.15);
}

.diff-removed {
  background-color: rgba(255, 77, 79, 0.15);
}

.diff-unchanged {
  background-color: transparent;
}

.diff-sign {
  width: 16px;
  flex-shrink: 0;
  font-weight: bold;
  color: inherit;
  user-select: none;
}

.diff-added .diff-sign { color: #52c41a; }
.diff-removed .diff-sign { color: #ff4d4f; }

.diff-content {
  flex: 1;
}

@media (max-width: 768px) {
  .diff-tool {
    padding: 0 12px;
  }
  .editor-row {
    grid-template-columns: 1fr;
  }
}
</style>

