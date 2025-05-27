<template>
  <!-- Vue 代码格式化工具 -->
  <div class="vue-format">
    <n-card :title="t('format.vue.title')">
      <!-- Vue输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.vue.placeholder')"
        language="vue"
      />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatVue" type="primary" :loading="loading">
          {{ t('format.vue.format') }}
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
// Vue 代码格式化组件脚本
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import prettier from 'prettier/standalone'
import vuePlugin from '@prettier/plugin-vue'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const error = ref('')
const loading = ref(false)

/**
 * 格式化 Vue 代码
 * 使用 Prettier 进行代码美化
 */
const formatVue = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.vue.empty'))
    return
  }
  
  loading.value = true
  try {
    // 使用 Prettier 格式化 Vue 代码
    const formatted = await prettier.format(input.value, {
      parser: 'vue',
      plugins: [vuePlugin],
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
      trailingComma: 'none'
    })
    input.value = formatted
    error.value = ''
    message.success(t('format.vue.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.vue.error'))
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
/* Vue 格式化工具样式 */
.vue-format {
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