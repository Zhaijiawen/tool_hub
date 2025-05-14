<template>
  <div class="java-formatter">
    <n-card title="Java格式化工具">
      <n-input
        v-model:value="input"
        type="textarea"
        placeholder="请输入Java代码"
        :autosize="{ minRows: 8, maxRows: 20 }"
      />
      <div class="btn-group">
        <n-button @click="formatJava">格式化</n-button>
        <n-button @click="copyJava">复制</n-button>
      </div>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import beautify from 'js-beautify';
let input = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function formatJava() {
  error.value = '';
  try {
    input.value = beautify.js(input.value, { indent_size: 2, space_in_empty_paren: true });
  } catch (e) {
    error.value = '格式化失败，请检查输入内容！';
  }
}
function copyJava() {
  copy(input.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.java-formatter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 