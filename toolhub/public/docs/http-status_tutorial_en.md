# HTTP Status Code Reference -- Tutorial

Think of this as your cheat sheet. Type in a code or keyword, get the answer, move on.

## How to look things up

**By code:** Just type the number -- `404`, `502`, `418` (yes, that's a real one). You'll get the name, category, and what it actually means in practice.

**By keyword:** Type something like "redirect," "auth," or "timeout" to find related codes. Useful when you know the scenario but not the exact number.

**By category:** Filter to just 4xx or 5xx to browse all the errors. Sometimes you know it's a client error but not which specific one.

## The decision cheat sheet

When you're writing an API endpoint and wondering what status to return:

| Situation | Status |
|---|---|
| Everything worked, here's the data | `200 OK` |
| Resource created successfully | `201 Created` |
| Operation succeeded, nothing to return | `204 No Content` |
| This URL is dead, use the new one forever | `301 Moved Permanently` |
| Temporarily send traffic elsewhere | `302 Found` |
| Your cached copy is still good | `304 Not Modified` |
| The request is malformed or missing required fields | `400 Bad Request` |
| You need to log in first | `401 Unauthorized` |
| You're logged in but lack permission | `403 Forbidden` |
| That thing doesn't exist | `404 Not Found` |
| Wrong HTTP method for this endpoint | `405 Method Not Allowed` |
| Slow down, you're hitting us too fast | `429 Too Many Requests` |
| Something unexpected broke on our side | `500 Internal Server Error` |
| We're temporarily down | `503 Service Unavailable` |

## The tricky distinctions

**401 vs 403** is the one everyone gets wrong. 401 = "I don't know who you are" (missing or expired credentials). 403 = "I know who you are, and you can't do that" (logged in but wrong role). If your app redirects to a login page on 401 and shows "access denied" on 403, you're using them correctly.

**301 vs 302** matters for SEO. 301 says "this is the new permanent home" -- search engines transfer ranking to the new URL. 302 says "this is temporary" -- search engines keep the old URL indexed. Using 302 for a permanent move will hurt your SEO.

**500 vs 502 vs 503 vs 504** depend on your architecture. 500 is your own application code failing. 502 is your proxy/load balancer getting garbage from upstream. 503 is everything working but you're overloaded or in maintenance. 504 is an upstream service timing out. If you're behind nginx, you'll see 502 and 504 a lot -- they usually mean your app server is down or too slow.

## Frontend handling patterns

Don't just `console.error` status codes. Handle them:

```javascript
async function apiCall(url, options) {
  const response = await fetch(url, options)

  if (response.ok) return response.json() // 200-299

  // Handle by category
  switch (true) {
    case response.status === 401:
      // Redirect to login
      window.location.href = '/login'
      throw new Error('Session expired')

    case response.status === 403:
      // Show permission error, don't redirect
      throw new Error('Access denied')

    case response.status === 429:
      // Parse Retry-After header, back off
      const retryAfter = response.headers.get('Retry-After')
      throw new Error(`Rate limited, retry after ${retryAfter}s`)

    case response.status >= 500:
      // Server error -- maybe retry once
      throw new Error('Server error, try again later')

    default:
      const body = await response.json()
      throw new Error(body.message || 'Request failed')
  }
}
```

Categorizing by range (`.ok`, `>= 500`, etc.) is cleaner than checking every individual code.
