<template>
  <div class="radix-converter">
    <n-card title="进制转换工具">
      <div class="input-group">
        <n-input v-model:value="input" placeholder="请输入数值" style="width: 200px;" />
        <n-select v-model:value="fromRadix" :options="radixOptions" style="width: 120px; margin: 0 8px;" />
        <span style="margin: 0 8px;">→</span>
        <n-select v-model:value="toRadix" :options="radixOptions" style="width: 120px; margin-right: 8px;" />
        <n-button @click="convert">转换</n-button>
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
const fromRadix = ref(10);
const toRadix = ref(2);
const { copy } = useClipboard();
const radixOptions = [
  { label: '2进制', value: 2 },
  { label: '8进制', value: 8 },
  { label: '10进制', value: 10 },
  { label: '16进制', value: 16 }
];

function convert() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入数值';
    return;
  }
  let num: number;
  try {
    num = parseInt(input.value, fromRadix.value);
    if (isNaN(num)) throw new Error();
    result.value = num.toString(toRadix.value).toUpperCase();
  } catch {
    error.value = '输入格式有误';
  }
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.radix-converter {
  max-width: 800px;
  margin: 0 auto;
}
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 