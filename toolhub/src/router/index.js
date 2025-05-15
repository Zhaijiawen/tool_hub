import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/format',
    name: 'Format',
    component: () => import('../views/Format.vue'),
    children: [
      {
        path: 'json',
        name: 'JsonFormat',
        component: () => import('../components/format/JsonFormat.vue')
      },
      {
        path: 'xml',
        name: 'XmlFormat',
        component: () => import('../components/format/XmlFormat.vue')
      }
      // 其他格式化工具路由
    ]
  },
  {
    path: '/encrypt',
    name: 'Encrypt',
    component: () => import('../views/Encrypt.vue'),
    children: [
      {
        path: 'aes',
        name: 'AES',
        component: () => import('../components/encrypt/AES.vue')
      }
      // 其他加密工具路由
    ]
  },
  {
    path: '/convert',
    name: 'Convert',
    component: () => import('../views/Convert.vue'),
    children: [
      {
        path: 'timestamp',
        name: 'Timestamp',
        component: () => import('../components/convert/Timestamp.vue')
      }
      // 其他转换工具路由
    ]
  },
  {
    path: '/image',
    name: 'Image',
    component: () => import('../views/Image.vue'),
    children: [
      {
        path: 'compress',
        name: 'ImageCompress',
        component: () => import('../components/image/ImageCompress.vue')
      }
      // 其他图片工具路由
    ]
  },
  {
    path: '/text',
    name: 'Text',
    component: () => import('../views/Text.vue'),
    children: [
      {
        path: 'case',
        name: 'CaseConvert',
        component: () => import('../components/text/CaseConvert.vue')
      }
      // 其他文本工具路由
    ]
  },
  {
    path: '/other',
    name: 'Other',
    component: () => import('../views/Other.vue'),
    children: [
      {
        path: 'qrcode',
        name: 'QRCode',
        component: () => import('../components/other/QRCode.vue')
      }
      // 其他工具路由
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 