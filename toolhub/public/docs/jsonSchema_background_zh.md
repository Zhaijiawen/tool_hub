# JSON Schema 生成 - 技术背景

## 什么是 JSON Schema

**JSON Schema** 是一种用 JSON 编写的声明式语言，用于描述 JSON 数据的结构和约束规则。它可以：

- **验证**：检查 JSON 数据是否符合预期格式
- **文档化**：描述 API 请求/响应体的结构
- **代码生成**：从 Schema 自动生成 TypeScript 接口、数据库模型等

官方规范：[json-schema.org](https://json-schema.org)

## Schema 基础结构

一个基本的 JSON Schema 由以下关键字构成：

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

## 核心数据类型

| 类型 | 说明 | 示例 JSON 值 |
|------|------|-------------|
| `string` | 字符串 | `"hello"` |
| `number` | 数字（含小数）| `3.14` |
| `integer` | 整数 | `42` |
| `boolean` | 布尔值 | `true` |
| `null` | 空值 | `null` |
| `array` | 数组 | `[1, 2, 3]` |
| `object` | 对象 | `{"key": "value"}` |

## 常用验证关键字

### 字符串约束

| 关键字 | 含义 |
|--------|------|
| `minLength` / `maxLength` | 最小/最大字符长度 |
| `pattern` | 正则表达式匹配 |
| `format` | 预设格式，如 `email`、`date`、`uri` |
| `enum` | 枚举允许的值 |

### 数字约束

| 关键字 | 含义 |
|--------|------|
| `minimum` / `maximum` | 最小/最大值（包含边界）|
| `exclusiveMinimum` / `exclusiveMaximum` | 严格小于/大于 |
| `multipleOf` | 必须是某数的倍数 |

### 数组约束

| 关键字 | 含义 |
|--------|------|
| `items` | 描述数组元素的 Schema |
| `minItems` / `maxItems` | 最少/最多元素数 |
| `uniqueItems` | 是否要求元素唯一 |

### 对象约束

| 关键字 | 含义 |
|--------|------|
| `required` | 必填属性列表 |
| `properties` | 各属性的 Schema 描述 |
| `additionalProperties` | 是否允许额外属性 |
| `minProperties` / `maxProperties` | 最少/最多属性数 |

## Schema 的主要用途

1. **API 文档**：OpenAPI 3.0 内置使用 JSON Schema 描述请求/响应体
2. **表单验证**：前端表单库（如 react-hook-form、formik）使用 Schema 驱动验证
3. **数据库 ORM 验证**：如 Mongoose 的 Schema 与 JSON Schema 概念相通
4. **配置文件验证**：VS Code 等 IDE 使用 JSON Schema 提供配置文件自动补全和验证
5. **代码生成**：工具如 `quicktype`、`json-schema-to-typescript` 可从 Schema 生成强类型代码

