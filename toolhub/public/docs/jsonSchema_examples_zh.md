# JSON Schema 生成 - 使用示例

## 示例 1：用户信息对象

**输入 JSON：**

```json
{
  "id": 1001,
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "age": 28,
  "isVerified": true,
  "createdAt": "2024-01-15T08:30:00Z"
}
```

**生成的 JSON Schema：**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "username", "email", "age", "isVerified", "createdAt"],
  "properties": {
    "id": { "type": "integer" },
    "username": { "type": "string" },
    "email": { "type": "string" },
    "age": { "type": "integer" },
    "isVerified": { "type": "boolean" },
    "createdAt": { "type": "string" }
  }
}
```

**生成的 TypeScript Interface：**

```typescript
interface Root {
  id: number
  username: string
  email: string
  age: number
  isVerified: boolean
  createdAt: string
}
```

---

## 示例 2：订单列表（数组）

**输入 JSON：**

```json
[
  {
    "orderId": "ORD-2024-001",
    "userId": 1001,
    "total": 299.90,
    "items": [
      { "sku": "PROD-A", "qty": 2, "price": 99.95 }
    ],
    "status": "completed"
  }
]
```

**生成的 TypeScript Interface：**

```typescript
interface Item {
  sku: string
  qty: number
  price: number
}

interface Order {
  orderId: string
  userId: number
  total: number
  items: Item[]
  status: string
}

type Root = Order[]
```

---

## 示例 3：深层嵌套配置

**输入 JSON：**

```json
{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": {
      "enabled": true,
      "certPath": "/etc/ssl/cert.pem"
    }
  },
  "database": {
    "url": "postgresql://localhost:5432/mydb",
    "poolSize": 10
  }
}
```

**生成的 JSON Schema（部分）：**

```json
{
  "type": "object",
  "properties": {
    "server": {
      "type": "object",
      "properties": {
        "host": { "type": "string" },
        "port": { "type": "integer" },
        "ssl": {
          "type": "object",
          "properties": {
            "enabled": { "type": "boolean" },
            "certPath": { "type": "string" }
          }
        }
      }
    },
    "database": {
      "type": "object",
      "properties": {
        "url": { "type": "string" },
        "poolSize": { "type": "integer" }
      }
    }
  }
}
```

---

## 常见后续操作

生成 Schema 后，常见的手动补充操作：

```json
// 1. 为 email 字段添加 format 验证
"email": { "type": "string", "format": "email" }

// 2. 为字符串添加长度限制
"username": { "type": "string", "minLength": 3, "maxLength": 20 }

// 3. 为枚举字段添加允许值
"status": { "type": "string", "enum": ["pending", "completed", "refunded"] }

// 4. 允许字段为 null
"deletedAt": { "type": ["string", "null"] }

// 5. 标记非必填字段（从 required 数组中移除）
"required": ["id", "username"]  // 不包含可选字段

