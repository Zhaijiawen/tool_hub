# HTTP 请求测试 — 示例

## 示例一：GET 请求（公开 API）

**URL：** `https://httpbin.org/get`
**方法：** GET
**Params：** `name=toolhub`，`version=1.0`

响应示例：
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

---

## 示例二：POST JSON 请求

**URL：** `https://httpbin.org/post`
**方法：** POST
**Body（JSON）：**
```json
{
  "username": "admin",
  "action": "login"
}
```

响应中 `json` 字段会回显你发送的 Body 内容。

---

## 示例三：带 Authorization 的请求

**URL：** `https://httpbin.org/bearer`
**方法：** GET
**Headers：** `Authorization: Bearer my-token-123`

---

## 示例四：Form 表单提交

**URL：** `https://httpbin.org/post`
**方法：** POST
**Body（Form）：**
- `username` = `testuser`
- `password` = `123456`

---

## 推荐的公开测试 API

| 服务 | 地址 | 说明 |
|------|------|------|
| httpbin | `https://httpbin.org` | 回显请求内容，调试利器 |
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | 模拟 REST API |
| Dog API | `https://dog.ceo/api/breeds/image/random` | 随机获取狗狗图片 URL |

