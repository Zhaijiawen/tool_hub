# JSON 代码示例

## 基本 JSON 结构示例

### 简单对象

```json
{
  "name": "张三",
  "age": 25,
  "isStudent": true,
  "hobbies": ["阅读", "游泳", "编程"]
}
```

### 嵌套对象

```json
{
  "user": {
    "id": 1001,
    "profile": {
      "firstName": "李",
      "lastName": "四",
      "email": "lisi@example.com"
    },
    "settings": {
      "theme": "dark",
      "language": "zh-CN",
      "notifications": true
    }
  }
}
```

### 数组示例

```json
{
  "products": [
    {
      "id": 1,
      "name": "笔记本电脑",
      "price": 999.99,
      "category": "电子产品"
    },
    {
      "id": 2,
      "name": "无线鼠标",
      "price": 29.99,
      "category": "配件"
    }
  ]
}
```

## API 响应示例

### 成功响应

```json
{
  "success": true,
  "data": {
    "id": 12345,
    "title": "示例文章",
    "content": "这是文章内容...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "无效的输入参数",
    "details": [
      "用户名不能为空",
      "邮箱格式不正确"
    ]
  }
}
```

### 分页响应

```json
{
  "data": [
    {
      "id": 1,
      "name": "产品1",
      "price": 100
    },
    {
      "id": 2,
      "name": "产品2",
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

## 配置文件示例

### 应用程序配置

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

### Package.json 示例

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "一个示例项目",
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

## JavaScript 处理示例

### 解析 JSON

```js
// 从字符串解析 JSON
const jsonString = '{"name":"张三","age":30}'
const user = JSON.parse(jsonString)
console.log(user.name) // 输出：张三

// 处理解析错误
try {
  const invalidJson = '{"name":"李四",age:35}' // 缺少引号
  const result = JSON.parse(invalidJson)
} catch (error) {
  console.error('JSON 解析错误:', error.message)
}

// 使用 reviver 函数解析
const jsonWithDates = '{"name":"王五","birthDate":"1990-01-01"}'
const userWithDates = JSON.parse(jsonWithDates, (key, value) => {
  if (key === 'birthDate') {
    return new Date(value)
  }
  return value
})
```

### 生成 JSON

```js
// 将对象转换为 JSON 字符串
const data = {
  name: '赵六',
  age: 28,
  skills: ['JavaScript', 'Vue', 'Node.js']
}

const jsonString = JSON.stringify(data, null, 2)
console.log(jsonString)

// 输出：
// {
//   "name": "赵六",
//   "age": 28,
//   "skills": [
//     "JavaScript",
//     "Vue",
//     "Node.js"
//   ]
// }

// 自定义 replacer 函数
const dataWithFunctions = {
  name: '钱七',
  age: 25,
  greet: function() { return '你好！' }
}

const jsonWithoutFunctions = JSON.stringify(dataWithFunctions, (key, value) => {
  if (typeof value === 'function') {
    return undefined // 排除函数
  }
  return value
})
```

### 处理数组

```js
// 对象数组
const users = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 35 }
]

const usersJson = JSON.stringify(users, null, 2)

// 过滤并转换为 JSON
const youngUsers = users
  .filter(user => user.age < 30)
  .map(user => ({ name: user.name, age: user.age }))

const youngUsersJson = JSON.stringify(youngUsers, null, 2)
```

## 数据库示例

### 用户资料

```json
{
  "id": "user_123",
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "profile": {
    "firstName": "张",
    "lastName": "三",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "热爱干净代码的软件开发者"
  },
  "preferences": {
    "theme": "dark",
    "language": "zh",
    "timezone": "UTC+8",
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

### 产品目录

```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "无线耳机",
      "description": "具有降噪功能的高质量无线耳机",
      "price": {
        "amount": 199.99,
        "currency": "CNY"
      },
      "category": "电子产品",
      "tags": ["无线", "音频", "降噪"],
      "specifications": {
        "batteryLife": "20小时",
        "connectivity": "蓝牙5.0",
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

## Web 应用程序示例

### 表单数据

```json
{
  "formData": {
    "personalInfo": {
      "firstName": "李",
      "lastName": "四",
      "email": "lisi@example.com",
      "phone": "+86-138-1234-5678"
    },
    "address": {
      "street": "中关村大街1号",
      "city": "北京",
      "province": "北京",
      "zipCode": "100080",
      "country": "中国"
    },
    "preferences": {
      "newsletter": true,
      "marketing": false,
      "language": "zh"
    }
  }
}
```

### API 请求/响应

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
      "name": "新用户",
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
      "name": "新用户",
      "email": "newuser@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## 错误处理示例

### 验证错误

```json
{
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式无效",
      "code": "INVALID_EMAIL",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "密码至少需要8个字符",
      "code": "PASSWORD_TOO_SHORT",
      "value": "123"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

### 系统错误

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "发生意外错误",
    "details": "数据库连接失败",
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456",
    "stack": "Error: Connection timeout..."
  }
}
```

## 高级示例

### 复杂嵌套结构

```json
{
  "organization": {
    "id": "org_001",
    "name": "科技公司",
    "departments": [
      {
        "id": "dept_001",
        "name": "工程部",
        "manager": {
          "id": "emp_001",
          "name": "张经理",
          "email": "zhang.manager@techcorp.com"
        },
        "employees": [
          {
            "id": "emp_002",
            "name": "李工程师",
            "position": "高级开发者",
            "skills": ["JavaScript", "Python", "React"],
            "projects": [
              {
                "id": "proj_001",
                "name": "电商平台",
                "status": "进行中",
                "progress": 75
              }
            ]
          }
        ]
      }
    ],
    "settings": {
      "timezone": "UTC+8",
      "workingHours": {
        "start": "09:00",
        "end": "18:00"
      },
      "holidays": [
        "2024-01-01",
        "2024-02-10",
        "2024-10-01"
      ]
    }
  }
}
```

### 带环境变量的配置

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

这些示例演示了在 Web 开发、API 设计和数据管理中常见的各种 JSON 模式和用例。 