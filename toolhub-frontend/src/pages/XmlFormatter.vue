<template>
  <base-formatter
    title="XML格式化"
    placeholder="请输入XML数据"
    :format-fn="formatXml"
    :compress-fn="compressXml"
  />
</template>

<script setup lang="ts">
import BaseFormatter from '../components/BaseFormatter.vue'
import { formatXml, compressXml } from '../utils/formatter'
</script>

<style scoped>
.xml-formatter {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 