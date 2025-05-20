import { ref, watch } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'

export function useTheme() {
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  const theme = ref(isDark.value ? darkTheme : lightTheme)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    theme.value = isDark.value ? darkTheme : lightTheme
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 初始化主题
  watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
  }, { immediate: true })

  return {
    isDark,
    theme,
    toggleTheme
  }
} 