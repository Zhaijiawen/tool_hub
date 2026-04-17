# JSONPath 查询 示例

## 示例数据

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

## 查询示例

| 表达式 | 结果 |
|--------|------|
| `$.store.book[*].title` | 所有书名数组 |
| `$.store.book[?(@.price < 10)]` | 价格 < 10 的书（对象数组） |
| `$..price` | 所有 price 字段（包括 bicycle） |
| `$.store.book[0]` | 第一本书（完整对象） |
| `$.store.book[?(@.isbn)]` | 有 isbn 字段的书 |
| `$.store.book[-1:]` | 最后一本书 |
| `$.store.book[0:2]` | 前两本书 |
| `$.store.book[*].author` | 所有作者 |

## 实际 API 场景

API 返回：
```json
{"code":0,"data":{"list":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}}
```

提取所有 name：`$.data.list[*].name`
→ `["Alice","Bob"]`

