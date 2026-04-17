# URL 解析器 技术背景

## URL 结构详解

一个完整的 URL 由以下部分组成：

```
https://user:pass@example.com:8080/path/to/page?key=value&foo=bar#section
──────  ─────────  ───────────  ────  ──────────  ──────────────── ───────
  │         │           │        │        │              │             │
protocol  auth        host     port    pathname        search        hash
```

| 字段 | 说明 | 示例 |
|------|------|------|
| protocol | 协议 | `https:` |
| username | 用户名（少见） | `user` |
| password | 密码（少见） | `pass` |
| hostname | 主机名 | `example.com` |
| port | 端口（默认端口可省略） | `8080` |
| host | hostname + port | `example.com:8080` |
| origin | protocol + host | `https://example.com:8080` |
| pathname | 路径 | `/path/to/page` |
| search | 查询字符串（含 `?`） | `?key=value&foo=bar` |
| hash | 锚点（含 `#`） | `#section` |
| href | 完整 URL | （全部）|

## URL 编码

URL 中的特殊字符（中文、空格等）需要进行百分号编码（Percent-encoding）：

- 空格 → `%20`
- 中文"你好" → `%E4%BD%A0%E5%A5%BD`

本工具支持一键切换显示解码后的原始值。

## 浏览器 URL API

本工具使用原生 `URL` API（`new URL(urlString)`），不依赖任何第三方库，在所有现代浏览器中均支持。

