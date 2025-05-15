<template>
  <n-layout>
    <n-layout-header bordered>
      <div class="header-content">
        <div class="logo">
          <router-link to="/">ToolHub</router-link>
        </div>
        <n-menu mode="horizontal" :options="menuOptions" />
        <div class="header-right">
          <tool-search :tools="allTools" />
          <n-button @click="toggleTheme">
            <template #icon>
              <n-icon>
                <sun-icon v-if="isDark" />
                <moon-icon v-else />
              </n-icon>
            </template>
          </n-button>
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
    <n-layout-content>
      <router-view></router-view>
    </n-layout-content>
    <n-layout-footer bordered>
      <div class="footer-content">
        <div class="footer-sections">
          <div class="footer-section">
            <h3>{{ $t('footer.about') }}</h3>
            <p>{{ $t('footer.description') }}</p>
          </div>
          <div class="footer-section">
            <h3>{{ $t('footer.links') }}</h3>
            <div class="footer-links">
              <a href="https://github.com/yourusername/toolhub" target="_blank">GitHub</a>
              <a href="https://gitee.com/yourusername/toolhub" target="_blank">Gitee</a>
              <a href="mailto:your.email@example.com">{{ $t('footer.contact') }}</a>
            </div>
          </div>
          <div class="footer-section">
            <h3>{{ $t('footer.follow') }}</h3>
            <div class="social-links">
              <a href="#" target="_blank"><n-icon><github-icon /></n-icon></a>
              <a href="#" target="_blank"><n-icon><twitter-icon /></n-icon></a>
              <a href="#" target="_blank"><n-icon><wechat-icon /></n-icon></a>
            </div>
          </div>
        </div>
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import { useRouter } from 'vue-router'
import ToolSearch from '@/components/common/ToolSearch.vue'
import {
  Search as SearchIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Language as LanguageIcon,
  LogoGithub as GithubIcon,
  LogoTwitter as TwitterIcon,
  LogoWechat as WechatIcon
} from '@vicons/ionicons5'

const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const router = useRouter()

const currentLanguage = computed(() => locale.value === 'zh' ? '中文' : 'English')

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

const handleLanguageSelect = (key) => {
  locale.value = key
  localStorage.setItem('language', key)
}

// 所有工具列表（用于搜索）
const allTools = computed(() => {
  return [
    // 格式化工具
    { name: t('format.json.title'), path: '/format/json', description: t('format.json.description'), category: t('common.format') },
    { name: t('format.xml.title'), path: '/format/xml', description: t('format.xml.description'), category: t('common.format') },
    // 加密工具
    { name: t('encrypt.aes.title'), path: '/encrypt/aes', description: t('encrypt.aes.description'), category: t('common.encrypt') },
    // 图片工具
    { name: t('image.compress.title'), path: '/image/compress', description: t('image.compress.description'), category: t('common.image') },
    // 文本工具
    { name: t('text.replace.title'), path: '/text/replace', description: t('text.replace.description'), category: t('common.text') },
    // 其他工具
    { name: t('other.qrcode.title'), path: '/other/qrcode', description: t('other.qrcode.description'), category: t('common.other') }
  ]
})

const menuOptions = [
  {
    label: t('common.format'),
    key: 'format',
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
      }
    ]
  },
  {
    label: t('common.encrypt'),
    key: 'encrypt',
    children: [
      {
        label: t('encrypt.aes.title'),
        key: 'aes-encrypt',
        path: '/encrypt/aes'
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
      }
    ]
  },
  {
    label: t('common.text'),
    key: 'text',
    children: [
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
      }
    ]
  }
]

// 处理菜单点击
const handleMenuClick = (key, item) => {
  if (item.path) {
    router.push(item.path)
  }
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
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-right: 40px;
}

.logo a {
  color: inherit;
  text-decoration: none;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-content {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
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
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links a {
  color: inherit;
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
  color: inherit;
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