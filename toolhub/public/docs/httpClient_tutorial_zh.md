# HTTP 请求测试 — 怎么用

一个在浏览器里跑的轻量 HTTP 客户端。请求直接从你的浏览器发到目标 API，不经过任何中转服务器。

## 发送请求

**URL —** 填完整地址。如果没写协议，工具自动加 `https://`。任何支持 CORS 的公开 API 都能用，或者你自己配好了跨域头的接口也行。

**请求方法 —** 默认 GET，按需切 POST、PUT、PATCH、DELETE、HEAD、OPTIONS。

**Params 标签 —** 添加 Query 参数，键值对形式。每条都有开关可以临时禁用而不删除——测试带不带某个参数时很方便。启用的参数会自动拼到 URL 后面。

**Headers 标签 —** 默认填了 `Accept: application/json`。可以加认证 token、自定义 Content-Type 等。每条 header 也有自己的开关。

**Body 标签 —** 只有 POST、PUT、PATCH 能用。四种模式：
- **None** — 无请求体
- **JSON** — 自动设 `Content-Type: application/json`
- **Form** — 自动设 `Content-Type: application/x-www-form-urlencoded`
- **Text** — 纯文本，Content-Type 自己设

点「发送」，等响应。

## 看响应结果

状态栏显示 HTTP 状态码（绿色 2xx、橙色 4xx、红色 5xx）、耗时（毫秒）、响应体大小。

Body 标签页展示响应内容，JSON 自动格式化高亮。响应头标签页展示服务器返回的所有头信息。

## CORS 问题处理

遇到 CORS 报错，几种处理方式：

1. 用支持 CORS 的公开 API 测试——`https://httpbin.org` 就是为这个设计的
2. 给你的 API 服务端加上 `Access-Control-Allow-Origin` 响应头
3. 本地开发可以用浏览器插件暂时关掉 CORS（仅限开发环境）
4. 对不支持 CORS 的接口换 `curl` 或 Postman——这个工具在浏览器里跑，受的 CORS 限制和你的 Web 应用一样

## 数据保存

最后一次请求的配置——URL、方法、参数、请求头、Body——会存到 localStorage，下次打开自动恢复。请求历史只存在本地，不会上传任何地方。
