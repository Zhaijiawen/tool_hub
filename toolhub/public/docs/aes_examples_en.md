# AES Code Examples

Here are working AES snippets in several languages, with some commentary about what's going on and what to watch for.

## Python

The `pycryptodome` library is my go-to for Python crypto. Clean API, well-maintained, and the padding utilities save you from writing that yourself.

### Basic CBC encryption

```python
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

def aes_encrypt(key, plaintext):
    """AES-CBC encryption with random IV. Returns IV + ciphertext."""
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode(), AES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    return iv + ciphertext

def aes_decrypt(key, encrypted_data):
    """AES-CBC decryption. Expects IV as the first 16 bytes."""
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data, AES.block_size).decode()

# Quick test
key = os.urandom(32)  # 256-bit key
message = "Hey, this actually works!"
encrypted = aes_encrypt(key, message)
decrypted = aes_decrypt(key, encrypted)
print(f"Original: {message}")
print(f"Roundtrip: {decrypted}")
assert message == decrypted  # If this fails, something is very wrong
```

### GCM authenticated encryption

GCM is what you should use for most new projects. The tag catches tampering, and the API is actually simpler than CBC once you get used to it.

```python
from Crypto.Cipher import AES

def aes_gcm_encrypt(key, plaintext, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return cipher.nonce, ciphertext, tag

def aes_gcm_decrypt(key, nonce, ciphertext, tag, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        return "Tampering detected -- data has been modified!"

key = os.urandom(32)
message = "Message with tamper protection"
nonce, ciphertext, tag = aes_gcm_encrypt(key, message)
result = aes_gcm_decrypt(key, nonce, ciphertext, tag)
print(result)  # Should print the original message

# Try modifying the ciphertext and see what happens
import copy
bad_ciphertext = bytearray(copy.copy(ciphertext))
bad_ciphertext[0] ^= 0x01  # Flip one bit
result = aes_gcm_decrypt(key, nonce, bytes(bad_ciphertext), tag)
print(result)  # "Tampering detected..."
```

### File encryption with progress

Here's a practical file encryption function that handles arbitrarily large files by reading in chunks. It prepends the IV to the output file -- that's where the decryption function looks for it.

```python
def encrypt_file_aes(key, input_file, output_file):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            f_out.write(iv)

            while True:
                chunk = f_in.read(1024 * 64)  # 64KB at a time
                if not chunk:
                    break
                if len(chunk) % 16 != 0:
                    chunk = pad(chunk, AES.block_size)
                f_out.write(cipher.encrypt(chunk))

def decrypt_file_aes(key, input_file, output_file):
    with open(input_file, 'rb') as f_in:
        iv = f_in.read(16)
        cipher = AES.new(key, AES.MODE_CBC, iv)

        with open(output_file, 'wb') as f_out:
            while True:
                chunk = f_in.read(1024 * 64)
                if not chunk:
                    break
                f_out.write(cipher.decrypt(chunk))
```

## JavaScript

Two approaches here: CryptoJS for simplicity and broad compatibility, and the Web Crypto API for browser-native performance.

### CryptoJS -- quick and dirty

CryptoJS is the easiest way to get AES in JavaScript, but it's not the fastest. Good for prototyping and small payloads.

```javascript
const CryptoJS = require('crypto-js');

function aesEncrypt(plaintext, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // Concatenate IV and ciphertext, then base64 the whole thing
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

function aesDecrypt(encryptedData, key) {
    const data = CryptoJS.enc.Base64.parse(encryptedData);
    // First 4 words (16 bytes) are the IV
    const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4));
    const ciphertext = CryptoJS.lib.WordArray.create(data.words.slice(4));

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const key = "this-is-a-32-character-key!!";
const result = aesDecrypt(aesEncrypt("hello world", key), key);
console.log(result);  // "hello world"
```

### Web Crypto API -- the proper way in browsers

The Web Crypto API uses hardware acceleration when available and gives you GCM out of the box. The async API takes some getting used to, but it's the right choice for production browser code.

```javascript
async function generateAesKey() {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,  // extractable -- set to false if you don't need to export the key
        ["encrypt", "decrypt"]
    );
}

async function aesEncryptWebCrypto(plaintext, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));  // 12 bytes is optimal for GCM
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded
    );

    return { iv, ciphertext: new Uint8Array(ciphertext) };
}

async function aesDecryptWebCrypto(encryptedData, key) {
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: encryptedData.iv },
        key,
        encryptedData.ciphertext
    );
    return new TextDecoder().decode(decrypted);
}

// Usage -- must be inside an async function
async function demo() {
    const key = await generateAesKey();
    const encrypted = await aesEncryptWebCrypto("secret message", key);
    const decrypted = await aesDecryptWebCrypto(encrypted, key);
    console.log(decrypted);  // "secret message"
}
```

## Java

Bouncy Castle is the heavy lifter in Java crypto. The standard `javax.crypto` can handle basic AES, but Bouncy Castle gives you GCM and other modes without fighting the provider configuration.

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.security.SecureRandom;
import java.util.Base64;

public class AESExample {

    public static String encrypt(String plaintext, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);

        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        byte[] ciphertext = cipher.doFinal(plaintext.getBytes("UTF-8"));

        // Prepend IV to ciphertext for storage
        byte[] combined = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    public static String decrypt(String encryptedData, SecretKey key) throws Exception {
        byte[] data = Base64.getDecoder().decode(encryptedData);

        byte[] iv = new byte[12];
        byte[] ciphertext = new byte[data.length - 12];
        System.arraycopy(data, 0, iv, 0, 12);
        System.arraycopy(data, 12, ciphertext, 0, ciphertext.length);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        byte[] plaintext = cipher.doFinal(ciphertext);
        return new String(plaintext, "UTF-8");
    }

    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey key = keyGen.generateKey();

        String message = "Hello from Java!";
        String encrypted = encrypt(message, key);
        String decrypted = decrypt(encrypted, key);

        System.out.println("Original:  " + message);
        System.out.println("Decrypted: " + decrypted);
    }
}
```

## Go

Go's standard library crypto is one of the best-designed I've used. Everything you need is built in, and the API forces you to handle errors -- which is exactly what you want in crypto code.

```go
package main

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "io"
)

func encrypt(plaintext string, key []byte) (string, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }

    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }

    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return "", err
    }

    // Seal prepends the nonce to the ciphertext automatically
    ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func decrypt(encryptedData string, key []byte) (string, error) {
    ciphertext, err := base64.StdEncoding.DecodeString(encryptedData)
    if err != nil {
        return "", err
    }

    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }

    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }

    nonceSize := gcm.NonceSize()
    if len(ciphertext) < nonceSize {
        return "", fmt.Errorf("ciphertext too short")
    }

    nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        return "", err
    }

    return string(plaintext), nil
}

func main() {
    key := make([]byte, 32)  // AES-256
    if _, err := rand.Read(key); err != nil {
        panic(err)
    }

    message := "Hello from Go!"
    encrypted, err := encrypt(message, key)
    if err != nil {
        fmt.Printf("Encryption error: %v\n", err)
        return
    }

    decrypted, err := decrypt(encrypted, key)
    if err != nil {
        fmt.Printf("Decryption error: %v\n", err)
        return
    }

    fmt.Printf("Original:  %s\n", message)
    fmt.Printf("Decrypted: %s\n", decrypted)
}
```

## Rust

Rust's `aes-gcm` crate provides a clean, type-safe interface. The `aead` trait system means you get a consistent API whether you're using AES-GCM, ChaCha20-Poly1305, or any other AEAD.

```rust
use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit, OsRng};
use base64::{Engine as _, engine::general_purpose};

struct Cipher {
    inner: Aes256Gcm,
}

impl Cipher {
    fn new(key_bytes: &[u8; 32]) -> Self {
        let key = Key::<Aes256Gcm>::from_slice(key_bytes);
        Cipher { inner: Aes256Gcm::new(key) }
    }

    fn encrypt(&self, plaintext: &str) -> Result<String, Box<dyn std::error::Error>> {
        let nonce_bytes = Nonce::<Aes256Gcm>::generate(&mut OsRng);
        let nonce = Nonce::from_slice(&nonce_bytes);

        let ciphertext = self.inner.encrypt(nonce, plaintext.as_bytes())
            .map_err(|_| "Encryption failed")?;

        // Prepend nonce to ciphertext
        let mut result = Vec::from(nonce.as_slice());
        result.extend_from_slice(&ciphertext);

        Ok(general_purpose::STANDARD.encode(result))
    }

    fn decrypt(&self, encoded: &str) -> Result<String, Box<dyn std::error::Error>> {
        let data = general_purpose::STANDARD.decode(encoded)?;

        if data.len() < 12 {
            return Err("Data too short".into());
        }

        let (nonce_bytes, ciphertext) = data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);

        let plaintext = self.inner.decrypt(nonce, ciphertext)
            .map_err(|_| "Decryption failed -- data may be tampered")?;

        Ok(String::from_utf8(plaintext)?)
    }
}

fn main() {
    let mut key = [0u8; 32];
    // In production, use a proper key management approach
    key.copy_from_slice(b"this-is-a-32-byte-key!!abcdefg");

    let cipher = Cipher::new(&key);

    match cipher.encrypt("Hello from Rust!") {
        Ok(encrypted) => {
            println!("Encrypted: {}", encrypted);
            match cipher.decrypt(&encrypted) {
                Ok(decrypted) => println!("Decrypted: {}", decrypted),
                Err(e) => println!("Error: {}", e),
            }
        }
        Err(e) => println!("Error: {}", e),
    }
}
```

A note on the Rust example: using a hardcoded key like this is demo-only. In practice you'd read keys from a secure store or derive them with a KDF. The `OsRng` from the `aead` crate is what you want for nonce generation -- it pulls from the OS CSPRNG.
