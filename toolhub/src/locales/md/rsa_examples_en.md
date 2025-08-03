# RSA Code Examples

## Python Examples

### Basic RSA Key Generation
```python
from Crypto.PublicKey import RSA
import os

def generate_rsa_key_pair(key_size=2048):
    """Generate RSA key pair"""
    key = RSA.generate(key_size)
    private_key = key
    public_key = key.publickey()
    
    print(f"Generated {key_size}-bit RSA key pair")
    print(f"Public key modulus: {public_key.n}")
    print(f"Public key exponent: {public_key.e}")
    
    return private_key, public_key

def save_keys_to_files(private_key, public_key, prefix="rsa"):
    """Save RSA keys to PEM files"""
    # Save private key
    with open(f"{prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key())
    
    # Save public key
    with open(f"{prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key())
    
    print(f"Keys saved as {prefix}_private.pem and {prefix}_public.pem")

# Usage
private_key, public_key = generate_rsa_key_pair(2048)
save_keys_to_files(private_key, public_key)
```

### RSA Encryption and Decryption
```python
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
import base64

def rsa_encrypt(public_key, message):
    """Encrypt message using RSA with OAEP padding"""
    cipher = PKCS1_OAEP.new(public_key)
    ciphertext = cipher.encrypt(message.encode())
    return base64.b64encode(ciphertext).decode()

def rsa_decrypt(private_key, encrypted_message):
    """Decrypt message using RSA with OAEP padding"""
    cipher = PKCS1_OAEP.new(private_key)
    ciphertext = base64.b64decode(encrypted_message.encode())
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode()

# Example usage
message = "Hello, RSA encryption!"
encrypted = rsa_encrypt(public_key, message)
decrypted = rsa_decrypt(private_key, encrypted)

print(f"Original: {message}")
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")
```

### RSA Digital Signatures
```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
import base64

def rsa_sign(private_key, message):
    """Sign message using RSA"""
    hash_obj = SHA256.new(message.encode())
    signature = pkcs1_15.new(private_key).sign(hash_obj)
    return base64.b64encode(signature).decode()

def rsa_verify(public_key, message, signature):
    """Verify RSA signature"""
    hash_obj = SHA256.new(message.encode())
    signature_bytes = base64.b64decode(signature.encode())
    
    try:
        pkcs1_15.new(public_key).verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# Example usage
document = "Important document to sign"
signature = rsa_sign(private_key, document)
is_valid = rsa_verify(public_key, document, signature)

print(f"Document: {document}")
print(f"Signature: {signature}")
print(f"Valid: {is_valid}")
```

## JavaScript Examples

### Node.js RSA Implementation
```javascript
const crypto = require('crypto');

function generateRSAKeyPair(keySize = 2048) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    
    console.log(`Generated ${keySize}-bit RSA key pair`);
    return { privateKey, publicKey };
}

function rsaEncrypt(publicKey, message) {
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        Buffer.from(message, 'utf8')
    );
    return encrypted.toString('base64');
}

function rsaDecrypt(privateKey, encryptedMessage) {
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        Buffer.from(encryptedMessage, 'base64')
    );
    return decrypted.toString('utf8');
}

// Usage example
const { privateKey, publicKey } = generateRSAKeyPair(2048);
const message = "Hello, RSA in Node.js!";
const encrypted = rsaEncrypt(publicKey, message);
const decrypted = rsaDecrypt(privateKey, encrypted);

console.log(`Original: ${message}`);
console.log(`Decrypted: ${decrypted}`);
```

### RSA Signatures in JavaScript
```javascript
function rsaSign(privateKey, message) {
    const signature = crypto.sign('sha256', Buffer.from(message, 'utf8'), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    });
    return signature.toString('base64');
}

function rsaVerify(publicKey, message, signature) {
    try {
        const isValid = crypto.verify('sha256', Buffer.from(message, 'utf8'), {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, Buffer.from(signature, 'base64'));
        return isValid;
    } catch (error) {
        return false;
    }
}

// Example usage
const document = "Important document";
const signature = rsaSign(privateKey, document);
const isValid = rsaVerify(publicKey, document, signature);

console.log(`Document: ${document}`);
console.log(`Signature valid: ${isValid}`);
```

## Java Examples

### Bouncy Castle RSA Implementation
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class RSAExample {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public static KeyPair generateRSAKeyPair(int keySize) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA", "BC");
        keyGen.initialize(keySize);
        KeyPair keyPair = keyGen.generateKeyPair();
        
        System.out.println("Generated " + keySize + "-bit RSA key pair");
        return keyPair;
    }
    
    public static String rsaEncrypt(PublicKey publicKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding", "BC");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        
        byte[] encrypted = cipher.doFinal(message.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }
    
    public static String rsaDecrypt(PrivateKey privateKey, String encryptedMessage) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding", "BC");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedMessage));
        return new String(decrypted);
    }
}
```

### RSA Signatures in Java
```java
import java.security.Signature;

public class RSASignatureExample {
    public static String rsaSign(PrivateKey privateKey, String message) throws Exception {
        Signature signature = Signature.getInstance("SHA256withRSA", "BC");
        signature.initSign(privateKey);
        signature.update(message.getBytes());
        
        byte[] signed = signature.sign();
        return Base64.getEncoder().encodeToString(signed);
    }
    
    public static boolean rsaVerify(PublicKey publicKey, String message, String signature) throws Exception {
        Signature sig = Signature.getInstance("SHA256withRSA", "BC");
        sig.initVerify(publicKey);
        sig.update(message.getBytes());
        
        return sig.verify(Base64.getDecoder().decode(signature));
    }
    
    public static void main(String[] args) throws Exception {
        KeyPair keyPair = RSAExample.generateRSAKeyPair(2048);
        
        String message = "Hello, RSA in Java!";
        String encrypted = RSAExample.rsaEncrypt(keyPair.getPublic(), message);
        String decrypted = RSAExample.rsaDecrypt(keyPair.getPrivate(), encrypted);
        
        System.out.println("Original: " + message);
        System.out.println("Decrypted: " + decrypted);
        
        String signature = rsaSign(keyPair.getPrivate(), message);
        boolean isValid = rsaVerify(keyPair.getPublic(), message, signature);
        System.out.println("Signature valid: " + isValid);
    }
}
```

## Go Examples

### RSA Implementation in Go
```go
package main

import (
    "crypto/rand"
    "crypto/rsa"
    "crypto/sha256"
    "crypto/x509"
    "encoding/base64"
    "encoding/pem"
    "fmt"
    "log"
)

func generateRSAKeyPair(bits int) (*rsa.PrivateKey, *rsa.PublicKey, error) {
    privateKey, err := rsa.GenerateKey(rand.Reader, bits)
    if err != nil {
        return nil, nil, err
    }
    
    publicKey := &privateKey.PublicKey
    fmt.Printf("Generated %d-bit RSA key pair\n", bits)
    
    return privateKey, publicKey, nil
}

func rsaEncrypt(publicKey *rsa.PublicKey, message string) (string, error) {
    encrypted, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, publicKey, []byte(message), nil)
    if err != nil {
        return "", err
    }
    
    return base64.StdEncoding.EncodeToString(encrypted), nil
}

func rsaDecrypt(privateKey *rsa.PrivateKey, encryptedMessage string) (string, error) {
    encrypted, err := base64.StdEncoding.DecodeString(encryptedMessage)
    if err != nil {
        return "", err
    }
    
    decrypted, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, privateKey, encrypted, nil)
    if err != nil {
        return "", err
    }
    
    return string(decrypted), nil
}

func main() {
    privateKey, publicKey, err := generateRSAKeyPair(2048)
    if err != nil {
        log.Fatal(err)
    }
    
    message := "Hello, RSA in Go!"
    encrypted, err := rsaEncrypt(publicKey, message)
    if err != nil {
        log.Fatal(err)
    }
    
    decrypted, err := rsaDecrypt(privateKey, encrypted)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Original: %s\n", message)
    fmt.Printf("Decrypted: %s\n", decrypted)
}
```

### RSA Signatures in Go
```go
func rsaSign(privateKey *rsa.PrivateKey, message string) (string, error) {
    hashed := sha256.Sum256([]byte(message))
    signature, err := rsa.SignPKCS1v15(rand.Reader, privateKey, crypto.SHA256, hashed[:])
    if err != nil {
        return "", err
    }
    
    return base64.StdEncoding.EncodeToString(signature), nil
}

func rsaVerify(publicKey *rsa.PublicKey, message, signature string) (bool, error) {
    hashed := sha256.Sum256([]byte(message))
    signatureBytes, err := base64.StdEncoding.DecodeString(signature)
    if err != nil {
        return false, err
    }
    
    err = rsa.VerifyPKCS1v15(publicKey, crypto.SHA256, hashed[:], signatureBytes)
    return err == nil, nil
}

// Usage in main function
document := "Important document"
signature, err := rsaSign(privateKey, document)
if err != nil {
    log.Fatal(err)
}

isValid, err := rsaVerify(publicKey, document, signature)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Document: %s\n", document)
fmt.Printf("Signature valid: %t\n", isValid)
```

## C++ Examples

### OpenSSL RSA Implementation
```cpp
#include <openssl/rsa.h>
#include <openssl/pem.h>
#include <openssl/err.h>
#include <iostream>
#include <string>
#include <vector>

class RSAEncryption {
private:
    RSA* privateKey;
    RSA* publicKey;
    
public:
    RSAEncryption() {
        privateKey = nullptr;
        publicKey = nullptr;
    }
    
    ~RSAEncryption() {
        if (privateKey) RSA_free(privateKey);
        if (publicKey) RSA_free(publicKey);
    }
    
    bool generateKeyPair(int bits) {
        BIGNUM* e = BN_new();
        BN_set_word(e, RSA_F4);
        
        privateKey = RSA_new();
        if (!RSA_generate_key_ex(privateKey, bits, e, nullptr)) {
            BN_free(e);
            return false;
        }
        
        publicKey = RSAPublicKey_dup(privateKey);
        BN_free(e);
        
        std::cout << "Generated " << bits << "-bit RSA key pair" << std::endl;
        return true;
    }
    
    std::string encrypt(const std::string& message) {
        std::vector<unsigned char> encrypted(RSA_size(publicKey));
        int result = RSA_public_encrypt(message.length(), 
                                       (unsigned char*)message.c_str(),
                                       encrypted.data(), publicKey, RSA_PKCS1_OAEP_PADDING);
        
        if (result == -1) return "";
        
        return std::string(encrypted.begin(), encrypted.begin() + result);
    }
    
    std::string decrypt(const std::string& encrypted) {
        std::vector<unsigned char> decrypted(RSA_size(privateKey));
        int result = RSA_private_decrypt(encrypted.length(),
                                        (unsigned char*)encrypted.c_str(),
                                        decrypted.data(), privateKey, RSA_PKCS1_OAEP_PADDING);
        
        if (result == -1) return "";
        
        return std::string(decrypted.begin(), decrypted.begin() + result);
    }
};

int main() {
    RSAEncryption rsa;
    if (!rsa.generateKeyPair(2048)) {
        std::cerr << "Failed to generate key pair" << std::endl;
        return 1;
    }
    
    std::string message = "Hello, RSA in C++!";
    std::string encrypted = rsa.encrypt(message);
    std::string decrypted = rsa.decrypt(encrypted);
    
    std::cout << "Original: " << message << std::endl;
    std::cout << "Decrypted: " << decrypted << std::endl;
    
    return 0;
}
```

## Performance and Security

### Benchmark Comparison
```python
import time
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

def benchmark_rsa_operations():
    """Benchmark RSA operations across different key sizes"""
    key_sizes = [1024, 2048, 3072, 4096]
    message = "Test message"
    
    for size in key_sizes:
        print(f"\n--- {size}-bit RSA ---")
        
        # Key generation
        start_time = time.time()
        key = RSA.generate(size)
        generation_time = time.time() - start_time
        
        # Encryption
        cipher = PKCS1_OAEP.new(key.publickey())
        start_time = time.time()
        ciphertext = cipher.encrypt(message.encode())
        encrypt_time = time.time() - start_time
        
        # Decryption
        cipher = PKCS1_OAEP.new(key)
        start_time = time.time()
        cipher.decrypt(ciphertext)
        decrypt_time = time.time() - start_time
        
        print(f"Key generation: {generation_time:.3f}s")
        print(f"Encryption: {encrypt_time*1000:.2f}ms")
        print(f"Decryption: {decrypt_time*1000:.2f}ms")

def security_analysis():
    """RSA security considerations"""
    print("\nRSA Security Analysis:")
    print("✅ Use key size >= 2048 bits")
    print("✅ Use OAEP padding for encryption")
    print("✅ Use PSS padding for signatures")
    print("❌ Avoid PKCS#1 v1.5 padding")
    print("❌ Avoid small public exponents (e=3)")
    print("❌ Don't reuse keys across applications")
```

### Key Management Examples
```python
def key_derivation_example():
    """Key derivation for RSA"""
    from Crypto.Protocol.KDF import PBKDF2
    from Crypto.Hash import SHA256
    
    password = "my_secure_password"
    salt = os.urandom(16)
    
    # Derive key material from password
    key_material = PBKDF2(password.encode(), salt, dkLen=32, count=100000, 
                          hmac_hash_module=SHA256)
    
    print(f"Password: {password}")
    print(f"Salt: {salt.hex()}")
    print(f"Derived key material: {key_material.hex()}")
    
    return key_material, salt

def key_validation_example():
    """Validate RSA key parameters"""
    def validate_rsa_key(key):
        issues = []
        
        if key.size_in_bits() < 2048:
            issues.append("Key size too small (< 2048 bits)")
        
        if key.e == 3:
            issues.append("Public exponent e=3 may be vulnerable")
        
        if key.e != 65537:
            issues.append("Non-standard public exponent")
        
        if key.p == key.q:
            issues.append("Prime factors are identical")
        
        return issues
    
    # Test key validation
    key = RSA.generate(2048)
    issues = validate_rsa_key(key)
    
    if issues:
        print("Key validation issues:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("Key validation passed")
``` 