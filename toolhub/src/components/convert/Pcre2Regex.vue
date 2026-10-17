<template>
  <div class="pcre2-regex">
    <!-- 工具简介 -->
    <ToolIntro toolKey="pcre2Regex" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <n-space vertical size="large">
        <!-- 模式输入 -->
        <div class="pattern-section">
          <n-text class="section-title">{{ t('convert.pcre2Regex.pattern') }}</n-text>
          <n-input
            v-model:value="pattern"
            :placeholder="t('convert.pcre2Regex.patternPlaceholder')"
            class="mono-input"
            clearable
            @input="onInput"
          />
        </div>

        <!-- 标志位 -->
        <div class="flags-section">
          <n-text class="section-title">{{ t('convert.pcre2Regex.flags') }}</n-text>
          <n-space :wrap="true">
            <n-checkbox
              v-for="f in flagDefs"
              :key="f.key"
              v-model:checked="flags[f.key]"
              size="small"
              @update:checked="onInput"
            >
              {{ f.label }} ({{ t(`convert.pcre2Regex.flagsDesc.${f.key}`) }})
            </n-checkbox>
          </n-space>
        </div>

        <!-- 测试文本 -->
        <div class="subject-section">
          <n-text class="section-title">{{ t('convert.pcre2Regex.subject') }}</n-text>
          <n-input
            v-model:value="subject"
            type="textarea"
            :placeholder="t('convert.pcre2Regex.subjectPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 16 }"
            class="mono-input"
            clearable
            @input="onInput"
          />
        </div>

        <!-- 操作行 -->
        <div class="action-row">
          <n-space :wrap="true">
            <n-button type="primary" :loading="processing" :disabled="processing || wasmLoading || !pattern" @click="runMatch">
              {{ processing ? t('convert.pcre2Regex.processing') : (wasmLoading ? t('convert.pcre2Regex.loadingWasm') : t('convert.pcre2Regex.run')) }}
            </n-button>
            <n-button :disabled="processing || wasmLoading || !pattern || !subject" @click="doReplace(false)">
              {{ t('convert.pcre2Regex.replaceFirst') }}
            </n-button>
            <n-button :disabled="processing || wasmLoading || !pattern || !subject" @click="doReplace(true)">
              {{ t('convert.pcre2Regex.replaceAll') }}
            </n-button>
            <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
            <n-button type="info" ghost @click="loadExample">{{ t('convert.pcre2Regex.loadExample') }}</n-button>
          </n-space>
        </div>

        <!-- 替换模板 -->
        <div v-if="replaceResult !== null" class="replacement-section">
          <n-text class="section-title">{{ t('convert.pcre2Regex.replaceResult') }}</n-text>
          <n-input
            v-model:value="replacement"
            :placeholder="t('convert.pcre2Regex.replacementPlaceholder')"
            class="mono-input"
            clearable
          />
          <n-text depth="3" style="font-size: 12px;">{{ t('convert.pcre2Regex.replacementHint') }}</n-text>
          <div class="replace-output">
            <n-input
              v-model:value="replaceResult"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 12 }"
              readonly
              class="mono-input"
            />
            <n-button size="small" type="primary" ghost @click="copyReplaceResult">
              {{ t('common.copy') }}
            </n-button>
          </div>
        </div>

        <!-- 编译错误 -->
        <n-alert v-if="error" type="error" :title="t('convert.pcre2Regex.compileError')" closable @close="error = null">
          <span class="mono-text">{{ error.message }}</span>
          <span v-if="error.offset > 0" style="display: block; margin-top: 4px;">
            {{ t('convert.pcre2Regex.errorAtOffset', { offset: error.offset }) }}
          </span>
        </n-alert>

        <!-- 匹配概览 -->
        <div v-if="matchInfo" class="match-info">
          <n-space :wrap="true">
            <n-tag :bordered="false" type="info">
              {{ t('convert.pcre2Regex.matchCount') }}: {{ matches.length }}
            </n-tag>
            <n-tag :bordered="false" type="default">
              {{ t('convert.pcre2Regex.captureCount') }}: {{ matchInfo.captureCount }}
            </n-tag>
            <n-tag v-if="matchInfo.namedGroupCount" :bordered="false" type="default">
              {{ t('convert.pcre2Regex.namedGroupCount') }}: {{ matchInfo.namedGroupCount }}
            </n-tag>
            <n-tag v-if="matchInfo.hasBackreferences" :bordered="false" type="warning">
              {{ t('convert.pcre2Regex.hasBackrefs') }}
            </n-tag>
          </n-space>
        </div>

        <!-- 匹配列表 -->
        <div v-if="matches.length" class="matches-section">
          <n-text class="section-title">{{ t('convert.pcre2Regex.matches') }}</n-text>
          <div class="match-list">
            <div v-for="(m, i) in matches" :key="i" class="match-item">
              <div class="match-head">
                <n-tag size="small" :bordered="false" round>#{{ i + 1 }}</n-tag>
                <n-text depth="3" style="font-size: 12px;">{{ t('convert.pcre2Regex.index') }}: {{ m.index }}</n-text>
              </div>
              <div class="mono-text match-value">{{ m.match }}</div>
              <div v-if="m.groups && m.groups.length" class="match-groups">
                <n-text depth="3" style="font-size: 12px;">{{ t('convert.pcre2Regex.groups') }}:</n-text>
                <n-space :wrap="true" size="small">
                  <n-tag v-for="(g, gi) in m.groups" :key="gi" size="small" :bordered="false" type="default">
                    ${{ gi + 1 }}: {{ g === null ? t('convert.pcre2Regex.unset') : g }}
                  </n-tag>
                </n-space>
              </div>
              <div v-if="m.namedGroups && Object.keys(m.namedGroups).length" class="match-groups">
                <n-text depth="3" style="font-size: 12px;">{{ t('convert.pcre2Regex.namedGroups') }}:</n-text>
                <n-space :wrap="true" size="small">
                  <n-tag
                    v-for="(v, k) in m.namedGroups"
                    :key="k"
                    size="small"
                    :bordered="false"
                    type="success"
                  >
                    {{ k }}: {{ v === null ? t('convert.pcre2Regex.unset') : v }}
                  </n-tag>
                </n-space>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!error" class="empty-placeholder">
          <n-text depth="3">{{ t('convert.pcre2Regex.emptyTip') }}</n-text>
        </div>
      </n-space>
    </n-card>

    <!-- PCRE2 独有特性速查 -->
    <n-card :title="t('convert.pcre2Regex.featuresTitle')" :bordered="false" class="features-card">
      <n-space vertical size="small">
        <div v-for="(f, i) in pcre2Features" :key="i" class="feature-row">
          <n-tag size="small" :bordered="false" type="info" round>{{ i + 1 }}</n-tag>
          <span class="feature-text">{{ f }}</span>
        </div>
      </n-space>
      <n-text depth="3" style="font-size: 12px; display: block; margin-top: 12px;">
        {{ t('convert.pcre2Regex.featuresFooter') }}
      </n-text>
    </n-card>

    <TutorialAndDocs toolKey="pcre2Regex" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useWasmModule } from '@/composables/useWasmModule'
// pcre2-wasm vendor facade：注入我们下载+编译的 WebAssembly.Module
import { createPCRE2WithModule, FLAGS, PCRE2CompileError } from '@/vendor/pcre2-wasm/index.js'

const { t, tm } = useI18n()
const message = useMessage()

const pattern = ref('')
const subject = ref('')
const replacement = ref('$&')
const processing = ref(false)
const matches = ref([])
const matchInfo = ref(null)
const replaceResult = ref(null)
const error = ref(null)

// 标志位定义：label 为 PCRE2 惯例字母，flag 为 FLAGS 常量（编译期 OR）
const flagDefs = [
  { key: 'caseless', flag: FLAGS.CASELESS, label: 'i' },
  { key: 'multiline', flag: FLAGS.MULTILINE, label: 'm' },
  { key: 'dotall', flag: FLAGS.DOTALL, label: 's' },
  { key: 'extended', flag: FLAGS.EXTENDED, label: 'x' },
  { key: 'utf', flag: FLAGS.UTF, label: 'u' },
  { key: 'ucp', flag: FLAGS.UCP, label: 'UCP' },
  { key: 'ungreedy', flag: FLAGS.UNGREEDY, label: 'U' },
  { key: 'anchored', flag: FLAGS.ANCHORED, label: 'A' },
  { key: 'dollarEndonly', flag: FLAGS.DOLLAR_ENDONLY, label: 'D' },
  { key: 'noAutoCapture', flag: FLAGS.NO_AUTO_CAPTURE, label: 'n' }
]

const flags = reactive(
  flagDefs.reduce((acc, f) => {
    acc[f.key] = false
    return acc
  }, {})
)

// PCRE2 独有特性速查（来自 i18n，随语言切换）
const pcre2Features = computed(() => tm('convert.pcre2Regex.features') || [])

// WASM 加载器：下载 /wasm/pcre2.wasm（带进度、可取消、命中缓存秒开）
const wasm = useWasmModule('pcre2', {
  url: '/wasm/pcre2.wasm',
  name: 'PCRE2',
  compile: true // 产出 WebAssembly.Module 注入 glue 的 instantiateWasm
})

const wasmLoading = computed(() => ['downloading', 'compiling'].includes(wasm.status.value))

let pcre2Instance = null

async function ensureWasm() {
  if (pcre2Instance) return pcre2Instance
  const { module } = await wasm.load()
  pcre2Instance = await createPCRE2WithModule(module)
  return pcre2Instance
}

const flagsValue = computed(() =>
  flagDefs.reduce((acc, f) => (flags[f.key] ? acc | f.flag : acc), 0)
)

function onInput() {
  // 输入变化时清空旧结果，避免误导
  matches.value = []
  matchInfo.value = null
  replaceResult.value = null
  error.value = null
}

async function runMatch() {
  if (!pattern.value) {
    message.warning(t('convert.pcre2Regex.needPattern'))
    return
  }
  processing.value = true
  error.value = null
  replaceResult.value = null
  try {
    const pcre2 = await ensureWasm()
    const flagsArg = flagsValue.value
    matchInfo.value = pcre2.patternInfo(pattern.value, flagsArg)
    matches.value = pcre2.matchAll(pattern.value, subject.value, flagsArg)
    if (!matches.value.length) {
      message.info(t('convert.pcre2Regex.noMatch'))
    }
  } catch (e) {
    matches.value = []
    matchInfo.value = null
    if (e instanceof PCRE2CompileError) {
      error.value = { message: e.message, offset: e.offset }
    } else {
      error.value = { message: String(e?.message || e), offset: 0 }
    }
  } finally {
    processing.value = false
  }
}

async function doReplace(all) {
  if (!pattern.value || !subject.value) return
  processing.value = true
  error.value = null
  try {
    const pcre2 = await ensureWasm()
    const flagsArg = flagsValue.value
    replaceResult.value = all
      ? pcre2.replaceAll(pattern.value, subject.value, replacement.value, flagsArg)
      : pcre2.replace(pattern.value, subject.value, replacement.value, flagsArg)
  } catch (e) {
    replaceResult.value = null
    if (e instanceof PCRE2CompileError) {
      error.value = { message: e.message, offset: e.offset }
    } else {
      error.value = { message: String(e?.message || e), offset: 0 }
    }
  } finally {
    processing.value = false
  }
}

async function copyReplaceResult() {
  if (replaceResult.value === null) return
  try {
    await navigator.clipboard.writeText(replaceResult.value)
    message.success(t('common.copied'))
  } catch {
    message.error(t('common.error'))
  }
}

function clearAll() {
  pattern.value = ''
  subject.value = ''
  replacement.value = '$&'
  matches.value = []
  matchInfo.value = null
  replaceResult.value = null
  error.value = null
  flagDefs.forEach((f) => {
    flags[f.key] = false
  })
}

function loadExample() {
  pattern.value = '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})'
  subject.value = '订单日期：2024-03-15，发货日期：2024-03-18，签收日期：2024-03-21。'
  replacement.value = '$day/$month/$year'
  matches.value = []
  matchInfo.value = null
  replaceResult.value = null
  error.value = null
}
</script>

<style scoped>
.pcre2-regex {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
}

.mono-input :deep(.n-input__input),
.mono-input :deep(.n-input__textarea-el),
.mono-text {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.match-info {
  margin-top: 4px;
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.match-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 12px;
  background-color: var(--card-color);
}

.match-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.match-value {
  font-size: 13px;
  word-break: break-all;
  color: var(--text-color);
}

.match-groups {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.replacement-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.replace-output {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.empty-placeholder {
  padding: 24px;
  text-align: center;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
}

.features-card {
  margin-top: 16px;
}

.feature-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.feature-text {
  font-size: 13px;
  color: var(--text-color);
  line-height: 1.6;
}
</style>
