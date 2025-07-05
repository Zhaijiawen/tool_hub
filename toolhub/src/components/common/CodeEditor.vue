<template>
  <!-- CodeMirror 6 代码编辑器组件 -->
  <div class="code-editor">
    <div ref="editorRef" class="codemirror-container"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

// CodeMirror 6 核心
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

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
let editorView = null

// 动态语言加载器
const loadLanguage = async (lang) => {
  switch (lang) {
    case 'java':
      const { java } = await import('@codemirror/lang-java')
      return java()
    case 'javascript':
    case 'js':
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    case 'html':
      const { html } = await import('@codemirror/lang-html')
      return html()
    case 'css':
      const { css } = await import('@codemirror/lang-css')
      return css()
    case 'json':
      const { json } = await import('@codemirror/lang-json')
      return json()
    case 'xml':
      const { xml } = await import('@codemirror/lang-xml')
      return xml()
    case 'sql':
      const { sql } = await import('@codemirror/lang-sql')
      return sql()
    case 'markdown':
      const { markdown } = await import('@codemirror/lang-markdown')
      return markdown()
    case 'php':
      const { php } = await import('@codemirror/lang-php')
      return php()
    case 'vue':
      const { vue } = await import('@codemirror/lang-vue')
      return vue()
    case 'yaml':
      const [{ StreamLanguage }, { yaml }] = await Promise.all([
        import('@codemirror/language'),
        import('@codemirror/legacy-modes/mode/yaml')
      ])
      return StreamLanguage.define(yaml)
    case 'shell':
      const [{ StreamLanguage: SL1 }, { shell }] = await Promise.all([
        import('@codemirror/language'),
        import('@codemirror/legacy-modes/mode/shell')
      ])
      return SL1.define(shell)
    case 'ruby':
      const [{ StreamLanguage: SL2 }, { ruby }] = await Promise.all([
        import('@codemirror/language'),
        import('@codemirror/legacy-modes/mode/ruby')
      ])
      return SL2.define(ruby)
    default:
      const { javascript: defaultLang } = await import('@codemirror/lang-javascript')
      return defaultLang()
  }
}

// 当前加载的语言扩展
let currentLanguageExtension = null

// 获取当前主题
const isDark = ref(document.documentElement.classList.contains('dark'))

// 创建编辑器扩展
const createExtensions = () => {
  const extensions = [
    basicSetup,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString()
        if (newValue !== props.modelValue) {
          emit('update:modelValue', newValue)
        }
      }
    }),
    EditorView.theme({
      '&': {
        height: 'calc(100vh - 300px)',
        fontSize: '14px',
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace"
      },
      '.cm-content': {
        padding: '8px 12px',
        minHeight: '100%',
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace"
      },
      '.cm-focused': {
        outline: 'none'
      },
      '.cm-editor': {
        height: '100%'
      },
      '.cm-scroller': {
        overflow: 'auto'
      },
      // 折叠图标样式 - 实心三角形
      '.cm-foldGutter .cm-gutterElement': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      },
      '.cm-foldGutter .cm-gutterElement::before': {
        content: '""',
        width: '0',
        height: '0',
        border: '4px solid transparent',
        borderLeftColor: isDark.value ? '#9ca3af' : '#6b7280',
        borderRightWidth: '0',
        transition: 'transform 0.1s ease'
      },
      '.cm-foldGutter .cm-gutterElement.cm-foldGutter-open::before': {
        transform: 'rotate(90deg)',
        borderTopColor: isDark.value ? '#9ca3af' : '#6b7280',
        borderLeftColor: 'transparent'
      },
      // 行号样式优化
      '.cm-lineNumbers .cm-gutterElement': {
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace",
        fontSize: '13px',
        lineHeight: '1.4'
      },
      // 选择区域样式
      '.cm-selectionBackground': {
        backgroundColor: isDark.value ? '#264f78' : '#d3d3d3'
      },
      // 当前行高亮
      '.cm-activeLine': {
        backgroundColor: isDark.value ? '#2a2d3a' : '#f5f5f5'
      },
      // 匹配括号高亮
      '.cm-matchingBracket': {
        backgroundColor: isDark.value ? '#515a6b' : '#e6e6e6',
        outline: '1px solid ' + (isDark.value ? '#747bff' : '#007acc')
      }
    })
  ]

  // 添加当前语言扩展（如果已加载）
  if (currentLanguageExtension) {
    extensions.push(currentLanguageExtension)
  }

  // 根据主题添加暗色主题
  if (isDark.value) {
    extensions.push(oneDark)
  }

  return extensions
}

// 初始化编辑器
const initEditor = async () => {
  if (!editorRef.value) return

  // 加载当前语言扩展
  currentLanguageExtension = await loadLanguage(props.language)

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: createExtensions()
  })

  editorView = new EditorView({
    state,
    parent: editorRef.value
  })
}

// 更新编辑器内容
const updateEditorContent = (newValue) => {
  if (!editorView) return

  const currentValue = editorView.state.doc.toString()
  if (currentValue !== newValue) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: currentValue.length,
        insert: newValue
      }
    })
  }
}

// 更新编辑器语言
const updateEditorLanguage = async () => {
  if (!editorView) return

  // 加载新语言扩展
  currentLanguageExtension = await loadLanguage(props.language)

  const newExtensions = createExtensions()
  editorView.dispatch({
    effects: EditorState.reconfigure.of(newExtensions)
  })
}

// 监听主题变化
const observeThemeChange = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const newIsDark = document.documentElement.classList.contains('dark')
        if (newIsDark !== isDark.value) {
          isDark.value = newIsDark
          updateEditorLanguage() // 重新配置编辑器以应用新主题
        }
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return observer
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  updateEditorContent(newValue)
})

// 监听语言变化
watch(() => props.language, () => {
  updateEditorLanguage()
})

// 组件挂载
onMounted(async () => {
  await nextTick()
  initEditor()

  // 开始监听主题变化
  const themeObserver = observeThemeChange()

  // 在组件卸载时清理观察器
  onBeforeUnmount(() => {
    themeObserver.disconnect()
  })
})

// 组件卸载
onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
})
</script>

<style scoped>
/* 代码编辑器容器 */
.code-editor {
  position: relative;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--n-color);
  height: calc(100vh - 300px);
}

.codemirror-container {
  height: 100%;
  width: 100%;
}

/* 深色主题适配 */
.dark .code-editor {
  border-color: #3f3f46;
}

/* CodeMirror 样式覆盖 */
.code-editor :deep(.cm-editor) {
  height: 100%;
}

.code-editor :deep(.cm-content) {
  min-height: 100%;
}

.code-editor :deep(.cm-focused) {
  outline: none;
}

/* 行号样式 */
.code-editor :deep(.cm-lineNumbers) {
  background-color: var(--n-color-modal);
  border-right: 1px solid var(--n-border-color);
  color: var(--n-text-color-disabled);
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
  font-size: 13px;
  font-feature-settings: 'liga' 0; /* 禁用连字符以确保清晰度 */
  font-variant-ligatures: none;
}

/* 折叠按钮样式 */
.code-editor :deep(.cm-foldGutter) {
  width: 16px;
}

/* 自定义折叠图标 */
.code-editor :deep(.cm-foldGutter .cm-gutterElement) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  position: relative !important;
}

.code-editor :deep(.cm-foldGutter .cm-gutterElement::before) {
  content: '' !important;
  width: 0 !important;
  height: 0 !important;
  border: 4px solid transparent !important;
  border-left: 6px solid #6b7280 !important;
  border-right: 0 !important;
  transition: transform 0.15s ease !important;
  position: absolute !important;
}

.code-editor :deep(.cm-foldGutter .cm-gutterElement.cm-foldGutter-open::before) {
  transform: rotate(90deg) !important;
  border-left: 4px solid #6b7280 !important;
  border-top: 6px solid #6b7280 !important;
  border-bottom: 0 !important;
}

/* 深色主题的折叠图标 */
.dark .code-editor :deep(.cm-foldGutter .cm-gutterElement::before) {
  border-left-color: #9ca3af !important;
}

.dark .code-editor :deep(.cm-foldGutter .cm-gutterElement.cm-foldGutter-open::before) {
  border-left-color: #9ca3af !important;
  border-top-color: #9ca3af !important;
}

/* 隐藏默认的折叠图标 */
.code-editor :deep(.cm-foldGutter .cm-gutterElement span) {
  display: none !important;
}

.code-editor :deep(.cm-foldPlaceholder) {
  background-color: var(--n-color-modal);
  border: 1px solid var(--n-border-color);
  color: var(--n-text-color-disabled);
}

/* 深色主题下的 CodeMirror 样式 */
.dark .code-editor :deep(.cm-lineNumbers) {
  background-color: #1f1f23;
  border-right-color: #3f3f46;
  color: #6b7280;
}

.dark .code-editor :deep(.cm-foldPlaceholder) {
  background-color: #1f1f23;
  border-color: #3f3f46;
  color: #6b7280;
}

.dark .code-editor :deep(.cm-editor),
.dark .code-editor :deep(.cm-gutters),
.dark .code-editor :deep(.cm-scroller) {
  background: #181a1b !important;
}

/* 编辑器内容字体优化 */
.code-editor :deep(.cm-content),
.code-editor :deep(.cm-editor) {
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  font-feature-settings: 'liga' 0 !important; /* 禁用连字符 */
  font-variant-ligatures: none !important;
  letter-spacing: 0.02em !important; /* 轻微的字符间距 */
}

/* 语法高亮优化 */
.code-editor :deep(.cm-editor .cm-content) {
  caret-color: #007acc; /* VS Code风格的光标颜色 */
}

/* 选择文本样式 */
.code-editor :deep(.cm-selectionBackground) {
  background-color: rgba(0, 122, 204, 0.2) !important;
}

/* 当前行高亮 */
.code-editor :deep(.cm-activeLine) {
  background-color: rgba(0, 122, 204, 0.05) !important;
}

/* 匹配的括号高亮 */
.code-editor :deep(.cm-matchingBracket) {
  background-color: rgba(0, 122, 204, 0.15) !important;
  outline: 1px solid #007acc !important;
  border-radius: 2px !important;
}

/* 深色主题的编辑器优化 */
.dark .code-editor :deep(.cm-editor .cm-content) {
  caret-color: #569cd6 !important; /* 深色主题下的光标颜色 */
}

.dark .code-editor :deep(.cm-selectionBackground) {
  background-color: rgba(86, 156, 214, 0.25) !important;
}

.dark .code-editor :deep(.cm-activeLine) {
  background-color: rgba(86, 156, 214, 0.08) !important;
}

.dark .code-editor :deep(.cm-matchingBracket) {
  background-color: rgba(86, 156, 214, 0.2) !important;
  outline: 1px solid #569cd6 !important;
  border-radius: 2px !important;
}
</style>