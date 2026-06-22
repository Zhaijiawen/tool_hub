# ECDH 代码示例

密钥交换示例：Python（NIST 曲线和 X25519）和 JavaScript。

## Python -- NIST P-256

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

# Alice
alice_priv = ECC.generate(curve='P-256')
alice_pub = alice_priv.public_key()

# Bob
bob_priv = ECC.generate(curve='P-256')
bob_pub = bob_priv.public_key()

# 派生共享密钥
alice_shared = alice_priv.d * bob_pub.pointQ
bob_shared = bob_priv.d * alice_pub.pointQ

shared_x = int(alice_shared.x).to_bytes(32, 'big')
derived_key = HKDF(shared_x, 32, b"", SHA256)
print(f"密钥: {derived_key.hex()}")

assert int(bob_shared.x).to_bytes(32, 'big') == shared_x
```

## Python -- X25519 with PyNaCl

```python
from nacl.public import PrivateKey, Box

alice = PrivateKey.generate()
bob = PrivateKey.generate()

# Box 在内部处理 ECDH 交换
alice_box = Box(alice, bob.public_key)
bob_box = Box(bob, alice.public_key)

encrypted = alice_box.encrypt(b"秘密消息")
decrypted = bob_box.decrypt(encrypted)
print(decrypted.decode())
```

## JavaScript -- Node.js

```javascript
const crypto = require('crypto');

const alice = crypto.createECDH('P-256');
const bob = crypto.createECDH('P-256');
alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey());
const bobSecret = bob.computeSecret(alice.getPublicKey());

const key = crypto.hkdfSync('sha256', aliceSecret, '', '', 32);
console.log('派生密钥:', key.toString('hex'));
```

## Go 中的 X25519

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/curve25519"
)

func main() {
    var alicePrivate, alicePublic [32]byte
    var bobPrivate, bobPublic [32]byte

    rand.Read(alicePrivate[:])
    rand.Read(bobPrivate[:])

    curve25519.ScalarBaseMult(&alicePublic, &alicePrivate)
    curve25519.ScalarBaseMult(&bobPublic, &bobPrivate)

    var aliceShared, bobShared [32]byte
    curve25519.ScalarMult(&aliceShared, &alicePrivate, &bobPublic)
    curve25519.ScalarMult(&bobShared, &bobPrivate, &alicePublic)

    fmt.Printf("共享密钥: %x\n", aliceShared)
    fmt.Printf("一致: %v\n", aliceShared == bobShared)
}
```

## 关键要点

- 共享密钥作为密钥使用前一定要通过 HKDF
- X25519 比 NIST 曲线 ECDH 更简单更安全
- 每次交换生成全新的临时密钥
- 公钥可以安全地明文分享
