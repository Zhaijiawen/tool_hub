<template>
  <div class="text-view">
    <n-tabs type="line" animated>
      <!-- 文本转换 -->
      <n-tab-pane name="convert" :tab="$t('text.convert')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <text-case />
          </n-grid-item>
          <n-grid-item>
            <text-reverse />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 文本处理 -->
      <n-tab-pane name="process" :tab="$t('text.process')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <text-whitespace />
          </n-grid-item>
          <n-grid-item>
            <text-replace />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { NGrid, NGridItem, NTabs, NTabPane } from 'naive-ui'
import TextCase from '@/components/text/Case.vue'
import TextReverse from '@/components/text/Reverse.vue'
import TextWhitespace from '@/components/text/Whitespace.vue'
import TextReplace from '@/components/text/Replace.vue'
</script>

<style scoped>
.text-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 