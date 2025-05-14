<template>
  <div class="sha-hash">
    <n-card title="SHA哈希工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入待哈希内容" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="sha-params">
        <n-select v-model:value="algo" :options="algoOptions" placeholder="算法" style="width: 140px" />
      </div>
      <div class="btn-group">
        <n-button @click="doHash">计算哈希</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="哈希结果" :autosize="{ minRows: 2, maxRows: 6 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let algo = ref('SHA-256');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();
const algoOptions = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-512', value: 'SHA-512' },
];

function doHash() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入内容';
    return;
  }
  result.value = `[演示] ${algo.value} 哈希结果（请接后端API实现）`;
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.sha-hash {
  max-width: 800px;
  margin: 0 auto;
}
.sha-params {
  display: flex;
  gap: 12px;
  margin: 16px 0;
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