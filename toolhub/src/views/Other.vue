<template>
  <div class="other-view">
    <n-tabs type="line" animated>
      <!-- 二维码工具 -->
      <n-tab-pane name="qrcode" :tab="$t('other.qrcode.title')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <qrcode-tool />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 短网址工具 -->
      <n-tab-pane name="shortUrl" :tab="$t('other.shortUrl.title')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <short-url-tool />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- IP工具 -->
      <n-tab-pane name="ipTools" :tab="$t('other.ipTools.title')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <ip-tools />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 网页计算器 -->
      <n-tab-pane name="calculator" :tab="$t('other.calculator.title')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <calculator />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { NGrid, NGridItem, NTabs, NTabPane } from 'naive-ui'
import QrcodeTool from '@/components/other/QrcodeTool.vue'
import ShortUrlTool from '@/components/other/ShortUrlTool.vue'
import IpTools from '@/components/other/IpTools.vue'
import Calculator from '@/components/other/Calculator.vue'
</script>

<style scoped>
.other-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 