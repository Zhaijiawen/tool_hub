# URL 解析器 — 使用示例

## 带查询参数的 API URL

这大概是你最常粘贴的东西——一个带分页的 API 端点。

```
https://api.github.com/repos/vuejs/vue/issues?state=open&page=2&per_page=30
```

解析结果：
- **Protocol:** `https:`
- **Hostname:** `api.github.com`
- **Path:** `/repos/vuejs/vue/issues`
- **Query 参数:**
  - `state` = `open`
  - `page` = `2`
  - `per_page` = `30`

假设你想翻到第 3 页。不用编辑原始 URL 字符串，切到「反向构建」Tab，把 `page` 从 `2` 改成 `3`，复制结果。比在 200 个字符的 URL 里找 `page=2` 靠谱多了。

## 前端 hash 路由

Vue Router、React Router 这些 SPA 框架有时会用 hash 模式。hash 里装着看起来像路径的东西，还带着自己的查询参数。

```
https://example.com/app#/dashboard?tab=settings
```

解析结果：
- **Pathname:** `/app`
- **Hash:** `#/dashboard?tab=settings`
- **Search:** *(空)*

hash 里面的 `?tab=settings` 就 URL 解析器而言不是查询参数——它只是 hash 字符串的一部分。服务器永远不会看到 `#` 后面的任何内容。如果你在排查前端路由问题，记住框架会内部解析 hash 来提取自己的路由和参数。

## 带端口的内网服务

开发环境和容器化服务最爱非标准端口。

```
http://192.168.1.100:8080/api/v1/users?role=admin
```

解析结果：
- **Protocol:** `http:`
- **Hostname:** `192.168.1.100`
- **Port:** `8080`
- **Path:** `/api/v1/users`
- **Query 参数:** `role` = `admin`

注意这是 HTTP 而不是 HTTPS——内网服务常见，TLS 终结在反向代理处。用裸 IP 当 hostname 也是本地/开发环境的标准做法。如果你想把这个切到生产 URL，在「反向构建」里改 hostname 和 protocol，路径和参数保持不动。

## URL 编码的搜索参数

当搜索查询包含非 ASCII 字符时，你会看到百分号编码。

```
https://search.example.com/search?q=%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2&hl=zh-CN
```

开启 URL 解码后：
- `q` = `中文搜索`
- `hl` = `zh-CN`

不解码的话，`q` 显示为 `%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2`。两种视图都有用，取决于你在干什么。构造请求准备发送，用编码形式。想看懂用户到底搜了什么，解码。

## 解析 Google Maps URL

地图 URL 把海量信息打包在查询参数里。

```
https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7432442,17z/data=!3m1!4b1!4m6!3m5!1s0x60188bbd9009ec09:0x1ff32a445ab35a4d!8m2!3d35.6585805!4d139.7454329!16zL20vMDFqM2o?entry=ttu
```

解析结果：
- **Path:** `/maps/place/Tokyo+Tower/@35.6585805,139.7432442,17z`
- **Query 参数:**
  - `data` = `!3m1!4b1!4m6!3m5!1s0x60188bbd9009ec09:0x1ff32a445ab35a4d!8m2!3d35.6585805!4d139.7454329!16zL20vMDFqM2o`
  - `entry` = `ttu`

`data` 参数看起来像乱码——那是 Google 内部的 polyline 格式。坐标嵌在路径里：`35.6585805,139.7432442`，缩放级别 `17z`。解析器不会替你把 polyline 数据解码，但它能干净地提取出来，方便你传给 polyline 解码器或者直接验证坐标是否符合预期。

## 识别追踪参数

营销和分析 URL 会积累追踪杂碎，分享之前你可能想清理掉。

```
https://example.com/product?utm_source=twitter&utm_medium=social&utm_campaign=launch&fbclid=abc123&ref=homepage
```

解析出的查询参数：
- `utm_source` = `twitter`
- `utm_medium` = `social`
- `utm_campaign` = `launch`
- `fbclid` = `abc123`
- `ref` = `homepage`

解析器让哪些是追踪参数（以 `utm_`、`fbclid`、`gclid` 开头的）一目了然，哪些是功能性参数也清清楚楚。去掉追踪参数，在「反向构建」里重新组装 URL，得到一个干净的分享链接。
