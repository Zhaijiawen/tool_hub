<template>
  <div class="color-converter">
    <n-card title="颜色格式转换工具">
      <n-input v-model:value="input" placeholder="请输入HEX或RGB，如#FF0000或rgb(255,0,0)" style="width: 300px;" />
      <div class="btn-group">
        <n-button @click="hexToRgb">HEX转RGB</n-button>
        <n-button @click="rgbToHex">RGB转HEX</n-button>
      </div>
      <n-input v-model:value="result" placeholder="转换结果" style="margin-top: 16px;" readonly />
      <div v-if="result" style="margin-top: 8px;">
        <span>预览：</span>
        <span :style="{display: 'inline-block', width: '32px', height: '32px', background: result, border: '1px solid #ccc', verticalAlign: 'middle'}"></span>
      </div>
      <n-button @click="copyResult" style="margin-top: 8px;">复制结果</n-button>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
const input = ref('');
const result = ref('');
const error = ref('');
const copySuccess = ref(false);
const { copy } = useClipboard();
function hexToRgb() {
  error.value = '';
  let hex = input.value.trim();
  if (!/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(hex)) {
    error.value = '请输入正确的HEX格式，如#FF0000';
    return;
  }
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  result.value = `rgb(${r},${g},${b})`;
}
function rgbToHex() {
  error.value = '';
  const match = input.value.trim().match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/);
  if (!match) {
    error.value = '请输入正确的RGB格式，如rgb(255,0,0)';
    return;
  }
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  if ([r, g, b].some(n => n < 0 || n > 255)) {
    error.value = 'RGB数值需在0-255之间';
    return;
  }
  result.value = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
function copyResult() {
  copy(result.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.color-converter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.err-tip {
  margin-top: 8px;
}
.copy-tip {
  margin-top: 8px;
}
</style> 