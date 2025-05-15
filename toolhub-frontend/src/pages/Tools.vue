<template>
  <div class="tools-container">
    <n-card title="其他工具">
      <n-menu mode="horizontal" :options="menuOptions" />
      <div class="content">
        <router-view></router-view>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { NCard, NMenu } from 'naive-ui'

const menuOptions = [
  {
    label: () => h(RouterLink, { to: '/tools/calculator' }, { default: () => '计算器' }),
    key: 'calculator'
  },
  {
    label: () => h(RouterLink, { to: '/tools/http-status' }, { default: () => 'HTTP状态码解释' }),
    key: 'http-status'
  },
  {
    label: () => h(RouterLink, { to: '/tools/ip-lookup' }, { default: () => 'IP地址查询' }),
    key: 'ip-lookup'
  },
  {
    label: () => h(RouterLink, { to: '/tools/user-agent' }, { default: () => 'User-Agent解析' }),
    key: 'user-agent'
  },
  {
    label: () => h(RouterLink, { to: '/tools/regex' }, { default: () => '正则表达式工具' }),
    key: 'regex'
  },
  {
    label: () => h(RouterLink, { to: '/tools/markdown-to-html' }, { default: () => 'Markdown转HTML' }),
    key: 'markdown-to-html'
  },
  {
    label: () => h(RouterLink, { to: '/tools/qr-code' }, { default: () => '二维码工具' }),
    key: 'qr-code'
  },
  {
    label: () => h(RouterLink, { to: '/tools/short-url' }, { default: () => '短网址工具' }),
    key: 'short-url'
  },
  {
    label: () => h(RouterLink, { to: '/tools/color-picker' }, { default: () => '颜色选择器' }),
    key: 'color-picker'
  }
]
</script>

<style scoped>
.tools-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 