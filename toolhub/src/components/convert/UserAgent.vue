<template>
  <div class="user-agent">

    <n-card :title="t('convert.userAgent.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 输入区域 -->
        <div class="input-section">
          <n-text class="section-title">{{ t('convert.userAgent.input') }}</n-text>
          <n-input 
            v-model:value="formData.input" 
            :placeholder="t('convert.userAgent.inputPlaceholder')" 
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 15 }"
            clearable
            @input="handleInput"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <n-space justify="end">
            <n-button @click="loadExample" type="info">
              {{ t('convert.userAgent.loadExample') }}
            </n-button>
          </n-space>
        </div>

        <!-- 解析结果 -->
        <div class="result-section" v-if="result">
          <n-text class="section-title">{{ t('convert.userAgent.result') }}</n-text>
          <n-card class="result-card">
            <n-descriptions bordered>
              <n-descriptions-item :label="t('convert.userAgent.browser')">
                <div class="result-item">
                  <span>{{ result.browser.name || t('convert.userAgent.unknown') }}</span>
                  <span v-if="result.browser.version" class="version">{{ result.browser.version }}</span>
                </div>
              </n-descriptions-item>
              <n-descriptions-item :label="t('convert.userAgent.os')">
                <div class="result-item">
                  <span>{{ result.os.name || t('convert.userAgent.unknown') }}</span>
                  <span v-if="result.os.version" class="version">{{ result.os.version }}</span>
                </div>
              </n-descriptions-item>
              <n-descriptions-item :label="t('convert.userAgent.device')">
                <div class="result-item">
                  <span>{{ result.device.type || t('convert.userAgent.desktop') }}</span>
                </div>
              </n-descriptions-item>
              <n-descriptions-item :label="t('convert.userAgent.engine')">
                <div class="result-item">
                  <span>{{ result.engine.name || t('convert.userAgent.unknown') }}</span>
                  <span v-if="result.engine.version" class="version">{{ result.engine.version }}</span>
                </div>
              </n-descriptions-item>
              <n-descriptions-item :label="t('convert.userAgent.cpu')">
                <div class="result-item">
                  <span>{{ result.cpu.architecture || t('convert.userAgent.unknown') }}</span>
                </div>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>

        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('convert.userAgent.infoTitle')" class="info-alert">
            {{ t('convert.userAgent.infoContent') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { UAParser } from 'ua-parser-js'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: ''
})

const error = ref('')
const result = ref(null)

// 处理输入变化
const handleInput = () => {
  error.value = ''
  if (formData.input.trim()) {
    try {
      const parser = new UAParser(formData.input.trim())
      result.value = parser.getResult()
    } catch (err) {
      error.value = err.message
      result.value = null
    }
  } else {
    result.value = null
  }
}

// 加载示例
const loadExample = () => {
  const examples = [
    {
      name: t('convert.userAgent.examples.chrome'),
      content: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      name: t('convert.userAgent.examples.firefox'),
      content: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
    },
    {
      name: t('convert.userAgent.examples.safari'),
      content: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    },
    {
      name: t('convert.userAgent.examples.mobile'),
      content: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
    }
  ]
  
  // 随机选择一个示例
  const example = examples[Math.floor(Math.random() * examples.length)]
  
  formData.input = example.content
  handleInput()
  
  message.success(t('convert.userAgent.exampleLoaded', { name: example.name }))
}

// 清空所有
const clearAll = () => {
  formData.input = ''
  result.value = null
  error.value = ''
}
</script>

<style scoped>
.user-agent {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section {
  margin-bottom: 20px;
}

.actions-section {
  margin-bottom: 20px;
}

.result-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.result-card {
  border: 1px solid #eee;
  border-radius: 6px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version {
  color: #666;
  font-size: 14px;
}

.error-alert {
  margin-top: 16px;
}

.info-section {
  margin-bottom: 20px;
}

.info-alert {
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-agent {
    padding: 0 16px;
  }
}
</style>