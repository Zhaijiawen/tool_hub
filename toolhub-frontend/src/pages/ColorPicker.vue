<template>
  <div class="color-picker">
    <n-card title="颜色选择器">
      <n-color-picker v-model:value="color" style="margin-bottom: 16px;" />
      <n-input v-model:value="color" placeholder="颜色值" readonly />
      <n-button @click="copyColor" style="margin-top: 8px;">复制颜色值</n-button>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
const color = ref('#409EFF');
const copySuccess = ref(false);
const { copy } = useClipboard();
function copyColor() {
  copy(color.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>
<style scoped>
.color-picker { max-width: 400px; margin: 0 auto; }
.copy-tip { margin-top: 8px; }
</style> 