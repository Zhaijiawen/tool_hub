<template>
  <div class="format-view">
    <n-tabs type="line" animated>
      <!-- 数据格式 -->
      <n-tab-pane name="data" :tab="$t('format.data')">
        <n-grid :cols="1" :x-gap="16">
          <n-grid-item>
            <json-format />
          </n-grid-item>
          <n-grid-item>
            <xml-format />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 编程语言 -->
      <n-tab-pane name="programming" :tab="$t('format.programming')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <js-format />
          </n-grid-item>
          <n-grid-item>
            <html-format />
          </n-grid-item>
          <n-grid-item>
            <css-format />
          </n-grid-item>
          <n-grid-item>
            <python-format />
          </n-grid-item>
          <n-grid-item>
            <java-format />
          </n-grid-item>
          <n-grid-item>
            <csharp-format />
          </n-grid-item>
          <n-grid-item>
            <go-format />
          </n-grid-item>
          <n-grid-item>
            <php-format />
          </n-grid-item>
          <n-grid-item>
            <ruby-format />
          </n-grid-item>
          <n-grid-item>
            <kotlin-format />
          </n-grid-item>
          <n-grid-item>
            <rust-format />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 其他语言 -->
      <n-tab-pane name="other" :tab="$t('format.other')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <shell-format />
          </n-grid-item>
          <n-grid-item>
            <sql-format />
          </n-grid-item>
          <n-grid-item>
            <markdown-format />
          </n-grid-item>
          <n-grid-item>
            <dart-format />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { NGrid, NGridItem, NTabs, NTabPane } from 'naive-ui'
import JsonFormat from '@/components/format/JsonFormat.vue'
import XmlFormat from '@/components/format/XmlFormat.vue'
import JsFormat from '@/components/format/JsFormat.vue'
import HtmlFormat from '@/components/format/HtmlFormat.vue'
import CssFormat from '@/components/format/CssFormat.vue'
import PythonFormat from '@/components/format/PythonFormat.vue'
import JavaFormat from '@/components/format/JavaFormat.vue'
import CsharpFormat from '@/components/format/CsharpFormat.vue'
import GoFormat from '@/components/format/GoFormat.vue'
import PhpFormat from '@/components/format/PhpFormat.vue'
import RubyFormat from '@/components/format/RubyFormat.vue'
import KotlinFormat from '@/components/format/KotlinFormat.vue'
import RustFormat from '@/components/format/RustFormat.vue'
import ShellFormat from '@/components/format/ShellFormat.vue'
import SqlFormat from '@/components/format/SqlFormat.vue'
import MarkdownFormat from '@/components/format/MarkdownFormat.vue'
import DartFormat from '@/components/format/DartFormat.vue'
</script>

<style scoped>
.format-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 