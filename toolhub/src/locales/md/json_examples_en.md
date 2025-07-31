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

### Paginated Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 100
    },
    {
      "id": 2,
      "name": "Product 2",
      "price": 200
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
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

### Package.json Example

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.17.1",
    "axios": "^0.21.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7",
    "jest": "^27.0.6"
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

// Parse with reviver function
const jsonWithDates = '{"name":"John","birthDate":"1990-01-01"}'
const userWithDates = JSON.parse(jsonWithDates, (key, value) => {
  if (key === 'birthDate') {
    return new Date(value)
  }
  return value
})
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

// Custom replacer function
const dataWithFunctions = {
  name: 'David',
  age: 25,
  greet: function() { return 'Hello!' }
}

const jsonWithoutFunctions = JSON.stringify(dataWithFunctions, (key, value) => {
  if (typeof value === 'function') {
    return undefined // Exclude functions
  }
  return value
})
```

### Working with Arrays

```js
// Array of objects
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
]

const usersJson = JSON.stringify(users, null, 2)

// Filter and convert to JSON
const youngUsers = users
  .filter(user => user.age < 30)
  .map(user => ({ name: user.name, age: user.age }))

const youngUsersJson = JSON.stringify(youngUsers, null, 2)
```

## Database Examples

### User Profile

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

### Product Catalog

```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": {
        "amount": 199.99,
        "currency": "USD"
      },
      "category": "Electronics",
      "tags": ["wireless", "audio", "noise-cancellation"],
      "specifications": {
        "batteryLife": "20 hours",
        "connectivity": "Bluetooth 5.0",
        "weight": "250g"
      },
      "inventory": {
        "stock": 50,
        "reserved": 5,
        "available": 45
      },
      "images": [
        "https://example.com/headphones-1.jpg",
        "https://example.com/headphones-2.jpg"
      ]
    }
  ]
}
```

## Web Application Examples

### Form Data

```json
{
  "formData": {
    "personalInfo": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-555-123-4567"
    },
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "preferences": {
      "newsletter": true,
      "marketing": false,
      "language": "en"
    }
  }
}
```

### API Request/Response

```json
{
  "request": {
    "method": "POST",
    "url": "/api/users",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "body": {
      "name": "New User",
      "email": "newuser@example.com",
      "role": "user"
    }
  },
  "response": {
    "status": 201,
    "headers": {
      "Content-Type": "application/json",
      "Location": "/api/users/123"
    },
    "body": {
      "id": 123,
      "name": "New User",
      "email": "newuser@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Error Handling Examples

### Validation Errors

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
      "code": "PASSWORD_TOO_SHORT",
      "value": "123"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

### System Error

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred",
    "details": "Database connection failed",
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456",
    "stack": "Error: Connection timeout..."
  }
}
```

## Advanced Examples

### Complex Nested Structure

```json
{
  "organization": {
    "id": "org_001",
    "name": "TechCorp",
    "departments": [
      {
        "id": "dept_001",
        "name": "Engineering",
        "manager": {
          "id": "emp_001",
          "name": "Sarah Johnson",
          "email": "sarah.johnson@techcorp.com"
        },
        "employees": [
          {
            "id": "emp_002",
            "name": "Mike Chen",
            "position": "Senior Developer",
            "skills": ["JavaScript", "Python", "React"],
            "projects": [
              {
                "id": "proj_001",
                "name": "E-commerce Platform",
                "status": "in-progress",
                "progress": 75
              }
            ]
          }
        ]
      }
    ],
    "settings": {
      "timezone": "UTC-5",
      "workingHours": {
        "start": "09:00",
        "end": "17:00"
      },
      "holidays": [
        "2024-01-01",
        "2024-07-04",
        "2024-12-25"
      ]
    }
  }
}
```

### Configuration with Environment Variables

```json
{
  "development": {
    "database": {
      "host": "localhost",
      "port": 5432,
      "name": "dev_db"
    },
    "redis": {
      "host": "localhost",
      "port": 6379
    },
    "logging": {
      "level": "debug",
      "format": "json"
    }
  },
  "production": {
    "database": {
      "host": "${DB_HOST}",
      "port": "${DB_PORT}",
      "name": "${DB_NAME}"
    },
    "redis": {
      "host": "${REDIS_HOST}",
      "port": "${REDIS_PORT}"
    },
    "logging": {
      "level": "info",
      "format": "json"
    }
  }
}
```

These examples demonstrate various JSON patterns and use cases commonly encountered in web development, API design, and data management. 