import {createRouter, createWebHistory} from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseView from '@/views/BaseView.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        // ===== 内容页面 =====
        {
          path: 'privacy',
          component: () => import('@/views/PrivacyPolicy.vue')
        },
        {
          path: 'terms',
          component: () => import('@/views/TermsOfService.vue')
        },
        {
          path: 'about',
          component: () => import('@/views/About.vue')
        },
        
        
        // ===== 格式化工具路由 =====
        {
          path: 'format',
          component: BaseView,
          children: [
            // JSON格式化
            {
              path: 'json',
              component: () => import('@/components/format/JsonFormat.vue')
            },
            // XML格式化
            {
              path: 'xml',
              component: () => import('@/components/format/XmlFormat.vue')
            },
            // YAML格式化
            {
              path: 'yaml',
              component: () => import('@/components/format/YamlFormat.vue')
            },
            // JavaScript格式化
            {
              path: 'js',
              component: () => import('@/components/format/JsFormat.vue')
            },
            // HTML格式化
            {
              path: 'html',
              component: () => import('@/components/format/HtmlFormat.vue')
            },
            // CSS格式化
            {
              path: 'css',
              component: () => import('@/components/format/CssFormat.vue')
            },
            // Java格式化
            {
              path: 'java',
              component: () => import('@/components/format/JavaFormat.vue')
            },
            // PHP格式化
            {
              path: 'php',
              component: () => import('@/components/format/PhpFormat.vue')
            },
            // Ruby格式化
            {
              path: 'ruby',
              component: () => import('@/components/format/RubyFormat.vue')
            },
            // Shell脚本格式化
            {
              path: 'shell',
              component: () => import('@/components/format/ShellFormat.vue')
            },
            // SQL格式化
            {
              path: 'sql',
              component: () => import('@/components/format/SqlFormat.vue')
            },
            // Markdown格式化
            {
              path: 'markdown',
              component: () => import('@/components/format/MarkdownFormat.vue')
            },
            // Vue格式化
            {
              path: 'vue',
              component: () => import('@/components/format/VueFormat.vue')
            }
          ]
        },

        // ===== 加密工具路由 =====
        {
          path: 'encrypt',
          component: BaseView,
          children: [
            // AES加密
            {
              path: 'aes',
              component: () => import('@/components/encrypt/AesEncrypt.vue')
            },
            // ChaCha20加密
            {
              path: 'chacha20',
              component: () => import('@/components/encrypt/ChaCha20Encrypt.vue')
            },
            // DES加密
            {
              path: 'des',
              component: () => import('@/components/encrypt/DesEncrypt.vue')
            },
            // RSA加密
            {
              path: 'rsa',
              component: () => import('@/components/encrypt/RsaEncrypt.vue')
            },
            // ECC加密
            {
              path: 'ecc',
              component: () => import('@/components/encrypt/EccEncrypt.vue')
            },

            // SHA哈希
            {
              path: 'sha',
              component: () => import('@/components/encrypt/ShaHash.vue')
            },
            // Bcrypt哈希
            {
              path: 'bcrypt',
              component: () => import('@/components/encrypt/BcryptHash.vue')
            },
            // Argon2哈希
            {
              path: 'argon2',
              component: () => import('@/components/encrypt/Argon2Hash.vue')
            },
            // ECDH密钥交换
            {
              path: 'ecdh-key-exchange',
              component: () => import('@/components/encrypt/EcdhKeyExchange.vue')
            },
            // X25519密钥交换
            {
              path: 'x25519',
              component: () => import('@/components/encrypt/X25519.vue')
            },
            // RSA签名
            {
              path: 'rsa-sign',
              component: () => import('@/components/encrypt/RsaSign.vue')
            },
            // ECDSA签名
            {
              path: 'ecdsa-sign',
              component: () => import('@/components/encrypt/EcdsaSign.vue')
            },
            // Ed25519签名
            {
              path: 'ed25519-sign',
              component: () => import('@/components/encrypt/Ed25519Sign.vue')
            },
            // Base64编解码
            {
              path: 'base64',
              component: () => import('@/components/encrypt/Base64Codec.vue')
            },
            // 十六进制编解码
            {
              path: 'hex',
              component: () => import('@/components/encrypt/HexCodec.vue')
            },
            // URL编解码
            {
              path: 'url',
              component: () => import('@/components/encrypt/UrlCodec.vue')
            },
            // HTML编解码
            {
              path: 'html',
              component: () => import('@/components/encrypt/HtmlCodec.vue')
            },
            // JWT编解码
            {
              path: 'jwt',
              component: () => import('@/components/encrypt/JwtCodec.vue')
            }
          ]
        },

        // ===== 转换工具路由 =====
        {
          path: 'convert',
          component: BaseView,
          children: [
            // 时间戳转换
            {
              path: 'timestamp',
              component: () => import('@/components/convert/Timestamp.vue')
            },
            // 日期计算
            {
              path: 'date-calc',
              component: () => import('@/components/convert/DateCalc.vue')
            },
            // 日期差异计算
            {
              path: 'date-diff',
              component: () => import('@/components/convert/DateDiff.vue')
            },
            // 数字转换
            {
              path: 'number',
              component: () => import('@/components/convert/Number.vue')
            },
            // 数字进制转换
            {
              path: 'number-base',
              component: () => import('@/components/convert/NumberBase.vue')
            },
            // 存储时间转换
            {
              path: 'storage-time',
              component: () => import('@/components/convert/StorageTime.vue')
            },
            // 单位转换
            {
              path: 'unit',
              component: () => import('@/components/convert/Unit.vue')
            },
            // 颜色转换
            {
              path: 'color',
              component: () => import('@/components/convert/Color.vue')
            },
            // 正则表达式测试
            {
              path: 'regex',
              component: () => import('@/components/convert/Regex.vue')
            },
            // Markdown预览
            {
              path: 'markdown',
              component: () => import('@/components/convert/Markdown.vue')
            },
            // HTTP状态码查询
            {
              path: 'http-status',
              component: () => import('@/components/convert/HttpStatus.vue')
            },
            // User-Agent解析
            {
              path: 'user-agent',
              component: () => import('@/components/convert/UserAgent.vue')
            },
            // 字符编码转换
            {
              path: 'char-code',
              component: () => import('@/components/convert/CharCode.vue')
            },
            // Cron 表达式解析
            {
              path: 'cron',
              component: () => import('@/components/convert/Cron.vue')
            },
            // JSON ↔ 其他格式互转
            {
              path: 'json-convert',
              component: () => import('@/components/convert/JsonConvert.vue')
            },
            // 渐变色生成器
            {
              path: 'gradient',
              component: () => import('@/components/convert/Gradient.vue')
            },
            // URL 解析器
            {
              path: 'url-parser',
              component: () => import('@/components/convert/UrlParser.vue')
            },
            // 数字大写转换
            {
              path: 'number-chinese',
              component: () => import('@/components/convert/NumberChinese.vue')
            }
          ]
        },

        // ===== 图片工具路由 =====
        {
          path: 'image',
          component: BaseView,
          children: [
            // 图片格式转换
            {
              path: 'convert',
              component: () => import('@/components/image/Convert.vue')
            },
            // 图片旋转
            {
              path: 'rotate',
              component: () => import('@/components/image/Rotate.vue')
            },
            // 图片裁剪
            {
              path: 'crop',
              component: () => import('@/components/image/Crop.vue')
            },
            // 图片水印
            {
              path: 'watermark',
              component: () => import('@/components/image/Watermark.vue')
            },
            // EXIF 查看器
            {
              path: 'exif',
              component: () => import('@/components/image/ExifViewer.vue')
            }
          ]
        },

        // ===== 文本工具路由 =====
        {
          path: 'text',
          component: BaseView,
          children: [
            // 文本工具
            {
              path: 'case',
              component: () => import('@/components/text/Case.vue')
            },
            {
              path: 'reverse',
              component: () => import('@/components/text/Reverse.vue')
            },
            {
              path: 'whitespace',
              component: () => import('@/components/text/Whitespace.vue')
            },
            {
              path: 'replace',
              component: () => import('@/components/text/Replace.vue')
            },
            // JSONPath 查询
            {
              path: 'json-path',
              component: () => import('@/components/text/JsonPathQuery.vue')
            },
            // Diff 文本对比
            {
              path: 'diff',
              component: () => import('@/components/convert/Diff.vue')
            }
          ]
        },

        // ===== 其他工具路由 =====
        {
          path: 'other',
          component: BaseView,
          children: [
            // 其他工具
            {
              path: 'qrcode',
              component: () => import('@/components/other/QRCode.vue')
            },
            {
              path: 'calculator',
              component: () => import('@/components/other/Calculator.vue')
            },
            // IP 查询
            {
              path: 'ip',
              component: () => import('@/components/other/IpQuery.vue')
            },
            // 文件哈希校验
            {
              path: 'file-hash',
              component: () => import('@/components/other/FileHash.vue')
            },
            // DNS 查询
            {
              path: 'dns',
              component: () => import('@/components/other/DnsQuery.vue')
            },
            // UUID / NanoID 生成器
            {
              path: 'uuid',
              component: () => import('@/components/other/UuidGenerator.vue')
            },
            // 随机密码生成器
            {
              path: 'password',
              component: () => import('@/components/other/PasswordGenerator.vue')
            },
            // HTTP 请求测试
            {
              path: 'http-client',
              component: () => import('@/components/other/HttpClient.vue')
            },
            // SSL 证书解析
            {
              path: 'cert-parser',
              component: () => import('@/components/other/CertParser.vue')
            },
            // Prompt 工具箱
            {
              path: 'prompt-box',
              component: () => import('@/components/other/PromptBox.vue')
            }
          ]
        },
        
        // 首页：工具导航 + 网站介绍（独立 SEO 页面）
        {
          path: '',
          component: Home
        }
      ]
    }
  ]
})

export default router 