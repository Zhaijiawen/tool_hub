<template>
  <base-formatter
    ref="formatter"
    title="JSON格式化"
    placeholder="请输入JSON数据"
    :format-fn="formatJson"
    :compress-fn="compressJson"
  >
    <template #extra-buttons>
      <n-button @click="handleEscape">转义</n-button>
      <n-button @click="handleUnescape">去除转义</n-button>
    </template>
  </base-formatter>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import BaseFormatter from '../components/BaseFormatter.vue'
import { formatJson, compressJson, escapeJson, unescapeJson } from '../utils/formatter'

const formatter = ref<InstanceType<typeof BaseFormatter> | null>(null)

const handleEscape = () => {
  if (!formatter.value) return
  try {
    formatter.value.input = escapeJson(formatter.value.input)
  } catch (e) {
    // 错误处理由基础组件完成
  }
}

const handleUnescape = () => {
  if (!formatter.value) return
  try {
    formatter.value.input = unescapeJson(formatter.value.input)
  } catch (e) {
    // 错误处理由基础组件完成
  }
}
</script>

<style scoped>
.json-formatter {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 