<template>
  <!-- JSON格式化工具容器 -->
  <div class="json-format">
    <!-- 工具卡片 -->
    <n-card :title="t('format.json.title')">
      <!-- JSON输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.json.placeholder')"
        language="json"
      />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatJson" type="primary">
          {{ t('format.json.format') }}
        </n-button>
        <!-- 压缩按钮 -->
        <n-button @click="compressJson">
          {{ t('format.json.compress') }}
        </n-button>
        <!-- 转义按钮 -->
        <n-button @click="escapeJson">
          {{ t('format.json.escape') }}
        </n-button>
        <!-- 反转义按钮 -->
        <n-button @click="unescapeJson">
          {{ t('format.json.unescape') }}
        </n-button>
        <!-- 复制按钮 -->
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
// 导入Vue相关功能
import { ref } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入Naive UI消息提示
import { useMessage } from 'naive-ui'
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

/**
 * 验证 JSON 格式
 * @param {string} jsonString - 要验证的 JSON 字符串
 * @returns {boolean} - 是否为有效的 JSON
 */
const isValidJson = (jsonString) => {
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}

/**
 * 格式化JSON
 * 使用通用格式化工具进行格式化
 */
const formatJson = async () => {
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    message.warning(t('format.json.empty'))
    return
  }
  try {
    input.value = await formatCode(trimmedInput, 'json')
    error.value = ''
    message.success(t('format.json.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.error'))
  }
}

/**
 * 压缩JSON
 * 移除所有空白字符，使JSON更紧凑
 */
const compressJson = () => {
  const trimmedInput = input.value.trim()
  
  if (!trimmedInput) {
    message.warning(t('format.json.empty'))
    return
  }
  
  try {
    const parsed = JSON.parse(trimmedInput)
    input.value = JSON.stringify(parsed)
    error.value = ''
    message.success(t('format.json.compressSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.compressError'))
  }
}

/**
 * 转义JSON
 * 将JSON字符串转换为转义形式
 */
const escapeJson = () => {
  if (!input.value) {
    message.warning(t('format.json.empty'))
    return
  }
  
  try {
    input.value = JSON.stringify(input.value)
    error.value = ''
    message.success(t('format.json.escapeSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.escapeError'))
  }
}

/**
 * 反转义JSON
 * 将转义的JSON字符串转换回原始形式
 */
const unescapeJson = () => {
  if (!input.value.trim()) {
    message.warning(t('format.json.empty'))
    return
  }
  
  try {
    input.value = JSON.parse(input.value)
    error.value = ''
    message.success(t('format.json.unescapeSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.unescapeError'))
  }
}

/**
 * 复制到剪贴板
 * 将当前内容复制到系统剪贴板
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
/* 工具容器样式 */
.json-format {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 按钮组样式 */
.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 错误提示样式 */
.error-alert {
  margin-top: 16px;
}
</style> 