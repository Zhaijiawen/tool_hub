# HTTP 状态码 — 技术背景

## 什么是 HTTP 状态码？

HTTP 状态码是服务器对 HTTP 请求响应中返回的 3 位数字，用于告知请求结果并引导客户端后续操作。

## 状态码分类

| 范围 | 类别 | 含义 |
|---|---|---|
| 1xx | 信息性 | 请求已收到，处理继续 |
| 2xx | 成功 | 请求被成功接收、理解和处理 |
| 3xx | 重定向 | 需要进一步操作才能完成请求 |
| 4xx | 客户端错误 | 请求有语法错误或无法被执行 |
| 5xx | 服务器错误 | 服务器未能处理一个合法请求 |

## 最常见状态码

### 2xx — 成功
| 状态码 | 名称 | 说明 |
|---|---|---|
| `200` | OK | 标准成功响应 |
| `201` | Created | 资源创建成功（常见于 POST/PUT 后） |
| `204` | No Content | 成功但无响应体 |

### 3xx — 重定向
| 状态码 | 名称 | 说明 |
|---|---|---|
| `301` | Moved Permanently | URL 已永久更改（对 SEO 友好的重定向） |
| `302` | Found | 临时重定向 |
| `304` | Not Modified | 缓存版本仍然有效 |

### 4xx — 客户端错误
| 状态码 | 名称 | 说明 |
|---|---|---|
| `400` | Bad Request | 请求格式错误或参数无效 |
| `401` | Unauthorized | 需要身份验证 |
| `403` | Forbidden | 即使通过认证也拒绝访问 |
| `404` | Not Found | 资源不存在 |
| `405` | Method Not Allowed | 该接口不支持此 HTTP 方法 |
| `429` | Too Many Requests | 超过请求频率限制 |

### 5xx — 服务器错误
| 状态码 | 名称 | 说明 |
|---|---|---|
| `500` | Internal Server Error | 通用服务端错误 |
| `502` | Bad Gateway | 上游服务器返回无效响应 |
| `503` | Service Unavailable | 服务器暂时过载或宕机 |
| `504` | Gateway Timeout | 上游服务器未及时响应 |

## HTTP 状态码在 API 中的约定

RESTful API 设计规范：
- `POST` 创建资源 → `201 Created`
- `DELETE` 成功 → `204 No Content`
- 认证 Token 无效 → `401 Unauthorized`
- 权限不足 → `403 Forbidden`

