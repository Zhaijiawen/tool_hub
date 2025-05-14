<template>
  <div class="base64-codec">
    <n-card title="Base64编码解码工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="btn-group">
        <n-button @click="encode">编码</n-button>
        <n-button @click="decode">解码</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="结果输出" :autosize="{ minRows: 2, maxRows: 6 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function encode() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入内容';
    return;
  }
  result.value = btoa(unescape(encodeURIComponent(input.value)));
}
function decode() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入内容';
    return;
  }
  try {
    result.value = decodeURIComponent(escape(atob(input.value)));
  } catch (e) {
    error.value = '解码失败，请检查输入内容！';
  }
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.base64-codec {
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