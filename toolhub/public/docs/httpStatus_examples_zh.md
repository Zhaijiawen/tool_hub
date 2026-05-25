# HTTP 状态码 — 使用示例

## 示例 1：API 成功响应

**GET /api/users/1**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1, "name": "Alice" }
```

**POST /api/users**
```http
HTTP/1.1 201 Created
Location: /api/users/42

{ "id": 42, "name": "Bob" }
```

**DELETE /api/users/42**
```http
HTTP/1.1 204 No Content
```

## 示例 2：客户端错误场景

**缺少认证 Token：**
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer

{ "error": "需要身份验证" }
```

**普通用户访问管理员资源：**
```http
HTTP/1.1 403 Forbidden

{ "error": "权限不足" }
```

**请求体格式错误：**
```http
HTTP/1.1 400 Bad Request

{ "error": "email 字段为必填项" }
```

## 示例 3：重定向

**旧 URL 永久重定向：**
```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-path
```

## 示例 4：服务器错误

**未处理的异常：**
```http
HTTP/1.1 500 Internal Server Error

{ "error": "发生了意外错误" }

