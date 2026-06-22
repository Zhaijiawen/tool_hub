# Ed25519 Usage Tutorial

Ed25519 is the simplest, safest digital signature algorithm you can use today. 32-byte keys, 64-byte signatures, deterministic (no nonce to manage), fast. Every modern crypto library supports it.

## Setup

**Python** -- Use PyNaCl (libsodium bindings):
```bash
pip install pynacl
```

**Node.js** -- Built into `crypto` module. No install needed.

**Go** -- `crypto/ed25519` in the standard library.

**Rust** -- `ed25519-dalek` crate.

## Key generation

Ed25519 keys are tiny -- 32 bytes each:

```python
from nacl.signing import SigningKey

# Generate a random key pair
signing_key = SigningKey.generate()
verify_key = signing_key.verify_key  # This is the public key

print(f"Private key ({len(bytes(signing_key))} bytes): {bytes(signing_key).hex()}")
print(f"Public key  ({len(bytes(verify_key))} bytes):  {bytes(verify_key).hex()}")
```

If you need to derive a key from a seed or password, use a 32-byte seed:

```python
import hashlib
import os

# Derive from password
password = b"my secure password"
salt = os.urandom(16)
seed = hashlib.pbkdf2_hmac('sha256', password, salt, 100000, 32)

signing_key = SigningKey(seed)
verify_key = signing_key.verify_key
```

## Signing messages

Signing returns the original message with a 64-byte signature appended:

```python
# Sign
message = b"Hello, Ed25519!"
signed = signing_key.sign(message)

# The signature is the last 64 bytes
signature = signed.signature  # 64 bytes

# Or get just the signature without the message
print(f"Signature: {signature.hex()}")
```

## Verifying signatures

Verification raised `BadSignatureError` if anything is wrong:

```python
from nacl.exceptions import BadSignatureError

try:
    verify_key.verify(signed)  # signed = message + signature
    print("Signature is valid!")
except BadSignatureError:
    print("Invalid signature!")
```

Or verify a detached signature (just the signature bytes):

```python
from nacl.signing import SignedMessage

# Reconstruct the signed message from signature + message
signed_msg = SignedMessage(signature + message)
try:
    verify_key.verify(signed_msg)
    print("Detached signature valid!")
except BadSignatureError:
    print("Invalid!")
```

## Key and signature sizes at a glance

| Component | Size | Notes |
|-----------|------|-------|
| Private key | 32 bytes | Keep secret |
| Public key | 32 bytes | Can share freely |
| Signature | 64 bytes | Attached to the message |
| Security | ~128 bits | Equivalent to AES-128 |

## The determinism advantage

Unlike ECDSA, Ed25519 signatures are deterministic. Hash the same message with the same key and you get the exact same signature every time. This means:

- No CSPRNG needed during signing (eliminates the entire class of nonce-reuse bugs)
- Signature verification is idempotent
- Perfect for test vector validation

Demonstrating: signing the same message twice produces identical signatures:

```python
sig1 = signing_key.sign(b"test message").signature
sig2 = signing_key.sign(b"test message").signature
print(sig1 == sig2)  # True
```

## When to use Ed25519 vs ECDSA

Use Ed25519 for new projects. The only reason to use ECDSA is if you're interoperating with an existing system that requires it (like older TLS configurations, some hardware security modules, or specific government standards). For everything else, Ed25519 is simpler, faster, and safer.
