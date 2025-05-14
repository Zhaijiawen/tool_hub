<template>
  <div class="timestamp-converter">
    <n-card title="时间戳转换工具">
      <div class="current-ts">
        当前时间戳：<b>{{ nowTs }}</b>
        <n-button size="small" @click="copyNowTs" style="margin-left: 8px;">复制</n-button>
      </div>
      <div class="ts2date">
        <n-input v-model:value="tsInput" placeholder="请输入时间戳" style="width: 220px;" />
        <n-select v-model:value="tsUnit" :options="unitOptions" style="width: 100px; margin: 0 8px;" />
        <n-select v-model:value="tsTz" :options="tzOptions" style="width: 120px; margin-right: 8px;" />
        <n-button @click="tsToDate">转日期</n-button>
        <n-input v-model:value="tsDateResult" placeholder="日期结果" style="width: 220px; margin-left: 8px;" readonly />
      </div>
      <div class="date2ts" style="margin-top: 16px;">
        <n-date-picker v-model:value="dateInput" type="datetime" style="width: 220px;" />
        <n-select v-model:value="dateTz" :options="tzOptions" style="width: 120px; margin: 0 8px;" />
        <n-select v-model:value="dateUnit" :options="unitOptions" style="width: 100px; margin-right: 8px;" />
        <n-button @click="dateToTs">转时间戳</n-button>
        <n-input v-model:value="dateTsResult" placeholder="时间戳结果" style="width: 220px; margin-left: 8px;" readonly />
      </div>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useClipboard } from '@vueuse/core';
let nowTs = ref('');
let tsInput = ref('');
let tsUnit = ref('ms');
let tsTz = ref('local');
let tsDateResult = ref('');
let dateInput = ref(Date.now());
let dateTz = ref('local');
let dateUnit = ref('ms');
let dateTsResult = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();
const unitOptions = [
  { label: '秒', value: 's' },
  { label: '毫秒', value: 'ms' },
];
const tzOptions = [
  { label: '本地', value: 'local' },
  { label: 'UTC', value: 'utc' },
];

function updateNowTs() {
  nowTs.value = String(Date.now());
}
onMounted(() => {
  updateNowTs();
  setInterval(updateNowTs, 1000);
});
function copyNowTs() {
  copy(nowTs.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
function tsToDate() {
  error.value = '';
  if (!tsInput.value) {
    error.value = '请输入时间戳';
    return;
  }
  let tsNum = Number(tsInput.value);
  if (tsUnit.value === 's') tsNum *= 1000;
  let date = new Date(tsNum);
  if (isNaN(date.getTime())) {
    error.value = '时间戳格式有误';
    return;
  }
  tsDateResult.value = tsTz.value === 'utc' ? date.toISOString().replace('T', ' ').replace('Z', '') : date.toLocaleString();
}
function dateToTs() {
  error.value = '';
  if (!dateInput.value) {
    error.value = '请选择日期';
    return;
  }
  let d = new Date(dateInput.value);
  let ts = d.getTime();
  if (dateUnit.value === 's') ts = Math.floor(ts / 1000);
  dateTsResult.value = String(ts);
}
</script>

<style scoped>
.timestamp-converter {
  max-width: 900px;
  margin: 0 auto;
}
.current-ts {
  margin-bottom: 16px;
}
.ts2date, .date2ts {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 