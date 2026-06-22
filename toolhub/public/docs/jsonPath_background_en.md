# JSONPath - Technical Background

JSONPath is to JSON what XPath is to XML -- a query language that lets you reach into a JSON document and pull out exactly the data you want. Stefan Goessner proposed it in 2007, and it's since become the standard way to query JSON in tools like Postman, JMeter, and kubectl.

The basic idea: you write a path expression that walks the JSON tree, and the engine returns the matching nodes. No loops, no destructuring, no `reduce` chains -- just a concise expression.

## The syntax, annotated

| Expression | What it does |
|---|---|
| `$` | Root of the JSON document. Every query starts here. |
| `.key` | Child access with dot notation. `$.user.name` goes user -> name. |
| `['key']` | Bracket notation. Useful when keys have spaces or special characters: `$['user name']`. |
| `..` | Recursive descent. `$..price` finds every `price` key at any depth. Powerful but can be slow on large docs. |
| `*` | Wildcard. `$.store.*` matches all children of `store`. `$..book[*].title` gets titles from all books. |
| `[n]` | Array index, zero-based. `$.items[0]` is the first item, `$.items[-1]` is the last. |
| `[start:end]` | Array slice. `$.items[0:3]` is the first three items. Like Python slicing -- start inclusive, end exclusive. |
| `[a,b,c]` | Multi-index. `$.items[0,2,4]` picks indices 0, 2, and 4. |
| `[?(@.condition)]` | Filter expressions. `@` refers to the current node. This is where JSONPath gets powerful. |

## Filter expressions in detail

Filters are the killer feature. Inside `[?(...)]` you can write boolean expressions:

- `$.store.book[?(@.price < 10)]` -- books under $10
- `$.store.book[?(@.isbn)]` -- books that have an ISBN (truthy check)
- `$.store.book[?(@.category == 'fiction')]` -- fiction books only
- `$.store.book[?(@.price < 10 && @.category == 'fiction')]` -- cheap fiction
- `$.store.book[?(@.author =~ /.*Tolkien/)]` -- regex match on author name

You can chain most comparison operators: `==`, `!=`, `<`, `<=`, `>`, `>=`, `=~` (regex). The `&&` and `||` operators let you combine conditions.

## Where JSONPath shines

Postman uses it for test assertions -- `pm.expect(pm.response.json()).to.have.jsonPath('$.data.user.id')`. kubectl uses a JSONPath-like syntax for formatting output: `kubectl get pods -o jsonpath='{.items[*].metadata.name}'`. It's also built into many API gateways, ETL tools, and log processors.

## Library note

This tool runs on `jsonpath-plus`, a mature npm package that supports the full JSONPath spec plus useful extensions. It handles edge cases like keys with dots, spaces, and special characters gracefully.
