<template>
  <div class="http-client-tool">
    <!-- 工具简介 -->
    <ToolIntro toolKey="httpClient" />

    <n-card :title="t('other.httpClient.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 请求行 -->
        <div class="request-line">
          <n-select
            v-model:value="method"
            :options="methodOptions"
            class="method-select"
          />
          <n-input
            v-model:value="url"
            :placeholder="t('other.httpClient.urlPlaceholder')"
            clearable
            @keydown.enter="send"
            class="url-input"
          />
          <n-button type="primary" :loading="loading" @click="send" class="send-btn">
            {{ t('other.httpClient.send') }}
          </n-button>
          <n-button @click="clearAll" :disabled="loading">{{ t('common.clear') }}</n-button>
        </div>

        <!-- Tabs：Headers / Body / Params -->
        <n-tabs v-model:value="activeTab" type="line" animated>

          <!-- Query Params -->
          <n-tab-pane name="params" :tab="t('other.httpClient.params')">
            <div class="kv-editor">
              <div v-for="(item, i) in params" :key="i" class="kv-row">
                <n-checkbox v-model:checked="item.enabled" />
                <n-input v-model:value="item.key" :placeholder="t('other.httpClient.key')" class="kv-key" />
                <n-input v-model:value="item.value" :placeholder="t('other.httpClient.value')" class="kv-value" />
                <n-button quaternary circle @click="removeKv(params, i)">✕</n-button>
              </div>
              <n-button dashed size="small" @click="addKv(params)">+ {{ t('other.httpClient.addParam') }}</n-button>
            </div>
          </n-tab-pane>

          <!-- Headers -->
          <n-tab-pane name="headers" :tab="t('other.httpClient.headers')">
            <div class="kv-editor">
              <div v-for="(item, i) in headers" :key="i" class="kv-row">
                <n-checkbox v-model:checked="item.enabled" />
                <n-input v-model:value="item.key" :placeholder="t('other.httpClient.key')" class="kv-key" />
                <n-input v-model:value="item.value" :placeholder="t('other.httpClient.value')" class="kv-value" />
                <n-button quaternary circle @click="removeKv(headers, i)">✕</n-button>
              </div>
              <n-button dashed size="small" @click="addKv(headers)">+ {{ t('other.httpClient.addHeader') }}</n-button>
            </div>
          </n-tab-pane>

          <!-- Body -->
          <n-tab-pane name="body" :tab="t('other.httpClient.body')" :disabled="['GET','HEAD'].includes(method)">
            <n-space vertical>
              <n-radio-group v-model:value="bodyType" size="small">
                <n-radio-button value="none">{{ t('other.httpClient.bodyNone') }}</n-radio-button>
                <n-radio-button value="json">JSON</n-radio-button>
                <n-radio-button value="form">Form</n-radio-button>
                <n-radio-button value="text">Text</n-radio-button>
              </n-radio-group>
              <div v-if="bodyType === 'json' || bodyType === 'text'">
                <n-input
                  v-model:value="bodyText"
                  type="textarea"
                  :placeholder="bodyType === 'json' ? '{&quot;key&quot;: &quot;value&quot;}' : t('other.httpClient.bodyTextPlaceholder')"
                  :autosize="{ minRows: 6, maxRows: 16 }"
                />
              </div>
              <div v-if="bodyType === 'form'" class="kv-editor">
                <div v-for="(item, i) in formData" :key="i" class="kv-row">
                  <n-checkbox v-model:checked="item.enabled" />
                  <n-input v-model:value="item.key" :placeholder="t('other.httpClient.key')" class="kv-key" />
                  <n-input v-model:value="item.value" :placeholder="t('other.httpClient.value')" class="kv-value" />
                  <n-button quaternary circle @click="removeKv(formData, i)">✕</n-button>
                </div>
                <n-button dashed size="small" @click="addKv(formData)">+ {{ t('other.httpClient.addField') }}</n-button>
              </div>
            </n-space>
          </n-tab-pane>
        </n-tabs>

        <!-- 响应区 -->
        <div v-if="response || responseError" class="response-section">
          <n-divider>{{ t('other.httpClient.response') }}</n-divider>

          <!-- 响应状态栏 -->
          <div v-if="response" class="response-meta">
            <n-tag :type="statusType" size="small">{{ response.status }} {{ response.statusText }}</n-tag>
            <n-tag size="small">{{ response.time }}ms</n-tag>
            <n-tag size="small">{{ formatSize(responseBody.length) }}</n-tag>
            <n-button size="tiny" quaternary @click="copyResponse">{{ t('common.copy') }}</n-button>
          </div>

          <!-- 错误提示 -->
          <n-alert v-if="responseError" type="error" :title="t('other.httpClient.requestFailed')">
            {{ responseError }}
            <div v-if="isCorsError" class="cors-hint">
              <n-text depth="3">{{ t('other.httpClient.corsHint') }}</n-text>
            </div>
          </n-alert>

          <!-- 响应内容 Tabs -->
          <n-tabs v-if="response" v-model:value="responseTab" type="line" size="small" animated>
            <n-tab-pane name="body" :tab="t('other.httpClient.body')">
              <n-input
                :value="prettyBody"
                type="textarea"
                readonly
                :autosize="{ minRows: 8, maxRows: 28 }"
                class="response-body"
              />
            </n-tab-pane>
            <n-tab-pane name="headers" :tab="t('other.httpClient.respHeaders')">
              <n-list bordered size="small">
                <n-list-item v-for="[k, v] in Object.entries(response.headers)" :key="k">
                  <div class="resp-header-row">
                    <n-text code>{{ k }}</n-text>
                    <n-text depth="3">{{ v }}</n-text>
                  </div>
                </n-list-item>
              </n-list>
            </n-tab-pane>
          </n-tabs>
        </div>

        <!-- 说明 -->
        <n-alert type="info" :title="t('other.httpClient.noteTitle')">
          {{ t('other.httpClient.noteContent') }}
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="httpClient" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_httpClient_input'

// ── 请求状态 ────────────────────────────────
const method = ref('GET')
const url = ref('')
const activeTab = ref('params')
const bodyType = ref('none')
const bodyText = ref('')
const loading = ref(false)

const params = ref([{ key: '', value: '', enabled: true }])
const headers = ref([
  { key: 'Accept', value: 'application/json', enabled: true },
  { key: '', value: '', enabled: true }
])
const formData = ref([{ key: '', value: '', enabled: true }])

// ── 响应状态 ────────────────────────────────
const response = ref(null)
const responseBody = ref('')
const responseError = ref('')
const responseTab = ref('body')
const isCorsError = ref(false)

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTIONS', value: 'OPTIONS' }
]

const statusType = computed(() => {
  if (!response.value) return 'default'
  const s = response.value.status
  if (s >= 200 && s < 300) return 'success'
  if (s >= 300 && s < 400) return 'info'
  if (s >= 400 && s < 500) return 'warning'
  return 'error'
})

const prettyBody = computed(() => {
  try {
    return JSON.stringify(JSON.parse(responseBody.value), null, 2)
  } catch {
    return responseBody.value
  }
})

// ── KV 编辑器辅助 ────────────────────────────────
const addKv = (list) => list.push({ key: '', value: '', enabled: true })
const removeKv = (list, i) => {
  if (list.length > 1) list.splice(i, 1)
  else list[i] = { key: '', value: '', enabled: true }
}

// ── 构建请求 URL（附 query params）────────────────────────────────
const buildUrl = () => {
  let base = url.value.trim()
  if (!base) return ''
  // 确保有协议
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base

  const enabledParams = params.value.filter(p => p.enabled && p.key.trim())
  if (enabledParams.length === 0) return base

  try {
    const u = new URL(base)
    enabledParams.forEach(p => u.searchParams.set(p.key.trim(), p.value))
    return u.toString()
  } catch {
    const qs = enabledParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')
    return base + (base.includes('?') ? '&' : '?') + qs
  }
}

// ── 构建请求 Headers ────────────────────────────────
const buildHeaders = () => {
  const h = {}
  headers.value.filter(item => item.enabled && item.key.trim()).forEach(item => {
    h[item.key.trim()] = item.value
  })
  // body 类型自动补 Content-Type
  if (bodyType.value === 'json' && !h['Content-Type'] && !h['content-type']) {
    h['Content-Type'] = 'application/json'
  }
  if (bodyType.value === 'form' && !h['Content-Type'] && !h['content-type']) {
    h['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return h
}

// ── 构建请求 Body ────────────────────────────────
const buildBody = () => {
  if (['GET', 'HEAD'].includes(method.value) || bodyType.value === 'none') return undefined
  if (bodyType.value === 'json' || bodyType.value === 'text') return bodyText.value
  if (bodyType.value === 'form') {
    const enabled = formData.value.filter(f => f.enabled && f.key.trim())
    return enabled.map(f => `${encodeURIComponent(f.key)}=${encodeURIComponent(f.value)}`).join('&')
  }
  return undefined
}

// ── 发送请求 ────────────────────────────────
const send = async () => {
  const finalUrl = buildUrl()
  if (!finalUrl) {
    message.warning(t('other.httpClient.urlRequired'))
    return
  }

  loading.value = true
  response.value = null
  responseBody.value = ''
  responseError.value = ''
  isCorsError.value = false

  const startTime = Date.now()

  try {
    const fetchOptions = {
      method: method.value,
      headers: buildHeaders(),
      body: buildBody(),
      // 不跟随重定向，让用户看到重定向状态码
      redirect: 'follow'
    }

    const res = await fetch(finalUrl, fetchOptions)
    const elapsed = Date.now() - startTime

    // 读取响应头
    const respHeaders = {}
    res.headers.forEach((v, k) => { respHeaders[k] = v })

    // 读取响应体
    const bodyText2 = await res.text()
    responseBody.value = bodyText2

    response.value = {
      status: res.status,
      statusText: res.statusText,
      headers: respHeaders,
      time: elapsed
    }
    responseTab.value = 'body'

    // 持久化最后一次请求
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        method: method.value,
        url: url.value,
        params: params.value,
        headers: headers.value,
        bodyType: bodyType.value,
        bodyText: bodyText.value,
        formData: formData.value
      }))
    } catch { /* ignore */ }

  } catch (err) {
    responseError.value = err.message || t('other.httpClient.unknownError')
    // 判断是否 CORS 错误
    if (
      err.message?.includes('CORS') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.name === 'TypeError'
    ) {
      isCorsError.value = true
    }
  } finally {
    loading.value = false
  }
}

// ── 工具函数 ────────────────────────────────
const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const copyResponse = () => {
  navigator.clipboard.writeText(prettyBody.value).then(() => {
    message.success(t('common.copySuccess'))
  })
}

const clearAll = () => {
  url.value = ''
  response.value = null
  responseBody.value = ''
  responseError.value = ''
  params.value = [{ key: '', value: '', enabled: true }]
  headers.value = [
    { key: 'Accept', value: 'application/json', enabled: true },
    { key: '', value: '', enabled: true }
  ]
  bodyText.value = ''
  bodyType.value = 'none'
  formData.value = [{ key: '', value: '', enabled: true }]
  localStorage.removeItem(STORAGE_KEY)
}

// ── 恢复上次请求 ────────────────────────────────
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const s = JSON.parse(saved)
    method.value = s.method || 'GET'
    url.value = s.url || ''
    if (s.params?.length) params.value = s.params
    if (s.headers?.length) headers.value = s.headers
    bodyType.value = s.bodyType || 'none'
    bodyText.value = s.bodyText || ''
    if (s.formData?.length) formData.value = s.formData
  }
} catch { /* ignore */ }
</script>

<style scoped>
.http-client-tool {
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 20px;
}

.request-line {
  display: flex;
  gap: 8px;
  align-items: center;
}

.method-select {
  width: 120px;
  flex-shrink: 0;
}

.url-input {
  flex: 1;
}

.send-btn {
  flex-shrink: 0;
}

.kv-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kv-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kv-key {
  flex: 1;
}

.kv-value {
  flex: 2;
}

.response-section {
  margin-top: 4px;
}

.response-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.response-body {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
}

.resp-header-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.cors-hint {
  margin-top: 8px;
}

@media (max-width: 768px) {
  .http-client-tool {
    padding: 0 12px;
  }
  .request-line {
    flex-wrap: wrap;
  }
  .url-input {
    min-width: 0;
  }
}
</style>

