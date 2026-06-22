# JSON Multi-format Converter - Examples

## API response to Kubernetes YAML

You've got a JSON deployment spec from a dashboard or API and need it as YAML for `kubectl apply`.

Input:
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

Output -- clean, no quotes around keys, exactly what kubectl wants:
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

## CSV export to JSON for API import

Exported a user list from Excel as CSV, need JSON for a bulk import endpoint.

Input:
```csv
userId,username,email,role,createdAt
1001,alice,alice@example.com,admin,2024-01-01
1002,bob,bob@example.com,user,2024-01-15
1003,carol,carol@example.com,editor,2024-02-01
1004,dave,dave@example.com,user,2024-02-20
```

Output -- everything is a string. Post-process if you need `userId` as a number:
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

## Legacy XML config to JSON

Pulling a config out of an old system that speaks XML, need it in JSON for a modern service.

Input:
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

Output -- note all values become strings since XML has no built-in types:
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

## JSON to TOML -- Rust/Python project config

Input:
```json
{
  "package": { "name": "my-rust-app", "version": "0.1.0", "edition": "2021" },
  "dependencies": { "serde": "1.0", "tokio": "1.0", "axum": "0.7" }
}
```

Output:
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

## JSON to CSV -- sales report for Excel

Input:
```json
[
  {"month": "2024-01", "product": "Pro Plan", "sales": 1250, "revenue": 62500},
  {"month": "2024-02", "product": "Pro Plan", "sales": 1380, "revenue": 69000},
  {"month": "2024-01", "product": "Basic Plan", "sales": 3200, "revenue": 32000},
  {"month": "2024-02", "product": "Basic Plan", "sales": 3450, "revenue": 34500}
]
```

Output -- opens directly in Excel or Google Sheets:
```csv
month,product,sales,revenue
2024-01,Pro Plan,1250,62500
2024-02,Pro Plan,1380,69000
2024-01,Basic Plan,3200,32000
2024-02,Basic Plan,3450,34500
```

---

## Common conversion paths

| From | To | Real-world scenario |
|------|----|--------------------|
| JSON | YAML | API response to Kubernetes/Docker Compose config |
| YAML | JSON | Read CI config into a program for processing |
| CSV | JSON | Excel user data to backend bulk import API |
| JSON | CSV | Database query results to a downloadable report |
| XML | JSON | SOAP/legacy system data to a REST API |
| JSON | XML | REST data into an enterprise ESB integration |
| JSON | TOML | App config to Rust/Python project config file |
