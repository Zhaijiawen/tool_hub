<template>
  <div class="url-parser">
    <n-card :title="t('convert.urlParser.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入区 -->
        <div class="input-section">
          <n-text class="section-label">{{ t('convert.urlParser.input') }}</n-text>
          <n-input-group>
            <n-input
              v-model:value="rawUrl"
              :placeholder="t('convert.urlParser.placeholder')"
              clearable
              @input="parseUrl"
              @keydown.enter="parseUrl"
            >
              <template #prefix>
                <n-icon :depth="3">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z"/>
                  </svg>
                </n-icon>
              </template>
            </n-input>
            <n-button type="primary" @click="parseUrl">{{ t('convert.urlParser.parse') }}</n-button>
          </n-input-group>
          <!-- 合法性指示 -->
          <div v-if="rawUrl" class="validity-hint">
            <n-tag :type="isValid ? 'success' : 'error'" size="small">
              {{ isValid ? t('convert.urlParser.valid') : t('convert.urlParser.invalid') }}
            </n-tag>
          </div>
        </div>

        <!-- 解析结果 -->
        <div v-if="parsed && isValid">
          <n-tabs type="line" animated>

            <!-- 结构化解析 -->
            <n-tab-pane name="parts" :tab="t('convert.urlParser.tabParts')">
              <div class="parts-table">
                <div v-for="item in parsedParts" :key="item.key" class="part-row">
                  <span class="part-key">{{ item.label }}</span>
                  <span class="part-value font-mono" :class="{ 'empty': !item.value }">
                    {{ item.value || t('convert.urlParser.empty') }}
                  </span>
                  <n-button
                    v-if="item.value"
                    size="tiny"
                    quaternary
                    @click="copy(item.value)"
                  >{{ t('common.copy') }}</n-button>
                </div>
              </div>
            </n-tab-pane>

            <!-- Query 参数 -->
            <n-tab-pane name="params" :tab="`${t('convert.urlParser.tabParams')}${queryParams.length > 0 ? ` (${queryParams.length})` : ''}`">
              <div v-if="queryParams.length > 0">
                <div class="params-header">
                  <n-button size="small" @click="copyAllParams">{{ t('convert.urlParser.copyAllParams') }}</n-button>
                  <n-checkbox v-model:checked="decodeParams">{{ t('convert.urlParser.decode') }}</n-checkbox>
                </div>
                <div class="params-table">
                  <div class="params-head">
                    <span>{{ t('convert.urlParser.paramKey') }}</span>
                    <span>{{ t('convert.urlParser.paramValue') }}</span>
                    <span></span>
                  </div>
                  <div v-for="(param, index) in queryParams" :key="index" class="param-row">
                    <span class="param-key font-mono">{{ param.key }}</span>
                    <span class="param-value font-mono">{{ decodeParams ? safeDecodeURIComponent(param.value) : param.value }}</span>
                    <n-button size="tiny" quaternary @click="copy(decodeParams ? safeDecodeURIComponent(param.value) : param.value)">
                      {{ t('common.copy') }}
                    </n-button>
                  </div>
                </div>
              </div>
              <n-empty v-else :description="t('convert.urlParser.noParams')" style="padding: 24px 0;" />
            </n-tab-pane>

            <!-- 反向构建 -->
            <n-tab-pane name="build" :tab="t('convert.urlParser.tabBuild')">
              <div class="build-section">
                <div class="build-row">
                  <span class="build-label">{{ t('convert.urlParser.partProtocol') }}</span>
                  <n-select
                    v-model:value="buildProtocol"
                    :options="protocolOptions"
                    style="width: 120px;"
                    @update:value="rebuildUrl"
                  />
                </div>
                <div class="build-row">
                  <span class="build-label">{{ t('convert.urlParser.partHost') }}</span>
                  <n-input v-model:value="buildHost" :placeholder="t('convert.urlParser.buildHostPlaceholder')" @input="rebuildUrl" />
                </div>
                <div class="build-row">
                  <span class="build-label">{{ t('convert.urlParser.partPort') }}</span>
                  <n-input v-model:value="buildPort" :placeholder="t('convert.urlParser.buildPortPlaceholder')" @input="rebuildUrl" />
                </div>
                <div class="build-row">
                  <span class="build-label">{{ t('convert.urlParser.partPath') }}</span>
                  <n-input v-model:value="buildPath" :placeholder="t('convert.urlParser.buildPathPlaceholder')" @input="rebuildUrl" />
                </div>
                <div class="build-row">
                  <span class="build-label">{{ t('convert.urlParser.partQuery') }}</span>
                  <n-input v-model:value="buildQuery" :placeholder="t('convert.urlParser.buildQueryPlaceholder')" @input="rebuildUrl" />
                </div>
                <div class="build-row">
                  <span class="build-label">{{ t('convert.urlParser.partHash') }}</span>
                  <n-input v-model:value="buildHash" :placeholder="t('convert.urlParser.buildHashPlaceholder')" @input="rebuildUrl" />
                </div>
                <div v-if="builtUrl" class="built-result">
                  <n-text class="section-label">{{ t('convert.urlParser.builtUrl') }}</n-text>
                  <div class="built-url-row">
                    <n-input :value="builtUrl" readonly class="font-mono" />
                    <n-button @click="copy(builtUrl)">{{ t('common.copy') }}</n-button>
                  </div>
                </div>
              </div>
            </n-tab-pane>

          </n-tabs>
        </div>

        <!-- 无效 URL 提示 -->
        <div v-else-if="rawUrl && !isValid" class="empty-placeholder">
          <n-text depth="3">{{ t('convert.urlParser.invalidTip') }}</n-text>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!rawUrl" class="empty-placeholder">
          <n-text depth="3">{{ t('convert.urlParser.emptyTip') }}</n-text>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="urlParser" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_urlParser_input'

const rawUrl = ref('')
const parsed = ref(null)
const isValid = ref(false)
const decodeParams = ref(true)

// 构建器状态
const buildProtocol = ref('https')
const buildHost = ref('')
const buildPort = ref('')
const buildPath = ref('/')
const buildQuery = ref('')
const buildHash = ref('')
const builtUrl = ref('')

const protocolOptions = [
  { label: 'https://', value: 'https' },
  { label: 'http://', value: 'http' },
  { label: 'ftp://', value: 'ftp' },
  { label: 'ws://', value: 'ws' },
  { label: 'wss://', value: 'wss' }
]

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      rawUrl.value = saved
      parseUrl()
    }
  } catch {}
})

const safeDecodeURIComponent = (str) => {
  try { return decodeURIComponent(str) } catch { return str }
}

const parseUrl = () => {
  const url = rawUrl.value.trim()
  try {
    localStorage.setItem(STORAGE_KEY, url)
  } catch {}
  if (!url) {
    parsed.value = null
    isValid.value = false
    return
  }
  try {
    const u = new URL(url)
    parsed.value = u
    isValid.value = true
    // 同步到构建器
    buildProtocol.value = u.protocol.replace(':', '') || 'https'
    buildHost.value = u.hostname
    buildPort.value = u.port
    buildPath.value = u.pathname
    buildQuery.value = u.search ? u.search.slice(1) : ''
    buildHash.value = u.hash ? u.hash.slice(1) : ''
    rebuildUrl()
  } catch {
    parsed.value = null
    isValid.value = false
  }
}

const parsedParts = computed(() => {
  if (!parsed.value) return []
  const u = parsed.value
  return [
    { key: 'href',     label: t('convert.urlParser.partFullUrl'),  value: u.href },
    { key: 'protocol', label: t('convert.urlParser.partProtocol'),  value: u.protocol },
    { key: 'host',     label: t('convert.urlParser.partHost'),      value: u.host },
    { key: 'hostname', label: t('convert.urlParser.partHostname'),  value: u.hostname },
    { key: 'port',     label: t('convert.urlParser.partPort'),      value: u.port },
    { key: 'pathname', label: t('convert.urlParser.partPath'),      value: u.pathname },
    { key: 'search',   label: t('convert.urlParser.partQuery'),     value: u.search },
    { key: 'hash',     label: t('convert.urlParser.partHash'),      value: u.hash },
    { key: 'origin',   label: t('convert.urlParser.partOrigin'),    value: u.origin },
    { key: 'username', label: t('convert.urlParser.partUsername'),  value: u.username },
    { key: 'password', label: t('convert.urlParser.partPassword'),  value: u.password }
  ]
})

const queryParams = computed(() => {
  if (!parsed.value || !parsed.value.search) return []
  const params = []
  // 手动解析 query string，保留原始编码值（不经过 searchParams 的自动解码）
  const search = parsed.value.search.slice(1) // 去掉开头的 '?'
  search.split('&').forEach(pair => {
    if (!pair) return
    const eqIdx = pair.indexOf('=')
    const rawKey = eqIdx === -1 ? pair : pair.slice(0, eqIdx)
    const rawValue = eqIdx === -1 ? '' : pair.slice(eqIdx + 1)
    params.push({ key: safeDecodeURIComponent(rawKey), rawKey, value: rawValue })
  })
  return params
})

const rebuildUrl = () => {
  try {
    const proto = buildProtocol.value || 'https'
    const host = buildHost.value.trim()
    if (!host) { builtUrl.value = ''; return }
    const port = buildPort.value.trim()
    const path = buildPath.value.trim() || '/'
    const query = buildQuery.value.trim()
    const hash = buildHash.value.trim()
    let url = `${proto}://${host}`
    if (port) url += `:${port}`
    url += path.startsWith('/') ? path : `/${path}`
    if (query) url += `?${query}`
    if (hash) url += `#${hash}`
    builtUrl.value = url
  } catch {
    builtUrl.value = ''
  }
}

const copyAllParams = async () => {
  const text = queryParams.value.map(p => `${p.key}=${decodeParams.value ? safeDecodeURIComponent(p.value) : p.value}`).join('\n')
  await copy(text)
}

const copy = async (val) => {
  try {
    await navigator.clipboard.writeText(val)
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.url-parser {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}

.input-section { display: flex; flex-direction: column; gap: 8px; }

.validity-hint { margin-top: 4px; }

.parts-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.part-row {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
}

.part-row:last-child { border-bottom: none; }
.part-row:nth-child(even) { background-color: var(--card-color); }

.part-key {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.part-value {
  font-size: 13px;
  word-break: break-all;
}

.part-value.empty { color: var(--text-color-2); font-style: italic; }

.params-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.params-table {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.params-head {
  display: grid;
  grid-template-columns: 180px 1fr 60px;
  gap: 12px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  background-color: var(--card-color);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color-2);
  text-transform: uppercase;
}

.param-row {
  display: grid;
  grid-template-columns: 180px 1fr 60px;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
}

.param-row:last-child { border-bottom: none; }
.param-key { font-size: 13px; color: #18a058; font-weight: 500; word-break: break-all; }
.param-value { font-size: 13px; word-break: break-all; }

.build-section { display: flex; flex-direction: column; gap: 12px; }

.build-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 12px;
}

.build-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-2);
  text-align: right;
  text-transform: uppercase;
}

.built-result {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.built-url-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.font-mono {
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
}

.empty-placeholder {
  text-align: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
</style>

