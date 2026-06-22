# AES 代码示例

这里整理了几种语言中可用的 AES 代码片段，附带一些关于代码在做什么以及哪些地方容易踩坑的说明。

## Python

Python 密码学我个人最常用 `pycryptodome`。API 设计得很清爽，维护活跃，填充工具让你不用自己手写。

### 基本 CBC 加密

```python
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

def aes_encrypt(key, plaintext):
    """AES-CBC 加密，随机 IV。返回 IV + 密文。"""
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode(), AES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    return iv + ciphertext

def aes_decrypt(key, encrypted_data):
    """AES-CBC 解密。前 16 字节是 IV。"""
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data, AES.block_size).decode()

# 快速测试
key = os.urandom(32)  # 256 位密钥
message = "嘿，真的能用！"
encrypted = aes_encrypt(key, message)
decrypted = aes_decrypt(key, encrypted)
print(f"原文: {message}")
print(f"解密: {decrypted}")
assert message == decrypted  # 如果这里挂了，说明有严重 bug
```

### GCM 认证加密

GCM 是大多数新项目的首选。认证标签能检测篡改，而且一旦习惯了，API 其实比 CBC 还简单。

```python
from Crypto.Cipher import AES

def aes_gcm_encrypt(key, plaintext, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return cipher.nonce, ciphertext, tag

def aes_gcm_decrypt(key, nonce, ciphertext, tag, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        return "检测到篡改 -- 数据已被修改！"

key = os.urandom(32)
message = "带防篡改保护的消息"
nonce, ciphertext, tag = aes_gcm_encrypt(key, message)
result = aes_gcm_decrypt(key, nonce, ciphertext, tag)
print(result)  # 应该输出原始消息

# 试试修改密文看看会发生什么
import copy
bad_ciphertext = bytearray(copy.copy(ciphertext))
bad_ciphertext[0] ^= 0x01  # 翻转一个位
result = aes_gcm_decrypt(key, nonce, bytes(bad_ciphertext), tag)
print(result)  # "检测到篡改..."
```

### 文件加密

一个实用的文件加密函数，通过分块读取处理任意大小的文件。IV 附在输出文件开头，解密时从那里读取。

```python
def encrypt_file_aes(key, input_file, output_file):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            f_out.write(iv)

            while True:
                chunk = f_in.read(1024 * 64)  # 每次读 64KB
                if not chunk:
                    break
                if len(chunk) % 16 != 0:
                    chunk = pad(chunk, AES.block_size)
                f_out.write(cipher.encrypt(chunk))

def decrypt_file_aes(key, input_file, output_file):
    with open(input_file, 'rb') as f_in:
        iv = f_in.read(16)
        cipher = AES.new(key, AES.MODE_CBC, iv)

        with open(output_file, 'wb') as f_out:
            while True:
                chunk = f_in.read(1024 * 64)
                if not chunk:
                    break
                f_out.write(cipher.decrypt(chunk))
```

## JavaScript

两种路线：CryptoJS 简单、兼容性好；Web Crypto API 浏览器原生性能强。

### CryptoJS -- 快速上手

CryptoJS 是 JavaScript 里上手最快的 AES 方案，不过不是最快的。适合原型开发和小数据量场景。

```javascript
const CryptoJS = require('crypto-js');

function aesEncrypt(plaintext, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 把 IV 和密文拼起来，然后 Base64 编码
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

function aesDecrypt(encryptedData, key) {
    const data = CryptoJS.enc.Base64.parse(encryptedData);
    // 前 4 个 word（16 字节）是 IV
    const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4));
    const ciphertext = CryptoJS.lib.WordArray.create(data.words.slice(4));

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const key = "this-is-a-32-character-key!!";
const result = aesDecrypt(aesEncrypt("hello world", key), key);
console.log(result);  // "hello world"
```

### Web Crypto API -- 浏览器里的正确姿势

Web Crypto API 能用硬件加速，自带 GCM 支持。异步 API 刚开始可能不太习惯，但用于生产环境的浏览器代码这是不二之选。

```javascript
async function generateAesKey() {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,  // extractable -- 如果不需要导出密钥就设 false
        ["encrypt", "decrypt"]
    );
}

async function aesEncryptWebCrypto(plaintext, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));  // GCM 用 12 字节最优
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded
    );

    return { iv, ciphertext: new Uint8Array(ciphertext) };
}

async function aesDecryptWebCrypto(encryptedData, key) {
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: encryptedData.iv },
        key,
        encryptedData.ciphertext
    );
    return new TextDecoder().decode(decrypted);
}

// 使用 -- 必须在 async 函数里调用
async function demo() {
    const key = await generateAesKey();
    const encrypted = await aesEncryptWebCrypto("秘密消息", key);
    const decrypted = await aesDecryptWebCrypto(encrypted, key);
    console.log(decrypted);  // "秘密消息"
}
```

## Java

Bouncy Castle 是 Java 密码学的重量级库。标准库 `javax.crypto` 能做基本 AES，但 Bouncy Castle 让你不用折腾 provider 配置就能用 GCM 和其他模式。

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.security.SecureRandom;
import java.util.Base64;

public class AESExample {

    public static String encrypt(String plaintext, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);

        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        byte[] ciphertext = cipher.doFinal(plaintext.getBytes("UTF-8"));

        // IV 附在密文前一起存储
        byte[] combined = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    public static String decrypt(String encryptedData, SecretKey key) throws Exception {
        byte[] data = Base64.getDecoder().decode(encryptedData);

        byte[] iv = new byte[12];
        byte[] ciphertext = new byte[data.length - 12];
        System.arraycopy(data, 0, iv, 0, 12);
        System.arraycopy(data, 12, ciphertext, 0, ciphertext.length);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        byte[] plaintext = cipher.doFinal(ciphertext);
        return new String(plaintext, "UTF-8");
    }

    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey key = keyGen.generateKey();

        String message = "来自 Java 的问候！";
        String encrypted = encrypt(message, key);
        String decrypted = decrypt(encrypted, key);

        System.out.println("原文: " + message);
        System.out.println("解密: " + decrypted);
    }
}
```

## Go

Go 标准库的 crypto 是我用过设计最好的之一。所有需要的都内置了，而且 API 强制你处理错误 -- 这正是密码学代码需要的。

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

func encrypt(plaintext string, key []byte) (string, error) {
    block, err := aes.NewCipher(key)
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

    // Seal 会自动把 nonce 附在密文前面
    ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func decrypt(encryptedData string, key []byte) (string, error) {
    ciphertext, err := base64.StdEncoding.DecodeString(encryptedData)
    if err != nil {
        return "", err
    }

    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }

    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }

    nonceSize := gcm.NonceSize()
    if len(ciphertext) < nonceSize {
        return "", fmt.Errorf("密文太短了")
    }

    nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        return "", err
    }

    return string(plaintext), nil
}

func main() {
    key := make([]byte, 32)  // AES-256
    if _, err := rand.Read(key); err != nil {
        panic(err)
    }

    message := "来自 Go 的问候！"
    encrypted, err := encrypt(message, key)
    if err != nil {
        fmt.Printf("加密错误: %v\n", err)
        return
    }

    decrypted, err := decrypt(encrypted, key)
    if err != nil {
        fmt.Printf("解密错误: %v\n", err)
        return
    }

    fmt.Printf("原文: %s\n", message)
    fmt.Printf("解密: %s\n", decrypted)
}
```

## Rust

Rust 的 `aes-gcm` crate 提供了清爽、类型安全的接口。`aead` trait 体系意味着不管用 AES-GCM、ChaCha20-Poly1305 还是其他 AEAD，都是一致的 API。

```rust
use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit, OsRng};
use base64::{Engine as _, engine::general_purpose};

struct Cipher {
    inner: Aes256Gcm,
}

impl Cipher {
    fn new(key_bytes: &[u8; 32]) -> Self {
        let key = Key::<Aes256Gcm>::from_slice(key_bytes);
        Cipher { inner: Aes256Gcm::new(key) }
    }

    fn encrypt(&self, plaintext: &str) -> Result<String, Box<dyn std::error::Error>> {
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        let ciphertext = self.inner.encrypt(&nonce, plaintext.as_bytes())
            .map_err(|_| "加密失败")?;

        // nonce 附在密文前
        let mut result = Vec::from(nonce.as_slice());
        result.extend_from_slice(&ciphertext);

        Ok(general_purpose::STANDARD.encode(result))
    }

    fn decrypt(&self, encoded: &str) -> Result<String, Box<dyn std::error::Error>> {
        let data = general_purpose::STANDARD.decode(encoded)?;

        if data.len() < 12 {
            return Err("数据太短".into());
        }

        let (nonce_bytes, ciphertext) = data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);

        let plaintext = self.inner.decrypt(nonce, ciphertext)
            .map_err(|_| "解密失败 -- 数据可能被篡改")?;

        Ok(String::from_utf8(plaintext)?)
    }
}

fn main() {
    let mut key = [0u8; 32];
    // 生产环境请用正经的密钥管理方案
    key.copy_from_slice(b"this-is-a-32-byte-key!!abcdefg");

    let cipher = Cipher::new(&key);

    match cipher.encrypt("来自 Rust 的问候！") {
        Ok(encrypted) => {
            println!("加密后: {}", encrypted);
            match cipher.decrypt(&encrypted) {
                Ok(decrypted) => println!("解密后: {}", decrypted),
                Err(e) => println!("错误: {}", e),
            }
        }
        Err(e) => println!("错误: {}", e),
    }
}
```

Rust 示例的提醒：像这样硬编码密钥只是演示用的，实际中应该从安全存储读取密钥或用 KDF 派生。`OsRng` 来自 `aead` crate，是 nonce 生成的正确选择 -- 它从操作系统的 CSPRNG 读取随机数。
