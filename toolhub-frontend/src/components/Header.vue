<template>
  <n-layout-header bordered class="header">
    <div class="logo">toolhub</div>
    <n-menu mode="horizontal" :options="menuOptions" class="nav" @update:value="onMenuSelect" />
    <div class="search-bar">
      <n-input v-model:value="search" placeholder="搜索工具..." @keyup.enter="onSearch" />
      <n-button @click="onArrange">编排</n-button>
    </div>
    <n-switch v-model:value="isDark" @update:value="toggleTheme">
      <template #checked>🌙</template>
      <template #unchecked>☀️</template>
    </n-switch>
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const search = ref('');
const isDark = ref(localStorage.getItem('theme') === 'dark');
const menuOptions = [
  { label: '格式化工具', key: 'format' },
  { label: '加密工具', key: 'crypto' },
  { label: '转换工具', key: 'convert' },
  { label: '图片工具', key: 'image' },
  { label: '文本工具', key: 'text' },
  { label: '其他工具', key: 'other' },
];
const router = useRouter();
function onSearch() {
  if (search.value) {
    // 跳转到编排页并添加工具
    router.push({ name: 'ToolArrange', query: { add: search.value } });
  }
}
function onArrange() {
  router.push({ name: 'ToolArrange' });
}
function toggleTheme(val: boolean) {
  isDark.value = val;
  localStorage.setItem('theme', val ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
}
watch(isDark, (val) => {
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
});
function onMenuSelect(key: string) {
  // 可根据key跳转到对应页面
  if (key === 'format') {
    router.push('/json-formatter');
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 32px;
  background: #fff;
  height: 64px;
  box-shadow: 0 2px 8px #f0f1f2;
}
.logo {
  font-size: 22px;
  font-weight: bold;
  margin-right: 32px;
}
.nav {
  flex: 1;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 24px;
}
</style> 