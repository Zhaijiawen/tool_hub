# HTTP Request Tester — Examples

## Example 1: GET Request (Public API)

**URL:** `https://httpbin.org/get`
**Method:** GET
**Params:** `name=toolhub`, `version=1.0`

Sample Response:
```json
{
  "args": {
    "name": "toolhub",
    "version": "1.0"
  },
  "headers": {
    "Accept": "application/json",
    "Host": "httpbin.org"
  },
  "url": "https://httpbin.org/get?name=toolhub&version=1.0"
}
```

---

## Example 2: POST JSON Request

**URL:** `https://httpbin.org/post`
**Method:** POST
**Body (JSON):**
```json
{
  "username": "admin",
  "action": "login"
}
```

The `json` field in the response echoes back the body you sent.

---

## Example 3: Authenticated Request

**URL:** `https://httpbin.org/bearer`
**Method:** GET
**Headers:** `Authorization: Bearer my-token-123`

---

## Example 4: Form Submission

**URL:** `https://httpbin.org/post`
**Method:** POST
**Body (Form):**
- `username` = `testuser`
- `password` = `123456`

---

## Recommended Public Test APIs

| Service | URL | Notes |
|---------|-----|-------|
| httpbin | `https://httpbin.org` | Echoes request data — great for debugging |
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | Mock REST API |
| Dog API | `https://dog.ceo/api/breeds/image/random` | Random dog image URL |

