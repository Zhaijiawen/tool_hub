<template>
  <div class="user-agent-parser">
    <n-card title="User-Agent解析工具">
      <n-input v-model:value="ua" placeholder="请输入User-Agent字符串" type="textarea" :autosize="{minRows: 3}" />
      <n-button @click="parse" style="margin-top: 8px;">解析</n-button>
      <n-input v-model:value="result" placeholder="解析结果" type="textarea" :autosize="{minRows: 3}" readonly style="margin-top: 16px;" />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// 建议安装ua-parser-js库
import UAParser from 'ua-parser-js';
const ua = ref('');
const result = ref('');
function parse() {
  const parser = new UAParser(ua.value);
  const info = parser.getResult();
  result.value = JSON.stringify(info, null, 2);
}
</script>
<style scoped>
.user-agent-parser { max-width: 800px; margin: 0 auto; }
</style> 