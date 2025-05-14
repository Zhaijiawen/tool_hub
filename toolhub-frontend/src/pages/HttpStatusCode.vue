<template>
  <div class="http-status-code">
    <n-card title="HTTP状态码解释工具">
      <n-input v-model:value="code" placeholder="请输入HTTP状态码，如404" style="width: 200px;" />
      <n-button @click="explain" style="margin-top: 8px;">查询</n-button>
      <n-input v-model:value="result" placeholder="状态码含义" style="margin-top: 16px;" readonly />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const code = ref('');
const result = ref('');
const statusMap = {
  '200': 'OK，请求成功',
  '301': 'Moved Permanently，永久重定向',
  '302': 'Found，临时重定向',
  '400': 'Bad Request，错误请求',
  '401': 'Unauthorized，未授权',
  '403': 'Forbidden，禁止访问',
  '404': 'Not Found，未找到资源',
  '500': 'Internal Server Error，服务器内部错误',
  '502': 'Bad Gateway，网关错误',
  '503': 'Service Unavailable，服务不可用'
  // 可补充更多
};
function explain() {
  result.value = statusMap[code.value] || '未知状态码';
}
</script>
<style scoped>
.http-status-code { max-width: 400px; margin: 0 auto; }
</style> 