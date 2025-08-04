# ChaCha20 代码示例

## Python 示例

### 基本ChaCha20加密
```python
import os
from Crypto.Cipher import ChaCha20

def basic_chacha20_encrypt():
    """基本ChaCha20加密示例"""
    # 生成随机密钥和随机数
    key = os.urandom(32)  # 256位密钥
    nonce = os.urandom(12)  # 96位随机数
    
    # 创建密码
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    # 加密消息
    message = "Hello, ChaCha20 encryption!"
    ciphertext = cipher.encrypt(message.encode())
    
    print(f"密钥: {key.hex()}")
    print(f"随机数: {nonce.hex()}")
    print(f"消息: {message}")
    print(f"密文: {ciphertext.hex()}")
    
    return key, nonce, ciphertext

def basic_chacha20_decrypt(key, nonce, ciphertext):
    """基本ChaCha20解密示例"""
    # 使用相同密钥和随机数创建密码
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    # 解密消息
    plaintext = cipher.decrypt(ciphertext)
    message = plaintext.decode()
    
    print(f"解密: {message}")
    return message
```

### ChaCha20-Poly1305 AEAD
```python
from Crypto.Cipher import ChaCha20_Poly1305

def chacha20_poly1305_example():
    """ChaCha20-Poly1305认证加密示例"""
    # 生成密钥和随机数
    key = os.urandom(32)
    nonce = os.urandom(12)
    
    # 创建AEAD密码
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    
    # 添加关联数据
    associated_data = b"metadata:user123"
    cipher.update(associated_data)
    
    # 加密并获取认证标签
    message = "Authenticated encryption with ChaCha20-Poly1305"
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    
    print(f"关联数据: {associated_data}")
    print(f"消息: {message}")
    print(f"密文: {ciphertext.hex()}")
    print(f"标签: {tag.hex()}")
    
    return key, nonce, associated_data, ciphertext, tag

def chacha20_poly1305_decrypt(key, nonce, associated_data, ciphertext, tag):
    """ChaCha20-Poly1305认证解密示例"""
    # 创建AEAD密码
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    
    # 添加关联数据
    cipher.update(associated_data)
    
    # 解密并验证
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        message = plaintext.decode()
        print(f"认证解密成功: {message}")
        return message
    except ValueError:
        print("认证失败!")
        return None
```

### 使用ChaCha20进行文件加密
```python
def encrypt_file_chacha20(input_file, output_file, key):
    """使用ChaCha20加密文件"""
    nonce = os.urandom(12)
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            # 在开头写入随机数
            f_out.write(nonce)
            
            # 分块加密文件
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)
    
    print(f"文件已加密: {input_file} -> {output_file}")
    return nonce

def decrypt_file_chacha20(input_file, output_file, key):
    """使用ChaCha20解密文件"""
    with open(input_file, 'rb') as f_in:
        # 从开头读取随机数
        nonce = f_in.read(12)
        cipher = ChaCha20.new(key=key, nonce=nonce)
        
        with open(output_file, 'wb') as f_out:
            # 分块解密文件
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                decrypted_chunk = cipher.decrypt(chunk)
                f_out.write(decrypted_chunk)
    
    print(f"文件已解密: {input_file} -> {output_file}")
```

## JavaScript 示例

### Node.js ChaCha20实现
```javascript
const crypto = require('crypto');

function chacha20Encrypt(key, nonce, plaintext) {
    // 创建密码
    const cipher = crypto.createCipher('chacha20', key);
    cipher.setAAD(nonce);
    
    // 加密
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
}

function chacha20Decrypt(key, nonce, ciphertext) {
    // 创建解密器
    const decipher = crypto.createDecipher('chacha20', key);
    decipher.setAAD(nonce);
    
    // 解密
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

// 使用示例
const key = crypto.randomBytes(32);
const nonce = crypto.randomBytes(12);
const message = "Hello from Node.js ChaCha20!";

const encrypted = chacha20Encrypt(key, nonce, message);
const decrypted = chacha20Decrypt(key, nonce, encrypted);

console.log(`原文: ${message}`);
console.log(`加密: ${encrypted}`);
console.log(`解密: ${decrypted}`);
```

## Java 示例

### Bouncy Castle ChaCha20
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;

public class ChaCha20Example {
    static {
        java.security.Security.addProvider(new BouncyCastleProvider());
    }
    
    public static void main(String[] args) throws Exception {
        // 生成密钥和随机数
        KeyGenerator keyGen = KeyGenerator.getInstance("ChaCha20", "BC");
        keyGen.init(256);
        SecretKey key = keyGen.generateKey();
        
        SecureRandom random = new SecureRandom();
        byte[] nonce = new byte[12];
        random.nextBytes(nonce);
        
        // 加密
        Cipher cipher = Cipher.getInstance("ChaCha20", "BC");
        cipher.init(Cipher.ENCRYPT_MODE, key, new javax.crypto.spec.IvParameterSpec(nonce));
        
        String message = "Hello from Java ChaCha20!";
        byte[] plaintext = message.getBytes("UTF-8");
        byte[] ciphertext = cipher.doFinal(plaintext);
        
        System.out.println("密钥: " + Base64.getEncoder().encodeToString(key.getEncoded()));
        System.out.println("随机数: " + Base64.getEncoder().encodeToString(nonce));
        System.out.println("消息: " + message);
        System.out.println("密文: " + Base64.getEncoder().encodeToString(ciphertext));
        
        // 解密
        cipher.init(Cipher.DECRYPT_MODE, key, new javax.crypto.spec.IvParameterSpec(nonce));
        byte[] decrypted = cipher.doFinal(ciphertext);
        String decryptedMessage = new String(decrypted, "UTF-8");
        
        System.out.println("解密: " + decryptedMessage);
    }
}
```

## Go 示例

### Go ChaCha20实现
```go
package main

import (
    "crypto/rand"
    "encoding/hex"
    "fmt"
    "golang.org/x/crypto/chacha20"
)

func main() {
    // 生成密钥和随机数
    key := make([]byte, 32)
    nonce := make([]byte, 12)
    rand.Read(key)
    rand.Read(nonce)
    
    // 创建密码
    cipher, err := chacha20.NewUnauthenticatedCipher(key, nonce)
    if err != nil {
        panic(err)
    }
    
    // 加密
    message := []byte("Hello from Go ChaCha20!")
    ciphertext := make([]byte, len(message))
    cipher.XORKeyStream(ciphertext, message)
    
    fmt.Printf("密钥: %s\n", hex.EncodeToString(key))
    fmt.Printf("随机数: %s\n", hex.EncodeToString(nonce))
    fmt.Printf("消息: %s\n", string(message))
    fmt.Printf("密文: %s\n", hex.EncodeToString(ciphertext))
    
    // 解密（使用相同密钥/随机数重新创建密码）
    cipher, _ = chacha20.NewUnauthenticatedCipher(key, nonce)
    plaintext := make([]byte, len(ciphertext))
    cipher.XORKeyStream(plaintext, ciphertext)
    
    fmt.Printf("解密: %s\n", string(plaintext))
}
```

## 性能和安全性

### 基准测试实现
```python
import time
import os
from Crypto.Cipher import ChaCha20

def benchmark_chacha20():
    """ChaCha20性能基准测试"""
    key = os.urandom(32)
    nonce = os.urandom(12)
    data_sizes = [1024, 10240, 102400, 1024000]  # 1KB, 10KB, 100KB, 1MB
    
    print("ChaCha20性能基准测试")
    print("=" * 40)
    
    for size in data_sizes:
        data = os.urandom(size)
        
        # 计时加密
        start_time = time.time()
        cipher = ChaCha20.new(key=key, nonce=nonce)
        encrypted = cipher.encrypt(data)
        encryption_time = time.time() - start_time
        
        # 计算速度
        speed_mbps = (size / 1024 / 1024) / encryption_time
        
        print(f"数据大小: {size/1024:.1f}KB")
        print(f"加密时间: {encryption_time*1000:.2f}ms")
        print(f"速度: {speed_mbps:.2f} MB/s")
        print("-" * 20)

def secure_key_generation():
    """演示安全密钥生成实践"""
    import secrets
    from Crypto.Protocol.KDF import PBKDF2
    from Crypto.Hash import SHA256
    
    # 方法1：使用secrets模块（推荐）
    key1 = secrets.token_bytes(32)
    nonce1 = secrets.token_bytes(12)
    
    # 方法2：使用PBKDF2进行基于密码的密钥派生
    password = "my_secure_password"
    salt = secrets.token_bytes(16)
    key2 = PBKDF2(password.encode(), salt, dkLen=32, count=100000, 
                   hmac_hash_module=SHA256)
    
    print("安全密钥生成示例:")
    print(f"随机密钥: {key1.hex()}")
    print(f"派生密钥: {key2.hex()}")
    print(f"盐值: {salt.hex()}")
    
    return key1, key2, salt
``` 