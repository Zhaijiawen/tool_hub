<template>
  <!-- SQL格式化工具容器 -->
  <div class="sql-format">
    <!-- 工具卡片 -->
    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('format.sql.title') }}</span>
          <n-icon size="20" class="language-icon">
            <ServerOutline />
          </n-icon>
        </div>
      </template>
      <!-- SQL输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.sql.placeholder')" language="sql" />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatSql" type="primary" :loading="loading">
          {{ t('format.sql.format') }}
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
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'
// 导入图标
import { ServerOutline } from '@vicons/ionicons5'

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
 * 格式化SQL
 * 使用sql-formatter进行格式化，设置SQL关键字大写和缩进等规则
 */
const formatSql = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.sql.empty'))
    return
  }

  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'sql')
    message.success(t('format.sql.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.sql.error'))
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
.sql-format {
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

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-icon {
  color: #336791;
  opacity: 0.9;
}
</style>