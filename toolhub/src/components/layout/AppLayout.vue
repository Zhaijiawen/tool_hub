<template>
  <!-- 使用Naive UI的布局组件 -->
  <n-layout>
    <!-- 页面头部 -->
    <n-layout-header bordered>
      <div class="header-content">
        <!-- 网站Logo -->
        <div class="logo">
          <router-link to="/">
            <n-icon size="32" class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <!-- 工具箱主体（线框） -->
                <rect x="4" y="8" width="24" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
                <!-- 工具箱把手 -->
                <path d="M12 8V4C12 2.89543 12.8954 2 14 2H18C19.1046 2 20 2.89543 20 4V8" stroke="currentColor"
                  stroke-width="2" fill="none" />
                <!-- 工具箱工具图标 -->
                <path d="M10 14H14M18 14H22M10 18H14M18 18H22M10 22H14M18 22H22" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" fill="none" />
                <!-- 工具箱装饰线条 -->
                <path d="M4 12H28M4 16H28" stroke="currentColor" stroke-width="1" stroke-opacity="0.3" fill="none" />
              </svg>
            </n-icon>
            <span class="logo-text">ToolHub<span class="logo-domain">.studio</span></span>
          </router-link>
        </div>
        <!-- 主导航菜单 -->
        <n-menu mode="horizontal" :options="menuOptions" :value="activeKey" @update:value="handleMenuClick"
          :collapsed-width="64" :collapsed-icon-size="22" :indent="18" />
        <!-- 头部右侧功能区 -->
        <div class="header-right">
          <!-- 搜索和按钮容器 -->
          <div class="search-and-buttons">
            <!-- 工具搜索框 -->
            <div class="search-container">
              <tool-search ref="toolSearchRef" />
            </div>
            
            <!-- 按钮组 -->
            <div class="button-group">
              <!-- 主题切换按钮 -->
              <n-button @click="toggleTheme" class="header-button">
                <template #icon>
                  <n-icon>
                    <sun-icon v-if="isDark" />
                    <moon-icon v-else />
                  </n-icon>
                </template>
                <span class="button-text">{{ isDark ? t('common.theme.light') : t('common.theme.dark') }}</span>
              </n-button>
              <!-- 组件编排按钮 (临时隐藏) -->
              <n-button v-if="false" @click="goToComposer" class="header-button">
                <template #icon>
                  <n-icon><puzzle-icon /></n-icon>
                </template>
                <span class="button-text">{{ t('common.composer') }}</span>
              </n-button>
              <!-- 收藏当前工具 -->
              <favorite-button
                v-if="isToolPage"
                class="header-button"
                :button-props="{ class: 'header-button' }"
              />
              <!-- 分享当前工具 URL -->
              <share-button class="header-button" :button-props="{ class: 'header-button' }" />
              <!-- 语言切换下拉菜单 -->
              <n-dropdown :options="languageOptions" @select="handleLanguageSelect">
                <n-button class="header-button">
                  <span class="button-text">{{ currentLanguage }}</span>
                  <template #icon>
                    <n-icon><language-icon /></n-icon>
                  </template>
                </n-button>
              </n-dropdown>
            </div>
          </div>
        </div>
      </div>
    </n-layout-header>
    <!-- 主要内容区域 -->
    <n-layout-content class="main-content" :data-composer="route.path === '/composer'">
      <!-- 收藏工具快速导航栏 -->
      <div v-if="favorites.length > 0 && shouldShowTips" class="favorites-bar">
        <div class="favorites-inner">
          <n-text depth="3" class="favorites-label">{{ t('common.favorites.title') }}:</n-text>
          <n-space>
            <n-button
              v-for="fav in favorites"
              :key="fav.path"
              size="small"
              :type="route.path === fav.path ? 'primary' : 'default'"
              @click="router.push(fav.path)"
              class="fav-btn"
            >
              {{ getFavoriteName(fav, locale) }}
            </n-button>
          </n-space>
          <n-button size="tiny" quaternary @click="clearFavorites" class="favorites-clear-btn">
            {{ t('common.favorites.clear') }}
          </n-button>
        </div>
      </div>
      <div class="content-wrapper">
        <!-- 简化的右侧导航 -->
        <SimpleRightNav v-if="shouldShowTips" :has-favorites="favorites.length > 0" />

        <router-view></router-view>
      </div>
    </n-layout-content>
    <n-layout-footer v-if="route.path !== '/composer'" bordered>
      <div class="footer-simple-v3">
        <div class="footer-line-v3 footer-desc-v3">
          {{ $t('footer.description') }}
        </div>
        <div class="footer-line-v3 footer-contact-v3">
          {{ $t('footer.contactPrefix') }}
          <a class="footer-email-link-v3" href="mailto:pinkmaaaaan03@2925.com">{{ $t('footer.emailText') }}</a>
          {{ $t('footer.contactSuffix') }}
        </div>
        
        <!-- 网站导航链接 -->
        <div class="footer-line-v3 footer-links-v3">
            <router-link to="/about" class="footer-link-v3">{{ t('footer.about') }}</router-link>
            <span class="footer-separator-v3">|</span>
            <router-link to="/privacy" class="footer-link-v3">{{ t('footer.privacy') }}</router-link>
          <span class="footer-separator-v3">|</span>
          <router-link to="/terms" class="footer-link-v3">{{ t('footer.terms') }}</router-link>
        </div>
        
        <div class="footer-line-v3 footer-meta-v3">
          {{ $t('footer.copyright') }} |
          <a class="footer-icp-link-v3" href="https://beian.miit.gov.cn/" target="_blank">{{ $t('footer.icp') }}</a>
        </div>
      </div>
    </n-layout-footer>

    <!-- 全局快捷键帮助浮层 -->
    <n-modal v-model:show="showShortcutHelp" preset="card" :title="t('common.shortcuts.title')" style="max-width: 480px;">
      <n-list>
        <n-list-item v-for="sc in shortcutList" :key="sc.key">
          <n-thing :description="sc.desc">
            <template #header>
              <n-space>
                <n-tag v-for="k in sc.keys" :key="k" size="small" type="info" round>{{ k }}</n-tag>
              </n-space>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-modal>
  </n-layout>
</template>

<script setup>
// 导入Vue相关功能
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入主题管理
import { useTheme } from '@/composables/useTheme'
// 导入路由相关功能
import { useRouter, useRoute } from 'vue-router'
// 导入工具搜索组件
import ToolSearch from '@/components/common/ToolSearch.vue'
// 导入简化的右侧导航组件
import SimpleRightNav from '@/components/common/SimpleRightNav.vue'
// 导入分享按钮组件
import ShareButton from '@/components/common/ShareButton.vue'
// 导入收藏按钮组件
import FavoriteButton from '@/components/common/FavoriteButton.vue'
// 导入收藏管理 composable
import { useFavorites, getFavoriteName } from '@/composables/useFavorites'
// 导入语言切换工具函数（支持按需动态加载语言包）
import { setLocale } from '@/locales/index.js'
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

// 如果localStorage没有language，根据浏览器环境自动设置
if (!localStorage.getItem('language')) {
  // 获取浏览器语言
  const browserLang = navigator.language || navigator.userLanguage || 'en'
  // 判断是否为中文
  const isZh = browserLang.toLowerCase().startsWith('zh')
  const lang = isZh ? 'zh' : 'en'
  locale.value = lang
  document.documentElement.lang = lang
  localStorage.setItem('language', lang)
} else {
  document.documentElement.lang = localStorage.getItem('language')
}

// 初始化主题管理
const { isDark, toggleTheme } = useTheme()
// 初始化路由
const router = useRouter()
const route = useRoute()
// 初始化收藏管理
const { favorites, clearFavorites } = useFavorites()

// 判断当前是否为工具页面（排除首页和静态页面）
const isToolPage = computed(() => {
  const excludedPaths = ['/', '/about', '/privacy', '/terms', '/composer']
  return !excludedPaths.includes(route.path)
})

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

// 处理语言切换（动态加载语言包，按需导入减少首屏体积）
const handleLanguageSelect = async (key) => {
  await setLocale(key)
  document.documentElement.lang = key
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
            label: t('format.java.title'),
            key: 'java-format',
            path: '/format/java'
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
            label: t('format.vue.title'),
            key: 'vue-format',
            path: '/format/vue'
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
            label: t('encrypt.ecdh-key-exchange.title'),
            key: 'ecdh-key-exchange',
            path: '/encrypt/ecdh-key-exchange'
          },
          {
            label: t('encrypt.x25519.title'),
            key: 'x25519',
            path: '/encrypt/x25519'
          }
        ]
      },
      {
        label: t('encrypt.digitalSignature'),
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
        label: t('encrypt.encoding'),
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
        label: t('convert.numberGroup'),
        key: 'number',
        children: [
          {
            label: t('convert.number.title'),
            key: 'number',
            path: '/convert/number'
          },
          {
            label: t('convert.numberBase.title'),
            key: 'number-base',
            path: '/convert/number-base'
          }
        ]
      },
      {
        label: t('convert.unitGroup'),
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
            label: t('convert.charCode.title'),
            key: 'char-code',
            path: '/convert/char-code'
          },
          {
            label: t('convert.cron.title'),
            key: 'cron',
            path: '/convert/cron'
          },
          {
            label: t('convert.jsonConvert.title'),
            key: 'json-convert',
            path: '/convert/json-convert'
          },
          {
            label: t('convert.gradient.title'),
            key: 'gradient',
            path: '/convert/gradient'
          },
          {
            label: t('convert.urlParser.title'),
            key: 'url-parser',
            path: '/convert/url-parser'
          },
          {
            label: t('convert.numberChinese.title'),
            key: 'number-chinese',
            path: '/convert/number-chinese'
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
            label: t('image.exif.title'),
            key: 'image-exif',
            path: '/image/exif'
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
        label: t('text.whitespace.title'),
        key: 'text-space',
        path: '/text/whitespace'
      },
          {
            label: t('text.replace.title'),
            key: 'text-replace',
            path: '/text/replace'
          },
          {
            label: t('text.jsonPath.title'),
            key: 'json-path',
            path: '/text/json-path'
          },
          {
            label: t('convert.diff.title'),
            key: 'diff',
            path: '/text/diff'
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
      // 短链接功能暂时屏蔽
      // {
      //   label: t('other.shortUrl.title'),
      //   key: 'short-url',
      //   path: '/other/short-url'
      // },
      {
        label: t('other.calculator.title'),
        key: 'calculator',
        path: '/other/calculator'
      },
      {
        label: t('other.ip.title'),
        key: 'ip',
        path: '/other/ip'
      },
      {
        label: t('other.fileHash.title'),
        key: 'file-hash',
        path: '/other/file-hash'
      },
      {
        label: t('other.dns.title'),
        key: 'dns',
        path: '/other/dns'
      },
      {
        label: t('other.uuid.title'),
        key: 'uuid',
        path: '/other/uuid'
      },
      {
        label: t('other.password.title'),
        key: 'password',
        path: '/other/password'
      },
      {
        label: t('other.httpClient.title'),
        key: 'http-client',
        path: '/other/http-client'
      },
      {
        label: t('other.certParser.title'),
        key: 'cert-parser',
        path: '/other/cert-parser'
      },
      {
        label: t('other.promptBox.title'),
        key: 'prompt-box',
        path: '/other/prompt-box'
      }
    ]
  },
  // ===== 自定义工具 =====
  {
    label: t('custom.title'),
    key: 'custom',
    children: [
      {
        label: t('custom.scriptBox.title'),
        key: 'script-box',
        path: '/custom/script-box'
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

// 控制知识提示显示（首页、composer、静态页面均不显示侧边栏/收藏栏）
const shouldShowTips = computed(() => {
  const excludedPaths = ['/', '/composer', '/about', '/privacy', '/terms']
  return !excludedPaths.includes(route.path)
})

// 从路径中提取工具键
const getToolKeyFromPath = (path) => {
  const pathParts = path.split('/')
  if (pathParts.length >= 3) {
    return pathParts[2] // 例如 /format/json -> json
  }
  return 'default'
}

// ====================== 全局快捷键 ======================

// 搜索框组件引用
const toolSearchRef = ref(null)

// 快捷键帮助弹窗显示状态
const showShortcutHelp = ref(false)

// 快捷键列表（用于帮助弹窗展示）
const shortcutList = computed(() => [
  {
    key: 'search',
    keys: ['Ctrl', 'K'],
    desc: t('common.shortcuts.focusSearch')
  },
  {
    key: 'slash',
    keys: ['/'],
    desc: t('common.shortcuts.focusSearchSlash')
  },
  {
    key: 'help',
    keys: ['?'],
    desc: t('common.shortcuts.showHelp')
  },
  {
    key: 'escape',
    keys: ['Esc'],
    desc: t('common.shortcuts.closeOrClear')
  },
  {
    key: 'theme',
    keys: ['Ctrl', 'Shift', 'D'],
    desc: t('common.shortcuts.toggleTheme')
  }
])

// 判断当前焦点是否在输入类元素内（避免在输入时拦截按键）
function isInputFocused() {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || el.isContentEditable
}

// 全局键盘事件处理
function handleGlobalKeydown(e) {
  // Ctrl/Cmd + K → 聚焦搜索框
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    toolSearchRef.value?.focusInput()
    return
  }

  // Ctrl + Shift + D → 切换主题
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault()
    toggleTheme()
    return
  }

  // 非输入框时的快捷键
  if (!isInputFocused()) {
    // / → 聚焦搜索框
    if (e.key === '/') {
      e.preventDefault()
      toolSearchRef.value?.focusInput()
      return
    }

    // ? → 显示快捷键帮助
    if (e.key === '?') {
      e.preventDefault()
      showShortcutHelp.value = !showShortcutHelp.value
      return
    }
  }

  // Esc → 关闭快捷键帮助弹窗
  if (e.key === 'Escape' && showShortcutHelp.value) {
    e.preventDefault()
    showShortcutHelp.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  padding: 0 clamp(20px, 4vw, 60px);
  height: 64px;
  max-width: min(95vw, 1600px);
  margin: 0 auto;
  background-color: var(--background-color);
  color: var(--text-color);
}

.logo {
  display: flex;
  align-items: baseline;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 24px;
  flex-shrink: 0;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.logo span {
  display: inline-flex;
  align-items: baseline;
}

.logo-icon {
  margin-bottom: 4px;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  min-width: 0;
}

/* 桌面端：搜索和按钮在同一行 */
.search-and-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.button-group {
  display: flex;
  gap: 6px;
}

.search-container {
  width: min(280px, 20vw);
  min-width: 200px;
  flex-shrink: 1;
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

.footer-simple-v3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px clamp(20px, 4vw, 60px);
  max-width: min(95vw, 1600px);
  margin: 0 auto;
  background-color: var(--background-color);
  color: var(--text-color);
}

.footer-line-v3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--text-color);
}

.footer-email-link-v3 {
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-email-link-v3:hover {
  color: var(--primary-color);
}

.footer-icp-link-v3 {
  color: var(--text-color-secondary);
  text-decoration: none;
}

.footer-icp-link-v3:hover {
  color: var(--primary-color);
}

.footer-links-v3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-link-v3 {
  color: var(--text-color-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-link-v3:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.footer-separator-v3 {
  color: var(--text-color-3);
  margin: 0 4px;
  font-size: 12px;
}

/* 头部按钮响应式样式 */
.header-button {
  transition: all 0.2s ease;
}

.button-text {
  transition: all 0.2s ease;
}

/* 中等屏幕：隐藏按钮文字，只显示图标 */
@media (max-width: 1024px) {
  .header-button .button-text {
    display: none;
  }
  
  .search-container {
    width: min(220px, 18vw);
    min-width: 180px;
  }
  
  .header-right {
    gap: 4px;
  }
}

/* 小屏幕：优化布局对齐 */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 16px 20px;
    gap: 12px;
  }

  .logo {
    margin-right: 20px;
    flex: 1;
    min-width: 0;
  }

  .header-right {
    width: 100%;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  /* 搜索和按钮容器 */
  .search-and-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  
  .search-container {
    flex: 1;
    min-width: 0;
    max-width: none;
  }
  
  /* 按钮组 */
  .button-group {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .footer-simple-v3 {
    padding: 20px;
  }
  
  .content-wrapper {
    padding: 0 20px;
  }
  
  /* 小屏幕下恢复显示按钮文字 */
  .header-button .button-text {
    display: inline;
  }
}

/* 超小屏幕：进一步优化（<480px） */
@media (max-width: 480px) {
  .header-content {
    padding: 12px;
    gap: 8px;
  }
  
  .search-and-buttons {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .button-group {
    justify-content: center;
    gap: 4px;
  }
  
  .header-button {
    flex: 1;
    min-width: 0;
  }
  
  .header-button .button-text {
    display: none; /* 超小屏幕只显示图标 */
  }
  
  /* 超小屏幕下logo优化 */
  .logo {
    margin-right: 12px;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .logo-domain {
    font-size: 0.4em;
  }
  
  .content-wrapper {
    padding: 0 12px;
  }
}

.logo-text {
  display: inline-flex;
  align-items: baseline;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo-domain {
  color: #e0e0e0;
  font-size: 0.48em;
  margin-left: 2px;
  letter-spacing: 0;
  font-weight: normal;
}

/* 主要内容区域样式 */
.main-content {
  min-height: calc(100vh - 64px);
  background-color: var(--background-color);
}

.content-wrapper {
  max-width: min(95vw, 1600px);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 60px);
}

/* 为composer页面提供全宽布局 */
:deep(.n-layout-content) {
  background-color: var(--background-color);
}

/* 当路由是composer时，使用全宽布局 */
.main-content[data-composer="true"] .content-wrapper {
  max-width: 100%;
  padding: 0;
}

/* 收藏工具快速导航栏样式 */
.favorites-bar {
  max-width: min(95vw, 1600px);
  margin: 0 auto;
  padding: 8px clamp(20px, 4vw, 60px);
  background-color: var(--card-color);
  border-bottom: 1px solid var(--border-color);
}

.favorites-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.favorites-label {
  font-size: 13px;
  flex-shrink: 0;
}

.fav-btn {
  font-size: 12px;
}

.favorites-clear-btn {
  margin-left: auto;
  font-size: 12px;
}

/* 小屏幕下收藏栏优化 */
@media (max-width: 768px) {
  .favorites-bar {
    padding: 8px 20px;
  }
}

@media (max-width: 480px) {
  .favorites-bar {
    padding: 8px 12px;
  }

  .favorites-inner {
    gap: 8px;
  }
}
</style>