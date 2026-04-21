# Mock Data Generator - Examples

## Example 1: User List (Default Template)

**Field config:**

| Field | Type | Config |
|-------|------|--------|
| id | Integer | 1 – 10,000 |
| name | Name | — |
| email | Email | — |
| status | Enum | active, inactive, pending |
| address | Object | children: city, street, zipCode |
| tags | Array | enum items: vue, react, node, python |

**Sample output (2 records):**

```json
[
  {
    "id": 3412,
    "name": "Alice Smith",
    "email": "alice_xx@example.com",
    "status": "active",
    "address": {
      "city": "New York",
      "street": "XkT5p2",
      "zipCode": 450231
    },
    "tags": ["react", "python"]
  },
  {
    "id": 7891,
    "name": "Bob Jones",
    "email": "bobjones92@example.com",
    "status": "pending",
    "address": {
      "city": "London",
      "street": "MnR8q1",
      "zipCode": 823104
    },
    "tags": ["vue", "node", "go"]
  }
]
```

---

## Example 2: E-commerce Order Data

**Field config:**

| Field | Type | Config |
|-------|------|--------|
| orderId | Template | `ORD-{{int(10000,99999)}}` |
| userId | Integer | 1000 – 9999 |
| amount | Float | 9.9 – 9999.9, 2 decimal places |
| status | Enum | paid, pending, refunded, cancelled |
| createdAt | Datetime | — |
| items | Array | object type, 1–5 elements |

**Sample output:**

```json
[
  {
    "orderId": "ORD-45892",
    "userId": 2341,
    "amount": 299.90,
    "status": "paid",
    "createdAt": "2024-04-10T09:15:32Z",
    "items": [
      { "sku": "Ab3xQ", "qty": 2, "price": 149.95 }
    ]
  }
]
```

---

## Example 3: Article / Content Data

**Field config:**

| Field | Type | Config |
|-------|------|--------|
| articleId | UUID | — |
| title | Template | `Article {{int(1,9999)}}` |
| author | Name | — |
| category | Enum | tech, product, design, ops |
| views | Integer | 0 – 100,000 |
| publishedAt | Date | — |
| isPublished | Boolean | — |

---

## Example 4: Use with JSON Server

Generate 100 user records, save as `db.json`, and spin up a REST API instantly:

```bash
# Install JSON Server
npm install -g json-server

# Start the server (put the generated array under the "users" key in db.json)
json-server --watch db.json --port 3001
```

Then access:
- `GET http://localhost:3001/users` — list all users
- `GET http://localhost:3001/users/1` — get a single user
- `POST http://localhost:3001/users` — create a user

---

## Example 5: Use with Postman Mock

1. Create a Collection in Postman
2. Configure an Example Response for the endpoint, pasting the generated mock data
3. Enable the Postman Mock Server
4. Point your frontend directly at the mock server URL — no backend needed

---

## Common Field Template Quick Reference

| Scenario | Recommended config |
|----------|-------------------|
| Auto-increment DB ID | Integer, 1 – 999,999 |
| UUID primary key | UUID type |
| Username | String or Name type |
| Price | Float, 2 decimal places |
| Rating | Float, 1.0 – 5.0, 1 decimal place |
| Timestamp | Datetime type |
| Order number | Template: `ORD-{{int(10000,99999)}}` |
| Phone number | Phone type |
| Status code | Enum: 0,1,2 or active,inactive |

