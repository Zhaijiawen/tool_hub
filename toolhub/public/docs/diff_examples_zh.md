# Diff 文本对比 - 代码示例

## 示例 1：JavaScript 函数重构

### 对比内容

**左侧（原始版本）：**
```javascript
// 用户登录验证
function login(username, password) {
  if (username === '' || password === '') {
    return { success: false, message: '用户名和密码不能为空' };
  }
  const user = db.find(username);
  if (user.password === password) {
    return { success: true, token: generateToken() };
  }
  return { success: false, message: '密码错误' };
}
```

**右侧（重构版本）：**
```javascript
// 用户登录验证（增加输入长度校验和密码加密）
async function login(username, password) {
  if (!username?.trim() || !password?.trim()) {
    return { success: false, message: '用户名和密码不能为空' };
  }
  if (password.length < 6) {
    return { success: false, message: '密码长度不能少于6位' };
  }
  const user = await db.findByUsername(username);
  if (!user) {
    return { success: false, message: '用户不存在' };
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (isValid) {
    return { success: true, token: await generateToken(user.id) };
  }
  return { success: false, message: '密码错误' };
}
```

### 预期差异结果

- 函数签名：同步 → 异步（async）
- 新增：密码长度校验
- 新增：用户不存在的检查
- 修改：`db.find` → `db.findByUsername`
- 修改：明文密码对比 → bcrypt 加密对比

---

## 示例 2：配置文件对比

### Nginx 配置差异

**左侧（开发环境）：**
```nginx
server {
  listen 3000;
  server_name localhost;

  location / {
    proxy_pass http://localhost:8080;
  }

  access_log off;
}
```

**右侧（生产环境）：**
```nginx
server {
  listen 80;
  listen 443 ssl;
  server_name example.com www.example.com;

  ssl_certificate /etc/nginx/ssl/cert.pem;
  ssl_certificate_key /etc/nginx/ssl/key.pem;

  location / {
    proxy_pass http://backend-cluster;
    proxy_set_header X-Real-IP $remote_addr;
  }

  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log warn;
}
```

---

## 示例 3：JSON 数据对比

### API 响应差异

**左侧（v1 响应）：**
```json
{
  "code": 0,
  "data": {
    "userId": 1001,
    "name": "张三",
    "role": "user"
  }
}
```

**右侧（v2 响应）：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 1001,
    "username": "zhangsan",
    "displayName": "张三",
    "roles": ["user", "editor"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 差异分析
- 新增字段：`message`
- 字段重命名：`name` → `displayName`，新增 `username`
- 数据类型变化：`role` (String) → `roles` (Array)
- 新增字段：`createdAt`

---

## 示例 4：文档版本对比

### 需求文档修订

**左侧（初稿）：**
```
用户注册功能需求

1. 用户可以使用邮箱注册
2. 密码长度至少 8 位
3. 注册成功后发送确认邮件
```

**右侧（修订稿）：**
```
用户注册功能需求（v1.1）

1. 用户可以使用邮箱或手机号注册
2. 密码长度至少 8 位，需包含字母和数字
3. 注册成功后发送确认邮件
4. 支持第三方登录（Google、GitHub）
5. 24小时内未验证则自动删除账号
```

---

## 示例 5：CSS 样式差异

**左侧（旧样式）：**
```css
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
```

**右侧（新样式）：**
```css
.button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.button:hover {
  opacity: 0.9;
}
```

---

## 实际应用建议

1. **代码审查前使用**：提交 PR 前先本地 diff 检查，避免意外提交调试代码
2. **部署前配置核对**：上线前对比测试和生产配置，避免配置遗漏
3. **文档版本管理**：重要文档每次修改后留存前后版本，方便追溯

