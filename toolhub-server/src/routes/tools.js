const express = require('express');
const router = express.Router();
const tools = require('../data/tools');

// 获取所有工具信息
router.get('/', (req, res) => {
  res.json({
    code: 0,
    data: tools,
    message: 'success'
  });
});

// 按分类获取工具信息
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const filteredTools = tools.filter(tool => tool.category === category);
  
  res.json({
    code: 0,
    data: filteredTools,
    message: 'success'
  });
});

// 搜索工具
router.get('/search', (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.json({
      code: 0,
      data: tools,
      message: 'success'
    });
  }

  const searchResults = tools.filter(tool => {
    const searchStr = `${tool.name} ${tool.description}`.toLowerCase();
    return searchStr.includes(keyword.toLowerCase());
  });

  res.json({
    code: 0,
    data: searchResults,
    message: 'success'
  });
});

module.exports = router; 