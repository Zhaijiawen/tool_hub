<template>
  <div class="markdown-to-html">
    <n-card :title="t('tools.markdownToHtml.title')">
      <n-grid :cols="2" :x-gap="12">
        <n-grid-item>
          <n-form-item :label="t('tools.markdownToHtml.markdown')">
            <n-input
              v-model:value="markdown"
              type="textarea"
              :placeholder="t('tools.markdownToHtml.markdownPlaceholder')"
              :autosize="{ minRows: 10, maxRows: 20 }"
              @update:value="handleConvert"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item :label="t('tools.markdownToHtml.html')">
            <n-input
              v-model:value="html"
              type="textarea"
              :placeholder="t('tools.markdownToHtml.htmlPlaceholder')"
              :autosize="{ minRows: 10, maxRows: 20 }"
              readonly
            />
          </n-form-item>
        </n-grid-item>
      </n-grid>
      <n-grid :cols="2" :x-gap="12">
        <n-grid-item>
          <n-form-item :label="t('tools.markdownToHtml.preview')">
            <div class="preview" v-html="previewHtml"></div>
          </n-form-item>
        </n-grid-item>
      </n-grid>
      <div class="btn-group">
        <n-button @click="copyHtml">{{ t('common.copy') }}</n-button>
        <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import marked from 'marked';
import DOMPurify from 'dompurify';

const { t } = useI18n();
const message = useMessage();

const markdown = ref('');
const html = ref('');
const previewHtml = computed(() => {
  if (!markdown.value) return '';
  const rawHtml = marked(markdown.value);
  return DOMPurify.sanitize(rawHtml);
});

function handleConvert() {
  if (!markdown.value) {
    html.value = '';
    return;
  }
  html.value = marked(markdown.value);
}

function copyHtml() {
  if (html.value) {
    navigator.clipboard.writeText(html.value);
    message.success(t('common.copySuccess'));
  }
}

function clearAll() {
  markdown.value = '';
  html.value = '';
}
</script>

<style scoped>
.markdown-to-html {
  max-width: 1200px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.preview {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  min-height: 200px;
  background: #fff;
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
  border-left: 4px solid #ddd;
  padding-left: 1em;
  margin-left: 0;
  color: #666;
}
.preview :deep(code) {
  background: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
.preview :deep(pre) {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}
.preview :deep(pre code) {
  background: none;
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
  background: #f5f5f5;
}
</style> 