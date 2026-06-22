# ChaCha20 Usage Tutorial

## Quick setup

ChaCha20 is available in every modern crypto library -- it's been mainstream for years now. Here's what to install:

**Python** -- `pycryptodome` includes both raw ChaCha20 and ChaCha20-Poly1305:
```bash
pip install pycryptodome
```

**Node.js** -- Built into the `crypto` module since Node 10. No extra dependencies needed for the core cipher, though you might want `tweetnacl` or `libsodium.js` for a nicer API.

**Go** -- `golang.org/x/crypto/chacha20` from the extended standard library. Use `chacha20poly1305` package for AEAD.

**Rust** -- The `chacha20` and `chacha20poly1305` crates.

## The nonce rule: never, ever reuse

I'm putting this first because it's the one mistake you can't recover from. With stream ciphers, encrypting two different messages with the same key and nonce is catastrophic. An attacker who gets both ciphertexts can XOR them together and get the XOR of the two plaintexts. Cryptanalysis on the XOR of two plaintexts is vastly easier than attacking either ciphertext individually.

How to stay safe: generate a random 12-byte nonce for every message. With a 96-bit nonce, the collision probability from a CSPRNG is approximately n^2 / 2^97 for n messages -- encrypt a billion messages and your collision probability is still about 2^-70, which is basically zero.

```python
import os

# For every message, generate a fresh nonce
key = os.urandom(32)   # 256-bit key, generated once
nonce = os.urandom(12)  # 96-bit nonce, new for each message
```

## Basic encryption/decryption

ChaCha20 is a stream cipher, so encryption and decryption are the exact same XOR operation. The API in pycryptodome is straightforward:

```python
from Crypto.Cipher import ChaCha20

key = os.urandom(32)
nonce = os.urandom(12)

# Encryption
cipher = ChaCha20.new(key=key, nonce=nonce)
plaintext = b"Hello, ChaCha20!"
ciphertext = cipher.encrypt(plaintext)

# Decryption -- identical to encryption
cipher = ChaCha20.new(key=key, nonce=nonce)
decrypted = cipher.decrypt(ciphertext)
# decrypted == b"Hello, ChaCha20!"
```

Since there's no padding or block alignment, you can encrypt data of any length. A one-byte message? Works. A 2 GB stream? Also works (the 32-bit counter lets you encrypt up to 256 GB before rekeying).

## ChaCha20-Poly1305: authenticated encryption

Raw ChaCha20 gives you confidentiality but not integrity. Someone who intercepts your ciphertext can flip bits and you'll decrypt garbage without knowing anything is wrong. This is where ChaCha20-Poly1305 comes in:

```python
from Crypto.Cipher import ChaCha20_Poly1305

key = os.urandom(32)
nonce = os.urandom(12)

# Encryption with authentication
cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
cipher.update(b"optional associated data")  # Not encrypted, but authenticated
ciphertext, tag = cipher.encrypt_and_digest(b"secret message")
# Tag is 16 bytes -- store/transmit it with the ciphertext

# Decryption with verification
cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
cipher.update(b"optional associated data")
try:
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    print("Message verified and decrypted:", plaintext)
except ValueError:
    print("Tampering detected -- message rejected")
```

The associated data parameter is for metadata that needs to be authenticated but not encrypted -- think protocol headers, message IDs, or routing information. The attacker can't modify associated data without the tag failing verification.

A critical gotcha: PyCryptodome's ChaCha20_Poly1305 generates its own nonce. If you pass one explicitly via `nonce=`, you must ensure uniqueness. If you let the library generate it, the nonce is prepended to the ciphertext and you need to extract it for decryption.

## Working with the Web Crypto API

If you're in a browser or using the Web Crypto API in Node, ChaCha20-Poly1305 isn't universally supported yet (as of 2024). But you can use AES-GCM via Web Crypto and get similar authenticated encryption. For ChaCha20 specifically in browsers, you'll want `libsodium.js` or `tweetnacl`.

## Go: the standard library does everything

Go's ChaCha20 package is low-level but complete:

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/chacha20poly1305"
)

func main() {
    key := make([]byte, chacha20poly1305.KeySize)  // 32 bytes
    rand.Read(key)

    ae, _ := chacha20poly1305.New(key)

    nonce := make([]byte, chacha20poly1305.NonceSize)  // 12 bytes
    rand.Read(nonce)

    plaintext := []byte("Hello from Go!")

    // Seal appends ciphertext to nonce, then appends the tag automatically
    ciphertext := ae.Seal(nil, nonce, plaintext, nil)

    // Open reads nonce from the front, verifies tag, returns plaintext
    decrypted, err := ae.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        fmt.Println("Tampering detected!")
    } else {
        fmt.Println(string(decrypted))
    }
}
```

The `Seal` and `Open` API takes some getting used to -- the `dst` parameter (first argument, `nil` here) is where the output gets prepended. Pass `nonce` as `dst` to store the nonce at the front of the ciphertext automatically.

## Quick safety checklist

- Fresh random nonce for every encryption with the same key
- Never use raw ChaCha20 without authentication -- always pair with Poly1305
- The key is 32 bytes and must come from a CSPRNG
- If deriving a key from a password, use PBKDF2, scrypt, or Argon2
- Store the nonce alongside the ciphertext (it doesn't need to be secret)
- The Poly1305 tag is 16 bytes and must be stored/verified
