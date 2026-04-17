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
 * 路径末段到 seoConfig key 的映射
 * 解决两类问题：
 *   1. 相同路径末段在不同 category 下含义不同（如 html/markdown）
 *   2. 路径使用 kebab-case 但 seoConfig 使用 camelCase（如 url-parser→urlParser）
 * key: "category/pathTail" 或纯 pathTail（当 category 无关时）
 * value: seoConfig 中实际使用的 key
 */
const PATH_SEO_KEY_MAP = {
  // category 消歧义
  'encrypt/html': 'htmlCodec',    // /encrypt/html 是 HTML 编解码器，与 /format/html 不同
  'convert/markdown': 'markdown', // /convert/markdown 与 /format/markdown 共享同一 SEO
  'image/convert': 'convert',     // /image/convert → seoConfig 的 convert key

  // kebab-case → camelCase 映射
  'file-hash': 'fileHash',
  'json-convert': 'jsonConvert',
  'url-parser': 'urlParser',
  'json-path': 'jsonPath',
  'number-chinese': 'numberChinese',
}

/**
 * 根据收藏项和当前语言动态获取工具名称
 * 优先从 seoConfig 中查找当前语言的名称，fallback 到存储的 name
 * @param {{ path: string, name: string }} fav 收藏项
 * @param {string} locale 当前语言 ('zh' | 'en')
 * @returns {string} 工具名称
 */
export function getFavoriteName(fav, locale) {
  const pathParts = (fav.path || '').split('/').filter(Boolean)
  const lastSegment = pathParts[pathParts.length - 1]          // 路径末段，如 "url-parser"
  const pathTail = pathParts.slice(-2).join('/')               // 后两段，如 "convert/url-parser"
  // 查找优先级：category/toolKey 组合 > 纯末段（均查映射表） > 原始末段
  const resolvedKey = PATH_SEO_KEY_MAP[pathTail] ?? PATH_SEO_KEY_MAP[lastSegment] ?? lastSegment
  const lang = locale === 'zh' ? 'zh' : 'en'
  return seoConfig[resolvedKey]?.[lang]?.name || fav.name || resolvedKey
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

