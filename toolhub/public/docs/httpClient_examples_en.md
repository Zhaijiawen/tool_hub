# HTTP Request Tester — Examples

## Simple GET request

**URL:** `https://httpbin.org/get`
**Method:** GET
**Params:** `name=toolhub`, `version=1.0`

Response:
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

httpbin echoes everything about your request — params, headers, origin IP. It's the perfect test target for debugging HTTP clients.

## POST with JSON body

**URL:** `https://httpbin.org/post`
**Method:** POST
**Body (JSON):**
```json
{
  "username": "admin",
  "action": "login"
}
```

The response includes a `json` field that echoes back exactly what you sent. Use this to verify your JSON is well-formed and arriving as expected.

## Authenticated request

**URL:** `https://httpbin.org/bearer`
**Method:** GET
**Headers:** `Authorization: Bearer my-token-123`

httpbin's `/bearer` endpoint checks for a Bearer token and returns 401 if it's missing or invalid. Good for testing auth header formatting.

## Form submission

**URL:** `https://httpbin.org/post`
**Method:** POST
**Body (Form):**
- `username` = `testuser`
- `password` = `123456`

The response will show the form fields under the `form` key, confirming they were encoded as `application/x-www-form-urlencoded`.

## Testing your own API

Before deploying, point this tool at your local dev server:
- `http://localhost:3000/api/users` for a GET request
- `http://localhost:3000/api/users` with POST and a JSON body to create a user

If you get CORS errors, your server needs to send `Access-Control-Allow-Origin: *` (or your frontend's origin) in its responses. For Express, that's one line: `app.use(cors())`.

## Public test APIs

| Service | URL | What it does |
|---------|-----|-------------|
| httpbin | `https://httpbin.org` | Echoes your request — the go-to debugging tool |
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | Fake REST API with posts, users, comments |
| Dog API | `https://dog.ceo/api/breeds/image/random` | Random dog photos, because why not |
