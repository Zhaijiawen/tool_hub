# ToolHub Backend Server

ToolHub 的后端服务器，提供代码格式化服务。

## 功能

- 支持多种编程语言的代码格式化
- 使用 Prettier 及其插件进行格式化
- 支持的语言包括：
  - PHP
  - Ruby
  - Java
  - Kotlin
  - Rust
  - Shell
  - SQL

## 安装

```bash
npm install
```

## 运行

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API

### POST /api/format

格式化代码接口

请求体：
```json
{
  "code": "要格式化的代码",
  "language": "编程语言"
}
```

响应：
```json
{
  "formattedCode": "格式化后的代码"
}
```

## 环境变量

- `PORT`: 服务器端口号（默认：3000） 