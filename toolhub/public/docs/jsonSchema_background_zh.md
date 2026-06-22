# JSON Schema 生成 - 技术背景

JSON Schema 是一种描述 JSON 数据形状的方式 -- 有哪些字段、什么类型、哪些必填、有什么约束。巧妙之处在于 schema 本身也是合法的 JSON，所以你可以用处理 JSON 的工具来版本管理、存储和生成它。

规范定义在 json-schema.org，Draft 7 是目前兼容性最广的版本。Draft 2020-12 加了一些改进，但选择 Draft 7 是最稳妥的。

## Schema 长什么样

一个简单的用户对象 Schema：

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "用户信息",
  "required": ["id", "name"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "用户唯一标识"
    },
    "name": {
      "type": "string",
      "description": "用户姓名",
      "minLength": 1,
      "maxLength": 50
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    }
  }
}
```

结构自解释：`type` 是整体形状，`required` 列出必填字段，`properties` 描述每个字段的类型和约束。

## 类型系统

JSON Schema 定义了七种核心类型：`string`、`number`、`integer`、`boolean`、`null`、`array`、`object`。`number` 和 `integer` 的区别有实际用途 -- `integer` 会拒绝 `3.14`，`number` 接受。

## 值得记住的验证关键字

**字符串：** `minLength`/`maxLength` 限制长度。`pattern` 正则匹配。`format` 做语义验证，支持 `email`、`uri`、`date`、`date-time`、`ipv4`、`ipv6`、`hostname` 等。`enum` 限定枚举值集合。

**数字：** `minimum`/`maximum`（包含边界），`exclusiveMinimum`/`exclusiveMaximum`（严格），`multipleOf`（整除检查）。

**数组：** `items` 定义每个元素的 Schema。`minItems`/`maxItems` 限制数量。`uniqueItems` 拒绝重复元素。

**对象：** `required` 是必填属性名数组。`properties` 映射每个属性到它的 Schema。`additionalProperties` 控制是否允许额外字段（设为 `false` 禁止）。`minProperties`/`maxProperties` 限制总属性数。

## JSON Schema 用在哪

- **OpenAPI 3.0** 底层用 JSON Schema 描述请求/响应体
- **AJV** 是 JavaScript 生态最常用的验证器 -- 快、维护好、支持 Draft 7 到 2020-12
- **VS Code** 用 JSON Schema 为 `settings.json`、`package.json` 和 CI 配置文件提供自动补全和验证
- **Mongoose** 概念与 JSON Schema 相通（语法略有不同）
- **代码生成**工具如 `quicktype`、`json-schema-to-typescript`，可以从 JSON Schema 生成 TypeScript 接口、Go struct 或 Python dataclass

## 生成器的局限

工具从样本数据推断 Schema。意味着它只能看到样本里有什么 -- 如果某个字段有时候是字符串有时候是数字，它只能检测到一种。`minLength`、`pattern`、`format` 这类约束无法从值推断（需要手动补充）。nullable 也需要手动处理：样本里少了某个字段但实际可能是 `null` 的话，把类型改成 `["string", "null"]`。
