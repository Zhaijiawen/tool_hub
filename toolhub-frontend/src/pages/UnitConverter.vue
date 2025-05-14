<template>
  <div class="unit-converter">
    <n-card title="单位转换工具">
      <div class="input-group">
        <n-input v-model:value="input" placeholder="请输入数值" style="width: 200px;" />
        <n-select v-model:value="fromUnit" :options="unitOptions" style="width: 140px; margin: 0 8px;" />
        <span style="margin: 0 8px;">→</span>
        <n-select v-model:value="toUnit" :options="unitOptions" style="width: 140px; margin-right: 8px;" />
        <n-button @click="convert">转换</n-button>
      </div>
      <n-input v-model:value="result" placeholder="转换结果" style="margin-top: 16px;" readonly />
      <n-button @click="copyResult" style="margin-top: 8px;">复制结果</n-button>
      <n-select v-model:value="category" :options="categoryOptions" style="margin-top: 16px; width: 200px;" @update:value="onCategoryChange" />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
let category = ref('storage');
let fromUnit = ref('B');
let toUnit = ref('KB');
const { copy } = useClipboard();
const categoryOptions = [
  { label: '存储', value: 'storage' },
  { label: '时间', value: 'time' },
  { label: '长度', value: 'length' },
  { label: '温度', value: 'temp' },
  { label: '重量', value: 'weight' },
];
const unitMap = {
  storage: [
    { label: '字节(B)', value: 'B', factor: 1 },
    { label: 'KB', value: 'KB', factor: 1024 },
    { label: 'MB', value: 'MB', factor: 1024 * 1024 },
    { label: 'GB', value: 'GB', factor: 1024 * 1024 * 1024 },
    { label: 'TB', value: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
    { label: 'PB', value: 'PB', factor: 1024 * 1024 * 1024 * 1024 * 1024 },
  ],
  time: [
    { label: '毫秒', value: 'ms', factor: 1 },
    { label: '秒', value: 's', factor: 1000 },
    { label: '分钟', value: 'min', factor: 1000 * 60 },
    { label: '小时', value: 'h', factor: 1000 * 60 * 60 },
    { label: '天', value: 'd', factor: 1000 * 60 * 60 * 24 },
  ],
  length: [
    { label: '米', value: 'm', factor: 1 },
    { label: '英尺', value: 'ft', factor: 0.3048 },
  ],
  temp: [
    { label: '摄氏度', value: 'C' },
    { label: '华氏度', value: 'F' },
  ],
  weight: [
    { label: '千克', value: 'kg', factor: 1 },
    { label: '磅', value: 'lb', factor: 0.45359237 },
  ],
};
let unitOptions = ref(unitMap[category.value]);

watch(category, (val) => {
  unitOptions.value = unitMap[val];
  fromUnit.value = unitOptions.value[0].value;
  toUnit.value = unitOptions.value[1].value;
});

function convert() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入数值';
    return;
  }
  let num = Number(input.value);
  if (isNaN(num)) {
    error.value = '输入格式有误';
    return;
  }
  if (category.value === 'temp') {
    if (fromUnit.value === toUnit.value) {
      result.value = num + '';
    } else if (fromUnit.value === 'C' && toUnit.value === 'F') {
      result.value = (num * 9 / 5 + 32).toFixed(2);
    } else if (fromUnit.value === 'F' && toUnit.value === 'C') {
      result.value = ((num - 32) * 5 / 9).toFixed(2);
    }
    return;
  }
  let from = unitOptions.value.find(u => u.value === fromUnit.value);
  let to = unitOptions.value.find(u => u.value === toUnit.value);
  if (!from || !to) {
    error.value = '单位选择有误';
    return;
  }
  let base = num * from.factor;
  let res = base / to.factor;
  result.value = res + '';
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
function onCategoryChange() {
  // 已在watch中处理
}
</script>

<style scoped>
.unit-converter {
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