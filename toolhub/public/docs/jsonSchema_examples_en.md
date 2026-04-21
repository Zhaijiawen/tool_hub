# JSON Schema Generator - Examples

## Example 1: User Object

**Input JSON:**

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

**Generated JSON Schema:**

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

**Generated TypeScript Interface:**

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

## Example 2: Order List (Array)

**Input JSON:**

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

**Generated TypeScript Interface:**

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

## Example 3: Deeply Nested Config

**Input JSON:**

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

**Generated JSON Schema (excerpt):**

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

## Common Manual Enhancements

After generating a schema, common refinements to add by hand:

```json
// 1. Add format validation for email
"email": { "type": "string", "format": "email" }

// 2. Add length constraints for strings
"username": { "type": "string", "minLength": 3, "maxLength": 20 }

// 3. Restrict an enum field to allowed values
"status": { "type": "string", "enum": ["pending", "completed", "refunded"] }

// 4. Allow a field to be null
"deletedAt": { "type": ["string", "null"] }

// 5. Mark optional fields (remove from the required array)
"required": ["id", "username"]  // optional fields not listed

