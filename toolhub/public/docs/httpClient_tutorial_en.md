# HTTP Request Tester — Tutorial

## Sending Your First Request

### Step 1: Enter the URL

Type the full request URL, e.g.:
```
https://httpbin.org/get
```
If no protocol is specified, `https://` is added automatically.

### Step 2: Select the HTTP Method

The default is `GET`. Choose from `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, or `OPTIONS` as needed.

### Step 3: Configure Request Parameters

**Params Tab (Query Parameters)**
- Click "+ Add Param" to add key-value pairs
- Use the checkbox to enable or disable individual parameters
- Enabled params are appended to the URL automatically

**Headers Tab**
- `Accept: application/json` is pre-filled by default
- Add custom headers such as `Authorization: Bearer <token>`

**Body Tab** (disabled for GET/HEAD)
- `None`: No request body
- `JSON`: Sets `Content-Type: application/json` automatically
- `Form`: Sets `Content-Type: application/x-www-form-urlencoded` automatically
- `Text`: Plain text body

### Step 4: Send the Request

Click the **Send** button and wait for the response.

## Reading the Response

- **Status bar**: Status code (green = success, orange = 4xx, red = 5xx), elapsed time, body size
- **Body tab**: Response content; JSON is auto-formatted
- **Response Headers tab**: All response headers returned by the server

## Dealing with CORS Errors

If you see a CORS error, try:
1. Using a CORS-enabled public API (e.g. `https://httpbin.org`) for testing
2. Configuring `Access-Control-Allow-Origin: *` on your API server
3. Using tools not subject to CORS restrictions, like Postman or `curl`

## Tips

- The last request configuration is saved automatically and restored on your next visit
- Requests are sent directly from your browser with no server relay, protecting your privacy

