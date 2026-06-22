# X25519 Code Examples

X25519 key exchange in Python, Go, and JavaScript. The simplest key exchange API in modern cryptography.

## Python (PyNaCl)

```python
from nacl.public import PrivateKey, Box
from nacl.bindings import crypto_scalarmult

# Generate keys
alice = PrivateKey.generate()
bob = PrivateKey.generate()

# Full NaCl Box (X25519 + authenticated encryption)
alice_box = Box(alice, bob.public_key)
bob_box = Box(bob, alice.public_key)

encrypted = alice_box.encrypt(b"Secret message")
decrypted = bob_box.decrypt(encrypted)
print(decrypted.decode())

# Raw X25519 shared secret
alice_shared = crypto_scalarmult(bytes(alice), bytes(bob.public_key))
bob_shared = crypto_scalarmult(bytes(bob), bytes(alice.public_key))
print(f"Shared: {alice_shared.hex()}")
print(f"Match: {alice_shared == bob_shared}")
```

## Python (cryptography library)

```python
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

alice = X25519PrivateKey.generate()
bob = X25519PrivateKey.generate()

alice_shared = alice.exchange(bob.public_key())
bob_shared = bob.exchange(alice.public_key())
print(f"Shared: {alice_shared.hex()}")
print(f"Match: {alice_shared == bob_shared}")
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

    fmt.Printf("Shared: %x\n", shared1)
    fmt.Printf("Match: %v\n", shared1 == shared2)
}
```

## JavaScript (Node.js with tweetnacl)

```
npm install tweetnacl
```

```javascript
const nacl = require('tweetnacl');

// X25519 key generation
const alice = nacl.box.keyPair();
const bob = nacl.box.keyPair();

// Shared secret (using scalarMult directly)
const shared1 = nacl.scalarMult(alice.secretKey, bob.publicKey);
const shared2 = nacl.scalarMult(bob.secretKey, alice.publicKey);
console.log('Match:', Buffer.from(shared1).equals(Buffer.from(shared2)));
```

## Key points

- 32-byte keys for everything: private, public, and shared secret
- No curve parameter selection or configuration
- Every 32-byte value is a valid public key
- Always pass the raw shared secret through a KDF before use
