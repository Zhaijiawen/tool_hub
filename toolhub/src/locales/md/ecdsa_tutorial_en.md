# ECDSA Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with ECC libraries
- Understanding of elliptic curve cryptography
- Knowledge of digital signature concepts
- Awareness of ECDSA security considerations

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

### ECDSA Key Structure
```python
from Crypto.PublicKey import ECC

# Generate ECDSA key pair
key = ECC.generate(curve='P-256')

# Public key components
public_key = key.public_key()
x = public_key.x  # X coordinate
y = public_key.y  # Y coordinate
curve = public_key.curve  # Curve name

# Private key components
private_key = key
d = private_key.d  # Private scalar
curve = private_key.curve  # Curve name

print(f"Curve: {curve}")
print(f"Public key: ({x}, {y})")
print(f"Key size: {key.pointQ.size_in_bits()} bits")
```

### Curve Selection
```python
def curve_recommendations():
    """ECDSA curve recommendations"""
    print("ECDSA Curve Recommendations:")
    print("P-256: Most widely used, 256-bit security")
    print("P-384: Higher security, slower performance")
    print("P-521: Maximum security, largest key size")
    print("secp256k1: Bitcoin curve, 256-bit security")
    
    # Security levels
    security_levels = {
        'P-256': "128 bits (current standard)",
        'P-384': "192 bits (high security)",
        'P-521': "256 bits (maximum security)",
        'secp256k1': "128 bits (Bitcoin standard)"
    }
    
    return security_levels
```

## Key Generation

### Basic Key Generation
```python
from Crypto.PublicKey import ECC
import os

def generate_ecdsa_key_pair(curve='P-256'):
    """Generate ECDSA key pair"""
    # Generate random key
    key = ECC.generate(curve=curve)
    
    # Extract public and private keys
    private_key = key
    public_key = key.public_key()
    
    print(f"Generated ECDSA key pair on {curve}")
    print(f"Public key: ({public_key.x}, {public_key.y})")
    print(f"Private key: {private_key.d}")
    
    return private_key, public_key

def save_key_pair(private_key, public_key, filename_prefix):
    """Save ECDSA key pair to files"""
    # Save private key
    with open(f"{filename_prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key(format='PEM'))
    
    # Save public key
    with open(f"{filename_prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key(format='PEM'))
    
    print(f"Keys saved as {filename_prefix}_private.pem and {filename_prefix}_public.pem")
```

### Key Generation with Custom Parameters
```python
def generate_ecdsa_with_custom_curve(curve_name):
    """Generate ECDSA key with custom curve"""
    available_curves = ['P-256', 'P-384', 'P-521', 'secp256k1']
    
    if curve_name not in available_curves:
        print(f"Unsupported curve: {curve_name}")
        return None
    
    key = ECC.generate(curve=curve_name)
    print(f"Generated ECDSA key on {curve_name}")
    return key

def validate_key_parameters(key):
    """Validate ECDSA key parameters"""
    # Check curve
    if key.curve not in ['P-256', 'P-384', 'P-521', 'secp256k1']:
        print("Warning: Non-standard curve")
    
    # Check key size
    key_size = key.pointQ.size_in_bits()
    if key_size < 256:
        print("Warning: Key size less than 256 bits")
    
    # Check private key range
    if key.d <= 0 or key.d >= key.pointQ.order:
        print("Error: Private key out of valid range")
        return False
    
    return True
``` 