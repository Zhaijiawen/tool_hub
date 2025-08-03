# AES 代码示例

## Python 示例

### 基本AES加密
```python
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

def aes_encrypt(key, plaintext):
    """使用CBC模式的基本AES加密"""
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode(), AES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    return iv + ciphertext

def aes_decrypt(key, encrypted_data):
    """使用CBC模式的基本AES解密"""
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data, AES.block_size).decode()

# 使用示例
key = os.urandom(32)  # 256位密钥
message = "Hello, AES encryption!"
encrypted = aes_encrypt(key, message)
decrypted = aes_decrypt(key, encrypted)
print(f"原文: {message}")
print(f"解密后: {decrypted}")
```

### 使用GCM模式的AES
```python
from Crypto.Cipher import AES

def aes_gcm_encrypt(key, plaintext, associated_data=b""):
    """AES-GCM认证加密"""
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return cipher.nonce, ciphertext, tag

def aes_gcm_decrypt(key, nonce, ciphertext, tag, associated_data=b""):
    """AES-GCM认证解密"""
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        return "Authentication failed"

# 使用示例
key = os.urandom(32)
message = "Secure message with authentication"
nonce, ciphertext, tag = aes_gcm_encrypt(key, message)
result = aes_gcm_decrypt(key, nonce, ciphertext, tag)
```

### 文件加密
```python
def encrypt_file_aes(key, input_file, output_file):
    """使用AES-CBC加密文件"""
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            f_out.write(iv)  # 在开头写入IV
            
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                if len(chunk) % 16 != 0:
                    chunk = pad(chunk, AES.block_size)
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)

def decrypt_file_aes(key, input_file, output_file):
    """使用AES-CBC解密文件"""
    with open(input_file, 'rb') as f_in:
        iv = f_in.read(16)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        
        with open(output_file, 'wb') as f_out:
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                decrypted_chunk = cipher.decrypt(chunk)
                f_out.write(decrypted_chunk)
```

## JavaScript 示例

### CryptoJS实现
```javascript
const CryptoJS = require('crypto-js');

function aesEncrypt(plaintext, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

function aesDecrypt(encryptedData, key) {
    const data = CryptoJS.enc.Base64.parse(encryptedData);
    const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4));
    const ciphertext = CryptoJS.lib.WordArray.create(data.words.slice(4));
    
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// 使用示例
const key = "my-secret-key-32-chars-long!!";
const message = "Hello, AES encryption!";
const encrypted = aesEncrypt(message, key);
const decrypted = aesDecrypt(encrypted, key);
console.log("原文:", message);
console.log("解密后:", decrypted);
```

### Web Crypto API
```javascript
async function aesEncryptWebCrypto(plaintext, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(plaintext);
    
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedText
    );
    
    return {
        iv: iv,
        ciphertext: new Uint8Array(encrypted)
    };
}

async function aesDecryptWebCrypto(encryptedData, key) {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: encryptedData.iv
        },
        key,
        encryptedData.ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
}

// 使用示例
async function example() {
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    
    const message = "Secure message";
    const encrypted = await aesEncryptWebCrypto(message, key);
    const decrypted = await aesDecryptWebCrypto(encrypted, key);
    console.log("解密后:", decrypted);
}
```

## Java 示例

### Bouncy Castle实现
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class AESExample {
    
    public static String encryptAES(String plaintext, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding", "BC");
        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);
        
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);
        
        byte[] ciphertext = cipher.doFinal(plaintext.getBytes());
        byte[] result = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(ciphertext, 0, result, iv.length, ciphertext.length);
        
        return Base64.getEncoder().encodeToString(result);
    }
    
    public static String decryptAES(String encryptedData, SecretKey key) throws Exception {
        byte[] data = Base64.getDecoder().decode(encryptedData);
        byte[] iv = new byte[12];
        byte[] ciphertext = new byte[data.length - 12];
        
        System.arraycopy(data, 0, iv, 0, 12);
        System.arraycopy(data, 12, ciphertext, 0, ciphertext.length);
        
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding", "BC");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);
        
        byte[] plaintext = cipher.doFinal(ciphertext);
        return new String(plaintext);
    }
    
    public static void main(String[] args) throws Exception {
        // 生成密钥
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey key = keyGen.generateKey();
        
        // 加密和解密
        String message = "Hello, AES encryption!";
        String encrypted = encryptAES(message, key);
        String decrypted = decryptAES(encrypted, key);
        
        System.out.println("原文: " + message);
        System.out.println("解密后: " + decrypted);
    }
}
```

## C++ 示例

### OpenSSL实现
```cpp
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <string>
#include <vector>

class AESEncryption {
private:
    std::vector<unsigned char> key;
    
public:
    AESEncryption(const std::string& keyStr) {
        key.assign(keyStr.begin(), keyStr.end());
        if (key.size() != 32) {
            key.resize(32, 0); // 填充或截断到32字节
        }
    }
    
    std::string encrypt(const std::string& plaintext) {
        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, key.data(), NULL);
        
        std::vector<unsigned char> ciphertext(plaintext.size() + EVP_MAX_BLOCK_LENGTH);
        int len;
        EVP_EncryptUpdate(ctx, ciphertext.data(), &len, 
                         (const unsigned char*)plaintext.c_str(), plaintext.size());
        
        int ciphertext_len = len;
        EVP_EncryptFinal_ex(ctx, ciphertext.data() + len, &len);
        ciphertext_len += len;
        
        unsigned char tag[16];
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, 16, tag);
        
        EVP_CIPHER_CTX_free(ctx);
        
        // 组合IV、密文和标签
        std::string result;
        result.append((char*)ciphertext.data(), ciphertext_len);
        result.append((char*)tag, 16);
        
        return result;
    }
    
    std::string decrypt(const std::string& encryptedData) {
        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, key.data(), NULL);
        
        std::string ciphertext = encryptedData.substr(0, encryptedData.size() - 16);
        std::string tag = encryptedData.substr(encryptedData.size() - 16);
        
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, 16, (void*)tag.c_str());
        
        std::vector<unsigned char> plaintext(ciphertext.size());
        int len;
        EVP_DecryptUpdate(ctx, plaintext.data(), &len, 
                         (const unsigned char*)ciphertext.c_str(), ciphertext.size());
        
        int plaintext_len = len;
        EVP_DecryptFinal_ex(ctx, plaintext.data() + len, &len);
        plaintext_len += len;
        
        EVP_CIPHER_CTX_free(ctx);
        
        return std::string((char*)plaintext.data(), plaintext_len);
    }
};

// 使用示例
int main() {
    AESEncryption aes("my-secret-key-32-chars-long!!");
    std::string message = "Hello, AES encryption!";
    
    std::string encrypted = aes.encrypt(message);
    std::string decrypted = aes.decrypt(encrypted);
    
    std::cout << "原文: " << message << std::endl;
    std::cout << "解密后: " << decrypted << std::endl;
    
    return 0;
}
```

## Go 示例

### 标准库实现
```go
package main

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "io"
)

type AESEncryption struct {
    key []byte
}

func NewAESEncryption(key string) *AESEncryption {
    keyBytes := []byte(key)
    if len(keyBytes) != 32 {
        // 填充或截断到32字节
        if len(keyBytes) < 32 {
            padded := make([]byte, 32)
            copy(padded, keyBytes)
            keyBytes = padded
        } else {
            keyBytes = keyBytes[:32]
        }
    }
    return &AESEncryption{key: keyBytes}
}

func (a *AESEncryption) Encrypt(plaintext string) (string, error) {
    block, err := aes.NewCipher(a.key)
    if err != nil {
        return "", err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }
    
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return "", err
    }
    
    ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func (a *AESEncryption) Decrypt(encryptedData string) (string, error) {
    ciphertext, err := base64.StdEncoding.DecodeString(encryptedData)
    if err != nil {
        return "", err
    }
    
    block, err := aes.NewCipher(a.key)
    if err != nil {
        return "", err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }
    
    nonceSize := gcm.NonceSize()
    if len(ciphertext) < nonceSize {
        return "", fmt.Errorf("ciphertext too short")
    }
    
    nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        return "", err
    }
    
    return string(plaintext), nil
}

func main() {
    aes := NewAESEncryption("my-secret-key-32-chars-long!!")
    message := "Hello, AES encryption!"
    
    encrypted, err := aes.Encrypt(message)
    if err != nil {
        fmt.Printf("加密错误: %v\n", err)
        return
    }
    
    decrypted, err := aes.Decrypt(encrypted)
    if err != nil {
        fmt.Printf("解密错误: %v\n", err)
        return
    }
    
    fmt.Printf("原文: %s\n", message)
    fmt.Printf("解密后: %s\n", decrypted)
}
```

## Rust 示例

### Rust Crypto实现
```rust
use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, NewAead};
use base64::{Engine as _, engine::general_purpose};
use rand::Rng;

struct AESEncryption {
    cipher: Aes256Gcm,
}

impl AESEncryption {
    fn new(key: &str) -> Self {
        let key_bytes = key.as_bytes();
        let mut key_array = [0u8; 32];
        let copy_len = key_bytes.len().min(32);
        key_array[..copy_len].copy_from_slice(&key_bytes[..copy_len]);
        
        let key = Key::from_slice(&key_array);
        let cipher = Aes256Gcm::new(key);
        
        AESEncryption { cipher }
    }
    
    fn encrypt(&self, plaintext: &str) -> Result<String, Box<dyn std::error::Error>> {
        let nonce_bytes = rand::thread_rng().gen::<[u8; 12]>();
        let nonce = Nonce::from_slice(&nonce_bytes);
        
        let ciphertext = self.cipher
            .encrypt(nonce, plaintext.as_bytes())
            .map_err(|e| format!("Encryption failed: {}", e))?;
        
        let mut result = Vec::new();
        result.extend_from_slice(&nonce_bytes);
        result.extend_from_slice(&ciphertext);
        
        Ok(general_purpose::STANDARD.encode(result))
    }
    
    fn decrypt(&self, encrypted_data: &str) -> Result<String, Box<dyn std::error::Error>> {
        let data = general_purpose::STANDARD.decode(encrypted_data)?;
        
        if data.len() < 12 {
            return Err("Invalid encrypted data".into());
        }
        
        let nonce_bytes = &data[..12];
        let ciphertext = &data[12..];
        
        let nonce = Nonce::from_slice(nonce_bytes);
        let plaintext = self.cipher
            .decrypt(nonce, ciphertext)
            .map_err(|e| format!("Decryption failed: {}", e))?;
        
        Ok(String::from_utf8(plaintext)?)
    }
}

fn main() {
    let aes = AESEncryption::new("my-secret-key-32-chars-long!!");
    let message = "Hello, AES encryption!";
    
    match aes.encrypt(message) {
        Ok(encrypted) => {
            println!("加密后: {}", encrypted);
            
            match aes.decrypt(&encrypted) {
                Ok(decrypted) => {
                    println!("原文: {}", message);
                    println!("解密后: {}", decrypted);
                }
                Err(e) => println!("解密错误: {}", e),
            }
        }
        Err(e) => println!("加密错误: {}", e),
    }
}
``` 