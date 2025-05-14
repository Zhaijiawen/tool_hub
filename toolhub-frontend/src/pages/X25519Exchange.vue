<template>
  <div class="x25519-exchange">
    <n-card title="X25519密钥交换工具">
      <n-input v-model:value="privateKey" type="textarea" placeholder="本地私钥（Base64/Hex）" :autosize="{ minRows: 2, maxRows: 6 }" />
      <n-input v-model:value="peerPublicKey" type="textarea" placeholder="对方公钥（Base64/Hex）" :autosize="{ minRows: 2, maxRows: 6 }" />
      <div class="btn-group">
        <n-button @click="compute">计算共享密钥</n-button>
        <n-button @click="copyResult">复制结果</n-button>
      </div>
      <n-input v-model:value="result" type="textarea" placeholder="共享密钥" :autosize="{ minRows: 2, maxRows: 6 }" readonly />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let privateKey = ref('');
let peerPublicKey = ref('');
let result = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function compute() {
  error.value = '';
  if (!privateKey.value || !peerPublicKey.value) {
    error.value = '请输入本地私钥和对方公钥';
    return;
  }
  result.value = '[演示] 共享密钥（请接后端API实现）';
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.x25519-exchange {
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