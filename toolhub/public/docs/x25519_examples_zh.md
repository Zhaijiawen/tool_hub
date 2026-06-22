# X25519 代码示例

Python、Go 和 JavaScript 中的 X25519 密钥交换。现代密码学中最简单的密钥交换 API。

## Python (PyNaCl)

```python
from nacl.public import PrivateKey, Box
from nacl.bindings import crypto_scalarmult

# 生成密钥
alice = PrivateKey.generate()
bob = PrivateKey.generate()

# 完整 NaCl Box（X25519 + 认证加密）
alice_box = Box(alice, bob.public_key)
bob_box = Box(bob, alice.public_key)

encrypted = alice_box.encrypt(b"秘密消息")
decrypted = bob_box.decrypt(encrypted)
print(decrypted.decode())

# 裸 X25519 共享密钥
alice_shared = crypto_scalarmult(bytes(alice), bytes(bob.public_key))
bob_shared = crypto_scalarmult(bytes(bob), bytes(alice.public_key))
print(f"共享: {alice_shared.hex()}")
print(f"一致: {alice_shared == bob_shared}")
```

## Python (cryptography 库)

```python
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

alice = X25519PrivateKey.generate()
bob = X25519PrivateKey.generate()

alice_shared = alice.exchange(bob.public_key())
bob_shared = bob.exchange(alice.public_key())
print(f"共享: {alice_shared.hex()}")
print(f"一致: {alice_shared == bob_shared}")
```

## Go

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/curve25519"
)

func main() {
    var alicePriv, alicePub, bobPriv, bobPub [32]byte
    rand.Read(alicePriv[:])
    rand.Read(bobPriv[:])

    curve25519.ScalarBaseMult(&alicePub, &alicePriv)
    curve25519.ScalarBaseMult(&bobPub, &bobPriv)

    var shared1, shared2 [32]byte
    curve25519.ScalarMult(&shared1, &alicePriv, &bobPub)
    curve25519.ScalarMult(&shared2, &bobPriv, &alicePub)

    fmt.Printf("共享: %x\n", shared1)
    fmt.Printf("一致: %v\n", shared1 == shared2)
}
```

## JavaScript (Node.js with tweetnacl)

```
npm install tweetnacl
```

```javascript
const nacl = require('tweetnacl');

const alice = nacl.box.keyPair();
const bob = nacl.box.keyPair();

const shared1 = nacl.scalarMult(alice.secretKey, bob.publicKey);
const shared2 = nacl.scalarMult(bob.secretKey, alice.publicKey);
console.log('一致:', Buffer.from(shared1).equals(Buffer.from(shared2)));
```

## 关键要点

- 所有密钥都是 32 字节：私钥、公钥和共享密钥
- 无需选择或配置曲线参数
- 每个 32 字节值都是有效的公钥
- 裸共享密钥使用前必须通过 KDF 处理
