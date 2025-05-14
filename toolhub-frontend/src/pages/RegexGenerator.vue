<template>
  <div class="regex-generator">
    <n-card title="正则表达式生成器">
      <n-select v-model:value="type" :options="typeOptions" style="width: 200px; margin-bottom: 12px;" />
      <n-input v-model:value="custom" placeholder="自定义内容（如需）" style="margin-bottom: 12px;" />
      <n-button @click="generate" style="margin-bottom: 12px;">生成正则</n-button>
      <n-input v-model:value="result" placeholder="生成的正则表达式" readonly />
      <n-button @click="copyResult" style="margin-top: 8px;">复制正则</n-button>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
const type = ref('email');
const custom = ref('');
const result = ref('');
const copySuccess = ref(false);
const { copy } = useClipboard();
const typeOptions = [
  { label: '邮箱', value: 'email' },
  { label: '手机号', value: 'phone' },
  { label: 'URL', value: 'url' },
  { label: 'IP地址', value: 'ip' },
  { label: '自定义', value: 'custom' }
];
function generate() {
  switch (type.value) {
    case 'email':
      result.value = '/^\\w+([-+.\\w+])*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/';
      break;
    case 'phone':
      result.value = '/^1[3-9]\\d{9}$/';
      break;
    case 'url':
      result.value = '/^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$/';
      break;
    case 'ip':
      result.value = '/^(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)){3}$/';
      break;
    case 'custom':
      result.value = custom.value || '';
      break;
  }
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>
<style scoped>
.regex-generator { max-width: 600px; margin: 0 auto; }
.copy-tip { margin-top: 8px; }
</style> 