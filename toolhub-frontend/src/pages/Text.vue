<template>
  <div class="text-container">
    <n-card title="文本工具">
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
    label: () => h(RouterLink, { to: '/text/case-converter' }, { default: () => '大小写转换' }),
    key: 'case-converter'
  },
  {
    label: () => h(RouterLink, { to: '/text/reverser' }, { default: () => '字符串反转' }),
    key: 'reverser'
  },
  {
    label: () => h(RouterLink, { to: '/text/space-handler' }, { default: () => '空格处理' }),
    key: 'space-handler'
  },
  {
    label: () => h(RouterLink, { to: '/text/replacer' }, { default: () => '文本替换' }),
    key: 'replacer'
  }
]
</script>

<style scoped>
.text-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 