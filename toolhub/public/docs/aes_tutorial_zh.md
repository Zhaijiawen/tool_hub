# AES 使用教程

## 环境设置

### 前置要求
- 具有加密库的编程语言
- 安全随机数生成器
- 密钥管理系统
- 对加密概念的理解

### 库选择

#### OpenSSL (C/C++)
```bash
# 安装 OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

#### PyCrypto/PyCryptodome (Python)
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

## 基本概念

### 密钥生成
```python
import os
from Crypto.Cipher import AES

# 生成随机256位密钥
key = os.urandom(32)  # 32字节 = 256位
print(f"生成的密钥: {key.hex()}")
```

### 分组大小
AES操作固定大小的128位（16字节）分组：
```python
# AES分组大小始终为16字节
BLOCK_SIZE = 16

# 将数据填充到分组大小
def pad(data):
    padding_length = BLOCK_SIZE - (len(data) % BLOCK_SIZE)
    padding = bytes([padding_length] * padding_length)
    return data + padding
```

### 初始化向量（IV）
```python
# 为CBC模式生成随机IV
iv = os.urandom(16)  # AES分组大小16字节
print(f"生成的IV: {iv.hex()}")
```

## 基本加密

### ECB模式（不推荐）
```python
from Crypto.Cipher import AES

def encrypt_ecb(key, plaintext):
    cipher = AES.new(key, AES.MODE_ECB)
    padded_data = pad(plaintext.encode())
    ciphertext = cipher.encrypt(padded_data)
    return ciphertext

def decrypt_ecb(key, ciphertext):
    cipher = AES.new(key, AES.MODE_ECB)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data).decode()

# 使用示例
key = os.urandom(32)
message = "Hello, AES encryption!"
encrypted = encrypt_ecb(key, message)
decrypted = decrypt_ecb(key, encrypted)
```

### CBC模式（推荐）
```python
def encrypt_cbc(key, plaintext, iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode())
    ciphertext = cipher.encrypt(padded_data)
    return ciphertext

def decrypt_cbc(key, ciphertext, iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data).decode()

# 使用示例
key = os.urandom(32)
iv = os.urandom(16)
message = "Secure message with CBC mode"
encrypted = encrypt_cbc(key, message, iv)
decrypted = decrypt_cbc(key, encrypted, iv)
```

## 高级模式

### CTR模式（流密码）
```python
def encrypt_ctr(key, plaintext, nonce):
    cipher = AES.new(key, AES.MODE_CTR, nonce=nonce)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext

def decrypt_ctr(key, ciphertext, nonce):
    cipher = AES.new(key, AES.MODE_CTR, nonce=nonce)
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode()

# 使用示例
key = os.urandom(32)
nonce = os.urandom(8)  # CTR模式的8字节随机数
message = "CTR mode allows parallel processing"
encrypted = encrypt_ctr(key, message, nonce)
decrypted = decrypt_ctr(key, encrypted, nonce)
```

### GCM模式（认证加密）
```python
def encrypt_gcm(key, plaintext, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return cipher.nonce, ciphertext, tag

def decrypt_gcm(key, nonce, ciphertext, tag, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        return "Authentication failed"

# 使用示例
key = os.urandom(32)
message = "Authenticated encryption with GCM"
nonce, ciphertext, tag = encrypt_gcm(key, message)
decrypted = decrypt_gcm(key, nonce, ciphertext, tag)
```

## 文件加密

### 加密文件
```python
def encrypt_file(key, input_file, output_file):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    with open(input_file, 'rb') as f_in:
        with open(output_file, 'wb') as f_out:
            # 在开头写入IV
            f_out.write(iv)
            
            while True:
                chunk = f_in.read(1024)  # 分块读取
                if not chunk:
                    break
                
                # 如有必要，填充最后一个块
                if len(chunk) % 16 != 0:
                    chunk = pad(chunk)
                
                encrypted_chunk = cipher.encrypt(chunk)
                f_out.write(encrypted_chunk)

def decrypt_file(key, input_file, output_file):
    with open(input_file, 'rb') as f_in:
        # 从开头读取IV
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

## 密钥管理

### 密钥派生（PBKDF2）
```python
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256

def derive_key(password, salt):
    key = PBKDF2(password.encode(), salt, dkLen=32, count=100000, hmac_hash_module=SHA256)
    return key

# 使用示例
password = "my_secure_password"
salt = os.urandom(16)
key = derive_key(password, salt)
```

### 密钥存储
```python
import json
import base64

def save_key(key, filename, password):
    # 用密码加密密钥
    salt = os.urandom(16)
    key_encryption_key = derive_key(password, salt)
    
    # 加密实际密钥
    cipher = AES.new(key_encryption_key, AES.MODE_GCM)
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

def load_key(filename, password):
    with open(filename, 'r') as f:
        key_data = json.load(f)
    
    # 解码存储的数据
    salt = base64.b64decode(key_data['salt'])
    nonce = base64.b64decode(key_data['nonce'])
    encrypted_key = base64.b64decode(key_data['encrypted_key'])
    tag = base64.b64decode(key_data['tag'])
    
    # 派生密钥加密密钥
    key_encryption_key = derive_key(password, salt)
    
    # 解密实际密钥
    cipher = AES.new(key_encryption_key, AES.MODE_GCM, nonce=nonce)
    key = cipher.decrypt_and_verify(encrypted_key, tag)
    
    return key
```

## 安全最佳实践

### 随机数生成
```python
import secrets

# 使用secrets模块进行加密随机性
def generate_secure_random():
    # 生成安全随机字节
    random_bytes = secrets.token_bytes(32)
    
    # 生成安全随机整数
    random_int = secrets.randbelow(1000)
    
    # 生成安全随机选择
    choices = ['A', 'B', 'C', 'D']
    random_choice = secrets.choice(choices)
    
    return random_bytes, random_int, random_choice
```

### 恒定时间操作
```python
import hmac

def constant_time_compare(a, b):
    """恒定时间字符串比较"""
    return hmac.compare_digest(a, b)

def secure_equals(a, b):
    """不泄露时序信息的安全比较"""
    if len(a) != len(b):
        return False
    result = 0
    for x, y in zip(a, b):
        result |= x ^ y
    return result == 0
```

### 输入验证
```python
def validate_key(key):
    """验证AES密钥长度"""
    if not isinstance(key, bytes):
        raise ValueError("Key must be bytes")
    if len(key) not in [16, 24, 32]:
        raise ValueError("Key must be 16, 24, or 32 bytes")
    return True

def validate_iv(iv):
    """验证初始化向量"""
    if not isinstance(iv, bytes):
        raise ValueError("IV must be bytes")
    if len(iv) != 16:
        raise ValueError("IV must be 16 bytes")
    return True
```

## 错误处理

### 异常处理
```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

def safe_encrypt(key, plaintext, iv):
    try:
        # 验证输入
        validate_key(key)
        validate_iv(iv)
        
        # 执行加密
        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_data = pad(plaintext.encode(), AES.block_size)
        ciphertext = cipher.encrypt(padded_data)
        
        return ciphertext
    except ValueError as e:
        print(f"验证错误: {e}")
        return None
    except Exception as e:
        print(f"加密错误: {e}")
        return None

def safe_decrypt(key, ciphertext, iv):
    try:
        # 验证输入
        validate_key(key)
        validate_iv(iv)
        
        # 执行解密
        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_data = cipher.decrypt(ciphertext)
        plaintext = unpad(padded_data, AES.block_size)
        
        return plaintext.decode()
    except ValueError as e:
        print(f"验证错误: {e}")
        return None
    except Exception as e:
        print(f"解密错误: {e}")
        return None
```

## 性能优化

### 硬件加速
```python
# 检查AES-NI支持
import platform

def check_aes_ni():
    """检查AES-NI是否可用"""
    try:
        import cpuinfo
        info = cpuinfo.get_cpu_info()
        flags = info.get('flags', [])
        return 'aes' in flags
    except ImportError:
        return False

# 在可用时使用硬件加速
if check_aes_ni():
    print("AES-NI硬件加速可用")
else:
    print("使用软件AES实现")
```

### 批处理
```python
def encrypt_batch(key, messages, iv):
    """高效加密多个消息"""
    cipher = AES.new(key, AES.MODE_CBC, iv)
    results = []
    
    for message in messages:
        padded_data = pad(message.encode(), AES.block_size)
        encrypted = cipher.encrypt(padded_data)
        results.append(encrypted)
    
    return results
```

## 测试和验证

### 测试向量
```python
def test_aes_vectors():
    """使用已知测试向量测试AES"""
    # 已知测试向量
    key = bytes.fromhex('000102030405060708090a0b0c0d0e0f')
    plaintext = bytes.fromhex('00112233445566778899aabbccddeeff')
    expected_ciphertext = bytes.fromhex('69c4e0d86a7b0430d8cdb78070b4c55a')
    
    # 测试加密
    cipher = AES.new(key, AES.MODE_ECB)
    ciphertext = cipher.encrypt(plaintext)
    
    assert ciphertext == expected_ciphertext, "Test vector failed"
    print("AES测试向量通过")
```

### 性能基准测试
```python
import time

def benchmark_aes():
    """AES加密性能基准测试"""
    key = os.urandom(32)
    data = os.urandom(1024 * 1024)  # 1MB数据
    
    # 计时加密
    start_time = time.time()
    cipher = AES.new(key, AES.MODE_CBC)
    encrypted = cipher.encrypt(pad(data, AES.block_size))
    encryption_time = time.time() - start_time
    
    print(f"1MB加密用时 {encryption_time:.4f} 秒")
    print(f"速度: {1/encryption_time:.2f} MB/s")
``` 