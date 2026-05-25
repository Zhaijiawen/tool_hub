# HTTP Status Code Reference — Usage Tutorial

## How to Use

### Search by Code
Type a status code (e.g., `404`, `500`) in the search box to look up its meaning, category, and description.

### Search by Keyword
Type a keyword (e.g., "redirect", "unauthorized", "timeout") to find all matching status codes.

### Browse by Category
Filter the list by category (1xx, 2xx, 3xx, 4xx, 5xx) to see all codes in that group.

## Quick Reference

| I want to... | Likely Status |
|---|---|
| Tell the client it was successful | `200 OK` |
| Tell the client a resource was created | `201 Created` |
| Redirect permanently | `301 Moved Permanently` |
| Tell the client the request is invalid | `400 Bad Request` |
| Require login | `401 Unauthorized` |
| Block access | `403 Forbidden` |
| Return page not found | `404 Not Found` |
| Tell the client to slow down | `429 Too Many Requests` |
| Signal an unhandled server error | `500 Internal Server Error` |
| Signal the service is down | `503 Service Unavailable` |

## Tips

- **401 vs 403**: Use 401 when the user is not authenticated; use 403 when the user is authenticated but lacks permission
- **301 vs 302**: Use 301 for permanent URL changes (SEO), use 302 for temporary redirects
- **500 vs 502**: 500 means your own server failed; 502 means an upstream server returned an error

