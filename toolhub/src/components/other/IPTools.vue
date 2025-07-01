<template>
  <n-card :title="$t('other.ip.title')">
    <!-- 演示模式提示 -->
    <n-alert type="warning" :title="$t('other.ip.demoMode')" class="mb-4">
      {{ $t('other.ip.demoModeDesc') }}
    </n-alert>

    <n-tabs type="line" animated>
      <!-- IP查询 -->
      <n-tab-pane name="lookup" :tab="$t('other.ip.lookup')">
        <n-form>
          <n-form-item :label="$t('other.ip.ip')">
            <n-input 
              v-model:value="lookupForm.ip" 
              :placeholder="$t('other.ip.ipPlaceholder')" 
              @keyup.enter="lookupIP"
            />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="lookupIP" :loading="lookupLoading">
              {{ $t('other.ip.lookup') }}
            </n-button>
            <n-button @click="copyResult" :disabled="!lookupResult">
              {{ $t('common.copy') }}
            </n-button>
            <n-button @click="getMyIP" secondary>
              {{ $t('other.ip.getMyIP') }}
            </n-button>
          </n-space>

          <n-result v-if="lookupResult" :status="'success'" :title="$t('other.ip.lookupResult')">
            <template #footer>
              <n-descriptions bordered>
                <n-descriptions-item :label="$t('other.ip.ip')">
                  {{ lookupResult.ip }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.country')">
                  {{ lookupResult.country || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.region')">
                  {{ lookupResult.region || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.city')">
                  {{ lookupResult.city || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.isp')">
                  {{ lookupResult.isp || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.asn')">
                  {{ lookupResult.asn || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.location')">
                  {{ lookupResult.latitude && lookupResult.longitude ? 
                      `${lookupResult.latitude}, ${lookupResult.longitude}` : 
                      $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.timezone')">
                  {{ lookupResult.timezone || $t('common.unknown') }}
                </n-descriptions-item>
              </n-descriptions>
            </template>
          </n-result>

          <!-- 错误提示 -->
          <n-alert v-if="lookupError" type="error" :title="$t('common.error')" class="mt-4">
            {{ lookupError }}
          </n-alert>
        </n-form>
      </n-tab-pane>

      <!-- IP反查 -->
      <n-tab-pane name="reverse" :tab="$t('other.ip.reverse')">
        <n-form>
          <n-form-item :label="$t('other.ip.domain')">
            <n-input 
              v-model:value="reverseForm.domain" 
              :placeholder="$t('other.ip.domainPlaceholder')" 
              @keyup.enter="reverseLookup"
            />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="reverseLookup" :loading="reverseLoading">
              {{ $t('other.ip.reverse') }}
            </n-button>
            <n-button @click="copyReverseResult" :disabled="!reverseResult.length">
              {{ $t('common.copy') }}
            </n-button>
          </n-space>

          <n-result v-if="reverseResult.length" :status="'success'" :title="$t('other.ip.reverseResult')">
            <template #footer>
              <n-list>
                <n-list-item v-for="(ip, index) in reverseResult" :key="index">
                  <n-text copyable>{{ ip }}</n-text>
                </n-list-item>
              </n-list>
            </template>
          </n-result>

          <n-alert v-if="reverseError" type="error" :title="$t('common.error')" class="mt-4">
            {{ reverseError }}
          </n-alert>
        </n-form>
      </n-tab-pane>

      <!-- 本机IP -->
      <n-tab-pane name="myip" :tab="$t('other.ip.myIP')">
        <n-space vertical>
          <n-button type="primary" @click="getMyIP" :loading="myIPLoading">
            {{ $t('other.ip.getMyIP') }}
          </n-button>
          
          <n-result v-if="myIPResult" :status="'success'" :title="$t('other.ip.myIPResult')">
            <template #footer>
              <n-descriptions bordered>
                <n-descriptions-item :label="$t('other.ip.publicIP')">
                  <n-text copyable>{{ myIPResult.ip }}</n-text>
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.country')">
                  {{ myIPResult.country || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.region')">
                  {{ myIPResult.region || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.city')">
                  {{ myIPResult.city || $t('common.unknown') }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ip.isp')">
                  {{ myIPResult.isp || $t('common.unknown') }}
                </n-descriptions-item>
              </n-descriptions>
            </template>
          </n-result>

          <n-alert v-if="myIPError" type="error" :title="$t('common.error')" class="mt-4">
            {{ myIPError }}
          </n-alert>
        </n-space>
      </n-tab-pane>
    </n-tabs>

    <!-- 使用说明 -->
    <n-alert type="info" :title="$t('other.ip.infoTitle')" class="mt-4">
      {{ $t('other.ip.infoContent') }}
    </n-alert>
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 配置：是否使用后端API
const USE_BACKEND_API = false // 设为true时使用后端API

// 加载状态
const lookupLoading = ref(false)
const reverseLoading = ref(false)
const myIPLoading = ref(false)

// IP查询表单
const lookupForm = reactive({
  ip: ''
})

// IP反查表单
const reverseForm = reactive({
  domain: ''
})

// 查询结果
const lookupResult = ref(null)
const lookupError = ref('')

// 反查结果
const reverseResult = ref([])
const reverseError = ref('')

// 本机IP结果
const myIPResult = ref(null)
const myIPError = ref('')

// 验证IP地址格式
function isValidIP(ip) {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

// 验证域名格式
function isValidDomain(domain) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/
  return domainRegex.test(domain)
}

// 生成模拟数据
function generateMockIPData(ip) {
  const countries = ['中国', '美国', '日本', '韩国', '德国', '英国', '法国', '加拿大']
  const regions = ['北京', '上海', '广东', '浙江', '江苏', '山东', '四川', '河南']
  const cities = ['北京', '上海', '深圳', '杭州', '南京', '青岛', '成都', '郑州']
  const isps = ['中国电信', '中国联通', '中国移动', 'AWS', 'Google', 'Microsoft', 'Cloudflare']
  const timezones = ['Asia/Shanghai', 'America/New_York', 'Europe/London', 'Asia/Tokyo']

  return {
    ip,
    country: countries[Math.floor(Math.random() * countries.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    isp: isps[Math.floor(Math.random() * isps.length)],
    asn: `AS${Math.floor(Math.random() * 65535)}`,
    latitude: (Math.random() * 180 - 90).toFixed(6),
    longitude: (Math.random() * 360 - 180).toFixed(6),
    timezone: timezones[Math.floor(Math.random() * timezones.length)]
  }
}

// 前端版本：IP查询
async function lookupIPLocal() {
  if (!lookupForm.ip.trim()) {
    throw new Error(t('other.ip.ipRequired'))
  }

  if (!isValidIP(lookupForm.ip.trim())) {
    throw new Error(t('other.ip.invalidIP'))
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  return generateMockIPData(lookupForm.ip.trim())
}

// 后端版本：IP查询
async function lookupIPAPI() {
  const response = await fetch(`/api/ip-lookup/${lookupForm.ip}`)

  if (!response.ok) {
    throw new Error(t('other.ip.lookupError'))
  }

  return await response.json()
}

// IP查询
async function lookupIP() {
  try {
    lookupLoading.value = true
    lookupError.value = ''
    lookupResult.value = null

    let data
    if (USE_BACKEND_API) {
      data = await lookupIPAPI()
    } else {
      data = await lookupIPLocal()
    }

    lookupResult.value = data
    message.success(t('other.ip.lookupSuccess'))
  } catch (err) {
    lookupError.value = err.message
    lookupResult.value = null
  } finally {
    lookupLoading.value = false
  }
}

// 前端版本：IP反查
async function reverseLookupLocal() {
  if (!reverseForm.domain.trim()) {
    throw new Error(t('other.ip.domainRequired'))
  }

  if (!isValidDomain(reverseForm.domain.trim())) {
    throw new Error(t('other.ip.invalidDomain'))
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 生成模拟IP列表
  const ips = []
  const count = Math.floor(Math.random() * 5) + 1
  for (let i = 0; i < count; i++) {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    ips.push(ip)
  }

  return ips
}

// 后端版本：IP反查
async function reverseLookupAPI() {
  const response = await fetch(`/api/ip-reverse/${reverseForm.domain}`)

  if (!response.ok) {
    throw new Error(t('other.ip.reverseError'))
  }

  const data = await response.json()
  return data.ips
}

// IP反查
async function reverseLookup() {
  try {
    reverseLoading.value = true
    reverseError.value = ''
    reverseResult.value = []

    let ips
    if (USE_BACKEND_API) {
      ips = await reverseLookupAPI()
    } else {
      ips = await reverseLookupLocal()
    }

    reverseResult.value = ips
    message.success(t('other.ip.reverseSuccess'))
  } catch (err) {
    reverseError.value = err.message
    reverseResult.value = []
  } finally {
    reverseLoading.value = false
  }
}

// 获取本机IP
async function getMyIP() {
  try {
    myIPLoading.value = true
    myIPError.value = ''
    myIPResult.value = null

    if (USE_BACKEND_API) {
      const response = await fetch('/api/my-ip')
      if (!response.ok) {
        throw new Error(t('other.ip.getMyIPError'))
      }
      myIPResult.value = await response.json()
    } else {
      // 模拟获取本机IP
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      myIPResult.value = generateMockIPData(mockIP)
    }

    message.success(t('other.ip.getMyIPSuccess'))
  } catch (err) {
    myIPError.value = err.message
    myIPResult.value = null
  } finally {
    myIPLoading.value = false
  }
}

// 复制查询结果
function copyResult() {
  if (!lookupResult.value) return

  const result = JSON.stringify(lookupResult.value, null, 2)
  navigator.clipboard.writeText(result)
  message.success(t('common.copySuccess'))
}

// 复制反查结果
function copyReverseResult() {
  if (!reverseResult.value.length) return

  const result = reverseResult.value.join('\n')
  navigator.clipboard.writeText(result)
  message.success(t('common.copySuccess'))
}
</script>

<style scoped>
.n-card {
  max-width: 1200px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>