<template>
  <div v-if="shouldShow" class="tutorial-and-docs" ref="tutorialRef">

    <!-- 静态 SEO 内容：供搜索引擎爬虫读取，对用户不可见 -->
    <div v-if="seoDesc" class="seo-content" aria-hidden="true">
      <div v-if="seoDesc.features && seoDesc.features.length">
        <h3>{{ t('tutorial.seo.features') }}</h3>
        <ul>
          <li v-for="item in seoDesc.features" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div v-if="seoDesc.useCases && seoDesc.useCases.length">
        <h3>{{ t('tutorial.seo.useCases') }}</h3>
        <ul>
          <li v-for="item in seoDesc.useCases" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div v-if="seoDesc.usageSteps && seoDesc.usageSteps.length">
        <h3>{{ t('tutorial.seo.usageSteps') }}</h3>
        <ol>
          <li v-for="item in seoDesc.usageSteps" :key="item">{{ item }}</li>
        </ol>
      </div>
      <div v-if="seoDesc.bestPractices && seoDesc.bestPractices.length">
        <h3>{{ t('tutorial.seo.bestPractices') }}</h3>
        <ul>
          <li v-for="item in seoDesc.bestPractices" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <n-card class="docs-card">
      <!-- 未加载状态 -->
      <div v-if="!isLoaded" class="loading-state">
        <div class="loading-content">
          <n-icon size="48" color="#1890ff" class="loading-icon">
            <BookIcon />
          </n-icon>
          <p class="loading-text">{{ t('tutorial.autoLoading') }}</p>
        </div>
      </div>
      
      <!-- 已加载状态 -->
      <div v-else>
        <n-tabs type="line" animated v-model:value="activeTab" @update:value="handleTabChange">
          <!-- 技术背景 Tab -->
          <n-tab-pane name="background" :tab="t('tutorial.technicalBackground')">
            <div class="tab-content">
              <div v-if="backgroundContent && !tabLoadingStates.background" v-html="backgroundContent" class="markdown-content"></div>
              <div v-else class="empty-content">
                <n-spin size="medium" />
                <span class="loading-text">{{ t('tutorial.loading') }}</span>
              </div>
            </div>
          </n-tab-pane>
          
          <!-- 教程 Tab -->
          <n-tab-pane name="tutorial" :tab="t('tutorial.usageTutorial')">
            <div class="tab-content">
              <div v-if="tutorialContent && !tabLoadingStates.tutorial" v-html="tutorialContent" class="markdown-content"></div>
              <div v-else class="empty-content">
                <n-spin size="medium" />
                <span class="loading-text">{{ t('tutorial.loading') }}</span>
              </div>
            </div>
          </n-tab-pane>
          
          <!-- 示例代码 Tab -->
          <n-tab-pane name="examples" :tab="t('tutorial.codeExamples')">
            <div class="tab-content">
              <div v-if="examplesContent && !tabLoadingStates.examples" v-html="examplesContent" class="markdown-content"></div>
              <div v-else class="empty-content">
                <n-spin size="medium" />
                <span class="loading-text">{{ t('tutorial.loading') }}</span>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import { getToolDescription } from '@/locales/toolDescriptions'

// highlight.js 延迟加载（仅在内容渲染时才导入，避免打入首屏包）
let hljs = null
const loadHljs = async () => {
  if (hljs) return hljs
  // 动态导入 highlight.js 核心 + 常用语言（按需注册，减少体积）
  const [hljsCore, langJs, langTs, langJson, langXml, langSql, langPython,
    langJava, langShell, langCss, langMarkdown, langYaml] = await Promise.all([
    import('highlight.js/lib/core'),
    import('highlight.js/lib/languages/javascript'),
    import('highlight.js/lib/languages/typescript'),
    import('highlight.js/lib/languages/json'),
    import('highlight.js/lib/languages/xml'),
    import('highlight.js/lib/languages/sql'),
    import('highlight.js/lib/languages/python'),
    import('highlight.js/lib/languages/java'),
    import('highlight.js/lib/languages/shell'),
    import('highlight.js/lib/languages/css'),
    import('highlight.js/lib/languages/markdown'),
    import('highlight.js/lib/languages/yaml')
  ])
  const instance = hljsCore.default
  instance.registerLanguage('javascript', langJs.default)
  instance.registerLanguage('js', langJs.default)
  instance.registerLanguage('typescript', langTs.default)
  instance.registerLanguage('ts', langTs.default)
  instance.registerLanguage('json', langJson.default)
  instance.registerLanguage('xml', langXml.default)
  instance.registerLanguage('html', langXml.default)
  instance.registerLanguage('sql', langSql.default)
  instance.registerLanguage('python', langPython.default)
  instance.registerLanguage('java', langJava.default)
  instance.registerLanguage('shell', langShell.default)
  instance.registerLanguage('bash', langShell.default)
  instance.registerLanguage('css', langCss.default)
  instance.registerLanguage('markdown', langMarkdown.default)
  instance.registerLanguage('yaml', langYaml.default)
  hljs = instance

  // 动态注入 highlight.js 的 CSS 样式（只注入一次）
  if (!document.getElementById('hljs-theme-css')) {
    await import('highlight.js/styles/github.css')
  }

  return hljs
}

// 动态配置 marked 渲染器（在首次渲染内容时初始化）
let markedConfigured = false
const ensureMarkedConfig = async () => {
  if (markedConfigured) return
  const hljsInstance = await loadHljs()
  const renderer = new marked.Renderer()
    renderer.code = function(code, language) {
      // 仅对已注册的语言做高亮，未知语言直接 HTML 转义输出，避免 "language not found" 警告
      const escapeHtml = (str) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
      if (language && hljsInstance.getLanguage(language)) {
        try {
          const highlighted = hljsInstance.highlight(code, { language }).value
          return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
        } catch {
          // ignore
        }
      }
      return `<pre><code class="hljs">${escapeHtml(code)}</code></pre>`
    }
  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true
  })
  markedConfigured = true
}

const props = defineProps({
  toolKey: {
    type: String,
    required: true
  }
})

const route = useRoute()
const { locale, t } = useI18n()

// 懒加载相关状态
const tutorialRef = ref(null)
const isLoaded = ref(false)
const isLoading = ref(false)
const activeTab = ref('background')
const observer = ref(null)

// 各页签的加载状态
const tabLoadingStates = ref({
  background: false,
  tutorial: false,
  examples: false
})

// 各页签的内容缓存
const tabContentCache = ref({
  background: null,
  tutorial: null,
  examples: null
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

// 静态 SEO 描述数据（供爬虫读取，直接从 toolDescriptions 同步获取，不依赖懒加载）
const seoDesc = computed(() => {
  return getToolDescription(currentToolKey.value, locale.value)
})

// 动态导入Markdown内容
const backgroundContent = ref('')
const tutorialContent = ref('')
const examplesContent = ref('')

// 加载Markdown内容的函数
const loadMarkdownContent = async (type) => {
  try {
    // 确保 hljs 和 marked 已配置（首次调用时动态加载）
    await ensureMarkedConfig()

    const lang = locale.value === 'zh' ? 'zh' : 'en'
    const fileName = `${currentToolKey.value}_${type}_${lang}.md`
        
    // 使用 fetch 加载 Markdown 文件
    const response = await fetch(`/docs/${fileName}`)
    
    // 检查响应的 Content-Type，如果是 HTML 说明文件不存在
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      // 加载空白模板
      const emptyFileName = lang === 'zh' ? 'empty_zh.md' : 'empty_en.md'
      const emptyResponse = await fetch(`/docs/${emptyFileName}`)
      if (emptyResponse.ok) {
        const emptyText = await emptyResponse.text()
        return marked(emptyText)
      }
      return null
    }
    
    if (!response.ok) {
      // 加载空白模板
      const emptyFileName = lang === 'zh' ? 'empty_zh.md' : 'empty_en.md'
      const emptyResponse = await fetch(`/docs/${emptyFileName}`)
      if (emptyResponse.ok) {
        const emptyText = await emptyResponse.text()
        return marked(emptyText)
      }
      return null
    }
    
    const markdownText = await response.text()
    
    // 简单检查内容是否为空或无效
    if (!markdownText || markdownText.trim().length === 0) {
      const emptyFileName = lang === 'zh' ? 'empty_zh.md' : 'empty_en.md'
      const emptyResponse = await fetch(`/docs/${emptyFileName}`)
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

// 加载指定页签的内容
const loadTabContent = async (tabName) => {
  // 如果已经加载过，直接返回
  if (tabContentCache.value[tabName]) {
    return tabContentCache.value[tabName]
  }
  
  // 如果正在加载，等待加载完成
  if (tabLoadingStates.value[tabName]) {
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (tabContentCache.value[tabName]) {
          resolve(tabContentCache.value[tabName])
        } else if (!tabLoadingStates.value[tabName]) {
          resolve(null)
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
    })
  }
  
  // 开始加载
  tabLoadingStates.value[tabName] = true
  try {
    const content = await loadMarkdownContent(tabName)
    
    // 缓存内容
    tabContentCache.value[tabName] = content
    
    // 更新对应的响应式变量
    if (tabName === 'background') {
      backgroundContent.value = content || ''
    } else if (tabName === 'tutorial') {
      tutorialContent.value = content || ''
    } else if (tabName === 'examples') {
      examplesContent.value = content || ''
    }
    
    return content
  } catch (error) {
    console.error(`Error loading ${tabName} content:`, error)
    return null
  } finally {
    tabLoadingStates.value[tabName] = false
  }
}

// 页签切换处理
const handleTabChange = async (tabName) => {
  activeTab.value = tabName
  
  // 如果该页签内容未加载，则加载
  if (!tabContentCache.value[tabName]) {
    await loadTabContent(tabName)
  }
}

// 初始化加载（当组件进入视口时）
const initializeContent = async () => {
  if (isLoaded.value) return
  
  isLoaded.value = true
  // 只加载当前激活的页签
  await loadTabContent(activeTab.value)
}

// 设置 Intersection Observer
const setupIntersectionObserver = () => {
  if (!tutorialRef.value) return
  
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isLoaded.value) {
        initializeContent()
      }
    })
  }, {
    threshold: 0.1, // 当10%的内容可见时触发
    rootMargin: '100px' // 提前100px触发，让用户感觉更流畅
  })
  
  observer.value.observe(tutorialRef.value)
}

// 监听工具键和语言变化，重置状态
watch([currentToolKey, locale], (newVal, oldVal) => {
  // 重置状态
  isLoaded.value = false
  isLoading.value = false
  activeTab.value = 'background'
  
  // 重置各页签状态
  tabLoadingStates.value = {
    background: false,
    tutorial: false,
    examples: false
  }
  
  // 清空内容缓存
  tabContentCache.value = {
    background: null,
    tutorial: null,
    examples: null
  }
  
  // 清空显示内容
  backgroundContent.value = ''
  tutorialContent.value = ''
  examplesContent.value = ''

  // 如果是语言切换（非首次初始化），且组件当前在视口内，则直接重新加载
  // 避免切换语言后必须刷新才能看到对应语言文档的问题
  if (oldVal !== undefined && tutorialRef.value) {
    nextTick(() => {
      const rect = tutorialRef.value?.getBoundingClientRect()
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        initializeContent()
      }
    })
  }
}, { immediate: true })

// 组件挂载时设置观察器
onMounted(() => {
  setupIntersectionObserver()
})

// 组件卸载时清理观察器
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<style scoped>
/* 静态 SEO 内容：对用户绝对隐藏，但 DOM 中存在供搜索引擎爬虫读取 */
.seo-content {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  pointer-events: none;
}

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

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

/* 懒加载状态样式 */
.loading-state {
  padding: 60px 20px;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  opacity: 0.7;
  animation: pulse 2s infinite;
}

.loading-text {
  font-size: 14px;
  color: var(--text-color-2);
  margin: 0;
}

/* 页签加载状态指示器 */
.tab-loading-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

/* 空内容状态样式 */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 12px;
  color: var(--text-color-2);
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
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