# JSON 示例代码

## 基础 JSON 结构示例

### 简单对象

```json
{
  "name": "张三",
  "age": 25,
  "isStudent": true,
  "hobbies": ["读书", "游泳", "编程"]
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
      "price": 5999.99,
      "category": "电子产品"
    },
    {
      "id": 2,
      "name": "无线鼠标",
      "price": 129.99,
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
    "message": "输入参数无效",
    "details": [
      "用户名不能为空",
      "邮箱格式不正确"
    ]
  }
}
```

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
    "i18n": ["zh", "en"],
    "analytics": false
  }
}
```

## JavaScript 处理示例

### 解析 JSON

```js
// 从字符串解析 JSON
const jsonString = '{"name":"王五","age":30}'
const user = JSON.parse(jsonString)
console.log(user.name) // 输出: 王五

// 处理解析错误
try {
  const invalidJson = '{"name":"赵六",age:35}' // 缺少引号
  const result = JSON.parse(invalidJson)
} catch (error) {
  console.error('JSON 解析错误:', error.message)
}
```

### 生成 JSON

```js
// 对象转 JSON 字符串
const data = {
  name: '钱七',
  age: 28,
  skills: ['JavaScript', 'Vue', 'Node.js']
}

const jsonString = JSON.stringify(data, null, 2)
console.log(jsonString)

// 输出:
// {
//   "name": "钱七",
//   "age": 28,
//   "skills": [
//     "JavaScript",
//     "Vue",
//     "Node.js"
//   ]
// }
``` 