# ToolHub 部署说明

## 端口配置

### 开发环境
- **前端 (Vite Dev)**: 5173
- **后端 (Node.js)**: 3000
- **启动命令**: `npm start`

### 生产环境
- **前端 (Vite Preview)**: 4173
- **后端 (Node.js)**: 3000
- **启动命令**: `npm run start:prod`

## 部署选项

### 选项1: 生产环境部署（推荐）
```bash
# 启动生产环境
pm2 start ecosystem.config.js --only toolhub-production

# 或者直接运行
npm run start:prod
```

**特点:**
- 前端代码经过构建优化
- 文件压缩，加载速度更快
- 适合生产环境

### 选项2: 开发环境部署
```bash
# 启动开发环境
pm2 start ecosystem.config.js --only toolhub-development

# 或者直接运行
npm start
```

**特点:**
- 支持热重载
- 便于调试
- 适合开发测试

## Nginx 配置

当前 Nginx 配置针对**生产环境**:
- 前端: `http://localhost:4173`
- 后端: `http://localhost:3000`

如果要使用开发环境，需要修改 nginx.conf 中的端口为 5173。

## 常用命令

```bash
# 查看 PM2 状态
pm2 status

# 重启生产环境
pm2 restart toolhub-production

# 重启开发环境
pm2 restart toolhub-development

# 查看日志
pm2 logs toolhub-production

# 停止所有
pm2 stop all
``` 