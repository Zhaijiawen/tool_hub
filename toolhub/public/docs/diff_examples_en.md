# Diff Text Comparison Examples

Real before-and-after comparisons across different file types.

## JavaScript Function Refactoring

**Left (original):**
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

**Right (refactored):**
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

**What the diff reveals:**
- Function signature went from sync to async
- Input validation improved (`?.trim()` instead of `=== ''`)
- New: password minimum length check
- New: user-not-found handling
- `db.find` renamed to `db.findByUsername`
- Plaintext password comparison replaced with bcrypt

This is a typical code review scenario. The diff tells the reviewer exactly what to focus on: security improvement (bcrypt), better error messages, and async conversion.

## Nginx Config: Dev vs Production

**Left (development):**
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

**Right (production):**
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

In a line-level diff, you'll immediately see: ports changed, SSL added, server_name changed, proxy target changed (single server to cluster), logging enabled. This is exactly the kind of config diff you'd review before deploying.

## API Response Version Comparison

**Left (v1):**
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

**Right (v2):**
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

Diff analysis:
- New top-level field: `message`
- `name` split into `username` and `displayName`
- `role` (string) changed to `roles` (array) -- this is a breaking change for any client that expected a string
- New field: `createdAt`

This is valuable for API contract testing -- diff the expected response against the actual response to catch unexpected changes.

## Requirements Document Revision

**Left (first draft):**
```
User Registration Requirements

1. Users can register with email
2. Password must be at least 8 characters
3. Send confirmation email after registration
```

**Right (revised):**
```
User Registration Requirements (v1.1)

1. Users can register with email or phone number
2. Password must be at least 8 characters, containing letters and numbers
3. Send confirmation email after successful registration
4. Support third-party login (Google, GitHub)
5. Unverified accounts are automatically deleted after 24 hours
```

Word-level diff is ideal here -- it'll highlight "email" changing to "email or phone number" and the two new requirements rather than marking the entire document as changed.

## CSS Style Update

**Left (old):**
```css
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
```

**Right (new):**
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

The diff clearly shows: gradient replaced flat color, padding increased, border-radius added, transition and box-shadow added, and a new hover rule. Reviewing CSS diffs before deployment helps catch unintended style changes.

## Tips for Integrating Diff into Your Workflow

- **Pre-PR self-review**: Run a diff locally before pushing to catch debug code, console.logs, or unintended changes you forgot about.
- **Config verification**: Diff staging vs production configs before every deploy. Automated config drift detection is even better.
- **Document history**: Keep old versions of important documents. When someone asks "what changed in the contract?" you can diff and answer in seconds.
