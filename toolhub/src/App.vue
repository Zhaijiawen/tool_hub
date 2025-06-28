<script setup>
// 导入Naive UI的全局组件
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider } from 'naive-ui'
// 导入主题管理composable
import { useTheme } from '@/composables/useTheme'

// 获取当前主题
const { theme } = useTheme()

// 主题覆盖配置
const themeOverrides = {
  common: {
    primaryColor: '#18a058' // 设置主题色
  }
}
</script>

<template>
  <!-- Naive UI全局配置提供者 -->
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <!-- 消息提示提供者 -->
    <n-message-provider>
      <!-- 对话框提供者 -->
      <n-dialog-provider>
        <!-- 通知提供者 -->
        <n-notification-provider>
          <!-- 路由视图 -->
          <router-view />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
/* 基础样式重置 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  /* 设置系统字体 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  /* 字体平滑 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fff;
  color: #222;
}

/* 暗色主题样式 */
html.dark,
html.dark body {
  background: #18181c;
  color: #fff;
}

/* 链接样式 */
a {
  color: var(--n-primary-color);
  text-decoration: none;
  transition: color 0.3s;
}

/* 链接悬停效果 */
a:hover {
  opacity: 0.8;
}
</style>
