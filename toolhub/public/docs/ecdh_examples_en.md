# ECDH Code Examples

Key exchange examples in Python (NIST curves and X25519) and JavaScript.

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

# Derive shared secret
alice_shared = alice_priv.d * bob_pub.pointQ
bob_shared = bob_priv.d * alice_pub.pointQ

# Convert to bytes and derive a key
shared_x = int(alice_shared.x).to_bytes(32, 'big')
derived_key = HKDF(shared_x, 32, b"", SHA256)
print(f"Key: {derived_key.hex()}")

# Verify
assert int(bob_shared.x).to_bytes(32, 'big') == shared_x
```

## Python -- X25519 with PyNaCl

```python
from nacl.public import PrivateKey, Box

alice = PrivateKey.generate()
bob = PrivateKey.generate()

# Box handles the ECDH exchange internally
alice_box = Box(alice, bob.public_key)
bob_box = Box(bob, alice.public_key)

encrypted = alice_box.encrypt(b"Secret message")
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

// Derive AES key from shared secret
const key = crypto.hkdfSync('sha256', aliceSecret, '', '', 32);
console.log('Derived key:', key.toString('hex'));
```

## X25519 in Go

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

    fmt.Printf("Shared secret: %x\n", aliceShared)
    fmt.Printf("Match: %v\n", aliceShared == bobShared)
}
```

## Key takeaways

- Always use HKDF on the shared secret before using it as a key
- X25519 is simpler and safer than NIST curve ECDH
- Generate fresh ephemeral keys for every exchange
- The public key is safe to share in the clear
