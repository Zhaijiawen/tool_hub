<template>
  <div class="shorturl-container">
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="shortUrl" />
    
    <n-card :title="$t('other.shortUrl.title')">
      <!-- 演示模式提示 -->
      <n-alert type="warning" :title="$t('other.shortUrl.demoMode')" class="mb-4">
        {{ $t('other.shortUrl.demoModeDesc') }}
      </n-alert>

      <n-tabs type="line" animated>
        <!-- 生成短网址 -->
        <n-tab-pane name="generate" :tab="$t('other.shortUrl.generate')">
          <n-form>
            <n-form-item :label="$t('other.shortUrl.url')">
              <n-input 
                v-model:value="generateForm.url" 
                :placeholder="$t('other.shortUrl.urlPlaceholder')" 
                @keyup.enter="generateShortUrl"
              />
            </n-form-item>

            <n-form-item :label="$t('other.shortUrl.expires')">
              <n-select v-model:value="generateForm.expires" :options="expireOptions" />
            </n-form-item>

            <n-space>
              <n-button type="primary" @click="generateShortUrl" :loading="generating">
                {{ $t('other.shortUrl.generate') }}
              </n-button>
              <n-button @click="copyShortUrl" :disabled="!shortUrl">
                {{ $t('common.copy') }}
              </n-button>
            </n-space>

            <n-alert v-if="shortUrl" type="success" :title="$t('other.shortUrl.result')" class="mt-4">
              <n-space vertical size="small">
                <n-text copyable>{{ shortUrl }}</n-text>
                <n-text depth="3" style="font-size: 12px;">
                  {{ getExpirationText() }}
                </n-text>
              </n-space>
            </n-alert>
          </n-form>
        </n-tab-pane>

        <!-- 解码短网址 -->
        <n-tab-pane name="decode" :tab="$t('other.shortUrl.decode')">
          <n-form>
            <n-form-item :label="$t('other.shortUrl.shortUrl')">
              <n-input 
                v-model:value="decodeForm.shortUrl" 
                :placeholder="$t('other.shortUrl.shortUrlPlaceholder')"
                @keyup.enter="decodeShortUrl"
              />
            </n-form-item>

            <n-space>
              <n-button type="primary" @click="decodeShortUrl" :loading="decoding">
                {{ $t('other.shortUrl.decode') }}
              </n-button>
              <n-button @click="copyLongUrl" :disabled="!longUrl">
                {{ $t('common.copy') }}
              </n-button>
              <n-button @click="openOriginalUrl" :disabled="!longUrl" secondary>
                {{ $t('common.open') }}
              </n-button>
            </n-space>

            <n-alert v-if="longUrl" type="success" :title="$t('other.shortUrl.result')" class="mt-4">
              <n-space vertical size="small">
                <n-text copyable>{{ longUrl }}</n-text>
                <n-text depth="3" style="font-size: 12px;">
                  {{ getDecodedInfo() }}
                </n-text>
              </n-space>
            </n-alert>

            <!-- 错误提示 -->
            <n-alert v-if="decodeError" type="error" :title="$t('common.error')" class="mt-4">
              {{ decodeError }}
            </n-alert>
          </n-form>
        </n-tab-pane>

        <!-- 管理短链接 -->
        <n-tab-pane name="manage" tab="管理">
          <n-data-table
            :columns="tableColumns"
            :data="savedUrls"
            :pagination="false"
            size="small"
          />
          <n-button @click="clearAllUrls" type="error" size="small" class="mt-4" v-if="savedUrls.length > 0">
            清空所有
          </n-button>
        </n-tab-pane>
      </n-tabs>

      <!-- 使用说明 -->
      <n-alert type="info" :title="$t('other.shortUrl.infoTitle')" class="mt-4">
        {{ $t('other.shortUrl.infoContent') }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import ToolDescription from '../common/ToolDescription.vue'

const { t } = useI18n()
const message = useMessage()

// 配置：是否使用后端API
const USE_BACKEND_API = false // 设为true时使用后端API

// 状态
const generating = ref(false)
const decoding = ref(false)

// 生成短网址表单
const generateForm = reactive({
  url: '',
  expires: '7d'
})

// 解码短网址表单
const decodeForm = reactive({
  shortUrl: ''
})

// 过期时间选项
const expireOptions = computed(() => [
  { label: t('other.shortUrl.expires1d'), value: '1d' },
  { label: t('other.shortUrl.expires7d'), value: '7d' },
  { label: t('other.shortUrl.expires30d'), value: '30d' },
  { label: t('other.shortUrl.expiresNever'), value: 'never' }
])

// 结果
const shortUrl = ref('')
const longUrl = ref('')
const decodeError = ref('')

// 本地存储的URL映射
const savedUrls = ref([])

// 表格列定义
const tableColumns = [
  { title: '短链接', key: 'shortUrl', ellipsis: true },
  { title: '原始链接', key: 'originalUrl', ellipsis: true },
  { title: '创建时间', key: 'createdAt' },
  { title: '过期时间', key: 'expiresAt' },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return [
        h('n-button', {
          size: 'small',
          onClick: () => copyText(row.shortUrl)
        }, '复制'),
        h('n-button', {
          size: 'small',
          type: 'error',
          style: 'margin-left: 8px;',
          onClick: () => deleteUrl(row.id)
        }, '删除')
      ]
    }
  }
]

// 组件挂载时加载本地数据
onMounted(() => {
  loadLocalData()
})

// 生成短链接ID
function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 验证URL格式
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// 计算过期时间
function calculateExpiration(expires) {
  if (expires === 'never') return null
  
  const now = new Date()
  const days = parseInt(expires.replace('d', ''))
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
}

// 检查是否过期
function isExpired(expiresAt) {
  if (!expiresAt) return false
  return new Date() > new Date(expiresAt)
}

// 前端版本：生成短链接
async function generateShortUrlLocal() {
  if (!generateForm.url.trim()) {
    throw new Error(t('other.shortUrl.urlRequired'))
  }

  if (!isValidUrl(generateForm.url)) {
    throw new Error(t('other.shortUrl.invalidUrl'))
  }

  const shortId = generateShortId()
  const shortUrl = `${window.location.origin}/s/${shortId}`
  const expiresAt = calculateExpiration(generateForm.expires)
  
  const urlData = {
    id: shortId,
    shortUrl,
    originalUrl: generateForm.url,
    createdAt: new Date().toLocaleString(),
    expiresAt: expiresAt ? expiresAt.toLocaleString() : '永久',
    expires: generateForm.expires
  }

  // 保存到本地存储
  savedUrls.value.unshift(urlData)
  saveLocalData()

  return shortUrl
}

// 后端版本：生成短链接
async function generateShortUrlAPI() {
  const response = await fetch('/api/short-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: generateForm.url,
      expires: generateForm.expires
    })
  })

  if (!response.ok) {
    throw new Error(t('other.shortUrl.generateError'))
  }

  const data = await response.json()
  return data.shortUrl
}

// 生成短网址
async function generateShortUrl() {
  try {
    generating.value = true
    
    if (USE_BACKEND_API) {
      shortUrl.value = await generateShortUrlAPI()
    } else {
      shortUrl.value = await generateShortUrlLocal()
    }
    
    message.success(t('other.shortUrl.copied'))
  } catch (err) {
    message.error(err.message)
  } finally {
    generating.value = false
  }
}

// 前端版本：解码短链接
async function decodeShortUrlLocal() {
  if (!decodeForm.shortUrl.trim()) {
    throw new Error(t('other.shortUrl.shortUrlRequired'))
  }

  // 提取短链接ID
  const urlParts = decodeForm.shortUrl.split('/')
  const shortId = urlParts[urlParts.length - 1]

  // 在本地数据中查找
  const urlData = savedUrls.value.find(item => item.id === shortId)
  
  if (!urlData) {
    throw new Error('短链接不存在或已失效')
  }

  // 检查是否过期
  if (urlData.expires !== 'never' && isExpired(urlData.expiresAt)) {
    throw new Error('短链接已过期')
  }

  return {
    url: urlData.originalUrl,
    createdAt: urlData.createdAt,
    expiresAt: urlData.expiresAt
  }
}

// 后端版本：解码短链接
async function decodeShortUrlAPI() {
  const response = await fetch(`/api/short-url/${decodeForm.shortUrl}`)

  if (!response.ok) {
    throw new Error(t('other.shortUrl.decodeError'))
  }

  return await response.json()
}

// 解码短网址
async function decodeShortUrl() {
  try {
    decoding.value = true
    decodeError.value = ''
    
    let data
    if (USE_BACKEND_API) {
      data = await decodeShortUrlAPI()
    } else {
      data = await decodeShortUrlLocal()
    }
    
    longUrl.value = data.url
    message.success(t('other.shortUrl.copied'))
  } catch (err) {
    decodeError.value = err.message
    longUrl.value = ''
  } finally {
    decoding.value = false
  }
}

// 复制短网址
function copyShortUrl() {
  copyText(shortUrl.value)
}

// 复制长网址
function copyLongUrl() {
  copyText(longUrl.value)
}

// 通用复制函数
function copyText(text) {
  if (!text) return
  navigator.clipboard.writeText(text)
  message.success(t('common.copySuccess'))
}

// 打开原始URL
function openOriginalUrl() {
  if (longUrl.value) {
    window.open(longUrl.value, '_blank')
  }
}

// 获取过期时间文本
function getExpirationText() {
  const option = expireOptions.value.find(opt => opt.value === generateForm.expires)
  return `过期时间: ${option?.label || '永久'}`
}

// 获取解码信息
function getDecodedInfo() {
  return '点击"打开"按钮访问原始网站'
}

// 本地数据管理
function saveLocalData() {
  localStorage.setItem('shortUrls', JSON.stringify(savedUrls.value))
}

function loadLocalData() {
  try {
    const data = localStorage.getItem('shortUrls')
    if (data) {
      savedUrls.value = JSON.parse(data)
    }
  } catch (err) {
    console.error('加载本地数据失败:', err)
  }
}

function deleteUrl(id) {
  savedUrls.value = savedUrls.value.filter(item => item.id !== id)
  saveLocalData()
  message.success('删除成功')
}

function clearAllUrls() {
  savedUrls.value = []
  saveLocalData()
  message.success('清空成功')
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