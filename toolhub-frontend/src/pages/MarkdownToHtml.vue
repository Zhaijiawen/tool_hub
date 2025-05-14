<template>
  <div class="markdown-to-html">
    <n-card title="Markdown转HTML工具">
      <n-input v-model:value="markdown" placeholder="请输入Markdown文本" type="textarea" :autosize="{minRows: 6}" />
      <n-button @click="convert" style="margin-top: 8px;">转换</n-button>
      <n-input v-model:value="html" placeholder="HTML结果" type="textarea" :autosize="{minRows: 6}" readonly style="margin-top: 16px;" />
      <n-button @click="copyHtml" style="margin-top: 8px;">复制HTML</n-button>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
      <div style="margin-top: 16px;">
        <span>实时预览：</span>
        <div v-html="html" class="preview"></div>
      </div>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { marked } from 'marked';
const markdown = ref('');
const html = ref('');
const copySuccess = ref(false);
const { copy } = useClipboard();
function convert() {
  html.value = marked.parse(markdown.value);
}
function copyHtml() {
  copy(html.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>
<style scoped>
.markdown-to-html { max-width: 800px; margin: 0 auto; }
.copy-tip { margin-top: 8px; }
.preview { border: 1px solid #eee; padding: 12px; margin-top: 8px; background: #fafbfc; }
</style> 