import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Arrange from '@/views/Arrange.vue'
import Format from '@/views/Format.vue'
import Encrypt from '@/views/Encrypt.vue'
import Image from '@/views/Image.vue'
import Text from '@/views/Text.vue'
import Other from '@/views/Other.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/arrange',
      name: 'arrange',
      component: Arrange
    },
    {
      path: '/format',
      name: 'format',
      component: Format,
      children: [
        {
          path: 'json',
          name: 'json-format',
          component: () => import('@/components/format/JsonFormat.vue')
        },
        {
          path: 'xml',
          name: 'xml-format',
          component: () => import('@/components/format/XmlFormat.vue')
        },
        {
          path: 'js',
          name: 'js-format',
          component: () => import('@/components/format/JsFormat.vue')
        },
        {
          path: 'html',
          name: 'html-format',
          component: () => import('@/components/format/HtmlFormat.vue')
        },
        {
          path: 'css',
          name: 'css-format',
          component: () => import('@/components/format/CssFormat.vue')
        },
        {
          path: 'python',
          name: 'python-format',
          component: () => import('@/components/format/PythonFormat.vue')
        },
        {
          path: 'java',
          name: 'java-format',
          component: () => import('@/components/format/JavaFormat.vue')
        },
        {
          path: 'csharp',
          name: 'csharp-format',
          component: () => import('@/components/format/CsharpFormat.vue')
        },
        {
          path: 'go',
          name: 'go-format',
          component: () => import('@/components/format/GoFormat.vue')
        },
        {
          path: 'php',
          name: 'php-format',
          component: () => import('@/components/format/PhpFormat.vue')
        },
        {
          path: 'ruby',
          name: 'ruby-format',
          component: () => import('@/components/format/RubyFormat.vue')
        },
        {
          path: 'kotlin',
          name: 'kotlin-format',
          component: () => import('@/components/format/KotlinFormat.vue')
        },
        {
          path: 'rust',
          name: 'rust-format',
          component: () => import('@/components/format/RustFormat.vue')
        },
        {
          path: 'shell',
          name: 'shell-format',
          component: () => import('@/components/format/ShellFormat.vue')
        },
        {
          path: 'sql',
          name: 'sql-format',
          component: () => import('@/components/format/SqlFormat.vue')
        },
        {
          path: 'markdown',
          name: 'markdown-format',
          component: () => import('@/components/format/MarkdownFormat.vue')
        },
        {
          path: 'dart',
          name: 'dart-format',
          component: () => import('@/components/format/DartFormat.vue')
        }
      ]
    },
    {
      path: '/encrypt',
      name: 'encrypt',
      component: Encrypt,
      children: [
        {
          path: 'aes',
          name: 'aes-encrypt',
          component: () => import('@/components/encrypt/AES.vue')
        }
      ]
    },
    {
      path: '/image',
      name: 'image',
      component: Image,
      children: [
        {
          path: 'compress',
          name: 'image-compress',
          component: () => import('@/components/image/ImageTools.vue')
        }
      ]
    },
    {
      path: '/text',
      name: 'text',
      component: Text,
      children: [
        {
          path: 'replace',
          name: 'text-replace',
          component: () => import('@/components/text/TextReplace.vue')
        }
      ]
    },
    {
      path: '/other',
      name: 'other',
      component: Other,
      children: [
        {
          path: 'qrcode',
          name: 'qrcode-tool',
          component: () => import('@/components/qrcode/QRCodeTool.vue')
        },
        {
          path: 'timestamp',
          name: 'timestamp-convert',
          component: () => import('@/components/timestamp/TimestampConvert.vue')
        }
      ]
    }
  ]
})

export default router 