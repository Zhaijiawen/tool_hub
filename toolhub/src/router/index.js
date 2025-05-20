import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        // 格式化工具
        {
          path: 'format/java',
          name: 'java-format',
          component: () => import('@/components/format/JavaFormat.vue')
        },
        // 加密工具
        {
          path: 'encrypt/aes',
          name: 'aes-encrypt',
          component: () => import('@/components/encrypt/AES.vue')
        },
        // 其他工具
        {
          path: 'other/qrcode',
          name: 'qrcode',
          component: () => import('@/components/other/QRCode.vue')
        },
        {
          path: 'other/calculator',
          name: 'calculator',
          component: () => import('@/components/other/Calculator.vue')
        },
        // 转换工具
        {
          path: 'convert/regex',
          name: 'regex',
          component: () => import('@/components/convert/Regex.vue')
        },
        {
          path: 'convert/unit',
          name: 'unit',
          component: () => import('@/components/convert/Unit.vue')
        },
        {
          path: 'convert/number',
          name: 'number',
          component: () => import('@/components/convert/Number.vue')
        },
        {
          path: 'convert/http-status',
          name: 'http-status',
          component: () => import('@/components/convert/HttpStatus.vue')
        },
        {
          path: 'convert/markdown',
          name: 'markdown',
          component: () => import('@/components/convert/Markdown.vue')
        },
        {
          path: 'convert/char-code',
          name: 'char-code',
          component: () => import('@/components/convert/CharCode.vue')
        },
        // 图片工具
        {
          path: 'image/compress',
          name: 'image-compress',
          component: () => import('@/components/image/Compress.vue')
        },
        {
          path: 'image/crop',
          name: 'image-crop',
          component: () => import('@/components/image/Crop.vue')
        },
        {
          path: 'image/convert',
          name: 'image-convert',
          component: () => import('@/components/image/Convert.vue')
        },
        {
          path: 'image/rotate',
          name: 'image-rotate',
          component: () => import('@/components/image/Rotate.vue')
        },
        {
          path: 'image/remove-watermark',
          name: 'image-remove-watermark',
          component: () => import('@/components/image/RemoveWatermark.vue')
        },
        {
          path: 'image/watermark',
          name: 'image-watermark',
          component: () => import('@/components/image/Watermark.vue')
        },
        // 文本工具
        {
          path: 'text/case',
          name: 'text-case',
          component: () => import('@/components/text/Case.vue')
        },
        {
          path: 'text/replace',
          name: 'text-replace',
          component: () => import('@/components/text/Replace.vue')
        }
      ]
    }
  ]
})

export default router 