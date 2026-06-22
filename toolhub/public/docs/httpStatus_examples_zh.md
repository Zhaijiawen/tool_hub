# HTTP 状态码 -- 使用示例

## API 成功响应

这些是常见操作的 HTTP 响应。注意 `201 Created` 带了 `Location` 头 -- 这是告诉客户端新资源在哪里的标准做法。

**GET /api/users/1 -- 标准读取**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1, "name": "Alice" }
```

**POST /api/users -- 创建资源**
```http
HTTP/1.1 201 Created
Location: /api/users/42

{ "id": 42, "name": "Bob" }
```

**DELETE /api/users/42 -- 成功删除，无返回体**
```http
HTTP/1.1 204 No Content
```

---

## 客户端错误场景

这些是前端代码需要主动检查的响应。每个含义不同，处理方式也不同。

**缺失或过期的认证 token：**
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer

{ "error": "需要身份验证" }
```
`WWW-Authenticate` 头告诉客户端应该发哪种认证。对于使用 JWT 的 SPA，拦截这个响应，清除本地 token，跳回登录页。

**普通用户访问管理员接口：**
```http
HTTP/1.1 403 Forbidden

{ "error": "权限不足" }
```
和 401 不同，这里跳登录页没意义 -- 用户已经登录了。显示"无权访问"就行。

**请求体缺少必填字段：**
```http
HTTP/1.1 400 Bad Request

{ "error": "email 字段为必填项" }
```
有些 API 会返回 `422 Unprocessable Entity`。不管哪个，前端都应该把具体的字段错误展示给用户，而不是笼统地说"出错了"。

**触发限流：**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{ "error": "请求过于频繁，请 60 秒后重试" }
```
`Retry-After` 头告诉你要等多久。做得好的前端应该把请求排队，到期自动重试，或者给用户看倒计时。

---

## 重定向实战

**面向 SEO 的永久 URL 迁移：**
```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-path
```
浏览器自动跟随，搜索引擎更新索引。网站迁移时，301 是保留搜索排名的关键。

**表单提交后的临时重定向（PRG 模式）：**
```http
HTTP/1.1 302 Found
Location: /thank-you
```
Post-Redirect-Get：服务端收到 POST 处理完后，重定向到 GET 页面。防止用户刷新导致重复提交。

---

## 服务端错误场景

**应用代码未处理的异常：**
```http
HTTP/1.1 500 Internal Server Error

{ "error": "发生了意外错误" }
```
生产环境的 500 响应里千万别泄露堆栈信息。服务端记录日志，给客户端返回通用消息。

**上游 API 返回无效数据（nginx 后面）：**
```http
HTTP/1.1 502 Bad Gateway
```
看到这个先去检查上游服务是否在运行、是否返回了合法的 HTTP 响应。有时候是上游返回的内容 nginx 解析不了。

**维护模式或过载：**
```http
HTTP/1.1 503 Service Unavailable
Retry-After: 300
```
`Retry-After` 的值可以是秒数也可以是 HTTP-date。浏览器不会原生处理它，但你的 JavaScript 可以。
