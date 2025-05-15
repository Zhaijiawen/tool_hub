<template>
  <div class="format-container">
    <n-card title="格式化工具">
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
    label: '数据格式',
    key: 'data',
    children: [
      {
        label: () => h(RouterLink, { to: '/format/json' }, { default: () => 'JSON格式化' }),
        key: 'json'
      },
      {
        label: () => h(RouterLink, { to: '/format/xml' }, { default: () => 'XML格式化' }),
        key: 'xml'
      }
    ]
  },
  {
    label: '编程语言',
    key: 'programming',
    children: [
      {
        label: () => h(RouterLink, { to: '/format/js' }, { default: () => 'JavaScript格式化' }),
        key: 'js'
      },
      {
        label: () => h(RouterLink, { to: '/format/html' }, { default: () => 'HTML格式化' }),
        key: 'html'
      },
      {
        label: () => h(RouterLink, { to: '/format/css' }, { default: () => 'CSS格式化' }),
        key: 'css'
      },
      {
        label: () => h(RouterLink, { to: '/format/python' }, { default: () => 'Python格式化' }),
        key: 'python'
      },
      {
        label: () => h(RouterLink, { to: '/format/java' }, { default: () => 'Java格式化' }),
        key: 'java'
      },
      {
        label: () => h(RouterLink, { to: '/format/csharp' }, { default: () => 'C#格式化' }),
        key: 'csharp'
      },
      {
        label: () => h(RouterLink, { to: '/format/go' }, { default: () => 'Go格式化' }),
        key: 'go'
      },
      {
        label: () => h(RouterLink, { to: '/format/php' }, { default: () => 'PHP格式化' }),
        key: 'php'
      },
      {
        label: () => h(RouterLink, { to: '/format/ruby' }, { default: () => 'Ruby格式化' }),
        key: 'ruby'
      },
      {
        label: () => h(RouterLink, { to: '/format/kotlin' }, { default: () => 'Kotlin格式化' }),
        key: 'kotlin'
      },
      {
        label: () => h(RouterLink, { to: '/format/rust' }, { default: () => 'Rust格式化' }),
        key: 'rust'
      }
    ]
  },
  {
    label: '其他语言',
    key: 'others',
    children: [
      {
        label: () => h(RouterLink, { to: '/format/shell' }, { default: () => 'Shell/Bash格式化' }),
        key: 'shell'
      },
      {
        label: () => h(RouterLink, { to: '/format/sql' }, { default: () => 'SQL格式化' }),
        key: 'sql'
      },
      {
        label: () => h(RouterLink, { to: '/format/markdown' }, { default: () => 'Markdown格式化' }),
        key: 'markdown'
      },
      {
        label: () => h(RouterLink, { to: '/format/dart' }, { default: () => 'Dart格式化' }),
        key: 'dart'
      }
    ]
  }
]
</script>

<style scoped>
.format-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 