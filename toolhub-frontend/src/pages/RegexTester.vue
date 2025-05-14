<template>
  <div class="regex-tester">
    <n-card title="正则表达式测试工具">
      <n-input v-model:value="pattern" placeholder="请输入正则表达式" style="margin-bottom: 8px;" />
      <n-input v-model:value="text" placeholder="请输入待匹配文本" type="textarea" :autosize="{minRows: 4}" />
      <n-button @click="testRegex" style="margin-top: 8px;">测试</n-button>
      <n-input v-model:value="result" placeholder="匹配结果" type="textarea" :autosize="{minRows: 4}" readonly style="margin-top: 16px;" />
      <n-alert v-if="error" type="error" class="err-tip">{{ error }}</n-alert>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const pattern = ref('');
const text = ref('');
const result = ref('');
const error = ref('');
function testRegex() {
  error.value = '';
  try {
    const reg = new RegExp(pattern.value, 'g');
    const matches = text.value.match(reg);
    result.value = matches ? matches.join('\n') : '无匹配结果';
  } catch (e) {
    error.value = '正则表达式有误';
  }
}
</script>
<style scoped>
.regex-tester { max-width: 800px; margin: 0 auto; }
.err-tip { margin-top: 8px; }
</style> 