import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * 搜索工具
 * @param {Array} tools - 工具列表
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchTools(tools, query) {
  try {
    const response = await axios.post(`${API_BASE_URL}/search`, {
      tools,
      query
    })
    return response.data
  } catch (error) {
    console.error('Search API error:', error)
    throw error
  }
} 