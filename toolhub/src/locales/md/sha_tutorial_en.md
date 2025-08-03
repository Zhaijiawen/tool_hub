# SHA Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with SHA cryptographic libraries
- Understanding of hash function concepts
- Knowledge of cryptographic security principles
- Awareness of SHA algorithm variants and their use cases

### Library Selection

#### Python - hashlib and cryptography
```bash
# Built-in hashlib for basic SHA functions
# pip install cryptography  # For additional SHA features
```

#### Node.js crypto (JavaScript)
```bash
# Built-in crypto module supports SHA functions
npm install crypto-js  # For additional SHA features
```

#### OpenSSL (C/C++)
```bash
# Install OpenSSL with SHA support
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

#### Java - Built-in and Bouncy Castle
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

## Basic Concepts

### SHA Algorithm Selection
```python
import hashlib

def sha_algorithm_guide():
    """Guide for selecting SHA algorithms"""
    print("SHA Algorithm Selection Guide:")
    print("SHA-1: 160-bit output, deprecated (broken)")
    print("SHA-256: 256-bit output, widely used, secure")
    print("SHA-384: 384-bit output, higher security")
    print("SHA-512: 512-bit output, highest security")
    print("SHA-3: Variable output, quantum-resistant")
    
    # Security recommendations
    recommendations = {
        "SHA-1": "Avoid - broken",
        "SHA-256": "Recommended for most applications",
        "SHA-384": "High security requirements",
        "SHA-512": "Maximum security",
        "SHA-3": "Future-proof, quantum-resistant"
    }
    
    return recommendations
```

### Hash Function Properties
```python
def demonstrate_hash_properties():
    """Demonstrate SHA hash function properties"""
    message1 = "Hello, World!"
    message2 = "Hello, World"  # Slightly different
    
    # Same input produces same output
    hash1 = hashlib.sha256(message1.encode()).hexdigest()
    hash2 = hashlib.sha256(message1.encode()).hexdigest()
    print(f"Deterministic: {hash1 == hash2}")
    
    # Small change produces large difference
    hash3 = hashlib.sha256(message2.encode()).hexdigest()
    print(f"Avalanche effect: {hash1 != hash3}")
    print(f"Original: {hash1}")
    print(f"Modified: {hash3}")
```

## Basic Hash Operations

### Simple Hashing
```python
import hashlib

def hash_string(message, algorithm="sha256"):
    """Hash a string using specified SHA algorithm"""
    if algorithm == "sha1":
        return hashlib.sha1(message.encode()).hexdigest()
    elif algorithm == "sha256":
        return hashlib.sha256(message.encode()).hexdigest()
    elif algorithm == "sha384":
        return hashlib.sha384(message.encode()).hexdigest()
    elif algorithm == "sha512":
        return hashlib.sha512(message.encode()).hexdigest()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

def hash_file(filename, algorithm="sha256"):
    """Hash a file using specified SHA algorithm"""
    hash_obj = hashlib.new(algorithm)
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

# Usage examples
message = "Hello, SHA!"
hash_value = hash_string(message, "sha256")
print(f"Hash of '{message}': {hash_value}")

# File hashing
# file_hash = hash_file("document.txt", "sha256")
# print(f"File hash: {file_hash}")
```

### JavaScript Implementation
```javascript
const crypto = require('crypto');

function hashString(message, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(message).digest('hex');
}

function hashFile(filename, algorithm = 'sha256') {
    const fs = require('fs');
    const hash = crypto.createHash(algorithm);
    
    const data = fs.readFileSync(filename);
    hash.update(data);
    
    return hash.digest('hex');
}

// Usage examples
const message = "Hello, SHA!";
const hashValue = hashString(message, 'sha256');
console.log(`Hash of '${message}': ${hashValue}`);

// File hashing
// const fileHash = hashFile('document.txt', 'sha256');
// console.log(`File hash: ${fileHash}`);
```

## Advanced Usage

### HMAC (Hash-based Message Authentication Code)
```python
import hashlib
import hmac
import os

def create_hmac(message, key, algorithm="sha256"):
    """Create HMAC using SHA algorithm"""
    if isinstance(key, str):
        key = key.encode()
    if isinstance(message, str):
        message = message.encode()
    
    return hmac.new(key, message, getattr(hashlib, algorithm)).hexdigest()

def verify_hmac(message, key, signature, algorithm="sha256"):
    """Verify HMAC signature"""
    expected_signature = create_hmac(message, key, algorithm)
    return hmac.compare_digest(signature, expected_signature)

def hmac_example():
    """HMAC usage example"""
    message = "Important message"
    key = os.urandom(32)  # 256-bit key
    
    # Create HMAC
    signature = create_hmac(message, key, "sha256")
    print(f"Message: {message}")
    print(f"HMAC: {signature}")
    
    # Verify HMAC
    is_valid = verify_hmac(message, key, signature, "sha256")
    print(f"Signature valid: {is_valid}")
    
    return signature
```

### Password Hashing with Salt
```python
import hashlib
import os
import base64

def hash_password(password, salt=None, algorithm="sha256"):
    """Hash password with salt using SHA"""
    if salt is None:
        salt = os.urandom(16)
    
    if isinstance(password, str):
        password = password.encode()
    
    # Combine password and salt
    salted_password = password + salt
    
    # Hash the combination
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(salted_password)
    hashed = hash_obj.digest()
    
    # Return salt and hash
    return base64.b64encode(salt).decode(), base64.b64encode(hashed).decode()

def verify_password(password, salt, stored_hash, algorithm="sha256"):
    """Verify password against stored hash"""
    salt_bytes = base64.b64decode(salt)
    stored_hash_bytes = base64.b64decode(stored_hash)
    
    # Hash the provided password with the same salt
    computed_salt, computed_hash = hash_password(password, salt_bytes, algorithm)
    computed_hash_bytes = base64.b64decode(computed_hash)
    
    # Compare hashes
    return hmac.compare_digest(stored_hash_bytes, computed_hash_bytes)

def password_hashing_example():
    """Password hashing example"""
    password = "mySecurePassword123"
    
    # Hash password
    salt, hashed = hash_password(password, algorithm="sha256")
    print(f"Password: {password}")
    print(f"Salt: {salt}")
    print(f"Hashed: {hashed}")
    
    # Verify password
    is_valid = verify_password(password, salt, hashed, "sha256")
    print(f"Password valid: {is_valid}")
    
    return salt, hashed
```

## Key Derivation Functions

### PBKDF2 with SHA
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

def derive_key_from_password(password, salt=None, iterations=100000, key_length=32):
    """Derive key from password using PBKDF2 with SHA-256"""
    if salt is None:
        salt = os.urandom(16)
    
    if isinstance(password, str):
        password = password.encode()
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=key_length,
        salt=salt,
        iterations=iterations,
    )
    
    key = kdf.derive(password)
    return salt, key

def verify_derived_key(password, salt, key, iterations=100000, key_length=32):
    """Verify derived key"""
    if isinstance(password, str):
        password = password.encode()
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=key_length,
        salt=salt,
        iterations=iterations,
    )
    
    try:
        kdf.verify(password, key)
        return True
    except:
        return False

def pbkdf2_example():
    """PBKDF2 key derivation example"""
    password = "mySecretPassword"
    
    # Derive key
    salt, key = derive_key_from_password(password, iterations=100000)
    print(f"Password: {password}")
    print(f"Salt: {salt.hex()}")
    print(f"Derived key: {key.hex()}")
    
    # Verify key
    is_valid = verify_derived_key(password, salt, key)
    print(f"Key verification: {is_valid}")
    
    return salt, key
```

### HKDF with SHA
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import os

def derive_keys_with_hkdf(secret, salt=None, info=b"", key_length=32):
    """Derive keys using HKDF with SHA-256"""
    if salt is None:
        salt = os.urandom(16)
    
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=key_length,
        salt=salt,
        info=info,
    )
    
    key = hkdf.derive(secret)
    return salt, key

def hkdf_example():
    """HKDF key derivation example"""
    # Generate a secret (e.g., from ECDH key exchange)
    secret = os.urandom(32)
    info = b"application-specific-info"
    
    # Derive keys
    salt, key1 = derive_keys_with_hkdf(secret, info=b"encryption-key")
    _, key2 = derive_keys_with_hkdf(secret, salt=salt, info=b"authentication-key")
    
    print(f"Secret: {secret.hex()}")
    print(f"Encryption key: {key1.hex()}")
    print(f"Authentication key: {key2.hex()}")
    
    return key1, key2
```

## Digital Signatures

### SHA in Digital Signatures
```python
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import hashlib

def create_digital_signature(message, private_key, algorithm="sha256"):
    """Create digital signature using SHA"""
    if isinstance(message, str):
        message = message.encode()
    
    # Choose hash algorithm
    if algorithm == "sha256":
        hash_algorithm = hashes.SHA256()
    elif algorithm == "sha384":
        hash_algorithm = hashes.SHA384()
    elif algorithm == "sha512":
        hash_algorithm = hashes.SHA512()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    # Create signature
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hash_algorithm),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hash_algorithm
    )
    
    return signature

def verify_digital_signature(message, signature, public_key, algorithm="sha256"):
    """Verify digital signature using SHA"""
    if isinstance(message, str):
        message = message.encode()
    
    # Choose hash algorithm
    if algorithm == "sha256":
        hash_algorithm = hashes.SHA256()
    elif algorithm == "sha384":
        hash_algorithm = hashes.SHA384()
    elif algorithm == "sha512":
        hash_algorithm = hashes.SHA512()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hash_algorithm),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hash_algorithm
        )
        return True
    except:
        return False

def digital_signature_example():
    """Digital signature example"""
    # Generate key pair
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    public_key = private_key.public_key()
    
    # Create signature
    message = "Important document content"
    signature = create_digital_signature(message, private_key, "sha256")
    print(f"Message: {message}")
    print(f"Signature: {signature.hex()}")
    
    # Verify signature
    is_valid = verify_digital_signature(message, signature, public_key, "sha256")
    print(f"Signature valid: {is_valid}")
    
    return signature
```

## Performance and Security

### Performance Benchmarking
```python
import time
import hashlib

def benchmark_sha_algorithms():
    """Benchmark different SHA algorithms"""
    message = "Test message for benchmarking" * 1000  # 25KB
    
    algorithms = ["sha1", "sha256", "sha384", "sha512"]
    
    for algorithm in algorithms:
        start_time = time.time()
        
        # Hash multiple times for accurate measurement
        for _ in range(1000):
            hashlib.new(algorithm).update(message.encode()).hexdigest()
        
        end_time = time.time()
        total_time = end_time - start_time
        avg_time = total_time / 1000
        
        print(f"{algorithm.upper()}: {avg_time*1000:.2f}ms per hash")
    
    return algorithms

def security_recommendations():
    """Security recommendations for SHA usage"""
    print("SHA Security Recommendations:")
    print("✅ Use SHA-256 for general purpose applications")
    print("✅ Use SHA-384 or SHA-512 for high security requirements")
    print("✅ Use SHA-3 for future-proof applications")
    print("❌ Avoid SHA-1 (broken)")
    print("❌ Don't use SHA for password storage (use bcrypt, Argon2)")
    print("✅ Always use salt with password hashing")
    print("✅ Use HMAC for message authentication")
    print("✅ Use PBKDF2 or HKDF for key derivation")
```

## Error Handling

### Safe SHA Operations
```python
import hashlib

def safe_hash_operation(message, algorithm="sha256"):
    """Safe hash operation with error handling"""
    try:
        if isinstance(message, str):
            message = message.encode()
        
        hash_obj = hashlib.new(algorithm)
        hash_obj.update(message)
        return hash_obj.hexdigest()
        
    except ValueError as e:
        print(f"Invalid algorithm: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def validate_sha_parameters(algorithm):
    """Validate SHA algorithm parameters"""
    valid_algorithms = ["sha1", "sha256", "sha384", "sha512"]
    
    if algorithm not in valid_algorithms:
        raise ValueError(f"Invalid algorithm: {algorithm}")
    
    if algorithm == "sha1":
        print("Warning: SHA-1 is deprecated and broken")
    
    return True

def error_handling_example():
    """Error handling example"""
    # Test valid operations
    result = safe_hash_operation("test message", "sha256")
    print(f"Valid operation: {result}")
    
    # Test invalid algorithm
    result = safe_hash_operation("test message", "invalid")
    print(f"Invalid algorithm result: {result}")
    
    # Test parameter validation
    try:
        validate_sha_parameters("sha1")
    except ValueError as e:
        print(f"Validation error: {e}")
    
    return result
```

## Testing and Validation

### Test Vectors
```python
def test_sha_vectors():
    """Test SHA with known test vectors"""
    # SHA-256 test vector
    test_message = "abc"
    expected_hash = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    
    computed_hash = hashlib.sha256(test_message.encode()).hexdigest()
    
    if computed_hash == expected_hash:
        print("SHA-256 test vector passed")
    else:
        print("SHA-256 test vector failed")
        print(f"Expected: {expected_hash}")
        print(f"Computed: {computed_hash}")
    
    return computed_hash == expected_hash

# Run all examples
if __name__ == "__main__":
    print("SHA Usage Tutorial Examples")
    print("=" * 40)
    
    # Basic examples
    sha_algorithm_guide()
    demonstrate_hash_properties()
    
    # Advanced examples
    hmac_example()
    password_hashing_example()
    pbkdf2_example()
    hkdf_example()
    digital_signature_example()
    
    # Performance and security
    benchmark_sha_algorithms()
    security_recommendations()
    
    # Error handling
    error_handling_example()
    
    # Testing
    test_sha_vectors()
``` 