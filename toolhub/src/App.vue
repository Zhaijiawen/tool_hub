<script setup>
import { useTheme } from './composables/useTheme'
import AppLayout from './components/layout/AppLayout.vue'

const { theme } = useTheme()
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <app-layout />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}

.dark {
  background-color: #18181c;
  color: #fff;
}
</style>
