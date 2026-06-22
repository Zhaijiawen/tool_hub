# Ed25519 代码示例

Python、JavaScript 和 Go 中的 Ed25519 实现。简洁明了，无需管理 nonce。

## Python (PyNaCl)

```python
from nacl.signing import SigningKey
from nacl.exceptions import BadSignatureError

# 生成密钥对
signing_key = SigningKey.generate()
verify_key = signing_key.verify_key

# 签名消息
signed = signing_key.sign(b"Hello, Ed25519!")
signature = signed.signature  # 最后 64 字节

print(f"私钥: {bytes(signing_key).hex()}")
print(f"公钥: {bytes(verify_key).hex()}")
print(f"签名: {signature.hex()}")

# 验证
try:
    verify_key.verify(signed)
    print("签名有效！")
except BadSignatureError:
    print("无效签名！")
```

### 从种子生成确定性密钥

```python
import hashlib, os

password = b"my-secret-password"
salt = os.urandom(16)
seed = hashlib.pbkdf2_hmac('sha256', password, salt, 100000, 32)
signing_key = SigningKey(seed)
```

### 文件签名

```python
def sign_file(signing_key, path):
    with open(path, 'rb') as f:
        data = f.read()
    return signing_key.sign(data)

def verify_file(verify_key, path, signed_data):
    with open(path, 'rb') as f:
        data = f.read()
    from nacl.signing import SignedMessage
    verify_key.verify(SignedMessage(signed_data.signature + data))
```

## JavaScript (Node.js)

```javascript
const crypto = require('crypto');

// 生成密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// 签名
const sign = crypto.createSign('SHA256');
sign.update('Hello, Ed25519!');
const signature = sign.sign(privateKey, 'hex');
console.log('签名:', signature);

// 验证
const verify = crypto.createVerify('SHA256');
verify.update('Hello, Ed25519!');
console.log('有效:', verify.verify(publicKey, signature, 'hex'));
```

## Go

```go
package main

import (
    "crypto/ed25519"
    "crypto/rand"
    "fmt"
)

func main() {
    publicKey, privateKey, _ := ed25519.GenerateKey(rand.Reader)

    message := []byte("Hello, Ed25519!")
    signature := ed25519.Sign(privateKey, message)

    fmt.Printf("公钥: %x\n", publicKey)
    fmt.Printf("签名: %x\n", signature)

    valid := ed25519.Verify(publicKey, message, signature)
    fmt.Printf("有效: %v\n", valid)
}
```

## 为什么选 Ed25519 而不是 ECDSA

- 64 字节签名，ECDSA 要 70-72
- 确定性 -- 签名过程无需 RNG，不可能有 nonce 重用攻击
- 可用恒定时间实现
- 大多数平台验证比 ECDSA 更快
- 设计上就难以实现出错
