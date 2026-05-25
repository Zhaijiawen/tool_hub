# 空白字符处理 — 技术背景

## 什么是空白字符？

空白字符是指在文本中表示水平或垂直间隔的字符，包括空格（` `）、制表符（`\t`）、换行符（`\n`）、回车符（`\r`）以及其他 Unicode 空白字符。

## 常见的空白字符问题

### 前导和尾随空白
字符串头部或尾部的多余空格是常见的 bug 来源，尤其在以下场景中：
- 字符串比较：`"hello" !== " hello "`
- 数据库存储
- 用户表单输入处理

### 多余的内部空白
多个连续空格或制表符混用会导致：
- 代码解析和格式化异常
- CSV/TSV 数据处理错误
- 页面排版不一致

## 编程中的空白处理

```javascript
// 去除首尾空白
"  hello world  ".trim()        // "hello world"
"  hello world  ".trimStart()   // "hello world  "
"  hello world  ".trimEnd()     // "  hello world"

// 将多个空格合并为一个
"hello   world".replace(/\s+/g, ' ')  // "hello world"
```

## Unicode 空白字符一览

| 字符 | 码点 | 名称 |
|---|---|---|
| 普通空格 | U+0020 | SPACE |
| 制表符 | U+0009 | CHARACTER TABULATION |
| 换行符 | U+000A | LINE FEED |
| 不间断空格 | U+00A0 | NO-BREAK SPACE |
| 零宽空格 | U+200B | ZERO WIDTH SPACE |

## 最佳实践

- 存储或比较前，始终对用户输入进行 trim 处理
- 在文本处理流水线中规范化空白字符
- 注意从网页复制的内容中可能包含不间断空格（U+00A0），外观与普通空格相同，但行为不同

