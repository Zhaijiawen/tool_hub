<template>
  <!-- 带行号的代码编辑器组件 -->
  <div class="code-editor">
    <!-- 编辑器容器 -->
    <div class="editor-container">
      <!-- 行号区域 -->
      <div class="line-numbers">
        <div 
          v-for="(line, index) in lineNumbers" 
          :key="index" 
          class="line-number"
        >
          <span class="line-num">{{ index + 1 }}</span>
        </div>
      </div>
      <!-- 代码输入区域 -->
      <div class="code-area">
        <div
          ref="editorRef"
          class="code-input"
          contenteditable="true"
          :data-placeholder="placeholder"
          @input="handleInput"
          @paste="handlePaste"
          @keydown="handleKeydown"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { computed, defineProps, defineEmits, ref, watch, nextTick, onMounted } from 'vue'
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
  language: {
    type: String,
    default: 'javascript'
  }
})

// 定义组件事件
const emit = defineEmits(['update:modelValue'])

// 编辑器引用
const editorRef = ref(null)

// 计算行号
const lineNumbers = computed(() => {
  const lines = props.modelValue.split('\n')
  return lines.length > 0 ? lines : ['']
})

// 处理输入事件
const handleInput = (event) => {
  const text = event.target.innerText || ''
  emit('update:modelValue', text)
}

// 处理粘贴事件
const handlePaste = (event) => {
  event.preventDefault()
  const text = (event.clipboardData || window.clipboardData).getData('text')
  document.execCommand('insertText', false, text)
}

// 处理键盘事件
const handleKeydown = (event) => {
  // Tab键处理
  if (event.key === 'Tab') {
    event.preventDefault()
    document.execCommand('insertText', false, '  ')
  }
}

// 应用语法高亮
const applyHighlight = () => {
  if (!editorRef.value) return
  
  const text = props.modelValue
  if (!text.trim()) {
    editorRef.value.innerHTML = ''
    return
  }
  
  try {
    const highlighted = hljs.highlight(text, { language: props.language }).value
    editorRef.value.innerHTML = highlighted
    
    // 恢复光标位置到末尾
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(editorRef.value)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  } catch (error) {
    // 如果高亮失败，显示原始文本
    editorRef.value.innerText = text
  }
}

// 监听内容变化
watch(() => props.modelValue, async (newValue) => {
  if (!editorRef.value) return
  
  // 如果编辑器内容与props不同步，更新编辑器
  const currentText = editorRef.value.innerText || ''
  if (currentText !== newValue) {
    await nextTick()
    applyHighlight()
  }
}, { immediate: true })

// 监听语言变化
watch(() => props.language, async () => {
  await nextTick()
  applyHighlight()
})

// 组件挂载后初始化
onMounted(() => {
  if (props.modelValue) {
    applyHighlight()
  }
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

.line-num {
  margin-left: 14px;
}

/* 代码区域 */
.code-area {
  flex: 1;
  overflow: auto;
}

/* 代码输入区域 */
.code-input {
  min-height: 200px;
  padding: 8px 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  border: none;
  background: transparent;
  color: var(--n-text-color);
  white-space: pre;
  overflow-wrap: break-word;
}

.code-input:empty:before {
  content: attr(data-placeholder);
  color: var(--n-text-color-disabled);
  pointer-events: none;
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
</style> 