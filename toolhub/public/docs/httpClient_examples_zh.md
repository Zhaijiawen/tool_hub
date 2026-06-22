# HTTP 请求测试 — 示例

## 简单 GET 请求

**URL：** `https://httpbin.org/get`
**方法：** GET
**Params：** `name=toolhub`，`version=1.0`

响应：
```json
{
  "args": {
    "name": "toolhub",
    "version": "1.0"
  },
  "headers": {
    "Accept": "application/json",
    "Host": "httpbin.org"
  },
  "url": "https://httpbin.org/get?name=toolhub&version=1.0"
}
```

httpbin 会把你的请求原样回显——参数、请求头、来源 IP 全有。调试 HTTP 客户端的最佳实验对象。

## POST JSON 请求

**URL：** `https://httpbin.org/post`
**方法：** POST
**Body（JSON）：**
```json
{
  "username": "admin",
  "action": "login"
}
```

响应里的 `json` 字段会把你发送的 Body 原样回显。用这个验证你的 JSON 格式正确、内容也如预期到达。

## 带认证的请求

**URL：** `https://httpbin.org/bearer`
**方法：** GET
**Headers：** `Authorization: Bearer my-token-123`

httpbin 的 `/bearer` 端点会检查 Bearer token，没有或不对就返回 401。适合测试认证头的格式。

## Form 表单提交

**URL：** `https://httpbin.org/post`
**方法：** POST
**Body（Form）：**
- `username` = `testuser`
- `password` = `123456`

响应里 `form` 字段会回显你提交的表单数据，确认被正确编码成了 `application/x-www-form-urlencoded`。

## 测自己的接口

部署前把工具指向本地开发服务器：
- `http://localhost:3000/api/users` GET 请求拿用户列表
- `http://localhost:3000/api/users` POST 加 JSON Body 创建用户

遇到 CORS 报错，服务端需要加响应头 `Access-Control-Allow-Origin: *`（或者你前端的 origin）。Express 就一行：`app.use(cors())`。

## 推荐的公开测试 API

| 服务 | 地址 | 说明 |
|------|------|------|
| httpbin | `https://httpbin.org` | 回显你的请求，调试利器 |
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | 模拟 REST API，有 posts、users、comments |
| Dog API | `https://dog.ceo/api/breeds/image/random` | 随机狗狗图片，没什么用但开心 |
