<template>
  <n-layout>
    <n-layout-header bordered>
      <div class="header-content">
        <div class="logo">ToolHub</div>
        <n-menu mode="horizontal" :options="menuOptions" />
        <div class="header-right">
          <n-input-group>
            <n-input placeholder="搜索工具..." />
            <n-button type="primary">
              <template #icon>
                <n-icon><search-icon /></n-icon>
              </template>
            </n-button>
          </n-input-group>
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
        <div class="footer-links">
          <a href="#">友情链接</a>
          <a href="#">联系我们</a>
        </div>
        <div class="copyright">
          © 2024 ToolHub. All rights reserved.
        </div>
      </div>
    </n-layout-footer>
  </n-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import {
  Search as SearchIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Language as LanguageIcon
} from '@vicons/ionicons5'

const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()

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

const menuOptions = [
  {
    label: t('common.format'),
    key: 'format',
    children: [
      {
        label: t('format.json.title'),
        key: 'json-format'
      },
      {
        label: t('format.xml.title'),
        key: 'xml-format'
      }
    ]
  },
  {
    label: t('common.encrypt'),
    key: 'encrypt'
  },
  {
    label: t('common.convert'),
    key: 'convert'
  },
  {
    label: t('common.image'),
    key: 'image'
  },
  {
    label: t('common.text'),
    key: 'text'
  },
  {
    label: t('common.other'),
    key: 'other'
  }
]
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 64px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-right: 40px;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-content {
  padding: 20px;
  text-align: center;
}

.footer-links {
  margin-bottom: 10px;
}

.footer-links a {
  margin: 0 10px;
  color: inherit;
  text-decoration: none;
}

.copyright {
  color: #666;
}
</style> 