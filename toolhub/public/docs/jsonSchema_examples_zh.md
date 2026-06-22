# JSON Schema 生成 - 使用示例

## 简单用户对象

输入：
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

生成的 JSON Schema（所有字段都在样本里出现了，所以都推断为 required）：
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

生成的 TypeScript 接口：
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

生成后通常会手动给 email 加上 `format: "email"`，给 `createdAt` 加上 `format: "date-time"`。生成器从一个字符串值推断不出这些语义信息 -- 自己加上。

---

## 带嵌套的订单数组

输入：
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

生成的 TypeScript -- 注意嵌套的 `items` 数组产生了独立的 `Item` 接口：
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

## 深层嵌套配置

输入：
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

生成的 JSON Schema -- 三层嵌套处理得干干净净：
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

## 生成后手动补充

生成器给你一个扎实的起点。以下是需要手动加的东西：

```json
// 1. 格式提示 -- 无法从值推断
"email": { "type": "string", "format": "email" }

// 2. 长度约束
"username": { "type": "string", "minLength": 3, "maxLength": 20 }

// 3. 状态枚举
"status": { "type": "string", "enum": ["pending", "completed", "refunded"] }

// 4. 可空字段 -- type 可以是数组
"deletedAt": { "type": ["string", "null"] }

// 5. 宽松必填要求 -- 从 required 数组里移除可选字段
"required": ["id", "username"]  // email、age 等变成可选
```

生成的 Schema 永远不是最终成品 -- 它是免费拿到的 80%，让你只用写需要人工判断的 20%。
