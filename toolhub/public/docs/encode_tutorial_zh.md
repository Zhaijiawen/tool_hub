# 编码方案使用教程

编码是日常编程的一部分。处理二进制数据、API 和数据序列化时你会不断用到它。以下是常见编码方案的实用指南。

## Base64

每种语言的标准库都有内置支持。Python：

```python
import base64

data = b"Hello, world! \x00\xff"

# 标准 Base64
encoded = base64.b64encode(data)
print(encoded)  # b'SGVsbG8sIHdvcmxkISAA/w=='

decoded = base64.b64decode(encoded)
print(decoded)  # b'Hello, world! \x00\xff'

# URL 安全的 Base64（没有 + / =）
url_safe = base64.urlsafe_b64encode(data)
print(url_safe)  # b'SGVsbG8sIHdvcmxkISAA_w=='
```

JavaScript：
```javascript
const data = "Hello, world!";

// 编码
const encoded = btoa(data);
console.log(encoded);  // "SGVsbG8sIHdvcmxkIQ=="

// 解码
const decoded = atob(encoded);
console.log(decoded);  // "Hello, world!"
```

`btoa`/`atob` 函数只能处理 ASCII 字符串。二进制数据或 UTF-8 需要用 `TextEncoder`/`TextDecoder` 或 Node 的 Buffer。

## 十六进制编码

Python：
```python
data = b"Hello, world!"

hex_str = data.hex()
print(hex_str)  # "48656c6c6f2c20776f726c6421"

decoded = bytes.fromhex(hex_str)
print(decoded)  # b'Hello, world!'
```

JavaScript：
```javascript
// Node.js
const hex = Buffer.from("Hello").toString('hex');
console.log(hex);  // "48656c6c6f"
const decoded = Buffer.from(hex, 'hex').toString();
console.log(decoded);  // "Hello"
```

## URL 编码

Python：
```python
from urllib.parse import quote, unquote

encoded = quote("Hello, world! & more?")
print(encoded)  # "Hello%2C%20world%21%20%26%20more%3F"

decoded = unquote(encoded)
print(decoded)  # "Hello, world! & more?"
```

JavaScript：
```javascript
const encoded = encodeURIComponent("Hello, world! & more?");
console.log(encoded);  // "Hello%2C%20world!%20%26%20more%3F"

const decoded = decodeURIComponent(encoded);
console.log(decoded);  // "Hello, world! & more?"
```

## Base32

Python：
```python
import base64

data = b"Hello, world!"
encoded = base64.b32encode(data)
print(encoded)  # b'JBSWY3DPEBLW64TMMQ======'

decoded = base64.b32decode(encoded)
print(decoded)  # b'Hello, world!'
```

## 常见错误

- 把 Base64 当加密用。这是编码。没有密钥，没有安全性。
- 双重编码：因为忘记先解码而对已经 Base64 的数据再次编码。
- URL 中对大块二进制数据用 Base64（应该用 Base64url -- 没有 `+` 或 `/` 字符）。
- 忘记浏览器中 `atob`/`btoa` 不原生支持 UTF-8。
