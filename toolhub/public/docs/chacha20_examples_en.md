# ChaCha20 Code Examples

Practical ChaCha20 snippets in Python, Go, and JavaScript. Every example uses authenticated encryption unless labeled otherwise.

## Python

### Raw ChaCha20 (no authentication -- know when to use this)

Raw ChaCha20 without Poly1305 is rare in production. It gives you confidentiality but not integrity. Use it only when you have authentication covered elsewhere.

```python
import os
from Crypto.Cipher import ChaCha20

key = os.urandom(32)
nonce = os.urandom(12)

cipher = ChaCha20.new(key=key, nonce=nonce)
message = b"Stream cipher without authentication"
ciphertext = cipher.encrypt(message)

# Decrypt with the same key and nonce
cipher = ChaCha20.new(key=key, nonce=nonce)
plaintext = cipher.decrypt(ciphertext)
print(plaintext.decode())
```

### ChaCha20-Poly1305 (what you should actually use)

This is the production-ready version. The Poly1305 tag catches any tampering:

```python
from Crypto.Cipher import ChaCha20_Poly1305

def encrypt(key, plaintext, aad=b""):
    nonce = os.urandom(12)
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(aad)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return nonce + ciphertext + tag  # Bundle everything together

def decrypt(key, data, aad=b""):
    nonce = data[:12]
    tag = data[-16:]
    ciphertext = data[12:-16]
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(aad)
    try:
        return cipher.decrypt_and_verify(ciphertext, tag)
    except ValueError:
        raise ValueError("Ciphertext has been modified!")

key = os.urandom(32)
encrypted = encrypt(key, b"Secret message with tamper detection", b"header")
decrypted = decrypt(key, encrypted, b"header")
print(decrypted.decode())
```

### File encryption with ChaCha20-Poly1305

For files, you need streaming or chunked AE. Here's a chunked approach that stores a nonce and tag per chunk (overkill for most use cases, but illustrative):

```python
def encrypt_file(key, input_path, output_path, chunk_size=65536):
    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        while True:
            chunk = fin.read(chunk_size)
            if not chunk:
                break
            nonce = os.urandom(12)
            cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
            ciphertext, tag = cipher.encrypt_and_digest(chunk)
            fout.write(nonce)
            fout.write(len(ciphertext).to_bytes(4, 'big'))
            fout.write(ciphertext)
            fout.write(tag)

def decrypt_file(key, input_path, output_path):
    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        while True:
            header = fin.read(16)  # 12 nonce + 4 length
            if not header:
                break
            nonce = header[:12]
            chunk_len = int.from_bytes(header[12:16], 'big')
            ciphertext = fin.read(chunk_len)
            tag = fin.read(16)
            cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
            try:
                chunk = cipher.decrypt_and_verify(ciphertext, tag)
                fout.write(chunk)
            except ValueError:
                raise ValueError("File has been tampered with!")
```

## Go

Go's `chacha20poly1305` package provides authenticated encryption. The `Seal` method appends the ciphertext and tag after the nonce, making storage straightforward:

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/chacha20poly1305"
)

func main() {
    key := make([]byte, chacha20poly1305.KeySize)
    rand.Read(key)

    aead, _ := chacha20poly1305.New(key)

    nonce := make([]byte, chacha20poly1305.NonceSize)
    rand.Read(nonce)

    plaintext := []byte("Authenticated encryption in Go")
    additionalData := []byte("protocol-v1")

    // Seal: encrypt + authenticate. The nonce is prepended here.
    ciphertext := aead.Seal(nonce, nonce, plaintext, additionalData)

    // Open: verify + decrypt. Reads nonce from ciphertext[:NonceSize].
    nonce, ciphertext = ciphertext[:aead.NonceSize()], ciphertext[aead.NonceSize():]
    decrypted, err := aead.Open(nil, nonce, ciphertext, additionalData)
    if err != nil {
        fmt.Println("Verification failed:", err)
    } else {
        fmt.Println(string(decrypted))
    }
}
```

If you need raw ChaCha20 without authentication (say, you're implementing an existing protocol), use the lower-level `chacha20` package:

```go
import "golang.org/x/crypto/chacha20"

cipher, _ := chacha20.NewUnauthenticatedCipher(key, nonce)
ciphertext := make([]byte, len(plaintext))
cipher.XORKeyStream(ciphertext, plaintext)
```

But honestly, you almost never want this. Always reach for `chacha20poly1305` first.

## JavaScript (Node.js)

Node's built-in `crypto` module supports ChaCha20-Poly1305:

```javascript
const crypto = require('crypto');

function encrypt(key, plaintext) {
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, {
        authTagLength: 16,
    });
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([nonce, ciphertext, tag]);
}

function decrypt(key, data) {
    const nonce = data.subarray(0, 12);
    const tag = data.subarray(data.length - 16);
    const ciphertext = data.subarray(12, data.length - 16);
    const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, {
        authTagLength: 16,
    });
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

const key = crypto.randomBytes(32);
const encrypted = encrypt(key, Buffer.from('Hello from Node.js!'));
const decrypted = decrypt(key, encrypted);
console.log(decrypted.toString());
```

## Key takeaways

- ChaCha20-Poly1305 is the default choice -- raw ChaCha20 is the exception
- Nonce must be unique per message with the same key; random generation is safe with 96 bits
- The Poly1305 tag (16 bytes) must always be verified before using the decrypted data
- ChaCha20 is fast in pure software -- no special hardware required
