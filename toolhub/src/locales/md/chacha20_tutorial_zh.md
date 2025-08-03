# ChaCha20 使用教程

## 环境设置

### 前置条件
- 具有加密库的编程语言
- 安全随机数生成器
- 对流密码的理解
- 加密概念知识

### 库选择

#### PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### CryptoJS (JavaScript)
```bash
npm install crypto-js
```

#### Bouncy Castle (Java)
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

#### OpenSSL (C/C++)
```bash
# 安装OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

## 基本概念

### 密钥和随机数生成
```python
import os
from Crypto.Cipher import ChaCha20

# 生成随机256位密钥
key = os.urandom(32)  # 32字节 = 256位
print(f"生成的密钥: {key.hex()}")

# 生成随机96位随机数
nonce = os.urandom(12)  # 12字节 = 96位
print(f"生成的随机数: {nonce.hex()}")
```

### 状态结构
ChaCha20使用512位内部状态：
```python
# ChaCha20状态布局（16个32位字）
# [0-3]   : 常量 ("expand 32-byte k")
# [4-11]  : 密钥 (256位)
# [12]    : 计数器 (32位)
# [13-15] : 随机数 (96位)

def print_state_info():
    print("ChaCha20状态结构:")
    print("字0-3:   常量")
    print("字4-11:  密钥 (256位)")
    print("字12:    计数器 (32位)")
    print("字13-15: 随机数 (96位)")
```

## 基本加密

### 简单ChaCha20加密
```python
from Crypto.Cipher import ChaCha20

def chacha20_encrypt(key, nonce, plaintext):
    """基本ChaCha20加密"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext

def chacha20_decrypt(key, nonce, ciphertext):
    """基本ChaCha20解密"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode()

# 使用示例
key = os.urandom(32)
nonce = os.urandom(12)
message = "Hello, ChaCha20 encryption!"
encrypted = chacha20_encrypt(key, nonce, message)
decrypted = chacha20_decrypt(key, nonce, encrypted)
print(f"原文: {message}")
print(f"解密: {decrypted}")
```

### 计数器管理
```python
def chacha20_with_counter(key, nonce, plaintext, counter=0):
    """带显式计数器的ChaCha20加密"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    cipher.seek(counter)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext

def encrypt_large_data(key, nonce, data):
    """使用计数器增量加密大数据"""
    cipher = ChaCha20.new(key=key, nonce=nonce)
    encrypted_chunks = []
    
    chunk_size = 64  # ChaCha20块大小
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i+chunk_size]
        cipher.seek(i // chunk_size)
        encrypted_chunk = cipher.encrypt(chunk.encode())
        encrypted_chunks.append(encrypted_chunk)
    
    return b''.join(encrypted_chunks)
```

## 高级用法

### ChaCha20-Poly1305 AEAD
```python
from Crypto.Cipher import ChaCha20_Poly1305

def chacha20_poly1305_encrypt(key, nonce, plaintext, associated_data=b""):
    """ChaCha20-Poly1305认证加密"""
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return ciphertext, tag

def chacha20_poly1305_decrypt(key, nonce, ciphertext, tag, associated_data=b""):
    """ChaCha20-Poly1305认证解密"""
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        return "认证失败"

# 使用示例
key = os.urandom(32)
nonce = os.urandom(12)
message = "Authenticated encryption with ChaCha20-Poly1305"
associated_data = b"metadata"
ciphertext, tag = chacha20_poly1305_encrypt(key, nonce, message, associated_data)
result = chacha20_poly1305_decrypt(key, nonce, ciphertext, tag, associated_data)
```

### 文件加密
```python
def encrypt_file_chacha20(key, input_file, output_file):
    """使用ChaCha20加密文件"""
    nonce = os.urandom(12)
    cipher = ChaCha20.new(key=key, nonce=nonce)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            # 在开头写入随机数
            f_out.write(nonce)
            
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)

def decrypt_file_chacha20(key, input_file, output_file):
    """使用ChaCha20解密文件"""
    with open(input_file, 'rb') as f_in:
        # 从开头读取随机数
        nonce = f_in.read(12)
        cipher = ChaCha20.new(key=key, nonce=nonce)
        
        with open(output_file, 'wb') as f_out:
            while True:
                chunk = f_in.read(1024)
                if not chunk:
                    break
                
                decrypted_chunk = cipher.decrypt(chunk)
                f_out.write(decrypted_chunk)
```

## 密钥管理

### 密钥派生
```python
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256

def derive_chacha20_key(password, salt):
    """从密码派生ChaCha20密钥"""
    key = PBKDF2(password.encode(), salt, dkLen=32, count=100000, hmac_hash_module=SHA256)
    return key

def generate_key_material():
    """生成ChaCha20密钥材料"""
    password = "my_secure_password"
    salt = os.urandom(16)
    key = derive_chacha20_key(password, salt)
    return key, salt

# 使用示例
key, salt = generate_key_material()
print(f"派生的密钥: {key.hex()}")
print(f"盐值: {salt.hex()}")
```

### 密钥存储
```python
import json
import base64

def save_chacha20_key(key, filename, password):
    """使用密码加密保存ChaCha20密钥"""
    salt = os.urandom(16)
    key_encryption_key = derive_chacha20_key(password, salt)
    
    # 加密ChaCha20密钥
    cipher = ChaCha20_Poly1305.new(key=key_encryption_key)
    encrypted_key, tag = cipher.encrypt_and_digest(key)
    
    # 保存加密密钥和元数据
    key_data = {
        'salt': base64.b64encode(salt).decode(),
        'nonce': base64.b64encode(cipher.nonce).decode(),
        'encrypted_key': base64.b64encode(encrypted_key).decode(),
        'tag': base64.b64encode(tag).decode()
    }
    
    with open(filename, 'w') as f:
        json.dump(key_data, f)

def load_chacha20_key(filename, password):
    """从加密文件加载ChaCha20密钥"""
    with open(filename, 'r') as f:
        key_data = json.load(f)
    
    # 解码存储的数据
    salt = base64.b64decode(key_data['salt'])
    nonce = base64.b64decode(key_data['nonce'])
    encrypted_key = base64.b64decode(key_data['encrypted_key'])
    tag = base64.b64decode(key_data['tag'])
    
    # 派生密钥加密密钥
    key_encryption_key = derive_chacha20_key(password, salt)
    
    # 解密ChaCha20密钥
    cipher = ChaCha20_Poly1305.new(key=key_encryption_key, nonce=nonce)
    key = cipher.decrypt_and_verify(encrypted_key, tag)
    
    return key
```

## 安全最佳实践

### 随机数管理
```python
import secrets

def generate_secure_nonce():
    """生成密码学安全的随机数"""
    return secrets.token_bytes(12)

def validate_nonce(nonce):
    """验证随机数长度和唯一性"""
    if len(nonce) != 12:
        raise ValueError("随机数必须是12字节")
    return True

def ensure_nonce_uniqueness(used_nonces, new_nonce):
    """确保随机数唯一性"""
    if new_nonce in used_nonces:
        raise ValueError("随机数已使用")
    used_nonces.add(new_nonce)
    return True
```

### 恒定时间操作
```python
import hmac

def constant_time_compare(a, b):
    """恒定时间比较"""
    return hmac.compare_digest(a, b)

def secure_key_verification(stored_key, provided_key):
    """安全密钥验证"""
    return constant_time_compare(stored_key, provided_key)
```

### 输入验证
```python
def validate_chacha20_params(key, nonce, plaintext):
    """验证ChaCha20参数"""
    if not isinstance(key, bytes) or len(key) != 32:
        raise ValueError("密钥必须是32字节")
    
    if not isinstance(nonce, bytes) or len(nonce) != 12:
        raise ValueError("随机数必须是12字节")
    
    if not isinstance(plaintext, str):
        raise ValueError("明文必须是字符串")
    
    return True
```

## 性能优化

### 硬件加速
```python
import platform

def check_hardware_support():
    """检查ChaCha20硬件支持"""
    try:
        import cpuinfo
        info = cpuinfo.get_cpu_info()
        flags = info.get('flags', [])
        
        if 'chacha' in flags:
            return "ChaCha20硬件支持可用"
        else:
            return "使用软件ChaCha20实现"
    except ImportError:
        return "硬件支持检查不可用"
```

### 批处理
```python
def encrypt_batch_chacha20(key, messages):
    """高效加密多个消息"""
    results = []
    
    for i, message in enumerate(messages):
        nonce = os.urandom(12)
        cipher = ChaCha20.new(key=key, nonce=nonce)
        encrypted = cipher.encrypt(message.encode())
        results.append((nonce, encrypted))
    
    return results

def decrypt_batch_chacha20(key, encrypted_messages):
    """高效解密多个消息"""
    results = []
    
    for nonce, ciphertext in encrypted_messages:
        cipher = ChaCha20.new(key=key, nonce=nonce)
        decrypted = cipher.decrypt(ciphertext)
        results.append(decrypted.decode())
    
    return results
```

## 错误处理

### 异常处理
```python
def safe_chacha20_encrypt(key, nonce, plaintext):
    """带错误处理的安全ChaCha20加密"""
    try:
        # 验证输入
        validate_chacha20_params(key, nonce, plaintext)
        
        # 执行加密
        cipher = ChaCha20.new(key=key, nonce=nonce)
        ciphertext = cipher.encrypt(plaintext.encode())
        
        return ciphertext
    except ValueError as e:
        print(f"验证错误: {e}")
        return None
    except Exception as e:
        print(f"加密错误: {e}")
        return None

def safe_chacha20_decrypt(key, nonce, ciphertext):
    """带错误处理的安全ChaCha20解密"""
    try:
        # 验证输入
        if not isinstance(key, bytes) or len(key) != 32:
            raise ValueError("无效密钥")
        if not isinstance(nonce, bytes) or len(nonce) != 12:
            raise ValueError("无效随机数")
        
        # 执行解密
        cipher = ChaCha20.new(key=key, nonce=nonce)
        plaintext = cipher.decrypt(ciphertext)
        
        return plaintext.decode()
    except ValueError as e:
        print(f"验证错误: {e}")
        return None
    except Exception as e:
        print(f"解密错误: {e}")
        return None
```

## 测试和验证

### 测试向量
```python
def test_chacha20_vectors():
    """使用已知测试向量测试ChaCha20"""
    # RFC 7539测试向量
    key = bytes.fromhex('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f')
    nonce = bytes.fromhex('000000000000004a00000000')
    plaintext = b'Ladies and Gentlemen of the class of \'99: If I could offer you only one tip for the future, sunscreen would be it.'
    
    cipher = ChaCha20.new(key=key, nonce=nonce)
    ciphertext = cipher.encrypt(plaintext)
    
    expected = bytes.fromhex('6e2e359a2568f98041ba0728dd0d6981e97e7aec1d4360c20a27afccfd9fae0bf91b65c5524733ab8f593dabcd62b3571639d624e65152ab8f530c359f0861d807ca0dbf500d6a6156a38e088a22b65e52bc514d16ccf806818ce91ab77937365af90bbf74a35be6b40b8eedf2785e42874d')
    
    assert ciphertext == expected, "测试向量失败"
    print("ChaCha20测试向量通过")
```

### 性能基准测试
```python
import time

def benchmark_chacha20():
    """ChaCha20性能基准测试"""
    key = os.urandom(32)
    nonce = os.urandom(12)
    data = os.urandom(1024 * 1024)  # 1MB数据
    
    # 计时加密
    start_time = time.time()
    cipher = ChaCha20.new(key=key, nonce=nonce)
    encrypted = cipher.encrypt(data)
    encryption_time = time.time() - start_time
    
    print(f"1MB加密用时 {encryption_time:.4f} 秒")
    print(f"速度: {1/encryption_time:.2f} MB/s")
``` 