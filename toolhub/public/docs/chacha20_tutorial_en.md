# ChaCha20 Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with cryptographic libraries
- Secure random number generator
- Understanding of stream ciphers
- Knowledge of cryptographic concepts

### Library Selection

#### PyCryptodome (Python)
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

#### OpenSSL (C/C++)
```bash
# Install OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

## Basic Concepts

### Key and Nonce Generation
```python
import os
from Crypto.Cipher import ChaCha20

# Generate a random 256-bit key
key = os.urandom(32)  # 32 bytes = 256 bits
print(f"Generated key: {key.hex()}")

# Generate a random 96-bit nonce
nonce = os.urandom(12)  # 12 bytes = 96 bits
print(f"Generated nonce: {nonce.hex()}")
```

### State Structure
ChaCha20 uses a 512-bit internal state:
```python
# ChaCha20 state layout (16 words of 32 bits each)
# [0-3]   : Constants ("expand 32-byte k")
# [4-11]  : Key (256 bits)
# [12]    : Counter (32 bits)
# [13-15] : Nonce (96 bits)

def print_state_info():
    print("ChaCha20 State Structure:")
    print("Words 0-3:   Constants")
    print("Words 4-11:  Key (256 bits)")
    print("Word 12:     Counter (32 bits)")
    print("Words 13-15: Nonce (96 bits)")
```

## Basic Encryption

### Simple ChaCha20 Encryption
```python
from Crypto.Cipher import ChaCha20

def chacha20_encrypt(key, nonce, plaintext):
    """Basic ChaCha20 encryption"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext

def chacha20_decrypt(key, nonce, ciphertext):
    """Basic ChaCha20 decryption"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode()

# Usage
key = os.urandom(32)
nonce = os.urandom(12)
message = "Hello, ChaCha20 encryption!"
encrypted = chacha20_encrypt(key, nonce, message)
decrypted = chacha20_decrypt(key, nonce, encrypted)
print(f"Original: {message}")
print(f"Decrypted: {decrypted}")
```

### Counter Management
```python
def chacha20_with_counter(key, nonce, plaintext, counter=0):
    """ChaCha20 encryption with explicit counter"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    cipher.seek(counter)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext

def encrypt_large_data(key, nonce, data):
    """Encrypt large data using counter increments"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    encrypted_chunks = []
    
    chunk_size = 64  # ChaCha20 block size
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i+chunk_size]
        cipher.seek(i // chunk_size)
        encrypted_chunk = cipher.encrypt(chunk.encode())
        encrypted_chunks.append(encrypted_chunk)
    
    return b''.join(encrypted_chunks)
```

## Advanced Usage

### ChaCha20-Poly1305 AEAD
```python
from Crypto.Cipher import ChaCha20_Poly1305

def chacha20_poly1305_encrypt(key, nonce, plaintext, associated_data=b""):
    """ChaCha20-Poly1305 authenticated encryption"""
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return ciphertext, tag

def chacha20_poly1305_decrypt(key, nonce, ciphertext, tag, associated_data=b""):
    """ChaCha20-Poly1305 authenticated decryption"""
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        return "Authentication failed"

# Usage
key = os.urandom(32)
nonce = os.urandom(12)
message = "Authenticated encryption with ChaCha20-Poly1305"
associated_data = b"metadata"
ciphertext, tag = chacha20_poly1305_encrypt(key, nonce, message, associated_data)
result = chacha20_poly1305_decrypt(key, nonce, ciphertext, tag, associated_data)
```

### File Encryption
```python
def encrypt_file_chacha20(key, input_file, output_file):
    """Encrypt a file using ChaCha20"""
    nonce = os.urandom(12)
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            # Write nonce at the beginning
            f_out.write(nonce)
            
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)

def decrypt_file_chacha20(key, input_file, output_file):
    """Decrypt a file using ChaCha20"""
    with open(input_file, 'rb') as f_in:
        # Read nonce from the beginning
        nonce = f_in.read(12)
        cipher = ChaCha20.new(key=key, nonce=nonce)
        
        with open(output_file, 'wb') as f_out:
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                decrypted_chunk = cipher.decrypt(chunk)
                f_out.write(decrypted_chunk)
```

## Key Management

### Key Derivation
```python
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256

def derive_chacha20_key(password, salt):
    """Derive ChaCha20 key from password"""
    key = PBKDF2(password.encode(), salt, dkLen=32, count=100000, hmac_hash_module=SHA256)
    return key

def generate_key_material():
    """Generate key material for ChaCha20"""
    password = "my_secure_password"
    salt = os.urandom(16)
    key = derive_chacha20_key(password, salt)
    return key, salt

# Usage
key, salt = generate_key_material()
print(f"Derived key: {key.hex()}")
print(f"Salt: {salt.hex()}")
```

### Key Storage
```python
import json
import base64

def save_chacha20_key(key, filename, password):
    """Save ChaCha20 key encrypted with password"""
    salt = os.urandom(16)
    key_encryption_key = derive_chacha20_key(password, salt)
    
    # Encrypt the ChaCha20 key
    cipher = ChaCha20_Poly1305.new(key=key_encryption_key)
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

def load_chacha20_key(filename, password):
    """Load ChaCha20 key from encrypted file"""
    with open(filename, 'r') as f:
        key_data = json.load(f)
    
    # Decode the stored data
    salt = base64.b64decode(key_data['salt'])
    nonce = base64.b64decode(key_data['nonce'])
    encrypted_key = base64.b64decode(key_data['encrypted_key'])
    tag = base64.b64decode(key_data['tag'])
    
    # Derive the key encryption key
    key_encryption_key = derive_chacha20_key(password, salt)
    
    # Decrypt the ChaCha20 key
    cipher = ChaCha20_Poly1305.new(key=key_encryption_key, nonce=nonce)
    key = cipher.decrypt_and_verify(encrypted_key, tag)
    
    return key
```

## Security Best Practices

### Nonce Management
```python
import secrets

def generate_secure_nonce():
    """Generate cryptographically secure nonce"""
    return secrets.token_bytes(12)

def validate_nonce(nonce):
    """Validate nonce length and uniqueness"""
    if len(nonce) != 12:
        raise ValueError("Nonce must be 12 bytes")
    return True

def ensure_nonce_uniqueness(used_nonces, new_nonce):
    """Ensure nonce uniqueness"""
    if new_nonce in used_nonces:
        raise ValueError("Nonce already used")
    used_nonces.add(new_nonce)
    return True
```

### Constant-Time Operations
```python
import hmac

def constant_time_compare(a, b):
    """Constant-time comparison"""
    return hmac.compare_digest(a, b)

def secure_key_verification(stored_key, provided_key):
    """Secure key verification"""
    return constant_time_compare(stored_key, provided_key)
```

### Input Validation
```python
def validate_chacha20_params(key, nonce, plaintext):
    """Validate ChaCha20 parameters"""
    if not isinstance(key, bytes) or len(key) != 32:
        raise ValueError("Key must be 32 bytes")
    
    if not isinstance(nonce, bytes) or len(nonce) != 12:
        raise ValueError("Nonce must be 12 bytes")
    
    if not isinstance(plaintext, str):
        raise ValueError("Plaintext must be string")
    
    return True
```

## Performance Optimization

### Hardware Acceleration
```python
import platform

def check_hardware_support():
    """Check for ChaCha20 hardware support"""
    try:
        import cpuinfo
        info = cpuinfo.get_cpu_info()
        flags = info.get('flags', [])
        
        if 'chacha' in flags:
            return "Hardware ChaCha20 support available"
        else:
            return "Using software ChaCha20 implementation"
    except ImportError:
        return "Hardware support check not available"
```

### Batch Processing
```python
def encrypt_batch_chacha20(key, messages):
    """Encrypt multiple messages efficiently"""
    results = []
    
    for i, message in enumerate(messages):
        nonce = os.urandom(12)
        cipher = ChaCha20.new(key=key, nonce=nonce)
        encrypted = cipher.encrypt(message.encode())
        results.append((nonce, encrypted))
    
    return results

def decrypt_batch_chacha20(key, encrypted_messages):
    """Decrypt multiple messages efficiently"""
    results = []
    
    for nonce, ciphertext in encrypted_messages:
        cipher = ChaCha20.new(key=key, nonce=nonce)
        decrypted = cipher.decrypt(ciphertext)
        results.append(decrypted.decode())
    
    return results
```

## Error Handling

### Exception Handling
```python
def safe_chacha20_encrypt(key, nonce, plaintext):
    """Safe ChaCha20 encryption with error handling"""
    try:
        # Validate inputs
        validate_chacha20_params(key, nonce, plaintext)
        
        # Perform encryption
        cipher = ChaCha20.new(key=key, nonce=nonce)
        ciphertext = cipher.encrypt(plaintext.encode())
        
        return ciphertext
    except ValueError as e:
        print(f"Validation error: {e}")
        return None
    except Exception as e:
        print(f"Encryption error: {e}")
        return None

def safe_chacha20_decrypt(key, nonce, ciphertext):
    """Safe ChaCha20 decryption with error handling"""
    try:
        # Validate inputs
        if not isinstance(key, bytes) or len(key) != 32:
            raise ValueError("Invalid key")
        if not isinstance(nonce, bytes) or len(nonce) != 12:
            raise ValueError("Invalid nonce")
        
        # Perform decryption
        cipher = ChaCha20.new(key=key, nonce=nonce)
        plaintext = cipher.decrypt(ciphertext)
        
        return plaintext.decode()
    except ValueError as e:
        print(f"Validation error: {e}")
        return None
    except Exception as e:
        print(f"Decryption error: {e}")
        return None
```

## Testing and Validation

### Test Vectors
```python
def test_chacha20_vectors():
    """Test ChaCha20 with known test vectors"""
    # RFC 7539 test vector
    key = bytes.fromhex('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f')
    nonce = bytes.fromhex('000000000000004a00000000')
    plaintext = b'Ladies and Gentlemen of the class of \'99: If I could offer you only one tip for the future, sunscreen would be it.'
    
    cipher = ChaCha20.new(key=key, nonce=nonce)
    ciphertext = cipher.encrypt(plaintext)
    
    expected = bytes.fromhex('6e2e359a2568f98041ba0728dd0d6981e97e7aec1d4360c20a27afccfd9fae0bf91b65c5524733ab8f593dabcd62b3571639d624e65152ab8f530c359f0861d807ca0dbf500d6a6156a38e088a22b65e52bc514d16ccf806818ce91ab77937365af90bbf74a35be6b40b8eedf2785e42874d')
    
    assert ciphertext == expected, "Test vector failed"
    print("ChaCha20 test vector passed")
```

### Performance Benchmarking
```python
import time

def benchmark_chacha20():
    """Benchmark ChaCha20 performance"""
    key = os.urandom(32)
    nonce = os.urandom(12)
    data = os.urandom(1024 * 1024)  # 1MB of data
    
    # Time encryption
    start_time = time.time()
    cipher = ChaCha20.new(key=key, nonce=nonce)
    encrypted = cipher.encrypt(data)
    encryption_time = time.time() - start_time
    
    print(f"Encrypted 1MB in {encryption_time:.4f} seconds")
    print(f"Speed: {1/encryption_time:.2f} MB/s")
``` 