import { createI18n } from 'vue-i18n'

// 获取用户当前语言偏好
const savedLang = localStorage.getItem('language')
let defaultLocale = savedLang || 'en'

// 如果没有存储过语言，根据浏览器自动检测
if (!savedLang) {
  const browserLang = navigator.language || 'en'
  defaultLocale = browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

// 动态导入语言包（仅加载当前语言，减少首屏体积）
async function loadLocaleMessages(locale) {
  if (locale === 'zh') {
    const { default: zhMessages } = await import('./zh.js')
    return zhMessages
  } else {
    const { default: enMessages } = await import('./en.js')
    return enMessages
  }
}

// 创建 i18n 实例（初始为空消息，避免阻塞首屏）
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {}
})

// 异步加载当前语言包并注入
loadLocaleMessages(defaultLocale).then((messages) => {
  i18n.global.setLocaleMessage(defaultLocale, messages)
})

// 导出语言切换工具函数，供组件使用
export async function setLocale(locale) {
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await loadLocaleMessages(locale)
    i18n.global.setLocaleMessage(locale, messages)
  }
  i18n.global.locale.value = locale
}

export default i18n 