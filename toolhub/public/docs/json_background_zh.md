# JSON - 技术背景

JSON（JavaScript Object Notation）是 Web 的通用数据格式。调过 API、改过配置文件、看过 `package.json` 的都跟 JSON 打过交道。它简单到肉眼就能读，结构化到机器能可靠解析，所有主流编程语言都原生支持。

Douglas Crockford 在 2000 年代初期推广了 JSON，作为 XML 的轻量替代。核心洞察很简单：JavaScript 的对象字面量语法本身就是一个不错的数据格式。不用 schema、不用命名空间、不用闭合标签 -- 就是括号、花括号、冒号和逗号。

## 六种类型

JSON 一共就六种数据类型，没有更多。

- **字符串** -- 双引号，UTF-8 编码，特殊字符反斜杠转义
- **数字** -- 十进制。不支持十六进制、八进制，`NaN` 和 `Infinity` 也不是合法的 JSON
- **布尔** -- `true` 和 `false`，小写
- **Null** -- `null`，小写
- **数组** -- 有序，`[...]`，可以混类型（但通常不建议）
- **对象** -- 无序键值对，`{...}`，键必须是双引号字符串

最后一条经常踩坑：单引号或者不带引号的键不是合法 JSON，虽然在 JavaScript 里没问题。

## JSON 不能干什么

不支持注释。规范有意排除了注释。VS Code、部分解析器能容忍 `//`，但这不标准。配置文件需要注释的话，用 JSONC 或 YAML。

不允许尾随逗号。`{"a": 1,}` 是非法的。JavaScript 更宽容，`JSON.parse` 不买账。

没有日期类型。日期序列化为 ISO 8601 字符串，比如 `"2024-01-15T10:30:00Z"`。解析器需要知道哪些字段是日期，手动 revive。

不支持二进制。非要往 JSON 里塞二进制数据的话，Base64 编码。但说实话这不是 JSON 该干的活。

## 安全解析

浏览器和 Node 里用 `JSON.parse()` 和 `JSON.stringify()`。`parse` 一定要包在 try/catch 里 -- 格式不对的 JSON 会抛出 `SyntaxError`。永远别用 `eval()` 处理 JSON。别给自己找麻烦。

```javascript
try {
  const data = JSON.parse(input)
} catch (e) {
  console.error('JSON 格式错误:', e.message)
}
```

`JSON.stringify` 接受一个 replacer 函数（用于过滤/转换）和一个 space 参数控制缩进。space 可以是数字（空格数）或者字符串（制表符等）。`JSON.stringify(obj, null, 2)` 是标准的美化输出写法。

## JSON 在哪出现

- REST API -- 请求和响应体
- 配置文件 -- `package.json`、`tsconfig.json`、CI 配置
- 文档数据库 -- MongoDB、CouchDB、Firebase
- 服务间数据交换
- 浏览器和移动端的本地存储
- 日志聚合（结构化 JSON 日志）

JSON 能赢是因为它足够简单。XML 有 schema、命名空间、属性、CDATA 段这些东西。JSON 只有括号和花括号。有时候少即是多。

## JSON5 — JSON 的「人性化」变体

JSON 作为机器交换格式没问题，但给人写配置文件的时候就有点烦了——键必须加双引号、不能写注释、对象最后一个逗号都不让留。JSON5 就是来解决这些的。

JSON5 扩展了几样东西：

- **键可以不加引号**：`{ name: "value" }` 合法，ECMAScript 5 标识符规则
- **字符串可以用单引号**：`'hello'` 和 `"hello"` 都可以
- **允许尾随逗号**：`{ a: 1, }` 不报错
- **支持注释**：`//` 行注释和 `/* */` 块注释都行
- **数字更宽松**：支持十六进制 `0xFF`、`Infinity`、`NaN`

JSON5 不是要取代 JSON——它是 JSON 的**超集**。每个合法的 JSON 文件都是合法的 JSON5 文件。反过来不行：JSON5 特有的写法（注释、无引号键）标准 JSON 解析器不认。

基本上所有现代构建工具（Webpack、Rollup、Vite）的配置文件都在用 JSON5 风格——`.prettierrc`、`tsconfig.json` 本身就是 JSON5 文件。本工具的 JSON5 模式正是为这类文件设计的。

### JSON5 格式化注意事项

切换到 JSON5 模式后，Prettier 会按照 JSON5 规范格式化：

- **键引号**：你写 `"name"` 有可能被去掉引号变成 `name`。JSON5 允许这样，所以 Prettier 会自动去掉不必要的引号
- **注释**：完整保留，这是 JSON5 模式区别于标准 JSON 模式的最大价值
- **短对象**：不超过 `printWidth` 的短对象可能保持单行，不影响数据正确性
