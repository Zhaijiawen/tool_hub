# X25519 Usage Tutorial

X25519 is the modern standard for key exchange. If you're building something that needs two parties to agree on a shared secret, this is what you should use.

## Setup

**Python** -- PyNaCl (libsodium bindings) is the cleanest API:
```bash
pip install pynacl
```

**Go** -- `golang.org/x/crypto/curve25519` from the extended standard library.

**Rust** -- `x25519-dalek` crate.

## Key generation and exchange

X25519 keys are exactly 32 bytes. In PyNaCl:

```python
from nacl.public import PrivateKey, Box

# Generate keys
alice_private = PrivateKey.generate()
bob_private = PrivateKey.generate()

# The Box class does the X25519 exchange internally
# and provides authenticated encryption on top
alice_box = Box(alice_private, bob_private.public_key)
bob_box = Box(bob_private, alice_private.public_key)

# Encrypt a message (X25519 + XSalsa20-Poly1305)
nonce = b"unique-24-byte-nonce-here!"
encrypted = alice_box.encrypt(b"Secret message for Bob", nonce)

# Bob decrypts
decrypted = bob_box.decrypt(encrypted)
print(decrypted.decode())  # "Secret message for Bob"
```

If you want just the raw shared secret (not the full NaCl Box):

```python
from nacl.bindings import crypto_scalarmult

# Raw X25519: shared = X25519(private_key, peer_public_key)
alice_shared = crypto_scalarmult(bytes(alice_private), bytes(bob_private.public_key))
bob_shared = crypto_scalarmult(bytes(bob_private), bytes(alice_private.public_key))

print(alice_shared == bob_shared)  # True
print(f"Shared secret: {alice_shared.hex()}")

# Pass through HKDF before using as an encryption key
import hashlib
derived_key = hashlib.sha256(alice_shared).digest()
```

Always pass the raw X25519 output through a KDF before using it as a symmetric key. HKDF or even SHA-256 is fine.

## In Go

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

    fmt.Printf("Shared: %x\n", aliceShared)
    fmt.Printf("Match: %v\n", aliceShared == bobShared)
}
```

## Why X25519 over NIST curve ECDH

- Every 32-byte string is a valid public key (no validation needed)
- Constant-time by design (no timing leaks)
- Tiny keys (32 bytes vs 65 for uncompressed P-256)
- No curve parameters to negotiate
- Faster than P-256 ECDH in software
