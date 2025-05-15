<template>
  <base-formatter
    title="JavaScript格式化"
    placeholder="请输入JavaScript代码"
    :format-fn="formatJs"
    :compress-fn="compressJs"
  />
</template>

<script setup lang="ts">
import BaseFormatter from '../components/BaseFormatter.vue'
import { formatJs, compressJs } from '../utils/formatter'
</script>

<style scoped>
.js-formatter {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 