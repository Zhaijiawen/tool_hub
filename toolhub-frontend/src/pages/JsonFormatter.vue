<template>
  <div class="json-formatter">
    <n-card title="JSON格式化工具">
      <n-input
        v-model:value="input"
        type="textarea"
        placeholder="请输入JSON数据"
        :autosize="{ minRows: 8, maxRows: 20 }"
      />
      <div class="btn-group">
        <n-button @click="formatJson">格式化</n-button>
        <n-button @click="compressJson">压缩</n-button>
        <n-button @click="copyJson">复制</n-button>
        <n-button @click="escapeJson">转义</n-button>
        <n-button @click="unescapeJson">去除转义</n-button>
      </div>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function formatJson() {
  error.value = '';
  try {
    input.value = JSON.stringify(JSON.parse(input.value), null, 2);
  } catch (e) {
    error.value = 'JSON格式有误，请检查输入内容！';
  }
}
function compressJson() {
  error.value = '';
  try {
    input.value = JSON.stringify(JSON.parse(input.value));
  } catch (e) {
    error.value = 'JSON格式有误，请检查输入内容！';
  }
}
function copyJson() {
  copy(input.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
function escapeJson() {
  input.value = input.value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\"/g, '\\"');
}
function unescapeJson() {
  input.value = input.value.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}
</script>

<style scoped>
.json-formatter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 