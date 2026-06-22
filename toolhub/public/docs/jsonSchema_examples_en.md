# JSON Schema Generator - Examples

## Simple user object

Input:
```json
{
  "id": 1001,
  "username": "alice",
  "email": "alice@example.com",
  "age": 28,
  "isVerified": true,
  "createdAt": "2024-01-15T08:30:00Z"
}
```

Generated JSON Schema (all fields are inferred as required since they're all present in the sample):
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

Generated TypeScript interface:
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

After generating, you'd probably add `format: "email"` to the email field and change `createdAt` to `format: "date-time"`. The generator can't know those from a single string value -- add them by hand.

---

## Array of orders with nested items

Input:
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

Generated TypeScript -- notice how the nested `items` array produces a separate `Item` interface:
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

## Deeply nested config

Input:
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

Generated JSON Schema -- three levels of nesting handled cleanly:
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

## Manual refinements to apply after generation

The generator gives you a solid starting point. Here's what to add yourself:

```json
// 1. Format hints -- can't be inferred from values
"email": { "type": "string", "format": "email" }

// 2. Length constraints
"username": { "type": "string", "minLength": 3, "maxLength": 20 }

// 3. Enums for status fields
"status": { "type": "string", "enum": ["pending", "completed", "refunded"] }

// 4. Nullable fields -- type can be an array
"deletedAt": { "type": ["string", "null"] }

// 5. Relax required fields -- remove optional ones from the array
"required": ["id", "username"]  // email, age etc. are now optional
```

The generated schema is never the final product -- it's the 80% you get for free so you only have to write the 20% that requires human judgment.
