# RSA 代码示例

## Python 示例

### 基本RSA密钥生成
```python
from Crypto.PublicKey import RSA
import os

def generate_rsa_key_pair(key_size=2048):
    """生成RSA密钥对"""
    key = RSA.generate(key_size)
    private_key = key
    public_key = key.publickey()
    
    print(f"生成了{key_size}位RSA密钥对")
    print(f"公钥模数: {public_key.n}")
    print(f"公钥指数: {public_key.e}")
    
    return private_key, public_key

def save_keys_to_files(private_key, public_key, prefix="rsa"):
    """保存RSA密钥到PEM文件"""
    # 保存私钥
    with open(f"{prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key())
    
    # 保存公钥
    with open(f"{prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key())
    
    print(f"密钥保存为{prefix}_private.pem和{prefix}_public.pem")

# 使用
private_key, public_key = generate_rsa_key_pair(2048)
save_keys_to_files(private_key, public_key)
```

### RSA加密和解密
```python
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
import base64

def rsa_encrypt(public_key, message):
    """使用RSA和OAEP填充加密消息"""
    cipher = PKCS1_OAEP.new(public_key)
    ciphertext = cipher.encrypt(message.encode())
    return base64.b64encode(ciphertext).decode()

def rsa_decrypt(private_key, encrypted_message):
    """使用RSA和OAEP填充解密消息"""
    cipher = PKCS1_OAEP.new(private_key)
    ciphertext = base64.b64decode(encrypted_message.encode())
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode()

# 使用示例
message = "Hello, RSA encryption!"
encrypted = rsa_encrypt(public_key, message)
decrypted = rsa_decrypt(private_key, encrypted)

print(f"原文: {message}")
print(f"加密: {encrypted}")
print(f"解密: {decrypted}")
```

### RSA数字签名
```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
import base64

def rsa_sign(private_key, message):
    """使用RSA签名消息"""
    hash_obj = SHA256.new(message.encode())
    signature = pkcs1_15.new(private_key).sign(hash_obj)
    return base64.b64encode(signature).decode()

def rsa_verify(public_key, message, signature):
    """验证RSA签名"""
    hash_obj = SHA256.new(message.encode())
    signature_bytes = base64.b64decode(signature.encode())
    
    try:
        pkcs1_15.new(public_key).verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# 使用示例
document = "Important document to sign"
signature = rsa_sign(private_key, document)
is_valid = rsa_verify(public_key, document, signature)

print(f"文档: {document}")
print(f"签名: {signature}")
print(f"有效: {is_valid}")
```

## JavaScript 示例

### Node.js RSA实现
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
    
    console.log(`生成了${keySize}位RSA密钥对`);
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

// 使用示例
const { privateKey, publicKey } = generateRSAKeyPair(2048);
const message = "Hello, RSA in Node.js!";
const encrypted = rsaEncrypt(publicKey, message);
const decrypted = rsaDecrypt(privateKey, encrypted);

console.log(`原文: ${message}`);
console.log(`解密: ${decrypted}`);
```

### JavaScript中的RSA签名
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

// 使用示例
const document = "Important document";
const signature = rsaSign(privateKey, document);
const isValid = rsaVerify(publicKey, document, signature);

console.log(`文档: ${document}`);
console.log(`签名有效: ${isValid}`);
```

## Java 示例

### Bouncy Castle RSA实现
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
        
        System.out.println("生成了" + keySize + "位RSA密钥对");
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

### Java中的RSA签名
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
        
        System.out.println("原文: " + message);
        System.out.println("解密: " + decrypted);
        
        String signature = rsaSign(keyPair.getPrivate(), message);
        boolean isValid = rsaVerify(keyPair.getPublic(), message, signature);
        System.out.println("签名有效: " + isValid);
    }
}
```

## Go 示例

### Go中的RSA实现
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
    fmt.Printf("生成了%d位RSA密钥对\n", bits)
    
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
    
    fmt.Printf("原文: %s\n", message)
    fmt.Printf("解密: %s\n", decrypted)
}
```

### Go中的RSA签名
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

// 在main函数中使用
document := "Important document"
signature, err := rsaSign(privateKey, document)
if err != nil {
    log.Fatal(err)
}

isValid, err := rsaVerify(publicKey, document, signature)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("文档: %s\n", document)
fmt.Printf("签名有效: %t\n", isValid)
```

## C++ 示例

### OpenSSL RSA实现
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
        
        std::cout << "生成了" << bits << "位RSA密钥对" << std::endl;
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
        std::cerr << "生成密钥对失败" << std::endl;
        return 1;
    }
    
    std::string message = "Hello, RSA in C++!";
    std::string encrypted = rsa.encrypt(message);
    std::string decrypted = rsa.decrypt(encrypted);
    
    std::cout << "原文: " << message << std::endl;
    std::cout << "解密: " << decrypted << std::endl;
    
    return 0;
}
```

## 性能和安全性

### 基准比较
```python
import time
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

def benchmark_rsa_operations():
    """比较不同密钥大小的RSA操作性能"""
    key_sizes = [1024, 2048, 3072, 4096]
    message = "Test message"
    
    for size in key_sizes:
        print(f"\n--- {size}位RSA ---")
        
        # 密钥生成
        start_time = time.time()
        key = RSA.generate(size)
        generation_time = time.time() - start_time
        
        # 加密
        cipher = PKCS1_OAEP.new(key.publickey())
        start_time = time.time()
        ciphertext = cipher.encrypt(message.encode())
        encrypt_time = time.time() - start_time
        
        # 解密
        cipher = PKCS1_OAEP.new(key)
        start_time = time.time()
        cipher.decrypt(ciphertext)
        decrypt_time = time.time() - start_time
        
        print(f"密钥生成: {generation_time:.3f}s")
        print(f"加密: {encrypt_time*1000:.2f}ms")
        print(f"解密: {decrypt_time*1000:.2f}ms")

def security_analysis():
    """RSA安全考虑"""
    print("\nRSA安全分析:")
    print("✅ 使用密钥大小 >= 2048位")
    print("✅ 加密使用OAEP填充")
    print("✅ 签名使用PSS填充")
    print("❌ 避免PKCS#1 v1.5填充")
    print("❌ 避免小公钥指数(e=3)")
    print("❌ 不要在应用程序间重用密钥")
```

### 密钥管理示例
```python
def key_derivation_example():
    """RSA密钥派生"""
    from Crypto.Protocol.KDF import PBKDF2
    from Crypto.Hash import SHA256
    
    password = "my_secure_password"
    salt = os.urandom(16)
    
    # 从密码派生密钥材料
    key_material = PBKDF2(password.encode(), salt, dkLen=32, count=100000, 
                          hmac_hash_module=SHA256)
    
    print(f"密码: {password}")
    print(f"盐值: {salt.hex()}")
    print(f"派生的密钥材料: {key_material.hex()}")
    
    return key_material, salt

def key_validation_example():
    """验证RSA密钥参数"""
    def validate_rsa_key(key):
        issues = []
        
        if key.size_in_bits() < 2048:
            issues.append("密钥大小太小(< 2048位)")
        
        if key.e == 3:
            issues.append("公钥指数e=3可能容易受到攻击")
        
        if key.e != 65537:
            issues.append("非标准公钥指数")
        
        if key.p == key.q:
            issues.append("素因子相同")
        
        return issues
    
    # 测试密钥验证
    key = RSA.generate(2048)
    issues = validate_rsa_key(key)
    
    if issues:
        print("密钥验证问题:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("密钥验证通过")
``` 