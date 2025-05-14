<template>
  <div class="jwt-codec">
    <n-card title="JWT编码解码工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入JWT字符串" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="btn-group">
        <n-button @click="decode">解码</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="解码结果（Header.Payload）" :autosize="{ minRows: 4, maxRows: 10 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function decode() {
  error.value = '';
  if (!input.value) {
    error.value = '请输入JWT字符串';
    return;
  }
  try {
    const parts = input.value.split('.');
    if (parts.length < 2) {
      error.value = 'JWT格式不正确';
      return;
    }
    const header = JSON.parse(decodeURIComponent(escape(atob(parts[0]))));
    const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
    result.value = JSON.stringify(header, null, 2) + '\n' + JSON.stringify(payload, null, 2);
  } catch (e) {
    error.value = '解码失败，请检查输入内容！';
  }
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.jwt-codec {
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