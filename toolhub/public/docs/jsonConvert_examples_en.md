# JSON Multi-format Converter - Examples

## Example 1: API Response to Configuration File

### Scenario
Converting JSON configuration data from an API into YAML format for a Kubernetes deployment file.

**JSON Input:**
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

**YAML Output:**
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

## Example 2: CSV User Data to JSON

### Scenario
Converting a user list CSV exported from Excel into a JSON array for bulk import via a backend API.

**CSV Input:**
```csv
userId,username,email,role,createdAt
1001,alice,alice@example.com,admin,2024-01-01
1002,bob,bob@example.com,user,2024-01-15
1003,carol,carol@example.com,editor,2024-02-01
1004,dave,dave@example.com,user,2024-02-20
```

**JSON Output:**
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

## Example 3: XML Config to JSON

### Scenario
Migrating a legacy system's XML configuration file to JSON format for a new system.

**XML Input:**
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

**JSON Output:**
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

## Example 4: JSON to TOML (Rust Project Config)

**JSON Input:**
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

**TOML Output:**
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

## Example 5: JSON to CSV (Report Export)

**JSON Input (Sales Data):**
```json
[
  {"month": "2024-01", "product": "Pro Plan", "sales": 1250, "revenue": 62500},
  {"month": "2024-02", "product": "Pro Plan", "sales": 1380, "revenue": 69000},
  {"month": "2024-01", "product": "Basic Plan", "sales": 3200, "revenue": 32000},
  {"month": "2024-02", "product": "Basic Plan", "sales": 3450, "revenue": 34500}
]
```

**CSV Output (Opens directly in Excel):**
```csv
month,product,sales,revenue
2024-01,Pro Plan,1250,62500
2024-02,Pro Plan,1380,69000
2024-01,Basic Plan,3200,32000
2024-02,Basic Plan,3450,34500
```

---

## Common Conversion Scenarios in Development

| From | To | Typical Use Case |
|------|-----|-----------------|
| JSON | YAML | API data → Kubernetes/Docker config |
| YAML | JSON | CI config → program processing |
| CSV | JSON | Excel data → backend bulk import |
| JSON | CSV | Database query results → report download |
| XML | JSON | SOAP/legacy system data → REST API |
| JSON | XML | REST data → enterprise ESB integration |
| JSON | TOML | App config → Rust/Python project config |

