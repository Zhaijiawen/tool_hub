# HTTP 请求测试 — 技术背景

## 什么是 HTTP？

HTTP（HyperText Transfer Protocol，超文本传输协议）是互联网上应用最广泛的应用层协议，用于客户端与服务器之间的数据传输。现代 API 通信几乎都基于 HTTP/HTTPS。

## 常用请求方法

| 方法 | 语义 | 是否有 Body |
|------|------|-------------|
| GET | 获取资源 | 否 |
| POST | 创建资源 | 是 |
| PUT | 全量更新资源 | 是 |
| PATCH | 部分更新资源 | 是 |
| DELETE | 删除资源 | 可选 |
| HEAD | 获取响应头（无 Body） | 否 |
| OPTIONS | 获取服务端支持的方法 | 否 |

## 请求组成

一个 HTTP 请求由以下部分组成：

- **请求行**：方法 + URL + 协议版本
- **请求头（Headers）**：键值对，传递元信息，如 `Content-Type`、`Authorization`
- **Query Params**：URL `?` 后面的键值对，如 `?page=1&size=20`
- **请求体（Body）**：POST/PUT/PATCH 等方法携带的数据

## 什么是 CORS？

CORS（Cross-Origin Resource Sharing，跨域资源共享）是浏览器的安全机制，限制网页脚本向不同源（协议+域名+端口）的服务器发送请求。

- 若目标 API 未配置 CORS 响应头，浏览器会拦截响应
- 服务端通过 `Access-Control-Allow-Origin` 等响应头授权跨域请求
- `curl`、Postman 等非浏览器工具不受 CORS 限制

## 常见状态码

| 范围 | 含义 | 示例 |
|------|------|------|
| 2xx | 成功 | 200 OK, 201 Created |
| 3xx | 重定向 | 301 Moved, 302 Found |
| 4xx | 客户端错误 | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | 服务端错误 | 500 Internal Server Error, 502 Bad Gateway |

