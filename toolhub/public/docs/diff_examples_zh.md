# Diff 文本对比示例

不同类型文件的前后对比实景。

## JavaScript 函数重构

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

**Diff 揭示的改动：**
- 函数从同步变成异步
- 输入校验升级（`?.trim()` 替代 `=== ''`）
- 新增：密码最短长度检查
- 新增：用户不存在的处理
- `db.find` 改名 `db.findByUsername`
- 明文密码对比替换为 bcrypt 加密对比

这就是典型的代码审查场景。diff 直接告诉审查者关注什么：安全改进（bcrypt）、更好的错误信息、异步改造。

## Nginx 配置：开发 vs 生产

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

行级 diff 一眼看出：端口变了、加了 SSL、域名改了、代理目标从单机变成集群、日志开启了。这正是上线前要 review 的那种配置对比。

## API 响应版本对比

**左侧（v1）：**
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

**右侧（v2）：**
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

差异分析：
- 新增顶层字段：`message`
- `name` 拆分为 `username` 和 `displayName`
- `role`（字符串）变成 `roles`（数组）-- 对期望字符串的客户端这是破坏性变更
- 新增字段：`createdAt`

做 API 合约测试的时候很有用 -- 预期响应和实际响应 diff 一下，意外变更一目了然。

## 需求文档修订

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

这里单词级 diff 最合适 -- 会精确标出"邮箱"变成"邮箱或手机号"以及新增的两条需求，而不是把整个文档标成改动。

## CSS 样式更新

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

Diff 清晰展示了：渐变替代了纯色、padding 增大、加了圆角、加了过渡和阴影、新增了 hover 规则。部署前 review CSS diff 能防止不小心的样式变更上线。

## 把 Diff 融入工作流的建议

- **PR 前提审**：push 之前本地 diff 一下，避免调试代码、console.log 或者忘了的改动混进去。
- **配置核对**：每次部署前 diff 测试环境和生产环境配置。自动化配置漂移检测更好。
- **文档历史管理**：重要文档保留旧版本。有人问"合同改了什么？"的时候 diff 一下几秒就能回答。
