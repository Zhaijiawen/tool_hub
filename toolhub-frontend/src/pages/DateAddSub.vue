<template>
  <div class="date-addsub">
    <n-card title="日期加减工具">
      <div class="input-group">
        <n-date-picker v-model:value="date" type="datetime" style="width: 220px;" />
        <n-select v-model:value="op" :options="opOptions" style="width: 80px; margin: 0 8px;" />
        <n-input-number v-model:value="num" :min="1" style="width: 100px;" />
        <n-select v-model:value="unit" :options="unitOptions" style="width: 120px; margin: 0 8px;" />
        <n-button @click="calc">计算</n-button>
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
let date = ref(Date.now());
let op = ref('add');
let num = ref(1);
let unit = ref('day');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();
const opOptions = [
  { label: '加', value: 'add' },
  { label: '减', value: 'sub' },
];
const unitOptions = [
  { label: '年', value: 'year' },
  { label: '月', value: 'month' },
  { label: '日', value: 'day' },
  { label: '小时', value: 'hour' },
  { label: '分钟', value: 'minute' },
  { label: '秒', value: 'second' },
  { label: '毫秒', value: 'ms' },
];

function calc() {
  error.value = '';
  if (!date.value || !num.value) {
    error.value = '请选择日期并输入数值';
    return;
  }
  let d = new Date(date.value);
  let n = op.value === 'add' ? num.value : -num.value;
  switch (unit.value) {
    case 'year': d.setFullYear(d.getFullYear() + n); break;
    case 'month': d.setMonth(d.getMonth() + n); break;
    case 'day': d.setDate(d.getDate() + n); break;
    case 'hour': d.setHours(d.getHours() + n); break;
    case 'minute': d.setMinutes(d.getMinutes() + n); break;
    case 'second': d.setSeconds(d.getSeconds() + n); break;
    case 'ms': d.setMilliseconds(d.getMilliseconds() + n); break;
  }
  result.value = d.toLocaleString();
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.date-addsub {
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