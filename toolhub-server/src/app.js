import express from 'express';
import cors from 'cors';
import { getAllTools, getToolsByCategory, searchTools } from './services/toolService.js';
import { formatCode } from './services/formatService.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 工具路由
app.get('/api/tools', (req, res) => {
  const locale = req.query.locale || 'zh-CN';
  const tools = getAllTools(locale);
  // console.log('Tools data:', tools);

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
    res.json({
      code: 1,
      data: null,
      message: error.message
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(200).json({
    code: 1,
    data: null,
    message: err.message || 'Internal Server Error'
  });
});

export default app; 