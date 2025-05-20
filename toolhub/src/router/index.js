import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        // 格式化工具
        {
          path: 'format/json',
          component: () => import('@/components/format/JsonFormat.vue')
        },
        {
          path: 'format/xml',
          component: () => import('@/components/format/XmlFormat.vue')
        },
        {
          path: 'format/js',
          component: () => import('@/components/format/JsFormat.vue')
        },
        {
          path: 'format/html',
          component: () => import('@/components/format/HtmlFormat.vue')
        },
        {
          path: 'format/css',
          component: () => import('@/components/format/CssFormat.vue')
        },
        {
          path: 'format/python',
          component: () => import('@/components/format/PythonFormat.vue')
        },
        {
          path: 'format/java',
          component: () => import('@/components/format/JavaFormat.vue')
        },
        {
          path: 'format/csharp',
          component: () => import('@/components/format/CSharpFormat.vue')
        },
        {
          path: 'format/go',
          component: () => import('@/components/format/GoFormat.vue')
        },
        {
          path: 'format/php',
          component: () => import('@/components/format/PhpFormat.vue')
        },
        {
          path: 'format/ruby',
          component: () => import('@/components/format/RubyFormat.vue')
        },
        {
          path: 'format/kotlin',
          component: () => import('@/components/format/KotlinFormat.vue')
        },
        {
          path: 'format/rust',
          component: () => import('@/components/format/RustFormat.vue')
        },
        {
          path: 'format/shell',
          component: () => import('@/components/format/ShellFormat.vue')
        },
        {
          path: 'format/sql',
          component: () => import('@/components/format/SqlFormat.vue')
        },
        {
          path: 'format/markdown',
          component: () => import('@/components/format/MarkdownFormat.vue')
        },
        {
          path: 'format/dart',
          component: () => import('@/components/format/DartFormat.vue')
        },

        // 加密工具
        {
          path: 'encrypt/aes',
          component: () => import('@/components/encrypt/AesEncrypt.vue')
        },
        {
          path: 'encrypt/chacha20',
          component: () => import('@/components/encrypt/ChaCha20Encrypt.vue')
        },
        {
          path: 'encrypt/des',
          component: () => import('@/components/encrypt/DesEncrypt.vue')
        },
        {
          path: 'encrypt/rsa',
          component: () => import('@/components/encrypt/RsaEncrypt.vue')
        },
        {
          path: 'encrypt/ecc',
          component: () => import('@/components/encrypt/EccEncrypt.vue')
        },
        {
          path: 'encrypt/ed25519',
          component: () => import('@/components/encrypt/Ed25519Encrypt.vue')
        },
        {
          path: 'encrypt/sha',
          component: () => import('@/components/encrypt/ShaHash.vue')
        },
        {
          path: 'encrypt/bcrypt',
          component: () => import('@/components/encrypt/BcryptHash.vue')
        },
        {
          path: 'encrypt/argon2',
          component: () => import('@/components/encrypt/Argon2Hash.vue')
        },
        {
          path: 'encrypt/diffie-hellman',
          component: () => import('@/components/encrypt/DiffieHellman.vue')
        },
        {
          path: 'encrypt/ecdh',
          component: () => import('@/components/encrypt/Ecdh.vue')
        },
        {
          path: 'encrypt/x25519',
          component: () => import('@/components/encrypt/X25519.vue')
        },
        {
          path: 'encrypt/rsa-sign',
          component: () => import('@/components/encrypt/RsaSign.vue')
        },
        {
          path: 'encrypt/ecdsa-sign',
          component: () => import('@/components/encrypt/EcdsaSign.vue')
        },
        {
          path: 'encrypt/ed25519-sign',
          component: () => import('@/components/encrypt/Ed25519Sign.vue')
        },
        {
          path: 'encrypt/base64',
          component: () => import('@/components/encrypt/Base64Codec.vue')
        },
        {
          path: 'encrypt/hex',
          component: () => import('@/components/encrypt/HexCodec.vue')
        },
        {
          path: 'encrypt/url',
          component: () => import('@/components/encrypt/UrlCodec.vue')
        },
        {
          path: 'encrypt/html',
          component: () => import('@/components/encrypt/HtmlCodec.vue')
        },
        {
          path: 'encrypt/jwt',
          component: () => import('@/components/encrypt/JwtCodec.vue')
        },

        // 转换工具
        {
          path: 'convert/timestamp',
          component: () => import('@/components/convert/Timestamp.vue')
        },
        {
          path: 'convert/date-calc',
          component: () => import('@/components/convert/DateCalc.vue')
        },
        {
          path: 'convert/date-diff',
          component: () => import('@/components/convert/DateDiff.vue')
        },
        {
          path: 'convert/number',
          component: () => import('@/components/convert/Number.vue')
        },
        {
          path: 'convert/number-format',
          component: () => import('@/components/convert/NumberFormat.vue')
        },
        {
          path: 'convert/number-base',
          component: () => import('@/components/convert/NumberBase.vue')
        },
        {
          path: 'convert/storage-time',
          component: () => import('@/components/convert/StorageTime.vue')
        },
        {
          path: 'convert/unit',
          component: () => import('@/components/convert/Unit.vue')
        },
        {
          path: 'convert/color',
          component: () => import('@/components/convert/Color.vue')
        },
        {
          path: 'convert/regex',
          component: () => import('@/components/convert/Regex.vue')
        },
        {
          path: 'convert/markdown',
          component: () => import('@/components/convert/Markdown.vue')
        },
        {
          path: 'convert/http-status',
          component: () => import('@/components/convert/HttpStatus.vue')
        },
        {
          path: 'convert/user-agent',
          component: () => import('@/components/convert/UserAgent.vue')
        },
        {
          path: 'convert/ip-lookup',
          component: () => import('@/components/convert/IPLookup.vue')
        },
        {
          path: 'convert/char-code',
          component: () => import('@/components/convert/CharCode.vue')
        },

        // 图片工具
        {
          path: 'image/compress',
          component: () => import('@/components/image/Compress.vue')
        },
        {
          path: 'image/convert',
          component: () => import('@/components/image/Convert.vue')
        },
        {
          path: 'image/rotate',
          component: () => import('@/components/image/Rotate.vue')
        },
        {
          path: 'image/crop',
          component: () => import('@/components/image/Crop.vue')
        },
        {
          path: 'image/watermark',
          component: () => import('@/components/image/Watermark.vue')
        },
        {
          path: 'image/remove-watermark',
          component: () => import('@/components/image/RemoveWatermark.vue')
        },

        // 文本工具
        {
          path: 'text/case',
          component: () => import('@/components/text/Case.vue')
        },
        {
          path: 'text/reverse',
          component: () => import('@/components/text/Reverse.vue')
        },
        {
          path: 'text/whitespace',
          component: () => import('@/components/text/Whitespace.vue')
        },
        {
          path: 'text/replace',
          component: () => import('@/components/text/Replace.vue')
        },

        // 其他工具
        {
          path: 'other/qrcode',
          component: () => import('@/components/other/QRCode.vue')
        },
        {
          path: 'other/short-url',
          component: () => import('@/components/other/ShortUrl.vue')
        },
        {
          path: 'other/ip',
          component: () => import('@/components/other/IPTools.vue')
        },
        {
          path: 'other/calculator',
          component: () => import('@/components/other/Calculator.vue')
        }
      ]
    }
  ]
})

export default router 