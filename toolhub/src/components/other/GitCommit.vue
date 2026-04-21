<template>
  <div class="git-commit">
    <n-card :title="t('other.gitCommit.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 表单区 -->
        <n-grid :cols="2" :x-gap="20" :y-gap="0" responsive="screen">
          <!-- Type -->
          <n-gi>
            <n-form-item :label="t('other.gitCommit.type')">
              <n-select
                v-model:value="form.type"
                :options="typeOptions"
                :render-label="renderTypeLabel"
                @update:value="saveAndPreview"
              />
            </n-form-item>
          </n-gi>
          <!-- Scope -->
          <n-gi>
            <n-form-item :label="t('other.gitCommit.scope')">
              <n-input
                v-model:value="form.scope"
                :placeholder="t('other.gitCommit.scopePlaceholder')"
                clearable
                @input="saveAndPreview"
              />
            </n-form-item>
          </n-gi>
          <!-- Subject -->
          <n-gi :span="2">
            <n-form-item
              :label="`${t('other.gitCommit.subject')} (${form.subject.length}/72)`"
              :feedback="subjectError"
              :validation-status="subjectError ? 'error' : undefined"
            >
              <n-input
                v-model:value="form.subject"
                :placeholder="t('other.gitCommit.subjectPlaceholder')"
                :maxlength="72"
                show-count
                @input="saveAndPreview"
              />
            </n-form-item>
          </n-gi>
          <!-- Body -->
          <n-gi :span="2">
            <n-form-item :label="t('other.gitCommit.body')">
              <n-input
                v-model:value="form.body"
                type="textarea"
                :placeholder="t('other.gitCommit.bodyPlaceholder')"
                :rows="3"
                @input="saveAndPreview"
              />
            </n-form-item>
          </n-gi>
          <!-- Breaking Change -->
          <n-gi :span="2">
            <n-form-item>
              <n-space align="center">
                <n-switch v-model:value="form.breaking" @update:value="saveAndPreview" />
                <n-text>{{ t('other.gitCommit.breaking') }}</n-text>
              </n-space>
            </n-form-item>
          </n-gi>
          <n-gi v-if="form.breaking" :span="2">
            <n-form-item :label="t('other.gitCommit.breakingDesc')">
              <n-input
                v-model:value="form.breakingDesc"
                :placeholder="t('other.gitCommit.breakingDescPlaceholder')"
                @input="saveAndPreview"
              />
            </n-form-item>
          </n-gi>
          <!-- Issues -->
          <n-gi :span="2">
            <n-form-item :label="t('other.gitCommit.issues')">
              <n-input
                v-model:value="form.issues"
                :placeholder="t('other.gitCommit.issuesPlaceholder')"
                clearable
                @input="saveAndPreview"
              />
            </n-form-item>
          </n-gi>
        </n-grid>

        <!-- 预览区 -->
        <div class="preview-section">
          <n-text class="preview-label">{{ t('other.gitCommit.preview') }}</n-text>
          <div class="commit-preview">
            <pre class="commit-text">{{ previewText || t('other.gitCommit.previewEmpty') }}</pre>
          </div>
          <n-space style="margin-top: 10px">
            <n-button type="primary" :disabled="!previewText" @click="copyFull">
              {{ t('other.gitCommit.copyFull') }}
            </n-button>
            <n-button :disabled="!titleLine" @click="copyTitle">
              {{ t('other.gitCommit.copyTitle') }}
            </n-button>
            <n-button @click="resetForm">{{ t('common.clear') }}</n-button>
          </n-space>
        </div>

        <!-- 历史记录 -->
        <div v-if="history.length > 0" class="history-section">
          <n-divider>{{ t('other.gitCommit.history') }}</n-divider>
          <div v-for="(item, idx) in history" :key="idx" class="history-item">
            <div class="history-content">
              <n-tag size="small" :type="getTypeTag(item.type)" style="flex-shrink:0">{{ item.type }}</n-tag>
              <n-text class="history-text" @click="loadHistory(item)">{{ item.title }}</n-text>
            </div>
            <n-button size="tiny" quaternary @click="deleteHistory(idx)">✕</n-button>
          </div>
        </div>

        <!-- 使用说明 -->
        <n-alert type="info" :title="t('other.gitCommit.infoTitle')">
          <div>{{ t('other.gitCommit.infoContent') }}</div>
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="gitCommit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NText, NTag } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const LS_KEY = 'toolhub_gitCommit_input'
const LS_HISTORY_KEY = 'toolhub_gitCommit_history'

// ── 表单 ──────────────────────────────────────
const form = ref({
  type: 'feat',
  scope: '',
  subject: '',
  body: '',
  breaking: false,
  breakingDesc: '',
  issues: ''
})

// ── commit types ──────────────────────────────
const COMMIT_TYPE_META = [
  { value: 'feat',     emoji: '✨', descKey: 'typeFeatDesc'     },
  { value: 'fix',      emoji: '🐛', descKey: 'typeFixDesc'      },
  { value: 'docs',     emoji: '📝', descKey: 'typeDocsDesc'     },
  { value: 'style',    emoji: '💄', descKey: 'typeStyleDesc'    },
  { value: 'refactor', emoji: '♻️', descKey: 'typeRefactorDesc' },
  { value: 'perf',     emoji: '⚡️', descKey: 'typePerfDesc'     },
  { value: 'test',     emoji: '✅', descKey: 'typeTestDesc'     },
  { value: 'chore',    emoji: '🔧', descKey: 'typeChoreDesc'    },
  { value: 'revert',   emoji: '⏪', descKey: 'typeRevertDesc'   },
  { value: 'build',    emoji: '📦', descKey: 'typeBuildDesc'    },
  { value: 'ci',       emoji: '👷', descKey: 'typeCiDesc'       }
]

const typeOptions = computed(() =>
  COMMIT_TYPE_META.map(ct => ({
    label: ct.value,
    value: ct.value,
    emoji: ct.emoji,
    desc: t(`other.gitCommit.${ct.descKey}`)
  }))
)

const renderTypeLabel = (option) => {
  return h('div', { style: 'display:flex;align-items:center;gap:8px;' }, [
    h('span', option.emoji),
    h(NText, null, { default: () => option.label }),
    h(NText, { depth: 3, style: 'font-size:12px' }, { default: () => option.desc })
  ])
}

const getTypeTag = (type) => {
  const map = { feat: 'success', fix: 'error', docs: 'info', style: 'warning', refactor: 'primary', perf: 'success', test: 'info', chore: 'default', revert: 'warning', build: 'default', ci: 'info' }
  return map[type] || 'default'
}

// ── 预览计算 ──────────────────────────────────
const titleLine = computed(() => {
  if (!form.value.subject.trim()) return ''
  const scope = form.value.scope.trim() ? `(${form.value.scope.trim()})` : ''
  const bang   = form.value.breaking ? '!' : ''
  return `${form.value.type}${scope}${bang}: ${form.value.subject.trim()}`
})

const previewText = computed(() => {
  if (!titleLine.value) return ''
  const parts = [titleLine.value]
  if (form.value.body.trim()) {
    parts.push('')
    parts.push(form.value.body.trim())
  }
  if (form.value.breaking && form.value.breakingDesc.trim()) {
    parts.push('')
    parts.push(`BREAKING CHANGE: ${form.value.breakingDesc.trim()}`)
  }
  if (form.value.issues.trim()) {
    parts.push('')
    parts.push(`Closes: ${form.value.issues.trim()}`)
  }
  return parts.join('\n')
})

const subjectError = computed(() => {
  if (form.value.subject.length > 72) return t('other.gitCommit.subjectTooLong')
  return ''
})

// ── 历史记录 ─────────────────────────────────
const history = ref([])

const loadHistoryFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY)
    if (raw) history.value = JSON.parse(raw)
  } catch { /* ignore */ }
}

const saveHistoryToLS = () => {
  localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history.value))
}

const pushHistory = () => {
  if (!titleLine.value) return
  const entry = { type: form.value.type, title: titleLine.value, full: previewText.value }
  // 去重
  const idx = history.value.findIndex(h => h.title === entry.title)
  if (idx !== -1) history.value.splice(idx, 1)
  history.value.unshift(entry)
  if (history.value.length > 5) history.value = history.value.slice(0, 5)
  saveHistoryToLS()
}

const loadHistory = (item) => {
  // 解析 title 回填表单
  const match = item.title.match(/^([a-z]+)(\(([^)]*)\))?(!)?:\s(.+)$/)
  if (match) {
    form.value.type    = match[1]
    form.value.scope   = match[3] || ''
    form.value.breaking = !!match[4]
    form.value.subject = match[5]
  }
  saveAndPreview()
}

const deleteHistory = (idx) => {
  history.value.splice(idx, 1)
  saveHistoryToLS()
}

// ── 持久化 ───────────────────────────────────
const saveAndPreview = () => {
  localStorage.setItem(LS_KEY, JSON.stringify(form.value))
}

// ── 操作 ─────────────────────────────────────
const copyFull = () => {
  if (!previewText.value) return
  navigator.clipboard.writeText(previewText.value)
  pushHistory()
  message.success(t('other.gitCommit.copied'))
}

const copyTitle = () => {
  if (!titleLine.value) return
  navigator.clipboard.writeText(titleLine.value)
  message.success(t('other.gitCommit.copied'))
}

const resetForm = () => {
  form.value = { type: 'feat', scope: '', subject: '', body: '', breaking: false, breakingDesc: '', issues: '' }
  saveAndPreview()
}

// ── 挂载时恢复 ───────────────────────────────
onMounted(() => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      form.value = { ...form.value, ...saved }
    }
  } catch { /* ignore */ }
  loadHistoryFromLS()
})
</script>

<style scoped>
.git-commit {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.preview-section {
  background: var(--code-color, #f8f8f8);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 16px;
}

.preview-label {
  font-size: 13px;
  font-weight: 500;
  display: block;
  margin-bottom: 10px;
}

.commit-preview {
  background: var(--card-color, #ffffff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  padding: 12px 16px;
  min-height: 60px;
}

.commit-text {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-color, inherit);
}

.history-section {
  padding: 0 4px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.history-item:last-child {
  border-bottom: none;
}

.history-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.history-text {
  font-size: 13px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.history-text:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .git-commit {
    padding: 0 12px;
  }
}
</style>

