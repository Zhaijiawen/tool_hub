# ECC Usage Tutorial

ECC is a huge topic -- curves, key exchange, signatures. This tutorial focuses on the practical side: generating keys, doing ECDH key exchange, and signing with ECDSA, all in Python with `pycryptodome`.

## Setup

```bash
pip install pycryptodome
```

For JavaScript, Node's built-in `crypto` module does ECC natively. For Java, Bouncy Castle is the standard. For Go, `crypto/ecdsa` and `crypto/elliptic` are in the standard library.

## Picking a curve

The curve you pick matters. A lot. Here's a quick guide:

```python
from Crypto.PublicKey import ECC

# NIST P-256: the workhorse. 128-bit security, everywhere.
key = ECC.generate(curve='P-256')

# P-384: higher security (192-bit), slower.
key = ECC.generate(curve='P-384')

# Curve25519: djb's design, fast and hard to misuse. For key exchange only.
# (Use nacl or cryptography library for this, not pycryptodome)

# Ed25519: for signatures. Deterministic, no nonce-reuse risk.
# (Use nacl or cryptography library)
```

For new projects, Curve25519 (ECDH) + Ed25519 (signatures) is the combination most cryptographers recommend. NIST P-256 is still fine and has broader compatibility.

## Key generation

```python
from Crypto.PublicKey import ECC

# Generate a P-256 key pair
key = ECC.generate(curve='P-256')

# The private key is a scalar (big integer)
print(f"Private key d: {key.d}")

# The public key is a point on the curve
pub = key.public_key()
print(f"Public key point: {pub.pointQ}")

# Export to PEM for storage
private_pem = key.export_key(format='PEM')
public_pem = pub.export_key(format='PEM')

with open('ecc_private.pem', 'wb') as f:
    f.write(private_pem)
with open('ecc_public.pem', 'wb') as f:
    f.write(public_pem)

# Load back
loaded_key = ECC.import_key(open('ecc_private.pem', 'rb').read())
```

## ECDH key exchange

ECDH lets two parties derive a shared secret using each other's public keys:

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

# Alice generates her key pair
alice = ECC.generate(curve='P-256')
# Bob generates his
bob = ECC.generate(curve='P-256')

# Alice computes shared secret using Bob's public key
alice_shared = alice.d * bob.public_key().pointQ
alice_bytes = int(alice_shared.x).to_bytes(32, 'big')

# Bob computes shared secret using Alice's public key
bob_shared = bob.d * alice.public_key().pointQ
bob_bytes = int(bob_shared.x).to_bytes(32, 'big')

# They match!
assert alice_bytes == bob_bytes

# Derive actual encryption keys using HKDF
derived_key = HKDF(alice_bytes, 32, b"ecdh-salt", SHA256)
```

In practice, you should always pass the raw shared secret through a KDF like HKDF before using it as an encryption key. Raw ECDH output has some statistical biases that HKDF eliminates.

## ECDSA signatures

ECDSA signs a message hash with a private key. The big gotcha: the nonce `k` must be unique and unpredictable for every signature. Reusing a nonce across two signatures with the same key reveals the private key. PyCryptodome's DSS module handles this safely:

```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

# Sign
message = b"Hello, ECDSA!"
hash_obj = SHA256.new(message)
signer = DSS.new(key, 'fips-186-3')
signature = signer.sign(hash_obj)

# Verify
verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(hash_obj, signature)
    print("Signature valid!")
except ValueError:
    print("Signature invalid!")
```

For real applications, prefer Ed25519 over ECDSA. Ed25519 eliminates the nonce problem entirely by making nonces deterministic, produces smaller signatures (64 bytes vs 70-72), and is faster to verify.

## Curve25519/Ed25519 in Python (nacl)

PyCryptodome doesn't support Curve25519 well. Use PyNaCl or the `cryptography` library instead:

```bash
pip install pynacl
```

```python
import nacl.signing

# Ed25519 signing key
signing_key = nacl.signing.SigningKey.generate()
verify_key = signing_key.verify_key

# Sign
signed = signing_key.sign(b"Hello, Ed25519!")
# Verify
try:
    verify_key.verify(signed)
    print("Valid!")
except nacl.exceptions.BadSignatureError:
    print("Invalid!")
```

That's it. No nonce to manage, no modes to configure, just sign and verify.
