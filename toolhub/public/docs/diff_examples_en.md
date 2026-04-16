# Diff Text Comparison - Examples

## Example 1: JavaScript Function Refactoring

### Comparison Content

**Left (Original Version):**
```javascript
// User login validation
function login(username, password) {
  if (username === '' || password === '') {
    return { success: false, message: 'Username and password cannot be empty' };
  }
  const user = db.find(username);
  if (user.password === password) {
    return { success: true, token: generateToken() };
  }
  return { success: false, message: 'Incorrect password' };
}
```

**Right (Refactored Version):**
```javascript
// User login validation (added length check and password encryption)
async function login(username, password) {
  if (!username?.trim() || !password?.trim()) {
    return { success: false, message: 'Username and password cannot be empty' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }
  const user = await db.findByUsername(username);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (isValid) {
    return { success: true, token: await generateToken(user.id) };
  }
  return { success: false, message: 'Incorrect password' };
}
```

### Expected Diff Results
- Function signature: sync → async
- Added: password length validation
- Added: user-not-found check
- Changed: `db.find` → `db.findByUsername`
- Changed: plaintext password comparison → bcrypt encrypted comparison

---

## Example 2: Configuration File Comparison

### Nginx Config Diff

**Left (Development Environment):**
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

**Right (Production Environment):**
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

## Example 3: JSON Data Comparison

### API Response Diff

**Left (v1 Response):**
```json
{
  "code": 0,
  "data": {
    "userId": 1001,
    "name": "John Doe",
    "role": "user"
  }
}
```

**Right (v2 Response):**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 1001,
    "username": "johndoe",
    "displayName": "John Doe",
    "roles": ["user", "editor"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Diff Analysis
- New field: `message`
- Field renamed: `name` → `displayName`, new `username` added
- Type change: `role` (String) → `roles` (Array)
- New field: `createdAt`

---

## Example 4: Document Revision Comparison

### Requirements Document

**Left (First Draft):**
```
User Registration Requirements

1. Users can register with email
2. Password must be at least 8 characters
3. Send confirmation email after successful registration
```

**Right (Revised Draft):**
```
User Registration Requirements (v1.1)

1. Users can register with email or phone number
2. Password must be at least 8 characters, containing letters and numbers
3. Send confirmation email after successful registration
4. Support third-party login (Google, GitHub)
5. Unverified accounts are automatically deleted after 24 hours
```

---

## Example 5: CSS Style Differences

**Left (Old Style):**
```css
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
```

**Right (New Style):**
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

## Practical Application Tips

1. **Use before code review**: Check diffs locally before submitting a PR to avoid accidentally including debug code
2. **Config verification before deployment**: Compare test and production configs before going live to avoid missing settings
3. **Document version management**: Keep both before and after versions of important documents for easy traceability

