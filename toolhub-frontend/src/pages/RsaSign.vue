<template>
  <div class="rsa-sign">
    <n-card title="RSA数字签名工具">
      <n-input v-model:value="input" type="textarea" placeholder="请输入待签名内容" :autosize="{ minRows: 4, maxRows: 10 }" />
      <div class="rsa-sign-params">
        <n-input v-model:value="privateKey" type="textarea" placeholder="私钥（PEM格式）" :autosize="{ minRows: 2, maxRows: 6 }" />
        <n-input v-model:value="publicKey" type="textarea" placeholder="公钥（PEM格式）" :autosize="{ minRows: 2, maxRows: 6 }" />
      </div>
      <div class="btn-group">
        <n-button @click="sign">私钥签名</n-button>
        <n-button @click="verify">公钥验签</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="签名/验签结果" :autosize="{ minRows: 2, maxRows: 6 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let privateKey = ref('');
let publicKey = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function sign() {
  error.value = '';
  if (!input.value || !privateKey.value) {
    error.value = '请输入内容和私钥';
    return;
  }
  result.value = '[演示] 签名结果（请接后端API实现）';
}
function verify() {
  error.value = '';
  if (!input.value || !publicKey.value) {
    error.value = '请输入内容和公钥';
    return;
  }
  result.value = '[演示] 验签结果（请接后端API实现）';
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.rsa-sign {
  max-width: 800px;
  margin: 0 auto;
}
.rsa-sign-params {
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