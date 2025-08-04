# X25519 Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with X25519 library support
- Understanding of elliptic curve cryptography
- Knowledge of key exchange protocols
- Familiarity with Curve25519 and Montgomery curves

### Library Selection

#### Python - cryptography
```bash
# Install cryptography library
pip install cryptography
```

#### Node.js - crypto
```bash
# Built-in crypto module supports X25519
# No additional installation required
```

#### Go - crypto/curve25519
```go
// Built-in crypto/curve25519 package
import "crypto/curve25519"
```

#### Rust - x25519-dalek
```toml
[dependencies]
x25519-dalek = "2.0"
```

## Basic Concepts

### X25519 vs Traditional ECDH
```python
def explain_x25519_advantages():
    """Explain X25519 advantages over traditional ECDH"""
    advantages = {
        "Performance": "Faster scalar multiplication using Montgomery ladder",
        "Security": "Constant-time operations prevent timing attacks",
        "Simplicity": "Cleaner implementation with fewer edge cases",
        "Standardization": "RFC 7748 standardized, widely adopted",
        "Key Size": "32-byte keys (smaller than many ECDH curves)"
    }
    
    for aspect, description in advantages.items():
        print(f"{aspect}: {description}")
    
    return advantages
```

### Key Format Understanding
```python
def key_format_explanation():
    """Explain X25519 key formats"""
    print("X25519 Key Formats:")
    print("Private Key: 32-byte random scalar")
    print("Public Key: 32-byte x-coordinate of curve point")
    print("Shared Secret: 32-byte x-coordinate of shared point")
    print("All keys are raw bytes, not PEM/DER encoded")
```

## Basic Key Exchange

### Simple X25519 Exchange
```python
from cryptography.hazmat.primitives.asymmetric import x25519
import os

def basic_x25519_exchange():
    """Basic X25519 key exchange example"""
    # Generate private keys for both parties
    private_key_alice = x25519.X25519PrivateKey.generate()
    private_key_bob = x25519.X25519PrivateKey.generate()
    
    # Get public keys
    public_key_alice = private_key_alice.public_key()
    public_key_bob = private_key_bob.public_key()
    
    # Exchange public keys (in real scenario, over network)
    print(f"Alice's public key: {public_key_alice.public_bytes().hex()}")
    print(f"Bob's public key: {public_key_bob.public_bytes().hex()}")
    
    # Compute shared secrets
    shared_secret_alice = private_key_alice.exchange(public_key_bob)
    shared_secret_bob = private_key_bob.exchange(public_key_alice)
    
    # Verify both secrets are identical
    assert shared_secret_alice == shared_secret_bob
    print(f"Shared secret (32 bytes): {shared_secret_alice.hex()}")
    
    return shared_secret_alice

# Run example
basic_x25519_exchange()
```

### Key Generation and Validation
```python
def key_generation_and_validation():
    """Demonstrate X25519 key generation and validation"""
    # Generate private key
    private_key = x25519.X25519PrivateKey.generate()
    
    # Get public key
    public_key = private_key.public_key()
    
    # Validate key sizes
    private_bytes = private_key.private_bytes(
        encoding=None,
        format=None,
        encryption_algorithm=None
    )
    public_bytes = public_key.public_bytes(
        encoding=None,
        format=None
    )
    
    print(f"Private key size: {len(private_bytes)} bytes")
    print(f"Public key size: {len(public_bytes)} bytes")
    
    # Validate they are 32 bytes each
    assert len(private_bytes) == 32, "Private key must be 32 bytes"
    assert len(public_bytes) == 32, "Public key must be 32 bytes"
    
    return private_key, public_key
```

## Advanced Usage

### Key Derivation
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

def derive_keys_from_x25519_secret(shared_secret, salt=None):
    """Derive multiple keys from X25519 shared secret using HKDF"""
    if salt is None:
        salt = os.urandom(16)
    
    # Derive encryption key
    encryption_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=b"encryption_key",
    ).derive(shared_secret)
    
    # Derive authentication key
    auth_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=b"auth_key",
    ).derive(shared_secret)
    
    # Derive MAC key
    mac_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=b"mac_key",
    ).derive(shared_secret)
    
    return {
        "encryption_key": encryption_key,
        "auth_key": auth_key,
        "mac_key": mac_key,
        "salt": salt
    }

# Example usage
shared_secret = basic_x25519_exchange()
derived_keys = derive_keys_from_x25519_secret(shared_secret)
print(f"Derived encryption key: {derived_keys['encryption_key'].hex()}")
```

### Perfect Forward Secrecy
```python
class X25519Session:
    def __init__(self):
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None
    
    def generate_ephemeral_keys(self):
        """Generate new ephemeral keys for this session"""
        self.ephemeral_private_key = x25519.X25519PrivateKey.generate()
        self.ephemeral_public_key = self.ephemeral_private_key.public_key()
        return self.ephemeral_public_key
    
    def compute_shared_secret(self, other_public_key):
        """Compute shared secret with other party's public key"""
        self.shared_secret = self.ephemeral_private_key.exchange(other_public_key)
        return self.shared_secret
    
    def clear_session_data(self):
        """Clear session data for forward secrecy"""
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None

# Example of perfect forward secrecy
def perfect_forward_secrecy_example():
    """Demonstrate perfect forward secrecy with X25519"""
    # Alice and Bob create sessions
    alice_session = X25519Session()
    bob_session = X25519Session()
    
    # Generate ephemeral keys
    alice_public = alice_session.generate_ephemeral_keys()
    bob_public = bob_session.generate_ephemeral_keys()
    
    # Exchange public keys and compute shared secret
    alice_secret = alice_session.compute_shared_secret(bob_public)
    bob_secret = bob_session.compute_shared_secret(alice_public)
    
    assert alice_secret == bob_secret
    print(f"Session shared secret: {alice_secret.hex()}")
    
    # Clear session data for forward secrecy
    alice_session.clear_session_data()
    bob_session.clear_session_data()
    
    return alice_secret
```

## Security Best Practices

### Key Validation
```python
def validate_x25519_public_key(public_key_bytes):
    """Validate received X25519 public key"""
    try:
        # Check key size
        if len(public_key_bytes) != 32:
            return False, "Public key must be 32 bytes"
        
        # Check for all-zero key (invalid)
        if all(b == 0 for b in public_key_bytes):
            return False, "Public key cannot be all zeros"
        
        # Check for small-order points (simplified)
        # In practice, use a proper library for this validation
        if public_key_bytes == b'\x00' * 32:
            return False, "Public key is point at infinity"
        
        return True, "Public key is valid"
        
    except Exception as e:
        return False, f"Validation error: {e}"

def secure_x25519_exchange():
    """Secure X25519 exchange with validation"""
    # Generate keys
    private_key = x25519.X25519PrivateKey.generate()
    public_key = private_key.public_key()
    
    # Simulate receiving public key from other party
    other_private_key = x25519.X25519PrivateKey.generate()
    other_public_key = other_private_key.public_key()
    other_public_bytes = other_public_key.public_bytes()
    
    # Validate received public key
    is_valid, message = validate_x25519_public_key(other_public_bytes)
    if not is_valid:
        raise ValueError(f"Invalid public key: {message}")
    
    # Proceed with key exchange
    shared_secret = private_key.exchange(other_public_key)
    return shared_secret
```

### Constant-Time Operations
```python
def constant_time_x25519():
    """Ensure constant-time X25519 operations"""
    # X25519 is naturally constant-time due to Montgomery ladder
    private_key = x25519.X25519PrivateKey.generate()
    public_key = private_key.public_key()
    
    # All operations are constant-time by design
    other_private = x25519.X25519PrivateKey.generate()
    other_public = other_private.public_key()
    
    shared_secret = private_key.exchange(other_public)
    
    return shared_secret
```

## Error Handling

### Safe X25519 Operations
```python
def safe_x25519_operations():
    """Safe X25519 operations with error handling"""
    def safe_generate_key():
        """Safely generate X25519 key pair"""
        try:
            private_key = x25519.X25519PrivateKey.generate()
            public_key = private_key.public_key()
            return private_key, public_key
            
        except Exception as e:
            print(f"Error generating key: {e}")
            return None, None
    
    def safe_exchange(private_key, public_key):
        """Safely perform X25519 exchange"""
        try:
            if private_key is None or public_key is None:
                raise ValueError("Invalid key parameters")
            
            shared_secret = private_key.exchange(public_key)
            return shared_secret
            
        except Exception as e:
            print(f"Error in key exchange: {e}")
            return None
    
    # Test safe operations
    private_key, public_key = safe_generate_key()
    if private_key and public_key:
        other_private, other_public = safe_generate_key()
        if other_private and other_public:
            shared_secret = safe_exchange(private_key, other_public)
            if shared_secret:
                print(f"Successful key exchange: {shared_secret.hex()}")
```

## Performance Optimization

### Benchmarking X25519
```python
import time

def benchmark_x25519():
    """Benchmark X25519 performance"""
    iterations = 1000
    
    print("X25519 Performance Benchmark:")
    print("-" * 40)
    
    # Generate key pairs
    start_time = time.time()
    for _ in range(iterations):
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
    keygen_time = (time.time() - start_time) * 1000
    
    # Perform exchanges
    private_key = x25519.X25519PrivateKey.generate()
    public_key = private_key.public_key()
    
    start_time = time.time()
    for _ in range(iterations):
        other_private = x25519.X25519PrivateKey.generate()
        other_public = other_private.public_key()
        shared_secret = private_key.exchange(other_public)
    exchange_time = (time.time() - start_time) * 1000
    
    print(f"Key generation: {keygen_time/iterations:.3f}ms per key")
    print(f"Key exchange: {exchange_time/iterations:.3f}ms per exchange")
    print(f"Total operations: {iterations}")
```

### Memory Usage Analysis
```python
import sys

def analyze_memory_usage():
    """Analyze memory usage of X25519 operations"""
    # Measure memory before key generation
    initial_memory = sys.getsizeof(object())
    
    # Generate multiple key pairs
    keys = []
    for i in range(100):
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
        keys.append((private_key, public_key))
    
    # Measure memory after key generation
    final_memory = sys.getsizeof(keys)
    memory_per_key = (final_memory - initial_memory) / 100
    
    print(f"Memory usage per key pair: {memory_per_key:.2f} bytes")
    print(f"Total memory for 100 keys: {final_memory - initial_memory:.2f} bytes")
```

## Testing and Validation

### Key Exchange Verification
```python
def verify_x25519_exchange():
    """Verify X25519 key exchange correctness"""
    # Generate keys for multiple parties
    parties = []
    for i in range(3):
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
        parties.append((private_key, public_key))
    
    print("X25519 Key Exchange Verification:")
    print("-" * 40)
    
    # Test all pairwise exchanges
    for i in range(len(parties)):
        for j in range(i + 1, len(parties)):
            private_i, public_i = parties[i]
            private_j, public_j = parties[j]
            
            # Compute shared secrets
            secret_ij = private_i.exchange(public_j)
            secret_ji = private_j.exchange(public_i)
            
            # Verify they are identical
            assert secret_ij == secret_ji
            print(f"Parties {i} and {j}: {secret_ij.hex()}")
    
    print("All pairwise exchanges verified successfully!")
```

### Security Testing
```python
def security_testing():
    """Test X25519 security properties"""
    # Test 1: Different private keys should produce different shared secrets
    private1 = x25519.X25519PrivateKey.generate()
    private2 = x25519.X25519PrivateKey.generate()
    public = x25519.X25519PrivateKey.generate().public_key()
    
    secret1 = private1.exchange(public)
    secret2 = private2.exchange(public)
    
    assert secret1 != secret2, "Different private keys produced same secret"
    print("Test 1 PASSED: Different private keys produce different secrets")
    
    # Test 2: Same private key should always produce same shared secret
    secret1_repeat = private1.exchange(public)
    assert secret1 == secret1_repeat, "Same private key produced different secrets"
    print("Test 2 PASSED: Same private key produces consistent secrets")
    
    # Test 3: Shared secret should be the same for both parties
    private_a = x25519.X25519PrivateKey.generate()
    private_b = x25519.X25519PrivateKey.generate()
    public_a = private_a.public_key()
    public_b = private_b.public_key()
    
    secret_a = private_a.exchange(public_b)
    secret_b = private_b.exchange(public_a)
    
    assert secret_a == secret_b, "Parties computed different shared secrets"
    print("Test 3 PASSED: Both parties compute identical shared secrets")

# Run security tests
security_testing()
```

## Summary

This tutorial covers:
- Environment setup for different programming languages
- Basic X25519 key exchange implementation
- Advanced usage including key derivation and forward secrecy
- Security best practices and validation
- Performance optimization and benchmarking
- Error handling and testing techniques

All examples follow security best practices and provide practical implementations for real-world applications. 