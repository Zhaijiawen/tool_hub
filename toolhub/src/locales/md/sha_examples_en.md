# SHA Code Examples

## Basic Hash Operations

### Simple String Hashing
```python
import hashlib

# Basic SHA-256 hashing
message = "Hello, World!"
hash_sha256 = hashlib.sha256(message.encode()).hexdigest()
print(f"SHA-256: {hash_sha256}")

# SHA-1 (deprecated)
hash_sha1 = hashlib.sha1(message.encode()).hexdigest()
print(f"SHA-1: {hash_sha1}")

# SHA-384
hash_sha384 = hashlib.sha384(message.encode()).hexdigest()
print(f"SHA-384: {hash_sha384}")

# SHA-512
hash_sha512 = hashlib.sha512(message.encode()).hexdigest()
print(f"SHA-512: {hash_sha512}")
```

### File Hashing
```python
import hashlib

def hash_file_sha256(filename):
    """Hash a file using SHA-256"""
    hash_obj = hashlib.sha256()
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

# Example usage
# file_hash = hash_file_sha256("document.txt")
# print(f"File SHA-256: {file_hash}")
```

### Multiple Hash Algorithms
```python
import hashlib

def hash_with_multiple_algorithms(data, algorithms=None):
    """Hash data with multiple SHA algorithms"""
    if algorithms is None:
        algorithms = ['sha1', 'sha256', 'sha384', 'sha512']
    
    results = {}
    for algo in algorithms:
        hash_obj = hashlib.new(algo)
        hash_obj.update(data.encode())
        results[algo] = hash_obj.hexdigest()
    
    return results

# Example
message = "Test message"
hashes = hash_with_multiple_algorithms(message)
for algo, hash_value in hashes.items():
    print(f"{algo.upper()}: {hash_value}")
```

## Advanced Usage

### HMAC Implementation
```python
import hashlib
import hmac
import os

def create_hmac_sha256(message, key):
    """Create HMAC-SHA256"""
    if isinstance(key, str):
        key = key.encode()
    if isinstance(message, str):
        message = message.encode()
    
    return hmac.new(key, message, hashlib.sha256).hexdigest()

def verify_hmac_sha256(message, key, signature):
    """Verify HMAC-SHA256 signature"""
    expected = create_hmac_sha256(message, key)
    return hmac.compare_digest(signature, expected)

# Example
message = "Important data"
key = os.urandom(32)
signature = create_hmac_sha256(message, key)
is_valid = verify_hmac_sha256(message, key, signature)
print(f"HMAC valid: {is_valid}")
```

### Password Hashing with Salt
```python
import hashlib
import os
import base64

def hash_password_sha256(password, salt=None):
    """Hash password with SHA-256 and salt"""
    if salt is None:
        salt = os.urandom(16)
    
    if isinstance(password, str):
        password = password.encode()
    
    # Combine password and salt
    salted = password + salt
    hash_obj = hashlib.sha256()
    hash_obj.update(salted)
    
    return base64.b64encode(salt).decode(), base64.b64encode(hash_obj.digest()).decode()

def verify_password_sha256(password, salt, stored_hash):
    """Verify password against stored hash"""
    salt_bytes = base64.b64decode(salt)
    stored_bytes = base64.b64decode(stored_hash)
    
    computed_salt, computed_hash = hash_password_sha256(password, salt_bytes)
    computed_bytes = base64.b64decode(computed_hash)
    
    return hmac.compare_digest(stored_bytes, computed_bytes)

# Example
password = "mySecurePassword123"
salt, hashed = hash_password_sha256(password)
is_valid = verify_password_sha256(password, salt, hashed)
print(f"Password valid: {is_valid}")
```

### Key Derivation with PBKDF2
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

def derive_key_pbkdf2(password, salt=None, iterations=100000, key_length=32):
    """Derive key using PBKDF2 with SHA-256"""
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

def verify_pbkdf2_key(password, salt, key, iterations=100000, key_length=32):
    """Verify PBKDF2 derived key"""
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

# Example
password = "mySecretPassword"
salt, key = derive_key_pbkdf2(password, iterations=100000)
is_valid = verify_pbkdf2_key(password, salt, key)
print(f"Key verification: {is_valid}")
```

## Digital Signatures

### SHA in RSA Signatures
```python
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import hashlib

def create_rsa_signature_sha256(message, private_key):
    """Create RSA signature using SHA-256"""
    if isinstance(message, str):
        message = message.encode()
    
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    return signature

def verify_rsa_signature_sha256(message, signature, public_key):
    """Verify RSA signature using SHA-256"""
    if isinstance(message, str):
        message = message.encode()
    
    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except:
        return False

# Example
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()

message = "Important document"
signature = create_rsa_signature_sha256(message, private_key)
is_valid = verify_rsa_signature_sha256(message, signature, public_key)
print(f"RSA signature valid: {is_valid}")
```

## Performance Testing

### Hash Performance Benchmark
```python
import time
import hashlib

def benchmark_sha_performance():
    """Benchmark SHA algorithm performance"""
    test_data = "Test data for benchmarking" * 1000  # ~25KB
    
    algorithms = ['sha1', 'sha256', 'sha384', 'sha512']
    results = {}
    
    for algo in algorithms:
        start_time = time.time()
        
        # Hash multiple times for accurate measurement
        for _ in range(1000):
            hashlib.new(algo).update(test_data.encode()).hexdigest()
        
        end_time = time.time()
        avg_time = (end_time - start_time) / 1000 * 1000  # Convert to milliseconds
        results[algo] = avg_time
    
    return results

# Example
performance = benchmark_sha_performance()
for algo, time_ms in performance.items():
    print(f"{algo.upper()}: {time_ms:.2f}ms per hash")
```

## Security Applications

### File Integrity Verification
```python
import hashlib
import json

def create_file_checksum(filename, algorithm="sha256"):
    """Create checksum for file integrity"""
    hash_obj = hashlib.new(algorithm)
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

def verify_file_integrity(filename, expected_hash, algorithm="sha256"):
    """Verify file integrity against expected hash"""
    actual_hash = create_file_checksum(filename, algorithm)
    return hmac.compare_digest(actual_hash, expected_hash)

def save_checksums(files, algorithm="sha256"):
    """Save checksums for multiple files"""
    checksums = {}
    for filename in files:
        checksums[filename] = create_file_checksum(filename, algorithm)
    
    with open("checksums.json", "w") as f:
        json.dump(checksums, f, indent=2)
    
    return checksums

# Example usage
# files = ["document1.txt", "document2.txt", "image.jpg"]
# checksums = save_checksums(files)
# print("Checksums saved to checksums.json")
```

### Secure Random Hash Generation
```python
import hashlib
import os
import secrets

def generate_secure_hash(data=None, algorithm="sha256"):
    """Generate secure hash with optional random data"""
    if data is None:
        data = secrets.token_hex(32)
    
    if isinstance(data, str):
        data = data.encode()
    
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(data)
    
    return hash_obj.hexdigest()

def generate_nonce_hash(nonce_length=16, algorithm="sha256"):
    """Generate hash-based nonce"""
    nonce = secrets.token_hex(nonce_length)
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(nonce.encode())
    
    return nonce, hash_obj.hexdigest()

# Example
secure_hash = generate_secure_hash()
nonce, nonce_hash = generate_nonce_hash()
print(f"Secure hash: {secure_hash}")
print(f"Nonce: {nonce}")
print(f"Nonce hash: {nonce_hash}")
```

## Error Handling

### Safe Hash Operations
```python
import hashlib

def safe_hash_operation(data, algorithm="sha256"):
    """Safe hash operation with error handling"""
    try:
        if isinstance(data, str):
            data = data.encode()
        
        hash_obj = hashlib.new(algorithm)
        hash_obj.update(data)
        return hash_obj.hexdigest()
        
    except ValueError as e:
        print(f"Invalid algorithm '{algorithm}': {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def validate_hash_algorithm(algorithm):
    """Validate hash algorithm"""
    valid_algorithms = ['sha1', 'sha256', 'sha384', 'sha512']
    
    if algorithm not in valid_algorithms:
        raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    if algorithm == 'sha1':
        print("Warning: SHA-1 is deprecated and broken")
    
    return True

# Example
result = safe_hash_operation("test data", "sha256")
print(f"Valid hash: {result}")

result = safe_hash_operation("test data", "invalid")
print(f"Invalid algorithm result: {result}")

try:
    validate_hash_algorithm("sha1")
except ValueError as e:
    print(f"Validation error: {e}")
```

## Testing and Validation

### Hash Test Vectors
```python
def test_sha_vectors():
    """Test SHA with known test vectors"""
    test_cases = [
        ("", "sha256", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
        ("abc", "sha256", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"),
        ("Hello, World!", "sha256", "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f")
    ]
    
    results = []
    for message, algorithm, expected in test_cases:
        computed = hashlib.new(algorithm).update(message.encode()).hexdigest()
        passed = computed == expected
        results.append((message, algorithm, passed, computed, expected))
        
        status = "PASS" if passed else "FAIL"
        print(f"{status}: {algorithm.upper()}('{message}')")
        if not passed:
            print(f"  Expected: {expected}")
            print(f"  Computed: {computed}")
    
    return results

# Run tests
test_results = test_sha_vectors()
passed = sum(1 for _, _, passed, _, _ in test_results if passed)
total = len(test_results)
print(f"\nTest Results: {passed}/{total} passed")
```

## JavaScript Examples

### Node.js SHA Implementation
```javascript
const crypto = require('crypto');

// Basic SHA-256 hashing
function hashString(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
}

// File hashing
function hashFile(filename, algorithm = 'sha256') {
    const fs = require('fs');
    const hash = crypto.createHash(algorithm);
    const data = fs.readFileSync(filename);
    hash.update(data);
    return hash.digest('hex');
}

// HMAC creation
function createHmac(data, key, algorithm = 'sha256') {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
}

// Example usage
const message = "Hello, World!";
const hash = hashString(message);
const hmac = createHmac(message, "secret-key");
console.log(`Hash: ${hash}`);
console.log(`HMAC: ${hmac}`);
```

## Summary

These examples demonstrate:
- Basic SHA hash operations for strings and files
- Advanced usage with HMAC and password hashing
- Key derivation using PBKDF2
- Digital signatures with RSA
- Performance benchmarking
- Security applications for file integrity
- Error handling and validation
- Testing with known test vectors
- JavaScript implementations

All examples follow security best practices and use appropriate algorithms for their intended purposes. 