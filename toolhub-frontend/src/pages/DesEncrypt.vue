<template>
  <div class="des-encrypt">
    <n-card title="DES/3DES加解密工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入明文或密文" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="des-params">
        <n-input v-model:value="key" placeholder="密钥（8/16/24字节）" />
        <n-input v-model:value="iv" placeholder="IV（8字节，可选）" />
        <n-select v-model:value="mode" :options="modeOptions" placeholder="模式" style="width: 120px" />
        <n-select v-model:value="type" :options="typeOptions" placeholder="类型" style="width: 120px" />
      </div>
      <div class="btn-group">
        <n-button @click="encrypt">加密</n-button>
        <n-button @click="decrypt">解密</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="结果输出" :autosize="{ minRows: 4, maxRows: 10 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let key = ref('');
let iv = ref('');
let mode = ref('CBC');
let type = ref('DES');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();
const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'ECB', value: 'ECB' },
];
const typeOptions = [
  { label: 'DES', value: 'DES' },
  { label: '3DES', value: '3DES' },
];

function encrypt() {
  error.value = '';
  if (!input.value || !key.value) {
    error.value = '请输入明文和密钥';
    return;
  }
  result.value = '[演示] 加密结果（请接后端API实现）';
}
function decrypt() {
  error.value = '';
  if (!input.value || !key.value) {
    error.value = '请输入密文和密钥';
    return;
  }
  result.value = '[演示] 解密结果（请接后端API实现）';
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.des-encrypt {
  max-width: 800px;
  margin: 0 auto;
}
.des-params {
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