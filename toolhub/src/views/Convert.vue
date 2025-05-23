<template>
  <!-- 转换工具视图容器 -->
  <div class="convert-view">
    <!-- 转换工具标签页 -->
    <n-tabs type="line" animated>
      <!-- 时间转换标签页 -->
      <n-tab-pane name="time" :tab="$t('convert.time')">
        <!-- 时间转换工具网格布局 -->
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <timestamp-convert />
          </n-grid-item>
          <n-grid-item>
            <date-diff />
          </n-grid-item>
          <n-grid-item>
            <date-calc />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 进制转换标签页 -->
      <n-tab-pane name="base" :tab="$t('convert.base')">
        <!-- 进制转换工具网格布局 -->
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <number-base />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 字符转换标签页 -->
      <n-tab-pane name="char" :tab="$t('convert.char')">
        <!-- 字符转换工具网格布局 -->
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <char-code />
          </n-grid-item>
          <n-grid-item>
            <number />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 单位转换标签页 -->
      <n-tab-pane name="unit" :tab="$t('convert.unit')">
        <!-- 单位转换工具网格布局 -->
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <unit-convert />
          </n-grid-item>
          <n-grid-item>
            <number-format />
          </n-grid-item>
          <n-grid-item>
            <storage-time />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 其他工具标签页 -->
      <n-tab-pane name="other" :tab="$t('convert.other')">
        <!-- 其他工具网格布局 -->
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <regex />
          </n-grid-item>
          <n-grid-item>
            <markdown />
          </n-grid-item>
          <n-grid-item>
            <http-status />
          </n-grid-item>
          <n-grid-item>
            <user-agent />
          </n-grid-item>
          <n-grid-item>
            <ip-lookup />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
// 导入Naive UI组件
import { NGrid, NGridItem, NTabs, NTabPane } from 'naive-ui'

// 导入时间转换相关组件
import TimestampConvert from '@/components/convert/TimestampConvert.vue'
import DateDiff from '@/components/convert/DateDiff.vue'
import DateCalc from '@/components/convert/DateCalc.vue'

// 导入进制转换相关组件
import NumberBase from '@/components/convert/NumberBase.vue'

// 导入字符转换相关组件
import CharCode from '@/components/convert/CharCode.vue'
import Number from '@/components/convert/Number.vue'

// 导入单位转换相关组件
import UnitConvert from '@/components/convert/UnitConvert.vue'
import NumberFormat from '@/components/convert/NumberFormat.vue'
import StorageTime from '@/components/convert/StorageTime.vue'

// 导入其他工具组件
import Regex from '@/components/convert/Regex.vue'
import Markdown from '@/components/convert/Markdown.vue'
import HttpStatus from '@/components/convert/HttpStatus.vue'
import UserAgent from '@/components/convert/UserAgent.vue'
import IpLookup from '@/components/convert/IpLookup.vue'
</script>

<style scoped>
/* 转换工具视图容器样式 */
.convert-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 