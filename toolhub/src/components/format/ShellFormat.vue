<template>
  <!-- Shell格式化工具容器 -->
  <div class="shell-format">
    <!-- 工具卡片 -->
    <n-card :title="t('format.shell.title')">
      <!-- Shell输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.shell.placeholder')" language="shell" />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatShell" type="primary">
          {{ t('format.shell.format') }}
        </n-button>
        <!-- 复制按钮 -->
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { ref } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入Naive UI消息提示
import { useMessage } from 'naive-ui'
// 导入代码美化工具
import { js_beautify } from 'js-beautify'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'

// 初始化国际化
const { t } = useI18n()
// 初始化消息提示
const message = useMessage()

// 输入文本
const input = ref('')
// 错误信息
const error = ref('')
const loading = ref(false)

/**
 * 格式化Shell脚本
 * 使用js-beautify进行格式化，设置缩进和空格等规则
 */
const formatShell = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.shell.empty'))
    return
  }

  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'shell')
    message.success(t('format.shell.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.shell.error'))
  } finally {
    loading.value = false
  }
}

/**
 * 复制到剪贴板
 * 将当前内容复制到系统剪贴板
 */
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
/* 工具容器样式 */
.shell-format {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 按钮组样式 */
.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

/* 错误提示样式 */
.error-alert {
  margin-top: 16px;
}
</style>