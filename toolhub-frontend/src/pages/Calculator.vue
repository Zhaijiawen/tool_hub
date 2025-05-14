<template>
  <div class="calculator">
    <n-card title="网页计算器">
      <n-input v-model:value="expr" placeholder="请输入表达式，如1+2*3" style="width: 300px;" />
      <n-button @click="calc" style="margin-top: 8px;">计算</n-button>
      <n-input v-model:value="result" placeholder="计算结果" style="margin-top: 16px;" readonly />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const expr = ref('');
const result = ref('');
function calc() {
  try {
    // eslint-disable-next-line no-eval
    result.value = eval(expr.value).toString();
  } catch {
    result.value = '表达式有误';
  }
}
</script>
<style scoped>
.calculator { max-width: 400px; margin: 0 auto; }
</style> 