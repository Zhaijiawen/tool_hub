<template>
  <div class="ecc-encrypt">
    <n-card title="ECC加解密工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入明文或密文" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="ecc-params">
        <n-input v-model:value="publicKey" type="textarea" placeholder="公钥（PEM格式）" :autosize="{ minRows: 2, maxRows: 6 }" />
        <n-input v-model:value="privateKey" type="textarea" placeholder="私钥（PEM格式）" :autosize="{ minRows: 2, maxRows: 6 }" />
      </div>
      <div class="btn-group">
        <n-button @click="encrypt">公钥加密</n-button>
        <n-button @click="decrypt">私钥解密</n-button>
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
let publicKey = ref('');
let privateKey = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function encrypt() {
  error.value = '';
  if (!input.value || !publicKey.value) {
    error.value = '请输入明文和公钥';
    return;
  }
  result.value = '[演示] 公钥加密结果（请接后端API实现）';
}
function decrypt() {
  error.value = '';
  if (!input.value || !privateKey.value) {
    error.value = '请输入密文和私钥';
    return;
  }
  result.value = '[演示] 私钥解密结果（请接后端API实现）';
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.ecc-encrypt {
  max-width: 800px;
  margin: 0 auto;
}
.ecc-params {
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