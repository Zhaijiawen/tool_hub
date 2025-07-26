<template>
  <div v-if="shouldShow" class="tutorial-and-docs">
    <n-card class="docs-card">
      <n-tabs type="line" animated>
                    <!-- 技术背景 Tab -->
                    <n-tab-pane name="background" :tab="t('tutorial.technicalBackground')">
                      <div class="tab-content">
                        <div v-html="backgroundContent" class="markdown-content"></div>
                      </div>
                    </n-tab-pane>
            
                    <!-- 教程 Tab -->
                    <n-tab-pane name="tutorial" :tab="t('tutorial.usageTutorial')">
                      <div class="tab-content">
                        <div v-html="tutorialContent" class="markdown-content"></div>
                      </div>
                    </n-tab-pane>
            
                    <!-- 示例代码 Tab -->
                    <n-tab-pane name="examples" :tab="t('tutorial.codeExamples')">
                      <div class="tab-content">
                        <div v-html="examplesContent" class="markdown-content"></div>
                      </div>
                    </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 配置 marked 的渲染器
const renderer = new marked.Renderer()
renderer.code = function(code, language) {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
  const highlighted = hljs.highlight(code, { language: validLanguage }).value
  return `<pre><code class="hljs ${validLanguage}">${highlighted}</code></pre>`
}

// 移除 import.meta.glob，使用 fetch 方式

const props = defineProps({
  toolKey: {
    type: String,
    required: true
  }
})

const route = useRoute()
const { locale, t } = useI18n()

// 配置marked以支持代码高亮
marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true
})

// 控制显示逻辑
const shouldShow = computed(() => {
  const excludedPaths = ['/composer', '/about', '/privacy', '/terms']
  return !excludedPaths.includes(route.path)
})

// 当前工具键
const currentToolKey = computed(() => {
  return props.toolKey
})

// 动态导入Markdown内容
const backgroundContent = ref('')
const tutorialContent = ref('')
const examplesContent = ref('')

// 加载Markdown内容的函数
const loadMarkdownContent = async (type) => {
  try {
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    const fileName = `${currentToolKey.value}_${type}_${lang}.md`
        
    // 使用 fetch 加载 Markdown 文件
    const response = await fetch(`/src/locales/md/${fileName}`)
    
    // 检查响应的 Content-Type，如果是 HTML 说明文件不存在
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      console.log(`File ${fileName} not found (returned HTML), using empty template`)
      // 加载空白模板
      const emptyFileName = lang === 'zh' ? 'empty_zh.md' : 'empty_en.md'
      const emptyResponse = await fetch(`/src/locales/md/${emptyFileName}`)
      if (emptyResponse.ok) {
        const emptyText = await emptyResponse.text()
        return marked(emptyText)
      }
      return null
    }
    
    if (!response.ok) {
      console.log(`No ${type} content found for ${currentToolKey.value}, using empty template`)
      // 加载空白模板
      const emptyFileName = lang === 'zh' ? 'empty_zh.md' : 'empty_en.md'
      const emptyResponse = await fetch(`/src/locales/md/${emptyFileName}`)
      if (emptyResponse.ok) {
        const emptyText = await emptyResponse.text()
        return marked(emptyText)
      }
      return null
    }
    
    const markdownText = await response.text()
    
    // 简单检查内容是否为空或无效
    if (!markdownText || markdownText.trim().length === 0) {
      console.log(`File ${fileName} is empty, using empty template`)
      const emptyFileName = lang === 'zh' ? 'empty_zh.md' : 'empty_en.md'
      const emptyResponse = await fetch(`/src/locales/md/${emptyFileName}`)
      if (emptyResponse.ok) {
        const emptyText = await emptyResponse.text()
        return marked(emptyText)
      }
      return null
    }
    
    return marked(markdownText)
  } catch (error) {
    console.error(`Error loading markdown for ${currentToolKey.value}:`, error)
    return null
  }
}

// 监听工具键和语言变化，重新加载内容
watch([currentToolKey, locale], async () => {
  // 并行加载所有内容
  const [background, tutorial, examples] = await Promise.all([
    loadMarkdownContent('background'),
    loadMarkdownContent('tutorial'),
    loadMarkdownContent('examples')
  ])
  
  backgroundContent.value = background || ''
  tutorialContent.value = tutorial || ''
  examplesContent.value = examples || ''
}, { immediate: true })
</script>

<style scoped>
.tutorial-and-docs {
  margin-top: 32px;
  margin-bottom: 32px;
}

.docs-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
}

.tab-content {
  min-height: 300px;
  max-height: 600px;
  padding: 16px 0;
  overflow-y: auto;
}

.markdown-content {
  line-height: 1.6;
  color: var(--text-color);
}

.markdown-content :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-color);
}

.markdown-content :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: var(--text-color);
}

.markdown-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  color: var(--text-color);
}

.markdown-content :deep(h4) {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: var(--text-color);
}

.markdown-content :deep(p) {
  margin: 0 0 12px 0;
  color: var(--text-color-2);
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
  color: var(--text-color-2);
}

.markdown-content :deep(li) {
  margin: 4px 0;
}

.markdown-content :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 16px;
  border-left: 4px solid var(--primary-color);
  background: var(--code-color);
  border-radius: 4px;
  color: var(--text-color-2);
}

.markdown-content :deep(code) {
  background: var(--code-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: var(--text-color);
}

.markdown-content :deep(pre) {
  background: var(--code-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* highlight.js 样式覆盖 */
.markdown-content :deep(.hljs) {
  background: var(--code-color) !important;
  color: var(--text-color) !important;
}

.markdown-content :deep(.hljs-keyword) {
  color: #d73a49 !important;
}

.markdown-content :deep(.hljs-string) {
  color: #032f62 !important;
}

.markdown-content :deep(.hljs-number) {
  color: #005cc5 !important;
}

.markdown-content :deep(.hljs-literal) {
  color: #005cc5 !important;
}

.markdown-content :deep(.hljs-punctuation) {
  color: #24292e !important;
}

.markdown-content :deep(.hljs-property) {
  color: #005cc5 !important;
}

.markdown-content :deep(.hljs-comment) {
  color: #6a737d !important;
  font-style: italic;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--code-color);
  font-weight: 600;
  color: var(--text-color);
}

.markdown-content :deep(td) {
  color: var(--text-color-2);
}

.markdown-content :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: var(--text-color);
}

.markdown-content :deep(em) {
  font-style: italic;
  color: var(--text-color-2);
}

.empty-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tutorial-and-docs {
    margin-top: 24px;
    margin-bottom: 24px;
  }
  
  .tab-content {
    min-height: 250px;
    max-height: 400px;
    padding: 12px 0;
  }
  
  .markdown-content :deep(pre) {
    padding: 12px;
    font-size: 13px;
  }
}
</style> 