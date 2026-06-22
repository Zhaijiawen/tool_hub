# HTTP Request Tester — The Basics

HTTP is the protocol that runs the web. Every API call, every page load, every image fetch — it's all HTTP requests under the hood. If you're building or debugging anything web-related, you need to understand the shape of these requests.

## The HTTP methods

| Method | What it means | Has a body? |
|--------|--------------|-------------|
| GET | Fetch a resource | No |
| POST | Create something new | Yes |
| PUT | Replace something entirely | Yes |
| PATCH | Update part of something | Yes |
| DELETE | Remove something | Optional |
| HEAD | Just the headers, no body | No |
| OPTIONS | What methods does this endpoint support? | No |

The one that trips people up: PUT vs PATCH. PUT means "here's the complete new version — replace everything." PATCH means "here are the specific fields to update — leave the rest alone."

## Anatomy of a request

A request has four parts:

- **The request line** — method, URL, and HTTP version
- **Headers** — key-value metadata like `Content-Type: application/json` or `Authorization: Bearer xxx`
- **Query parameters** — the stuff after `?` in the URL, like `?page=1&size=20`
- **Body** — the payload for POST, PUT, and PATCH requests

## CORS: the thing that breaks your browser requests

CORS (Cross-Origin Resource Sharing) is a browser security mechanism. If your web page is on `example.com` and tries to call `api.othersite.com`, the browser blocks it unless the API server explicitly allows it with `Access-Control-Allow-Origin` headers.

This only affects browser-based requests. `curl`, Postman, and server-side code aren't subject to CORS. That's why an API works fine in Postman but fails in your SPA — the browser is enforcing the policy.

## Status codes at a glance

| Range | Meaning | Common examples |
|-------|---------|----------------|
| 2xx | Everything's fine | 200 OK, 201 Created, 204 No Content |
| 3xx | Go somewhere else | 301 Moved Permanently, 302 Found |
| 4xx | You messed up | 400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests |
| 5xx | Server messed up | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

4xx means fix your request. 5xx means tell the backend team. 429 means slow down.
