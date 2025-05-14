<template>
  <div class="string-reverser">
    <n-card title="字符串反转工具">
      <n-input v-model:value="input" placeholder="请输入字符串" type="textarea" :autosize="{minRows: 3}" />
      <n-button @click="reverseString" style="margin-top: 12px;">反转</n-button>
      <n-input v-model:value="result" placeholder="反转结果" type="textarea" :autosize="{minRows: 3}" readonly style="margin-top: 16px;" />
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
function reverseString() {
  result.value = input.value.split('').reverse().join('');
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.string-reverser {
  max-width: 800px;
  margin: 0 auto;
}
.copy-tip {
  margin-top: 8px;
}
</style> 