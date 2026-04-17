import {computed, ref} from 'vue'
import {seoConfig} from '@/locales/seo'

const STORAGE_KEY = 'toolhub_favorites'

// 模块级响应式状态，确保全局共享同一份数据
const favorites = ref(loadFavorites())

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  } catch {
    // ignore
  }
}

/**
 * 根据收藏项和当前语言动态获取工具名称
 * 优先从 seoConfig 中查找当前语言的名称，fallback 到存储的 name
 * @param {{ path: string, name: string }} fav 收藏项
 * @param {string} locale 当前语言 ('zh' | 'en')
 * @returns {string} 工具名称
 */
export function getFavoriteName(fav, locale) {
  // 从路径中提取 seoKey，路径格式为 /category/toolKey
  const pathParts = (fav.path || '').split('/')
  const seoKey = pathParts[pathParts.length - 1]
  const lang = locale === 'zh' ? 'zh' : 'en'
  return seoConfig[seoKey]?.[lang]?.name || fav.name || seoKey
}

/**
 * 工具收藏管理 composable
 * favorites 存储格式：{ path, name, category }
 */
export function useFavorites() {
  /**
   * 判断某个路径的工具是否已被收藏
   * @param {string} path 工具路由路径
   */
  const isFavorited = (path) => {
    return favorites.value.some(f => f.path === path)
  }

  /**
   * 添加收藏
   * @param {{ path: string, name: string, category?: string }} tool
   */
  const addFavorite = (tool) => {
    if (!isFavorited(tool.path)) {
      favorites.value = [{ ...tool }, ...favorites.value]
      saveFavorites()
    }
  }

  /**
   * 取消收藏
   * @param {string} path 工具路由路径
   */
  const removeFavorite = (path) => {
    favorites.value = favorites.value.filter(f => f.path !== path)
    saveFavorites()
  }

  /**
   * 切换收藏状态
   * @param {{ path: string, name: string, category?: string }} tool
   */
  const toggleFavorite = (tool) => {
    if (isFavorited(tool.path)) {
      removeFavorite(tool.path)
    } else {
      addFavorite(tool)
    }
  }

  /**
   * 清空所有收藏
   */
  const clearFavorites = () => {
    favorites.value = []
    saveFavorites()
  }

  return {
    favorites: computed(() => favorites.value),
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites
  }
}

