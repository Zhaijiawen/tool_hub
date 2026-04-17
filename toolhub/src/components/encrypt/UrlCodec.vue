<template>
  <div class="url-codec">
    <n-card :title="t('encrypt.url.title')" :description="t('encrypt.url.paramDescription')">
      <!-- 友好提示 -->
      <n-alert type="info" style="margin-bottom: 12px;">
        {{ t('encrypt.url.paramTip') }}
      </n-alert>
      <!-- URL输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.url.textInput') }}</n-text>
        <n-input 
          v-model:value="textInput" 
          type="textarea" 
          :placeholder="t('encrypt.url.paramInputPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
        <div class="input-info" v-if="textInput">
          <n-text depth="3">{{ t('common.charCount') }}：{{ textInput.length }} {{ t('common.characters') }}</n-text>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="handleEncode" type="primary" :disabled="!hasInput">
          {{ t('encrypt.url.encode') }}
        </n-button>
        <n-button @click="handleDecode" type="info" :disabled="!hasInput">
          {{ t('encrypt.url.decode') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>
      <!-- 输出区域 -->
      <div class="output-section">
        <n-text>{{ t('common.output') }}</n-text>
        <div v-if="textOutput">
          <n-input 
            v-model:value="textOutput" 
            type="textarea" 
            :placeholder="t('encrypt.url.textOutputPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 10 }" 
            readonly 
          />
          <div class="output-actions">
            <n-space>
              <n-button @click="copyTextOutput" size="small">
                {{ t('common.copy') }}
              </n-button>
              <n-text depth="3">{{ t('common.charCount') }}：{{ textOutput.length }} {{ t('common.characters') }}</n-text>
            </n-space>
          </div>
        </div>
        <div v-if="!textOutput" class="output-placeholder">
          <n-text depth="3">{{ t('encrypt.url.outputPlaceholder') }}</n-text>
        </div>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="encode" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()
const message = useMessage()

// 响应式数据
const textInput = ref('')
const textOutput = ref('')
const error = ref('')

// 检查是否有输入
const hasInput = computed(() => {
  return textInput.value.trim()
})

// 解析URL并提取参数
const parseUrl = (urlString) => {
  try {
    // 尝试解析为URL对象
    const url = new URL(urlString)
    
    // 获取原始查询字符串，避免浏览器自动解码
    const searchString = url.search
    const params = {}
    
    if (searchString) {
      // 手动解析查询参数，保持原始编码
      const queryString = searchString.substring(1) // 去掉开头的 '?'
      const pairs = queryString.split('&')
      
      for (const pair of pairs) {
        const [key, value] = pair.split('=')
        if (key) {
          params[decodeURIComponent(key)] = value || '' // 只解码key，保持value的原始编码
        }
      }
    }
    
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params: params
    }
  } catch (e) {
    // 如果不是完整URL，当作纯参数值处理
    return null
  }
}

// 构建URL字符串
const buildUrl = (urlParts) => {
  let url = `${urlParts.protocol}//${urlParts.hostname}`
  if (urlParts.port) {
    url += `:${urlParts.port}`
  }
  url += urlParts.pathname
  
  // 手动构建查询参数，避免URLSearchParams自动编码
  const paramPairs = []
  for (const [key, value] of Object.entries(urlParts.params)) {
    paramPairs.push(`${encodeURIComponent(key)}=${value}`)
  }
  const searchString = paramPairs.join('&')
  if (searchString) {
    url += `?${searchString}`
  }
  
  if (urlParts.hash) {
    url += urlParts.hash
  }
  
  return url
}

// 清空所有内容
const clearAll = () => {
  textInput.value = ''
  textOutput.value = ''
  error.value = ''
}

// 编码处理（只对参数值编码）
const handleEncode = () => {
  error.value = ''
  textOutput.value = ''
  
  if (textInput.value.trim()) {
    try {
      const urlParts = parseUrl(textInput.value.trim())
      
      if (urlParts) {
        // 是完整URL，只对参数值编码
        const encodedParams = {}
        for (const [key, value] of Object.entries(urlParts.params)) {
          encodedParams[key] = encodeURIComponent(value)
        }
        urlParts.params = encodedParams
        textOutput.value = buildUrl(urlParts)
      } else {
        // 不是URL，当作纯参数值编码
        textOutput.value = encodeURIComponent(textInput.value.trim())
      }
    } catch (e) {
      error.value = t('common.invalidInput')
    }
  } else {
    error.value = t('encrypt.url.inputRequired')
  }
}

// 解码处理（只对参数值解码）
const handleDecode = () => {
  error.value = ''
  textOutput.value = ''
  
  if (textInput.value.trim()) {
    try {
      const urlParts = parseUrl(textInput.value.trim())
      
      if (urlParts) {
        // 是完整URL，只对参数值解码
        const decodedParams = {}
        
        for (const [key, value] of Object.entries(urlParts.params)) {
          const decodedValue = decodeURIComponent(value)
          decodedParams[key] = decodedValue
        }
        
        urlParts.params = decodedParams
        textOutput.value = buildUrl(urlParts)
      } else {
        // 不是URL，当作纯参数值解码
        textOutput.value = decodeURIComponent(textInput.value.trim())
      }
    } catch (e) {
      error.value = t('encrypt.url.invalidUrl')
    }
  } else {
    error.value = t('encrypt.url.inputRequired')
  }
}

// 复制文本输出
const copyTextOutput = async () => {
  try {
    await navigator.clipboard.writeText(textOutput.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.url-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.input-section {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  background: none;
  padding: 0;
}
.input-info {
  margin-top: 8px;
}
.button-group {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.output-section {
  width: 100%;
  margin-bottom: 16px;
  border: none;
  background: none;
  padding: 0;
}
.output-actions {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.output-placeholder {
  text-align: center;
  padding: 40px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}
.error-alert {
  margin-top: 16px;
}
</style>