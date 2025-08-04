<template>
  <div class="html-codec">
    <n-card :title="t('encrypt.html.title')" :description="t('encrypt.html.description')">
      <!-- 文本输入 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.html.textInput') }}</n-text>
        <n-input 
          v-model:value="textInput" 
          type="textarea" 
          :placeholder="t('encrypt.html.textInputPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
        <div class="input-info" v-if="textInput">
          <n-text depth="3">{{ t('common.charCount') }}：{{ textInput.length }} {{ t('common.characters') }}</n-text>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="handleEncode" type="primary" :disabled="!hasInput">
          {{ t('encrypt.html.encode') }}
        </n-button>
        <n-button @click="handleDecode" type="info" :disabled="!hasInput">
          {{ t('encrypt.html.decode') }}
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
            :placeholder="t('encrypt.html.textOutputPlaceholder')"
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
          <n-text depth="3">{{ t('encrypt.html.outputPlaceholder') }}</n-text>
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

// 清空所有内容
const clearAll = () => {
  textInput.value = ''
  textOutput.value = ''
  error.value = ''
}

// HTML编码处理
const handleEncode = () => {
  error.value = ''
  textOutput.value = ''
  
  if (textInput.value.trim()) {
    try {
      // 使用更安全的HTML编码方法
      const div = document.createElement('div')
      div.textContent = textInput.value.trim()
      textOutput.value = div.innerHTML
    } catch (e) {
      error.value = t('common.invalidInput')
    }
  } else {
    error.value = t('encrypt.html.inputRequired')
  }
}

// HTML解码处理
const handleDecode = () => {
  error.value = ''
  textOutput.value = ''
  
  if (textInput.value.trim()) {
    try {
      // 使用更安全的HTML解码方法
      const div = document.createElement('div')
      div.innerHTML = textInput.value.trim()
      textOutput.value = div.textContent || div.innerText || ''
    } catch (e) {
      error.value = t('encrypt.html.invalidHtml')
    }
  } else {
    error.value = t('encrypt.html.inputRequired')
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
.html-codec {
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
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #fafafa;
}
.error-alert {
  margin-top: 16px;
}
</style>