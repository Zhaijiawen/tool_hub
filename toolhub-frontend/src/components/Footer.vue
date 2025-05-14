<template>
  <n-layout-footer class="footer">
    <div class="footer-main">
      <span>备案号：<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2024000000号</a></span>
      <span>友情链接：
        <a href="https://json.cn" target="_blank">json.cn</a>
        <a href="https://tool.lu" target="_blank">tool.lu</a>
      </span>
      <span>版权信息：© 2024 ToolHub</span>
      <span>联系我们：<a href="mailto:contact@toolhub.com">contact@toolhub.com</a></span>
    </div>
  </n-layout-footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background: #f6f8fa;
  color: #888;
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  border-top: 1px solid #eee;
}
.footer-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
}
.footer a {
  color: #409eff;
  text-decoration: none;
  margin: 0 4px;
}
</style> 