# SHA 代码示例

Python、JavaScript 和 Go 中的哈希操作。SHA-256 是默认选择。

## Python

```python
import hashlib
import hmac

# 基本 SHA-256
data = b"Hello, SHA!"
print("SHA-256:", hashlib.sha256(data).hexdigest())
print("SHA-512:", hashlib.sha512(data).hexdigest())

# 大文件流式处理
h = hashlib.sha256()
h.update(b"Part 1 ")
h.update(b"Part 2")
print("流式:", h.hexdigest())

# HMAC-SHA256
key = b"my-secret-key"
mac = hmac.new(key, data, hashlib.sha256).hexdigest()
print("HMAC:", mac)

# 文件哈希
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

const sha256 = crypto.createHash('sha256').update('Hello!').digest('hex');
console.log('SHA-256:', sha256);

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

    h := sha256.Sum256(data)
    fmt.Printf("SHA-256: %x\n", h)

    mac := hmac.New(sha256.New, []byte("secret"))
    mac.Write(data)
    fmt.Printf("HMAC: %x\n", mac.Sum(nil))
}
```

## 快速参考

| 需求 | 使用 |
|------|------|
| 文件完整性 | SHA-256 |
| 密码存储 | bcrypt / Argon2（不是 SHA！）|
| 消息认证 | HMAC-SHA256 |
| 提交 ID | SHA-1（遗留）/ SHA-256（现代）|

不要用 SHA 存储密码。不要再用 SHA-1。
