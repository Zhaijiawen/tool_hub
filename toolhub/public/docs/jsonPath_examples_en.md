# JSONPath Query - Examples

## The classic bookstore data

This is the JSONPath equivalent of the "hello world" example. It's the dataset used in most JSONPath tutorials:

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

## Expression cookbook

| Expression | What you get |
|---|---|
| `$.store.book[*].title` | `["Sayings of the Century", "Sword of Honour", "Moby Dick", "The Lord of the Rings"]` |
| `$.store.book[?(@.price < 10)]` | The two books under $10 (Nigel Rees and Moby Dick, as full objects) |
| `$..price` | `[8.95, 12.99, 8.99, 22.99, 19.95]` -- every price including the bicycle |
| `$.store.book[0]` | First book object |
| `$.store.book[-1]` | Last book (Lord of the Rings) |
| `$.store.book[?(@.isbn)]` | Books that have an ISBN (Moby Dick and Lord of the Rings) |
| `$.store.book[0:2]` | First two books |
| `$.store.book[?(@.category == 'fiction')]` | Three fiction books |
| `$.store.book[?(@.price >= 10 && @.price <= 15)]` | Sword of Honour ($12.99) |

## Real-world patterns

### Simple API response extraction

```json
{"code": 0, "data": {"list": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}}
```

- Get all names: `$.data.list[*].name` -> `["Alice", "Bob"]`
- Get first user: `$.data.list[0]` -> `{"id": 1, "name": "Alice"}`
- Check success: `$.code` -> `0`

### Kubernetes pod listing

```json
{
  "items": [
    {"metadata": {"name": "nginx-pod", "namespace": "default"}, "status": {"phase": "Running"}},
    {"metadata": {"name": "redis-pod", "namespace": "default"}, "status": {"phase": "Pending"}},
    {"metadata": {"name": "api-pod", "namespace": "prod"}, "status": {"phase": "Running"}}
  ]
}
```

- All pod names: `$.items[*].metadata.name`
- Only running pods: `$.items[?(@.status.phase == 'Running')]`
- Pods in prod namespace: `$.items[?(@.metadata.namespace == 'prod')]`

### GitHub API response (list of repos)

```json
[
  {"name": "toolhub", "stargazers_count": 42, "language": "Vue", "fork": false},
  {"name": "old-project", "stargazers_count": 3, "language": "JavaScript", "fork": true},
  {"name": "cli-tool", "stargazers_count": 128, "language": "Python", "fork": false}
]
```

- Repo names with more than 10 stars: `$[?(@.stargazers_count > 10)].name` -> `["toolhub", "cli-tool"]`
- Non-fork repos: `$[?(@.fork == false)]`
- Repos using Python: `$[?(@.language == 'Python')]`

### Nested config file

```json
{
  "environments": {
    "dev": {"host": "localhost", "port": 3000, "debug": true},
    "staging": {"host": "staging.example.com", "port": 443, "debug": false},
    "prod": {"host": "prod.example.com", "port": 443, "debug": false}
  }
}
```

- All environment hosts: `$..host` -> `["localhost", "staging.example.com", "prod.example.com"]`
- Non-prod hosts: `$.environments[?(@.debug == true)].host`
- Get staging config: `$.environments.staging`
