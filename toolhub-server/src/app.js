const express = require('express');
const cors = require('cors');
const { getAllTools, getToolsByCategory, searchTools } = require('./services/toolService');
const { formatCode } = require('./services/formatService');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 工具路由
app.get('/api/tools', (req, res) => {
  const locale = req.query.locale || 'zh-CN';
  const tools = getAllTools(locale);
  console.log('Tools data:', tools);

  res.json({
    code: 0,
    data: tools,
    message: 'success'
  });
});

app.get('/api/tools/category/:category', (req, res) => {
  const { category } = req.params;
  const locale = req.query.locale || 'zh-CN';
  const tools = getToolsByCategory(category, locale);

  res.json({
    code: 0,
    data: tools,
    message: 'success'
  });
});

app.get('/api/tools/search', (req, res) => {
  const { keyword, locale = 'zh-CN' } = req.query;
  const tools = searchTools(keyword, locale);

  res.json({
    code: 0,
    data: tools,
    message: 'success'
  });
});

// 格式化接口
app.post('/api/format', async (req, res) => {
  try {
    const { code, language } = req.body;
    const formattedCode = await formatCode(code, language);
    res.json({
      code: 0,
      data: { formattedCode },
      message: 'success'
    });
  } catch (error) {
    console.error('Format error:', error);
    res.status(500).json({
      code: 1,
      message: error.message
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; 