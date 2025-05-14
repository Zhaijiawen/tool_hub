<template>
  <div class="space-handler">
    <n-card title="空格处理工具">
      <n-input v-model:value="input" placeholder="请输入文本" type="textarea" :autosize="{minRows: 4}" />
      <div class="btn-group">
        <n-button @click="trimSpace">去除首尾空格</n-button>
        <n-button @click="compressSpace">压缩连续空格</n-button>
      </div>
      <n-input v-model:value="result" placeholder="处理结果" type="textarea" :autosize="{minRows: 4}" readonly style="margin-top: 16px;" />
      <n-button @click="copyResult" style="margin-top: 8px;">复制结果</n-button>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
const input = ref('');
const result = ref('');
const copySuccess = ref(false);
const { copy } = useClipboard();
function trimSpace() {
  result.value = input.value.trim();
}
function compressSpace() {
  result.value = input.value.replace(/\s+/g, ' ');
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.space-handler {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 