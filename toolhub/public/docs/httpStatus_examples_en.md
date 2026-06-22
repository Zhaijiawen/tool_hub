# HTTP Status Codes -- Examples

## Successful API responses

Here's what real HTTP responses look like for common operations. Notice how `201 Created` includes a `Location` header -- that's how you tell the client where to find the new resource.

**GET /api/users/1 -- standard read**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1, "name": "Alice" }
```

**POST /api/users -- resource creation**
```http
HTTP/1.1 201 Created
Location: /api/users/42

{ "id": 42, "name": "Bob" }
```

**DELETE /api/users/42 -- successful deletion with no body**
```http
HTTP/1.1 204 No Content
```

---

## Client error scenarios

These are the responses your frontend code should be actively checking for. Each one means a different thing and needs different handling.

**Missing or expired auth token:**
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer

{ "error": "Authentication required" }
```
The `WWW-Authenticate` header tells the client what kind of auth to send back. For a SPA with JWT, you'd intercept this response, clear the stored token, and redirect to login.

**Regular user hitting an admin endpoint:**
```http
HTTP/1.1 403 Forbidden

{ "error": "Insufficient permissions" }
```
Unlike 401, there's no point redirecting to login here -- the user is already authenticated. Show an "access denied" message.

**Missing required field in request body:**
```http
HTTP/1.1 400 Bad Request

{ "error": "email field is required" }
```
Some APIs use `422 Unprocessable Entity` for this instead. Either way, the frontend should surface the specific field error to the user, not just show "something went wrong."

**Rate limit hit:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{ "error": "Rate limit exceeded. Try again in 60 seconds." }
```
The `Retry-After` header tells you how long to wait. A good frontend implementation queues the request and retries automatically after that period, or shows the user a countdown.

---

## Redirection in practice

**Permanent URL move for SEO:**
```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-path
```
Browsers follow this automatically. Search engines update their index. If you're migrating a site, 301s are how you preserve your search rankings.

**Temporary redirect after form submission (the PRG pattern):**
```http
HTTP/1.1 302 Found
Location: /thank-you
```
Post-Redirect-Get: the server receives the POST, does its thing, then redirects to a GET page. This prevents duplicate form submissions if the user refreshes.

---

## Server error scenarios

**Unhandled exception in application code:**
```http
HTTP/1.1 500 Internal Server Error

{ "error": "An unexpected error occurred" }
```
Don't leak stack traces in production 500 responses. Log them server-side, return a generic message to the client.

**Upstream API returning garbage (behind nginx):**
```http
HTTP/1.1 502 Bad Gateway
```
If you see this, check whether your upstream service is running and responding with valid HTTP. Sometimes it means the upstream returned a response that nginx couldn't parse.

**Maintenance mode or overload:**
```http
HTTP/1.1 503 Service Unavailable
Retry-After: 300
```
The `Retry-After` header can be a number of seconds or an HTTP-date. Browsers don't natively do anything with it, but your JavaScript can.
