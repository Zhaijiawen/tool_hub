import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * 获取所有工具
 * @param {string} locale - 语言环境
 * @returns {Promise<Array>} 工具列表
 */
export async function getAllTools(locale = 'zh-CN') {
  try {
    const response = await axios.get(`${API_BASE_URL}/tools`, {
      params: { locale }
    })
    return response.data
  } catch (error) {
    console.error('Get tools API error:', error)
    throw error
  }
}

/**
 * 按分类获取工具
 * @param {string} category - 工具分类
 * @param {string} locale - 语言环境
 * @returns {Promise<Array>} 工具列表
 */
export async function getToolsByCategory(category, locale = 'zh-CN') {
  try {
    const response = await axios.get(`${API_BASE_URL}/tools/category/${category}`, {
      params: { locale }
    })
    return response.data
  } catch (error) {
    console.error('Get tools by category API error:', error)
    throw error
  }
}

/**
 * 搜索工具
 * @param {string} keyword - 搜索关键词
 * @param {string} locale - 语言环境
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchTools(keyword, locale = 'zh-CN') {
  try {
    const response = await axios.get(`${API_BASE_URL}/tools/search`, {
      params: { keyword, locale }
    })
    return response.data
  } catch (error) {
    console.error('Search tools API error:', error)
    throw error
  }
} 