<template>
  <div class="case-converter">
    <n-card title="大小写转换工具">
      <n-input v-model:value="input" placeholder="请输入文本" type="textarea" :autosize="{minRows: 4}" />
      <div class="btn-group">
        <n-button @click="toUpper">全大写</n-button>
        <n-button @click="toLower">全小写</n-button>
        <n-button @click="toCapitalize">首字母大写</n-button>
      </div>
      <n-input v-model:value="result" placeholder="转换结果" type="textarea" :autosize="{minRows: 4}" readonly style="margin-top: 16px;" />
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
function toUpper() {
  result.value = input.value.toUpperCase();
}
function toLower() {
  result.value = input.value.toLowerCase();
}
function toCapitalize() {
  result.value = input.value.replace(/\b\w/g, c => c.toUpperCase());
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.case-converter {
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