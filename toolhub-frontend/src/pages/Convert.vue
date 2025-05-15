<template>
  <div class="convert-container">
    <n-card title="转换工具">
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
    label: () => h(RouterLink, { to: '/convert/unit' }, { default: () => '单位转换' }),
    key: 'unit'
  },
  {
    label: () => h(RouterLink, { to: '/convert/number-base' }, { default: () => '进制转换' }),
    key: 'number-base'
  },
  {
    label: () => h(RouterLink, { to: '/convert/time' }, { default: () => '时间转换' }),
    key: 'time'
  },
  {
    label: () => h(RouterLink, { to: '/convert/char' }, { default: () => '字符转换' }),
    key: 'char'
  },
  {
    label: () => h(RouterLink, { to: '/convert/number' }, { default: () => '数值转换' }),
    key: 'number'
  }
]
</script>

<style scoped>
.convert-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 