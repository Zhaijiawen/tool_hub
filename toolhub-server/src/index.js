const express = require('express');
const cors = require('cors');
const { formatCode } = require('./services/formatService');
const { searchTools } = require('./services/searchService');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 格式化接口
app.post('/api/format', async (req, res) => {
  try {
    const { code, language } = req.body;
    const formattedCode = await formatCode(code, language);
    res.json({ formattedCode });
  } catch (error) {
    console.error('Formatting error:', error);
    res.status(500).json({ error: 'Formatting failed' });
  }
});

// 搜索接口
app.post('/api/search', (req, res) => {
  try {
    const { tools, query } = req.body;
    const results = searchTools(tools, query);
    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 