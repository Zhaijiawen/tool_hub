# ChaCha20 Code Examples

## Python Examples

### Basic ChaCha20 Encryption
```python
import os
from Crypto.Cipher import ChaCha20

def basic_chacha20_encrypt():
    """Basic ChaCha20 encryption example"""
    # Generate random key and nonce
    key = os.urandom(32)  # 256-bit key
    nonce = os.urandom(12)  # 96-bit nonce
    
    # Create cipher
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    # Encrypt message
    message = "Hello, ChaCha20 encryption!"
    ciphertext = cipher.encrypt(message.encode())
    
    print(f"Key: {key.hex()}")
    print(f"Nonce: {nonce.hex()}")
    print(f"Message: {message}")
    print(f"Ciphertext: {ciphertext.hex()}")
    
    return key, nonce, ciphertext

def basic_chacha20_decrypt(key, nonce, ciphertext):
    """Basic ChaCha20 decryption example"""
    # Create cipher with same key and nonce
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    # Decrypt message
    plaintext = cipher.decrypt(ciphertext)
    message = plaintext.decode()
    
    print(f"Decrypted: {message}")
    return message
```

### ChaCha20-Poly1305 AEAD
```python
from Crypto.Cipher import ChaCha20_Poly1305

def chacha20_poly1305_example():
    """ChaCha20-Poly1305 authenticated encryption example"""
    # Generate key and nonce
    key = os.urandom(32)
    nonce = os.urandom(12)
    
    # Create AEAD cipher
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    
    # Add associated data
    associated_data = b"metadata:user123"
    cipher.update(associated_data)
    
    # Encrypt and get authentication tag
    message = "Authenticated encryption with ChaCha20-Poly1305"
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    
    print(f"Associated Data: {associated_data}")
    print(f"Message: {message}")
    print(f"Ciphertext: {ciphertext.hex()}")
    print(f"Tag: {tag.hex()}")
    
    return key, nonce, associated_data, ciphertext, tag

def chacha20_poly1305_decrypt(key, nonce, associated_data, ciphertext, tag):
    """ChaCha20-Poly1305 authenticated decryption example"""
    # Create AEAD cipher
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    
    # Add associated data
    cipher.update(associated_data)
    
    # Decrypt and verify
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        message = plaintext.decode()
        print(f"Authenticated decryption successful: {message}")
        return message
    except ValueError:
        print("Authentication failed!")
        return None
```

### File Encryption with ChaCha20
```python
def encrypt_file_chacha20(input_file, output_file, key):
    """Encrypt a file using ChaCha20"""
    nonce = os.urandom(12)
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            # Write nonce at the beginning
            f_out.write(nonce)
            
            # Encrypt file in chunks
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)
    
    print(f"File encrypted: {input_file} -> {output_file}")
    return nonce

def decrypt_file_chacha20(input_file, output_file, key):
    """Decrypt a file using ChaCha20"""
    with open(input_file, 'rb') as f_in:
        # Read nonce from the beginning
        nonce = f_in.read(12)
        cipher = ChaCha20.new(key=key, nonce=nonce)
        
        with open(output_file, 'wb') as f_out:
            # Decrypt file in chunks
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                decrypted_chunk = cipher.decrypt(chunk)
                f_out.write(decrypted_chunk)
    
    print(f"File decrypted: {input_file} -> {output_file}")
```

## JavaScript Examples

### Node.js ChaCha20 Implementation
```javascript
const crypto = require('crypto');

function chacha20Encrypt(key, nonce, plaintext) {
    // Create cipher
    const cipher = crypto.createCipher('chacha20', key);
    cipher.setAAD(nonce);
    
    // Encrypt
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
}

function chacha20Decrypt(key, nonce, ciphertext) {
    // Create decipher
    const decipher = crypto.createDecipher('chacha20', key);
    decipher.setAAD(nonce);
    
    // Decrypt
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

// Usage example
const key = crypto.randomBytes(32);
const nonce = crypto.randomBytes(12);
const message = "Hello from Node.js ChaCha20!";

const encrypted = chacha20Encrypt(key, nonce, message);
const decrypted = chacha20Decrypt(key, nonce, encrypted);

console.log(`Original: ${message}`);
console.log(`Encrypted: ${encrypted}`);
console.log(`Decrypted: ${decrypted}`);
```

## Java Examples

### Bouncy Castle ChaCha20
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;

public class ChaCha20Example {
    static {
        java.security.Security.addProvider(new BouncyCastleProvider());
    }
    
    public static void main(String[] args) throws Exception {
        // Generate key and nonce
        KeyGenerator keyGen = KeyGenerator.getInstance("ChaCha20", "BC");
        keyGen.init(256);
        SecretKey key = keyGen.generateKey();
        
        SecureRandom random = new SecureRandom();
        byte[] nonce = new byte[12];
        random.nextBytes(nonce);
        
        // Encrypt
        Cipher cipher = Cipher.getInstance("ChaCha20", "BC");
        cipher.init(Cipher.ENCRYPT_MODE, key, new javax.crypto.spec.IvParameterSpec(nonce));
        
        String message = "Hello from Java ChaCha20!";
        byte[] plaintext = message.getBytes("UTF-8");
        byte[] ciphertext = cipher.doFinal(plaintext);
        
        System.out.println("Key: " + Base64.getEncoder().encodeToString(key.getEncoded()));
        System.out.println("Nonce: " + Base64.getEncoder().encodeToString(nonce));
        System.out.println("Message: " + message);
        System.out.println("Ciphertext: " + Base64.getEncoder().encodeToString(ciphertext));
        
        // Decrypt
        cipher.init(Cipher.DECRYPT_MODE, key, new javax.crypto.spec.IvParameterSpec(nonce));
        byte[] decrypted = cipher.doFinal(ciphertext);
        String decryptedMessage = new String(decrypted, "UTF-8");
        
        System.out.println("Decrypted: " + decryptedMessage);
    }
}
```

## Go Examples

### Go ChaCha20 Implementation
```go
package main

import (
    "crypto/rand"
    "encoding/hex"
    "fmt"
    "golang.org/x/crypto/chacha20"
)

func main() {
    // Generate key and nonce
    key := make([]byte, 32)
    nonce := make([]byte, 12)
    rand.Read(key)
    rand.Read(nonce)
    
    // Create cipher
    cipher, err := chacha20.NewUnauthenticatedCipher(key, nonce)
    if err != nil {
        panic(err)
    }
    
    // Encrypt
    message := []byte("Hello from Go ChaCha20!")
    ciphertext := make([]byte, len(message))
    cipher.XORKeyStream(ciphertext, message)
    
    fmt.Printf("Key: %s\n", hex.EncodeToString(key))
    fmt.Printf("Nonce: %s\n", hex.EncodeToString(nonce))
    fmt.Printf("Message: %s\n", string(message))
    fmt.Printf("Ciphertext: %s\n", hex.EncodeToString(ciphertext))
    
    // Decrypt (recreate cipher with same key/nonce)
    cipher, _ = chacha20.NewUnauthenticatedCipher(key, nonce)
    plaintext := make([]byte, len(ciphertext))
    cipher.XORKeyStream(plaintext, ciphertext)
    
    fmt.Printf("Decrypted: %s\n", string(plaintext))
}
```

## Performance and Security

### Benchmarking Implementation
```python
import time
import os
from Crypto.Cipher import ChaCha20

def benchmark_chacha20():
    """Benchmark ChaCha20 performance"""
    key = os.urandom(32)
    nonce = os.urandom(12)
    data_sizes = [1024, 10240, 102400, 1024000]  # 1KB, 10KB, 100KB, 1MB
    
    print("ChaCha20 Performance Benchmark")
    print("=" * 40)
    
    for size in data_sizes:
        data = os.urandom(size)
        
        # Time encryption
        start_time = time.time()
        cipher = ChaCha20.new(key=key, nonce=nonce)
        encrypted = cipher.encrypt(data)
        encryption_time = time.time() - start_time
        
        # Calculate speed
        speed_mbps = (size / 1024 / 1024) / encryption_time
        
        print(f"Data size: {size/1024:.1f}KB")
        print(f"Encryption time: {encryption_time*1000:.2f}ms")
        print(f"Speed: {speed_mbps:.2f} MB/s")
        print("-" * 20)

def secure_key_generation():
    """Demonstrate secure key generation practices"""
    import secrets
    from Crypto.Protocol.KDF import PBKDF2
    from Crypto.Hash import SHA256
    
    # Method 1: Using secrets module (recommended)
    key1 = secrets.token_bytes(32)
    nonce1 = secrets.token_bytes(12)
    
    # Method 2: Using PBKDF2 for password-based key derivation
    password = "my_secure_password"
    salt = secrets.token_bytes(16)
    key2 = PBKDF2(password.encode(), salt, dkLen=32, count=100000, 
                   hmac_hash_module=SHA256)
    
    print("Secure key generation examples:")
    print(f"Random key: {key1.hex()}")
    print(f"Derived key: {key2.hex()}")
    print(f"Salt: {salt.hex()}")
    
    return key1, key2, salt
``` 