# JSONPath Query — Examples

## Sample Data

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

## Query Examples

| Expression | Result |
|-----------|--------|
| `$.store.book[*].title` | Array of all book titles |
| `$.store.book[?(@.price < 10)]` | Books with price < 10 (array of objects) |
| `$..price` | All price fields (including bicycle) |
| `$.store.book[0]` | First book (full object) |
| `$.store.book[?(@.isbn)]` | Books that have an ISBN |
| `$.store.book[-1:]` | Last book |
| `$.store.book[0:2]` | First two books |
| `$.store.book[*].author` | All authors |

## Real API Scenario

API response:
```json
{"code":0,"data":{"list":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}}
```

Extract all names: `$.data.list[*].name`
→ `["Alice","Bob"]`

