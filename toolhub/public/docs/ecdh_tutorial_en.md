# ECDH Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with ECDH library support
- Understanding of elliptic curve cryptography
- Knowledge of key exchange protocols
- Familiarity with curve selection and security parameters

### Library Selection

#### Python - cryptography
```bash
# Install cryptography library
pip install cryptography
```

#### Node.js - crypto
```bash
# Built-in crypto module supports ECDH
# No additional installation required
```

#### Java - Bouncy Castle
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

#### Go - crypto/ecdh
```go
// Built-in crypto/ecdh package
import "crypto/ecdh"
```

## Basic Concepts

### Curve Selection
```python
from cryptography.hazmat.primitives.asymmetric import ec

def explain_curve_selection():
    """Explain different curve options"""
    curves = {
        "P-256": "NIST curve, widely supported, 256-bit security",
        "P-384": "NIST curve, higher security, 384-bit",
        "secp256k1": "Bitcoin curve, 256-bit security",
        "X25519": "Curve25519, high performance, 255-bit"
    }
    
    for curve_name, description in curves.items():
        print(f"{curve_name}: {description}")
    
    return curves
```

### Key Generation Process
```python
def key_generation_process():
    """Explain ECDH key generation process"""
    print("ECDH Key Generation Process:")
    print("1. Generate private key (random scalar)")
    print("2. Compute public key = private_key * G")
    print("3. Exchange public keys over insecure channel")
    print("4. Compute shared secret = private_key * other_public_key")
    print("5. Both parties get identical shared secret")
```

## Basic Key Exchange

### Simple ECDH Exchange
```python
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import os

def basic_ecdh_exchange():
    """Basic ECDH key exchange example"""
    # Generate private keys for both parties
    private_key_alice = ec.generate_private_key(ec.SECP256R1())
    private_key_bob = ec.generate_private_key(ec.SECP256R1())
    
    # Get public keys
    public_key_alice = private_key_alice.public_key()
    public_key_bob = private_key_bob.public_key()
    
    # Exchange public keys (in real scenario, over network)
    print(f"Alice's public key: {public_key_alice.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()}")
    
    print(f"Bob's public key: {public_key_bob.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()}")
    
    # Compute shared secrets
    shared_secret_alice = private_key_alice.exchange(
        ec.ECDH(), public_key_bob
    )
    shared_secret_bob = private_key_bob.exchange(
        ec.ECDH(), public_key_alice
    )
    
    # Verify both secrets are identical
    assert shared_secret_alice == shared_secret_bob
    print(f"Shared secret (32 bytes): {shared_secret_alice.hex()}")
    
    return shared_secret_alice
```

### Curve Comparison
```python
def curve_comparison():
    """Compare different curves for ECDH"""
    curves = [
        ec.SECP256R1(),  # NIST P-256
        ec.SECP384R1(),  # NIST P-384
        ec.SECP256K1(),  # Bitcoin curve
    ]
    
    print("ECDH Curve Comparison:")
    print("-" * 50)
    
    for curve in curves:
        # Generate keys
        private_key = ec.generate_private_key(curve)
        public_key = private_key.public_key()
        
        # Measure key size
        key_size = public_key.key_size
        curve_name = curve.name if hasattr(curve, 'name') else str(curve)
        
        print(f"Curve: {curve_name}")
        print(f"Key size: {key_size} bits")
        print(f"Security level: ~{key_size//2} bits")
        print("-" * 30)
```

## Advanced Usage

### Key Derivation
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

def derive_keys_from_shared_secret(shared_secret, salt=None):
    """Derive multiple keys from shared secret using HKDF"""
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
shared_secret = basic_ecdh_exchange()
derived_keys = derive_keys_from_shared_secret(shared_secret)
print(f"Derived encryption key: {derived_keys['encryption_key'].hex()}")
```

## Summary

This tutorial covers:
- Environment setup for different programming languages
- Basic ECDH key exchange implementation
- Curve selection and comparison
- Key derivation from shared secrets

All examples follow security best practices and provide practical implementations. 