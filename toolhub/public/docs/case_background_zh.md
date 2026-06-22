# 文本大小写这点事

大小写转换听起来简单，但作为一个经常在不同语言和规范间切换的开发者，这里面的命名约定和边界情况还真不少。

## 你实际会用到的几种风格

### 全大写（UPPERCASE）
代码里的常量（`MAX_BUFFER_SIZE`）、缩写词、邮件标题里想强调的地方。示例：`HELLO WORLD`。

### 全小写（lowercase）
Web 上的默认态。URL、CSS 类名、文件名基本都是小写。示例：`hello world`。

### 首字母大写（Title Case）
每个单词首字母大写，标题、按钮文字、书名用。示例：`Hello World`。

### 句首大写（Sentence case）
只有第一个字母大写，跟正常句子一样。示例：`Hello world`。

### 交替大小写（aLtErNaTiNg CaSe）
大小写来回切换。基本就是在网上玩梗和吐槽用的。示例：`hElLo WoRlD`。

## 各种语言的命名习惯

不同生态有不同的规矩，跨语言开发的时候你基本都会遇到：

| 语言 / 场景 | 规范 | 示例 |
|---|---|---|
| JavaScript/TypeScript | 小驼峰 camelCase | `myVariableName` |
| Python | 蛇形 snake_case | `my_variable_name` |
| Java/C# | 大驼峰 PascalCase | `MyClassName` |
| CSS | 连字符 kebab-case | `my-class-name` |
| 常量（多数语言） | 全大写蛇形 | `MAX_BUFFER_SIZE` |

## Unicode 的坑

纯 ASCII 的大小写转换很简单，每个字母的大小写对应关系是确定的。Unicode 就复杂了。德语 `ß` 转大写变成 `SS`。土耳其语有带点和不带点的 `i`，大小写规则跟英语不一样。现代 JavaScript 的 `.toUpperCase()` 和 `.toLowerCase()` 大部分情况都能正确处理，但特定语言环境下还是可能有边界情况。

这个工具是基于字符级别处理的，Unicode 文本没问题，但如果你需要区域敏感的大小写转换（比如土耳其语的 i），可能需要更专业的工具。
