# Mock Data Generator — Examples

## User list (the default template)

| Field | Type | Config |
|-------|------|--------|
| id | Integer | 1 – 10,000 |
| name | Name | — |
| email | Email | — |
| status | Enum | active, inactive, pending |
| address | Object | children: city, street, zipCode |
| tags | Array | enum items: vue, react, node, python |

Sample output:
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

## E-commerce orders

| Field | Type | Config |
|-------|------|--------|
| orderId | Template | `ORD-{{int(10000,99999)}}` |
| userId | Integer | 1000 – 9999 |
| amount | Float | 9.9 – 9999.9, 2 decimal places |
| status | Enum | paid, pending, refunded, cancelled |
| createdAt | Datetime | — |
| items | Array | object type, 1–5 elements |

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

## Article / content data

| Field | Type | Config |
|-------|------|--------|
| articleId | UUID | — |
| title | Template | `Article {{int(1,9999)}}` |
| author | Name | — |
| category | Enum | tech, product, design, ops |
| views | Integer | 0 – 100,000 |
| publishedAt | Date | — |
| isPublished | Boolean | — |

## Using with JSON Server

Generate 100 user records, save as `db.json`, and you've got a REST API in seconds:

```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

Now `GET http://localhost:3001/users` returns your mock data. POST, PUT, DELETE work too — JSON Server persists changes to `db.json`.

## Using with Postman mock

1. Create a collection in Postman
2. Set up an example response for your endpoint, pasting in the generated mock data
3. Enable Postman's mock server
4. Your frontend now has a live endpoint with realistic data

## Quick field config reference

| What you need | Recommended setup |
|---------------|------------------|
| Auto-increment ID | Integer, 1 – 999999 |
| UUID primary key | UUID type |
| Username | String or Name |
| Price | Float, 2 decimal places |
| Rating | Float, 1.0 – 5.0, 1 decimal |
| Timestamp | Datetime |
| Order number | Template: `ORD-{{int(10000,99999)}}` |
| Phone | Phone type |
| Status | Enum with comma-separated options |
