# URL Parser — Background

## URL Structure

A complete URL consists of these parts:

```
https://user:pass@example.com:8080/path/to/page?key=value&foo=bar#section
──────  ─────────  ───────────  ────  ──────────  ──────────────── ───────
  │         │           │        │        │              │             │
protocol  auth        host     port    pathname        search        hash
```

| Field | Description | Example |
|-------|-------------|---------|
| protocol | Scheme | `https:` |
| username | Username (uncommon) | `user` |
| password | Password (uncommon) | `pass` |
| hostname | Host without port | `example.com` |
| port | Port (omitted if default) | `8080` |
| host | hostname + port | `example.com:8080` |
| origin | protocol + host | `https://example.com:8080` |
| pathname | Path | `/path/to/page` |
| search | Query string (includes `?`) | `?key=value&foo=bar` |
| hash | Fragment (includes `#`) | `#section` |
| href | Full URL | (everything) |

## URL Encoding

Special characters (spaces, non-ASCII, etc.) in URLs must be percent-encoded:

- Space → `%20`
- Chinese "你好" → `%E4%BD%A0%E5%A5%BD`

This tool provides a toggle to display decoded (human-readable) values.

## Browser URL API

This tool uses the native `URL` API (`new URL(urlString)`) — no third-party libraries, supported in all modern browsers.

