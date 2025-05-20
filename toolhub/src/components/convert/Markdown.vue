<template>
  <n-card :title="$t('convert.markdown.title')">
    <n-form>
      <n-form-item :label="$t('convert.markdown.input')">
        <n-input
          v-model:value="formData.input"
          :placeholder="$t('convert.markdown.inputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="convert">
          {{ $t('convert.markdown.convert') }}
        </n-button>
        <n-button @click="copyOutput">
          {{ $t('convert.markdown.copy') }}
        </n-button>
      </n-space>

      <n-divider />

      <n-form-item :label="$t('convert.markdown.preview')">
        <div class="preview" v-html="formData.output"></div>
      </n-form-item>

      <n-form-item :label="$t('convert.markdown.output')">
        <n-input
          v-model:value="formData.output"
          :placeholder="$t('convert.markdown.outputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          readonly
        />
      </n-form-item>
    </n-form>

    <n-alert
      v-if="error"
      type="error"
      :title="error"
      style="margin-top: 16px"
    />
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  output: ''
})

const error = ref('')

function convert() {
  error.value = ''
  
  try {
    if (!formData.input) {
      throw new Error(t('convert.markdown.inputRequired'))
    }

    // 使用marked转换Markdown为HTML
    const html = marked(formData.input)
    // 使用DOMPurify清理HTML，防止XSS攻击
    formData.output = DOMPurify.sanitize(html)
  } catch (err) {
    error.value = err.message
  }
}

function copyOutput() {
  if (formData.output) {
    navigator.clipboard.writeText(formData.output)
    message.success(t('convert.markdown.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.preview {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  min-height: 100px;
}

.preview :deep(h1) {
  font-size: 2em;
  margin-bottom: 0.5em;
}

.preview :deep(h2) {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

.preview :deep(h3) {
  font-size: 1.17em;
  margin-bottom: 0.5em;
}

.preview :deep(p) {
  margin-bottom: 1em;
}

.preview :deep(ul), .preview :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.preview :deep(blockquote) {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid #ddd;
  color: #666;
}

.preview :deep(code) {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.preview :deep(pre) {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
}

.preview :deep(th), .preview :deep(td) {
  border: 1px solid #ddd;
  padding: 0.5em;
}

.preview :deep(th) {
  background-color: #f5f5f5;
}

.preview :deep(img) {
  max-width: 100%;
  height: auto;
}

.preview :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.preview :deep(a:hover) {
  text-decoration: underline;
}
</style> 