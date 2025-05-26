<template>
  <!-- 带行号的代码编辑器组件 -->
  <div class="code-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <n-checkbox v-model:checked="enableHighlight">
        {{ t('common.enableHighlight') }}
      </n-checkbox>
      <n-select
        v-if="enableHighlight"
        v-model:value="language"
        :options="languageOptions"
        size="small"
        class="language-select"
      />
    </div>
    <!-- 编辑器容器 -->
    <div class="editor-container">
      <!-- 行号区域 -->
      <div class="line-numbers">
        <div 
          v-for="(line, index) in lineNumbers" 
          :key="index" 
          class="line-number"
          :class="{ 'collapsed': collapsedLines.has(index) }"
        >
          <!-- 折叠按钮 -->
          <span 
            v-if="canFold(index)"
            class="fold-button"
            @click="toggleFold(index)"
          >
            {{ collapsedLines.has(index) ? '▶' : '▼' }}
          </span>
          <span class="line-num">{{ index + 1 }}</span>
        </div>
      </div>
      <!-- 代码输入区域 -->
      <n-input
        v-if="!enableHighlight"
        :value="modelValue"
        @update:value="handleInput"
        type="textarea"
        :placeholder="placeholder"
        :autosize="{ minRows: 10, maxRows: 20 }"
        class="code-textarea"
      />
      <pre v-else class="highlight-container"><code :class="language" ref="highlightCode">{{ displayCode }}</code></pre>
    </div>
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { computed, defineProps, defineEmits, ref, watch, nextTick } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入highlight.js
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 初始化国际化
const { t } = useI18n()

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  defaultLanguage: {
    type: String,
    default: 'javascript'
  }
})

// 定义组件事件
const emit = defineEmits(['update:modelValue'])

// 高亮相关状态
const enableHighlight = ref(false)
const language = ref(props.defaultLanguage)
const highlightCode = ref(null)

// 折叠相关状态
const collapsedLines = ref(new Set())

// 支持的语言选项
const languageOptions = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Shell', value: 'bash' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'XML', value: 'xml' }
]

// 支持折叠的语言
const foldableLanguages = ['javascript', 'json', 'html', 'css', 'java', 'python']

// 计算行号
const lineNumbers = computed(() => {
  const lines = props.modelValue.split('\n')
  return lines.length > 0 ? lines : ['']
})

// 计算显示的代码（考虑折叠）
const displayCode = computed(() => {
  if (!enableHighlight.value || collapsedLines.value.size === 0) {
    return props.modelValue
  }
  
  const lines = props.modelValue.split('\n')
  const result = []
  
  for (let i = 0; i < lines.length; i++) {
    if (!collapsedLines.value.has(i)) {
      result.push(lines[i])
    } else {
      // 显示折叠提示
      result.push('  // ... 已折叠 ...')
      // 跳过折叠的内容
      const endIndex = findFoldEnd(i, lines)
      i = endIndex
    }
  }
  
  return result.join('\n')
})

/**
 * 处理输入事件
 * @param {string} value - 输入的值
 */
const handleInput = (value) => {
  emit('update:modelValue', value)
}

/**
 * 判断某行是否可以折叠
 * @param {number} lineIndex - 行索引
 */
const canFold = (lineIndex) => {
  // 只有在启用高亮且支持折叠的语言时才显示折叠按钮
  if (!enableHighlight.value || !foldableLanguages.includes(language.value)) {
    return false
  }
  
  const lines = props.modelValue.split('\n')
  const line = lines[lineIndex]
  
  if (!line || line.trim() === '') {
    return false
  }
  
  // JSON 折叠逻辑
  if (language.value === 'json') {
    return line.includes('{') || line.includes('[')
  }
  
  // JavaScript 折叠逻辑
  if (language.value === 'javascript') {
    return line.includes('{') || line.includes('function') || line.includes('class')
  }
  
  // HTML 折叠逻辑
  if (language.value === 'html') {
    return line.includes('<') && !line.includes('</') && !line.includes('/>')
  }
  
  // CSS 折叠逻辑
  if (language.value === 'css') {
    return line.includes('{')
  }
  
  return false
}

/**
 * 查找折叠结束位置
 * @param {number} startIndex - 开始索引
 * @param {Array} lines - 代码行数组
 */
const findFoldEnd = (startIndex, lines) => {
  const startLine = lines[startIndex]
  let depth = 0
  
  if (language.value === 'json') {
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i]
      depth += (line.match(/[{\[]/g) || []).length
      depth -= (line.match(/[}\]]/g) || []).length
      if (depth === 0 && i > startIndex) {
        return i
      }
    }
  }
  
  // 其他语言的折叠逻辑
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]
    depth += (line.match(/{/g) || []).length
    depth -= (line.match(/}/g) || []).length
    if (depth === 0 && i > startIndex) {
      return i
    }
  }
  
  return lines.length - 1
}

/**
 * 切换折叠状态
 * @param {number} lineIndex - 行索引
 */
const toggleFold = (lineIndex) => {
  const newCollapsed = new Set(collapsedLines.value)
  
  if (newCollapsed.has(lineIndex)) {
    newCollapsed.delete(lineIndex)
  } else {
    newCollapsed.add(lineIndex)
  }
  
  collapsedLines.value = newCollapsed
}

// 监听代码变化，更新高亮
watch(() => props.modelValue, async () => {
  if (enableHighlight.value && highlightCode.value) {
    await nextTick()
    hljs.highlightElement(highlightCode.value)
  }
})

// 监听语言变化，更新高亮和重置折叠
watch(language, async () => {
  collapsedLines.value = new Set() // 重置折叠状态
  if (enableHighlight.value && highlightCode.value) {
    await nextTick()
    hljs.highlightElement(highlightCode.value)
  }
})

// 监听高亮状态变化
watch(enableHighlight, () => {
  collapsedLines.value = new Set() // 重置折叠状态
})
</script>

<style scoped>
/* 代码编辑器容器 */
.code-editor {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--n-color);
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid var(--n-border-color);
  background-color: var(--n-color-modal);
}

.language-select {
  margin-left: 8px;
  width: 120px;
}

/* 编辑器容器 */
.editor-container {
  display: flex;
  flex: 1;
  overflow: auto;
}

/* 行号区域 */
.line-numbers {
  background-color: var(--n-color-modal);
  border-right: 1px solid var(--n-border-color);
  padding: 8px 4px 8px 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--n-text-color-disabled);
  user-select: none;
  min-width: 40px;
  text-align: right;
}

.line-number {
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.line-number.collapsed {
  opacity: 0.6;
}

.fold-button {
  position: absolute;
  left: -2px;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  cursor: pointer;
  color: var(--n-text-color-disabled);
  transition: color 0.2s;
}

.fold-button:hover {
  color: var(--n-text-color);
}

.line-num {
  margin-left: 14px;
}

/* 代码文本框 */
.code-textarea {
  flex: 1;
}

.code-textarea :deep(.n-input__textarea-el) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  padding: 8px 12px;
  background-color: transparent;
}

.code-textarea :deep(.n-input__border),
.code-textarea :deep(.n-input__state-border) {
  display: none;
}

/* 高亮容器 */
.highlight-container {
  flex: 1;
  margin: 0;
  padding: 8px 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  background-color: transparent;
}

/* 深色主题适配 */
.dark .code-editor {
  border-color: #3f3f46;
}

.dark .line-numbers {
  background-color: #1f1f23;
  border-right-color: #3f3f46;
  color: #6b7280;
}

.dark .toolbar {
  background-color: #1f1f23;
  border-bottom-color: #3f3f46;
}

.dark .fold-button {
  color: #6b7280;
}

.dark .fold-button:hover {
  color: #d1d5db;
}
</style> 