# JSONPath 查询 - 示例

## 经典书店数据

这是 JSONPath 界的 "hello world"，大多数 JSONPath 教程都基于这份数据：

```json
{
  "store": {
    "book": [
      { "category": "reference", "author": "Nigel Rees", "title": "Sayings of the Century", "price": 8.95 },
      { "category": "fiction", "author": "Evelyn Waugh", "title": "Sword of Honour", "price": 12.99 },
      { "category": "fiction", "author": "Herman Melville", "title": "Moby Dick", "isbn": "0-553-21311-3", "price": 8.99 },
      { "category": "fiction", "author": "J. R. R. Tolkien", "title": "The Lord of the Rings", "isbn": "0-395-19395-8", "price": 22.99 }
    ],
    "bicycle": { "color": "red", "price": 19.95 }
  }
}
```

## 表达式速查

| 表达式 | 结果 |
|---|---|
| `$.store.book[*].title` | `["Sayings of the Century", "Sword of Honour", "Moby Dick", "The Lord of the Rings"]` |
| `$.store.book[?(@.price < 10)]` | 价格低于 $10 的两本书（Nigel Rees 和 Moby Dick，完整对象） |
| `$..price` | `[8.95, 12.99, 8.99, 22.99, 19.95]` -- 包含自行车的所有价格 |
| `$.store.book[0]` | 第一本书的完整对象 |
| `$.store.book[-1]` | 最后一本书（指环王） |
| `$.store.book[?(@.isbn)]` | 有 ISBN 的书（Moby Dick 和指环王） |
| `$.store.book[0:2]` | 前两本书 |
| `$.store.book[?(@.category == 'fiction')]` | 三本小说 |
| `$.store.book[?(@.price >= 10 && @.price <= 15)]` | Sword of Honour（$12.99）|

## 真实场景

### API 响应提取

```json
{"code": 0, "data": {"list": [{"id": 1, "name": "张三"}, {"id": 2, "name": "李四"}]}}
```

- 取所有名字：`$.data.list[*].name` -> `["张三", "李四"]`
- 取第一个用户：`$.data.list[0]` -> `{"id": 1, "name": "张三"}`
- 检查是否成功：`$.code` -> `0`

### Kubernetes Pod 列表

```json
{
  "items": [
    {"metadata": {"name": "nginx-pod", "namespace": "default"}, "status": {"phase": "Running"}},
    {"metadata": {"name": "redis-pod", "namespace": "default"}, "status": {"phase": "Pending"}},
    {"metadata": {"name": "api-pod", "namespace": "prod"}, "status": {"phase": "Running"}}
  ]
}
```

- 所有 Pod 名：`$.items[*].metadata.name`
- 只查运行中的：`$.items[?(@.status.phase == 'Running')]`
- 生产命名空间下的：`$.items[?(@.metadata.namespace == 'prod')]`

### GitHub API 响应（仓库列表）

```json
[
  {"name": "toolhub", "stargazers_count": 42, "language": "Vue", "fork": false},
  {"name": "old-project", "stargazers_count": 3, "language": "JavaScript", "fork": true},
  {"name": "cli-tool", "stargazers_count": 128, "language": "Python", "fork": false}
]
```

- 星标超过 10 的仓库名：`$[?(@.stargazers_count > 10)].name` -> `["toolhub", "cli-tool"]`
- 非 fork 仓库：`$[?(@.fork == false)]`
- Python 仓库：`$[?(@.language == 'Python')]`

### 嵌套配置文件

```json
{
  "environments": {
    "dev": {"host": "localhost", "port": 3000, "debug": true},
    "staging": {"host": "staging.example.com", "port": 443, "debug": false},
    "prod": {"host": "prod.example.com", "port": 443, "debug": false}
  }
}
```

- 所有环境主机：`$..host` -> `["localhost", "staging.example.com", "prod.example.com"]`
- 非生产环境：`$.environments[?(@.debug == true)].host`
- 取 staging 配置：`$.environments.staging`
