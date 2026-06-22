<template>
  <div class="markdown-preview">
    <!-- 工具简介 -->
    <ToolIntro toolKey="markdown" />


    <n-card :title="t('convert.markdown.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 输入区域 -->
        <div class="input-section">
          <n-text class="section-title">{{ t('convert.markdown.input') }}</n-text>
          <n-input 
            v-model:value="formData.input" 
            :placeholder="t('convert.markdown.inputPlaceholder')" 
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 15 }"
            clearable
            @input="handleInput"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <n-space justify="end">
            <n-button @click="loadExample" type="info">
              {{ t('convert.markdown.loadExample') }}
            </n-button>
          </n-space>
        </div>

        <!-- 预览区域 -->
        <div class="preview-section" v-if="formData.output">
          <n-text class="section-title">{{ t('convert.markdown.preview') }}</n-text>
          <div class="preview-container">
            <div class="preview" v-html="formData.output"></div>
            <div class="preview-actions">
              <n-button @click="copyOutput" size="small" type="primary">
                {{ t('common.copy') }}
              </n-button>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>

        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('convert.markdown.infoTitle')" class="info-alert">
            {{ t('convert.markdown.infoContent') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>

  </div>
  <TutorialAndDocs toolKey="markdown" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  output: ''
})

const error = ref('')

// 处理输入变化
const handleInput = () => {
  error.value = ''
  if (formData.input.trim()) {
    convert()
  } else {
    formData.output = ''
  }
}

// 转换Markdown为HTML
const convert = () => {
  try {
    if (!formData.input.trim()) {
      throw new Error(t('convert.markdown.inputRequired'))
    }

    // 使用marked转换Markdown为HTML
    const html = marked(formData.input, {
      breaks: true, // 支持换行
      gfm: true,    // 支持GitHub风格的Markdown
      sanitize: false // 不使用内置的sanitize，使用DOMPurify
    })
    
    // 使用DOMPurify清理HTML，防止XSS攻击
    formData.output = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'blockquote',
        'code', 'pre',
        'strong', 'em', 'del', 'ins',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target']
    })
    
    error.value = ''
  } catch (err) {
    error.value = err.message
    formData.output = ''
    message.error(t('common.error'))
  }
}

// 加载示例
const loadExample = () => {
  const examples = [
    {
      name: t('convert.markdown.examples.basic'),
      content: `# ${t('convert.markdown.examples.basic')}
## ${t('convert.markdown.examples.heading2')}
### ${t('convert.markdown.examples.heading3')}

${t('convert.markdown.examples.boldItalic')}

- ${t('convert.markdown.examples.listItem1')}
- ${t('convert.markdown.examples.listItem2')}
  - ${t('convert.markdown.examples.nestedItem')}
- ${t('convert.markdown.examples.listItem3')}

1. ${t('convert.markdown.examples.orderedItem1')}
2. ${t('convert.markdown.examples.orderedItem2')}
3. ${t('convert.markdown.examples.orderedItem3')}

> ${t('convert.markdown.examples.blockquote')}

\`\`\`javascript
// ${t('convert.markdown.examples.codeBlock')}
function hello() {
  console.log('Hello, World!');
}
\`\`\`

[${t('convert.markdown.examples.linkText')}](https://example.com)

![${t('convert.markdown.examples.imageAlt')}](https://via.placeholder.com/300x200)

| ${t('convert.markdown.examples.tableHeader1')} | ${t('convert.markdown.examples.tableHeader2')} | ${t('convert.markdown.examples.tableHeader3')} |
|-------|-------|-------|
| ${t('convert.markdown.examples.tableCell1')} | ${t('convert.markdown.examples.tableCell2')} | ${t('convert.markdown.examples.tableCell3')} |
| ${t('convert.markdown.examples.tableCell4')} | ${t('convert.markdown.examples.tableCell5')} | ${t('convert.markdown.examples.tableCell6')} |
`
    },
    {
      name: t('convert.markdown.examples.github'),
      content: `# ${t('convert.markdown.examples.githubTitle')}

## ${t('convert.markdown.examples.taskList')}
- [x] ${t('convert.markdown.examples.completedTask')}
- [ ] ${t('convert.markdown.examples.pendingTask')}
- [ ] ${t('convert.markdown.examples.anotherTask')}

## ${t('convert.markdown.examples.codeHighlight')}
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

## ${t('convert.markdown.examples.table')}
| ${t('convert.markdown.examples.feature')} | ${t('convert.markdown.examples.support')} | ${t('convert.markdown.examples.description')} |
|------|------|------|
| ${t('convert.markdown.examples.headings')} | ✅ | ${t('convert.markdown.examples.headingsDesc')} |
| ${t('convert.markdown.examples.lists')} | ✅ | ${t('convert.markdown.examples.listsDesc')} |
| ${t('convert.markdown.examples.code')} | ✅ | ${t('convert.markdown.examples.codeDesc')} |
| ${t('convert.markdown.examples.tables')} | ✅ | ${t('convert.markdown.examples.tablesDesc')} |

## ${t('convert.markdown.examples.strikethroughEmphasis')}
~~${t('convert.markdown.examples.deletedText')}~~ ${t('convert.markdown.examples.and')} **${t('convert.markdown.examples.importantText')}**

## ${t('convert.markdown.examples.footnote')}
${t('convert.markdown.examples.footnoteText')}[^1]。

[^1]: ${t('convert.markdown.examples.footnoteContent')}。
`
    }
  ]
  
  // 随机选择一个示例
  const example = examples[Math.floor(Math.random() * examples.length)]
  
  formData.input = example.content
  convert()
  
  message.success(t('convert.markdown.exampleLoaded', { name: example.name }))
}

// 复制输出
const copyOutput = () => {
  if (formData.output) {
    try {
      navigator.clipboard.writeText(formData.output)
      message.success(t('common.copy') + ' ' + t('common.success'))
    } catch (e) {
      message.error(t('common.copy') + ' ' + t('common.error'))
    }
  }
}
</script>

<style scoped>
.markdown-preview {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section {
  margin-bottom: 20px;
}

.actions-section {
  margin-bottom: 20px;
}

.preview-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.preview-container {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.preview {
  padding: 20px;
  min-height: 200px;
  background-color: var(--card-color);
}

.preview-actions {
  padding: 12px 20px;
  background-color: var(--card-color);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.error-alert {
  margin-top: 16px;
}

.info-section {
  margin-bottom: 20px;
}

.info-alert {
  margin-top: 8px;
}

/* Markdown样式 */
.preview :deep(h1) {
  font-size: 2em;
  margin-bottom: 0.5em;
  color: #24292e;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview :deep(h2) {
  font-size: 1.5em;
  margin-bottom: 0.5em;
  color: #24292e;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview :deep(h3) {
  font-size: 1.25em;
  margin-bottom: 0.5em;
  color: #24292e;
}

.preview :deep(h4) {
  font-size: 1em;
  margin-bottom: 0.5em;
  color: #24292e;
}

.preview :deep(h5) {
  font-size: 0.875em;
  margin-bottom: 0.5em;
  color: #24292e;
}

.preview :deep(h6) {
  font-size: 0.85em;
  margin-bottom: 0.5em;
  color: #6a737d;
}

.preview :deep(p) {
  margin-bottom: 1em;
  line-height: 1.6;
}

.preview :deep(ul),
.preview :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
  line-height: 1.6;
}

.preview :deep(li) {
  margin-bottom: 0.25em;
}

.preview :deep(blockquote) {
  margin: 1em 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  background-color: #f6f8fa;
}

.preview :deep(code) {
  background-color: rgba(27, 31, 35, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
}

.preview :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1em;
  border: 1px solid #e1e4e8;
}

.preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
}

.preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
  border: 1px solid #dfe2e5;
}

.preview :deep(th),
.preview :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
  text-align: left;
}

.preview :deep(th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

.preview :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.preview :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.preview :deep(a:hover) {
  text-decoration: underline;
}

.preview :deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

.preview :deep(del) {
  text-decoration: line-through;
  color: #6a737d;
}

.preview :deep(ins) {
  text-decoration: underline;
}

.preview :deep(strong) {
  font-weight: 600;
}

.preview :deep(em) {
  font-style: italic;
}
</style>
