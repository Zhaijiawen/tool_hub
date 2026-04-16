<template>
  <div class="ip-query-tool">
    <n-card :title="t('other.ip.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 当前IP信息 -->
        <div class="current-ip-section">
          <div class="current-ip-header">
            <n-text class="section-title">{{ t('other.ip.currentIp') }}</n-text>
            <n-button size="small" @click="fetchCurrentIp" :loading="loadingCurrent">
              {{ t('other.ip.refresh') }}
            </n-button>
          </div>
          <n-spin :show="loadingCurrent">
            <div v-if="currentIpInfo" class="ip-info-card">
              <IpInfoDisplay :info="currentIpInfo" />
            </div>
            <n-empty v-else-if="!loadingCurrent" :description="t('other.ip.clickToLoad')" />
          </n-spin>
        </div>

        <!-- 查询任意 IP -->
        <div class="query-section">
          <n-text class="section-title">{{ t('other.ip.queryAny') }}</n-text>
          <n-input-group>
            <n-input
              v-model:value="queryIp"
              :placeholder="t('other.ip.queryPlaceholder')"
              clearable
              @keydown.enter="querySpecificIp"
            />
            <n-button type="primary" @click="querySpecificIp" :loading="loadingQuery">
              {{ t('other.ip.query') }}
            </n-button>
          </n-input-group>
        </div>

        <!-- 查询结果 -->
        <div v-if="queriedIpInfo" class="query-result-section">
          <n-text class="section-title">{{ t('other.ip.queryResult') }}</n-text>
          <div class="ip-info-card">
            <IpInfoDisplay :info="queriedIpInfo" />
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="queryError" type="error" :title="t('common.error')" class="error-alert">
          {{ queryError }}
        </n-alert>

        <!-- 说明 -->
        <n-alert type="info" :title="t('other.ip.apiNote')">
          {{ t('other.ip.apiNoteContent') }}
        </n-alert>

      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NDescriptions, NDescriptionsItem, NText, NTag, NA } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_ip_input'

const queryIp = ref('')
const currentIpInfo = ref(null)
const queriedIpInfo = ref(null)
const loadingCurrent = ref(false)
const loadingQuery = ref(false)
const queryError = ref('')

// 内联子组件，展示 IP 详情
const IpInfoDisplay = defineComponent({
  name: 'IpInfoDisplay',
  props: { info: { type: Object, required: true } },
  setup(props) {
    return () => h(NDescriptions, { bordered: true, column: 1 }, () => [
      h(NDescriptionsItem, { label: 'IP' }, () => h(NText, { strong: true }, () => props.info.ip || '-')),
      h(NDescriptionsItem, { label: t('other.ip.country') }, () => `${props.info.country_name || ''} (${props.info.country || '-'})`),
      h(NDescriptionsItem, { label: t('other.ip.region') }, () => props.info.region || '-'),
      h(NDescriptionsItem, { label: t('other.ip.city') }, () => props.info.city || '-'),
      h(NDescriptionsItem, { label: t('other.ip.isp') }, () => props.info.org || '-'),
      h(NDescriptionsItem, { label: t('other.ip.timezone') }, () => props.info.timezone || '-'),
      h(NDescriptionsItem, { label: t('other.ip.latlon') }, () => {
        if (!props.info.latitude) return '-'
        const lat = props.info.latitude
        const lon = props.info.longitude
        const href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`
        return h(NA, { href, target: '_blank' }, () => `${lat}, ${lon}`)
      }),
      h(NDescriptionsItem, { label: t('other.ip.asn') }, () => props.info.asn || '-'),
    ])
  }
})

const fetchWithTimeout = async (url, timeout = 8000) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

const fetchCurrentIp = async () => {
  loadingCurrent.value = true
  queryError.value = ''
  try {
    const data = await fetchWithTimeout('https://ipapi.co/json/')
    currentIpInfo.value = data
  } catch (e) {
    // 备用接口
    try {
      const data = await fetchWithTimeout('https://ip-api.com/json/?lang=zh-CN')
      // 统一字段映射
      currentIpInfo.value = {
        ip: data.query,
        country_name: data.country,
        country: data.countryCode,
        region: data.regionName,
        city: data.city,
        org: data.isp,
        timezone: data.timezone,
        latitude: data.lat,
        longitude: data.lon,
        asn: data.as
      }
    } catch (e2) {
      queryError.value = t('other.ip.fetchError')
    }
  } finally {
    loadingCurrent.value = false
  }
}

const querySpecificIp = async () => {
  const ip = queryIp.value.trim()
  if (!ip) {
    message.warning(t('other.ip.emptyInput'))
    return
  }
  localStorage.setItem(STORAGE_KEY, ip)
  loadingQuery.value = true
  queryError.value = ''
  queriedIpInfo.value = null
  try {
    const data = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`)
    if (data.error) throw new Error(data.reason || t('other.ip.fetchError'))
    queriedIpInfo.value = data
  } catch (e) {
    // 备用接口
    try {
      const data = await fetchWithTimeout(`https://ip-api.com/json/${ip}?lang=zh-CN`)
      if (data.status === 'fail') throw new Error(data.message)
      queriedIpInfo.value = {
        ip: data.query,
        country_name: data.country,
        country: data.countryCode,
        region: data.regionName,
        city: data.city,
        org: data.isp,
        timezone: data.timezone,
        latitude: data.lat,
        longitude: data.lon,
        asn: data.as
      }
    } catch (e2) {
      queryError.value = e2.message || t('other.ip.fetchError')
    }
  } finally {
    loadingQuery.value = false
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) queryIp.value = saved
  // 自动加载当前 IP
  fetchCurrentIp()
})
</script>

<style scoped>
.ip-query-tool {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.current-ip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.current-ip-section,
.query-section,
.query-result-section {
  margin-bottom: 4px;
}

.ip-info-card {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}

.error-alert {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .ip-query-tool {
    padding: 0 12px;
  }
}
</style>

