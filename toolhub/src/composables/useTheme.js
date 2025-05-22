import { ref } from 'vue'
import { darkTheme } from 'naive-ui'

// 提升到模块级别
const theme = ref(null)
const isDark = ref(localStorage.getItem('theme') === 'dark')

// 初始化主题
if (isDark.value) {
  theme.value = darkTheme
}

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.value = isDark.value ? darkTheme : null
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark,
    theme,
    toggleTheme
  }
} 