<template>
  <n-card :title="$t('other.shortUrl.title')">
    <n-tabs type="line" animated>
      <!-- 生成短网址 -->
      <n-tab-pane name="generate" :tab="$t('other.shortUrl.generate')">
        <n-form>
          <n-form-item :label="$t('other.shortUrl.url')">
            <n-input v-model:value="generateForm.url" :placeholder="$t('other.shortUrl.urlPlaceholder')" />
          </n-form-item>

          <n-form-item :label="$t('other.shortUrl.expires')">
            <n-select v-model:value="generateForm.expires" :options="expireOptions" />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="generateShortUrl">
              {{ $t('other.shortUrl.generate') }}
            </n-button>
            <n-button @click="copyShortUrl" :disabled="!shortUrl">
              {{ $t('other.shortUrl.copy') }}
            </n-button>
          </n-space>

          <n-alert v-if="shortUrl" type="success" :title="$t('other.shortUrl.result')" class="mt-4">
            <n-text copyable>{{ shortUrl }}</n-text>
          </n-alert>
        </n-form>
      </n-tab-pane>

      <!-- 解码短网址 -->
      <n-tab-pane name="decode" :tab="$t('other.shortUrl.decode')">
        <n-form>
          <n-form-item :label="$t('other.shortUrl.shortUrl')">
            <n-input v-model:value="decodeForm.shortUrl" :placeholder="$t('other.shortUrl.shortUrlPlaceholder')" />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="decodeShortUrl">
              {{ $t('other.shortUrl.decode') }}
            </n-button>
            <n-button @click="copyLongUrl" :disabled="!longUrl">
              {{ $t('other.shortUrl.copy') }}
            </n-button>
          </n-space>

          <n-alert v-if="longUrl" type="success" :title="$t('other.shortUrl.result')" class="mt-4">
            <n-text copyable>{{ longUrl }}</n-text>
          </n-alert>

          <!-- 错误提示 -->
          <n-alert v-if="decodeError" type="t('common.error')" :title="error" class="mt-4">
            {{ decodeError }}
          </n-alert>

        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

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
const expireOptions = [
  { label: '1天', value: '1d' },
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '永久', value: 'never' }
]

// 短网址
const shortUrl = ref('')
const longUrl = ref('')
const decodeError = ref('')

// 生成短网址
async function generateShortUrl() {
  try {
    if (!generateForm.url) {
      throw new Error(t('other.shortUrl.urlRequired'))
    }

    // 这里应该调用后端API生成短网址
    // 示例代码仅作演示
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
    shortUrl.value = data.shortUrl
  } catch (err) {
    message.error(err.message)
  }
}

// 解码短网址
async function decodeShortUrl() {
  try {
    if (!decodeForm.shortUrl) {
      throw new Error(t('other.shortUrl.shortUrlRequired'))
    }

    // 这里应该调用后端API解码短网址
    // 示例代码仅作演示
    const response = await fetch(`/api/short-url/${decodeForm.shortUrl}`)

    if (!response.ok) {
      throw new Error(t('other.shortUrl.decodeError'))
    }

    const data = await response.json()
    longUrl.value = data.url
    decodeError.value = ''
  } catch (err) {
    decodeError.value = err.message
    longUrl.value = ''
  }
}

// 复制短网址
function copyShortUrl() {
  if (!shortUrl.value) return
  navigator.clipboard.writeText(shortUrl.value)
  message.success(t('other.shortUrl.copied'))
}

// 复制长网址
function copyLongUrl() {
  if (!longUrl.value) return
  navigator.clipboard.writeText(longUrl.value)
  message.success(t('other.shortUrl.copied'))
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style>