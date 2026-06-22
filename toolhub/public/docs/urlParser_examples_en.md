# URL Parser — Examples

## API URL with query params

This is probably the most common thing you'll paste in — a paginated API endpoint.

```
https://api.github.com/repos/vuejs/vue/issues?state=open&page=2&per_page=30
```

Parsed result:
- **Protocol:** `https:`
- **Hostname:** `api.github.com`
- **Path:** `/repos/vuejs/vue/issues`
- **Query params:**
  - `state` = `open`
  - `page` = `2`
  - `per_page` = `30`

Say you want to bump to page 3. Instead of editing the raw URL string, switch to the Builder tab, change `page` from `2` to `3`, and copy the result. Way less error-prone than trying to find `page=2` in a 200-character URL.

## Frontend hash-based routing

SPA frameworks like Vue Router and React Router sometimes use hash mode. The hash contains what looks like a path with its own query parameters.

```
https://example.com/app#/dashboard?tab=settings
```

Parsed result:
- **Pathname:** `/app`
- **Hash:** `#/dashboard?tab=settings`
- **Search:** *(empty)*

The `?tab=settings` inside the hash is NOT a query parameter as far as the URL parser is concerned — it's just part of the hash string. The server never sees anything after `#`. If you're debugging a frontend routing issue, remember that the framework parses the hash internally to extract its own route and params.

## Internal service with port

Dev environments and containerized services love non-standard ports.

```
http://192.168.1.100:8080/api/v1/users?role=admin
```

Parsed result:
- **Protocol:** `http:`
- **Hostname:** `192.168.1.100`
- **Port:** `8080`
- **Path:** `/api/v1/users`
- **Query params:** `role` = `admin`

Note this is HTTP, not HTTPS — common for internal services where TLS termination happens at a reverse proxy. The raw IP as hostname is also standard for local/dev environments. If you're switching this to a production URL, change the hostname and protocol in the Builder and keep the path and params.

## URL-encoded search parameters

When a search query contains non-ASCII characters, you get percent-encoding.

```
https://search.example.com/search?q=%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2&hl=zh-CN
```

With URL decoding enabled:
- `q` = `中文搜索`
- `hl` = `zh-CN`

Without decoding, `q` shows as `%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2`. Both views are useful depending on what you're doing. If you're constructing a request to send, keep the encoded form. If you're trying to understand what the user actually searched for, decode it.

## Parsing a Google Maps URL

Maps URLs pack a ton of information into query parameters.

```
https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7432442,17z/data=!3m1!4b1!4m6!3m5!1s0x60188bbd9009ec09:0x1ff32a445ab35a4d!8m2!3d35.6585805!4d139.7454329!16zL20vMDFqM2o?entry=ttu
```

Parsed result:
- **Path:** `/maps/place/Tokyo+Tower/@35.6585805,139.7432442,17z`
- **Query params:**
  - `data` = `!3m1!4b1!4m6!3m5!1s0x60188bbd9009ec09:0x1ff32a445ab35a4d!8m2!3d35.6585805!4d139.7454329!16zL20vMDFqM2o`
  - `entry` = `ttu`

The `data` parameter looks like gibberish — that's Google's internal polyline format. The coordinates are embedded in the path: `35.6585805,139.7432442` with zoom level `17z`. The parser won't decode polyline data for you, but it extracts it cleanly so you can pass it to a polyline decoder or just verify the coordinates are what you expect.

## Spotting tracking parameters

Marketing and analytics URLs accumulate tracking cruft that you might want to strip before sharing.

```
https://example.com/product?utm_source=twitter&utm_medium=social&utm_campaign=launch&fbclid=abc123&ref=homepage
```

Parsed query params:
- `utm_source` = `twitter`
- `utm_medium` = `social`
- `utm_campaign` = `launch`
- `fbclid` = `abc123`
- `ref` = `homepage`

The parser makes it obvious which parameters are tracking (anything starting with `utm_`, `fbclid`, `gclid`) and which are functional. Strip the tracking ones and rebuild the URL in the Builder for a clean shareable link.
