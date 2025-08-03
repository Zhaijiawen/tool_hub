# Ed25519 Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with Ed25519 libraries
- Understanding of elliptic curve cryptography
- Knowledge of digital signature concepts
- Awareness of Ed25519 security considerations

### Library Selection

#### PyNaCl (Python)
```bash
pip install pynacl
```

#### Node.js crypto (JavaScript)
```bash
# Built-in crypto module, no installation needed
```

#### libsodium (C/C++)
```bash
# Install libsodium
sudo apt-get install libsodium-dev  # Ubuntu/Debian
brew install libsodium              # macOS
```

#### Go crypto/ed25519
```bash
# Built-in Go standard library, no installation needed
```

## Basic Concepts

### Ed25519 Key Structure
```python
import nacl.signing

# Generate Ed25519 key pair
signing_key = nacl.signing.SigningKey.generate()
verify_key = signing_key.verify_key

# Key components
private_key_bytes = bytes(signing_key)
public_key_bytes = bytes(verify_key)

print(f"Private key size: {len(private_key_bytes)} bytes")
print(f"Public key size: {len(public_key_bytes)} bytes")
print(f"Private key: {private_key_bytes.hex()}")
print(f"Public key: {public_key_bytes.hex()}")
```

### Key Size and Format
```python
def key_information():
    """Ed25519 key information"""
    print("Ed25519 Key Information:")
    print("Private key: 32 bytes (256 bits)")
    print("Public key: 32 bytes (256 bits)")
    print("Signature: 64 bytes (512 bits)")
    print("Security level: ~128 bits")
    
    # Key format
    print("\nKey Format:")
    print("Private key: Raw 32-byte scalar")
    print("Public key: Compressed Edwards curve point")
    print("Signature: R (32 bytes) || s (32 bytes)")
```

## Key Generation

### Basic Key Generation
```python
import nacl.signing
import os

def generate_ed25519_key_pair():
    """Generate Ed25519 key pair"""
    # Generate random signing key
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    print("Generated Ed25519 key pair")
    print(f"Private key: {bytes(signing_key).hex()}")
    print(f"Public key: {bytes(verify_key).hex()}")
    
    return signing_key, verify_key

def save_key_pair(signing_key, verify_key, filename_prefix):
    """Save Ed25519 key pair to files"""
    # Save private key
    with open(f"{filename_prefix}_private.key", "wb") as f:
        f.write(bytes(signing_key))
    
    # Save public key
    with open(f"{filename_prefix}_public.key", "wb") as f:
        f.write(bytes(verify_key))
    
    print(f"Keys saved as {filename_prefix}_private.key and {filename_prefix}_public.key")
```

### Deterministic Key Generation
```python
def generate_deterministic_key(seed):
    """Generate Ed25519 key from seed"""
    if len(seed) < 32:
        # Pad seed to 32 bytes
        seed = seed.ljust(32, b'\x00')
    elif len(seed) > 32:
        # Truncate seed to 32 bytes
        seed = seed[:32]
    
    signing_key = nacl.signing.SigningKey(seed)
    verify_key = signing_key.verify_key
    
    print("Generated deterministic Ed25519 key pair")
    return signing_key, verify_key

# Example usage
seed = b"my_secret_seed_for_key_generation"
signing_key, verify_key = generate_deterministic_key(seed)
```

## Digital Signatures

### Basic Ed25519 Signing
```python
def ed25519_sign(signing_key, message):
    """Sign message using Ed25519"""
    # Sign the message
    signature = signing_key.sign(message.encode())
    
    return signature.signature

def ed25519_verify(verify_key, message, signature):
    """Verify Ed25519 signature"""
    try:
        # Create signed message object
        signed_message = nacl.signing.SignedMessage(message.encode() + signature)
        
        # Verify the signature
        verify_key.verify(signed_message)
        return True
    except nacl.exceptions.BadSignatureError:
        return False

# Usage example
signing_key, verify_key = generate_ed25519_key_pair()
message = "Hello, Ed25519 signing!"

signature = ed25519_sign(signing_key, message)
is_valid = ed25519_verify(verify_key, message, signature)

print(f"Message: {message}")
print(f"Signature: {signature.hex()}")
print(f"Valid: {is_valid}")
```

### Ed25519 with Different Message Types
```python
def sign_binary_data(signing_key, data):
    """Sign binary data using Ed25519"""
    signature = signing_key.sign(data)
    return signature.signature

def sign_file(signing_key, file_path):
    """Sign file using Ed25519"""
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    signature = signing_key.sign(file_data)
    return signature.signature

def verify_file(verify_key, file_path, signature):
    """Verify file signature using Ed25519"""
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    try:
        signed_message = nacl.signing.SignedMessage(file_data + signature)
        verify_key.verify(signed_message)
        return True
    except nacl.exceptions.BadSignatureError:
        return False
```

## Advanced Usage

### Batch Signature Verification
```python
def batch_verify_signatures(verify_keys, messages, signatures):
    """Verify multiple signatures efficiently"""
    results = []
    
    for i, (verify_key, message, signature) in enumerate(zip(verify_keys, messages, signatures)):
        try:
            signed_message = nacl.signing.SignedMessage(message.encode() + signature)
            verify_key.verify(signed_message)
            results.append(True)
        except nacl.exceptions.BadSignatureError:
            results.append(False)
    
    return results

# Example batch verification
messages = ["Message 1", "Message 2", "Message 3"]
signatures = []
verify_keys = []

for i, message in enumerate(messages):
    signing_key, verify_key = generate_ed25519_key_pair()
    signature = ed25519_sign(signing_key, message)
    
    signatures.append(signature)
    verify_keys.append(verify_key)

# Batch verify all signatures
results = batch_verify_signatures(verify_keys, messages, signatures)
print(f"Batch verification results: {results}")
```

### Key Derivation
```python
import hashlib

def derive_ed25519_key(password, salt=None):
    """Derive Ed25519 key from password"""
    if salt is None:
        salt = os.urandom(16)
    
    # Use PBKDF2 to derive key material
    key_material = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, 32)
    
    # Generate Ed25519 key from derived material
    signing_key = nacl.signing.SigningKey(key_material)
    verify_key = signing_key.verify_key
    
    return signing_key, verify_key, salt

# Example key derivation
password = "my_secure_password"
signing_key, verify_key, salt = derive_ed25519_key(password)
print(f"Derived key from password with salt: {salt.hex()}")
```

## Security Best Practices

### Secure Key Generation
```python
def secure_key_generation():
    """Secure Ed25519 key generation practices"""
    print("Secure Key Generation Guidelines:")
    print("1. Use cryptographically secure random number generator")
    print("2. Generate keys on secure hardware when possible")
    print("3. Store private keys securely")
    print("4. Use deterministic generation for reproducible keys")
    print("5. Validate key parameters after generation")
    print("6. Never reuse private keys across applications")

def check_key_security(signing_key):
    """Check Ed25519 key security parameters"""
    private_key_bytes = bytes(signing_key)
    
    # Check key size
    if len(private_key_bytes) != 32:
        return False, "Invalid private key size"
    
    # Check for weak keys (all zeros, all ones, etc.)
    if private_key_bytes == b'\x00' * 32:
        return False, "Weak private key (all zeros)"
    
    if private_key_bytes == b'\xff' * 32:
        return False, "Weak private key (all ones)"
    
    return True, "Key security check passed"
```

### Deterministic Signatures
```python
def deterministic_signature_properties():
    """Ed25519 deterministic signature properties"""
    print("Ed25519 Deterministic Signatures:")
    print("✅ Same message and key always produce same signature")
    print("✅ No random number generation required")
    print("✅ Eliminates random number vulnerabilities")
    print("✅ Reproducible for testing and verification")
    print("✅ Side-channel resistant")
    
    # Demonstrate determinism
    signing_key, verify_key = generate_ed25519_key_pair()
    message = "Test message"
    
    signature1 = ed25519_sign(signing_key, message)
    signature2 = ed25519_sign(signing_key, message)
    
    print(f"\nDeterministic signatures identical: {signature1 == signature2}")
```

## Performance Considerations

### Performance Optimization
```python
import time

def benchmark_ed25519_operations():
    """Benchmark Ed25519 operations"""
    # Generate test key
    signing_key, verify_key = generate_ed25519_key_pair()
    message = "Benchmark test message"
    
    # Benchmark signing
    start_time = time.time()
    for _ in range(1000):
        signature = ed25519_sign(signing_key, message)
    signing_time = time.time() - start_time
    
    # Benchmark verification
    start_time = time.time()
    for _ in range(1000):
        is_valid = ed25519_verify(verify_key, message, signature)
    verification_time = time.time() - start_time
    
    print(f"Signing: {signing_time/1000*1000:.2f}ms per signature")
    print(f"Verification: {verification_time/1000*1000:.2f}ms per verification")

# Run benchmark
benchmark_ed25519_operations()
```

### Memory Usage Analysis
```python
import sys

def analyze_memory_usage():
    """Analyze Ed25519 memory usage"""
    # Measure memory before key generation
    initial_memory = sys.getsizeof(object())
    
    # Generate multiple key pairs
    keys = []
    for i in range(100):
        signing_key, verify_key = generate_ed25519_key_pair()
        keys.append((signing_key, verify_key))
    
    # Measure memory after key generation
    final_memory = sys.getsizeof(keys)
    memory_per_key = (final_memory - initial_memory) / 100
    
    print(f"Memory usage per key pair: {memory_per_key:.2f} bytes")
    print(f"Total memory for 100 keys: {final_memory - initial_memory:.2f} bytes")
```

## Error Handling

### Exception Handling
```python
def safe_ed25519_sign(signing_key, message):
    """Safe Ed25519 signing with error handling"""
    try:
        signature = ed25519_sign(signing_key, message)
        return signature
    except Exception as e:
        print(f"Signing error: {e}")
        return None

def safe_ed25519_verify(verify_key, message, signature):
    """Safe Ed25519 verification with error handling"""
    try:
        is_valid = ed25519_verify(verify_key, message, signature)
        return is_valid
    except Exception as e:
        print(f"Verification error: {e}")
        return False

# Test safe operations
message = "Safe operation test"
signature = safe_ed25519_sign(signing_key, message)
if signature:
    is_valid = safe_ed25519_verify(verify_key, message, signature)
    print(f"Safe operation result: {is_valid}")
```

## Testing and Validation

### Test Vectors
```python
def test_ed25519_operations():
    """Test Ed25519 operations with known values"""
    # Generate test key
    signing_key, verify_key = generate_ed25519_key_pair()
    
    # Test signing/verification
    message = "Test message"
    signature = ed25519_sign(signing_key, message)
    is_valid = ed25519_verify(verify_key, message, signature)
    
    assert is_valid, "Ed25519 signature test failed"
    print("Ed25519 signature test passed")
    
    # Test with different message
    different_message = "Different message"
    is_valid = ed25519_verify(verify_key, different_message, signature)
    
    assert not is_valid, "Ed25519 verification should fail for different message"
    print("Ed25519 verification test passed")

# Run tests
test_ed25519_operations()
```

### Key Validation
```python
def validate_ed25519_key(signing_key):
    """Validate Ed25519 key parameters"""
    # Check private key
    private_key_bytes = bytes(signing_key)
    if len(private_key_bytes) != 32:
        return False, "Invalid private key size"
    
    # Check public key
    verify_key = signing_key.verify_key
    public_key_bytes = bytes(verify_key)
    if len(public_key_bytes) != 32:
        return False, "Invalid public key size"
    
    # Check signature size
    test_message = b"test"
    signature = signing_key.sign(test_message).signature
    if len(signature) != 64:
        return False, "Invalid signature size"
    
    return True, "Ed25519 key validation passed"
``` 