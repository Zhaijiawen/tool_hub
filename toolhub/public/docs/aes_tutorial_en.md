# AES Usage Tutorial

## Getting set up

Before you write any code, you need a library. Every language has a decent crypto library these days -- don't roll your own AES, it's not worth the debugging nightmare. Here's what I reach for:

**Python** -- `pycryptodome` is the standard. Install it:
```bash
pip install pycryptodome
```

**JavaScript/Node** -- `crypto-js` works everywhere, but if you're in the browser you should prefer the Web Crypto API (it's built in and uses hardware acceleration):
```bash
npm install crypto-js
```

**Java** -- Bouncy Castle is the Swiss Army knife of Java crypto, though the standard `javax.crypto` package also does AES just fine if you don't need exotic modes.

**C/C++** -- OpenSSL's `libcrypto` is the obvious choice, or `libsodium` if you prefer a higher-level API that's harder to misuse.

**Go** -- The standard library has everything you need in `crypto/aes` and `crypto/cipher`. No third-party deps required, which is nice.

**Rust** -- The `aes-gcm` crate or `aes` crate, depending on whether you want just the block cipher or authenticated encryption with it.

## Key generation -- get this right or nothing else matters

Don't use a password as your AES key directly. Just don't. If you must derive a key from a password, use PBKDF2, scrypt, or Argon2 with a proper salt. But for most applications, you want a random key:

```python
import os

# Generate a random 256-bit key
key = os.urandom(32)  # 32 bytes = 256 bits

# For AES-128, use 16 bytes; for AES-192, use 24 bytes
```

A quick gotcha: `os.urandom` is fine on Linux/macOS but on some older Python/Windows combinations, use `secrets.token_bytes()` instead -- it's the same thing but the name makes it clearer that it's meant for cryptographic use.

## Padding -- the annoying but necessary bit

AES encrypts exactly 16 bytes at a time. If your data isn't a multiple of 16 bytes, you need padding. PKCS#7 is the standard approach:

```python
from Crypto.Util.Padding import pad, unpad

BLOCK_SIZE = 16

# pad() adds bytes so the total is a multiple of BLOCK_SIZE
# Each padding byte's value equals the number of padding bytes added
data = b"Hello, world!"  # 13 bytes
padded = pad(data, BLOCK_SIZE)  # adds 3 bytes, each with value 0x03
```

The nice thing about PKCS#7 padding is that `unpad()` reads the last byte to know exactly how many padding bytes to strip. Just make sure you validate padding properly during decryption, or you open yourself to padding oracle attacks (though modern AEAD modes like GCM avoid this entirely).

## Actually encrypting something

Here's the simplest secure pattern -- AES-256 in CBC mode with a random IV:

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import os

def encrypt_cbc(key, plaintext):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode(), AES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    # Return IV prepended to ciphertext -- you'll need it for decryption
    return iv + ciphertext

def decrypt_cbc(key, encrypted_data):
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data, AES.block_size).decode()

# Usage
key = os.urandom(32)
encrypted = encrypt_cbc(key, "Meet me at the usual spot")
print(decrypt_cbc(key, encrypted))  # "Meet me at the usual spot"
```

The IV doesn't need to be secret, but it absolutely must be unpredictable and never reused with the same key. Prepending it to the ciphertext is standard practice.

## GCM mode -- encryption plus authentication

CBC only gives you confidentiality. If someone flips a bit in your ciphertext, you'll decrypt garbage and never know. GCM adds an authentication tag that detects tampering:

```python
from Crypto.Cipher import AES

def encrypt_gcm(key, plaintext, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return cipher.nonce, ciphertext, tag

def decrypt_gcm(key, nonce, ciphertext, tag, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        raise ValueError("Ciphertext has been tampered with!")
```

The `associated_data` parameter is for data you want authenticated but not encrypted -- like metadata or headers. The tag is typically 16 bytes (128 bits), and the nonce should be 12 bytes for optimal GCM performance (the math gets slower with other nonce sizes). Never, ever reuse a nonce with the same key in GCM -- it's the one rule you can't break.

## Encrypting files

Files can be bigger than memory, so you need to process them in chunks:

```python
def encrypt_file(key, input_path, output_path):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        fout.write(iv)  # Store IV at the start

        while True:
            chunk = fin.read(64 * 1024)  # 64KB chunks
            if not chunk:
                break
            if len(chunk) % 16 != 0:
                chunk = pad(chunk, AES.block_size)
            fout.write(cipher.encrypt(chunk))

def decrypt_file(key, input_path, output_path):
    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        iv = fin.read(16)
        cipher = AES.new(key, AES.MODE_CBC, iv)

        while True:
            chunk = fin.read(64 * 1024)
            if not chunk:
                break
            fout.write(cipher.decrypt(chunk))
```

A word of warning: this CBC file encryption doesn't authenticate the file. An attacker who can modify the encrypted file can craft changes that produce predictable damage to the plaintext. For serious file encryption, use GCM (but you'll need to buffer the whole file or use chunked authentication) or a higher-level tool like age or GPG.

## Key management -- don't store keys in your source code

If you need to persist a key, encrypt it with another key derived from a password:

```python
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256

def derive_key(password, salt):
    return PBKDF2(password.encode(), salt, dkLen=32, count=100_000, hmac_hash_module=SHA256)

# Store a key encrypted with a password
def save_key(key, filename, password):
    salt = os.urandom(16)
    kek = derive_key(password, salt)  # key-encrypting key
    cipher = AES.new(kek, AES.MODE_GCM)
    encrypted_key, tag = cipher.encrypt_and_digest(key)

    import json, base64
    with open(filename, 'w') as f:
        json.dump({
            'salt': base64.b64encode(salt).decode(),
            'nonce': base64.b64encode(cipher.nonce).decode(),
            'key': base64.b64encode(encrypted_key).decode(),
            'tag': base64.b64encode(tag).decode(),
        }, f)

def load_key(filename, password):
    import json, base64
    with open(filename) as f:
        d = json.load(f)
    salt = base64.b64decode(d['salt'])
    kek = derive_key(password, salt)
    cipher = AES.new(kek, AES.MODE_GCM, nonce=base64.b64decode(d['nonce']))
    return cipher.decrypt_and_verify(base64.b64decode(d['key']), base64.b64decode(d['tag']))
```

For production systems, use a proper key management service (AWS KMS, HashiCorp Vault, Google Cloud KMS) rather than managing key files yourself. The operational burden of doing key management right is higher than most people expect.

## Quick safety checklist

- Generate keys with `secrets.token_bytes()` or `os.urandom()`, never from passwords directly
- Use a unique, random IV/nonce for every encryption operation with the same key
- Prefer GCM or another AEAD mode over plain CBC -- authentication matters
- Don't reuse nonces in GCM, ever
- Use a library, not a hand-rolled implementation
- Validate all inputs before passing them to crypto functions
- If you're encrypting data at rest, think about what happens when keys need to be rotated
