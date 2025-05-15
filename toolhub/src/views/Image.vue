<template>
  <div class="image-view">
    <n-tabs type="line" animated>
      <!-- 图片处理 -->
      <n-tab-pane name="process" :tab="$t('image.process')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <image-compress />
          </n-grid-item>
          <n-grid-item>
            <image-convert />
          </n-grid-item>
          <n-grid-item>
            <image-rotate />
          </n-grid-item>
          <n-grid-item>
            <image-crop />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 水印处理 -->
      <n-tab-pane name="watermark" :tab="$t('image.watermark')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <image-watermark />
          </n-grid-item>
          <n-grid-item>
            <image-remove-watermark />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { NGrid, NGridItem, NTabs, NTabPane } from 'naive-ui'
import ImageCompress from '@/components/image/ImageCompress.vue'
import ImageConvert from '@/components/image/ImageConvert.vue'
import ImageRotate from '@/components/image/ImageRotate.vue'
import ImageCrop from '@/components/image/ImageCrop.vue'
import ImageWatermark from '@/components/image/ImageWatermark.vue'
import ImageRemoveWatermark from '@/components/image/ImageRemoveWatermark.vue'
</script>

<style scoped>
.image-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 