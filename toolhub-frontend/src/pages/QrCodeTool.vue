<template>
  <div class="qr-code-tool">
    <n-card title="二维码生成/解码工具">
      <n-input v-model:value="text" placeholder="请输入文本或URL" style="width: 300px;" />
      <n-button @click="generate" style="margin-top: 8px;">生成二维码</n-button>
      <div v-if="qrUrl" style="margin-top: 16px;">
        <img :src="qrUrl" style="width: 180px; height: 180px;" />
        <n-button @click="downloadQr" style="margin-top: 8px;">下载二维码</n-button>
      </div>
      <input type="file" accept="image/*" @change="onFileChange" style="margin-top: 16px;" />
      <n-button @click="decodeQr" :disabled="!imgFile" style="margin-top: 8px;">解码二维码</n-button>
      <n-input v-model:value="decodeResult" placeholder="解码结果" style="margin-top: 8px;" readonly />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// 需安装qrcode和jsqr库
import QRCode from 'qrcode';
let text = ref('');
let qrUrl = ref('');
let imgFile = ref<File|null>(null);
let decodeResult = ref('');
function generate() {
  QRCode.toDataURL(text.value, { width: 180 }, (err, url) => {
    if (!err) qrUrl.value = url;
  });
}
function downloadQr() {
  if (!qrUrl.value) return;
  const a = document.createElement('a');
  a.href = qrUrl.value;
  a.download = 'qrcode.png';
  a.click();
}
function onFileChange(e: Event) {
  imgFile.value = (e.target as HTMLInputElement).files?.[0] || null;
}
async function decodeQr() {
  if (!imgFile.value) return;
  const img = new window.Image();
  img.src = URL.createObjectURL(imgFile.value);
  await new Promise(res => (img.onload = res));
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  // @ts-ignore
  const jsQR = (await import('jsqr')).default;
  const code = jsQR(imageData.data, canvas.width, canvas.height);
  decodeResult.value = code ? code.data : '未识别到二维码';
}
</script>
<style scoped>
.qr-code-tool { max-width: 800px; margin: 0 auto; }
</style> 