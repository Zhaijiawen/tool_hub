# URL Parser — Examples

## Example 1: API URL with Query Params

```
https://api.github.com/repos/vuejs/vue/issues?state=open&page=2&per_page=30
```

Parsed result:
- Protocol: `https:`
- Hostname: `api.github.com`
- Path: `/repos/vuejs/vue/issues`
- Query params:
  - `state` = `open`
  - `page` = `2`
  - `per_page` = `30`

## Example 2: Frontend SPA URL with Hash

```
https://example.com/app#/dashboard?tab=settings
```

Parsed result:
- Hash: `#/dashboard?tab=settings` (Note: params inside the hash are NOT part of `search`)

## Example 3: Internal Service URL with Port

```
http://192.168.1.100:8080/api/v1/users?role=admin
```

Parsed result:
- Protocol: `http:`
- Hostname: `192.168.1.100`
- Port: `8080`
- Path: `/api/v1/users`
- Query params: `role` = `admin`

## Example 4: URL-encoded Parameters

```
https://search.example.com/search?q=%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2&hl=zh-CN
```

Decoded values:
- `q` = `中文搜索`
- `hl` = `zh-CN`

