# RSA Usage Tutorial

RSA is the most widely deployed public-key algorithm, but for new projects ECC is usually the better choice. Use RSA when you need compatibility with existing systems.

## Setup

```bash
pip install pycryptodome
```

## Key generation

RSA keys are large. Use at least 2048 bits:

```python
from Crypto.PublicKey import RSA

# 2048-bit is the minimum for current use
key = RSA.generate(2048)

# Export to PEM
private_pem = key.export_key()
public_pem = key.publickey().export_key()

with open('rsa_private.pem', 'wb') as f:
    f.write(private_pem)
with open('rsa_public.pem', 'wb') as f:
    f.write(public_pem)

# Load back
key = RSA.import_key(open('rsa_private.pem', 'rb').read())
```

## Encryption (hybrid approach)

Don't encrypt data directly with RSA. Use hybrid encryption: encrypt a random AES key with RSA, then encrypt the data with AES:

```python
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

# Generate AES key and encrypt data
data = b"Secret message that is too long for RSA direct encryption"
aes_key = get_random_bytes(32)
cipher_aes = AES.new(aes_key, AES.MODE_GCM)
ciphertext, tag = cipher_aes.encrypt_and_digest(data)

# Encrypt the AES key with RSA
cipher_rsa = PKCS1_OAEP.new(key.publickey())
encrypted_aes_key = cipher_rsa.encrypt(aes_key)

# Store/transmit: encrypted_aes_key + nonce + ciphertext + tag
```

## Signatures

Use RSA-PSS (the modern padding standard):

```python
from Crypto.Signature import pss
from Crypto.Hash import SHA256

# Sign
message = b"Hello, RSA-PSS!"
hash_obj = SHA256.new(message)
signature = pss.new(key).sign(hash_obj)

# Verify
verifier = pss.new(key.publickey())
try:
    verifier.verify(SHA256.new(message), signature)
    print("Signature valid!")
except (ValueError, TypeError):
    print("Invalid signature!")
```

## Key size recommendations

- 2048-bit: Minimum acceptable. Works today, may be marginal in 5-10 years.
- 3072-bit: Recommended by NIST. Equivalent to 128-bit security.
- 4096-bit: Conservative choice. Slower, but more future-proof.

1024-bit RSA keys are broken. Never use them. If you find a 1024-bit key in your infrastructure, replace it immediately.

## RSA vs ECC: a practical guide

Use ECC (Ed25519/X25519) for new projects -- smaller keys, faster operations, simpler APIs. Use RSA when: you're maintaining an existing RSA-based system, you need compatibility with legacy clients, or a regulatory requirement mandates RSA.
