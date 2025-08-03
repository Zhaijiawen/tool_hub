# DES 代码示例

## Python 示例

### 基本DES加密
```python
import os
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad

def basic_des_encrypt():
    """基本DES加密示例"""
    # 生成随机密钥
    key = os.urandom(8)
    plaintext = "Hello, DES encryption!"
    
    # 创建密码
    cipher = DES.new(key, DES.MODE_ECB)
    
    # 填充和加密
    padded_data = pad(plaintext.encode(), DES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    
    print(f"Key: {key.hex()}")
    print(f"Plaintext: {plaintext}")
    print(f"Ciphertext: {ciphertext.hex()}")
    
    return key, ciphertext

def basic_des_decrypt(key, ciphertext):
    """基本DES解密示例"""
    cipher = DES.new(key, DES.MODE_ECB)
    padded_data = cipher.decrypt(ciphertext)
    plaintext = unpad(padded_data, DES.block_size)
    return plaintext.decode()
```

### 带CBC模式的DES
```python
def des_cbc_example():
    """带CBC模式的DES示例"""
    key = os.urandom(8)
    iv = os.urandom(8)
    plaintext = "This is a longer message for CBC mode"
    
    # 加密
    cipher = DES.new(key, DES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode(), DES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    
    # 解密
    cipher = DES.new(key, DES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    decrypted = unpad(padded_data, DES.block_size)
    
    print(f"Original: {plaintext}")
    print(f"Decrypted: {decrypted.decode()}")
    
    return key, iv, ciphertext
```

### 三重DES实现
```python
from Crypto.Cipher import DES3

def triple_des_example():
    """三重DES加密示例"""
    # 为3DES生成24字节密钥
    key = os.urandom(24)
    plaintext = "Triple DES provides better security"
    
    # 加密
    cipher = DES3.new(key, DES3.MODE_ECB)
    padded_data = pad(plaintext.encode(), DES3.block_size)
    ciphertext = cipher.encrypt(padded_data)
    
    # 解密
    cipher = DES3.new(key, DES3.MODE_ECB)
    padded_data = cipher.decrypt(ciphertext)
    decrypted = unpad(padded_data, DES3.block_size)
    
    print(f"3DES Key: {key.hex()}")
    print(f"Original: {plaintext}")
    print(f"Decrypted: {decrypted.decode()}")
    
    return key, ciphertext
```

## JavaScript 示例

### CryptoJS DES实现
```javascript
const CryptoJS = require('crypto-js');

function desEncrypt(plaintext, key) {
    // 将密钥转换为WordArray
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    
    // 加密
    const encrypted = CryptoJS.DES.encrypt(plaintext, keyBytes, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
}

function desDecrypt(ciphertext, key) {
    // 将密钥转换为WordArray
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    
    // 解密
    const decrypted = CryptoJS.DES.decrypt(ciphertext, keyBytes, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// 使用示例
const key = '0123456789abcdef';
const message = 'Hello, DES in JavaScript!';
const encrypted = desEncrypt(message, key);
const decrypted = desDecrypt(encrypted, key);

console.log('Original:', message);
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
```

### JavaScript中的CBC模式DES
```javascript
function desCbcEncrypt(plaintext, key, iv) {
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    const ivBytes = CryptoJS.enc.Hex.parse(iv);
    
    const encrypted = CryptoJS.DES.encrypt(plaintext, keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
}

function desCbcDecrypt(ciphertext, key, iv) {
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    const ivBytes = CryptoJS.enc.Hex.parse(iv);
    
    const decrypted = CryptoJS.DES.decrypt(ciphertext, keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// 生成随机密钥和IV
const key = CryptoJS.lib.WordArray.random(8).toString();
const iv = CryptoJS.lib.WordArray.random(8).toString();
const message = 'CBC mode provides better security';

const encrypted = desCbcEncrypt(message, key, iv);
const decrypted = desCbcDecrypt(encrypted, key, iv);
```

## Java 示例

### Bouncy Castle DES实现
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.security.Security;
import java.util.Base64;

public class DESExample {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public static String desEncrypt(String plaintext, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding", "BC");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        
        byte[] encrypted = cipher.doFinal(plaintext.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }
    
    public static String desDecrypt(String ciphertext, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding", "BC");
        cipher.init(Cipher.DECRYPT_MODE, key);
        
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(ciphertext));
        return new String(decrypted);
    }
    
    public static SecretKey generateKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("DES", "BC");
        keyGen.init(56); // DES密钥大小
        return keyGen.generateKey();
    }
}
```

### Java中的CBC模式DES
```java
public class DESCBCExample {
    public static String desCbcEncrypt(String plaintext, SecretKey key, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding", "BC");
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, ivSpec);
        
        byte[] encrypted = cipher.doFinal(plaintext.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }
    
    public static String desCbcDecrypt(String ciphertext, SecretKey key, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding", "BC");
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        cipher.init(Cipher.DECRYPT_MODE, key, ivSpec);
        
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(ciphertext));
        return new String(decrypted);
    }
    
    public static void main(String[] args) throws Exception {
        SecretKey key = DESExample.generateKey();
        byte[] iv = new byte[8]; // 实际中生成随机IV
        String message = "Hello, DES CBC mode!";
        
        String encrypted = desCbcEncrypt(message, key, iv);
        String decrypted = desCbcDecrypt(encrypted, key, iv);
        
        System.out.println("Original: " + message);
        System.out.println("Decrypted: " + decrypted);
    }
}
```

## Go 示例

### Go中的DES实现
```go
package main

import (
    "crypto/cipher"
    "crypto/des"
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "log"
)

func desEncrypt(plaintext []byte, key []byte) ([]byte, error) {
    block, err := des.NewCipher(key)
    if err != nil {
        return nil, err
    }
    
    // 填充明文
    padded := pkcs7Pad(plaintext, des.BlockSize)
    
    // 加密
    ciphertext := make([]byte, len(padded))
    mode := cipher.NewCBCEncrypter(block, make([]byte, des.BlockSize))
    mode.CryptBlocks(ciphertext, padded)
    
    return ciphertext, nil
}

func desDecrypt(ciphertext []byte, key []byte) ([]byte, error) {
    block, err := des.NewCipher(key)
    if err != nil {
        return nil, err
    }
    
    // 解密
    plaintext := make([]byte, len(ciphertext))
    mode := cipher.NewCBCDecrypter(block, make([]byte, des.BlockSize))
    mode.CryptBlocks(plaintext, ciphertext)
    
    // 去除填充
    return pkcs7Unpad(plaintext)
}

func pkcs7Pad(data []byte, blockSize int) []byte {
    padding := blockSize - len(data)%blockSize
    padtext := make([]byte, padding)
    for i := range padtext {
        padtext[i] = byte(padding)
    }
    return append(data, padtext...)
}

func pkcs7Unpad(data []byte) ([]byte, error) {
    length := len(data)
    if length == 0 {
        return nil, fmt.Errorf("invalid padding")
    }
    
    padding := int(data[length-1])
    if padding > length {
        return nil, fmt.Errorf("invalid padding")
    }
    
    return data[:length-padding], nil
}

func main() {
    // 生成随机密钥
    key := make([]byte, 8)
    rand.Read(key)
    
    message := []byte("Hello, DES in Go!")
    
    encrypted, err := desEncrypt(message, key)
    if err != nil {
        log.Fatal(err)
    }
    
    decrypted, err := desDecrypt(encrypted, key)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Key: %x\n", key)
    fmt.Printf("Original: %s\n", message)
    fmt.Printf("Decrypted: %s\n", decrypted)
}
```

## C++ 示例

### OpenSSL DES实现
```cpp
#include <openssl/des.h>
#include <openssl/rand.h>
#include <iostream>
#include <string>
#include <vector>

class DESEncryption {
private:
    DES_key_schedule key_schedule;
    
public:
    DESEncryption(const std::string& key) {
        DES_cblock des_key;
        // 将字符串密钥转换为DES_cblock
        for (int i = 0; i < 8; i++) {
            des_key[i] = key[i];
        }
        
        DES_set_key(&des_key, &key_schedule);
    }
    
    std::vector<unsigned char> encrypt(const std::string& plaintext) {
        std::vector<unsigned char> ciphertext;
        DES_cblock input_block, output_block;
        
        // 将明文填充到8字节块
        std::string padded = plaintext;
        int padding = 8 - (plaintext.length() % 8);
        padded.append(padding, static_cast<char>(padding));
        
        for (size_t i = 0; i < padded.length(); i += 8) {
            // 将8字节复制到输入块
            for (int j = 0; j < 8; j++) {
                input_block[j] = padded[i + j];
            }
            
            // 加密块
            DES_ecb_encrypt(&input_block, &output_block, &key_schedule, DES_ENCRYPT);
            
            // 将结果复制到密文
            for (int j = 0; j < 8; j++) {
                ciphertext.push_back(output_block[j]);
            }
        }
        
        return ciphertext;
    }
    
    std::string decrypt(const std::vector<unsigned char>& ciphertext) {
        std::string plaintext;
        DES_cblock input_block, output_block;
        
        for (size_t i = 0; i < ciphertext.size(); i += 8) {
            // 将8字节复制到输入块
            for (int j = 0; j < 8; j++) {
                input_block[j] = ciphertext[i + j];
            }
            
            // 解密块
            DES_ecb_encrypt(&input_block, &output_block, &key_schedule, DES_DECRYPT);
            
            // 将结果复制到明文
            for (int j = 0; j < 8; j++) {
                plaintext.push_back(output_block[j]);
            }
        }
        
        // 移除填充
        int padding = plaintext.back();
        plaintext.resize(plaintext.length() - padding);
        
        return plaintext;
    }
};

int main() {
    std::string key = "12345678";  // 8字节密钥
    std::string message = "Hello, DES in C++!";
    
    DESEncryption des(key);
    
    auto encrypted = des.encrypt(message);
    std::string decrypted = des.decrypt(encrypted);
    
    std::cout << "Original: " << message << std::endl;
    std::cout << "Decrypted: " << decrypted << std::endl;
    
    return 0;
}
```

## 性能和安全性

### 基准比较
```python
import time
import os
from Crypto.Cipher import DES, AES

def benchmark_encryption():
    """比较DES与AES性能"""
    data = os.urandom(1024 * 1024)  # 1MB
    
    # DES基准测试
    des_key = os.urandom(8)
    start_time = time.time()
    cipher = DES.new(des_key, DES.MODE_ECB)
    cipher.encrypt(data)
    des_time = time.time() - start_time
    
    # AES基准测试
    aes_key = os.urandom(32)
    start_time = time.time()
    cipher = AES.new(aes_key, AES.MODE_ECB)
    cipher.encrypt(data)
    aes_time = time.time() - start_time
    
    print(f"DES encryption: {des_time:.4f}s")
    print(f"AES encryption: {aes_time:.4f}s")
    print(f"DES/AES ratio: {des_time/aes_time:.2f}x")

def security_analysis():
    """DES安全考虑"""
    print("DES Security Analysis:")
    print("1. Key size: 56 bits (too small for modern security)")
    print("2. Vulnerable to brute force attacks")
    print("3. Differential cryptanalysis resistance: 2^47 operations")
    print("4. Linear cryptanalysis resistance: 2^43 operations")
    print("5. Recommendation: Use AES for new applications")
    print("6. Triple DES provides 112-bit security")
```

### 密钥管理示例
```python
def key_derivation_example():
    """DES密钥派生"""
    from Crypto.Protocol.KDF import PBKDF2
    from Crypto.Hash import SHA256
    
    password = "my_secure_password"
    salt = os.urandom(16)
    
    # 从密码派生DES密钥
    key = PBKDF2(password.encode(), salt, dkLen=8, count=100000, 
                 hmac_hash_module=SHA256)
    
    print(f"Password: {password}")
    print(f"Salt: {salt.hex()}")
    print(f"Derived key: {key.hex()}")
    
    return key, salt

def key_validation_example():
    """验证DES密钥格式"""
    def validate_des_key(key):
        if len(key) != 8:
            return False, "Key must be 8 bytes"
        
        # 检查奇偶校验位（简化版）
        for i in range(8):
            bit_count = bin(key[i]).count('1')
            if bit_count % 2 == 0:
                return False, f"Invalid parity in byte {i}"
        
        return True, "Valid DES key"
    
    # 测试有效密钥
    valid_key = os.urandom(8)
    is_valid, message = validate_des_key(valid_key)
    print(f"Valid key test: {is_valid} - {message}")
    
    # 测试无效密钥
    invalid_key = b'\x00' * 8
    is_valid, message = validate_des_key(invalid_key)
    print(f"Invalid key test: {is_valid} - {message}")
``` 