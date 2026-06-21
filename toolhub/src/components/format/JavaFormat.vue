<template>
  <div class="java-format">
    <!-- 工具简介 -->
    <ToolIntro toolKey="java" />

    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('format.java.title') }}</span>
          <n-icon size="20" class="language-icon">
            <CafeOutline />
          </n-icon>
        </div>
      </template>
      <!-- Java输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.java.placeholder')" language="java" />
      <!-- 操作按钮组 -->
      <div class="button-group">
        <n-button @click="formatJava" type="primary" :loading="loading">
          {{ t('format.java.format') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
        <!-- 下载按钮 -->
        <n-button @click="downloadJava" :disabled="!input.trim()">
          {{ t('format.java.download') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="java" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'
// 导入图标
import { CafeOutline } from '@vicons/ionicons5'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const loading = ref(false)

const formatJava = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.java.empty'))
    return
  }
  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'java')
    message.success(t('format.java.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.java.error'))
  } finally {
    loading.value = false
  }
}

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
 * 下载Java文件
 * 将当前Java内容下载为.java文件
 */
const downloadJava = () => {
  if (!input.value.trim()) {
    message.warning(t('format.java.empty'))
    return
  }
  
  try {
    error.value = ''
    // 创建Blob对象
    const blob = new Blob([input.value], { type: 'text/x-java-source;charset=utf-8' })
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted-code.java`
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 清理URL对象
    URL.revokeObjectURL(url)
    message.success(t('format.java.downloadSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.java-format {
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
  color: #ed8b00;
  opacity: 0.9;
}
</style>
