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

// 语言支持
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import { python } from '@codemirror/lang-python'
import { xml } from '@codemirror/lang-xml'
import { sql } from '@codemirror/lang-sql'
import { markdown } from '@codemirror/lang-markdown'
import { rust } from '@codemirror/lang-rust'
import { php } from '@codemirror/lang-php'
import { vue } from '@codemirror/lang-vue'

// Legacy modes 支持
import { StreamLanguage } from '@codemirror/language'
import { go } from '@codemirror/legacy-modes/mode/go'
import { csharp, kotlin, scala, dart } from '@codemirror/legacy-modes/mode/clike'
import { swift } from '@codemirror/legacy-modes/mode/swift'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import { lua } from '@codemirror/legacy-modes/mode/lua'
import { perl } from '@codemirror/legacy-modes/mode/perl'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'

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

// 语言映射
const languageMap = {
  java: java(),
  javascript: javascript(),
  html: html(),
  css: css(),
  json: json(),
  python: python(),
  js: javascript(),
  ts: javascript(), // TypeScript 使用 JavaScript 高亮
  typescript: javascript({ typescript: true }), // TypeScript 完整支持
  xml: xml(),
  sql: sql(),
  yaml: StreamLanguage.define(yaml),
  markdown: markdown(),
  shell: StreamLanguage.define(shell),
  bash: StreamLanguage.define(shell), // Bash 使用 shell 高亮
  rust: rust(),
  php: php(),
  // 使用 legacy-modes 的语言支持
  go: StreamLanguage.define(go),
  csharp: StreamLanguage.define(csharp),
  swift: StreamLanguage.define(swift),
  kotlin: StreamLanguage.define(kotlin),
  scala: StreamLanguage.define(scala),
  ruby: StreamLanguage.define(ruby),
  dart: StreamLanguage.define(dart),
  lua: StreamLanguage.define(lua),
  perl: StreamLanguage.define(perl),
  vue: vue(), // Vue 官方语言支持
}

// 获取当前主题
const isDark = ref(document.documentElement.classList.contains('dark'))

// 创建编辑器扩展
const createExtensions = () => {
  const extensions = [
    basicSetup,
    languageMap[props.language] || javascript(),
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
        fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace"
      },
      '.cm-content': {
        padding: '8px 12px',
        minHeight: '100%'
      },
      '.cm-focused': {
        outline: 'none'
      },
      '.cm-editor': {
        height: '100%'
      },
      '.cm-scroller': {
        overflow: 'auto'
      }
    })
  ]

  // 根据主题添加暗色主题
  if (isDark.value) {
    extensions.push(oneDark)
  }

  return extensions
}

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return

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
const updateEditorLanguage = () => {
  if (!editorView) return

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
}

/* 折叠按钮样式 */
.code-editor :deep(.cm-foldGutter) {
  width: 16px;
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
</style> 