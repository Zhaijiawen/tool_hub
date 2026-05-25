# 文本大小写转换 — 技术背景

## 什么是文本大小写？

文本大小写是指字符串中字母的大写/小写形式。不同的编程语言、命名规范和写作标准使用不同的大小写风格。

## 常见大小写风格

### 全大写（UPPERCASE）
所有字母均为大写形式，常用于常量、缩写词和强调语境。
- 示例：`HELLO WORLD`、`MAX_VALUE`

### 全小写（lowercase）
所有字母均为小写形式，常用于 URL、CSS 类名和部分编程标识符。
- 示例：`hello world`、`variable_name`

### 首字母大写（Title Case）
每个单词的首字母大写，其余小写，常用于标题和专有名词。
- 示例：`Hello World`、`The Quick Brown Fox`

### 句首大写（Sentence Case）
仅第一个单词首字母大写，其余小写，符合普通句子的书写规范。
- 示例：`Hello world`、`The quick brown fox`

### 交替大小写（Alternating Case）
字母在大写和小写之间交替出现，多用于装饰或幽默表达。
- 示例：`hElLo WoRlD`

## 编程中的命名规范

| 语言/场景 | 命名规范 | 示例 |
|---|---|---|
| JavaScript/TypeScript | 小驼峰（camelCase） | `myVariableName` |
| Python | 下划线（snake_case） | `my_variable_name` |
| Java/C# | 大驼峰（PascalCase） | `MyClassName` |
| CSS | 连字符（kebab-case） | `my-class-name` |
| 常量 | 全大写下划线 | `MAX_BUFFER_SIZE` |

## Unicode 与国际化

ASCII 字符的大小写转换较为简单，但国际化文本处理更为复杂。例如德语中 `ß` 转大写为 `SS`。现代 JavaScript 通过 `.toUpperCase()` 和 `.toLowerCase()` 可正确处理大多数 Unicode 字符的大小写转换。

