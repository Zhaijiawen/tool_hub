# JSON 多格式互转 - 代码示例

## API 响应转 Kubernetes YAML

从面板或 API 拿到 JSON 格式的 deployment 配置，需要转成 YAML 给 `kubectl apply` 用。

输入：
```json
{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "my-app",
    "labels": { "app": "my-app", "version": "v1.0" }
  },
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "my-app" } }
  }
}
```

输出 -- 干净、键不带引号、标准的 kubectl 格式：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
    version: v1.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
```

---

## Excel 导出 CSV 转 JSON 批量导入

从 Excel 导出了用户列表 CSV，需要 JSON 数组给后端批量导入接口。

输入：
```csv
userId,username,email,role,createdAt
1001,alice,alice@example.com,admin,2024-01-01
1002,bob,bob@example.com,user,2024-01-15
1003,carol,carol@example.com,editor,2024-02-01
1004,dave,dave@example.com,user,2024-02-20
```

输出 -- 所有值都是字符串，如果 `userId` 需要数字类型后续自己转：
```json
[
  {
    "userId": "1001",
    "username": "alice",
    "email": "alice@example.com",
    "role": "admin",
    "createdAt": "2024-01-01"
  },
  {
    "userId": "1002",
    "username": "bob",
    "email": "bob@example.com",
    "role": "user",
    "createdAt": "2024-01-15"
  }
]
```

---

## 遗留系统 XML 配置转 JSON

从老系统导出 XML 配置，新系统需要 JSON。

输入：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>db.example.com</host>
    <port>3306</port>
    <name>production</name>
    <pool>
      <min>5</min>
      <max>20</max>
    </pool>
  </database>
  <cache>
    <type>redis</type>
    <ttl>3600</ttl>
  </cache>
</config>
```

输出 -- 注意所有值变成字符串，XML 没有内置类型：
```json
{
  "config": {
    "database": {
      "host": "db.example.com",
      "port": "3306",
      "name": "production",
      "pool": { "min": "5", "max": "20" }
    },
    "cache": { "type": "redis", "ttl": "3600" }
  }
}
```

---

## JSON 转 TOML -- Rust/Python 项目配置

输入：
```json
{
  "package": { "name": "my-rust-app", "version": "0.1.0", "edition": "2021" },
  "dependencies": { "serde": "1.0", "tokio": "1.0", "axum": "0.7" }
}
```

输出：
```toml
[package]
name = "my-rust-app"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = "1.0"
tokio = "1.0"
axum = "0.7"
```

---

## JSON 转 CSV -- 销售报表给 Excel

输入：
```json
[
  {"month": "2024-01", "product": "Pro套餐", "sales": 1250, "revenue": 62500},
  {"month": "2024-02", "product": "Pro套餐", "sales": 1380, "revenue": 69000},
  {"month": "2024-01", "product": "基础套餐", "sales": 3200, "revenue": 32000},
  {"month": "2024-02", "product": "基础套餐", "sales": 3450, "revenue": 34500}
]
```

输出 -- 可以直接用 Excel 或 Google Sheets 打开：
```csv
month,product,sales,revenue
2024-01,Pro套餐,1250,62500
2024-02,Pro套餐,1380,69000
2024-01,基础套餐,3200,32000
2024-02,基础套餐,3450,34500
```

---

## 常见转换路径

| 从 | 到 | 实际场景 |
|------|----|---------|
| JSON | YAML | API 响应转 Kubernetes/Docker Compose 配置 |
| YAML | JSON | 读取 CI 配置给程序处理 |
| CSV | JSON | Excel 用户数据转后端批量导入 API |
| JSON | CSV | 数据库查询结果转可下载报表 |
| XML | JSON | SOAP/旧系统数据转 REST API |
| JSON | XML | REST 数据转企业 ESB 集成 |
| JSON | TOML | 应用配置转 Rust/Python 项目配置文件 |
