# ECC Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with ECC cryptographic libraries
- Understanding of elliptic curve mathematics
- Knowledge of public-key cryptography concepts
- Awareness of ECC security considerations

### Library Selection

#### PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### Node.js crypto (JavaScript)
```bash
# Built-in crypto module supports ECC
npm install elliptic  # For additional ECC features
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
# Install OpenSSL with ECC support
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

## Basic Concepts

### Curve Selection
```python
from Crypto.PublicKey import ECC

def curve_selection_guide():
    """Guide for selecting ECC curves"""
    print("ECC Curve Selection Guide:")
    print("P-256: NIST curve, widely supported, 128-bit security")
    print("P-384: NIST curve, higher security, slower performance")
    print("Curve25519: High-performance curve, 128-bit security")
    print("Ed25519: Edwards curve for signatures, fast and secure")
    
    # Security levels
    security_levels = {
        "P-256": "128 bits (recommended)",
        "P-384": "192 bits (high security)",
        "Curve25519": "128 bits (high performance)",
        "Ed25519": "128 bits (signatures only)"
    }
    
    return security_levels
```

### Key Pair Structure
```python
def generate_ecc_key_pair(curve_name="P-256"):
    """Generate ECC key pair"""
    key = ECC.generate(curve=curve_name)
    
    # Extract components
    private_key = key
    public_key = key.public_key()
    
    print(f"Generated {curve_name} ECC key pair")
    print(f"Private key: {private_key.d}")
    print(f"Public key: {public_key.pointQ}")
    
    return private_key, public_key
```

## Key Generation

### Basic Key Generation
```python
from Crypto.PublicKey import ECC
import os

def generate_ecc_key_pair(curve_name="P-256"):
    """Generate ECC key pair with specified curve"""
    key = ECC.generate(curve=curve_name)
    
    print(f"Generated {curve_name} ECC key pair")
    print(f"Curve: {key.curve}")
    print(f"Key size: {key.pointQ.size_in_bits()} bits")
    
    return key

def save_key_pair(key, filename_prefix):
    """Save ECC key pair to files"""
    # Save private key
    with open(f"{filename_prefix}_private.pem", "wb") as f:
        f.write(key.export_key(format='PEM'))
    
    # Save public key
    with open(f"{filename_prefix}_public.pem", "wb") as f:
        f.write(key.public_key().export_key(format='PEM'))
    
    print(f"Keys saved as {filename_prefix}_private.pem and {filename_prefix}_public.pem")
```

### Key Generation with Custom Parameters
```python
def generate_ecc_with_custom_curve():
    """Generate ECC key with different curves"""
    curves = ["P-256", "P-384", "P-521"]
    
    for curve in curves:
        key = ECC.generate(curve=curve)
        print(f"{curve}: {key.pointQ.size_in_bits()} bits")
    
    return key

def validate_key_parameters(key):
    """Validate ECC key parameters"""
    # Check curve
    if key.curve not in ["P-256", "P-384", "P-521"]:
        print("Warning: Non-standard curve")
    
    # Check key size
    if key.pointQ.size_in_bits() < 256:
        print("Warning: Key size less than 256 bits")
    
    # Check private key
    if key.d == 0:
        print("Error: Invalid private key")
        return False
    
    return True
```

## Key Exchange (ECDH)

### Basic ECDH Key Exchange
```python
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

def ecdh_key_exchange(private_key_a, public_key_b):
    """Perform ECDH key exchange"""
    # Compute shared secret
    shared_secret = private_key_a.d * public_key_b.pointQ
    
    # Convert to bytes
    shared_bytes = shared_secret.x.to_bytes(32, 'big')
    
    # Derive key material
    key_material = HKDF(shared_bytes, 32, b"", SHA256)
    
    return key_material

def ecdh_example():
    """Complete ECDH key exchange example"""
    # Generate key pairs for two parties
    alice_key = ECC.generate(curve='P-256')
    bob_key = ECC.generate(curve='P-256')
    
    # Exchange public keys
    alice_public = alice_key.public_key()
    bob_public = bob_key.public_key()
    
    # Compute shared secrets
    alice_shared = ecdh_key_exchange(alice_key, bob_public)
    bob_shared = ecdh_key_exchange(bob_key, alice_public)
    
    # Verify they match
    assert alice_shared == bob_shared
    print("ECDH key exchange successful")
    
    return alice_shared
```

### ECDH with Key Derivation
```python
def ecdh_with_derivation(private_key, public_key, salt=None):
    """ECDH with proper key derivation"""
    # Compute shared secret
    shared_point = private_key.d * public_key.pointQ
    
    # Convert to bytes
    shared_bytes = shared_point.x.to_bytes(32, 'big')
    
    # Generate salt if not provided
    if salt is None:
        salt = os.urandom(16)
    
    # Derive keys using HKDF
    derived_key = HKDF(shared_bytes, 32, salt, SHA256)
    
    return derived_key, salt

def secure_key_exchange():
    """Secure ECDH key exchange with key derivation"""
    # Generate keys
    alice_key = ECC.generate(curve='P-256')
    bob_key = ECC.generate(curve='P-256')
    
    # Exchange public keys
    alice_public = alice_key.public_key()
    bob_public = bob_key.public_key()
    
    # Generate salt
    salt = os.urandom(16)
    
    # Derive shared keys
    alice_key_material, _ = ecdh_with_derivation(alice_key, bob_public, salt)
    bob_key_material, _ = ecdh_with_derivation(bob_key, alice_public, salt)
    
    assert alice_key_material == bob_key_material
    return alice_key_material
```

## Digital Signatures

### ECDSA Signatures
```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

def ecdsa_sign(private_key, message):
    """Sign message using ECDSA"""
    # Create hash of the message
    hash_obj = SHA256.new(message.encode())
    
    # Create signer
    signer = DSS.new(private_key, 'fips-186-3')
    
    # Sign the hash
    signature = signer.sign(hash_obj)
    
    return signature

def ecdsa_verify(public_key, message, signature):
    """Verify ECDSA signature"""
    # Create hash of the message
    hash_obj = SHA256.new(message.encode())
    
    # Create verifier
    verifier = DSS.new(public_key, 'fips-186-3')
    
    try:
        verifier.verify(hash_obj, signature)
        return True
    except ValueError:
        return False

# Usage example
def ecdsa_example():
    """ECDSA signature example"""
    # Generate key pair
    key = ECC.generate(curve='P-256')
    
    # Sign message
    message = "Hello, ECDSA!"
    signature = ecdsa_sign(key, message)
    
    # Verify signature
    is_valid = ecdsa_verify(key.public_key(), message, signature)
    
    print(f"Message: {message}")
    print(f"Signature valid: {is_valid}")
    
    return signature
```

### EdDSA Signatures
```python
def eddsa_sign(private_key, message):
    """Sign message using EdDSA"""
    # Create hash of the message
    hash_obj = SHA256.new(message.encode())
    
    # Create signer (EdDSA uses different format)
    signer = DSS.new(private_key, 'deterministic-rfc6979')
    
    # Sign the hash
    signature = signer.sign(hash_obj)
    
    return signature

def eddsa_verify(public_key, message, signature):
    """Verify EdDSA signature"""
    # Create hash of the message
    hash_obj = SHA256.new(message.encode())
    
    # Create verifier
    verifier = DSS.new(public_key, 'deterministic-rfc6979')
    
    try:
        verifier.verify(hash_obj, signature)
        return True
    except ValueError:
        return False
```

## Advanced Usage

### Hybrid Encryption
```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def ecc_hybrid_encrypt(ecc_public_key, message):
    """Hybrid encryption using ECC + AES"""
    # Generate random AES key
    aes_key = get_random_bytes(32)  # 256-bit key
    
    # Encrypt AES key with ECC (ECDH)
    shared_point = ecc_public_key.pointQ  # In practice, use ECDH
    # This is simplified - in real implementation, use proper ECDH
    
    # Encrypt message with AES
    cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    
    return aes_key, cipher.nonce, ciphertext, tag

def ecc_hybrid_decrypt(ecc_private_key, aes_key, nonce, ciphertext, tag):
    """Hybrid decryption using ECC + AES"""
    # Decrypt AES key with ECC (ECDH)
    # This is simplified - in real implementation, use proper ECDH
    
    # Decrypt message with AES
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    
    return plaintext.decode()
```

### Key Management
```python
def load_ecc_key_from_file(filename):
    """Load ECC key from PEM file"""
    with open(filename, "rb") as f:
        key_data = f.read()
    
    return ECC.import_key(key_data)

def export_ecc_key_to_pem(key, filename):
    """Export ECC key to PEM file"""
    with open(filename, "wb") as f:
        f.write(key.export_key(format='PEM'))

def key_fingerprint(public_key):
    """Generate key fingerprint for identification"""
    import hashlib
    key_data = public_key.export_key(format='DER')
    fingerprint = hashlib.sha256(key_data).hexdigest()
    return fingerprint[:16]  # First 16 characters
```

## Security Best Practices

### Secure Key Generation
```python
def secure_ecc_generation():
    """Secure ECC key generation practices"""
    print("Secure ECC Key Generation Guidelines:")
    print("1. Use standardized curves (P-256, Curve25519)")
    print("2. Generate keys on secure hardware when possible")
    print("3. Store private keys securely")
    print("4. Use strong random number generators")
    print("5. Validate key parameters after generation")
    print("6. Use appropriate key sizes for security level")

def check_ecc_security(key):
    """Check ECC key security parameters"""
    issues = []
    
    if key.curve not in ["P-256", "P-384", "P-521"]:
        issues.append("Non-standard curve")
    
    if key.pointQ.size_in_bits() < 256:
        issues.append("Key size too small")
    
    if key.d == 0:
        issues.append("Invalid private key")
    
    return issues
```

### Curve Security
```python
def curve_security_guide():
    """ECC curve security guidelines"""
    print("ECC Curve Security:")
    print("✅ Use P-256 for general purpose (128-bit security)")
    print("✅ Use P-384 for high security (192-bit security)")
    print("✅ Use Curve25519 for high performance")
    print("✅ Use Ed25519 for digital signatures")
    print("❌ Avoid custom curves")
    print("❌ Avoid deprecated curves")
    
    print("\nCurve Recommendations:")
    print("- P-256: Widely supported, good performance")
    print("- P-384: Higher security, slower performance")
    print("- Curve25519: High performance, modern design")
    print("- Ed25519: Fast signatures, deterministic")
```

## Performance Considerations

### Performance Optimization
```python
import time

def benchmark_ecc_operations():
    """Benchmark ECC operations"""
    # Generate test key
    key = ECC.generate(curve='P-256')
    message = "Test message"
    
    # Benchmark key generation
    start_time = time.time()
    test_key = ECC.generate(curve='P-256')
    generation_time = time.time() - start_time
    
    # Benchmark signing
    start_time = time.time()
    signature = ecdsa_sign(key, message)
    signing_time = time.time() - start_time
    
    # Benchmark verification
    start_time = time.time()
    ecdsa_verify(key.public_key(), message, signature)
    verification_time = time.time() - start_time
    
    print(f"Key generation: {generation_time*1000:.2f}ms")
    print(f"Signing: {signing_time*1000:.2f}ms")
    print(f"Verification: {verification_time*1000:.2f}ms")

def curve_performance_comparison():
    """Compare performance across different curves"""
    curves = ["P-256", "P-384", "P-521"]
    
    for curve in curves:
        start_time = time.time()
        key = ECC.generate(curve=curve)
        generation_time = time.time() - start_time
        
        print(f"{curve} key generation: {generation_time*1000:.2f}ms")
```

## Error Handling

### Exception Handling
```python
def safe_ecc_operations():
    """Safe ECC operations with error handling"""
    try:
        # Generate key
        key = ECC.generate(curve='P-256')
        
        # Sign message
        message = "Test message"
        signature = ecdsa_sign(key, message)
        
        # Verify signature
        is_valid = ecdsa_verify(key.public_key(), message, signature)
        
        return True, "Operations successful"
        
    except ValueError as e:
        return False, f"Value error: {e}"
    except Exception as e:
        return False, f"Unexpected error: {e}"

def validate_ecc_parameters(curve_name):
    """Validate ECC curve parameters"""
    valid_curves = ["P-256", "P-384", "P-521"]
    
    if curve_name not in valid_curves:
        raise ValueError(f"Invalid curve: {curve_name}")
    
    return True
```

## Testing and Validation

### Test Vectors
```python
def test_ecc_operations():
    """Test ECC operations with known values"""
    # Generate test key
    key = ECC.generate(curve='P-256')
    
    # Test ECDSA
    message = "Test message"
    signature = ecdsa_sign(key, message)
    is_valid = ecdsa_verify(key.public_key(), message, signature)
    
    assert is_valid, "ECDSA test failed"
    print("ECC ECDSA test passed")
    
    # Test key exchange
    alice_key = ECC.generate(curve='P-256')
    bob_key = ECC.generate(curve='P-256')
    
    alice_shared = ecdh_key_exchange(alice_key, bob_key.public_key())
    bob_shared = ecdh_key_exchange(bob_key, alice_key.public_key())
    
    assert alice_shared == bob_shared, "ECDH test failed"
    print("ECC ECDH test passed")
``` 