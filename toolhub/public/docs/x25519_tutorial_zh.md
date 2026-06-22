# X25519 使用教程

X25519 是现代密钥交换的标准。如果你在构建需要两方协商共享密钥的系统，这就是你应该用的。

## 安装

**Python** -- PyNaCl（libsodium 绑定）API 最干净：
```bash
pip install pynacl
```

**Go** -- 扩展标准库 `golang.org/x/crypto/curve25519`。

**Rust** -- `x25519-dalek` crate。

## 密钥生成和交换

X25519 密钥恰好是 32 字节。PyNaCl 中：

```python
from nacl.public import PrivateKey, Box

# 生成密钥
alice_private = PrivateKey.generate()
bob_private = PrivateKey.generate()

# Box 类内部完成 X25519 交换
# 并在此之上提供认证加密
alice_box = Box(alice_private, bob_private.public_key)
bob_box = Box(bob_private, alice_private.public_key)

# 加密消息（X25519 + XSalsa20-Poly1305）
nonce = b"unique-24-byte-nonce-here!"
encrypted = alice_box.encrypt(b"给 Bob 的秘密消息", nonce)

# Bob 解密
decrypted = bob_box.decrypt(encrypted)
print(decrypted.decode())  # "给 Bob 的秘密消息"
```

如果只需要原始共享密钥（不需要完整 NaCl Box）：

```python
from nacl.bindings import crypto_scalarmult

# 裸 X25519: shared = X25519(private_key, peer_public_key)
alice_shared = crypto_scalarmult(bytes(alice_private), bytes(bob_private.public_key))
bob_shared = crypto_scalarmult(bytes(bob_private), bytes(alice_private.public_key))

print(alice_shared == bob_shared)  # True
print(f"共享密钥: {alice_shared.hex()}")

# 作为加密密钥使用前请通过 HKDF 处理
import hashlib
derived_key = hashlib.sha256(alice_shared).digest()
```

裸 X25519 输出作为对称密钥使用前一定要通过 KDF。HKDF 或哪怕 SHA-256 都可以。

## Go 中的用法

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/curve25519"
)

func main() {
    var alicePriv, alicePub [32]byte
    var bobPriv, bobPub [32]byte

    rand.Read(alicePriv[:])
    rand.Read(bobPriv[:])

    curve25519.ScalarBaseMult(&alicePub, &alicePriv)
    curve25519.ScalarBaseMult(&bobPub, &bobPriv)

    var aliceShared, bobShared [32]byte
    curve25519.ScalarMult(&aliceShared, &alicePriv, &bobPub)
    curve25519.ScalarMult(&bobShared, &bobPriv, &alicePub)

    fmt.Printf("共享: %x\n", aliceShared)
    fmt.Printf("一致: %v\n", aliceShared == bobShared)
}
```

## 为什么选 X25519 而不是 NIST 曲线 ECDH

- 每个 32 字节字符串都是有效公钥（无需验证）
- 设计上恒定时间（无时序泄露）
- 密钥极小（32 字节 vs 未压缩 P-256 的 65 字节）
- 无需协商曲线参数
- 软件实现比 P-256 ECDH 更快
