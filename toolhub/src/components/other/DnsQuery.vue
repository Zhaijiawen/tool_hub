<template>
  <div class="dns-query-tool">
    <n-card :title="t('other.dns.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 查询输入 -->
        <div class="query-section">
          <n-text class="section-title">{{ t('other.dns.domain') }}</n-text>
          <n-input-group>
            <n-input
              v-model:value="domain"
              :placeholder="t('other.dns.domainPlaceholder')"
              clearable
              @keydown.enter="query"
            />
            <n-select
              v-model:value="recordType"
              :options="typeOptions"
              style="width: 120px"
            />
            <n-button type="primary" @click="query" :loading="loading">
              {{ t('other.dns.query') }}
            </n-button>
          </n-input-group>
        </div>

        <!-- 常用域名快速填入 -->
        <div class="quick-section">
          <n-text depth="3" class="quick-label">{{ t('other.dns.quickExamples') }}: </n-text>
          <n-space>
            <n-button
              v-for="ex in quickExamples"
              :key="ex"
              size="small"
              quaternary
              @click="loadDomain(ex)"
            >{{ ex }}</n-button>
          </n-space>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="queryError" type="error" :title="t('common.error')" class="error-alert">
          {{ queryError }}
        </n-alert>

        <!-- 结果表格 -->
        <div v-if="records.length > 0" class="result-section">
          <div class="result-header">
            <n-text class="section-title">{{ t('other.dns.results') }}</n-text>
            <n-tag size="small">{{ records.length }} {{ t('other.dns.recordCount') }}</n-tag>
          </div>
          <n-data-table
            :columns="columns"
            :data="records"
            :bordered="true"
            :single-line="false"
            size="small"
          />
        </div>

        <n-empty v-else-if="queried && records.length === 0 && !loading" :description="t('other.dns.noRecords')" />

        <!-- 说明 -->
        <n-alert type="info" :title="t('other.dns.apiNote')">
          {{ t('other.dns.apiNoteContent') }}
        </n-alert>

      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NTag } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_dns_input'

const domain = ref('')
const recordType = ref('A')
const loading = ref(false)
const records = ref([])
const queryError = ref('')
const queried = ref(false)

const typeOptions = [
  { label: 'A', value: 'A' },
  { label: 'AAAA', value: 'AAAA' },
  { label: 'MX', value: 'MX' },
  { label: 'TXT', value: 'TXT' },
  { label: 'CNAME', value: 'CNAME' },
  { label: 'NS', value: 'NS' },
  { label: 'SOA', value: 'SOA' }
]

const quickExamples = ['google.com', 'github.com', 'cloudflare.com', 'baidu.com']

const typeColorMap = {
  A: 'info',
  AAAA: 'info',
  MX: 'warning',
  TXT: 'default',
  CNAME: 'success',
  NS: 'default',
  SOA: 'default'
}

// DNS 记录类型数字到字符串的映射
const typeNumMap = {
  1: 'A', 28: 'AAAA', 5: 'CNAME', 15: 'MX',
  16: 'TXT', 2: 'NS', 6: 'SOA'
}

const columns = computed(() => [
  {
    title: t('other.dns.colName'),
    key: 'name',
    ellipsis: { tooltip: true }
  },
  {
    title: t('other.dns.colType'),
    key: 'type',
    width: 80,
    render: (row) => h(NTag, { type: typeColorMap[row.type] || 'default', size: 'small' }, () => row.type)
  },
  {
    title: 'TTL',
    key: 'TTL',
    width: 80
  },
  {
    title: t('other.dns.colValue'),
    key: 'data',
    ellipsis: { tooltip: true }
  }
])

const loadDomain = (d) => {
  domain.value = d
}

const query = async () => {
  const d = domain.value.trim()
  if (!d) {
    message.warning(t('other.dns.emptyDomain'))
    return
  }
  localStorage.setItem(STORAGE_KEY, d)
  loading.value = true
  queryError.value = ''
  records.value = []
  queried.value = false

  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(d)}&type=${recordType.value}`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal
    })
    clearTimeout(timer)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (data.Status !== 0) {
      queryError.value = t('other.dns.queryFailed') + ' (Status: ' + data.Status + ')'
      return
    }

    records.value = (data.Answer || []).map(record => ({
      name: record.name,
      type: typeNumMap[record.type] || String(record.type),
      TTL: record.TTL,
      data: record.data
    }))
  } catch (e) {
    queryError.value = e.name === 'AbortError'
      ? t('other.dns.timeout')
      : (e.message || t('other.dns.queryFailed'))
  } finally {
    loading.value = false
    queried.value = true
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) domain.value = saved
})
</script>

<style scoped>
.dns-query-tool {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.quick-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-label {
  font-size: 13px;
}

.result-section {
  margin-bottom: 4px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.error-alert {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .dns-query-tool {
    padding: 0 12px;
  }
}
</style>

