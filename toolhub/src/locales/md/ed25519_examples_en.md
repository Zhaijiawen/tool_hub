# Ed25519 Code Examples

## Basic Ed25519 Operations

### Simple Key Generation and Signing
```python
import nacl.signing
import os

def basic_ed25519_example():
    """Basic Ed25519 key generation and signing example"""
    # Generate Ed25519 key pair
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # Sign a message
    message = "Hello, Ed25519!"
    signed_message = signing_key.sign(message.encode())
    
    # Verify the signature
    try:
        verify_key.verify(signed_message)
        print("Signature verification successful!")
        return True
    except nacl.exceptions.BadSignatureError:
        print("Signature verification failed!")
        return False

# Run example
basic_ed25519_example()
```

### Key Information Display
```python
def display_key_info():
    """Display Ed25519 key information"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    print("Ed25519 Key Information:")
    print(f"Private key (32 bytes): {bytes(signing_key).hex()}")
    print(f"Public key (32 bytes): {bytes(verify_key).hex()}")
    print(f"Private key length: {len(bytes(signing_key))} bytes")
    print(f"Public key length: {len(bytes(verify_key))} bytes")
    
    # Test signature size
    test_message = "Test"
    signature = signing_key.sign(test_message.encode()).signature
    print(f"Signature length: {len(signature)} bytes")
    print(f"Signature: {signature.hex()}")

display_key_info()
```

## Advanced Key Management

### Deterministic Key Generation
```python
import hashlib

def deterministic_key_from_seed(seed):
    """Generate Ed25519 key from seed deterministically"""
    # Hash the seed to get 32 bytes
    if isinstance(seed, str):
        seed = seed.encode()
    
    # Use SHA-256 to get 32 bytes
    key_material = hashlib.sha256(seed).digest()
    
    # Generate signing key from material
    signing_key = nacl.signing.SigningKey(key_material)
    verify_key = signing_key.verify_key
    
    print(f"Generated deterministic key from seed: {seed}")
    print(f"Public key: {bytes(verify_key).hex()}")
    
    return signing_key, verify_key

# Test deterministic generation
seed1 = "my_secret_seed"
seed2 = "my_secret_seed"

key1, _ = deterministic_key_from_seed(seed1)
key2, _ = deterministic_key_from_seed(seed2)

# Verify determinism
print(f"Keys are identical: {bytes(key1) == bytes(key2)}")
```

### Key Derivation from Password
```python
import hashlib
import os

def derive_key_from_password(password, salt=None):
    """Derive Ed25519 key from password using PBKDF2"""
    if salt is None:
        salt = os.urandom(16)
    
    # Use PBKDF2 to derive key material
    key_material = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, 32)
    
    # Generate Ed25519 key
    signing_key = nacl.signing.SigningKey(key_material)
    verify_key = signing_key.verify_key
    
    return signing_key, verify_key, salt

# Example usage
password = "my_secure_password"
signing_key, verify_key, salt = derive_key_from_password(password)

print(f"Derived key from password")
print(f"Salt: {salt.hex()}")
print(f"Public key: {bytes(verify_key).hex()}")

# Test with same password and salt
signing_key2, verify_key2, _ = derive_key_from_password(password, salt)
print(f"Keys match: {bytes(verify_key) == bytes(verify_key2)}")
```

## Signature Operations

### Basic Signing and Verification
```python
def sign_and_verify_example():
    """Complete Ed25519 signing and verification example"""
    # Generate keys
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # Messages to sign
    messages = [
        "Hello, World!",
        "Ed25519 is awesome",
        "Cryptographic signatures"
    ]
    
    signatures = []
    
    # Sign all messages
    for message in messages:
        signature = signing_key.sign(message.encode()).signature
        signatures.append(signature)
        print(f"Signed: {message}")
        print(f"Signature: {signature.hex()}")
    
    # Verify all signatures
    print("\nVerifying signatures:")
    for i, (message, signature) in enumerate(zip(messages, signatures)):
        try:
            # Create signed message for verification
            signed_message = nacl.signing.SignedMessage(message.encode() + signature)
            verify_key.verify(signed_message)
            print(f"✓ Message {i+1} verified successfully")
        except nacl.exceptions.BadSignatureError:
            print(f"✗ Message {i+1} verification failed")

sign_and_verify_example()
```

### Binary Data Signing
```python
def sign_binary_data():
    """Sign binary data with Ed25519"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # Binary data
    binary_data = b'\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09'
    
    # Sign binary data
    signature = signing_key.sign(binary_data).signature
    
    print(f"Binary data: {binary_data.hex()}")
    print(f"Signature: {signature.hex()}")
    
    # Verify binary data
    try:
        signed_message = nacl.signing.SignedMessage(binary_data + signature)
        verify_key.verify(signed_message)
        print("Binary data signature verified!")
    except nacl.exceptions.BadSignatureError:
        print("Binary data signature verification failed!")

sign_binary_data()
```

## File Operations

### File Signing and Verification
```python
def sign_file_example():
    """Sign and verify files using Ed25519"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # Create a test file
    test_content = "This is a test file for Ed25519 signing."
    with open("test_file.txt", "w") as f:
        f.write(test_content)
    
    # Sign the file
    with open("test_file.txt", "rb") as f:
        file_data = f.read()
    
    signature = signing_key.sign(file_data).signature
    
    # Save signature
    with open("test_file.sig", "wb") as f:
        f.write(signature)
    
    print(f"File signed: test_file.txt")
    print(f"Signature saved: test_file.sig")
    print(f"Signature: {signature.hex()}")
    
    # Verify the file
    with open("test_file.txt", "rb") as f:
        file_data = f.read()
    
    with open("test_file.sig", "rb") as f:
        signature = f.read()
    
    try:
        signed_message = nacl.signing.SignedMessage(file_data + signature)
        verify_key.verify(signed_message)
        print("File signature verified successfully!")
    except nacl.exceptions.BadSignatureError:
        print("File signature verification failed!")

sign_file_example()
```

## Batch Operations

### Batch Signature Verification
```python
def batch_verification_example():
    """Efficiently verify multiple Ed25519 signatures"""
    # Generate multiple key pairs
    num_keys = 10
    signing_keys = []
    verify_keys = []
    messages = []
    signatures = []
    
    for i in range(num_keys):
        signing_key = nacl.signing.SigningKey.generate()
        verify_key = signing_key.verify_key
        
        message = f"Message {i+1}"
        
        signing_keys.append(signing_key)
        verify_keys.append(verify_key)
        messages.append(message)
        signatures.append(signing_key.sign(message.encode()).signature)
    
    # Batch verify all signatures
    print("Batch verification results:")
    valid_count = 0
    
    for i in range(num_keys):
        try:
            signed_message = nacl.signing.SignedMessage(messages[i].encode() + signatures[i])
            verify_keys[i].verify(signed_message)
            print(f"✓ Message {i+1}: Valid")
            valid_count += 1
        except nacl.exceptions.BadSignatureError:
            print(f"✗ Message {i+1}: Invalid")
    
    print(f"\nTotal valid signatures: {valid_count}/{num_keys}")

batch_verification_example()
```

## Security Applications

### Secure Communication Protocol
```python
def secure_communication_example():
    """Simulate secure communication using Ed25519"""
    # Alice generates her key pair
    alice_signing_key = nacl.signing.SigningKey.generate()
    alice_verify_key = alice_signing_key.verify_key
    
    # Bob generates his key pair
    bob_signing_key = nacl.signing.SigningKey.generate()
    bob_verify_key = bob_signing_key.verify_key
    
    # Alice sends a signed message to Bob
    alice_message = "Hello Bob, this is Alice!"
    alice_signature = alice_signing_key.sign(alice_message.encode()).signature
    
    print("Alice's message:", alice_message)
    print("Alice's signature:", alice_signature.hex())
    
    # Bob verifies Alice's message
    try:
        signed_message = nacl.signing.SignedMessage(alice_message.encode() + alice_signature)
        alice_verify_key.verify(signed_message)
        print("Bob: Alice's message verified successfully!")
    except nacl.exceptions.BadSignatureError:
        print("Bob: Alice's message verification failed!")
    
    # Bob sends a signed response
    bob_message = "Hello Alice, this is Bob!"
    bob_signature = bob_signing_key.sign(bob_message.encode()).signature
    
    print("\nBob's message:", bob_message)
    print("Bob's signature:", bob_signature.hex())
    
    # Alice verifies Bob's message
    try:
        signed_message = nacl.signing.SignedMessage(bob_message.encode() + bob_signature)
        bob_verify_key.verify(signed_message)
        print("Alice: Bob's message verified successfully!")
    except nacl.exceptions.BadSignatureError:
        print("Alice: Bob's message verification failed!")

secure_communication_example()
```

## Performance Testing

### Ed25519 Performance Benchmark
```python
import time

def performance_benchmark():
    """Benchmark Ed25519 operations"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # Test data
    test_messages = [f"Test message {i}" for i in range(1000)]
    
    # Benchmark signing
    start_time = time.time()
    signatures = []
    for message in test_messages:
        signature = signing_key.sign(message.encode()).signature
        signatures.append(signature)
    signing_time = time.time() - start_time
    
    # Benchmark verification
    start_time = time.time()
    for i, message in enumerate(test_messages):
        signed_message = nacl.signing.SignedMessage(message.encode() + signatures[i])
        verify_key.verify(signed_message)
    verification_time = time.time() - start_time
    
    print("Ed25519 Performance Benchmark:")
    print(f"Signing 1000 messages: {signing_time:.4f} seconds")
    print(f"Verifying 1000 signatures: {verification_time:.4f} seconds")
    print(f"Average signing time: {signing_time/1000*1000:.2f} ms per signature")
    print(f"Average verification time: {verification_time/1000*1000:.2f} ms per verification")
    print(f"Signing throughput: {1000/signing_time:.0f} signatures/second")
    print(f"Verification throughput: {1000/verification_time:.0f} verifications/second")

performance_benchmark()
```

## Error Handling

### Robust Ed25519 Operations
```python
def robust_ed25519_operations():
    """Ed25519 operations with comprehensive error handling"""
    try:
        # Generate key
        signing_key = nacl.signing.SigningKey.generate()
        verify_key = signing_key.verify_key
        
        # Test signing with various inputs
        test_cases = [
            "Normal message",
            "",  # Empty string
            "A" * 1000,  # Long message
            "Unicode: 你好世界",  # Unicode
        ]
        
        for i, message in enumerate(test_cases):
            try:
                signature = signing_key.sign(message.encode()).signature
                print(f"✓ Test case {i+1}: Signed successfully")
                
                # Verify signature
                signed_message = nacl.signing.SignedMessage(message.encode() + signature)
                verify_key.verify(signed_message)
                print(f"✓ Test case {i+1}: Verified successfully")
                
            except Exception as e:
                print(f"✗ Test case {i+1}: Failed - {e}")
        
        # Test invalid signature
        try:
            invalid_signature = b'\x00' * 64
            signed_message = nacl.signing.SignedMessage(b"test" + invalid_signature)
            verify_key.verify(signed_message)
            print("✗ Invalid signature test: Should have failed")
        except nacl.exceptions.BadSignatureError:
            print("✓ Invalid signature test: Correctly rejected")
        
    except Exception as e:
        print(f"Critical error: {e}")

robust_ed25519_operations()
```

## JavaScript Examples

### Node.js Ed25519 Implementation
```javascript
const crypto = require('crypto');

function generateEd25519KeyPair() {
    // Generate Ed25519 key pair
    const keyPair = crypto.generateKeyPairSync('ed25519');
    
    console.log('Generated Ed25519 key pair');
    console.log('Public key:', keyPair.publicKey.export({type: 'spki', format: 'der'}).toString('hex'));
    
    return keyPair;
}

function signMessage(keyPair, message) {
    // Sign message
    const signature = crypto.sign(null, Buffer.from(message), keyPair.privateKey);
    return signature;
}

function verifySignature(keyPair, message, signature) {
    try {
        // Verify signature
        crypto.verify(null, Buffer.from(message), keyPair.publicKey, signature);
        return true;
    } catch (error) {
        return false;
    }
}

// Example usage
const keyPair = generateEd25519KeyPair();
const message = "Hello, Ed25519!";
const signature = signMessage(keyPair, message);

console.log('Message:', message);
console.log('Signature:', signature.toString('hex'));

const isValid = verifySignature(keyPair, message, signature);
console.log('Signature valid:', isValid);
```

## Testing and Validation

### Ed25519 Test Vectors
```python
def test_ed25519_vectors():
    """Test Ed25519 with known test vectors"""
    # Known test case (simplified)
    seed = b'\x00' * 32  # All zeros seed
    signing_key = nacl.signing.SigningKey(seed)
    verify_key = signing_key.verify_key
    
    message = b""
    signature = signing_key.sign(message).signature
    
    print("Ed25519 Test Vector:")
    print(f"Seed: {seed.hex()}")
    print(f"Public key: {bytes(verify_key).hex()}")
    print(f"Message: {message.hex()}")
    print(f"Signature: {signature.hex()}")
    
    # Verify the signature
    try:
        signed_message = nacl.signing.SignedMessage(message + signature)
        verify_key.verify(signed_message)
        print("✓ Test vector verification successful")
    except nacl.exceptions.BadSignatureError:
        print("✗ Test vector verification failed")

test_ed25519_vectors()
``` 