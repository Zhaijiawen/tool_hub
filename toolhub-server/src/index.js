const app = require('./app');

const port = process.env.PORT || 3000;

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 