# Mock Data Generator — Why Mock Data Exists

Mock data is fake data that looks real. Same structure as your actual data, but randomly generated — no real PII, no real email addresses, no real anything. It's what you use when the real data doesn't exist yet, or when using real data would be a bad idea.

## Three reasons you need it

**Frontend can't wait for backend —** The API endpoint isn't ready, but you need to build the UI today. Mock data lets you wire up components with realistic-looking data, then swap in the real API later without changing your component code.

**Testing needs variety —** Unit tests with the same three hardcoded records don't catch much. A generator can produce edge cases automatically: empty strings, very long names, boundary numbers, different status combinations. It also lets you generate a thousand records to see how your list rendering performs.

**Demos should be safe —** Showing real customer data in a product demo or design review is a privacy nightmare. Mock data looks convincing without exposing anything sensitive.

## How different approaches compare

| Approach | Tools | Best for |
|----------|-------|---------|
| Code library | Faker.js, @faker-js/faker | Programmatic generation in tests or seed scripts |
| Visual tool | This tool, Mockaroo | Quick one-off datasets, no code needed |
| Mock server | JSON Server, MSW | A full fake API that responds to real HTTP requests |
| API platform | Apifox, RAP2 | Team-level API mocking with collaboration features |

## The output format

This tool generates a standard JSON array:

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

This format works directly with `JSON.parse()`, MongoDB's `insertMany`, or as a static data file for any mock server.

## What makes good mock data

A well-designed mock schema covers the common field types you'll encounter:

| Category | Example fields |
|----------|---------------|
| Identifiers | id, uuid |
| Personal info | name, email, phone |
| Timestamps | createdAt, updatedAt |
| Status enums | status: active/inactive/pending |
| Numeric ranges | price, age, quantity |
| Nested structures | address object, tags array |
