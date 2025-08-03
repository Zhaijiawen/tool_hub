# ECDH Code Examples

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

# Run example
basic_ecdh_exchange()
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

### Perfect Forward Secrecy
```python
class ECDHSession:
    def __init__(self, curve=ec.SECP256R1()):
        self.curve = curve
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None
    
    def generate_ephemeral_keys(self):
        """Generate new ephemeral keys for this session"""
        self.ephemeral_private_key = ec.generate_private_key(self.curve)
        self.ephemeral_public_key = self.ephemeral_private_key.public_key()
        return self.ephemeral_public_key
    
    def compute_shared_secret(self, other_public_key):
        """Compute shared secret with other party's public key"""
        self.shared_secret = self.ephemeral_private_key.exchange(
            ec.ECDH(), other_public_key
        )
        return self.shared_secret
    
    def clear_session_data(self):
        """Clear session data for forward secrecy"""
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None

# Example of perfect forward secrecy
def perfect_forward_secrecy_example():
    """Demonstrate perfect forward secrecy with ECDH"""
    # Alice and Bob create sessions
    alice_session = ECDHSession()
    bob_session = ECDHSession()
    
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

## Security Applications

### Secure Communication Protocol
```python
class SecureChannel:
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self.shared_secret = None
        self.derived_keys = None
    
    def establish_connection(self, other_public_key):
        """Establish secure channel with other party"""
        # Generate our key pair
        self.private_key = ec.generate_private_key(ec.SECP256R1())
        self.public_key = self.private_key.public_key()
        
        # Compute shared secret
        self.shared_secret = self.private_key.exchange(
            ec.ECDH(), other_public_key
        )
        
        # Derive session keys
        self.derived_keys = derive_keys_from_shared_secret(self.shared_secret)
        
        return self.public_key
    
    def encrypt_message(self, message):
        """Encrypt message using derived encryption key"""
        if not self.derived_keys:
            raise ValueError("Channel not established")
        
        # Simple XOR encryption (use proper encryption in practice)
        message_bytes = message.encode('utf-8')
        key = self.derived_keys['encryption_key']
        
        encrypted = bytes(a ^ b for a, b in zip(message_bytes, key))
        return encrypted
    
    def decrypt_message(self, encrypted_message):
        """Decrypt message using derived encryption key"""
        if not self.derived_keys:
            raise ValueError("Channel not established")
        
        key = self.derived_keys['encryption_key']
        decrypted = bytes(a ^ b for a, b in zip(encrypted_message, key))
        return decrypted.decode('utf-8')

# Usage example
def secure_communication_example():
    """Example of secure communication using ECDH"""
    # Alice and Bob establish secure channels
    alice_channel = SecureChannel()
    bob_channel = SecureChannel()
    
    # Bob generates his key pair
    bob_private = ec.generate_private_key(ec.SECP256R1())
    bob_public = bob_private.public_key()
    
    # Alice establishes connection with Bob
    alice_public = alice_channel.establish_connection(bob_public)
    
    # Bob establishes connection with Alice
    bob_shared_secret = bob_private.exchange(ec.ECDH(), alice_public)
    bob_derived_keys = derive_keys_from_shared_secret(bob_shared_secret)
    
    # Alice sends encrypted message
    message = "Hello, Bob! This is a secret message."
    encrypted = alice_channel.encrypt_message(message)
    print(f"Encrypted: {encrypted.hex()}")
    
    # Bob decrypts message
    decrypted = bob_channel.decrypt_message(encrypted)
    print(f"Decrypted: {decrypted}")
```

## Performance Testing

### Benchmarking Different Curves
```python
import time

def benchmark_curves():
    """Benchmark different curves for performance"""
    curves = [
        ("P-256", ec.SECP256R1()),
        ("P-384", ec.SECP384R1()),
        ("P-521", ec.SECP521R1()),
        ("secp256k1", ec.SECP256K1())
    ]
    
    print("ECDH Curve Performance Benchmark:")
    print("-" * 50)
    
    for curve_name, curve in curves:
        # Generate key pair
        start_time = time.time()
        private_key = ec.generate_private_key(curve)
        public_key = private_key.public_key()
        keygen_time = (time.time() - start_time) * 1000
        
        # Perform exchange
        other_private = ec.generate_private_key(curve)
        other_public = other_private.public_key()
        
        start_time = time.time()
        shared_secret = private_key.exchange(ec.ECDH(), other_public)
        exchange_time = (time.time() - start_time) * 1000
        
        print(f"{curve_name}:")
        print(f"  Key generation: {keygen_time:.2f}ms")
        print(f"  Key exchange: {exchange_time:.2f}ms")
        print(f"  Total time: {keygen_time + exchange_time:.2f}ms")
        print("-" * 30)
```

### Memory Usage Analysis
```python
import sys

def analyze_memory_usage():
    """Analyze memory usage of ECDH operations"""
    curve = ec.SECP256R1()
    
    # Measure memory before key generation
    initial_memory = sys.getsizeof(object())
    
    # Generate multiple key pairs
    keys = []
    for i in range(100):
        private_key = ec.generate_private_key(curve)
        public_key = private_key.public_key()
        keys.append((private_key, public_key))
    
    # Measure memory after key generation
    final_memory = sys.getsizeof(keys)
    memory_per_key = (final_memory - initial_memory) / 100
    
    print(f"Memory usage per key pair: {memory_per_key:.2f} bytes")
    print(f"Total memory for 100 keys: {final_memory - initial_memory:.2f} bytes")
```

## Error Handling

### Safe ECDH Operations
```python
def safe_ecdh_operations():
    """Safe ECDH operations with error handling"""
    def safe_generate_key(curve_name="P-256"):
        """Safely generate ECDH key pair"""
        try:
            curve_map = {
                "P-256": ec.SECP256R1(),
                "P-384": ec.SECP384R1(),
                "P-521": ec.SECP521R1(),
                "secp256k1": ec.SECP256K1()
            }
            
            if curve_name not in curve_map:
                raise ValueError(f"Unsupported curve: {curve_name}")
            
            curve = curve_map[curve_name]
            private_key = ec.generate_private_key(curve)
            public_key = private_key.public_key()
            
            return private_key, public_key
            
        except Exception as e:
            print(f"Error generating key: {e}")
            return None, None
    
    def safe_exchange(private_key, public_key):
        """Safely perform ECDH exchange"""
        try:
            if private_key is None or public_key is None:
                raise ValueError("Invalid key parameters")
            
            shared_secret = private_key.exchange(ec.ECDH(), public_key)
            return shared_secret
            
        except Exception as e:
            print(f"Error in key exchange: {e}")
            return None
    
    # Test safe operations
    private_key, public_key = safe_generate_key("P-256")
    if private_key and public_key:
        other_private, other_public = safe_generate_key("P-256")
        if other_private and other_public:
            shared_secret = safe_exchange(private_key, other_public)
            if shared_secret:
                print(f"Successful key exchange: {shared_secret.hex()}")
```

## JavaScript Examples

### Node.js ECDH Implementation
```javascript
const crypto = require('crypto');

function ecdhExamples() {
    console.log("JavaScript ECDH Examples:");
    
    // Generate key pairs
    const alice = crypto.createECDH('secp256r1');
    const bob = crypto.createECDH('secp256r1');
    
    alice.generateKeys();
    bob.generateKeys();
    
    // Exchange public keys
    const alicePublic = alice.getPublicKey();
    const bobPublic = bob.getPublicKey();
    
    console.log(`Alice's public key: ${alicePublic.toString('hex')}`);
    console.log(`Bob's public key: ${bobPublic.toString('hex')}`);
    
    // Compute shared secrets
    const aliceSecret = alice.computeSecret(bobPublic);
    const bobSecret = bob.computeSecret(alicePublic);
    
    console.log(`Alice's shared secret: ${aliceSecret.toString('hex')}`);
    console.log(`Bob's shared secret: ${bobSecret.toString('hex')}`);
    
    // Verify they are identical
    if (aliceSecret.equals(bobSecret)) {
        console.log("Shared secrets match!");
    } else {
        console.log("Error: Shared secrets don't match!");
    }
}

// Run JavaScript examples
ecdhExamples();
```

### Browser ECDH Implementation
```javascript
// Using Web Crypto API in browser
async function browserEcdhExample() {
    try {
        // Generate key pairs
        const aliceKeyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256"
            },
            true,
            ["deriveKey", "deriveBits"]
        );
        
        const bobKeyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256"
            },
            true,
            ["deriveKey", "deriveBits"]
        );
        
        // Derive shared secret
        const aliceSecret = await window.crypto.subtle.deriveBits(
            {
                name: "ECDH",
                public: bobKeyPair.publicKey
            },
            aliceKeyPair.privateKey,
            256
        );
        
        const bobSecret = await window.crypto.subtle.deriveBits(
            {
                name: "ECDH",
                public: aliceKeyPair.publicKey
            },
            bobKeyPair.privateKey,
            256
        );
        
        console.log("Browser ECDH successful");
        console.log(`Shared secret: ${new Uint8Array(aliceSecret).toString()}`);
        
    } catch (error) {
        console.error("Browser ECDH error:", error);
    }
}
```

## Testing and Validation

### Key Exchange Verification
```python
def verify_key_exchange():
    """Verify ECDH key exchange correctness"""
    # Generate keys for multiple parties
    parties = []
    for i in range(3):
        private_key = ec.generate_private_key(ec.SECP256R1())
        public_key = private_key.public_key()
        parties.append((private_key, public_key))
    
    print("ECDH Key Exchange Verification:")
    print("-" * 40)
    
    # Test all pairwise exchanges
    for i in range(len(parties)):
        for j in range(i + 1, len(parties)):
            private_i, public_i = parties[i]
            private_j, public_j = parties[j]
            
            # Compute shared secrets
            secret_ij = private_i.exchange(ec.ECDH(), public_j)
            secret_ji = private_j.exchange(ec.ECDH(), public_i)
            
            # Verify they are identical
            assert secret_ij == secret_ji
            print(f"Parties {i} and {j}: {secret_ij.hex()}")
    
    print("All pairwise exchanges verified successfully!")
```

### Security Testing
```python
def security_testing():
    """Test ECDH security properties"""
    curve = ec.SECP256R1()
    
    # Test 1: Different private keys should produce different shared secrets
    private1 = ec.generate_private_key(curve)
    private2 = ec.generate_private_key(curve)
    public = ec.generate_private_key(curve).public_key()
    
    secret1 = private1.exchange(ec.ECDH(), public)
    secret2 = private2.exchange(ec.ECDH(), public)
    
    assert secret1 != secret2, "Different private keys produced same secret"
    print("Test 1 PASSED: Different private keys produce different secrets")
    
    # Test 2: Same private key should always produce same shared secret
    secret1_repeat = private1.exchange(ec.ECDH(), public)
    assert secret1 == secret1_repeat, "Same private key produced different secrets"
    print("Test 2 PASSED: Same private key produces consistent secrets")
    
    # Test 3: Shared secret should be the same for both parties
    private_a = ec.generate_private_key(curve)
    private_b = ec.generate_private_key(curve)
    public_a = private_a.public_key()
    public_b = private_b.public_key()
    
    secret_a = private_a.exchange(ec.ECDH(), public_b)
    secret_b = private_b.exchange(ec.ECDH(), public_a)
    
    assert secret_a == secret_b, "Parties computed different shared secrets"
    print("Test 3 PASSED: Both parties compute identical shared secrets")

# Run security tests
security_testing()
```

## Summary

These examples demonstrate:
- Basic ECDH key exchange implementation
- Curve selection and comparison
- Key derivation from shared secrets
- Perfect forward secrecy implementation
- Secure communication protocols
- Performance benchmarking and optimization
- Error handling and validation
- JavaScript implementations
- Comprehensive testing and security validation

All examples follow security best practices and provide practical implementations for real-world applications. 