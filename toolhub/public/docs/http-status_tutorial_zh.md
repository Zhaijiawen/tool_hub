# HTTP 状态码参考 -- 使用教程

把它当速查表用。输入数字或关键词，查到含义，继续干活。

## 怎么查

**按状态码查：** 直接输入数字 -- `404`、`502`、`418`（对，真有这个）。会显示名称、类别和实际含义。

**按关键词查：** 输入"重定向"、"认证"、"超时"之类的词，列出所有相关的状态码。知道场景但不记得具体数字的时候很有用。

**按分类浏览：** 只看 4xx 或 5xx，浏览所有错误码。有时候只知道是客户端错误但不记得是哪个。

## 决策速查表

写 API 接口的时候不知道返回什么状态码？对着这个表查：

| 场景 | 状态码 |
|---|---|
| 一切正常，这是数据 | `200 OK` |
| 资源创建成功 | `201 Created` |
| 操作成功，没什么要返回的 | `204 No Content` |
| 这个 URL 永久作废，用新地址 | `301 Moved Permanently` |
| 临时把流量指向别处 | `302 Found` |
| 你缓存的版本还能用 | `304 Not Modified` |
| 请求格式不对或缺少必填字段 | `400 Bad Request` |
| 需要先登录 | `401 Unauthorized` |
| 登录了但权限不够 | `403 Forbidden` |
| 这东西不存在 | `404 Not Found` |
| 对这个接口用了错误的 HTTP 方法 | `405 Method Not Allowed` |
| 请求太快了，慢点 | `429 Too Many Requests` |
| 我们这边出了意外错误 | `500 Internal Server Error` |
| 服务暂时不可用 | `503 Service Unavailable` |

## 容易搞混的区别

**401 vs 403** 是重灾区。401 = "我不知道你是谁"（凭据缺失或过期）。403 = "我知道你是谁，但你不能干这事"（已登录但角色不对）。如果你的应用收到 401 跳登录页，收到 403 显示"无权访问"，你就用对了。

**301 vs 302** 涉及 SEO。301 说"这是新的永久地址" -- 搜索引擎把权重转移到新 URL。302 说"这是临时的" -- 搜索引擎保留旧 URL 的索引。永久迁移用了 302，SEO 会受影响。

**500 vs 502 vs 503 vs 504** 看架构。500 是你自己的应用代码崩了。502 是你的代理/负载均衡从上游拿到了无效响应。503 是代码没问题但过载了或在维护。504 是上游超时了。如果你用 nginx，502 和 504 会很常见 -- 通常说明应用服务挂了或者太慢。

## 前端处理模式

别只是 `console.error` 状态码。正经处理：

```javascript
async function apiCall(url, options) {
  const response = await fetch(url, options)

  if (response.ok) return response.json() // 200-299

  // 按类别处理
  switch (true) {
    case response.status === 401:
      // 跳登录
      window.location.href = '/login'
      throw new Error('登录已过期')

    case response.status === 403:
      // 显示权限错误，不跳转
      throw new Error('没有访问权限')

    case response.status === 429:
      // 解析 Retry-After 头，等待重试
      const retryAfter = response.headers.get('Retry-After')
      throw new Error(`请求过于频繁，${retryAfter} 秒后重试`)

    case response.status >= 500:
      // 服务端错误，可以重试一次
      throw new Error('服务器错误，请稍后重试')

    default:
      const body = await response.json()
      throw new Error(body.message || '请求失败')
  }
}
```

按范围分类（`.ok`、`>= 500` 等）比逐一检查每个状态码干净得多。
