# Encoding Schemes Usage Tutorial

Encoding is part of everyday programming. You'll use it constantly when working with binary data, APIs, and data serialization. Here's practical usage across common schemes.

## Base64

Built into every language's standard library. In Python:

```python
import base64

data = b"Hello, world! \x00\xff"

# Standard Base64
encoded = base64.b64encode(data)
print(encoded)  # b'SGVsbG8sIHdvcmxkISAA/w=='

decoded = base64.b64decode(encoded)
print(decoded)  # b'Hello, world! \x00\xff'

# URL-safe Base64 (no + / =)
url_safe = base64.urlsafe_b64encode(data)
print(url_safe)  # b'SGVsbG8sIHdvcmxkISAA_w=='
```

In JavaScript:
```javascript
const data = "Hello, world!";

// Encode
const encoded = btoa(data);
console.log(encoded);  // "SGVsbG8sIHdvcmxkIQ=="

// Decode
const decoded = atob(encoded);
console.log(decoded);  // "Hello, world!"
```

The `btoa`/`atob` functions only work with ASCII strings. For binary data or UTF-8, use `TextEncoder`/`TextDecoder` or Buffer in Node.

## Hex encoding

Python:
```python
data = b"Hello, world!"

hex_str = data.hex()
print(hex_str)  # "48656c6c6f2c20776f726c6421"

decoded = bytes.fromhex(hex_str)
print(decoded)  # b'Hello, world!'
```

JavaScript:
```javascript
// Node.js
const hex = Buffer.from("Hello").toString('hex');
console.log(hex);  // "48656c6c6f"
const decoded = Buffer.from(hex, 'hex').toString();
console.log(decoded);  // "Hello"
```

## URL encoding

Python:
```python
from urllib.parse import quote, unquote

encoded = quote("Hello, world! & more?")
print(encoded)  # "Hello%2C%20world%21%20%26%20more%3F"

decoded = unquote(encoded)
print(decoded)  # "Hello, world! & more?"
```

JavaScript:
```javascript
const encoded = encodeURIComponent("Hello, world! & more?");
console.log(encoded);  // "Hello%2C%20world!%20%26%20more%3F"

const decoded = decodeURIComponent(encoded);
console.log(decoded);  // "Hello, world! & more?"
```

## Base32

Python:
```python
import base64

data = b"Hello, world!"
encoded = base64.b32encode(data)
print(encoded)  # b'JBSWY3DPEBLW64TMMQ======'

decoded = base64.b32decode(encoded)
print(decoded)  # b'Hello, world!'
```

## Common mistakes

- Treating Base64 as encryption. It's encoding. No key, no security.
- Double-encoding: encoding data that's already Base64 because you forgot to decode first.
- Using Base64 for large binary data in URLs (use Base64url instead -- no `+` or `/` characters).
- Forgetting that `atob`/`btoa` don't handle UTF-8 natively in browsers.
