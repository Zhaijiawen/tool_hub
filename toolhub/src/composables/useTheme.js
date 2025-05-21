import { ref } from 'vue'
import { darkTheme } from 'naive-ui'

export function useTheme() {
  const theme = ref(null)
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  // 初始化主题
  if (isDark.value) {
    theme.value = darkTheme
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    // 直接设置主题，不使用 nextTick
    theme.value = isDark.value ? darkTheme : null
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark,
    theme,
    toggleTheme
  }
} 