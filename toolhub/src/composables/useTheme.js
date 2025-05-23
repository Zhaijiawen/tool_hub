import { ref } from 'vue'
import { darkTheme } from 'naive-ui'

// 在模块级别创建响应式主题状态
const theme = ref(null)
// 从localStorage中读取主题设置，默认为亮色主题
const isDark = ref(localStorage.getItem('theme') === 'dark')

// 初始化主题设置
if (isDark.value) {
  theme.value = darkTheme
}

/**
 * 主题管理的组合式函数
 * @returns {Object} 包含主题状态和切换方法的对象
 */
export function useTheme() {
  /**
   * 切换主题的方法
   * 在亮色和暗色主题之间切换，并保存到localStorage
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.value = isDark.value ? darkTheme : null
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark,    // 当前是否为暗色主题
    theme,     // 当前主题配置
    toggleTheme // 切换主题的方法
  }
} 