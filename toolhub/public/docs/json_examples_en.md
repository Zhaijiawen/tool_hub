# JSON Code Examples

## Common structures you'll actually see

### Simple object -- the bread and butter

```json
{
  "name": "John Doe",
  "age": 25,
  "isStudent": true,
  "hobbies": ["reading", "swimming", "programming"]
}
```

### Nested objects -- real APIs look like this

```json
{
  "user": {
    "id": 1001,
    "profile": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    },
    "settings": {
      "theme": "dark",
      "language": "en-US",
      "notifications": true
    }
  }
}
```
Notice how nesting goes `user -> profile -> fields`. Three levels is fine. More than five and you might want to flatten things.

### Arrays of objects -- every list endpoint returns this

```json
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "category": "Electronics"
    },
    {
      "id": 2,
      "name": "Wireless Mouse",
      "price": 29.99,
      "category": "Accessories"
    }
  ]
}
```

---

## API response patterns

### Success with data envelope

Wrapping the payload in a `data` field and adding metadata is a common pattern. Makes it easy to add pagination, timestamps, etc. without touching the payload shape.

```json
{
  "success": true,
  "data": {
    "id": 12345,
    "title": "Sample Article",
    "content": "This is the article content...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Operation successful"
}
```

### Error response

Structured errors beat string messages. The `details` array lets you return multiple validation failures at once -- way better than making the user fix errors one at a time.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      "Username cannot be empty",
      "Email format is incorrect"
    ]
  }
}
```

### Paginated response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Configuration examples

### App config

```json
{
  "app": {
    "name": "ToolHub",
    "version": "1.0.0",
    "environment": "production"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "toolhub_db",
    "ssl": true
  },
  "features": {
    "darkMode": true,
    "i18n": ["en", "zh"],
    "analytics": false
  }
}
```

### Package.json -- you know this one

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

---

## JavaScript: parsing and generating

### Parse with error handling

Always wrap `JSON.parse` in try/catch. Always. The reviver function is useful for converting date strings back to Date objects, handling BigInt, or cleaning up data shapes.

```js
const jsonString = '{"name":"Alice","age":30}'
const user = JSON.parse(jsonString)
console.log(user.name) // Alice

// Don't skip the try/catch
try {
  const invalidJson = '{name:"Bob",age:35}' // missing quotes on key
  const result = JSON.parse(invalidJson)
} catch (error) {
  console.error('JSON parsing error:', error.message)
}

// Reviver for dates
const jsonWithDates = '{"name":"John","birthDate":"1990-01-01"}'
const userWithDates = JSON.parse(jsonWithDates, (key, value) => {
  if (key === 'birthDate') return new Date(value)
  return value
})
```

### Generate with stringify

The third argument to `stringify` is your indentation. `null, 2` means "no replacer, 2-space indent" -- you'll type this a thousand times.

```js
const data = {
  name: 'Charlie',
  age: 28,
  skills: ['JavaScript', 'Vue', 'Node.js']
}

const jsonString = JSON.stringify(data, null, 2)
// {
//   "name": "Charlie",
//   "age": 28,
//   "skills": [
//     "JavaScript",
//     "Vue",
//     "Node.js"
//   ]
// }
```

### Filtering arrays to JSON

Combine array methods with `stringify` for quick data extraction:

```js
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
]

const youngUsers = users
  .filter(user => user.age < 30)
  .map(user => ({ name: user.name, age: user.age }))

const youngUsersJson = JSON.stringify(youngUsers, null, 2)
```

---

## Real-world data shapes

### User profile (database document)

```json
{
  "id": "user_123",
  "username": "john_doe",
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer passionate about clean code"
  },
  "preferences": {
    "theme": "dark",
    "language": "en",
    "timezone": "UTC-5",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    }
  },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z",
    "lastLogin": "2024-01-20T14:45:00Z"
  }
}
```

### Product catalog item

Price as an object (`{ amount, currency }`) is better than a raw number -- it's self-documenting and handles multi-currency cleanly.

```json
{
  "id": "prod_001",
  "name": "Wireless Headphones",
  "price": {
    "amount": 199.99,
    "currency": "USD"
  },
  "category": "Electronics",
  "tags": ["wireless", "audio", "noise-cancellation"],
  "specifications": {
    "batteryLife": "20 hours",
    "connectivity": "Bluetooth 5.0"
  },
  "inventory": {
    "stock": 50,
    "reserved": 5,
    "available": 45
  }
}
```

### Validation errors

Returning an array of field-level errors lets the frontend map each error to its form field directly.

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "INVALID_EMAIL",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters",
      "code": "PASSWORD_TOO_SHORT"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```


---

## JSON5 Format Examples

Switch to JSON5 mode to try these examples. The following are perfectly valid JSON5 but would break a standard JSON parser.

### Config with comments
```json5
{
  // Database config
  database: {
    host: 'localhost',
    port: 5432,
    /* Replace these credentials in production */
    user: 'admin',
    password: 'changeme',
  },
  // Cache policy
  cache: {
    ttl: 3600, // seconds
    maxSize: '256MB',
  },
}
```

### Unquoted keys and trailing commas
```json5
{
  name: 'ToolHub',
  version: '1.0.0',
  features: [
    'format',
    'encrypt',
    'convert',
  ],
  contributors: [
    { name: 'Alice', role: 'Developer' },
    { name: 'Bob', role: 'Designer' },
  ],
}
```

### Typical build tool config

This is what .prettierrc and other build tool configs look like:

```json5
{
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  // Overrides for this project only
  overrides: [
    {
      files: '*.md',
      options: { tabWidth: 4 },
    },
  ],
}
```

When you format these in JSON5 mode, comments are preserved and key quotes may be optimized — exactly what you want for config files.
