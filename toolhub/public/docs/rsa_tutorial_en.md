# RSA Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with cryptographic libraries
- Understanding of public-key cryptography concepts
- Knowledge of modular arithmetic and number theory
- Awareness of RSA security considerations

### Library Selection

#### PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### Node.js crypto (JavaScript)
```bash
# Built-in crypto module, no installation needed
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

### Key Pair Structure
```python
from Crypto.PublicKey import RSA

# Generate RSA key pair
key = RSA.generate(2048)

# Public key components
public_key = key.publickey()
n = public_key.n  # Modulus
e = public_key.e  # Public exponent

# Private key components
private_key = key
d = private_key.d  # Private exponent
p = private_key.p  # First prime factor
q = private_key.q  # Second prime factor

print(f"Modulus (n): {n}")
print(f"Public exponent (e): {e}")
print(f"Key size: {key.size_in_bits()} bits")
```

### Key Size Considerations
```python
def key_size_recommendations():
    """RSA key size recommendations"""
    print("RSA Key Size Recommendations:")
    print("1024 bits: Legacy (insecure)")
    print("2048 bits: Current minimum (secure until 2030)")
    print("3072 bits: Recommended for long-term security")
    print("4096 bits: Maximum security (slower performance)")
    
    # Security levels
    security_levels = {
        1024: "64 bits (insecure)",
        2048: "112 bits (secure until 2030)",
        3072: "128 bits (recommended)",
        4096: "152 bits (maximum security)"
    }
    
    return security_levels
```

## Key Generation

### Basic Key Generation
```python
from Crypto.PublicKey import RSA
import os

def generate_rsa_key_pair(key_size=2048):
    """Generate RSA key pair"""
    # Generate random key
    key = RSA.generate(key_size)
    
    # Extract public and private keys
    private_key = key
    public_key = key.publickey()
    
    print(f"Generated {key_size}-bit RSA key pair")
    print(f"Public key: {public_key.n}")
    print(f"Private key: {private_key.d}")
    
    return private_key, public_key

def save_key_pair(private_key, public_key, filename_prefix):
    """Save RSA key pair to files"""
    # Save private key
    with open(f"{filename_prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key())
    
    # Save public key
    with open(f"{filename_prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key())
    
    print(f"Keys saved as {filename_prefix}_private.pem and {filename_prefix}_public.pem")
```

### Key Generation with Custom Parameters
```python
def generate_rsa_with_custom_exponent(key_size=2048, e=65537):
    """Generate RSA key with custom public exponent"""
    key = RSA.generate(key_size, e=e)
    
    print(f"Generated {key_size}-bit RSA key with e={e}")
    print(f"Public exponent: {key.e}")
    
    return key

def validate_key_parameters(key):
    """Validate RSA key parameters"""
    # Check key size
    if key.size_in_bits() < 2048:
        print("Warning: Key size less than 2048 bits")
    
    # Check public exponent
    if key.e == 3:
        print("Warning: e=3 may be vulnerable to certain attacks")
    elif key.e == 65537:
        print("Good: e=65537 is the recommended public exponent")
    
    # Check prime factors
    if key.p == key.q:
        print("Error: Prime factors are identical")
        return False
    
    return True
```

## Encryption and Decryption

### Basic RSA Encryption
```python
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA

def rsa_encrypt(public_key, message):
    """Encrypt message using RSA public key"""
    # Create cipher with OAEP padding
    cipher = PKCS1_OAEP.new(public_key)
    
    # Encrypt the message
    ciphertext = cipher.encrypt(message.encode())
    
    return ciphertext

def rsa_decrypt(private_key, ciphertext):
    """Decrypt message using RSA private key"""
    # Create cipher with OAEP padding
    cipher = PKCS1_OAEP.new(private_key)
    
    # Decrypt the message
    plaintext = cipher.decrypt(ciphertext)
    
    return plaintext.decode()

# Usage example
private_key, public_key = generate_rsa_key_pair(2048)
message = "Hello, RSA encryption!"

encrypted = rsa_encrypt(public_key, message)
decrypted = rsa_decrypt(private_key, encrypted)

print(f"Original: {message}")
print(f"Decrypted: {decrypted}")
```

### RSA with Different Padding Schemes
```python
from Crypto.Cipher import PKCS1_v1_5

def rsa_encrypt_pkcs1v15(public_key, message):
    """Encrypt using PKCS#1 v1.5 padding (legacy)"""
    cipher = PKCS1_v1_5.new(public_key)
    ciphertext = cipher.encrypt(message.encode())
    return ciphertext

def rsa_decrypt_pkcs1v15(private_key, ciphertext):
    """Decrypt using PKCS#1 v1.5 padding"""
    cipher = PKCS1_v1_5.new(private_key)
    plaintext = cipher.decrypt(ciphertext, None)
    return plaintext.decode()

def compare_padding_schemes():
    """Compare different padding schemes"""
    print("Padding Scheme Comparison:")
    print("PKCS#1 v1.5: Legacy, vulnerable to certain attacks")
    print("OAEP: Recommended, provably secure")
    print("PSS: For digital signatures only")
```

## Digital Signatures

### Basic Digital Signatures
```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

def rsa_sign(private_key, message):
    """Sign message using RSA private key"""
    # Create hash of the message
    hash_obj = SHA256.new(message.encode())
    
    # Sign the hash
    signature = pkcs1_15.new(private_key).sign(hash_obj)
    
    return signature

def rsa_verify(public_key, message, signature):
    """Verify signature using RSA public key"""
    # Create hash of the message
    hash_obj = SHA256.new(message.encode())
    
    try:
        # Verify the signature
        pkcs1_15.new(public_key).verify(hash_obj, signature)
        return True
    except (ValueError, TypeError):
        return False

# Usage example
message = "Important document to sign"
signature = rsa_sign(private_key, message)
is_valid = rsa_verify(public_key, message, signature)

print(f"Message: {message}")
print(f"Signature valid: {is_valid}")
```

### RSA-PSS Signatures
```python
from Crypto.Signature import pss
from Crypto.Hash import SHA256

def rsa_sign_pss(private_key, message):
    """Sign message using RSA-PSS"""
    hash_obj = SHA256.new(message.encode())
    signature = pss.new(private_key).sign(hash_obj)
    return signature

def rsa_verify_pss(public_key, message, signature):
    """Verify RSA-PSS signature"""
    hash_obj = SHA256.new(message.encode())
    
    try:
        pss.new(public_key).verify(hash_obj, signature)
        return True
    except (ValueError, TypeError):
        return False
```

## Advanced Usage

### Hybrid Encryption
```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import os

def hybrid_encrypt(rsa_public_key, message):
    """Hybrid encryption: RSA + AES"""
    # Generate random AES key
    aes_key = get_random_bytes(32)  # 256-bit key
    
    # Encrypt AES key with RSA
    rsa_cipher = PKCS1_OAEP.new(rsa_public_key)
    encrypted_aes_key = rsa_cipher.encrypt(aes_key)
    
    # Encrypt message with AES
    aes_cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = aes_cipher.encrypt_and_digest(message.encode())
    
    return encrypted_aes_key, aes_cipher.nonce, ciphertext, tag

def hybrid_decrypt(rsa_private_key, encrypted_aes_key, nonce, ciphertext, tag):
    """Hybrid decryption: RSA + AES"""
    # Decrypt AES key with RSA
    rsa_cipher = PKCS1_OAEP.new(rsa_private_key)
    aes_key = rsa_cipher.decrypt(encrypted_aes_key)
    
    # Decrypt message with AES
    aes_cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    plaintext = aes_cipher.decrypt_and_verify(ciphertext, tag)
    
    return plaintext.decode()

# Usage
long_message = "This is a very long message that would be inefficient to encrypt directly with RSA"
encrypted_key, nonce, ciphertext, tag = hybrid_encrypt(public_key, long_message)
decrypted = hybrid_decrypt(private_key, encrypted_key, nonce, ciphertext, tag)
```

### Key Management
```python
def load_key_from_file(filename):
    """Load RSA key from PEM file"""
    with open(filename, "rb") as f:
        key_data = f.read()
    
    if b"PRIVATE" in key_data:
        return RSA.import_key(key_data)
    else:
        return RSA.import_key(key_data)

def export_key_to_pem(key, filename):
    """Export RSA key to PEM file"""
    with open(filename, "wb") as f:
        f.write(key.export_key())

def key_fingerprint(public_key):
    """Generate key fingerprint for identification"""
    import hashlib
    key_data = public_key.export_key()
    fingerprint = hashlib.sha256(key_data).hexdigest()
    return fingerprint[:16]  # First 16 characters
```

## Security Best Practices

### Secure Key Generation
```python
def secure_key_generation():
    """Secure RSA key generation practices"""
    print("Secure Key Generation Guidelines:")
    print("1. Use key size >= 2048 bits")
    print("2. Use public exponent e = 65537")
    print("3. Generate keys on secure hardware when possible")
    print("4. Store private keys securely")
    print("5. Use strong random number generators")
    print("6. Validate key parameters after generation")

def check_key_security(key):
    """Check RSA key security parameters"""
    issues = []
    
    if key.size_in_bits() < 2048:
        issues.append("Key size too small")
    
    if key.e == 3:
        issues.append("Public exponent e=3 may be vulnerable")
    
    if key.e != 65537:
        issues.append("Non-standard public exponent")
    
    return issues
```

### Padding Security
```python
def padding_security_guide():
    """RSA padding security guidelines"""
    print("RSA Padding Security:")
    print("✅ Use OAEP for encryption")
    print("✅ Use PSS for signatures")
    print("❌ Avoid PKCS#1 v1.5 for encryption")
    print("❌ Avoid raw RSA (no padding)")
    
    print("\nPadding Schemes:")
    print("- OAEP: Optimal Asymmetric Encryption Padding")
    print("- PSS: Probabilistic Signature Scheme")
    print("- PKCS#1 v1.5: Legacy padding (vulnerable)")
```

## Performance Considerations

### Performance Optimization
```python
import time

def benchmark_rsa_operations():
    """Benchmark RSA operations"""
    # Generate test key
    key = RSA.generate(2048)
    message = "Test message"
    
    # Benchmark encryption
    start_time = time.time()
    cipher = PKCS1_OAEP.new(key.publickey())
    cipher.encrypt(message.encode())
    encrypt_time = time.time() - start_time
    
    # Benchmark decryption
    ciphertext = cipher.encrypt(message.encode())
    start_time = time.time()
    cipher = PKCS1_OAEP.new(key)
    cipher.decrypt(ciphertext)
    decrypt_time = time.time() - start_time
    
    print(f"Encryption time: {encrypt_time*1000:.2f}ms")
    print(f"Decryption time: {decrypt_time*1000:.2f}ms")

def key_size_performance():
    """Compare performance across key sizes"""
    key_sizes = [1024, 2048, 3072, 4096]
    
    for size in key_sizes:
        start_time = time.time()
        key = RSA.generate(size)
        generation_time = time.time() - start_time
        
        print(f"{size}-bit key generation: {generation_time:.2f}s")
```

## Error Handling

### Exception Handling
```python
def safe_rsa_encrypt(public_key, message):
    """Safe RSA encryption with error handling"""
    try:
        cipher = PKCS1_OAEP.new(public_key)
        ciphertext = cipher.encrypt(message.encode())
        return ciphertext
    except ValueError as e:
        print(f"Encryption error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def safe_rsa_decrypt(private_key, ciphertext):
    """Safe RSA decryption with error handling"""
    try:
        cipher = PKCS1_OAEP.new(private_key)
        plaintext = cipher.decrypt(ciphertext)
        return plaintext.decode()
    except ValueError as e:
        print(f"Decryption error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
```

## Testing and Validation

### Test Vectors
```python
def test_rsa_operations():
    """Test RSA operations with known values"""
    # Generate test key
    key = RSA.generate(2048)
    
    # Test encryption/decryption
    message = "Test message"
    encrypted = rsa_encrypt(key.publickey(), message)
    decrypted = rsa_decrypt(key, encrypted)
    
    assert decrypted == message, "Encryption/decryption test failed"
    print("RSA encryption/decryption test passed")
    
    # Test digital signature
    signature = rsa_sign(key, message)
    is_valid = rsa_verify(key.publickey(), message, signature)
    
    assert is_valid, "Digital signature test failed"
    print("RSA digital signature test passed")
``` 