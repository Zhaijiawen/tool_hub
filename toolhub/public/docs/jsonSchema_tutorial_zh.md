# JSON Schema 生成 - 使用教程

## 快速开始

1. 在左侧输入框粘贴你的 JSON 数据
2. 选择目标格式（JSON Schema 或 TypeScript Interface）
3. 右侧立即生成结果，点击"复制"即可使用

## 输入 JSON 数据

将你要分析的 JSON 粘贴到左侧输入框，例如：

```json
{
  "id": 1001,
  "name": "张三",
  "email": "zhangsan@example.com",
  "isActive": true,
  "roles": ["admin", "editor"],
  "address": {
    "city": "北京",
    "zipCode": "100000"
  }
}
```

工具会自动推断每个字段的类型，并生成对应的 Schema 或接口。

## 选择输出格式

工具支持两种输出格式：

### JSON Schema

生成标准的 JSON Schema（Draft-07），可用于：
- API 文档（OpenAPI/Swagger）
- 数据验证（ajv、joi 等库）
- IDE 配置文件支持

### TypeScript Interface

生成 TypeScript 类型接口，可用于：
- 前端 TypeScript 项目类型定义
- API 响应类型标注
- 代码编辑器自动补全

## 理解生成规则

### 类型推断

| JSON 值 | 推断类型 |
|---------|---------|
| `"hello"` | `string` |
| `42` | `integer` |
| `3.14` | `number` |
| `true` / `false` | `boolean` |
| `null` | `null` |
| `[...]` | `array` |
| `{...}` | `object` |

### 嵌套对象

工具会递归处理嵌套对象，为每一层生成 Schema：

```json
{
  "user": {
    "profile": {
      "avatar": "url"
    }
  }
}
```

会生成带有 `$defs` 引用或内联嵌套 `properties` 的 Schema。

### 数组元素

数组中的第一个元素用于推断 `items` 类型。如果数组为空（`[]`），则 `items` 类型为 `{}`（允许任意）。

## 使用生成的 Schema

### 在 JavaScript 中验证

```javascript
import Ajv from 'ajv'
const ajv = new Ajv()

const validate = ajv.compile(schema) // 粘贴生成的 Schema
const valid = validate(data)
if (!valid) console.log(validate.errors)
```

### 在 TypeScript 中使用接口

将生成的 TypeScript Interface 直接粘贴到 `.ts` 文件中：

```typescript
interface User {
  id: number
  name: string
  email: string
  isActive: boolean
  roles: string[]
  address: {
    city: string
    zipCode: string
  }
}
```

## 注意事项

- 工具基于**样本数据推断**类型，不能推断全部可能的约束（如 `minLength`、`pattern` 等需手动补充）
- 如果字段可能为 `null`，建议在生成后手动将类型改为 `["string", "null"]` 或 TypeScript 中的 `string | null`
- 对于大型 JSON（超过 1 万行），建议先提取关键片段再生成

