# Encoding Schemes Code Examples

Practical encoding operations across common schemes: Base64, hex, URL encoding, and Base32.

## Python

```python
import base64
from urllib.parse import quote, unquote

# Base64
data = b"Binary data \x00\xff"
print("Base64:", base64.b64encode(data).decode())
print("Base64url:", base64.urlsafe_b64encode(data).decode())

# Hex
print("Hex:", data.hex())
print("From hex:", bytes.fromhex("48656c6c6f"))

# URL encoding
print("URL encoded:", quote("hello world & more"))
print("URL decoded:", unquote("hello%20world%20%26%20more"))

# Base32
print("Base32:", base64.b32encode(data).decode())
```

## JavaScript

```javascript
// Node.js
const base64 = Buffer.from("Hello!").toString('base64');
console.log("Base64:", base64);
console.log("Decoded:", Buffer.from(base64, 'base64').toString());

// Hex
console.log("Hex:", Buffer.from("Hello").toString('hex'));

// URL encoding
console.log("URL:", encodeURIComponent("hello world & more"));
console.log("Decoded:", decodeURIComponent("hello%20world%20%26%20more"));

// Browser Base64
console.log("btoa:", btoa("Hello!"));
console.log("atob:", atob("SGVsbG8h"));
```

## Go

```go
package main

import (
    "encoding/base64"
    "encoding/hex"
    "fmt"
    "net/url"
)

func main() {
    data := []byte("Hello, world!")

    // Base64
    fmt.Println("Base64:", base64.StdEncoding.EncodeToString(data))
    fmt.Println("Base64url:", base64.URLEncoding.EncodeToString(data))

    // Hex
    fmt.Println("Hex:", hex.EncodeToString(data))

    // URL encoding
    fmt.Println("URL:", url.QueryEscape("hello world & more"))
}
```

## Remember

- Encoding is not encryption. No key = no security.
- Base64 inflates data by ~33%. Hex inflates by 100%.
- Use Base64url (not standard Base64) in URLs and filenames.
- URL encoding preserves the structure of query strings.
