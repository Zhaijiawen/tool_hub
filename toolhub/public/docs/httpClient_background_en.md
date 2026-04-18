# HTTP Request Tester — Technical Background

## What is HTTP?

HTTP (HyperText Transfer Protocol) is the application-layer protocol that powers the web. Almost all modern API communication is built on HTTP/HTTPS.

## Common HTTP Methods

| Method | Semantics | Has Body? |
|--------|-----------|-----------|
| GET | Retrieve a resource | No |
| POST | Create a resource | Yes |
| PUT | Replace a resource entirely | Yes |
| PATCH | Partially update a resource | Yes |
| DELETE | Delete a resource | Optional |
| HEAD | Get headers only (no body) | No |
| OPTIONS | Query allowed methods | No |

## Anatomy of an HTTP Request

- **Request line**: Method + URL + protocol version
- **Headers**: Key-value metadata, e.g. `Content-Type`, `Authorization`
- **Query Params**: Key-value pairs after `?`, e.g. `?page=1&size=20`
- **Body**: Data carried by POST/PUT/PATCH

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web scripts from making requests to a different origin (protocol + domain + port).

- If the target API does not include CORS response headers, the browser blocks the response
- Servers grant cross-origin access via `Access-Control-Allow-Origin` and related headers
- Tools like `curl` and Postman are not subject to CORS restrictions

## HTTP Status Code Ranges

| Range | Meaning | Examples |
|-------|---------|---------|
| 2xx | Success | 200 OK, 201 Created |
| 3xx | Redirect | 301 Moved, 302 Found |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway |

