<template>
  <div class="python-format">
    <n-card :title="t('format.python.title')">
      <!-- Python输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.python.placeholder')"
        language="python"
      />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatPython" type="primary" :loading="loading">
          {{ t('format.python.format') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <n-alert
        v-if="error"
        type="error"
        :title="t('common.error')"
        :content="error"
        class="error-alert"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CodeEditor from '@/components/common/CodeEditor.vue'
import { formatCode } from '@/utils/formatUtils'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const loading = ref(false)

const formatPython = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.python.empty'))
    return
  }
  
  loading.value = true
  try {
    input.value = await formatCode(input.value, 'python')
    error.value = ''
    message.success(t('format.python.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.python.error'))
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.python-format {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.error-alert {
  margin-top: 16px;
}
</style> 