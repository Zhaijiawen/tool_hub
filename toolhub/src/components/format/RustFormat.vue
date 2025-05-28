<template>
  <!-- Rust 代码格式化工具 -->
  <div class="rust-format">
    <n-card :title="t('format.rust.title')">
      <!-- Rust输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.rust.placeholder')"
        language="rust"
      />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatRust" type="primary">
          {{ t('format.rust.format') }}
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
        :content="error"
        class="error-alert"
      />
    </n-card>
  </div>
</template>

<script setup>
// Rust 代码格式化组件脚本
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

/**
 * 格式化 Rust 代码
 * 使用 formatUtils 进行代码美化
 */
const formatRust = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.rust.empty'))
    return
  }
  
  loading.value = true
  try {
    input.value = await formatCode(input.value, 'rust')
    error.value = ''
    message.success(t('format.rust.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.rust.error'))
  } finally {
    loading.value = false
  }
}

/**
 * 复制到剪贴板
 */
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
/* Rust 格式化工具样式 */
.rust-format {
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