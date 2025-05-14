<template>
  <div class="ip-tool">
    <n-card title="IP地址查询工具">
      <n-input v-model:value="ip" placeholder="请输入IP地址" style="width: 200px;" />
      <n-button @click="query" style="margin-top: 8px;">查询</n-button>
      <n-input v-model:value="result" placeholder="查询结果" type="textarea" :autosize="{minRows: 3}" readonly style="margin-top: 16px;" />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// 需后端API支持，示例接口 /api/ip?ip=xxx
const ip = ref('');
const result = ref('');
async function query() {
  if (!ip.value) return;
  // 示例：实际应调用后端API
  // const res = await fetch(`/api/ip?ip=${ip.value}`);
  // result.value = await res.text();
  result.value = '【演示】此处应显示IP归属地、运营商等信息';
}
</script>
<style scoped>
.ip-tool { max-width: 400px; margin: 0 auto; }
</style> 