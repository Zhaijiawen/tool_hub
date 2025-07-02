import express from 'express';
import cors from 'cors';
import { formatCode } from './services/formatService.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

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