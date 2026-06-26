<template>
  <!-- JSON格式化工具容器 -->
  <div class="json-format">
    <!-- 工具简介 -->
    <ToolIntro toolKey="json" />

    <!-- 工具卡片 -->
    <n-card>
      <template #header>
        <div class="card-header">
          <span>{{ currentTitle }}</span>
          <div class="mode-toggle">
            <button
              :class="['mode-btn', { active: mode === 'json' }]"
              @click="mode = 'json'"
            >JSON</button>
            <span class="mode-arrow">→</span>
            <button
              :class="['mode-btn', { active: mode === 'json5' }]"
              @click="mode = 'json5'"
            >JSON5</button>
          </div>
        </div>
      </template>
      <!-- JSON输入区域 - 带行号的代码编辑器 -->
      <CodeEditor v-model="input" :placeholder="currentPlaceholder" :language="editorLanguage" />
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
        <!-- 下载按钮 -->
        <n-button @click="downloadJson" :disabled="!input.trim()">
          {{ t('format.json.download') }}
        </n-button>
      </div>
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
      
      <!-- 功能说明 -->
      <n-alert type="info" class="info-alert">
        <div class="info-content">
          <h4>{{ t('format.json.info.title') }}</h4>
          <ul>
            <li><strong>{{ t('format.json.format') }}:</strong> {{ t('format.json.info.formatDesc') }}</li>
            <li><strong>{{ t('format.json.compress') }}:</strong> {{ t('format.json.info.compressDesc') }}</li>
            <li><strong>{{ t('format.json.escape') }}:</strong> {{ t('format.json.info.escapeDesc') }}</li>
            <li><strong>{{ t('format.json.unescape') }}:</strong> {{ t('format.json.info.unescapeDesc') }}</li>
          </ul>
        </div>
      </n-alert>

      <!-- JSON5 模式说明 -->
      <n-alert v-if="mode === 'json5'" type="warning" class="info-alert">
        <div class="info-content">
          <h4>{{ t('format.json.json5InfoTitle') }}</h4>
          <ul>
            <li>{{ t('format.json.json5Tip1') }}</li>
            <li>{{ t('format.json.json5Tip2') }}</li>
            <li>{{ t('format.json.json5Tip3') }}</li>
          </ul>
        </div>
      </n-alert>
    </n-card>

    <!-- 工具详细描述已移至左侧面板 -->
    <TutorialAndDocs toolKey="json" />
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { ref, computed } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入Naive UI消息提示
import { useMessage } from 'naive-ui'
// 导入通用代码编辑器组件
import CodeEditor from '@/components/common/CodeEditor.vue'
// 导入工具简介组件
import ToolIntro from '@/components/common/ToolIntro.vue'
// 导入格式化工具
import { formatCode } from '@/utils/formatUtils'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

// 初始化国际化
const { t } = useI18n()
// 初始化消息提示
const message = useMessage()

// JSON / JSON5 模式
const mode = ref('json')
const editorLanguage = computed(() => mode.value === 'json5' ? 'javascript' : 'json')
const currentTitle = computed(() => mode.value === 'json5' ? t('format.json.json5Title') : t('format.json.title'))
const currentPlaceholder = computed(() => mode.value === 'json5' ? t('format.json.json5Placeholder') : t('format.json.placeholder'))

// 输入文本
const input = ref('')
// 错误信息
const error = ref('')

/**
 * 格式化JSON
 * 使用通用格式化工具进行格式化
 */
const formatJson = async () => {
  const trimmedInput = input.value.trim()
  if (!trimmedInput) {
    message.warning(t('format.json.empty'))
    return
  }
  try {
    error.value = ''
    const lang = mode.value === 'json5' ? 'json5' : 'json'
    input.value = await formatCode(trimmedInput, lang)
    // 校验合法性（JSON5 需要 json5 库，标准 JSON 用原生）
    if (mode.value === 'json5') {
      const { default: JSON5 } = await import('json5')
      JSON5.parse(input.value)
    } else {
      JSON.parse(input.value)
    }
    message.success(t('format.json.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.error'))
  }
}

/**
 * 压缩JSON
 * 移除所有空白字符，使JSON更紧凑
 */
const compressJson = async () => {
  const trimmedInput = input.value.trim()

  if (!trimmedInput) {
    message.warning(t('format.json.empty'))
    return
  }

  try {
    error.value = ''
    if (mode.value === 'json5') {
      const { default: JSON5 } = await import('json5')
      const parsed = JSON5.parse(trimmedInput)
      input.value = JSON.stringify(parsed)
    } else {
      const parsed = JSON.parse(trimmedInput)
      input.value = JSON.stringify(parsed)
    }
    message.success(t('format.json.compressSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.compressError'))
  }
}

/**
 * 转义JSON
 * 将双引号转义为\"，反斜杠转义为\\
 */
const escapeJson = () => {
  if (!input.value) {
    message.warning(t('format.json.empty'))
    return
  }

  try {
    error.value = ''
    // 先转义反斜杠，再转义双引号（顺序很重要）
    let escaped = input.value
      .replace(/\\/g, '\\\\')  // 转义反斜杠
      .replace(/"/g, '\\"')    // 转义双引号

    input.value = escaped
    message.success(t('format.json.escapeSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.escapeError'))
  }
}

/**
 * 反转义JSON
 * 将\"转换回双引号"，将\\转换回反斜杠\
 */
const unescapeJson = () => {
  if (!input.value.trim()) {
    message.warning(t('format.json.empty'))
    return
  }

  try {
    error.value = ''
    // 先反转义双引号，再反转义反斜杠（顺序很重要）
    let unescaped = input.value
      .replace(/\\"/g, '"')     // 反转义双引号
      .replace(/\\\\/g, '\\')   // 反转义反斜杠

    input.value = unescaped
    message.success(t('format.json.unescapeSuccess'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.json.unescapeError'))
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
 * 下载JSON文件
 * 将当前JSON内容下载为.json文件
 */
const downloadJson = () => {
  if (!input.value.trim()) {
    message.warning(t('format.json.empty'))
    return
  }
  
  try {
    error.value = ''
    // 创建Blob对象
    const ext = mode.value === 'json5' ? 'json5' : 'json'
    const mime = mode.value === 'json5' ? 'application/json+json5' : 'application/json'
    const blob = new Blob([input.value], { type: `${mime};charset=utf-8` })
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted-data.${ext}`
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 清理URL对象
    URL.revokeObjectURL(url)
    message.success(t('format.json.downloadSuccess'))
  } catch (e) {
    error.value = e.message
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
  flex-wrap: wrap;
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
  gap: 12px;
}

/* 模式切换按钮组 */
.mode-toggle {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  font-size: 12px;
}

.mode-btn {
  border: none;
  background: transparent;
  color: var(--text-color-2);
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  font-family: inherit;
}

.mode-btn:hover {
  color: var(--text-color);
  background: var(--code-color);
}

.mode-btn.active {
  background: #1890ff;
  color: #fff;
}

.mode-arrow {
  color: var(--text-color-3);
  font-size: 11px;
  padding: 0 2px;
}
</style>