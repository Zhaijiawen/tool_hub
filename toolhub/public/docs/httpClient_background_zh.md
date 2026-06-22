# HTTP 请求测试 — 基础概念

HTTP 是跑整个互联网的协议。每个 API 调用、每次页面加载、每张图片请求——底层都是 HTTP。做 Web 相关的开发和调试，得搞清楚请求长什么样。

## 请求方法

| 方法 | 含义 | 有没有 Body |
|------|------|------------|
| GET | 拿资源 | 无 |
| POST | 新建资源 | 有 |
| PUT | 完整替换资源 | 有 |
| PATCH | 部分更新资源 | 有 |
| DELETE | 删除资源 | 可选 |
| HEAD | 只拿响应头 | 无 |
| OPTIONS | 这个接口支持哪些方法 | 无 |

最容易搞混的是 PUT 和 PATCH。PUT 的意思是「这是完整的新版本，全部替换」。PATCH 的意思是「这几个字段要改，其他的别动」。

## 请求的结构

一个 HTTP 请求由四部分组成：

- **请求行** — 方法 + URL + HTTP 版本
- **Headers（请求头）** — 键值对元数据，比如 `Content-Type: application/json`、`Authorization: Bearer xxx`
- **Query 参数** — URL 里 `?` 后面的东西，比如 `?page=1&size=20`
- **Body（请求体）** — POST、PUT、PATCH 携带的数据

## CORS：让浏览器请求失败的元凶

CORS（跨域资源共享）是浏览器的安全机制。你的网页在 `example.com` 上，想去调 `api.othersite.com`，浏览器会拦截，除非 API 服务器明确用 `Access-Control-Allow-Origin` 头允许。

这玩意儿只影响浏览器发起的请求。`curl`、Postman、服务端代码不受 CORS 限制。所以经常出现 API 在 Postman 里好好的，在你的 SPA 里就报错——浏览器在执行安全策略。

## 状态码速览

| 范围 | 含义 | 常见例子 |
|------|------|---------|
| 2xx | 一切正常 | 200 OK、201 Created、204 No Content |
| 3xx | 重定向 | 301 Moved Permanently、302 Found |
| 4xx | 你的请求有问题 | 400 参数错误、401 未认证、404 不存在、429 请求太多 |
| 5xx | 服务端出问题了 | 500 内部错误、502 网关错误、503 服务不可用 |

4xx 就修你的请求。5xx 就叫后端同事。429 就是慢点发。
