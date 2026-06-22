# ECDH Usage Tutorial

ECDH is the workhorse of modern key exchange. Every TLS 1.3 handshake, every Signal message, every WireGuard connection uses ECDH under the hood. Here's how to use it in Python.

## Setup

```bash
pip install pycryptodome
```

## Basic ECDH exchange

Two parties each generate a key pair, exchange public keys, and compute a shared secret:

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

# Alice's side
alice_private = ECC.generate(curve='P-256')
alice_public = alice_private.public_key()

# Bob's side
bob_private = ECC.generate(curve='P-256')
bob_public = bob_private.public_key()

# Alice computes shared secret from Bob's public key
alice_shared_point = alice_private.d * bob_public.pointQ
alice_shared_bytes = int(alice_shared_point.x).to_bytes(32, 'big')

# Bob computes shared secret from Alice's public key
bob_shared_point = bob_private.d * alice_public.pointQ
bob_shared_bytes = int(bob_shared_point.x).to_bytes(32, 'big')

# They match
assert alice_shared_bytes == bob_shared_bytes

# Derive an encryption key using HKDF
encryption_key = HKDF(alice_shared_bytes, 32, b"ecdh-salt", SHA256)
```

The key step people forget: always pass the shared secret through a KDF like HKDF. The raw ECDH output has some mathematical structure you don't want in an encryption key.

## Using X25519 instead (recommended)

X25519 is a safer, simpler ECDH variant. PyCryptodome doesn't support it well -- use PyNaCl or the `cryptography` library:

```bash
pip install pynacl
```

```python
from nacl.public import PrivateKey, Box

# Each party generates a key
alice = PrivateKey.generate()
bob = PrivateKey.generate()

# Box computes the shared secret internally
alice_box = Box(alice, bob.public_key)
bob_box = Box(bob, alice.public_key)

# Encrypt a message
encrypted = alice_box.encrypt(b"Hello Bob!", b"some nonce")
# Decrypt
decrypted = bob_box.decrypt(encrypted)
```

X25519 with NaCl is about as simple as crypto gets. Generate keys, create a Box, and you get authenticated encryption automatically (NaCl boxes use X25519 + XSalsa20-Poly1305).

## Security notes

- Use a fresh ephemeral key pair for every exchange. Don't reuse keys.
- The public key isn't secret -- send it in the clear.
- Validate the peer's public key. On NIST curves, a point not on the curve can leak your private key.
- Pass the shared secret through HKDF before using it as an encryption key.
- On Python, prefer PyNaCl (Curve25519) over PyCryptodome (NIST curves) for new code.
