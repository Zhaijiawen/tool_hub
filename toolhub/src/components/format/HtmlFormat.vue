<template>
  <!-- HTML格式化工具容器 -->
  <div class="html-format">
    <!-- 工具简介 -->
    <ToolIntro toolKey="html" />

    <!-- 工具卡片 -->
    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('format.html.title') }}</span>
          <n-icon size="20" class="language-icon">
            <CodeSlashOutline />
          </n-icon>
        </div>
      </template>
      <!-- HTML输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.html.placeholder')" language="html" />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatHtml" type="primary" :loading="loading">
          {{ t('format.html.format') }}
        </n-button>
        <!-- 复制按钮 -->
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
        <!-- 下载按钮 -->
        <n-button @click="downloadHtml" :disabled="!input.trim()">
          {{ t('format.html.download') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="html" />
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
import ToolIntro from '@/components/common/ToolIntro.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'
// 导入图标
import { CodeSlashOutline } from '@vicons/ionicons5'
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
 * 格式化HTML
 * 使用通用格式化工具进行格式化
 */
const formatHtml = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.html.empty'))
    return
  }
  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'html')
    message.success(t('format.html.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.html.error'))
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
 * 下载HTML文件
 * 将当前HTML内容下载为.html文件
 */
const downloadHtml = () => {
  if (!input.value.trim()) {
    message.warning(t('format.html.empty'))
    return
  }
  
  try {
    error.value = ''
    // 创建Blob对象
    const blob = new Blob([input.value], { type: 'text/html;charset=utf-8' })
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted-document.html`
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 清理URL对象
    URL.revokeObjectURL(url)
    message.success(t('format.html.downloadSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
/* 工具容器样式 */
.html-format {
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
  color: #e34f26;
  opacity: 0.9;
}
</style>
