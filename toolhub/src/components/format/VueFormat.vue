<template>
  <!-- Vue 代码格式化工具 -->
  <div class="vue-format">
    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('format.vue.title') }}</span>
          <n-icon size="20" class="language-icon">
            <TriangleOutline />
          </n-icon>
        </div>
      </template>
      <!-- Vue输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.vue.placeholder')" language="vue" />
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
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="vue" />
  </div>
</template>

<script setup>
// Vue 代码格式化组件脚本
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入工具描述组件
import ToolDescription from '@/components/common/ToolDescription.vue'
import { formatCode } from '@/utils/formatUtils'
// 导入图标
import { ExtensionPuzzleOutline as TriangleOutline } from '@vicons/ionicons5'

const { t } = useI18n()
const message = useMessage()

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
    error.value = ''
    input.value = await formatCode(input.value, 'vue')
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

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-icon {
  color: #42b883;
  opacity: 0.9;
}
</style>