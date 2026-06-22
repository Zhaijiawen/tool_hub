# HTTP Status Codes -- Technical Background

Every HTTP response comes with a 3-digit status code. It's the server's way of saying "here's what happened with your request." Understanding them isn't just for backend devs -- if you're building a frontend that talks to APIs, you need to know what these numbers mean so you can handle them gracefully.

## The five families

The first digit tells you the category. This is the most useful thing to memorize because you can reason about any status code just by its leading digit.

| Range | Category | What it means |
|---|---|---|
| 1xx | Informational | "Got your request, still working on it." Rarely seen in practice. |
| 2xx | Success | "Everything worked." The happy path. |
| 3xx | Redirection | "Your resource moved. Go look over there instead." |
| 4xx | Client Error | "You messed something up." Bad request, no auth, not found. |
| 5xx | Server Error | "I messed something up." The server broke. |

## The ones you'll actually encounter

### 2xx -- Success

`200 OK` is the default. You'll see it thousands of times a day. `201 Created` is what you should return from POST endpoints that create resources -- it tells the client "here's what I made, and here's where to find it" (via the `Location` header). `204 No Content` is for operations that succeed but have nothing to say back, like a DELETE.

### 3xx -- Redirection

`301 Moved Permanently` tells search engines to update their index. `302 Found` is a temporary move -- browsers follow it but search engines keep the old URL. `304 Not Modified` is the caching workhorse: the client sends `If-None-Match` with an ETag, and if the resource hasn't changed, the server says "use what you already have" with zero body -- saves bandwidth, speeds things up.

### 4xx -- Client Errors

`400 Bad Request` is your catch-all for malformed input. `401 Unauthorized` means "who are you?" -- the client didn't send credentials, or they're expired. `403 Forbidden` means "I know who you are, and you're still not allowed." `404 Not Found` -- everyone knows this one. `405 Method Not Allowed` pops up when you POST to a GET-only endpoint. `429 Too Many Requests` is rate limiting kicking in.

### 5xx -- Server Errors

`500 Internal Server Error` is the generic "something went wrong and I don't know what." `502 Bad Gateway` means your reverse proxy (nginx, load balancer) got garbage from the upstream server. `503 Service Unavailable` is "try again later" -- usually during deploys or overload. `504 Gateway Timeout` means the upstream took too long to respond.

## API design conventions

In a well-designed REST API, status codes tell a consistent story:

- `POST /users` creating a new user returns `201 Created` with a `Location: /users/42` header
- `DELETE /users/42` returns `204 No Content` (or `200` if you include the deleted resource)
- Bad auth token? `401`. Valid token but wrong role? `403`.
- Validation failure? `422 Unprocessable Entity` is more specific than `400`, though many APIs just use `400`

The key thing: don't return `200 OK` with an error message in the body. That breaks HTTP semantics and makes it impossible for clients to handle errors generically. If something went wrong, use a 4xx or 5xx.
