<template>
  <!-- Markdown格式化工具容器 -->
  <div class="markdown-format">
    <!-- 工具卡片 -->
    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('format.markdown.title') }}</span>
          <n-icon size="20" class="language-icon">
            <LogoMarkdown />
          </n-icon>
        </div>
      </template>
      <!-- Markdown输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.markdown.placeholder')" language="markdown" />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatMarkdown" type="primary" :loading="loading">
          {{ t('format.markdown.format') }}
        </n-button>
        <!-- 复制按钮 -->
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
        <!-- 下载按钮 -->
        <n-button @click="downloadMarkdown" :disabled="!input.trim()">
          {{ t('format.markdown.download') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="markdown" />
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
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'
// 导入图标
import { LogoMarkdown } from '@vicons/ionicons5'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'


// 初始化国际化
const { t } = useI18n()
// 初始化消息提示
const message = useMessage()

// 输入文本
const input = ref('')
// 错误信息
const error = ref('')
// 加载状态
const loading = ref(false)

/**
 * 格式化Markdown
 * 使用prettier进行格式化，设置缩进和换行等规则
 */

const formatMarkdown = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.markdown.empty'))
    return
  }

  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'markdown')
    message.success(t('format.markdown.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.markdown.error'))
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

/**
 * 下载Markdown文件
 * 将当前Markdown内容下载为.md文件
 */
const downloadMarkdown = () => {
  if (!input.value.trim()) {
    message.warning(t('format.markdown.empty'))
    return
  }
  
  try {
    error.value = ''
    // 创建Blob对象
    const blob = new Blob([input.value], { type: 'text/markdown;charset=utf-8' })
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted-document.md`
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 清理URL对象
    URL.revokeObjectURL(url)
    message.success(t('format.markdown.downloadSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
/* 工具容器样式 */
.markdown-format {
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
  color: #083fa1;
  opacity: 0.9;
}
</style>