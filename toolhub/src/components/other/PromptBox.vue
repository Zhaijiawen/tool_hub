<template>
  <div class="prompt-box-tool">
    <n-card :title="t('other.promptBox.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 顶部操作栏 -->
        <div class="toolbar">
          <n-input
            v-model:value="searchText"
            :placeholder="t('other.promptBox.searchPlaceholder')"
            clearable
            class="search-input"
          >
            <template #prefix>🔍</template>
          </n-input>
          <n-select
            v-model:value="selectedCategory"
            :options="categoryOptions"
            class="category-select"
          />
          <n-button type="primary" @click="openAddDialog">
            + {{ t('other.promptBox.addPrompt') }}
          </n-button>
        </div>

        <!-- Prompt 卡片列表 -->
        <div v-if="filteredPrompts.length > 0" class="prompt-grid">
          <div
            v-for="prompt in filteredPrompts"
            :key="prompt.id"
            class="prompt-card"
            :class="{ 'is-builtin': prompt.builtin }"
          >
            <div class="card-header">
              <div class="card-title-row">
                <n-tag size="small" :type="getCategoryType(prompt.category)" class="category-tag">
                  {{ getCategoryLabel(prompt.category) }}
                </n-tag>
                <span class="card-title">{{ prompt.title }}</span>
              </div>
              <div class="card-actions">
                <n-button
                  v-if="hasVariables(prompt.content)"
                  size="tiny"
                  quaternary
                  @click="openFillDialog(prompt)"
                >
                  {{ t('other.promptBox.fillVars') }}
                </n-button>
                <n-button size="tiny" quaternary @click="copyPrompt(prompt)">
                  {{ t('common.copy') }}
                </n-button>
                <n-button v-if="!prompt.builtin" size="tiny" quaternary @click="openEditDialog(prompt)">
                  {{ t('common.edit') }}
                </n-button>
                <n-button v-if="!prompt.builtin" size="tiny" quaternary type="error" @click="deletePrompt(prompt.id)">
                  {{ t('common.delete') }}
                </n-button>
              </div>
            </div>
            <div v-if="prompt.desc" class="card-desc">{{ prompt.desc }}</div>
            <div class="card-content" @click="openFillDialog(prompt)">{{ prompt.content }}</div>
            <div v-if="hasVariables(prompt.content)" class="card-vars">
              <n-tag
                v-for="v in extractVariables(prompt.content)"
                :key="v"
                size="tiny"
                type="warning"
                class="var-tag"
              >{{ v }}</n-tag>
            </div>
          </div>
        </div>

        <n-empty v-else :description="t('other.promptBox.noResult')" />

        <!-- 统计信息 -->
        <n-text depth="3" class="stats-text">
          {{ t('other.promptBox.stats', { total: prompts.length, builtin: builtinCount, custom: customCount }) }}
        </n-text>

      </n-space>
    </n-card>

    <!-- 变量填充弹窗 -->
    <n-modal
      v-model:show="fillDialogVisible"
      :title="t('other.promptBox.fillVarsTitle')"
      preset="card"
      class="fill-modal"
    >
      <n-space vertical size="medium">
        <div class="preview-label">{{ t('other.promptBox.promptContent') }}</div>
        <div class="fill-preview">{{ fillPreview }}</div>
        <n-divider style="margin: 8px 0" />
        <div v-for="v in fillVarList" :key="v" class="var-row">
          <n-text class="var-name">{{ v }}</n-text>
          <n-input
            v-model:value="fillValues[v]"
            :placeholder="t('other.promptBox.varPlaceholder', { name: v })"
            size="small"
          />
        </div>
        <n-space justify="end">
          <n-button @click="fillDialogVisible = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" @click="copyFilled">{{ t('other.promptBox.copyFilled') }}</n-button>
        </n-space>
      </n-space>
    </n-modal>

    <!-- 新增/编辑弹窗 -->
    <n-modal
      v-model:show="editDialogVisible"
      :title="editingPrompt.id ? t('other.promptBox.editTitle') : t('other.promptBox.addTitle')"
      preset="card"
      class="edit-modal"
    >
      <n-form :model="editingPrompt" label-placement="top">
        <n-form-item :label="t('other.promptBox.fieldTitle')" required>
          <n-input v-model:value="editingPrompt.title" :placeholder="t('other.promptBox.titlePlaceholder')" />
        </n-form-item>
        <n-form-item :label="t('other.promptBox.fieldCategory')">
          <n-select v-model:value="editingPrompt.category" :options="customCategoryOptions" />
        </n-form-item>
        <n-form-item :label="t('other.promptBox.fieldDesc')">
          <n-input v-model:value="editingPrompt.desc" :placeholder="t('other.promptBox.descPlaceholder')" />
        </n-form-item>
        <n-form-item :label="t('other.promptBox.fieldContent')" required>
          <n-input
            v-model:value="editingPrompt.content"
            type="textarea"
            :placeholder="t('other.promptBox.contentPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 12 }"
          />
        </n-form-item>
        <n-alert type="info" :title="t('other.promptBox.varTip')" style="margin-bottom: 8px">
          {{ t('other.promptBox.varTipContent') }}
        </n-alert>
        <n-alert v-if="!editingPrompt.id" type="warning" :show-icon="true" style="margin-bottom: 12px">
          {{ t('other.promptBox.localStorageHint') }}
        </n-alert>
        <n-space justify="end">
          <n-button @click="editDialogVisible = false">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" @click="savePrompt">{{ t('common.save') }}</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { builtinPrompts, builtinPromptsEn } from '@/locales/promptData'

const { t, locale } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_promptBox_custom'

// ── 内置 Prompt（根据语言动态切换）─────────────────────────────

const BUILTIN_PROMPTS = computed(() => {
  const list = locale.value.startsWith('zh') ? builtinPrompts : builtinPromptsEn
  return list.map(p => ({ ...p, builtin: true }))
})

// ── 响应式状态 ─────────────────────────────────────────────

const searchText = ref('')
const selectedCategory = ref('all')
const customPrompts = ref([])

const fillDialogVisible = ref(false)
const fillTarget = ref(null)
const fillVarList = ref([])
const fillValues = ref({})
const fillPreview = ref('')

const editDialogVisible = ref(false)
const editingPrompt = ref({ id: '', title: '', category: 'custom', desc: '', content: '' })

// ── 计算属性 ─────────────────────────────────────────────

const prompts = computed(() => [...BUILTIN_PROMPTS.value, ...customPrompts.value])

const builtinCount = computed(() => BUILTIN_PROMPTS.value.length)
const customCount = computed(() => customPrompts.value.length)

const categoryOptions = computed(() => [
  { label: t('other.promptBox.catAll'), value: 'all' },
  { label: t('other.promptBox.catCode'), value: 'code' },
  { label: t('other.promptBox.catWriting'), value: 'writing' },
  { label: t('other.promptBox.catAnalysis'), value: 'analysis' },
  { label: t('other.promptBox.catRole'), value: 'role' },
  { label: t('other.promptBox.catEnhance'), value: 'enhance' },
  { label: t('other.promptBox.catCustom'), value: 'custom' }
])

const customCategoryOptions = computed(() => [
  { label: t('other.promptBox.catCode'), value: 'code' },
  { label: t('other.promptBox.catWriting'), value: 'writing' },
  { label: t('other.promptBox.catAnalysis'), value: 'analysis' },
  { label: t('other.promptBox.catRole'), value: 'role' },
  { label: t('other.promptBox.catEnhance'), value: 'enhance' },
  { label: t('other.promptBox.catCustom'), value: 'custom' }
])

const filteredPrompts = computed(() => {
  let list = prompts.value
  if (selectedCategory.value === 'custom') {
    list = list.filter(p => !p.builtin)
  } else if (selectedCategory.value !== 'all') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (searchText.value.trim()) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      p.content.toLowerCase().includes(kw) ||
      (p.desc || '').toLowerCase().includes(kw)
    )
  }
  return list
})

// ── 工具函数 ─────────────────────────────────────────────

const extractVariables = (content) => {
  const matches = content.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map(m => m.slice(2, -2)))]
}

const hasVariables = (content) => extractVariables(content).length > 0

const getCategoryLabel = (cat) => {
  const map = {
    code: t('other.promptBox.catCode'),
    writing: t('other.promptBox.catWriting'),
    analysis: t('other.promptBox.catAnalysis'),
    role: t('other.promptBox.catRole'),
    enhance: t('other.promptBox.catEnhance'),
    custom: t('other.promptBox.catCustom')
  }
  return map[cat] || cat
}

const getCategoryType = (cat) => {
  const map = {
    code: 'info',
    writing: 'success',
    analysis: 'warning',
    role: 'error',
    enhance: 'default',
    custom: 'default'
  }
  return map[cat] || 'default'
}

// ── 操作 ─────────────────────────────────────────────

const copyPrompt = (prompt) => {
  navigator.clipboard.writeText(prompt.content).then(() => {
    message.success(t('other.promptBox.copied'))
  })
}

const openFillDialog = (prompt) => {
  fillTarget.value = prompt
  fillVarList.value = extractVariables(prompt.content)
  fillValues.value = Object.fromEntries(fillVarList.value.map(v => [v, '']))
  fillPreview.value = prompt.content
  fillDialogVisible.value = true
}

const updateFillPreview = () => {
  if (!fillTarget.value) return
  let result = fillTarget.value.content
  for (const [k, v] of Object.entries(fillValues.value)) {
    result = result.replaceAll(`{{${k}}}`, v || `{{${k}}}`)
  }
  fillPreview.value = result
}

watch(fillValues, updateFillPreview, { deep: true })

const copyFilled = () => {
  let result = fillTarget.value.content
  for (const [k, v] of Object.entries(fillValues.value)) {
    result = result.replaceAll(`{{${k}}}`, v || `{{${k}}}`)
  }
  navigator.clipboard.writeText(result).then(() => {
    message.success(t('other.promptBox.copied'))
    fillDialogVisible.value = false
  })
}

const openAddDialog = () => {
  editingPrompt.value = { id: '', title: '', category: 'custom', desc: '', content: '' }
  editDialogVisible.value = true
}

const openEditDialog = (prompt) => {
  editingPrompt.value = { ...prompt }
  editDialogVisible.value = true
}

const savePrompt = () => {
  if (!editingPrompt.value.title.trim()) {
    message.warning(t('other.promptBox.titleRequired'))
    return
  }
  if (!editingPrompt.value.content.trim()) {
    message.warning(t('other.promptBox.contentRequired'))
    return
  }
  if (editingPrompt.value.id) {
    const idx = customPrompts.value.findIndex(p => p.id === editingPrompt.value.id)
    if (idx >= 0) customPrompts.value[idx] = { ...editingPrompt.value, builtin: false }
  } else {
    customPrompts.value.push({
      ...editingPrompt.value,
      id: `custom-${Date.now()}`,
      builtin: false
    })
  }
  saveToStorage()
  editDialogVisible.value = false
  message.success(t('common.saveSuccess'))
}

const deletePrompt = (id) => {
  customPrompts.value = customPrompts.value.filter(p => p.id !== id)
  saveToStorage()
  message.success(t('common.deleteSuccess'))
}

// ── 持久化 ─────────────────────────────────────────────

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPrompts.value))
  } catch { /* ignore */ }
}

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) customPrompts.value = JSON.parse(saved)
} catch { /* ignore */ }
</script>

<style scoped>
.prompt-box-tool {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.category-select {
  width: 140px;
  flex-shrink: 0;
}

.prompt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.prompt-card {
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.2s;
  cursor: default;
}

.prompt-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.prompt-card.is-builtin {
  border-left: 3px solid var(--n-color-primary, #18a058);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.category-tag {
  flex-shrink: 0;
}

.card-title {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.card-desc {
  font-size: 12px;
  color: var(--n-text-color-3, #aaa);
}

.card-content {
  font-size: 13px;
  line-height: 1.6;
  color: var(--n-text-color-2, #555);
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  cursor: pointer;
  white-space: pre-wrap;
  word-break: break-all;
}

.card-content:hover {
  color: var(--n-color-primary, #18a058);
}

.card-vars {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.var-tag {
  font-family: 'Fira Code', 'Consolas', monospace;
}

.stats-text {
  font-size: 12px;
}

/* 弹窗内样式 */
.fill-modal,
.edit-modal {
  width: min(600px, 95vw);
}

.preview-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.fill-preview {
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 180px;
  overflow-y: auto;
  color: var(--n-text-color);
}

.var-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.var-name {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  width: 120px;
  flex-shrink: 0;
  color: var(--n-color-warning, #f0a020);
}

@media (max-width: 768px) {
  .prompt-box-tool {
    padding: 0 12px;
  }

  .prompt-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .category-select {
    width: 100%;
  }

  .var-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .var-name {
    width: auto;
  }
}
</style>

