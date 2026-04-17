# URL 解析器 示例

## 示例 1：带参数的 API URL

```
https://api.github.com/repos/vuejs/vue/issues?state=open&page=2&per_page=30
```

解析结果：
- Protocol: `https:`
- Hostname: `api.github.com`
- Path: `/repos/vuejs/vue/issues`
- Query 参数：
  - `state` = `open`
  - `page` = `2`
  - `per_page` = `30`

## 示例 2：带 Hash 的前端路由 URL

```
https://example.com/app#/dashboard?tab=settings
```

解析结果：
- Hash: `#/dashboard?tab=settings`（注意：Hash 内的参数不属于 search）

## 示例 3：带端口号的内网 URL

```
http://192.168.1.100:8080/api/v1/users?role=admin
```

解析结果：
- Protocol: `http:`
- Hostname: `192.168.1.100`
- Port: `8080`
- Path: `/api/v1/users`
- Query 参数：`role` = `admin`

## 示例 4：含 URL 编码的参数

```
https://search.example.com/search?q=%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2&hl=zh-CN
```

解码后：
- `q` = `中文搜索`
- `hl` = `zh-CN`

