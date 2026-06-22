# SHA Code Examples

Hashing operations in Python, JavaScript, and Go. SHA-256 is the default choice.

## Python

```python
import hashlib
import hmac

# Basic SHA-256
data = b"Hello, SHA!"
print("SHA-256:", hashlib.sha256(data).hexdigest())
print("SHA-512:", hashlib.sha512(data).hexdigest())

# Streaming for large data
h = hashlib.sha256()
h.update(b"Part 1 ")
h.update(b"Part 2")
print("Streaming:", h.hexdigest())

# HMAC-SHA256
key = b"my-secret-key"
mac = hmac.new(key, data, hashlib.sha256).hexdigest()
print("HMAC:", mac)

# File hashing
def file_sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()
```

## JavaScript (Node.js)

```javascript
const crypto = require('crypto');

// Basic hash
const sha256 = crypto.createHash('sha256').update('Hello!').digest('hex');
console.log('SHA-256:', sha256);

// HMAC
const hmac = crypto.createHmac('sha256', 'secret').update('Hello!').digest('hex');
console.log('HMAC:', hmac);
```

## Go

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "fmt"
)

func main() {
    data := []byte("Hello, SHA!")

    // SHA-256
    h := sha256.Sum256(data)
    fmt.Printf("SHA-256: %x\n", h)

    // HMAC
    mac := hmac.New(sha256.New, []byte("secret"))
    mac.Write(data)
    fmt.Printf("HMAC: %x\n", mac.Sum(nil))
}
```

## Quick reference

| Need | Use |
|------|-----|
| File integrity | SHA-256 |
| Password storage | bcrypt / Argon2 (NOT SHA!) |
| Message authentication | HMAC-SHA256 |
| Commit IDs | SHA-1 (legacy) / SHA-256 (modern) |

Don't use SHA for passwords. Don't use SHA-1 at all.
