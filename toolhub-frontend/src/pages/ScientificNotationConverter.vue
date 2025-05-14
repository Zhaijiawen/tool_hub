<template>
  <div class="scientific-notation-converter">
    <n-card title="科学计数法与普通数值互转工具">
      <n-input v-model:value="input" placeholder="请输入数值或科学计数法" style="width: 300px;" />
      <div class="btn-group">
        <n-button @click="toScientific">转科学计数法</n-button>
        <n-button @click="toNormal">转普通数值</n-button>
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
const { copy } = useClipboard();
function toScientific() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入数值';
    return;
  }
  const num = Number(input.value);
  if (isNaN(num)) {
    error.value = '输入格式有误';
    return;
  }
  result.value = num.toExponential();
}
function toNormal() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入科学计数法';
    return;
  }
  try {
    result.value = Number(input.value).toString();
    if (isNaN(Number(result.value))) throw new Error();
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
.scientific-notation-converter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 