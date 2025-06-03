import tools from '../data/tools.js';
import zhCN from '../locales/zh-CN.js';
import enUS from '../locales/en-US.js';

// 获取本地化的工具信息
const getLocalizedTools = (tools, translations) => {
  return tools.map(tool => ({
    id: tool.id,
    name: translations[tool.category][tool.id].title,
    description: translations[tool.category][tool.id].description,
    path: tool.path,
    category: tool.category
  }));
};

// 获取所有工具
const getAllTools = (locale = 'zh-CN') => {
  const translations = locale && locale.startsWith('zh') ? zhCN : enUS;
  return getLocalizedTools(tools, translations);
};

// 按分类获取工具
const getToolsByCategory = (category, locale = 'zh-CN') => {
  const translations = locale && locale.startsWith('zh') ? zhCN : enUS;
  const filteredTools = tools.filter(tool => tool.category === category);
  return getLocalizedTools(filteredTools, translations);
};

// 搜索工具
const searchTools = (keyword, locale = 'zh-CN') => {
  const translations = locale && locale.startsWith('zh') ? zhCN : enUS;

  if (!keyword) {
    return getLocalizedTools(tools, translations);
  }

  const searchResults = tools.filter(tool => {
    const zhTitle = zhCN[tool.category][tool.id].title;
    const zhDesc = zhCN[tool.category][tool.id].description;
    const enTitle = enUS[tool.category][tool.id].title;
    const enDesc = enUS[tool.category][tool.id].description;
    
    const searchStr = `${zhTitle} ${zhDesc} ${enTitle} ${enDesc}`.toLowerCase();
    return searchStr.includes(keyword.toLowerCase());
  });

  return getLocalizedTools(searchResults, translations);
};

export {
  getAllTools,
  getToolsByCategory,
  searchTools
}; 