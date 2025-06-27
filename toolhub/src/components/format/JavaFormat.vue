<template>
  <div class="java-format">
    <n-card :title="t('format.java.title')">
      <!-- Java输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.java.placeholder')"
        language="java"
      />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatJava" type="primary" :loading="loading">
          {{ t('format.java.format') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert
        v-if="error"
        type="error"
        :title="t('common.error')"
        class="error-alert"
      >
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const loading = ref(false)

const formatJava = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.java.empty'))
    return
  }
  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'java')
    message.success(t('format.java.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.java.error'))
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    error.value = ''
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
.java-format {
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