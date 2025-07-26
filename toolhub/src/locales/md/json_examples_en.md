# JSON Code Examples

## Basic JSON Structure Examples

### Simple Object

```json
{
  "name": "John Doe",
  "age": 25,
  "isStudent": true,
  "hobbies": ["reading", "swimming", "programming"]
}
```

### Nested Object

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

### Array Example

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

## API Response Examples

### Success Response

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

### Error Response

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

## Configuration File Examples

### Application Config

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

## JavaScript Processing Examples

### Parsing JSON

```js
// Parse JSON from string
const jsonString = '{"name":"Alice","age":30}'
const user = JSON.parse(jsonString)
console.log(user.name) // Output: Alice

// Handle parsing errors
try {
  const invalidJson = '{"name":"Bob",age:35}' // Missing quotes
  const result = JSON.parse(invalidJson)
} catch (error) {
  console.error('JSON parsing error:', error.message)
}
```

### Generating JSON

```js
// Convert object to JSON string
const data = {
  name: 'Charlie',
  age: 28,
  skills: ['JavaScript', 'Vue', 'Node.js']
}

const jsonString = JSON.stringify(data, null, 2)
console.log(jsonString)

// Output:
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