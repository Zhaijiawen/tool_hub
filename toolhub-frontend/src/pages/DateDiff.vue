<template>
  <div class="date-diff">
    <n-card title="日期间计算工具">
      <div class="input-group">
        <n-date-picker v-model:value="date1" type="datetime" style="width: 220px;" />
        <span style="margin: 0 8px;">至</span>
        <n-date-picker v-model:value="date2" type="datetime" style="width: 220px;" />
        <n-select v-model:value="unit" :options="unitOptions" style="width: 120px; margin: 0 8px;" />
        <n-button @click="calcDiff">计算</n-button>
      </div>
      <n-input v-model:value="result" placeholder="计算结果" style="margin-top: 16px;" readonly />
      <n-button @click="copyResult" style="margin-top: 8px;">复制结果</n-button>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let date1 = ref(Date.now());
let date2 = ref(Date.now());
let unit = ref('day');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();
const unitOptions = [
  { label: '天', value: 'day' },
  { label: '小时', value: 'hour' },
  { label: '分钟', value: 'minute' },
  { label: '秒', value: 'second' },
  { label: '毫秒', value: 'ms' },
];

function calcDiff() {
  error.value = '';
  if (!date1.value || !date2.value) {
    error.value = '请选择两个日期';
    return;
  }
  let diff = Math.abs(date2.value - date1.value);
  let val = 0;
  switch (unit.value) {
    case 'day': val = diff / (1000 * 60 * 60 * 24); break;
    case 'hour': val = diff / (1000 * 60 * 60); break;
    case 'minute': val = diff / (1000 * 60); break;
    case 'second': val = diff / 1000; break;
    case 'ms': val = diff; break;
  }
  result.value = `${val} (${unitOptions.find(u => u.value === unit.value)?.label})`;
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.date-diff {
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