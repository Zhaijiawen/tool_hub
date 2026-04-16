# JSON 多格式互转 - 代码示例

## 示例 1：API 响应转配置文件

### 场景
从 API 获取到 JSON 配置数据，需要转为 YAML 格式用于 Kubernetes 配置文件。

**JSON 输入：**
```json
{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "my-app",
    "labels": {
      "app": "my-app",
      "version": "v1.0"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "my-app"
      }
    }
  }
}
```

**YAML 输出：**
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

## 示例 2：CSV 用户数据转 JSON

### 场景
从 Excel 导出的用户列表 CSV，转换为 JSON 数组供后端 API 批量导入使用。

**CSV 输入：**
```csv
userId,username,email,role,createdAt
1001,alice,alice@example.com,admin,2024-01-01
1002,bob,bob@example.com,user,2024-01-15
1003,carol,carol@example.com,editor,2024-02-01
1004,dave,dave@example.com,user,2024-02-20
```

**JSON 输出：**
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
  },
  {
    "userId": "1003",
    "username": "carol",
    "email": "carol@example.com",
    "role": "editor",
    "createdAt": "2024-02-01"
  },
  {
    "userId": "1004",
    "username": "dave",
    "email": "dave@example.com",
    "role": "user",
    "createdAt": "2024-02-20"
  }
]
```

---

## 示例 3：XML 配置转 JSON

### 场景
遗留系统的 XML 配置文件，迁移到新系统时需要转为 JSON 格式。

**XML 输入：**
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

**JSON 输出：**
```json
{
  "config": {
    "database": {
      "host": "db.example.com",
      "port": "3306",
      "name": "production",
      "pool": {
        "min": "5",
        "max": "20"
      }
    },
    "cache": {
      "type": "redis",
      "ttl": "3600"
    }
  }
}
```

---

## 示例 4：JSON 转 TOML（Rust 项目配置）

**JSON 输入：**
```json
{
  "package": {
    "name": "my-rust-app",
    "version": "0.1.0",
    "edition": "2021"
  },
  "dependencies": {
    "serde": "1.0",
    "tokio": "1.0",
    "axum": "0.7"
  }
}
```

**TOML 输出：**
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

## 示例 5：JSON 转 CSV（报表导出）

**JSON 输入（销售数据）：**
```json
[
  {"month": "2024-01", "product": "Pro套餐", "sales": 1250, "revenue": 62500},
  {"month": "2024-02", "product": "Pro套餐", "sales": 1380, "revenue": 69000},
  {"month": "2024-01", "product": "基础套餐", "sales": 3200, "revenue": 32000},
  {"month": "2024-02", "product": "基础套餐", "sales": 3450, "revenue": 34500}
]
```

**CSV 输出（可直接在 Excel 中打开）：**
```csv
month,product,sales,revenue
2024-01,Pro套餐,1250,62500
2024-02,Pro套餐,1380,69000
2024-01,基础套餐,3200,32000
2024-02,基础套餐,3450,34500
```

---

## 实际开发中的转换场景

| 从 | 到 | 典型场景 |
|----|----|----|
| JSON | YAML | API 数据 → Kubernetes/Docker 配置 |
| YAML | JSON | 读取 CI 配置 → 程序处理 |
| CSV | JSON | Excel 数据 → 后端批量导入 |
| JSON | CSV | 数据库查询结果 → 报表下载 |
| XML | JSON | SOAP/旧系统数据 → REST API |
| JSON | XML | REST 数据 → 企业 ESB 集成 |
| JSON | TOML | 程序配置 → Rust/Python 项目配置 |

