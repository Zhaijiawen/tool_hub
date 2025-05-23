<template>
  <!-- JSON格式化工具容器 -->
  <div class="json-format">
    <!-- 工具卡片 -->
    <n-card :title="t('format.json.title')">
      <!-- JSON输入区域 -->
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('format.json.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
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
// 导入代码格式化工具
import prettier from 'prettier'

// 初始化国际化
const { t } = useI18n()
// 初始化消息提示
const message = useMessage()

// 输入文本
const input = ref('')
// 错误信息
const error = ref('')

/**
 * 格式化JSON
 * 使用prettier进行格式化，设置缩进和换行等规则
 */
const formatJson = () => {
  try {
    input.value = prettier.format(input.value, {
      parser: 'json',
      printWidth: 100,    // 每行最大长度
      tabWidth: 2,        // 缩进空格数
      useTabs: false,     // 使用空格而不是制表符
      semi: true,         // 使用分号
      singleQuote: false, // 使用双引号
      trailingComma: 'none' // 不使用尾随逗号
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

/**
 * 压缩JSON
 * 移除所有空白字符，使JSON更紧凑
 */
const compressJson = () => {
  try {
    const parsed = JSON.parse(input.value)
    input.value = JSON.stringify(parsed)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

/**
 * 转义JSON
 * 将JSON字符串转换为转义形式
 */
const escapeJson = () => {
  try {
    input.value = JSON.stringify(input.value)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

/**
 * 反转义JSON
 * 将转义的JSON字符串转换回原始形式
 */
const unescapeJson = () => {
  try {
    input.value = JSON.parse(input.value)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

/**
 * 复制到剪贴板
 * 将当前内容复制到系统剪贴板
 */
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
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
}

/* 错误提示样式 */
.error-alert {
  margin-top: 16px;
}
</style> 