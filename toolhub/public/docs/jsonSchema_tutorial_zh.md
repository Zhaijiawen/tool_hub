# JSON Schema 生成 - 使用教程

丢一份 JSON 进去，拿到 JSON Schema 或 TypeScript 接口。省时间 -- 不用手写类型定义，贴个 API 响应工具就帮你把脏活干了。

## 怎么用

1. 把 JSON 贴到左侧面板
2. 选输出格式 -- JSON Schema 或 TypeScript Interface
3. 右边立刻出结果。复制贴到项目里。

示例输入：
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

工具遍历每个字段，从值推断类型，递归处理嵌套对象，生成干净的 Schema 或接口。

## 输出格式

### JSON Schema

标准 Draft-07 JSON Schema。需要以下场景时选这个：
- 用 AJV 等库做 API 请求/响应验证
- OpenAPI/Swagger 文档
- VS Code 配置文件自动补全（通过 `$schema` 引用）

### TypeScript Interface

干净的 TypeScript 类型定义。以下场景用这个：
- TS 项目中给 API 响应加类型注解
- 编辑器自动补全和类型检查
- 领域类型的脚手架

## 类型推断怎么做的

| JSON 值 | 推断为 |
|---|---|
| `"hello"` | `string` |
| `42` | `integer` |
| `3.14` | `number` |
| `true` / `false` | `boolean` |
| `null` | `null` |
| `[...]` | `array` |
| `{...}` | `object` |

嵌套对象生成内联 Schema 或 `$defs` 条目。数组用第一个元素推断元素类型。空数组默认允许任意类型。

## 怎么用生成结果

### 用 AJV 验证

```javascript
import Ajv from 'ajv'
const ajv = new Ajv()

const schema = /* 粘贴生成的 Schema */
const validate = ajv.compile(schema)
const data = { id: 123, name: 'Test' }
const valid = validate(data)
if (!valid) console.log(validate.errors)
```

### TypeScript 接口

直接贴到 `.ts` 文件里：

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

## 生成后需要手动调整什么

工具基于样本推断，没法面面俱到。常见的补充操作：

- **加 `format`** -- 对看起来像 email 或 URI 的字段，生成器只看到 string，但你知道它是 email
- **加约束** -- `minLength`、`maxLength`、`minimum`、`maximum`、`pattern`，单个样本值推断不出来
- **处理 nullable** -- 字段可能为 null 的话，把 `"type": "string"` 改成 `"type": ["string", "null"]`
- **标记可选字段** -- 从 `required` 数组里拿掉
- **加 `enum`** -- 字段只有几个已知合法值时

超大 JSON（1 万行以上）建议先提取代表性片段再生成。工具会处理你喂给它的所有内容，100KB 的 JSON 生成的 Schema 你可能根本不想读。
