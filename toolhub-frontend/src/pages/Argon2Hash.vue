<template>
  <div class="argon2-hash">
    <n-card title="Argon2哈希工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入待哈希内容" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="argon2-params">
        <n-input-number v-model:value="memory" :min="8" :max="1024" placeholder="内存(MB)" style="width: 120px" />
        <n-input-number v-model:value="time" :min="1" :max="10" placeholder="时间成本" style="width: 120px" />
        <n-input-number v-model:value="parallelism" :min="1" :max="8" placeholder="并发度" style="width: 120px" />
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
let memory = ref(64);
let time = ref(3);
let parallelism = ref(2);
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
  result.value = `[演示] Argon2 哈希结果（请接后端API实现）`;
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.argon2-hash {
  max-width: 800px;
  margin: 0 auto;
}
.argon2-params {
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