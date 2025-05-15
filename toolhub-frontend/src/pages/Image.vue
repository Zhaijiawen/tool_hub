<template>
  <div class="image-container">
    <n-card title="图片工具">
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
    label: () => h(RouterLink, { to: '/image/compressor' }, { default: () => '图片压缩' }),
    key: 'compressor'
  },
  {
    label: () => h(RouterLink, { to: '/image/converter' }, { default: () => '图片转换' }),
    key: 'converter'
  },
  {
    label: () => h(RouterLink, { to: '/image/cropper' }, { default: () => '图片裁剪' }),
    key: 'cropper'
  },
  {
    label: () => h(RouterLink, { to: '/image/rotator' }, { default: () => '图片旋转' }),
    key: 'rotator'
  },
  {
    label: () => h(RouterLink, { to: '/image/watermarker' }, { default: () => '图片水印' }),
    key: 'watermarker'
  },
  {
    label: () => h(RouterLink, { to: '/image/watermark-remover' }, { default: () => '图片去水印' }),
    key: 'watermark-remover'
  }
]
</script>

<style scoped>
.image-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 