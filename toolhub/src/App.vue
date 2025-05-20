<script setup>
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
:root {
  --primary-color: #18a058;
  --text-color: #333;
  --text-color-secondary: #666;
  --border-color: #eee;
  --background-color: #fff;
}

.dark {
  --primary-color: #63e2b7;
  --text-color: #fff;
  --text-color-secondary: #999;
  --border-color: #333;
  --background-color: #18181c;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
}

#app {
  height: 100%;
}
</style>
