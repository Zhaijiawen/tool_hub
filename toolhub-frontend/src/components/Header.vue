<template>
  <n-layout-header bordered class="header">
    <div class="logo">toolhub</div>
    <n-menu mode="horizontal" :options="menuOptions" class="nav" @update:value="onMenuSelect" />
    <div class="search-bar">
      <n-input v-model:value="search" :placeholder="t('common.search')" @keyup.enter="onSearch" />
      <n-button @click="onArrange">{{ t('common.arrange') }}</n-button>
    </div>
    <div class="header-right">
      <n-select
        v-model:value="currentLocale"
        :options="localeOptions"
        size="small"
        style="width: 100px; margin-right: 16px;"
        @update:value="onLocaleChange"
      />
      <n-switch v-model:value="isDark" @update:value="toggleTheme">
        <template #checked>🌙</template>
        <template #unchecked>☀️</template>
      </n-switch>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const search = ref('');
const isDark = ref(localStorage.getItem('theme') === 'dark');
const currentLocale = ref(localStorage.getItem('language') || 'en');

const localeOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
];

export const menuOptions = [
  {
    label: '格式化工具',
    key: 'format',
    children: [
      {
        label: '数据格式',
        key: 'data-format',
        children: [
          {
            label: 'JSON格式化',
            key: 'json-formatter'
          },
          {
            label: 'XML格式化',
            key: 'xml-formatter'
          }
        ]
      },
      {
        label: '编程语言',
        key: 'programming',
        children: [
          {
            label: 'JavaScript格式化',
            key: 'js-formatter'
          },
          {
            label: 'HTML格式化',
            key: 'html-formatter'
          },
          {
            label: 'CSS格式化',
            key: 'css-formatter'
          },
          {
            label: 'Python格式化',
            key: 'python-formatter'
          },
          {
            label: 'Java格式化',
            key: 'java-formatter'
          },
          {
            label: 'C#格式化',
            key: 'csharp-formatter'
          },
          {
            label: 'Go格式化',
            key: 'go-formatter'
          },
          {
            label: 'PHP格式化',
            key: 'php-formatter'
          },
          {
            label: 'Ruby格式化',
            key: 'ruby-formatter'
          },
          {
            label: 'Kotlin格式化',
            key: 'kotlin-formatter'
          },
          {
            label: 'Rust格式化',
            key: 'rust-formatter'
          }
        ]
      },
      {
        label: '其他语言',
        key: 'other-languages',
        children: [
          {
            label: 'Shell/Bash格式化',
            key: 'shell-formatter'
          },
          {
            label: 'SQL格式化',
            key: 'sql-formatter'
          },
          {
            label: 'Markdown格式化',
            key: 'markdown-formatter'
          },
          {
            label: 'Dart格式化',
            key: 'dart-formatter'
          }
        ]
      }
    ]
  },
  {
    label: t('menu.crypto.label'),
    key: 'crypto',
    children: [
      { label: t('menu.crypto.aesEncrypt'), key: 'aes-encryptor' },
      { label: t('menu.crypto.rsaEncrypt'), key: 'rsa-encrypt' },
      { label: t('menu.crypto.rsaSign'), key: 'rsa-sign' },
      { label: t('menu.crypto.desEncrypt'), key: 'des-encrypt' },
      { label: t('menu.crypto.bcryptHash'), key: 'bcrypt-hash' },
      { label: t('menu.crypto.jwtCodec'), key: 'jwt-codec' },
    ]
  },
  {
    label: t('menu.convert.label'),
    key: 'convert',
    children: [
      {
        label: t('menu.convert.unit'),
        key: 'unit-converter'
      },
      {
        label: t('menu.convert.numberBase'),
        key: 'number-base-converter'
      },
      {
        label: t('menu.convert.time'),
        key: 'time-converter'
      }
    ]
  },
  {
    label: t('menu.text.label'),
    key: 'text',
    children: [
      {
        label: t('menu.text.caseConverter'),
        key: 'text-case-converter'
      },
      {
        label: t('menu.text.reverser'),
        key: 'text-reverser'
      },
      {
        label: t('menu.text.spaceHandler'),
        key: 'text-space-handler'
      },
      {
        label: t('menu.text.replacer'),
        key: 'text-replacer'
      }
    ]
  },
  {
    label: t('menu.other.label'),
    key: 'other',
    children: [
      { label: t('menu.other.calculator'), key: 'calculator' },
      { label: t('menu.other.httpStatus'), key: 'http-status-code' },
      { label: t('menu.other.shortUrl'), key: 'short-url' },
    ]
  }
];

const router = useRouter();

function onSearch() {
  if (search.value) {
    router.push({ name: 'ToolArrange', query: { add: search.value } });
  }
}

function onArrange() {
  router.push({ name: 'ToolArrange' });
}

function toggleTheme(val: boolean) {
  isDark.value = val;
  localStorage.setItem('theme', val ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
}

function onLocaleChange(val: string) {
  locale.value = val;
  localStorage.setItem('language', val);
}

watch(isDark, (val) => {
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
});

function onMenuSelect(key: string) {
  router.push(`/${key}`);
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 32px;
  background: #fff;
  height: 64px;
  box-shadow: 0 2px 8px #f0f1f2;
}
.logo {
  font-size: 22px;
  font-weight: bold;
  margin-right: 32px;
}
.nav {
  flex: 1;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 24px;
}
.header-right {
  display: flex;
  align-items: center;
}
</style> 