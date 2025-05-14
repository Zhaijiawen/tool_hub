<template>
  <n-config-provider :theme="naiveTheme">
    <n-layout position="absolute" style="min-height: 100vh;">
      <Header />
      <n-layout-content class="main-content">
        <router-view />
      </n-layout-content>
      <Footer />
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { darkTheme } from 'naive-ui';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
const theme = ref(localStorage.getItem('theme') || 'light');
const naiveTheme = computed(() => theme.value === 'dark' ? darkTheme : null);
onMounted(() => {
  const t = localStorage.getItem('theme');
  if (t) theme.value = t;
  document.documentElement.setAttribute('data-theme', theme.value);
});
window.addEventListener('storage', () => {
  const t = localStorage.getItem('theme');
  if (t) theme.value = t;
});
</script>

<style>
body[data-theme='dark'] {
  background: #18181c;
  color: #eee;
}
body[data-theme='light'] {
  background: #f6f8fa;
  color: #222;
}
</style> 