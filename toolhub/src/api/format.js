import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * 格式化代码
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string>} 格式化后的代码
 */
export async function formatCode(code, language) {
  try {
    const response = await axios.post(`${API_BASE_URL}/format`, {
      code,
      language
    })
    return response.data.formattedCode
  } catch (error) {
    console.error('Format code API error:', error)
    throw error
  }
} 