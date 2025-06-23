# ToolHub

一个集成了多种开发工具的在线工具箱。

## 功能特点

- 代码格式化
- 加密解密
- 时间戳转换
- 更多工具持续添加中...

## 技术栈

- 前端：Vue 3 + Naive UI
- 后端：Node.js + Express
- 国际化：Vue I18n

## 开发环境要求

- Node.js >= 22 (推荐使用 LTS 版本 v22.x)
- npm >= 10

## 安装

1. 克隆项目
```bash
git clone https://github.com/yourusername/toolhub.git
cd toolhub
```

2. 安装Node.js（推荐使用nvm）
```bash
# 手动安装Node.js v22 LTS
nvm install 22
nvm use 22
```

3. 安装依赖
```bash
npm run install-all
```
windows powershell需要额外执行命令
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 开发

启动开发服务器（同时启动前端和后端）：
```bash
npm start
```

单独启动后端服务：
```bash
npm run server
```

单独启动前端服务：
```bash
npm run client
```

## 访问

- 前端：http://localhost:5173
- 后端：http://localhost:3000

## 项目结构

```toolhub/
├── toolhub/          # 前端项目
├── toolhub-server/   # 后端项目
├── package.json      # 项目配置
└── README.md         # 项目说明
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者：[Your Name]
- 邮箱：[your.email@example.com]
- 项目链接：[https://github.com/yourusername/toolhub] 
