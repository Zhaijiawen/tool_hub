# JSONPath Background

## What is JSONPath?

JSONPath is a path expression language for querying JSON documents, analogous to XPath for XML. It was introduced by Stefan Goessner in 2007 and is widely used in API testing (e.g., Postman), log analysis, and data extraction.

## Quick Reference

| Expression | Description |
|-----------|-------------|
| `$` | Root node |
| `.` | Child (dot notation) |
| `..` | Recursive descent (any depth) |
| `*` | Wildcard (all elements) |
| `[n]` | Array index (0-based) |
| `[start:end]` | Array slice |
| `[a,b,c]` | Multi-select |
| `[?(@.key)]` | Filter: field exists |
| `[?(@.price<10)]` | Filter: condition |
| `@` | Current node (used in filters) |

## Examples

| Expression | Meaning |
|-----------|---------|
| `$.store.book[*].author` | All book authors |
| `$..author` | All `author` fields anywhere |
| `$.store.book[0,1]` | First and second books |
| `$.store.book[?(@.isbn)]` | Books that have an ISBN |
| `$.store.book[?(@.price < 10)]` | Books priced under 10 |

## Library Used

Based on `jsonpath-plus` (npm), which supports the full JSONPath specification plus extensions like `@path` and `@property`.

