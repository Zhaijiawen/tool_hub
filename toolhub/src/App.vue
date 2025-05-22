<script setup>
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()

// 主题覆盖配置
const themeOverrides = {
  common: {
    primaryColor: '#18a058'
  }
}
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
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
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fff;
  color: #222;
}
html.dark, html.dark body {
  background: #18181c;
  color: #fff;
}

/* 链接样式 */
a {
  color: var(--n-primary-color);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  opacity: 0.8;
}
</style>
