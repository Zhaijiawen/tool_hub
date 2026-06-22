# HTTP Request Tester — How to Use

A lightweight HTTP client that runs in your browser. No server relay — requests go directly from your browser to the target API.

## Sending a request

**URL —** Type the full address. If you leave off the protocol, `https://` is added automatically. Works with any public API that supports CORS, or any API you've configured to allow cross-origin requests.

**Method —** Defaults to GET. Switch to POST, PUT, PATCH, DELETE, HEAD, or OPTIONS as needed.

**Params tab —** Add query parameters as key-value pairs. Each has a checkbox to toggle it on or off without deleting it — handy for testing with and without certain params. Enabled params are appended to the URL automatically.

**Headers tab —** `Accept: application/json` is prefilled. Add auth tokens, content types, or custom headers. Each header row has its own enable/disable toggle.

**Body tab —** Only active for POST, PUT, and PATCH. Four modes:
- **None** — no body
- **JSON** — automatically sets `Content-Type: application/json`
- **Form** — automatically sets `Content-Type: application/x-www-form-urlencoded`
- **Text** — raw text, you set the Content-Type header yourself

Hit **Send** and wait for the response.

## Reading the response

The status bar shows the HTTP status code (color-coded: green for 2xx, orange for 4xx, red for 5xx), elapsed time in milliseconds, and response body size.

The Body tab shows the response content — JSON is auto-formatted with syntax highlighting. The Response Headers tab shows every header the server sent back.

## CORS workaround notes

If you get a CORS error, a few options:

1. Use a public API that supports CORS for testing — `https://httpbin.org` is built exactly for this
2. Configure your API server to include `Access-Control-Allow-Origin` headers
3. For internal testing, use a browser extension that disables CORS (temporary, development only)
4. Switch to `curl` or Postman for APIs that don't support CORS — this tool runs in the browser so it's subject to the same restrictions as your web app

## Data persistence

Your last request configuration — URL, method, params, headers, and body — is saved to localStorage and restored when you come back. Your request history is only stored locally, never uploaded anywhere.
