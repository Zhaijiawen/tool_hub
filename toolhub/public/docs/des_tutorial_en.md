# DES Usage Tutorial

DES is a historical cipher. You shouldn't use it for anything that needs real security. This tutorial exists for educational purposes -- understanding DES helps you understand modern block ciphers -- and for working with legacy systems that haven't been upgraded yet.

## Quick warning

DES with its 56-bit key can be brute-forced in hours on consumer hardware. If you're touching a system that still uses DES, your first priority should be migrating to AES. Even Triple DES (3DES) is deprecated by NIST for new applications.

## Installing what you need

**Python** -- `pycryptodome` includes DES and 3DES:
```bash
pip install pycryptodome
```

**Node.js** -- The built-in `crypto` module supports DES via `des` and `des-ede3` (3DES) algorithm names.

## Basic DES encryption (for learning only)

DES is a block cipher with 64-bit blocks (8 bytes) and a 56-bit key (8 bytes with parity bits):

```python
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
import os

key = os.urandom(8)  # 56-bit + 8 parity bits
iv = os.urandom(8)   # DES block size

cipher = DES.new(key, DES.MODE_CBC, iv=iv)
plaintext = b"Hello DES"
padded = pad(plaintext, DES.block_size)
ciphertext = cipher.encrypt(padded)

# Decrypt with same key and IV
cipher = DES.new(key, DES.MODE_CBC, iv=iv)
decrypted = unpad(cipher.decrypt(ciphertext), DES.block_size)
print(decrypted.decode())
```

## Triple DES (3DES) -- the deprecated upgrade

3DES applies DES three times with three different keys:

```python
from Crypto.Cipher import DES3

key = os.urandom(24)  # 3 × 8 byte keys
iv = os.urandom(8)

cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)
ciphertext = cipher.encrypt(pad(b"3DES message", DES3.block_size))
```

The effective security of 3DES is about 112 bits (due to meet-in-the-middle attacks), and it's about 3x slower than AES. NIST has deprecated it for new use after 2023.

## The Sweet32 attack reminder

DES and 3DES have 64-bit block sizes. After encrypting about 32 GB with the same key, the birthday bound causes ciphertext collisions that leak information about the plaintext (the Sweet32 attack, CVE-2016-2183). Switch to AES or ChaCha20 for high-volume encryption.

## Migration path

If you're dealing with a DES/3DES legacy system:
1. Audit where DES/3DES is used
2. Replace with AES-256-GCM or ChaCha20-Poly1305
3. For data at rest: decrypt and re-encrypt with AES
4. For TLS: remove DES/3DES cipher suites from server config
5. Set a hard deadline after which DES/3DES connections are rejected

This tool exists for educational use and legacy system interop while planning replacement.
