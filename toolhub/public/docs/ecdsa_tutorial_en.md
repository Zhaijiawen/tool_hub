# ECDSA Usage Tutorial

ECDSA is widely deployed but has sharp edges. Use Ed25519 for new projects if you can. If you need ECDSA (for interop with existing systems), here's what you need to know.

## Setup

```bash
pip install pycryptodome
```

## Signing and verification

```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

# Generate ECDSA key pair
key = ECC.generate(curve='P-256')

# Sign a message
message = b"ECDSA signed message"
hash_obj = SHA256.new(message)
signer = DSS.new(key, 'fips-186-3')
signature = signer.sign(hash_obj)

print(f"Signature ({len(signature)} bytes): {signature.hex()}")

# Verify
verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(SHA256.new(message), signature)
    print("Signature is valid!")
except ValueError:
    print("Invalid signature!")
```

## Deterministic ECDSA (RFC 6979)

PyCryptodome supports deterministic nonce generation, which eliminates nonce-reuse risks:

```python
# Deterministic mode: k is derived from the private key and message
signer = DSS.new(key, 'deterministic-rfc6979')
signature = signer.sign(hash_obj)
```

This should be your default. It means the same private key and same message always produce the same signature -- no RNG needed, no nonce reuse possible.

## The nonce-reuse demonstration (DON'T DO THIS)

To understand why nonce reuse is fatal, here's what happens if k is reused:

```python
# NEVER reuse a nonce like this in production
# This demonstrates WHY it's dangerous

# If two signatures use the same k, an attacker who sees both can recover the key:
# Given: (r, s1) for message hash z1, and (r, s2) for message hash z2
# k = (z1 - z2) / (s1 - s2) mod n
# Then: private_key = (s1 * k - z1) / r mod n
```

Use RFC 6979 deterministic mode. Every time.

## Signing files

```python
def sign_file(private_key, file_path):
    with open(file_path, 'rb') as f:
        data = f.read()
    signer = DSS.new(private_key, 'deterministic-rfc6979')
    return signer.sign(SHA256.new(data))

def verify_file(public_key, file_path, signature):
    with open(file_path, 'rb') as f:
        data = f.read()
    verifier = DSS.new(public_key, 'fips-186-3')
    try:
        verifier.verify(SHA256.new(data), signature)
        return True
    except ValueError:
        return False
```

## Should you use ECDSA or Ed25519?

For new code: Ed25519. It's deterministic by design, produces 64-byte signatures, and is simpler to implement correctly.

Use ECDSA only when you need compatibility with an existing system that requires it (Bitcoin, legacy TLS, some HSMs and government standards).
