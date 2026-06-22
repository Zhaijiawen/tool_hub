# Mock 数据生成 — 使用示例

## 用户列表（默认模板）

| 字段名 | 类型 | 配置 |
|--------|------|------|
| id | 整数 | 1 ~ 10000 |
| name | 姓名 | — |
| email | 邮箱 | — |
| status | 枚举 | active, inactive, pending |
| address | 对象 | 子字段：city, street, zipCode |
| tags | 数组 | 枚举元素：vue, react, node, python |

生成结果示例：
```json
[
  {
    "id": 3412,
    "name": "李明",
    "email": "liming_xx@example.com",
    "status": "active",
    "address": {
      "city": "北京",
      "street": "XkT5p2",
      "zipCode": 450231
    },
    "tags": ["react", "python"]
  },
  {
    "id": 7891,
    "name": "王芳",
    "email": "wangfang92@example.com",
    "status": "pending",
    "address": {
      "city": "上海",
      "street": "MnR8q1",
      "zipCode": 823104
    },
    "tags": ["vue", "node", "go"]
  }
]
```

## 电商订单

| 字段名 | 类型 | 配置 |
|--------|------|------|
| orderId | 模板 | `ORD-{{int(10000,99999)}}` |
| userId | 整数 | 1000 ~ 9999 |
| amount | 浮点数 | 9.9 ~ 9999.9，2 位小数 |
| status | 枚举 | paid, pending, refunded, cancelled |
| createdAt | 日期时间 | — |
| items | 数组 | 对象类型，1~5 个元素 |

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

## 文章/内容数据

| 字段名 | 类型 | 配置 |
|--------|------|------|
| articleId | UUID | — |
| title | 模板 | `文章 {{int(1,9999)}} 号` |
| author | 姓名 | — |
| category | 枚举 | 技术, 产品, 设计, 运营 |
| views | 整数 | 0 ~ 100000 |
| publishedAt | 日期 | — |
| isPublished | 布尔值 | — |

## 配合 JSON Server 使用

生成 100 条用户数据，保存为 `db.json`，几秒钟搭好一个 REST API：

```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

然后 `GET http://localhost:3001/users` 返回你的 Mock 数据。POST、PUT、DELETE 也都能用——JSON Server 会把改动写回 `db.json`。

## 配合 Postman Mock 使用

1. Postman 里新建 Collection
2. 给接口配置 Example Response，粘贴生成的 Mock 数据
3. 启用 Postman Mock Server
4. 前端直接走 Mock 服务地址，后端接口没写好也能联调

## 常见字段配置速查

| 需求 | 推荐配置 |
|------|---------|
| 自增 ID | 整数，1 ~ 999999 |
| UUID 主键 | UUID 类型 |
| 用户名 | 字符串 或 姓名 |
| 价格 | 浮点数，2 位精度 |
| 评分 | 浮点数，1.0 ~ 5.0，1 位精度 |
| 时间戳 | 日期时间 |
| 订单号 | 模板：`ORD-{{int(10000,99999)}}` |
| 手机号 | 手机号类型 |
| 状态码 | 枚举，逗号分隔选项 |
