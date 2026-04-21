# Mock Data Generator - Technical Background

## What is Mock Data

**Mock data** is fabricated data used during development and testing to stand in for real data. It has the same structure as real data but contains randomly generated content with no real user information.

## Why Mock Data is Needed

### Parallel Frontend-Backend Development

Frontend development often requires real API responses to build pages, but backend endpoints may not be ready yet. Mock data lets frontend teams proceed without waiting:

```
Backend still building: /api/users  →  use mock data as a stand-in
Frontend develops normally; swap in the real API at integration time
```

### Test Coverage

Unit tests and integration tests need varied input data. Writing test fixtures by hand is slow and edge cases are easily missed. A mock generator can:
- Batch-generate boundary values (very long strings, very large numbers)
- Generate large datasets to stress-test list rendering performance
- Cover multiple status combinations (active / inactive / pending)

### Demos and Presentations

Using real user data in product demos or design reviews carries privacy risks. Mock data makes demos both realistic and safe.

## Comparison of Common Mock Data Approaches

| Approach | Representative tools | Best for |
|----------|---------------------|---------|
| Code generation library | Faker.js, @faker-js/faker | Programmatic bulk generation |
| Online visual tool | This tool, Mockaroo | Quick one-off generation |
| Mock server | JSON Server, MSW | Full API mock service |
| API platform | Apifox, RAP2 | Team-wide API mocking |

## JSON Format Basics

This tool generates a standard **JSON array** where each record is a JSON object:

```json
[
  {
    "id": 4512,
    "name": "Alice",
    "email": "alice@example.com",
    "status": "active",
    "tags": ["vue", "node"]
  }
]
```

This format can be used directly for:
- Frontend `JSON.parse()` parsing
- Bulk database imports (e.g. MongoDB `insertMany`)
- Static data files for API mock servers

## Data Type Coverage

Well-rounded mock data should cover common field types:

| Category | Example fields |
|----------|---------------|
| Identifiers | id, uuid |
| Personal info | name, email, phone |
| Timestamps | createdAt, updatedAt |
| Status enum | status: active/inactive |
| Numeric ranges | price, age, quantity |
| Complex structures | nested address object, tags array |

