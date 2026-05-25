# HTTP Status Codes — Examples

## Example 1: Successful API Responses

**GET /api/users/1**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1, "name": "Alice" }
```

**POST /api/users**
```http
HTTP/1.1 201 Created
Location: /api/users/42

{ "id": 42, "name": "Bob" }
```

**DELETE /api/users/42**
```http
HTTP/1.1 204 No Content
```

## Example 2: Client Error Scenarios

**Missing authentication token:**
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer

{ "error": "Authentication required" }
```

**Accessing admin resource as regular user:**
```http
HTTP/1.1 403 Forbidden

{ "error": "Insufficient permissions" }
```

**Invalid request body:**
```http
HTTP/1.1 400 Bad Request

{ "error": "email field is required" }
```

## Example 3: Redirection

**Old URL redirected permanently:**
```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-path
```

## Example 4: Server Errors

**Unhandled exception:**
```http
HTTP/1.1 500 Internal Server Error

{ "error": "An unexpected error occurred" }

