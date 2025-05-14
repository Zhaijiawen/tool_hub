<template>
  <div class="xml-formatter">
    <n-card title="XML格式化工具">
      <n-input
        v-model:value="input"
        type="textarea"
        placeholder="请输入XML数据"
        :autosize="{ minRows: 8, maxRows: 20 }"
      />
      <div class="btn-group">
        <n-button @click="formatXml">格式化</n-button>
        <n-button @click="compressXml">压缩</n-button>
        <n-button @click="copyXml">复制</n-button>
      </div>
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">复制成功！</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
let input = ref('');
let error = ref('');
let copySuccess = ref(false);
const { copy } = useClipboard();

function formatXml() {
  error.value = '';
  try {
    // 简单格式化实现，建议后续用第三方库完善
    const PADDING = '  ';
    let reg = /(>)(<)(\/*)/g;
    let xml = input.value.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    let formatted = '';
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/.+>$/)) {
        indent = 0;
      } else if (node.match(/^<\//)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<[^!?]+[^\/]>/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      let padding = '';
      for (let i = 0; i < pad; i++) padding += PADDING;
      formatted += padding + node + '\r\n';
      pad += indent;
    });
    input.value = formatted.trim();
  } catch (e) {
    error.value = 'XML格式有误，请检查输入内容！';
  }
}
function compressXml() {
  error.value = '';
  try {
    input.value = input.value.replace(/\s{2,}|\r|\n/g, '');
  } catch (e) {
    error.value = 'XML格式有误，请检查输入内容！';
  }
}
function copyXml() {
  copy(input.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}
</script>

<style scoped>
.xml-formatter {
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