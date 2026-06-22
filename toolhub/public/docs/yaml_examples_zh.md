# YAML — 代码示例

## 基本结构

### 简单键值对

```yaml
name: John Doe
age: 30
email: john@example.com
is_active: true
```

### 嵌套对象和数组

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
    zip: "10001"   # 加引号 — 邮编以 0 开头的话不加引号会丢前导零

fruits:
  - apple
  - banana
  - orange
```

### 复杂嵌套

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

## 配置文件

### 应用配置：数据库 + 服务器 + 日志

```yaml
app:
  name: MyApplication
  version: 1.0.0
  environment: production
  debug: false

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

server:
  port: 8080
  host: 0.0.0.0
  timeout: 30
  cors:
    enabled: true
    origins:
      - http://localhost:3000
      - https://myapp.com

logging:
  level: INFO
  format: json
  file: logs/app.log
  max_size: 10MB
  max_files: 5
```

### Docker Compose

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

## CI/CD 管道

### GitHub Actions

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

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
```

### GitLab CI

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

Pod、Service、Deployment——最常用的三种 K8s 资源：

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
---
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
---
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

注意 `---` 文档分隔符——单个文件三个资源。K8s 的标准用法。

## Ansible 剧本

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

## 环境配置（开发 vs 生产）

```yaml
# 开发环境
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

```yaml
# 生产环境
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

生产环境的敏感信息用环境变量（`${VAR}`）引用——永远不要把明文凭证写进版本控制的 YAML 文件里。
