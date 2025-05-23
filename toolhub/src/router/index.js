import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        // ===== 格式化工具路由 =====
        // JSON格式化
        {
          path: 'format/json',
          component: () => import('@/components/format/JsonFormat.vue')
        },
        // XML格式化
        {
          path: 'format/xml',
          component: () => import('@/components/format/XmlFormat.vue')
        },
        // YAML格式化
        {
          path: 'format/yaml',
          component: () => import('@/components/format/YamlFormat.vue')
        },
        // JavaScript格式化
        {
          path: 'format/js',
          component: () => import('@/components/format/JsFormat.vue')
        },
        // HTML格式化
        {
          path: 'format/html',
          component: () => import('@/components/format/HtmlFormat.vue')
        },
        // CSS格式化
        {
          path: 'format/css',
          component: () => import('@/components/format/CssFormat.vue')
        },
        // Python格式化
        {
          path: 'format/python',
          component: () => import('@/components/format/PythonFormat.vue')
        },
        // Java格式化
        {
          path: 'format/java',
          component: () => import('@/components/format/JavaFormat.vue')
        },
        // C#格式化
        {
          path: 'format/csharp',
          component: () => import('@/components/format/CSharpFormat.vue')
        },
        // Go格式化
        {
          path: 'format/go',
          component: () => import('@/components/format/GoFormat.vue')
        },
        // PHP格式化
        {
          path: 'format/php',
          component: () => import('@/components/format/PhpFormat.vue')
        },
        // Ruby格式化
        {
          path: 'format/ruby',
          component: () => import('@/components/format/RubyFormat.vue')
        },
        // Kotlin格式化
        {
          path: 'format/kotlin',
          component: () => import('@/components/format/KotlinFormat.vue')
        },
        // Rust格式化
        {
          path: 'format/rust',
          component: () => import('@/components/format/RustFormat.vue')
        },
        // Shell脚本格式化
        {
          path: 'format/shell',
          component: () => import('@/components/format/ShellFormat.vue')
        },
        // SQL格式化
        {
          path: 'format/sql',
          component: () => import('@/components/format/SqlFormat.vue')
        },
        // Markdown格式化
        {
          path: 'format/markdown',
          component: () => import('@/components/format/MarkdownFormat.vue')
        },
        // Dart格式化
        {
          path: 'format/dart',
          component: () => import('@/components/format/DartFormat.vue')
        },

        // ===== 加密工具路由 =====
        // AES加密
        {
          path: 'encrypt/aes',
          component: () => import('@/components/encrypt/AesEncrypt.vue')
        },
        // ChaCha20加密
        {
          path: 'encrypt/chacha20',
          component: () => import('@/components/encrypt/ChaCha20Encrypt.vue')
        },
        // DES加密
        {
          path: 'encrypt/des',
          component: () => import('@/components/encrypt/DesEncrypt.vue')
        },
        // RSA加密
        {
          path: 'encrypt/rsa',
          component: () => import('@/components/encrypt/RsaEncrypt.vue')
        },
        // ECC加密
        {
          path: 'encrypt/ecc',
          component: () => import('@/components/encrypt/EccEncrypt.vue')
        },
        // Ed25519加密
        {
          path: 'encrypt/ed25519',
          component: () => import('@/components/encrypt/Ed25519Encrypt.vue')
        },
        // SHA哈希
        {
          path: 'encrypt/sha',
          component: () => import('@/components/encrypt/ShaHash.vue')
        },
        // Bcrypt哈希
        {
          path: 'encrypt/bcrypt',
          component: () => import('@/components/encrypt/BcryptHash.vue')
        },
        // Argon2哈希
        {
          path: 'encrypt/argon2',
          component: () => import('@/components/encrypt/Argon2Hash.vue')
        },
        // Diffie-Hellman密钥交换
        {
          path: 'encrypt/diffie-hellman',
          component: () => import('@/components/encrypt/DiffieHellman.vue')
        },
        // ECDH密钥交换
        {
          path: 'encrypt/ecdh',
          component: () => import('@/components/encrypt/Ecdh.vue')
        },
        // X25519密钥交换
        {
          path: 'encrypt/x25519',
          component: () => import('@/components/encrypt/X25519.vue')
        },
        // RSA签名
        {
          path: 'encrypt/rsa-sign',
          component: () => import('@/components/encrypt/RsaSign.vue')
        },
        // ECDSA签名
        {
          path: 'encrypt/ecdsa-sign',
          component: () => import('@/components/encrypt/EcdsaSign.vue')
        },
        // Ed25519签名
        {
          path: 'encrypt/ed25519-sign',
          component: () => import('@/components/encrypt/Ed25519Sign.vue')
        },
        // Base64编解码
        {
          path: 'encrypt/base64',
          component: () => import('@/components/encrypt/Base64Codec.vue')
        },
        // 十六进制编解码
        {
          path: 'encrypt/hex',
          component: () => import('@/components/encrypt/HexCodec.vue')
        },
        // URL编解码
        {
          path: 'encrypt/url',
          component: () => import('@/components/encrypt/UrlCodec.vue')
        },
        // HTML编解码
        {
          path: 'encrypt/html',
          component: () => import('@/components/encrypt/HtmlCodec.vue')
        },
        // JWT编解码
        {
          path: 'encrypt/jwt',
          component: () => import('@/components/encrypt/JwtCodec.vue')
        },

        // ===== 转换工具路由 =====
        // 时间戳转换
        {
          path: 'convert/timestamp',
          component: () => import('@/components/convert/Timestamp.vue')
        },
        // 日期计算
        {
          path: 'convert/date-calc',
          component: () => import('@/components/convert/DateCalc.vue')
        },
        // 日期差异计算
        {
          path: 'convert/date-diff',
          component: () => import('@/components/convert/DateDiff.vue')
        },
        // 数字转换
        {
          path: 'convert/number',
          component: () => import('@/components/convert/Number.vue')
        },
        // 数字格式化
        {
          path: 'convert/number-format',
          component: () => import('@/components/convert/NumberFormat.vue')
        },
        // 数字进制转换
        {
          path: 'convert/number-base',
          component: () => import('@/components/convert/NumberBase.vue')
        },
        // 存储时间转换
        {
          path: 'convert/storage-time',
          component: () => import('@/components/convert/StorageTime.vue')
        },
        // 单位转换
        {
          path: 'convert/unit',
          component: () => import('@/components/convert/Unit.vue')
        },
        // 颜色转换
        {
          path: 'convert/color',
          component: () => import('@/components/convert/Color.vue')
        },
        // 正则表达式测试
        {
          path: 'convert/regex',
          component: () => import('@/components/convert/Regex.vue')
        },
        // Markdown预览
        {
          path: 'convert/markdown',
          component: () => import('@/components/convert/Markdown.vue')
        },
        // HTTP状态码查询
        {
          path: 'convert/http-status',
          component: () => import('@/components/convert/HttpStatus.vue')
        },
        // User-Agent解析
        {
          path: 'convert/user-agent',
          component: () => import('@/components/convert/UserAgent.vue')
        },
        // IP地址查询
        {
          path: 'convert/ip-lookup',
          component: () => import('@/components/convert/IPLookup.vue')
        },
        // 字符编码转换
        {
          path: 'convert/char-code',
          component: () => import('@/components/convert/CharCode.vue')
        },

        // ===== 图片工具路由 =====
        // 图片压缩
        {
          path: 'image/compress',
          component: () => import('@/components/image/Compress.vue')
        },
        // 图片格式转换
        {
          path: 'image/convert',
          component: () => import('@/components/image/Convert.vue')
        },
        // 图片旋转
        {
          path: 'image/rotate',
          component: () => import('@/components/image/Rotate.vue')
        },
        // 图片裁剪
        {
          path: 'image/crop',
          component: () => import('@/components/image/Crop.vue')
        },
        // 图片水印
        {
          path: 'image/watermark',
          component: () => import('@/components/image/Watermark.vue')
        },
        // 图片去水印
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