<template>
  <div class="short-url-tool">
    <n-card title="短网址生成/解码工具">
      <n-input v-model:value="longUrl" placeholder="请输入长网址" style="width: 300px;" />
      <n-button @click="generate" style="margin-top: 8px;">生成短网址</n-button>
      <n-input v-model:value="shortUrl" placeholder="短网址" style="margin-top: 8px;" readonly />
      <n-input v-model:value="decodeInput" placeholder="请输入短网址" style="margin-top: 16px;" />
      <n-button @click="decode" style="margin-top: 8px;">解码</n-button>
      <n-input v-model:value="decodeResult" placeholder="原始网址" style="margin-top: 8px;" readonly />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// 需后端API支持，示例接口 /api/shorturl
const longUrl = ref('');
const shortUrl = ref('');
const decodeInput = ref('');
const decodeResult = ref('');
async function generate() {
  // 示例：实际应调用后端API
  // const res = await fetch('/api/shorturl', { method: 'POST', body: JSON.stringify({ url: longUrl.value }) });
  // shortUrl.value = await res.text();
  shortUrl.value = '【演示】http://t.cn/xxxxxx';
}
async function decode() {
  // 示例：实际应调用后端API
  // const res = await fetch(`/api/shorturl/decode?url=${decodeInput.value}`);
  // decodeResult.value = await res.text();
  decodeResult.value = '【演示】https://www.example.com';
}
</script>
<style scoped>
.short-url-tool { max-width: 400px; margin: 0 auto; }
</style> 