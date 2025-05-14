<template>
  <div class="thousand-separator">
    <n-card title="千分位分隔工具">
      <n-input v-model:value="input" placeholder="请输入数字" style="width: 300px;" />
      <n-button @click="formatNumber" style="margin-top: 12px;">格式化</n-button>
      <n-input v-model:value="result" placeholder="格式化结果" style="margin-top: 16px;" readonly />
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
function formatNumber() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入数字';
    return;
  }
  const num = Number(input.value);
  if (isNaN(num)) {
    error.value = '输入格式有误';
    return;
  }
  result.value = num.toLocaleString();
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.thousand-separator {
  max-width: 800px;
  margin: 0 auto;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 