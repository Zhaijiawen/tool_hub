<template>
  <!-- Kotlin 代码格式化工具 -->
  <div class="kotlin-format">
    <n-card :title="t('format.kotlin.title')">
      <!-- Kotlin输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.kotlin.placeholder')"
        language="kotlin"
      />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatKotlin" type="primary">
          {{ t('format.kotlin.format') }}
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
// Kotlin 代码格式化组件脚本
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const error = ref('')

/**
 * 格式化 Kotlin 代码
 * 使用通用格式化工具进行格式化
 */
const formatKotlin = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.kotlin.empty'))
    return
  }
  try {
    input.value = await formatCode(input.value, 'kotlin')
    error.value = ''
    message.success(t('format.kotlin.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.kotlin.error'))
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
/* Kotlin 格式化工具样式 */
.kotlin-format {
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