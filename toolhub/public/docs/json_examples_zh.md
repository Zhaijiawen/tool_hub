# JSON 代码示例

## 最常见的结构

### 简单对象

```json
{
  "name": "张三",
  "age": 25,
  "isStudent": true,
  "hobbies": ["阅读", "游泳", "编程"]
}
```

### 嵌套对象 -- 真实 API 就长这样

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
注意嵌套层次是 `user -> profile -> 字段`。三层没问题，超过五层就该考虑扁平化了。

### 对象数组 -- 列表接口都返回这个

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

---

## API 响应模式

### 成功响应带数据封装

把实际数据包在 `data` 字段里，外面加元信息，是个很常见的模式。好处是加分页、加时间戳都不用动数据本身的形状。

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

结构化的错误比一个字符串消息强多了。`details` 数组可以一次返回多个验证失败项，不用让用户一个个改。

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

## 配置文件示例

### 应用配置

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

## JavaScript 解析与生成

### 解析并处理日期

`JSON.parse` 必须包 try/catch，别偷懒。reviver 函数在日期还原、BigInt 处理、数据清洗这些场景都很有用。

```js
const jsonString = '{"name":"张三","age":30}'
const user = JSON.parse(jsonString)
console.log(user.name) // 张三

// 别省掉 try/catch
try {
  const invalidJson = '{name:"李四",age:35}' // 键缺引号
  const result = JSON.parse(invalidJson)
} catch (error) {
  console.error('JSON 解析错误:', error.message)
}

// reviver 处理日期
const jsonWithDates = '{"name":"王五","birthDate":"1990-01-01"}'
const userWithDates = JSON.parse(jsonWithDates, (key, value) => {
  if (key === 'birthDate') return new Date(value)
  return value
})
```

### 生成 JSON

`stringify` 第三个参数控制缩进。`null, 2` 是"不用 replacer，2 空格缩进"的缩写 -- 你会打无数次这种写法。

```js
const data = {
  name: '赵六',
  age: 28,
  skills: ['JavaScript', 'Vue', 'Node.js']
}

const jsonString = JSON.stringify(data, null, 2)
// {
//   "name": "赵六",
//   "age": 28,
//   "skills": [
//     "JavaScript",
//     "Vue",
//     "Node.js"
//   ]
// }
```

### 数组过滤转 JSON

```js
const users = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 35 }
]

const youngUsers = users
  .filter(user => user.age < 30)
  .map(user => ({ name: user.name, age: user.age }))

const youngUsersJson = JSON.stringify(youngUsers, null, 2)
```

---

## 真实数据形状

### 用户资料（数据库文档）

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

### 产品目录项

价格用对象 `{ amount, currency }` 比一个裸数字好 -- 自说明，多币种场景也能处理。

```json
{
  "id": "prod_001",
  "name": "无线耳机",
  "price": {
    "amount": 199.99,
    "currency": "CNY"
  },
  "category": "电子产品",
  "tags": ["无线", "音频", "降噪"],
  "specifications": {
    "batteryLife": "20小时",
    "connectivity": "蓝牙5.0"
  },
  "inventory": {
    "stock": 50,
    "reserved": 5,
    "available": 45
  }
}
```

### 验证错误

返回字段级别的错误数组，前端可以直接把每个错误映射到对应的表单字段。

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
      "code": "PASSWORD_TOO_SHORT"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```
