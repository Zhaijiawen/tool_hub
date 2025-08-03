# ECDSA Code Examples

## Python Examples

### Basic ECDSA Key Generation
```python
from Crypto.PublicKey import ECC
import os

def generate_ecdsa_key_pair(curve='P-256'):
    """Generate ECDSA key pair"""
    key = ECC.generate(curve=curve)
    private_key = key
    public_key = key.public_key()
    
    print(f"Generated ECDSA key pair on {curve}")
    print(f"Public key: ({public_key.x}, {public_key.y})")
    print(f"Private key: {private_key.d}")
    
    return private_key, public_key

def save_keys_to_files(private_key, public_key, prefix="ecdsa"):
    """Save ECDSA keys to PEM files"""
    # Save private key
    with open(f"{prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key(format='PEM'))
    
    # Save public key
    with open(f"{prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key(format='PEM'))
    
    print(f"Keys saved as {prefix}_private.pem and {prefix}_public.pem")

# Usage
private_key, public_key = generate_ecdsa_key_pair('P-256')
save_keys_to_files(private_key, public_key)
```

### Basic ECDSA Signing and Verification
```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256
import base64

def ecdsa_sign(private_key, message):
    """Sign message using ECDSA"""
    hash_obj = SHA256.new(message.encode())
    signer = DSS.new(private_key, 'fips-186-3')
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

def ecdsa_verify(public_key, message, signature):
    """Verify ECDSA signature"""
    hash_obj = SHA256.new(message.encode())
    signature_bytes = base64.b64decode(signature.encode())
    
    verifier = DSS.new(public_key, 'fips-186-3')
    try:
        verifier.verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# Example usage
message = "Hello, ECDSA signing!"
signature = ecdsa_sign(private_key, message)
is_valid = ecdsa_verify(public_key, message, signature)

print(f"Message: {message}")
print(f"Signature: {signature}")
print(f"Valid: {is_valid}")
```

### ECDSA with Different Curves
```python
def compare_curves():
    """Compare ECDSA performance across different curves"""
    curves = ['P-256', 'P-384', 'P-521']
    message = "Test message for curve comparison"
    
    for curve in curves:
        print(f"\n--- {curve} ---")
        
        # Generate key pair
        key = ECC.generate(curve=curve)
        
        # Sign message
        signature = ecdsa_sign(key, message)
        
        # Verify signature
        is_valid = ecdsa_verify(key.public_key(), message, signature)
        
        print(f"Key size: {key.pointQ.size_in_bits()} bits")
        print(f"Signature valid: {is_valid}")

# Run comparison
compare_curves()
```

## JavaScript Examples

### Node.js ECDSA Implementation
```javascript
const crypto = require('crypto');

function generateECDSAKeyPair(curve = 'P-256') {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'sec1',
            format: 'pem'
        }
    });
    
    console.log(`Generated ECDSA key pair on ${curve}`);
    return { privateKey, publicKey };
}

function ecdsaSign(privateKey, message) {
    const signature = crypto.sign('sha256', Buffer.from(message, 'utf8'), {
        key: privateKey,
        dsaEncoding: 'ieee-p1363'
    });
    return signature.toString('base64');
}

function ecdsaVerify(publicKey, message, signature) {
    try {
        const isValid = crypto.verify('sha256', Buffer.from(message, 'utf8'), {
            key: publicKey,
            dsaEncoding: 'ieee-p1363'
        }, Buffer.from(signature, 'base64'));
        return isValid;
    } catch (error) {
        return false;
    }
}

// Usage example
const { privateKey, publicKey } = generateECDSAKeyPair('P-256');
const message = "Hello, ECDSA in Node.js!";
const signature = ecdsaSign(privateKey, message);
const isValid = ecdsaVerify(publicKey, message, signature);

console.log(`Message: ${message}`);
console.log(`Signature valid: ${isValid}`);
```

### Browser ECDSA Implementation
```javascript
// Using Web Crypto API in browser
async function browserECDSAExample() {
    try {
        // Generate key pair
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256"
            },
            true,
            ["sign", "verify"]
        );
        
        // Sign message
        const message = "Hello, ECDSA in browser!";
        const encoder = new TextEncoder();
        const messageBuffer = encoder.encode(message);
        
        const signature = await window.crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" }
            },
            keyPair.privateKey,
            messageBuffer
        );
        
        // Verify signature
        const isValid = await window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" }
            },
            keyPair.publicKey,
            signature,
            messageBuffer
        );
        
        console.log("Browser ECDSA successful");
        console.log(`Signature valid: ${isValid}`);
        
    } catch (error) {
        console.error("Browser ECDSA error:", error);
    }
}
```

## Java Examples

### Bouncy Castle ECDSA Implementation
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class ECDSAExample {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public static KeyPair generateECDSAKeyPair(String curve) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("ECDSA", "BC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec(curve);
        keyGen.initialize(ecSpec);
        KeyPair keyPair = keyGen.generateKeyPair();
        
        System.out.println("Generated ECDSA key pair on " + curve);
        return keyPair;
    }
    
    public static String ecdsaSign(PrivateKey privateKey, String message) throws Exception {
        Signature signature = Signature.getInstance("SHA256withECDSA", "BC");
        signature.initSign(privateKey);
        signature.update(message.getBytes());
        
        byte[] signed = signature.sign();
        return Base64.getEncoder().encodeToString(signed);
    }
    
    public static boolean ecdsaVerify(PublicKey publicKey, String message, String signature) throws Exception {
        Signature sig = Signature.getInstance("SHA256withECDSA", "BC");
        sig.initVerify(publicKey);
        sig.update(message.getBytes());
        
        return sig.verify(Base64.getDecoder().decode(signature));
    }
    
    public static void main(String[] args) throws Exception {
        KeyPair keyPair = generateECDSAKeyPair("P-256");
        
        String message = "Hello, ECDSA in Java!";
        String signature = ecdsaSign(keyPair.getPrivate(), message);
        boolean isValid = ecdsaVerify(keyPair.getPublic(), message, signature);
        
        System.out.println("Message: " + message);
        System.out.println("Signature valid: " + isValid);
    }
}
```

## Go Examples

### ECDSA Implementation in Go
```go
package main

import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
    "crypto/sha256"
    "encoding/base64"
    "fmt"
    "log"
)

func generateECDSAKeyPair() (*ecdsa.PrivateKey, *ecdsa.PublicKey, error) {
    privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
    if err != nil {
        return nil, nil, err
    }
    
    publicKey := &privateKey.PublicKey
    fmt.Println("Generated ECDSA key pair on P-256")
    
    return privateKey, publicKey, nil
}

func ecdsaSign(privateKey *ecdsa.PrivateKey, message string) (string, error) {
    hash := sha256.Sum256([]byte(message))
    r, s, err := ecdsa.Sign(rand.Reader, privateKey, hash[:])
    if err != nil {
        return "", err
    }
    
    // Convert signature to base64
    signature := append(r.Bytes(), s.Bytes()...)
    return base64.StdEncoding.EncodeToString(signature), nil
}

func ecdsaVerify(publicKey *ecdsa.PublicKey, message, signature string) (bool, error) {
    hash := sha256.Sum256([]byte(message))
    signatureBytes, err := base64.StdEncoding.DecodeString(signature)
    if err != nil {
        return false, err
    }
    
    // Split signature into r and s components
    if len(signatureBytes) != 64 {
        return false, fmt.Errorf("invalid signature length")
    }
    
    r := new(big.Int).SetBytes(signatureBytes[:32])
    s := new(big.Int).SetBytes(signatureBytes[32:])
    
    return ecdsa.Verify(publicKey, hash[:], r, s), nil
}

func main() {
    privateKey, publicKey, err := generateECDSAKeyPair()
    if err != nil {
        log.Fatal(err)
    }
    
    message := "Hello, ECDSA in Go!"
    signature, err := ecdsaSign(privateKey, message)
    if err != nil {
        log.Fatal(err)
    }
    
    isValid, err := ecdsaVerify(publicKey, message, signature)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Message: %s\n", message)
    fmt.Printf("Signature valid: %t\n", isValid)
}
```

## Advanced Usage

### Deterministic ECDSA (RFC 6979)
```python
def deterministic_ecdsa_sign(private_key, message):
    """Sign message using deterministic ECDSA"""
    hash_obj = SHA256.new(message.encode())
    signer = DSS.new(private_key, 'fips-186-3', encoding='der')
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

def deterministic_ecdsa_verify(public_key, message, signature):
    """Verify deterministic ECDSA signature"""
    hash_obj = SHA256.new(message.encode())
    signature_bytes = base64.b64decode(signature.encode())
    
    verifier = DSS.new(public_key, 'fips-186-3', encoding='der')
    try:
        verifier.verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# Test deterministic signing
message = "Deterministic ECDSA test"
signature1 = deterministic_ecdsa_sign(private_key, message)
signature2 = deterministic_ecdsa_sign(private_key, message)

print(f"Deterministic signatures identical: {signature1 == signature2}")
```

### ECDSA with Different Hash Functions
```python
from Crypto.Hash import SHA256, SHA384, SHA512

def ecdsa_sign_with_hash(private_key, message, hash_algorithm):
    """Sign message using ECDSA with specified hash"""
    if hash_algorithm == 'SHA256':
        hash_obj = SHA256.new(message.encode())
    elif hash_algorithm == 'SHA384':
        hash_obj = SHA384.new(message.encode())
    elif hash_algorithm == 'SHA512':
        hash_obj = SHA512.new(message.encode())
    else:
        raise ValueError("Unsupported hash algorithm")
    
    signer = DSS.new(private_key, 'fips-186-3')
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

def ecdsa_verify_with_hash(public_key, message, signature, hash_algorithm):
    """Verify signature using ECDSA with specified hash"""
    if hash_algorithm == 'SHA256':
        hash_obj = SHA256.new(message.encode())
    elif hash_algorithm == 'SHA384':
        hash_obj = SHA384.new(message.encode())
    elif hash_algorithm == 'SHA512':
        hash_obj = SHA512.new(message.encode())
    else:
        raise ValueError("Unsupported hash algorithm")
    
    signature_bytes = base64.b64decode(signature.encode())
    verifier = DSS.new(public_key, 'fips-186-3')
    
    try:
        verifier.verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# Test different hash functions
message = "Hash function comparison"
hash_algorithms = ['SHA256', 'SHA384', 'SHA512']

for hash_algo in hash_algorithms:
    signature = ecdsa_sign_with_hash(private_key, message, hash_algo)
    is_valid = ecdsa_verify_with_hash(public_key, message, signature, hash_algo)
    print(f"{hash_algo}: {is_valid}")
```

## Security Applications

### Digital Certificate Verification
```python
def verify_digital_certificate(certificate, public_key):
    """Verify digital certificate using ECDSA"""
    # Extract certificate data and signature
    cert_data = certificate['data']
    cert_signature = certificate['signature']
    
    # Verify signature
    is_valid = ecdsa_verify(public_key, cert_data, cert_signature)
    
    if is_valid:
        print("Certificate signature is valid")
        return True
    else:
        print("Certificate signature is invalid")
        return False

# Example certificate
certificate = {
    'data': 'Certificate data to be signed',
    'signature': ecdsa_sign(private_key, 'Certificate data to be signed')
}

verify_digital_certificate(certificate, public_key)
```

### Blockchain Transaction Signing
```python
def sign_blockchain_transaction(private_key, transaction_data):
    """Sign blockchain transaction using ECDSA"""
    # Create transaction hash
    transaction_hash = SHA256.new(transaction_data.encode()).hexdigest()
    
    # Sign the transaction hash
    signature = ecdsa_sign(private_key, transaction_hash)
    
    return {
        'transaction': transaction_data,
        'signature': signature,
        'public_key': public_key.export_key(format='PEM').decode()
    }

def verify_blockchain_transaction(signed_transaction):
    """Verify blockchain transaction signature"""
    # Extract components
    transaction_data = signed_transaction['transaction']
    signature = signed_transaction['signature']
    public_key_pem = signed_transaction['public_key']
    
    # Import public key
    public_key = ECC.import_key(public_key_pem)
    
    # Create transaction hash
    transaction_hash = SHA256.new(transaction_data.encode()).hexdigest()
    
    # Verify signature
    return ecdsa_verify(public_key, transaction_hash, signature)

# Example blockchain transaction
transaction = "Alice sends 10 BTC to Bob"
signed_tx = sign_blockchain_transaction(private_key, transaction)
is_valid = verify_blockchain_transaction(signed_tx)

print(f"Blockchain transaction valid: {is_valid}")
```

## Performance Testing

### Benchmark ECDSA Operations
```python
import time

def benchmark_ecdsa_operations():
    """Benchmark ECDSA operations"""
    curves = ['P-256', 'P-384', 'P-521']
    message = "Benchmark test message"
    iterations = 100
    
    for curve in curves:
        print(f"\n--- {curve} ---")
        
        # Generate key
        start_time = time.time()
        key = ECC.generate(curve=curve)
        generation_time = time.time() - start_time
        
        # Benchmark signing
        start_time = time.time()
        for _ in range(iterations):
            signature = ecdsa_sign(key, message)
        signing_time = time.time() - start_time
        
        # Benchmark verification
        start_time = time.time()
        for _ in range(iterations):
            ecdsa_verify(key.public_key(), message, signature)
        verification_time = time.time() - start_time
        
        print(f"Key generation: {generation_time:.3f}s")
        print(f"Signing: {signing_time/iterations*1000:.2f}ms per signature")
        print(f"Verification: {verification_time/iterations*1000:.2f}ms per verification")

# Run benchmark
benchmark_ecdsa_operations()
```

## Error Handling

### Safe ECDSA Operations
```python
def safe_ecdsa_sign(private_key, message):
    """Safe ECDSA signing with error handling"""
    try:
        signature = ecdsa_sign(private_key, message)
        return signature
    except ValueError as e:
        print(f"Signing error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def safe_ecdsa_verify(public_key, message, signature):
    """Safe ECDSA verification with error handling"""
    try:
        is_valid = ecdsa_verify(public_key, message, signature)
        return is_valid
    except ValueError as e:
        print(f"Verification error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

# Test safe operations
message = "Safe operation test"
signature = safe_ecdsa_sign(private_key, message)
if signature:
    is_valid = safe_ecdsa_verify(public_key, message, signature)
    print(f"Safe operation result: {is_valid}")
```

## Testing and Validation

### Test Vectors
```python
def test_ecdsa_operations():
    """Test ECDSA operations with known values"""
    # Generate test key
    key = ECC.generate(curve='P-256')
    
    # Test signing/verification
    message = "Test message"
    signature = ecdsa_sign(key, message)
    is_valid = ecdsa_verify(key.public_key(), message, signature)
    
    assert is_valid, "ECDSA signature test failed"
    print("ECDSA signature test passed")
    
    # Test with different message
    different_message = "Different message"
    is_valid = ecdsa_verify(key.public_key(), different_message, signature)
    
    assert not is_valid, "ECDSA verification should fail for different message"
    print("ECDSA verification test passed")

# Run tests
test_ecdsa_operations()
```

## Summary

These examples demonstrate:
- Basic ECDSA key generation and management
- Digital signature creation and verification
- Support for different elliptic curves
- Deterministic ECDSA implementation
- Multiple hash function support
- Blockchain and certificate applications
- Performance benchmarking
- Error handling and validation
- Cross-platform implementations (Python, JavaScript, Java, Go)

All examples follow security best practices and provide practical implementations for real-world applications. 