<template>
  <n-layout position="absolute" style="min-height: 100vh;">
    <Header />
    <n-layout-content class="main-content">
      <div class="tool-area">
        <!-- 这里后续放格式化工具等主要内容 -->
        <h2>欢迎使用 ToolHub 在线工具站</h2>
        <p>请选择上方菜单或搜索工具</p>
      </div>
    </n-layout-content>
    <Footer />
  </n-layout>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>

<style scoped>
.main-content {
  padding: 32px 0 0 0;
  min-height: 600px;
  background: #f6f8fa;
}
.tool-area {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 32px;
  min-height: 300px;
  text-align: center;
}
</style> 