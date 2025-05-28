<template>
  <!-- 使用Naive UI的布局组件 -->
  <n-layout>
    <!-- 页面头部 -->
    <n-layout-header bordered>
      <div class="header-content">
        <!-- 网站Logo -->
        <div class="logo">
          <router-link to="/">ToolHub</router-link>
        </div>
        <!-- 主导航菜单 -->
        <n-menu
          mode="horizontal"
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuClick"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :indent="18"
        />
        <!-- 头部右侧功能区 -->
        <div class="header-right">
          <!-- 工具搜索框 -->
          <div class="search-container">
            <tool-search :tools="allTools" />
          </div>

          <!-- 主题切换按钮 -->
          <n-button @click="toggleTheme">
            <template #icon>
              <n-icon>
                <sun-icon v-if="isDark" />
                <moon-icon v-else />
              </n-icon>
            </template>
            {{ isDark ? t('common.theme.light') : t('common.theme.dark') }}
          </n-button>
          <!-- 组件编排按钮 -->
          <n-button @click="goToComposer">
            <template #icon>
              <n-icon><puzzle-icon /></n-icon>
            </template>
            编排
          </n-button>
          <!-- 语言切换下拉菜单 -->
          <n-dropdown :options="languageOptions" @select="handleLanguageSelect">
            <n-button>
              {{ currentLanguage }}
              <template #icon>
                <n-icon><language-icon /></n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </div>
      </div>
    </n-layout-header>
    <!-- 主要内容区域 -->
    <n-layout-content>
      <router-view></router-view>
    </n-layout-content>
    <n-layout-footer v-if="route.path !== '/composer'" bordered>
      <div class="footer-content">
        <!-- 页脚内容区域 -->
        <div class="footer-sections">
          <!-- 关于我们 -->
          <div class="footer-section">
            <h3>{{ $t('footer.about') }}</h3>
            <p>{{ $t('footer.description') }}</p>
          </div>
          <!-- 相关链接 -->
          <div class="footer-section">
            <h3>{{ $t('footer.links') }}</h3>
            <div class="footer-links">
              <a href="https://github.com/yourusername/toolhub" target="_blank">GitHub</a>
              <a href="https://gitee.com/yourusername/toolhub" target="_blank">Gitee</a>
              <a href="mailto:your.email@example.com">{{ $t('footer.contact') }}</a>
            </div>
          </div>
          <!-- 社交媒体链接 -->
          <div class="footer-section">
            <h3>{{ $t('footer.follow') }}</h3>
            <div class="social-links">
              <a href="#" target="_blank"><n-icon><github-icon /></n-icon></a>
              <a href="#" target="_blank"><n-icon><twitter-icon /></n-icon></a>
              <a href="#" target="_blank"><n-icon><wechat-icon /></n-icon></a>
            </div>
          </div>
        </div>
        <!-- 页脚底部信息 -->
        <div class="footer-bottom">
          <div class="copyright">
            © 2024 ToolHub. {{ $t('footer.rights') }}
          </div>
          <div class="icp">
            <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备XXXXXXXX号-1</a>
          </div>
        </div>
      </div>
    </n-layout-footer>
  </n-layout>
</template>

<script setup>
// 导入Vue相关功能
import { ref, computed, watch, nextTick } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入主题管理
import { useTheme } from '@/composables/useTheme'
// 导入路由相关功能
import { useRouter, useRoute } from 'vue-router'
// 导入工具搜索组件
import ToolSearch from '@/components/common/ToolSearch.vue'
// 导入图标组件
import {
  SearchOutline as SearchIcon,
  SunnyOutline as SunIcon,
  MoonOutline as MoonIcon,
  LanguageOutline as LanguageIcon,
  LogoGithub as GithubIcon,
  LogoTwitter as TwitterIcon,
  LogoWechat as WechatIcon,
  AppsOutline as PuzzleIcon
} from '@vicons/ionicons5'

// 初始化国际化
const { t, locale } = useI18n()
// 初始化主题管理
const { isDark, toggleTheme } = useTheme()
// 初始化路由
const router = useRouter()
const route = useRoute()

// 监听主题变化，更新DOM和触发事件
watch(isDark, (newValue) => {
  document.documentElement.classList.toggle('dark', newValue)
  // 强制更新主题
  nextTick(() => {
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: newValue } }))
  })
}, { immediate: true })

// 计算当前语言显示文本
const currentLanguage = computed(() => locale.value === 'zh' ? '中文' : 'English')

// 语言选项配置
const languageOptions = [
  {
    label: '中文',
    key: 'zh'
  },
  {
    label: 'English',
    key: 'en'
  }
]

// 处理语言切换
const handleLanguageSelect = (key) => {
  locale.value = key
  localStorage.setItem('language', key)
}

// 计算当前激活的菜单项
const activeKey = computed(() => {
  const path = route.path
  for (const menu of menuOptions.value) {
    for (const item of menu.children || []) {
      if (item.path === path) {
        return item.key
      }
    }
  }
  return null
})

// 计算所有工具列表（用于搜索功能）
const allTools = computed(() => {
  return [
    // 格式化工具列表
    { name: t('format.json.title'), path: '/format/json', description: t('format.json.description'), category: t('common.format') },
    { name: t('format.xml.title'), path: '/format/xml', description: t('format.xml.description'), category: t('common.format') },
    { name: t('format.yaml.title'), path: '/format/yaml', description: t('format.yaml.description'), category: t('common.format') },
    { name: t('format.js.title'), path: '/format/js', description: t('format.js.description'), category: t('common.format') },
    { name: t('format.html.title'), path: '/format/html', description: t('format.html.description'), category: t('common.format') },
    { name: t('format.css.title'), path: '/format/css', description: t('format.css.description'), category: t('common.format') },
    { name: t('format.python.title'), path: '/format/python', description: t('format.python.description'), category: t('common.format') },
    { name: t('format.java.title'), path: '/format/java', description: t('format.java.description'), category: t('common.format') },
    { name: t('format.csharp.title'), path: '/format/csharp', description: t('format.csharp.description'), category: t('common.format') },
    { name: t('format.go.title'), path: '/format/go', description: t('format.go.description'), category: t('common.format') },
    { name: t('format.php.title'), path: '/format/php', description: t('format.php.description'), category: t('common.format') },
    { name: t('format.ruby.title'), path: '/format/ruby', description: t('format.ruby.description'), category: t('common.format') },
    { name: t('format.kotlin.title'), path: '/format/kotlin', description: t('format.kotlin.description'), category: t('common.format') },
    { name: t('format.rust.title'), path: '/format/rust', description: t('format.rust.description'), category: t('common.format') },
    { name: t('format.shell.title'), path: '/format/shell', description: t('format.shell.description'), category: t('common.format') },
    { name: t('format.sql.title'), path: '/format/sql', description: t('format.sql.description'), category: t('common.format') },
    { name: t('format.dart.title'), path: '/format/dart', description: t('format.dart.description'), category: t('common.format') },
    { name: t('format.markdown.title'), path: '/format/markdown', description: t('format.markdown.description'), category: t('common.format') },
    
    // 加密工具列表
    { name: t('encrypt.aes.title'), path: '/encrypt/aes', description: t('encrypt.aes.description'), category: t('common.encrypt') },
    { name: t('encrypt.chacha20.title'), path: '/encrypt/chacha20', description: t('encrypt.chacha20.description'), category: t('common.encrypt') },
    { name: t('encrypt.des.title'), path: '/encrypt/des', description: t('encrypt.des.description'), category: t('common.encrypt') },
    { name: t('encrypt.rsa.title'), path: '/encrypt/rsa', description: t('encrypt.rsa.description'), category: t('common.encrypt') },
    { name: t('encrypt.ecc.title'), path: '/encrypt/ecc', description: t('encrypt.ecc.description'), category: t('common.encrypt') },
    { name: t('encrypt.ed25519.title'), path: '/encrypt/ed25519', description: t('encrypt.ed25519.description'), category: t('common.encrypt') },
    { name: t('encrypt.sha.title'), path: '/encrypt/sha', description: t('encrypt.sha.description'), category: t('common.encrypt') },
    { name: t('encrypt.bcrypt.title'), path: '/encrypt/bcrypt', description: t('encrypt.bcrypt.description'), category: t('common.encrypt') },
    { name: t('encrypt.argon2.title'), path: '/encrypt/argon2', description: t('encrypt.argon2.description'), category: t('common.encrypt') },
    { name: t('encrypt.diffieHellman.title'), path: '/encrypt/diffie-hellman', description: t('encrypt.diffieHellman.description'), category: t('common.encrypt') },
    { name: t('encrypt.ecdh.title'), path: '/encrypt/ecdh', description: t('encrypt.ecdh.description'), category: t('common.encrypt') },
    { name: t('encrypt.x25519.title'), path: '/encrypt/x25519', description: t('encrypt.x25519.description'), category: t('common.encrypt') },
    { name: t('encrypt.rsaSign.title'), path: '/encrypt/rsa-sign', description: t('encrypt.rsaSign.description'), category: t('common.encrypt') },
    { name: t('encrypt.ecdsaSign.title'), path: '/encrypt/ecdsa-sign', description: t('encrypt.ecdsaSign.description'), category: t('common.encrypt') },
    { name: t('encrypt.ed25519Sign.title'), path: '/encrypt/ed25519-sign', description: t('encrypt.ed25519Sign.description'), category: t('common.encrypt') },
    { name: t('encrypt.base64.title'), path: '/encrypt/base64', description: t('encrypt.base64.description'), category: t('common.encrypt') },
    { name: t('encrypt.hex.title'), path: '/encrypt/hex', description: t('encrypt.hex.description'), category: t('common.encrypt') },
    { name: t('encrypt.url.title'), path: '/encrypt/url', description: t('encrypt.url.description'), category: t('common.encrypt') },
    { name: t('encrypt.html.title'), path: '/encrypt/html', description: t('encrypt.html.description'), category: t('common.encrypt') },
    { name: t('encrypt.jwt.title'), path: '/encrypt/jwt', description: t('encrypt.jwt.description'), category: t('common.encrypt') },
    
    // 转换工具列表
    { name: t('convert.timestamp.title'), path: '/convert/timestamp', description: t('convert.timestamp.description'), category: t('common.convert') },
    { name: t('convert.dateCalc.title'), path: '/convert/date-calc', description: t('convert.dateCalc.description'), category: t('common.convert') },
    { name: t('convert.dateDiff.title'), path: '/convert/date-diff', description: t('convert.dateDiff.description'), category: t('common.convert') },
    { name: t('convert.number.title'), path: '/convert/number', description: t('convert.number.description'), category: t('common.convert') },
    { name: t('convert.numberFormat.title'), path: '/convert/number-format', description: t('convert.numberFormat.description'), category: t('common.convert') },
    { name: t('convert.numberBase.title'), path: '/convert/number-base', description: t('convert.numberBase.description'), category: t('common.convert') },
    { name: t('convert.storageTime.title'), path: '/convert/storage-time', description: t('convert.storageTime.description'), category: t('common.convert') },
    { name: t('convert.unit.title'), path: '/convert/unit', description: t('convert.unit.description'), category: t('common.convert') },
    { name: t('convert.color.title'), path: '/convert/color', description: t('convert.color.description'), category: t('common.convert') },
    { name: t('convert.regex.title'), path: '/convert/regex', description: t('convert.regex.description'), category: t('common.convert') },
    { name: t('convert.markdown.title'), path: '/convert/markdown', description: t('convert.markdown.description'), category: t('common.convert') },
    { name: t('convert.httpStatus.title'), path: '/convert/http-status', description: t('convert.httpStatus.description'), category: t('common.convert') },
    { name: t('convert.userAgent.title'), path: '/convert/user-agent', description: t('convert.userAgent.description'), category: t('common.convert') },
    { name: t('convert.ipLookup.title'), path: '/convert/ip-lookup', description: t('convert.ipLookup.description'), category: t('common.convert') },
    { name: t('convert.charCode.title'), path: '/convert/char-code', description: t('convert.charCode.description'), category: t('common.convert') }
  ]
})

const menuOptions = computed(() => [
  {
    label: t('common.format'),
    key: 'format',
    children: [
      {
        type: 'group',
        label: t('format.dataFormat'),
        key: 'data-format-group',
        children: [
          {
            label: t('format.json.title'),
            key: 'json-format',
            path: '/format/json'
          },
          {
            label: t('format.xml.title'),
            key: 'xml-format',
            path: '/format/xml'
          },
          {
            label: t('format.yaml.title'),
            key: 'yaml-format',
            path: '/format/yaml'
          },
          {
            label: t('format.markdown.title'),
            key: 'markdown-format',
            path: '/format/markdown'
          }
        ]
      },
      {
        label: t('format.programmingLanguageFormat'),
        key: 'programming-language-format',
        children: [
          {
            label: t('format.js.title'),
            key: 'js-format',
            path: '/format/js'
          },
          {
            label: t('format.html.title'),
            key: 'html-format',
            path: '/format/html'
          },
          {
            label: t('format.css.title'),
            key: 'css-format',
            path: '/format/css'
          },
          {
            label: t('format.python.title'),
            key: 'python-format',
            path: '/format/python'
          },
          {
            label: t('format.java.title'),
            key: 'java-format',
            path: '/format/java'
          },
          {
            label: t('format.csharp.title'),
            key: 'csharp-format',
            path: '/format/csharp'
          },
          {
            label: t('format.go.title'),
            key: 'go-format',
            path: '/format/go'
          },
          {
            label: t('format.php.title'),
            key: 'php-format',
            path: '/format/php'
          },
          {
            label: t('format.ruby.title'),
            key: 'ruby-format',
            path: '/format/ruby'
          },
          {
            label: t('format.kotlin.title'),
            key: 'kotlin-format',
            path: '/format/kotlin'
          },
          {
            label: t('format.rust.title'),
            key: 'rust-format',
            path: '/format/rust'
          },
          {
            label: t('format.shell.title'),
            key: 'shell-format',
            path: '/format/shell'
          },
          {
            label: t('format.sql.title'),
            key: 'sql-format',
            path: '/format/sql'
          },
          {
            label: t('format.dart.title'),
            key: 'dart-format',
            path: '/format/dart'
          }
        ]
      }
    ]
  },
  {
    label: t('common.encrypt'),
    key: 'encrypt',
    children: [
      {
        label: t('encrypt.symmetric'),
        key: 'symmetric',
        children: [
          {
            label: t('encrypt.aes.title'),
            key: 'aes-encrypt',
            path: '/encrypt/aes'
          },
          {
            label: t('encrypt.chacha20.title'),
            key: 'chacha20-encrypt',
            path: '/encrypt/chacha20'
          },
          {
            label: t('encrypt.des.title'),
            key: 'des-encrypt',
            path: '/encrypt/des'
          }
        ]
      },
      {
        label: t('encrypt.asymmetric'),
        key: 'asymmetric',
        children: [
          {
            label: t('encrypt.rsa.title'),
            key: 'rsa-encrypt',
            path: '/encrypt/rsa'
          },
          {
            label: t('encrypt.ecc.title'),
            key: 'ecc-encrypt',
            path: '/encrypt/ecc'
          },
          {
            label: t('encrypt.ed25519.title'),
            key: 'ed25519-encrypt',
            path: '/encrypt/ed25519'
          }
        ]
      },
      {
        label: t('encrypt.hash'),
        key: 'hash',
        children: [
          {
            label: t('encrypt.sha.title'),
            key: 'sha-hash',
            path: '/encrypt/sha'
          },
          {
            label: t('encrypt.bcrypt.title'),
            key: 'bcrypt-hash',
            path: '/encrypt/bcrypt'
          },
          {
            label: t('encrypt.argon2.title'),
            key: 'argon2-hash',
            path: '/encrypt/argon2'
          }
        ]
      },
      {
        label: t('encrypt.keyExchange'),
        key: 'key-exchange',
        children: [
          {
            label: t('encrypt.diffieHellman.title'),
            key: 'diffie-hellman',
            path: '/encrypt/diffie-hellman'
          },
          {
            label: t('encrypt.ecdh.title'),
            key: 'ecdh',
            path: '/encrypt/ecdh'
          },
          {
            label: t('encrypt.x25519.title'),
            key: 'x25519',
            path: '/encrypt/x25519'
          }
        ]
      },
      {
        label: t('encrypt.signature'),
        key: 'signature',
        children: [
          {
            label: t('encrypt.rsaSign.title'),
            key: 'rsa-sign',
            path: '/encrypt/rsa-sign'
          },
          {
            label: t('encrypt.ecdsaSign.title'),
            key: 'ecdsa-sign',
            path: '/encrypt/ecdsa-sign'
          },
          {
            label: t('encrypt.ed25519Sign.title'),
            key: 'ed25519-sign',
            path: '/encrypt/ed25519-sign'
          }
        ]
      },
      {
        label: t('encrypt.codec'),
        key: 'codec',
        children: [
          {
            label: t('encrypt.base64.title'),
            key: 'base64-codec',
            path: '/encrypt/base64'
          },
          {
            label: t('encrypt.hex.title'),
            key: 'hex-codec',
            path: '/encrypt/hex'
          },
          {
            label: t('encrypt.url.title'),
            key: 'url-codec',
            path: '/encrypt/url'
          },
          {
            label: t('encrypt.html.title'),
            key: 'html-codec',
            path: '/encrypt/html'
          },
          {
            label: t('encrypt.jwt.title'),
            key: 'jwt-codec',
            path: '/encrypt/jwt'
          }
        ]
      }
    ]
  },
  {
    label: t('common.convert'),
    key: 'convert',
    children: [
      {
        label: t('convert.dateTime'),
        key: 'date-time',
        children: [
          {
            label: t('convert.timestamp.title'),
            key: 'timestamp',
            path: '/convert/timestamp'
          },
          {
            label: t('convert.dateCalc.title'),
            key: 'date-calc',
            path: '/convert/date-calc'
          },
          {
            label: t('convert.dateDiff.title'),
            key: 'date-diff',
            path: '/convert/date-diff'
          }
        ]
      },
      {
        label: t('convert.number'),
        key: 'number',
        children: [
          {
            label: t('convert.number.title'),
            key: 'number',
            path: '/convert/number'
          },
          {
            label: t('convert.numberFormat.title'),
            key: 'number-format',
            path: '/convert/number-format'
          },
          {
            label: t('convert.numberBase.title'),
            key: 'number-base',
            path: '/convert/number-base'
          }
        ]
      },
      {
        label: t('convert.unit'),
        key: 'unit',
        children: [
          {
            label: t('convert.storageTime.title'),
            key: 'storage-time',
            path: '/convert/storage-time'
          },
          {
            label: t('convert.unit.title'),
            key: 'unit',
            path: '/convert/unit'
          }
        ]
      },
      {
        label: t('convert.other'),
        key: 'other',
        children: [
          {
            label: t('convert.color.title'),
            key: 'color',
            path: '/convert/color'
          },
          {
            label: t('convert.regex.title'),
            key: 'regex',
            path: '/convert/regex'
          },
          {
            label: t('convert.markdown.title'),
            key: 'markdown',
            path: '/convert/markdown'
          },
          {
            label: t('convert.httpStatus.title'),
            key: 'http-status',
            path: '/convert/http-status'
          },
          {
            label: t('convert.userAgent.title'),
            key: 'user-agent',
            path: '/convert/user-agent'
          },
          {
            label: t('convert.ipLookup.title'),
            key: 'ip-lookup',
            path: '/convert/ip-lookup'
          },
          {
            label: t('convert.charCode.title'),
            key: 'char-code',
            path: '/convert/char-code'
          }
        ]
      }
    ]
  },
  {
    label: t('common.image'),
    key: 'image',
    children: [
      {
        label: t('image.compress.title'),
        key: 'image-compress',
        path: '/image/compress'
      },
      {
        label: t('image.convert.title'),
        key: 'image-convert',
        path: '/image/convert'
      },
      {
        label: t('image.rotate.title'),
        key: 'image-rotate',
        path: '/image/rotate'
      },
      {
        label: t('image.crop.title'),
        key: 'image-crop',
        path: '/image/crop'
      },
      {
        label: t('image.watermark.title'),
        key: 'image-watermark',
        path: '/image/watermark'
      },
      {
        label: t('image.removeWatermark.title'),
        key: 'image-remove-watermark',
        path: '/image/remove-watermark'
      }
    ]
  },
  {
    label: t('common.text'),
    key: 'text',
    children: [
      {
        label: t('text.case.title'),
        key: 'text-case',
        path: '/text/case'
      },
      {
        label: t('text.reverse.title'),
        key: 'text-reverse',
        path: '/text/reverse'
      },
      {
        label: t('text.space.title'),
        key: 'text-space',
        path: '/text/space'
      },
      {
        label: t('text.replace.title'),
        key: 'text-replace',
        path: '/text/replace'
      }
    ]
  },
  {
    label: t('common.other'),
    key: 'other',
    children: [
      {
        label: t('other.qrcode.title'),
        key: 'qrcode',
        path: '/other/qrcode'
      },
      {
        label: t('other.shortUrl.title'),
        key: 'short-url',
        path: '/other/short-url'
      },
      {
        label: t('other.ip.title'),
        key: 'ip',
        path: '/other/ip'
      },
      {
        label: t('other.calculator.title'),
        key: 'calculator',
        path: '/other/calculator'
      }
    ]
  }
])

// 处理菜单点击
const handleMenuClick = (key) => {
  // 查找对应的路由路径
  const findPath = (items) => {
    for (const item of items) {
      if (item.key === key && item.path) {
        return item.path
      }
      if (item.children) {
        const path = findPath(item.children)
        if (path) return path
      }
    }
    return null
  }

  const path = findPath(menuOptions.value)
  if (path) {
    router.push(path)
  }
}

// 添加跳转到组件编排页面的方法
const goToComposer = () => {
  router.push('/composer')
}
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--background-color);
  color: var(--text-color);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 32px;
  line-height: 1;
  height: 64px;
}

.logo a {
  color: var(--text-color);
  text-decoration: none;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-container {
  width: 300px;
}

:deep(.n-menu) {
  background-color: var(--background-color);
}

:deep(.n-menu .n-menu-item-content) {
  font-size: 13px;
  color: var(--text-color);
}

:deep(.n-menu .n-menu-item-content__icon) {
  margin-right: 8px;
  color: var(--text-color);
}

:deep(.n-menu .n-menu-item-content__text) {
  white-space: nowrap;
  color: var(--text-color);
}

:deep(.n-menu .n-menu-item-content__text) {
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.n-menu .n-menu-item-content) {
  padding: 0 12px;
}

:deep(.n-menu .n-menu-item-content--selected) {
  font-weight: bold;
  background-color: var(--menu-item-color-selected);
}

:deep(.n-menu .n-menu-item-content--collapsed) {
  padding: 0 8px;
}

:deep(.n-menu .n-menu-item-content--collapsed .n-menu-item-content__text) {
  display: none;
}

:deep(.n-menu .n-menu-item-content--collapsed .n-menu-item-content__icon) {
  margin-right: 0;
}

:deep(.n-menu .n-menu-item-content--collapsed:hover .n-menu-item-content__text) {
  display: block;
  position: absolute;
  left: 100%;
  top: 0;
  background: var(--menu-item-color);
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

/* 按钮样式 */
:deep(.n-button) {
  color: var(--button-text-color);
  background-color: var(--background-color);
  border-color: var(--border-color);
}

:deep(.n-button:hover) {
  color: var(--button-text-color-hover);
  border-color: var(--primary-color);
}

:deep(.n-button:active) {
  color: var(--primary-color);
}

/* 下拉菜单样式 */
:deep(.n-dropdown-menu) {
  background-color: var(--background-color);
  border-color: var(--border-color);
}

:deep(.n-dropdown-option) {
  color: var(--text-color);
}

:deep(.n-dropdown-option:hover) {
  background-color: var(--menu-item-color-hover);
}

:deep(.n-dropdown-option--selected) {
  background-color: var(--menu-item-color-selected);
  color: var(--primary-color);
}

/* 搜索框样式 */
:deep(.n-input) {
  background-color: var(--background-color);
  border-color: var(--border-color);
}

:deep(.n-input:hover) {
  border-color: var(--primary-color);
}

:deep(.n-input:focus) {
  border-color: var(--primary-color);
}

:deep(.n-input__input) {
  color: var(--input-text-color);
}

:deep(.n-input__input::placeholder) {
  color: var(--input-placeholder-color);
}

/* 菜单组样式 */
:deep(.n-menu-item-group__title) {
  color: var(--text-color-secondary);
}

:deep(.n-menu-item-group__content) {
  background-color: var(--background-color);
}

/* 菜单分割线样式 */
:deep(.n-menu-item-divider) {
  border-color: var(--border-color);
}

.footer-content {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--background-color);
  color: var(--text-color);
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: var(--text-color);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links a {
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  color: var(--text-color-secondary);
  font-size: 24px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.copyright {
  color: var(--text-color-secondary);
}

.icp a {
  color: var(--text-color-secondary);
  text-decoration: none;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 16px;
  }

  .logo {
    margin-right: 20px;
  }

  .header-right {
    width: 100%;
    margin-top: 16px;
    justify-content: space-between;
  }

  .footer-sections {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style> 