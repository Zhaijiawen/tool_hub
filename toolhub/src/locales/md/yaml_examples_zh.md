# YAML 代码示例

## 基本 YAML 结构示例

### 简单键值对

```yaml
name: John Doe
age: 30
email: john@example.com
is_active: true
```

### 嵌套对象

```yaml
person:
  name: Jane Smith
  age: 25
  contact:
    email: jane@example.com
    phone: +1-555-123-4567
  address:
    street: 123 Main St
    city: New York
    zip: 10001
```

### 数组/列表

```yaml
fruits:
  - apple
  - banana
  - orange

numbers:
  - 1
  - 2
  - 3
  - 4
  - 5
```

### 复杂嵌套结构

```yaml
company:
  name: TechCorp
  founded: 2020
  employees:
    - name: John Doe
      position: Senior Developer
      department: Engineering
      skills:
        - JavaScript
        - Python
        - React
      projects:
        - name: E-commerce Platform
          status: in-progress
          progress: 75
    - name: Jane Smith
      position: Product Manager
      department: Product
      skills:
        - Product Strategy
        - User Research
        - Agile
```

## 配置文件示例

### 应用程序配置

```yaml
# 应用程序设置
app:
  name: MyApplication
  version: 1.0.0
  environment: production
  debug: false

# 数据库配置
database:
  host: localhost
  port: 5432
  name: myapp_db
  user: admin
  password: secret123
  ssl: true
  pool:
    min: 5
    max: 20
    timeout: 30

# 服务器配置
server:
  port: 8080
  host: 0.0.0.0
  timeout: 30
  cors:
    enabled: true
    origins:
      - http://localhost:3000
      - https://myapp.com

# 日志配置
logging:
  level: INFO
  format: json
  file: logs/app.log
  max_size: 10MB
  max_files: 5
```

### Docker Compose 配置

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    container_name: myapp-web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    environment:
      - NGINX_HOST=myapp.com
    depends_on:
      - app

  app:
    image: myapp:latest
    container_name: myapp-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    volumes:
      - ./logs:/app/logs
    depends_on:
      - db

  db:
    image: postgres:13
    container_name: myapp-db
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## CI/CD 管道示例

### GitHub Actions 工作流

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '16'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # 部署命令在这里
```

### GitLab CI 配置

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "16"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm test
    - npm run lint
  coverage: '/All files[^|]*\|[^|]*\|[^|]*\|[^|]*\s+(\d+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy:staging:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
    url: https://staging.myapp.com
  only:
    - develop

deploy:production:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://myapp.com
  only:
    - main
  when: manual
```

## Kubernetes 清单

### Pod 定义

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
  labels:
    app: my-app
    tier: frontend
spec:
  containers:
    - name: my-app
      image: my-app:latest
      ports:
        - containerPort: 3000
          protocol: TCP
      env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
      livenessProbe:
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 5
```

### Service 定义

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  labels:
    app: my-app
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
      name: http
    - port: 443
      targetPort: 3000
      protocol: TCP
      name: https
  selector:
    app: my-app
```

### Deployment 定义

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
          volumeMounts:
            - name: config-volume
              mountPath: /app/config
      volumes:
        - name: config-volume
          configMap:
            name: my-app-config
```

## Ansible 剧本示例

### 基本剧本

```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    http_port: 80
    max_clients: 200

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install nginx
      apt:
        name: nginx
        state: present

    - name: Configure nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        backup: yes
      notify: restart nginx

    - name: Start nginx
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

### 复杂剧本与角色

```yaml
---
- name: Deploy application
  hosts: all
  become: yes
  vars_files:
    - vars/main.yml
    - vars/secrets.yml

  pre_tasks:
    - name: Update package cache
      apt:
        update_cache: yes
      when: ansible_os_family == "Debian"

  roles:
    - common
    - web
    - app
    - database

  tasks:
    - name: Deploy application
      git:
        repo: "{{ app_repository }}"
        dest: "{{ app_path }}"
        version: "{{ app_version }}"
        force: yes

    - name: Install dependencies
      npm:
        path: "{{ app_path }}"
        state: present

    - name: Build application
      command: npm run build
      args:
        chdir: "{{ app_path }}"

    - name: Restart application
      systemd:
        name: "{{ app_service }}"
        state: restarted
        daemon_reload: yes
```

## 环境配置

### 开发环境

```yaml
# 开发环境配置
environment: development

app:
  name: MyApp
  version: 1.0.0
  debug: true
  port: 3000

database:
  host: localhost
  port: 5432
  name: myapp_dev
  user: dev_user
  password: dev_password
  ssl: false

redis:
  host: localhost
  port: 6379
  password: null

logging:
  level: DEBUG
  format: console
  file: logs/dev.log

features:
  cache: true
  analytics: false
  notifications: true

external_services:
  email:
    provider: sendgrid
    api_key: ${SENDGRID_API_KEY}
  storage:
    provider: local
    path: ./uploads
```

### 生产环境

```yaml
# 生产环境配置
environment: production

app:
  name: MyApp
  version: 1.0.0
  debug: false
  port: 3000

database:
  host: ${DB_HOST}
  port: 5432
  name: ${DB_NAME}
  user: ${DB_USER}
  password: ${DB_PASSWORD}
  ssl: true
  pool:
    min: 10
    max: 50
    timeout: 30

redis:
  host: ${REDIS_HOST}
  port: 6379
  password: ${REDIS_PASSWORD}

logging:
  level: INFO
  format: json
  file: logs/app.log
  max_size: 100MB
  max_files: 10

features:
  cache: true
  analytics: true
  notifications: true

external_services:
  email:
    provider: aws-ses
    region: us-east-1
    access_key: ${AWS_ACCESS_KEY}
    secret_key: ${AWS_SECRET_KEY}
  storage:
    provider: s3
    bucket: myapp-uploads
    region: us-east-1
```

## JavaScript 处理示例

### 解析 YAML

```js
// 从字符串解析 YAML
const yaml = require('js-yaml')

const yamlString = `
app:
  name: MyApp
  version: 1.0.0
  debug: true

database:
  host: localhost
  port: 5432
  name: myapp
`

try {
  const config = yaml.load(yamlString)
  console.log(config.app.name) // 输出: MyApp
  console.log(config.database.host) // 输出: localhost
} catch (error) {
  console.error('YAML 解析错误:', error.message)
}

// 从文件加载 YAML
const fs = require('fs')

try {
  const config = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
  console.log('配置已加载:', config)
} catch (error) {
  console.error('加载配置错误:', error.message)
}
```

### 生成 YAML

```js
// 将对象转换为 YAML
const yaml = require('js-yaml')

const config = {
  app: {
    name: 'MyApp',
    version: '1.0.0',
    debug: true
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'myapp'
  }
}

const yamlString = yaml.dump(config, {
  indent: 2,
  lineWidth: 80,
  noRefs: true
})

console.log(yamlString)

// 保存 YAML 到文件
const fs = require('fs')

fs.writeFileSync('config.yaml', yamlString, 'utf8')
console.log('配置已保存到 config.yaml')
```

### 使用 YAML Schema

```js
// 根据模式验证 YAML
const yaml = require('js-yaml')
const Ajv = require('ajv')

const schema = {
  type: 'object',
  properties: {
    app: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string' },
        debug: { type: 'boolean' }
      },
      required: ['name', 'version']
    },
    database: {
      type: 'object',
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        name: { type: 'string' }
      },
      required: ['host', 'port', 'name']
    }
  },
  required: ['app', 'database']
}

const ajv = new Ajv()
const validate = ajv.compile(schema)

const yamlString = `
app:
  name: MyApp
  version: 1.0.0
  debug: true

database:
  host: localhost
  port: 5432
  name: myapp
`

try {
  const config = yaml.load(yamlString)
  const valid = validate(config)
  
  if (valid) {
    console.log('配置有效')
  } else {
    console.error('配置验证失败:', validate.errors)
  }
} catch (error) {
  console.error('YAML 解析错误:', error.message)
}
```

## 错误处理示例

### 验证错误响应

```yaml
errors:
  - code: VALIDATION_ERROR
    message: 无效的 YAML 结构
    details:
      field: database.host
      issue: 主机字段是必需的
      line: 8
      column: 3
  - code: TYPE_ERROR
    message: 无效的数据类型
    details:
      field: app.port
      issue: 端口必须是数字
      value: "3000"
      line: 4
      column: 8

timestamp: 2024-01-15T10:30:00Z
request_id: req_123456
```

### 系统错误响应

```yaml
error:
  code: INTERNAL_SERVER_ERROR
  message: 发生意外错误
  details: YAML 解析失败
  timestamp: 2024-01-15T10:30:00Z
  request_id: req_123456
  stack: "Error: Invalid YAML syntax at line 5..."
```

这些示例演示了在配置管理、CI/CD 管道和应用程序开发中常见的各种 YAML 模式和用例。 