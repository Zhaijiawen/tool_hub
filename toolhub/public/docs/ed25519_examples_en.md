# Ed25519 Code Examples

Ed25519 in Python, JavaScript, and Go. Clean, simple, no nonce management needed.

## Python (PyNaCl)

```python
from nacl.signing import SigningKey
from nacl.exceptions import BadSignatureError

# Generate key pair
signing_key = SigningKey.generate()
verify_key = signing_key.verify_key

# Sign a message
signed = signing_key.sign(b"Hello, Ed25519!")
signature = signed.signature  # Last 64 bytes

print(f"Private key: {bytes(signing_key).hex()}")
print(f"Public key:  {bytes(verify_key).hex()}")
print(f"Signature:   {signature.hex()}")

# Verify
try:
    verify_key.verify(signed)
    print("Signature is valid!")
except BadSignatureError:
    print("Invalid signature!")
```

### Deterministic key from seed

```python
import hashlib, os

password = b"my-secret-password"
salt = os.urandom(16)
seed = hashlib.pbkdf2_hmac('sha256', password, salt, 100000, 32)
signing_key = SigningKey(seed)
```

### File signing

```python
def sign_file(signing_key, path):
    with open(path, 'rb') as f:
        data = f.read()
    return signing_key.sign(data)

def verify_file(verify_key, path, signed_data):
    with open(path, 'rb') as f:
        data = f.read()
    # reconstructed = signature + original data
    from nacl.signing import SignedMessage
    verify_key.verify(SignedMessage(signed_data.signature + data))
```

## JavaScript (Node.js)

```javascript
const crypto = require('crypto');

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Sign
const sign = crypto.createSign('SHA256');
sign.update('Hello, Ed25519!');
const signature = sign.sign(privateKey, 'hex');
console.log('Signature:', signature);

// Verify
const verify = crypto.createVerify('SHA256');
verify.update('Hello, Ed25519!');
console.log('Valid:', verify.verify(publicKey, signature, 'hex'));
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
    // Generate key pair
    publicKey, privateKey, _ := ed25519.GenerateKey(rand.Reader)

    message := []byte("Hello, Ed25519!")
    signature := ed25519.Sign(privateKey, message)

    fmt.Printf("Public key: %x\n", publicKey)
    fmt.Printf("Signature:  %x\n", signature)

    // Verify
    valid := ed25519.Verify(publicKey, message, signature)
    fmt.Printf("Valid: %v\n", valid)
}
```

## Why Ed25519 over ECDSA

- 64-byte signatures vs 70-72 for ECDSA
- Deterministic -- no RNG during signing, no nonce-reuse attacks possible
- Constant-time implementations available
- Faster verification than ECDSA on most platforms
- Designed to be hard to implement incorrectly
