# URL Parser — Tutorial

The URL parser has three tabs, and they each serve a distinct purpose. Once you know the flow, you'll fly through it.

## Parsing a URL

Paste a full URL into the input field. The parser fires automatically — no button to press. A badge at the top tells you whether the URL is valid or not, which is a quick sanity check before you dive into the details.

The "Parts" tab shows every field broken out: protocol, hostname, port, pathname, search, hash, origin — the full decomposition. Each field has a copy button next to it, so you can grab just the hostname or just the path without selecting text manually.

One thing that catches people: the parser needs a protocol prefix. Entering `example.com/path` won't work — you need `https://example.com/path`. Without the protocol, the browser's URL constructor can't parse it. Just add `https://` and it'll work.

## Inspecting query parameters

Switch to the "Query Params" tab and you'll see every parameter in a key/value table. This is way more readable than squinting at a long query string in the address bar.

Check "URL-decode values" to convert percent-encoded text back to readable form. `%E4%B8%AD%E6%96%87` becomes the actual Chinese characters it represents. Leave it unchecked if you need the raw encoded values for a request.

Each parameter row has its own copy button for grabbing individual values. The "Copy All Params" button at the bottom copies the entire set in `key=value&key=value` format, which is exactly what you'd paste into a curl command or an API client.

## Building URLs from scratch

The "Builder" tab works in the other direction. After parsing a URL, all the fields are pre-filled. Change any field — swap the hostname, add a port, append a path segment — and the assembled URL at the bottom updates in real time.

This is incredibly useful when you're constructing API URLs. Parse one request to get the base structure, then incrementally modify it. Need to switch from `page=1` to `page=2`? Change the parameter value instead of editing the raw URL string. Need to switch from staging to production? Change the hostname and everything else stays put.

## When things look wrong

- **URL shows as invalid but it works in your browser**: You probably forgot the protocol. Add `https://`.
- **Parameter values look garbled**: Toggle URL decoding on. The raw query string is percent-encoded.
- **Query params inside the hash don't show up**: They're in the `hash` field, not `search`. The parser separates them correctly — check the hash value and parse that string separately if you need its internal structure.
- **Port is empty when you expected one**: If the URL uses the default port for its protocol (80 for HTTP, 443 for HTTPS), the parser omits it. That's standard browser behavior — the port is implied.
