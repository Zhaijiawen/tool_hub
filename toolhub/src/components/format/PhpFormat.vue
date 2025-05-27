<template>
  <div class="php-format">
    <n-card :title="t('format.php.title')">
      <!-- PHP输入区域 - 带行号的代码编辑器 -->
      <CodeEditor 
        v-model="input"
        :placeholder="t('format.php.placeholder')"
        language="php"
      />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatPhp" type="primary" :loading="loading">
          {{ t('format.php.format') }}
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
import prettier from 'prettier/standalone'
import phpPlugin from '@prettier/plugin-php'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const loading = ref(false)

const formatPhp = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.php.empty'))
    return
  }
  
  loading.value = true
  try {
    const formatted = await prettier.format(input.value, {
      parser: 'php',
      plugins: [phpPlugin],
      printWidth: 100,
      tabWidth: 4,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'none'
    })
    input.value = formatted
    error.value = ''
    message.success(t('format.php.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.php.error'))
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
.php-format {
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