<template>
  <div class="ascii-unicode-converter">
    <n-card title="ASCII/Unicode码转换工具">
      <n-input v-model:value="input" placeholder="请输入字符或编码" style="width: 300px;" />
      <div class="btn-group">
        <n-button @click="charToAscii">字符转ASCII</n-button>
        <n-button @click="charToUnicode">字符转Unicode</n-button>
        <n-button @click="asciiToChar">ASCII转字符</n-button>
        <n-button @click="unicodeToChar">Unicode转字符</n-button>
      </div>
      <n-input v-model:value="result" placeholder="转换结果" style="margin-top: 16px;" readonly />
      <n-button @click="copyResult" style="margin-top: 8px;">复制结果</n-button>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
const input = ref('');
const result = ref('');
const error = ref('');
const copySuccess = ref(false);
const { copy } = useClipboard();
function charToAscii() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入字符';
    return;
  }
  result.value = input.value.split('').map(c => c.charCodeAt(0)).join(' ');
}
function charToUnicode() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入字符';
    return;
  }
  result.value = input.value.split('').map(c => 'U+' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');
}
function asciiToChar() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入ASCII码（空格分隔）';
    return;
  }
  try {
    result.value = input.value.split(/\s+/).map(n => String.fromCharCode(Number(n))).join('');
  } catch {
    error.value = '格式有误';
  }
}
function unicodeToChar() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入Unicode码（如U+0041 空格分隔）';
    return;
  }
  try {
    result.value = input.value.split(/\s+/).map(u => String.fromCharCode(parseInt(u.replace(/^U\+/, ''), 16))).join('');
  } catch {
    error.value = '格式有误';
  }
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.ascii-unicode-converter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 