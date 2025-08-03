# ECC Code Examples

## Basic Key Generation

### Python - PyCryptodome
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

# Usage example
key = generate_ecc_key_pair("P-256")
save_key_pair(key, "my_ecc_key")
```

### JavaScript - Node.js crypto
```javascript
const crypto = require('crypto');

function generateECCKeyPair(curve = 'P-256') {
    // Generate key pair
    const keyPair = crypto.generateKeyPairSync('ec', {
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
    
    console.log(`Generated ${curve} ECC key pair`);
    console.log('Private key:', keyPair.privateKey);
    console.log('Public key:', keyPair.publicKey);
    
    return keyPair;
}

function saveKeyPair(keyPair, filenamePrefix) {
    const fs = require('fs');
    
    fs.writeFileSync(`${filenamePrefix}_private.pem`, keyPair.privateKey);
    fs.writeFileSync(`${filenamePrefix}_public.pem`, keyPair.publicKey);
    
    console.log(`Keys saved as ${filenamePrefix}_private.pem and ${filenamePrefix}_public.pem`);
}

// Usage example
const keyPair = generateECCKeyPair('P-256');
saveKeyPair(keyPair, 'my_ecc_key');
```

### Java - Bouncy Castle
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.custom.sec.SecP256K1Curve;

import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.io.FileOutputStream;

public class ECCKeyGenerator {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public static KeyPair generateECCKeyPair(String curveName) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec(curveName);
        keyGen.initialize(ecSpec);
        
        KeyPair keyPair = keyGen.generateKeyPair();
        System.out.println("Generated " + curveName + " ECC key pair");
        
        return keyPair;
    }
    
    public static void saveKeyPair(KeyPair keyPair, String filenamePrefix) throws Exception {
        // Save private key
        try (FileOutputStream fos = new FileOutputStream(filenamePrefix + "_private.pem")) {
            fos.write(keyPair.getPrivate().getEncoded());
        }
        
        // Save public key
        try (FileOutputStream fos = new FileOutputStream(filenamePrefix + "_public.pem")) {
            fos.write(keyPair.getPublic().getEncoded());
        }
        
        System.out.println("Keys saved as " + filenamePrefix + "_private.pem and " + filenamePrefix + "_public.pem");
    }
    
    public static void main(String[] args) throws Exception {
        KeyPair keyPair = generateECCKeyPair("P-256");
        saveKeyPair(keyPair, "my_ecc_key");
    }
}
```

## ECDH Key Exchange

### Python - ECDH Implementation
```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256
import os

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
    print(f"Shared key: {alice_shared.hex()}")
    
    return alice_shared

# Run ECDH example
shared_key = ecdh_example()
```

### JavaScript - ECDH Implementation
```javascript
const crypto = require('crypto');

function ecdhKeyExchange(privateKey, publicKey) {
    // Create ECDH object
    const ecdh = crypto.createECDH('P-256');
    ecdh.setPrivateKey(privateKey);
    
    // Compute shared secret
    const sharedSecret = ecdh.computeSecret(publicKey);
    
    // Derive key material using HKDF
    const keyMaterial = crypto.hkdfSync('sha256', sharedSecret, '', '', 32);
    
    return keyMaterial;
}

function ecdhExample() {
    // Generate key pairs for two parties
    const aliceECDH = crypto.createECDH('P-256');
    const bobECDH = crypto.createECDH('P-256');
    
    aliceECDH.generateKeys();
    bobECDH.generateKeys();
    
    // Exchange public keys
    const alicePublic = aliceECDH.getPublicKey();
    const bobPublic = bobECDH.getPublicKey();
    
    // Compute shared secrets
    const aliceShared = ecdhKeyExchange(aliceECDH.getPrivateKey(), bobPublic);
    const bobShared = ecdhKeyExchange(bobECDH.getPrivateKey(), alicePublic);
    
    // Verify they match
    if (aliceShared.equals(bobShared)) {
        console.log("ECDH key exchange successful");
        console.log("Shared key:", aliceShared.toString('hex'));
    } else {
        console.log("ECDH key exchange failed");
    }
    
    return aliceShared;
}

// Run ECDH example
const sharedKey = ecdhExample();
```

## ECDSA Digital Signatures

### Python - ECDSA Implementation
```python
from Crypto.PublicKey import ECC
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
    print(f"Signature: {signature.hex()}")
    print(f"Signature valid: {is_valid}")
    
    return signature

# Run ECDSA example
signature = ecdsa_example()
```

### JavaScript - ECDSA Implementation
```javascript
const crypto = require('crypto');

function ecdsaSign(privateKey, message) {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    
    const signature = sign.sign(privateKey, 'hex');
    return signature;
}

function ecdsaVerify(publicKey, message, signature) {
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    
    return verify.verify(publicKey, signature, 'hex');
}

function ecdsaExample() {
    // Generate key pair
    const keyPair = crypto.generateKeyPairSync('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'sec1',
            format: 'pem'
        }
    });
    
    // Sign message
    const message = "Hello, ECDSA!";
    const signature = ecdsaSign(keyPair.privateKey, message);
    
    // Verify signature
    const isValid = ecdsaVerify(keyPair.publicKey, message, signature);
    
    console.log("Message:", message);
    console.log("Signature:", signature);
    console.log("Signature valid:", isValid);
    
    return signature;
}

// Run ECDSA example
const signature = ecdsaExample();
```

## Hybrid Encryption

### Python - ECC + AES Hybrid Encryption
```python
from Crypto.PublicKey import ECC
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

def ecc_hybrid_encrypt(ecc_public_key, message):
    """Hybrid encryption using ECC + AES"""
    # Generate random AES key
    aes_key = get_random_bytes(32)  # 256-bit key
    
    # Encrypt AES key with ECC (simplified ECDH)
    # In practice, use proper ECDH key exchange
    shared_point = ecc_public_key.pointQ
    
    # Encrypt message with AES
    cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    
    return aes_key, cipher.nonce, ciphertext, tag

def ecc_hybrid_decrypt(ecc_private_key, aes_key, nonce, ciphertext, tag):
    """Hybrid decryption using ECC + AES"""
    # Decrypt AES key with ECC (simplified ECDH)
    # In practice, use proper ECDH key exchange
    
    # Decrypt message with AES
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    
    return plaintext.decode()

def hybrid_encryption_example():
    """Hybrid encryption example"""
    # Generate ECC key pair
    key = ECC.generate(curve='P-256')
    
    # Message to encrypt
    message = "Hello, Hybrid Encryption!"
    
    # Encrypt
    aes_key, nonce, ciphertext, tag = ecc_hybrid_encrypt(key.public_key(), message)
    
    # Decrypt
    decrypted = ecc_hybrid_decrypt(key, aes_key, nonce, ciphertext, tag)
    
    print(f"Original message: {message}")
    print(f"Encrypted: {ciphertext.hex()}")
    print(f"Decrypted: {decrypted}")
    print(f"Match: {message == decrypted}")
    
    return ciphertext

# Run hybrid encryption example
encrypted_data = hybrid_encryption_example()
```

## Key Management

### Python - Key Import/Export
```python
from Crypto.PublicKey import ECC
import hashlib

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
    key_data = public_key.export_key(format='DER')
    fingerprint = hashlib.sha256(key_data).hexdigest()
    return fingerprint[:16]  # First 16 characters

def key_management_example():
    """Key management example"""
    # Generate key
    key = ECC.generate(curve='P-256')
    
    # Export keys
    export_ecc_key_to_pem(key, 'private_key.pem')
    export_ecc_key_to_pem(key.public_key(), 'public_key.pem')
    
    # Load keys
    loaded_private = load_ecc_key_from_file('private_key.pem')
    loaded_public = load_ecc_key_from_file('public_key.pem')
    
    # Generate fingerprint
    fingerprint = key_fingerprint(key.public_key())
    
    print(f"Key fingerprint: {fingerprint}")
    print(f"Keys loaded successfully: {loaded_private.d == key.d}")
    
    return fingerprint

# Run key management example
fingerprint = key_management_example()
```

## Performance Benchmarking

### Python - ECC Performance Test
```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256
import time

def benchmark_ecc_operations():
    """Benchmark ECC operations"""
    # Generate test key
    key = ECC.generate(curve='P-256')
    message = "Test message for benchmarking"
    
    # Benchmark key generation
    start_time = time.time()
    for _ in range(100):
        test_key = ECC.generate(curve='P-256')
    generation_time = (time.time() - start_time) / 100
    
    # Benchmark signing
    start_time = time.time()
    for _ in range(1000):
        hash_obj = SHA256.new(message.encode())
        signer = DSS.new(key, 'fips-186-3')
        signature = signer.sign(hash_obj)
    signing_time = (time.time() - start_time) / 1000
    
    # Benchmark verification
    start_time = time.time()
    for _ in range(1000):
        hash_obj = SHA256.new(message.encode())
        verifier = DSS.new(key.public_key(), 'fips-186-3')
        verifier.verify(hash_obj, signature)
    verification_time = (time.time() - start_time) / 1000
    
    print(f"Key generation: {generation_time*1000:.2f}ms")
    print(f"Signing: {signing_time*1000:.2f}ms")
    print(f"Verification: {verification_time*1000:.2f}ms")
    
    return generation_time, signing_time, verification_time

def curve_performance_comparison():
    """Compare performance across different curves"""
    curves = ["P-256", "P-384", "P-521"]
    
    for curve in curves:
        start_time = time.time()
        key = ECC.generate(curve=curve)
        generation_time = time.time() - start_time
        
        print(f"{curve} key generation: {generation_time*1000:.2f}ms")

# Run performance benchmarks
benchmark_ecc_operations()
curve_performance_comparison()
```

## Error Handling

### Python - Safe ECC Operations
```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

def safe_ecc_operations():
    """Safe ECC operations with error handling"""
    try:
        # Generate key
        key = ECC.generate(curve='P-256')
        
        # Sign message
        message = "Test message"
        hash_obj = SHA256.new(message.encode())
        signer = DSS.new(key, 'fips-186-3')
        signature = signer.sign(hash_obj)
        
        # Verify signature
        verifier = DSS.new(key.public_key(), 'fips-186-3')
        verifier.verify(hash_obj, signature)
        
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

def error_handling_example():
    """Error handling example"""
    # Test valid operations
    success, message = safe_ecc_operations()
    print(f"Valid operations: {success} - {message}")
    
    # Test invalid curve
    try:
        validate_ecc_parameters("invalid-curve")
    except ValueError as e:
        print(f"Invalid curve error: {e}")
    
    return success

# Run error handling example
result = error_handling_example()
``` 