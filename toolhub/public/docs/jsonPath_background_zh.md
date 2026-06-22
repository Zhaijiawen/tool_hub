# JSONPath - 技术背景

JSONPath 之于 JSON 就像 XPath 之于 XML -- 一种路径查询语言，让你能精准地从 JSON 文档中提取想要的数据。Stefan Goessner 在 2007 年提出，现在已经是 Postman、JMeter、kubectl 等工具的标配查询语法了。

核心思路：写一个路径表达式遍历 JSON 树，引擎返回匹配的节点。不用写循环、不用解构、不用链式 `reduce` -- 一个表达式搞定。

## 语法详解

| 表达式 | 作用 |
|---|---|
| `$` | JSON 文档的根。所有查询都从这里开始。 |
| `.key` | 点记法访问子节点。`$.user.name` 沿着 user -> name 走。 |
| `['key']` | 方括号记法。键名带空格或特殊字符时用这个：`$['user name']`。 |
| `..` | 递归下降。`$..price` 找到任意深度的所有 `price` 键。强大但在大文档上可能慢。 |
| `*` | 通配符。`$.store.*` 匹配 store 的所有子节点。`$..book[*].title` 取所有书的标题。 |
| `[n]` | 数组索引，从 0 开始。`$.items[0]` 是第一项，`$.items[-1]` 是最后一项。 |
| `[start:end]` | 数组切片。`$.items[0:3]` 是前三项。类似 Python 切片 -- start 包含，end 不包含。 |
| `[a,b,c]` | 多索引。`$.items[0,2,4]` 取第 0、2、4 项。 |
| `[?(@.条件)]` | 过滤表达式。`@` 代表当前节点。JSONPath 的真正威力在这里。 |

## 过滤表达式详解

过滤器是 JSONPath 的杀手级特性。在 `[?(...)]` 里可以写布尔表达式：

- `$.store.book[?(@.price < 10)]` -- 价格低于 10 的书
- `$.store.book[?(@.isbn)]` -- 有 ISBN 的书（真值检查）
- `$.store.book[?(@.category == 'fiction')]` -- 只看小说
- `$.store.book[?(@.price < 10 && @.category == 'fiction')]` -- 便宜的小说
- `$.store.book[?(@.author =~ /.*Tolkien/)]` -- 正则匹配作者名

支持的比较运算符：`==`、`!=`、`<`、`<=`、`>`、`>=`、`=~`（正则）。`&&` 和 `||` 组合多个条件。

## JSONPath 在哪发光

Postman 用它做测试断言 -- `pm.expect(pm.response.json()).to.have.jsonPath('$.data.user.id')`。kubectl 用类似 JSONPath 的语法格式化输出：`kubectl get pods -o jsonpath='{.items[*].metadata.name}'`。API 网关、ETL 工具、日志处理器也大量内置了 JSONPath。

## 本工具用的库

基于 `jsonpath-plus`（npm），一个成熟的包，支持完整 JSONPath 规范并扩展了实用特性。能优雅处理键名带点号、空格、特殊字符等边界情况。
