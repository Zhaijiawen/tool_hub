# URL 解析器 — 技术背景

URL 你天天见，但大多数人从没细看过它到底由什么构成。URL 不是随便一串字符——它是一种结构化的数据格式，有明确定义的解剖结构。解析器把它拆开，让你逐个检视每个组件。

## URL 里面有什么

以下是完整解剖结构，所有可能的部件都在：

```
https://user:pass@example.com:8080/path/to/page?key=value&foo=bar#section
──────  ─────────  ───────────  ────  ──────────  ──────────────── ───────
  │         │           │        │        │              │             │
 protocol  auth        host     port    pathname        search        hash
```

你遇到的大多数 URL 更简单——auth 部分（用户名:密码）在 FTP URL 和遗留系统之外很少出现，端口在协议默认端口时通常不写（HTTP 默认 80，HTTPS 默认 443）。

| 字段 | 是什么 | 示例 |
|---|---|---|
| protocol | 协议，始终以 `:` 结尾 | `https:` |
| username | 认证用户名（少见） | `user` |
| password | 认证密码（少见） | `pass` |
| hostname | 域名或 IP，不含端口 | `example.com` |
| port | 显式端口号 | `8080` |
| host | hostname + port 组合 | `example.com:8080` |
| origin | protocol + host | `https://example.com:8080` |
| pathname | 主机后面的路径 | `/path/to/page` |
| search | 查询字符串，含 `?` | `?key=value&foo=bar` |
| hash | 片段/锚点，含 `#` | `#section` |
| href | 完整 URL | 上面全部 |

`hostname`、`host` 和 `origin` 之间的区别容易搞混。`host` 是包含端口的那个；`origin` 是 protocol + host（浏览器的安全边界）。你在设置 CORS 头或调试跨域请求时，`origin` 才是关键。

## 查询参数

查询字符串从 `?` 开始，用 `&` 分隔键值对。除此之外没有官方标准——重复键、缺失值、嵌套结构，不同框架处理方式都不一样。

解析器把参数提取到一个清爽的表格里。它还处理 URL 编码：空格变成 `%20`，非 ASCII 字符变成百分号编码的字节序列（中文 `中文` 变成 `%E4%B8%AD%E6%96%87`）。解码开关让你看到人类可读的值，同时保持原始编码 URL 不变。

## Hash（片段）

Hash（`#` 后面的所有内容）很特别：浏览器从不把它发给服务器。它完全存在于客户端。这就是为什么单页应用用 hash 路由（`#/dashboard`）——服务器只能看到 `#` 之前的 URL。如果你看到 hash 里面带着查询形式的参数（`#/page?tab=settings`），这些不属于 `search` 字段——它们在 `hash` 字符串里，需要单独解析。

解析器底层用的是浏览器内置的 `URL` 构造函数，这意味着它遵循的解析规则跟浏览器本身一致。工具显示的内容和 `window.location` 给你的结果之间不会有边界差异。
