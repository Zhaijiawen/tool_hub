<template>
  <div class="bcrypt-hash">
    <n-card title="Bcrypt哈希工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入待哈希内容" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="bcrypt-params">
        <n-input-number v-model:value="rounds" :min="4" :max="20" placeholder="盐轮数" style="width: 140px" />
      </div>
      <div class="btn-group">
        <n-button @click="doHash">计算哈希</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="哈希结果" :autosize="{ minRows: 2, maxRows: 6 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let rounds = ref(10);
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function doHash() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入内容';
    return;
  }
  result.value = `[演示] Bcrypt 哈希结果（请接后端API实现）`;
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.bcrypt-hash {
  max-width: 800px;
  margin: 0 auto;
}
.bcrypt-params {
  display: flex;
  gap: 12px;
  margin: 16px 0;
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