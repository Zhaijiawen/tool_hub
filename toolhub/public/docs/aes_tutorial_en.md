# AES Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with cryptographic libraries
- Secure random number generator
- Key management system
- Understanding of cryptographic concepts

### Library Selection

#### OpenSSL (C/C++)
```bash
# Install OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

#### PyCrypto/PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### CryptoJS (JavaScript)
```bash
npm install crypto-js
```

#### Bouncy Castle (Java)
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

## Basic Concepts

### Key Generation
```python
import os
from Crypto.Cipher import AES

# Generate a random 256-bit key
key = os.urandom(32)  # 32 bytes = 256 bits
print(f"Generated key: {key.hex()}")
```

### Block Size
AES operates on 128-bit (16-byte) blocks:
```python
# AES block size is always 16 bytes
BLOCK_SIZE = 16

# Pad data to block size
def pad(data):
    padding_length = BLOCK_SIZE - (len(data) % BLOCK_SIZE)
    padding = bytes([padding_length] * padding_length)
    return data + padding
```

### Initialization Vector (IV)
```python
# Generate random IV for CBC mode
iv = os.urandom(16)  # 16 bytes for AES block size
print(f"Generated IV: {iv.hex()}")
```

## Basic Encryption

### ECB Mode (Not Recommended)
```python
from Crypto.Cipher import AES

def encrypt_ecb(key, plaintext):
    cipher = AES.new(key, AES.MODE_ECB)
    padded_data = pad(plaintext.encode())
    ciphertext = cipher.encrypt(padded_data)
    return ciphertext

def decrypt_ecb(key, ciphertext):
    cipher = AES.new(key, AES.MODE_ECB)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data).decode()

# Usage
key = os.urandom(32)
message = "Hello, AES encryption!"
encrypted = encrypt_ecb(key, message)
decrypted = decrypt_ecb(key, encrypted)
```

### CBC Mode (Recommended)
```python
def encrypt_cbc(key, plaintext, iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode())
    ciphertext = cipher.encrypt(padded_data)
    return ciphertext

def decrypt_cbc(key, ciphertext, iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data).decode()

# Usage
key = os.urandom(32)
iv = os.urandom(16)
message = "Secure message with CBC mode"
encrypted = encrypt_cbc(key, message, iv)
decrypted = decrypt_cbc(key, encrypted, iv)
```

## Advanced Modes

### CTR Mode (Stream Cipher)
```python
def encrypt_ctr(key, plaintext, nonce):
    cipher = AES.new(key, AES.MODE_CTR, nonce=nonce)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext

def decrypt_ctr(key, ciphertext, nonce):
    cipher = AES.new(key, AES.MODE_CTR, nonce=nonce)
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode()

# Usage
key = os.urandom(32)
nonce = os.urandom(8)  # 8 bytes for CTR nonce
message = "CTR mode allows parallel processing"
encrypted = encrypt_ctr(key, message, nonce)
decrypted = decrypt_ctr(key, encrypted, nonce)
```

### GCM Mode (Authenticated Encryption)
```python
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
        return "Authentication failed"

# Usage
key = os.urandom(32)
message = "Authenticated encryption with GCM"
nonce, ciphertext, tag = encrypt_gcm(key, message)
decrypted = decrypt_gcm(key, nonce, ciphertext, tag)
```

## File Encryption

### Encrypting Files
```python
def encrypt_file(key, input_file, output_file):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            # Write IV at the beginning
            f_out.write(iv)
            
            while True:
                chunk = f_in.read(1024)  # Read in chunks
                if not chunk:
                    break
                
                # Pad the last chunk if necessary
                if len(chunk) % 16 != 0:
                    chunk = pad(chunk)
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)

def decrypt_file(key, input_file, output_file):
    with open(input_file, 'rb') as f_in:
        # Read IV from the beginning
        iv = f_in.read(16)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        
        with open(output_file, 'wb') as f_out:
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                decrypted_chunk = cipher.decrypt(chunk)
                f_out.write(decrypted_chunk)
```

## Key Management

### Key Derivation (PBKDF2)
```python
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256

def derive_key(password, salt):
    key = PBKDF2(password.encode(), salt, dkLen=32, count=100000, hmac_hash_module=SHA256)
    return key

# Usage
password = "my_secure_password"
salt = os.urandom(16)
key = derive_key(password, salt)
```

### Key Storage
```python
import json
import base64

def save_key(key, filename, password):
    # Encrypt the key with a password
    salt = os.urandom(16)
    key_encryption_key = derive_key(password, salt)
    
    # Encrypt the actual key
    cipher = AES.new(key_encryption_key, AES.MODE_GCM)
    encrypted_key, tag = cipher.encrypt_and_digest(key)
    
    # Save encrypted key with metadata
    key_data = {
        'salt': base64.b64encode(salt).decode(),
        'nonce': base64.b64encode(cipher.nonce).decode(),
        'encrypted_key': base64.b64encode(encrypted_key).decode(),
        'tag': base64.b64encode(tag).decode()
    }
    
    with open(filename, 'w') as f:
        json.dump(key_data, f)

def load_key(filename, password):
    with open(filename, 'r') as f:
        key_data = json.load(f)
    
    # Decode the stored data
    salt = base64.b64decode(key_data['salt'])
    nonce = base64.b64decode(key_data['nonce'])
    encrypted_key = base64.b64decode(key_data['encrypted_key'])
    tag = base64.b64decode(key_data['tag'])
    
    # Derive the key encryption key
    key_encryption_key = derive_key(password, salt)
    
    # Decrypt the actual key
    cipher = AES.new(key_encryption_key, AES.MODE_GCM, nonce=nonce)
    key = cipher.decrypt_and_verify(encrypted_key, tag)
    
    return key
```

## Security Best Practices

### Random Number Generation
```python
import secrets

# Use secrets module for cryptographic randomness
def generate_secure_random():
    # Generate secure random bytes
    random_bytes = secrets.token_bytes(32)
    
    # Generate secure random integer
    random_int = secrets.randbelow(1000)
    
    # Generate secure random choice
    choices = ['A', 'B', 'C', 'D']
    random_choice = secrets.choice(choices)
    
    return random_bytes, random_int, random_choice
```

### Constant-Time Operations
```python
import hmac

def constant_time_compare(a, b):
    """Constant-time string comparison"""
    return hmac.compare_digest(a, b)

def secure_equals(a, b):
    """Secure comparison that doesn't leak timing information"""
    if len(a) != len(b):
        return False
    result = 0
    for x, y in zip(a, b):
        result |= x ^ y
    return result == 0
```

### Input Validation
```python
def validate_key(key):
    """Validate AES key length"""
    if not isinstance(key, bytes):
        raise ValueError("Key must be bytes")
    if len(key) not in [16, 24, 32]:
        raise ValueError("Key must be 16, 24, or 32 bytes")
    return True

def validate_iv(iv):
    """Validate initialization vector"""
    if not isinstance(iv, bytes):
        raise ValueError("IV must be bytes")
    if len(iv) != 16:
        raise ValueError("IV must be 16 bytes")
    return True
```

## Error Handling

### Exception Handling
```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

def safe_encrypt(key, plaintext, iv):
    try:
        # Validate inputs
        validate_key(key)
        validate_iv(iv)
        
        # Perform encryption
        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_data = pad(plaintext.encode(), AES.block_size)
        ciphertext = cipher.encrypt(padded_data)
        
        return ciphertext
    except ValueError as e:
        print(f"Validation error: {e}")
        return None
    except Exception as e:
        print(f"Encryption error: {e}")
        return None

def safe_decrypt(key, ciphertext, iv):
    try:
        # Validate inputs
        validate_key(key)
        validate_iv(iv)
        
        # Perform decryption
        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_data = cipher.decrypt(ciphertext)
        plaintext = unpad(padded_data, AES.block_size)
        
        return plaintext.decode()
    except ValueError as e:
        print(f"Validation error: {e}")
        return None
    except Exception as e:
        print(f"Decryption error: {e}")
        return None
```

## Performance Optimization

### Hardware Acceleration
```python
# Check for AES-NI support
import platform

def check_aes_ni():
    """Check if AES-NI is available"""
    try:
        import cpuinfo
        info = cpuinfo.get_cpu_info()
        flags = info.get('flags', [])
        return 'aes' in flags
    except ImportError:
        return False

# Use hardware acceleration when available
if check_aes_ni():
    print("AES-NI hardware acceleration available")
else:
    print("Using software AES implementation")
```

### Batch Processing
```python
def encrypt_batch(key, messages, iv):
    """Encrypt multiple messages efficiently"""
    cipher = AES.new(key, AES.MODE_CBC, iv)
    results = []
    
    for message in messages:
        padded_data = pad(message.encode(), AES.block_size)
        encrypted = cipher.encrypt(padded_data)
        results.append(encrypted)
    
    return results
```

## Testing and Validation

### Test Vectors
```python
def test_aes_vectors():
    """Test AES with known test vectors"""
    # Known test vector
    key = bytes.fromhex('000102030405060708090a0b0c0d0e0f')
    plaintext = bytes.fromhex('00112233445566778899aabbccddeeff')
    expected_ciphertext = bytes.fromhex('69c4e0d86a7b0430d8cdb78070b4c55a')
    
    # Test encryption
    cipher = AES.new(key, AES.MODE_ECB)
    ciphertext = cipher.encrypt(plaintext)
    
    assert ciphertext == expected_ciphertext, "Test vector failed"
    print("AES test vector passed")
```

### Performance Benchmarking
```python
import time

def benchmark_aes():
    """Benchmark AES encryption performance"""
    key = os.urandom(32)
    data = os.urandom(1024 * 1024)  # 1MB of data
    
    # Time encryption
    start_time = time.time()
    cipher = AES.new(key, AES.MODE_CBC)
    encrypted = cipher.encrypt(pad(data, AES.block_size))
    encryption_time = time.time() - start_time
    
    print(f"Encrypted 1MB in {encryption_time:.4f} seconds")
    print(f"Speed: {1/encryption_time:.2f} MB/s")
``` 