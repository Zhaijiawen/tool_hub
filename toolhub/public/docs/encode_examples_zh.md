# 编码方案代码示例

常见编码方案的实用操作：Base64、十六进制、URL 编码和 Base32。

## Python

```python
import base64
from urllib.parse import quote, unquote

# Base64
data = b"Binary data \x00\xff"
print("Base64:", base64.b64encode(data).decode())
print("Base64url:", base64.urlsafe_b64encode(data).decode())

# 十六进制
print("Hex:", data.hex())
print("From hex:", bytes.fromhex("48656c6c6f"))

# URL 编码
print("URL 编码:", quote("hello world & more"))
print("URL 解码:", unquote("hello%20world%20%26%20more"))

# Base32
print("Base32:", base64.b32encode(data).decode())
```

## JavaScript

```javascript
// Node.js
const base64 = Buffer.from("Hello!").toString('base64');
console.log("Base64:", base64);
console.log("解码:", Buffer.from(base64, 'base64').toString());

// 十六进制
console.log("Hex:", Buffer.from("Hello").toString('hex'));

// URL 编码
console.log("URL:", encodeURIComponent("hello world & more"));
console.log("解码:", decodeURIComponent("hello%20world%20%26%20more"));

// 浏览器 Base64
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

    fmt.Println("Base64:", base64.StdEncoding.EncodeToString(data))
    fmt.Println("Base64url:", base64.URLEncoding.EncodeToString(data))
    fmt.Println("Hex:", hex.EncodeToString(data))
    fmt.Println("URL:", url.QueryEscape("hello world & more"))
}
```

## 记住

- 编码不是加密。没有密钥 = 没有安全性。
- Base64 数据膨胀约 33%。十六进制膨胀 100%。
- URL 和文件名中用 Base64url（不是标准 Base64）。
- URL 编码保留查询字符串的结构。
