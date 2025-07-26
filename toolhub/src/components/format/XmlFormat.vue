<template>
  <!-- XML格式化工具容器 -->
  <div class="xml-format">
    <!-- 工具卡片 -->
    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('format.xml.title') }}</span>
          <n-icon size="20" class="language-icon">
            <DocumentTextOutline />
          </n-icon>
        </div>
      </template>
      <!-- XML输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="t('format.xml.placeholder')" language="xml" />
      <!-- 功能按钮组 -->
      <div class="button-group">
        <!-- 格式化按钮 -->
        <n-button @click="formatXml" type="primary" :loading="loading">
          {{ t('format.xml.format') }}
        </n-button>
        <!-- 压缩按钮 -->
        <n-button @click="compressXml">
          {{ t('format.xml.compress') }}
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
      
      <!-- 功能说明 -->
      <n-alert type="info" class="info-alert">
        <div class="info-content">
          <h4>{{ t('format.xml.info.title') }}</h4>
          <ul>
            <li><strong>{{ t('format.xml.format') }}:</strong> {{ t('format.xml.info.formatDesc') }}</li>
            <li><strong>{{ t('format.xml.compress') }}:</strong> {{ t('format.xml.info.compressDesc') }}</li>
          </ul>
        </div>
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
import { DocumentTextOutline } from '@vicons/ionicons5'

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
 * 格式化XML
 * 使用prettier和xml插件进行格式化，设置缩进和换行等规则
 */

const formatXml = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.xml.empty'))
    return
  }

  loading.value = true
  try {
    error.value = ''
    input.value = await formatCode(input.value, 'xml')
    message.success(t('format.xml.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.xml.error'))
  } finally {
    loading.value = false
  }
}

/**
 * 压缩XML
 * 移除所有空白字符，使XML更紧凑
 */
const compressXml = () => {
  if (!input.value.trim()) {
    message.warning(t('format.xml.empty'))
    return
  }

  try {
    error.value = ''
    input.value = input.value.replace(/>\s+</g, '><').trim()
    message.success(t('format.xml.compressSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.xml.compressError'))
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
.xml-format {
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

/* 信息提示样式 */
.info-alert {
  margin-top: 16px;
}

.info-content h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
}

.info-content ul {
  margin: 0;
  padding-left: 20px;
}

.info-content li {
  margin-bottom: 8px;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-icon {
  color: #ff6600;
  opacity: 0.9;
}
</style>