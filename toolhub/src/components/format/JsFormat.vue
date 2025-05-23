<template>
  <!-- JavaScript格式化工具容器 -->
  <div class="js-format">
    <!-- 工具卡片 -->
    <n-card :title="t('format.js.title')">
      <!-- JavaScript输入区域 -->
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('format.js.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatJs" type="primary">
          {{ t('format.js.format') }}
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
 * 格式化JavaScript
 * 使用prettier进行格式化，设置缩进和换行等规则
 */
const formatJs = () => {
  try {
    input.value = prettier.format(input.value, {
      parser: 'babel',     // 使用Babel解析器
      printWidth: 100,     // 每行最大长度
      tabWidth: 2,         // 缩进空格数
      useTabs: false,      // 使用空格而不是制表符
      semi: true,          // 使用分号
      singleQuote: true,   // 使用单引号
      trailingComma: 'none' // 不使用尾随逗号
    })
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
.js-format {
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