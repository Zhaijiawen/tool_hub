import {createI18n} from 'vue-i18n'
import enMessages from './en.js'
import zhMessages from './zh.js'

// 获取用户当前语言偏好
const savedLang = localStorage.getItem('language')
let defaultLocale = savedLang || 'en'

// 如果没有存储过语言，根据浏览器自动检测
if (!savedLang) {
  const browserLang = navigator.language || 'en'
  defaultLocale = browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

// 创建 i18n 实例（同步注入两份语言包，避免首屏渲染时 key 找不到的警告）
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en: enMessages,
    zh: zhMessages
  }
})

// 导出语言切换工具函数，供组件使用
export async function setLocale(locale) {
  i18n.global.locale.value = locale
}

export default i18n 