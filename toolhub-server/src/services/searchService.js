const tools = require('../data/tools');

/**
 * 搜索工具
 * @param {string} query - 搜索关键词
 * @returns {Array} 搜索结果
 */
function searchTools(query) {
  if (!query) return [];
  
  const searchLower = query.toLowerCase();
  return tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(searchLower) ||
      tool.description?.toLowerCase().includes(searchLower) ||
      tool.category?.toLowerCase().includes(searchLower)
    );
  });
}

module.exports = {
  searchTools
}; 