# HTTP Status Codes — Technical Background

## What Is an HTTP Status Code?

An HTTP status code is a 3-digit number returned by a server in response to an HTTP request. It communicates the result of the request and guides the client on how to proceed.

## Status Code Categories

| Range | Category | Meaning |
|---|---|---|
| 1xx | Informational | Request received, processing continues |
| 2xx | Success | The request was successfully received, understood, and accepted |
| 3xx | Redirection | Further action needs to be taken to complete the request |
| 4xx | Client Error | The request contains bad syntax or cannot be fulfilled |
| 5xx | Server Error | The server failed to fulfill an apparently valid request |

## Most Common Status Codes

### 2xx — Success
| Code | Name | Description |
|---|---|---|
| `200` | OK | Standard successful response |
| `201` | Created | Resource created successfully (common after POST/PUT) |
| `204` | No Content | Success with no response body |

### 3xx — Redirection
| Code | Name | Description |
|---|---|---|
| `301` | Moved Permanently | URL has permanently changed (SEO-safe redirect) |
| `302` | Found | Temporary redirect |
| `304` | Not Modified | Cached version is still valid |

### 4xx — Client Errors
| Code | Name | Description |
|---|---|---|
| `400` | Bad Request | Malformed or invalid request |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Access denied even with authentication |
| `404` | Not Found | Resource does not exist |
| `405` | Method Not Allowed | HTTP method not supported for this endpoint |
| `429` | Too Many Requests | Rate limit exceeded |

### 5xx — Server Errors
| Code | Name | Description |
|---|---|---|
| `500` | Internal Server Error | Generic server-side error |
| `502` | Bad Gateway | Upstream server returned an invalid response |
| `503` | Service Unavailable | Server temporarily overloaded or down |
| `504` | Gateway Timeout | Upstream server did not respond in time |

## HTTP Status in APIs

RESTful API design conventions:
- `POST` creating a resource → `201 Created`
- `DELETE` successful → `204 No Content`
- Invalid authentication token → `401 Unauthorized`
- Insufficient permission → `403 Forbidden`

