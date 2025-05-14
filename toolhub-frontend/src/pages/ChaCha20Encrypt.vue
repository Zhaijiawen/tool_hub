<template>
  <div class="chacha20-encrypt">
    <n-card title="ChaCha20加解密工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入明文或密文" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="chacha20-params">
        <n-input v-model:value="key" placeholder="密钥（32字节）" />
        <n-input v-model:value="nonce" placeholder="Nonce（12字节）" />
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
let nonce = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function encrypt() {
  error.value = '';
  if (!input.value || !key.value || !nonce.value) {
    error.value = '请输入明文、密钥和Nonce';
    return;
  }
  result.value = '[演示] 加密结果（请接后端API实现）';
}
function decrypt() {
  error.value = '';
  if (!input.value || !key.value || !nonce.value) {
    error.value = '请输入密文、密钥和Nonce';
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
.chacha20-encrypt {
  max-width: 800px;
  margin: 0 auto;
}
.chacha20-params {
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