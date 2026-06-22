# URL Parser — Background

You see URLs every day, but most people never look at what they're actually made of. A URL isn't just a string — it's a structured data format with a well-defined anatomy. The URL parser breaks it down so you can inspect each component individually.

## What's in a URL

Here's the full anatomy with all possible parts present:

```
https://user:pass@example.com:8080/path/to/page?key=value&foo=bar#section
──────  ─────────  ───────────  ────  ──────────  ──────────────── ───────
  │         │           │        │        │              │             │
protocol  auth        host     port    pathname        search        hash
```

Most URLs you encounter are simpler — the auth part (username:password) is rare outside of FTP URLs and legacy systems, and the port is usually absent when it's the default for the protocol (80 for HTTP, 443 for HTTPS).

| Field | What it is | From the example |
|---|---|---|
| protocol | Scheme, always ends with `:` | `https:` |
| username | Authentication username (rare) | `user` |
| password | Authentication password (rare) | `pass` |
| hostname | Domain or IP, no port | `example.com` |
| port | Explicit port number | `8080` |
| host | hostname + port combined | `example.com:8080` |
| origin | protocol + host | `https://example.com:8080` |
| pathname | Path after the host | `/path/to/page` |
| search | Query string, includes `?` | `?key=value&foo=bar` |
| hash | Fragment, includes `#` | `#section` |
| href | The full URL | everything above |

The distinction between `hostname`, `host`, and `origin` trips people up. `host` is the one that includes the port; `origin` is protocol + host (the security boundary in browsers). When you're setting CORS headers or debugging cross-origin requests, `origin` is what matters.

## Query parameters

The query string starts after `?` and uses `&` as a separator between key=value pairs. There's no official standard for how query strings should be structured beyond that — duplicate keys, missing values, and nested structures are all handled differently by different frameworks.

The parser extracts parameters into a clean table. It also handles URL encoding: spaces become `%20`, non-ASCII characters become percent-encoded byte sequences (Chinese characters `中文` become `%E4%B8%AD%E6%96%87`). The decode toggle lets you see the human-readable values while keeping the raw encoded URL intact.

## The hash (fragment)

The hash (everything after `#`) is special: browsers never send it to the server. It lives entirely on the client side. This is why single-page apps use hash-based routing (`#/dashboard`) — the server only sees the URL before the `#`. If you see query-like parameters inside a hash (`#/page?tab=settings`), those are NOT part of the `search` field — they're inside the `hash` string and need separate parsing.

The parser uses the browser's built-in `URL` constructor under the hood, which means it follows the same parsing rules as the browser itself. No edge cases between what the tool shows and what `window.location` would give you.
