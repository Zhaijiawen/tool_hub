const express = require('express');
const cors = require('cors');
const toolsRouter = require('./routes/tools');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/tools', toolsRouter);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error'
  });
});

module.exports = app; 