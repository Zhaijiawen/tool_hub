# RSA 使用教程

## 环境设置

### 前置条件
- 具有加密库的编程语言
- 理解公钥密码学概念
- 模运算和数论知识
- 了解RSA安全考虑

### 库选择

#### PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### Node.js crypto (JavaScript)
```bash
# 内置crypto模块，无需安装
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

### 密钥对结构
```python
from Crypto.PublicKey import RSA

# 生成RSA密钥对
key = RSA.generate(2048)

# 公钥组件
public_key = key.publickey()
n = public_key.n  # 模数
e = public_key.e  # 公钥指数

# 私钥组件
private_key = key
d = private_key.d  # 私钥指数
p = private_key.p  # 第一个素因子
q = private_key.q  # 第二个素因子

print(f"模数 (n): {n}")
print(f"公钥指数 (e): {e}")
print(f"密钥大小: {key.size_in_bits()} 位")
```

### 密钥大小考虑
```python
def key_size_recommendations():
    """RSA密钥大小建议"""
    print("RSA密钥大小建议:")
    print("1024位: 遗留（不安全）")
    print("2048位: 当前最小值（安全到2030年）")
    print("3072位: 长期安全推荐")
    print("4096位: 最大安全性（性能较慢）")
    
    # 安全级别
    security_levels = {
        1024: "64位（不安全）",
        2048: "112位（安全到2030年）",
        3072: "128位（推荐）",
        4096: "152位（最大安全性）"
    }
    
    return security_levels
```

## 密钥生成

### 基本密钥生成
```python
from Crypto.PublicKey import RSA
import os

def generate_rsa_key_pair(key_size=2048):
    """生成RSA密钥对"""
    # 生成随机密钥
    key = RSA.generate(key_size)
    
    # 提取公钥和私钥
    private_key = key
    public_key = key.publickey()
    
    print(f"生成了{key_size}位RSA密钥对")
    print(f"公钥: {public_key.n}")
    print(f"私钥: {private_key.d}")
    
    return private_key, public_key

def save_key_pair(private_key, public_key, filename_prefix):
    """保存RSA密钥对到文件"""
    # 保存私钥
    with open(f"{filename_prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key())
    
    # 保存公钥
    with open(f"{filename_prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key())
    
    print(f"密钥保存为{filename_prefix}_private.pem和{filename_prefix}_public.pem")
```

### 自定义参数的密钥生成
```python
def generate_rsa_with_custom_exponent(key_size=2048, e=65537):
    """生成具有自定义公钥指数的RSA密钥"""
    key = RSA.generate(key_size, e=e)
    
    print(f"生成了{key_size}位RSA密钥，e={e}")
    print(f"公钥指数: {key.e}")
    
    return key

def validate_key_parameters(key):
    """验证RSA密钥参数"""
    # 检查密钥大小
    if key.size_in_bits() < 2048:
        print("警告: 密钥大小小于2048位")
    
    # 检查公钥指数
    if key.e == 3:
        print("警告: e=3可能容易受到某些攻击")
    elif key.e == 65537:
        print("良好: e=65537是推荐的公钥指数")
    
    # 检查素因子
    if key.p == key.q:
        print("错误: 素因子相同")
        return False
    
    return True
```

## 加密和解密

### 基本RSA加密
```python
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA

def rsa_encrypt(public_key, message):
    """使用RSA公钥加密消息"""
    # 创建带OAEP填充的密码
    cipher = PKCS1_OAEP.new(public_key)
    
    # 加密消息
    ciphertext = cipher.encrypt(message.encode())
    
    return ciphertext

def rsa_decrypt(private_key, ciphertext):
    """使用RSA私钥解密消息"""
    # 创建带OAEP填充的密码
    cipher = PKCS1_OAEP.new(private_key)
    
    # 解密消息
    plaintext = cipher.decrypt(ciphertext)
    
    return plaintext.decode()

# 使用示例
private_key, public_key = generate_rsa_key_pair(2048)
message = "Hello, RSA encryption!"

encrypted = rsa_encrypt(public_key, message)
decrypted = rsa_decrypt(private_key, encrypted)

print(f"原文: {message}")
print(f"解密: {decrypted}")
```

### 不同填充方案的RSA
```python
from Crypto.Cipher import PKCS1_v1_5

def rsa_encrypt_pkcs1v15(public_key, message):
    """使用PKCS#1 v1.5填充加密（遗留）"""
    cipher = PKCS1_v1_5.new(public_key)
    ciphertext = cipher.encrypt(message.encode())
    return ciphertext

def rsa_decrypt_pkcs1v15(private_key, ciphertext):
    """使用PKCS#1 v1.5填充解密"""
    cipher = PKCS1_v1_5.new(private_key)
    plaintext = cipher.decrypt(ciphertext, None)
    return plaintext.decode()

def compare_padding_schemes():
    """比较不同填充方案"""
    print("填充方案比较:")
    print("PKCS#1 v1.5: 遗留，容易受到某些攻击")
    print("OAEP: 推荐，可证明安全")
    print("PSS: 仅用于数字签名")
```

## 数字签名

### 基本数字签名
```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

def rsa_sign(private_key, message):
    """使用RSA私钥签名消息"""
    # 创建消息的哈希
    hash_obj = SHA256.new(message.encode())
    
    # 签名哈希
    signature = pkcs1_15.new(private_key).sign(hash_obj)
    
    return signature

def rsa_verify(public_key, message, signature):
    """使用RSA公钥验证签名"""
    # 创建消息的哈希
    hash_obj = SHA256.new(message.encode())
    
    try:
        # 验证签名
        pkcs1_15.new(public_key).verify(hash_obj, signature)
        return True
    except (ValueError, TypeError):
        return False

# 使用示例
message = "Important document to sign"
signature = rsa_sign(private_key, message)
is_valid = rsa_verify(public_key, message, signature)

print(f"消息: {message}")
print(f"签名有效: {is_valid}")
```

### RSA-PSS签名
```python
from Crypto.Signature import pss
from Crypto.Hash import SHA256

def rsa_sign_pss(private_key, message):
    """使用RSA-PSS签名消息"""
    hash_obj = SHA256.new(message.encode())
    signature = pss.new(private_key).sign(hash_obj)
    return signature

def rsa_verify_pss(public_key, message, signature):
    """验证RSA-PSS签名"""
    hash_obj = SHA256.new(message.encode())
    
    try:
        pss.new(public_key).verify(hash_obj, signature)
        return True
    except (ValueError, TypeError):
        return False
```

## 高级用法

### 混合加密
```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import os

def hybrid_encrypt(rsa_public_key, message):
    """混合加密: RSA + AES"""
    # 生成随机AES密钥
    aes_key = get_random_bytes(32)  # 256位密钥
    
    # 使用RSA加密AES密钥
    rsa_cipher = PKCS1_OAEP.new(rsa_public_key)
    encrypted_aes_key = rsa_cipher.encrypt(aes_key)
    
    # 使用AES加密消息
    aes_cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = aes_cipher.encrypt_and_digest(message.encode())
    
    return encrypted_aes_key, aes_cipher.nonce, ciphertext, tag

def hybrid_decrypt(rsa_private_key, encrypted_aes_key, nonce, ciphertext, tag):
    """混合解密: RSA + AES"""
    # 使用RSA解密AES密钥
    rsa_cipher = PKCS1_OAEP.new(rsa_private_key)
    aes_key = rsa_cipher.decrypt(encrypted_aes_key)
    
    # 使用AES解密消息
    aes_cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    plaintext = aes_cipher.decrypt_and_verify(ciphertext, tag)
    
    return plaintext.decode()

# 使用
long_message = "This is a very long message that would be inefficient to encrypt directly with RSA"
encrypted_key, nonce, ciphertext, tag = hybrid_encrypt(public_key, long_message)
decrypted = hybrid_decrypt(private_key, encrypted_key, nonce, ciphertext, tag)
```

### 密钥管理
```python
def load_key_from_file(filename):
    """从PEM文件加载RSA密钥"""
    with open(filename, "rb") as f:
        key_data = f.read()
    
    if b"PRIVATE" in key_data:
        return RSA.import_key(key_data)
    else:
        return RSA.import_key(key_data)

def export_key_to_pem(key, filename):
    """导出RSA密钥到PEM文件"""
    with open(filename, "wb") as f:
        f.write(key.export_key())

def key_fingerprint(public_key):
    """生成密钥指纹用于识别"""
    import hashlib
    key_data = public_key.export_key()
    fingerprint = hashlib.sha256(key_data).hexdigest()
    return fingerprint[:16]  # 前16个字符
```

## 安全最佳实践

### 安全密钥生成
```python
def secure_key_generation():
    """安全RSA密钥生成实践"""
    print("安全密钥生成指南:")
    print("1. 使用密钥大小 >= 2048位")
    print("2. 使用公钥指数 e = 65537")
    print("3. 尽可能在安全硬件上生成密钥")
    print("4. 安全存储私钥")
    print("5. 使用强随机数生成器")
    print("6. 生成后验证密钥参数")

def check_key_security(key):
    """检查RSA密钥安全参数"""
    issues = []
    
    if key.size_in_bits() < 2048:
        issues.append("密钥大小太小")
    
    if key.e == 3:
        issues.append("公钥指数e=3可能容易受到攻击")
    
    if key.e != 65537:
        issues.append("非标准公钥指数")
    
    return issues
```

### 填充安全性
```python
def padding_security_guide():
    """RSA填充安全指南"""
    print("RSA填充安全性:")
    print("✅ 加密使用OAEP")
    print("✅ 签名使用PSS")
    print("❌ 避免加密使用PKCS#1 v1.5")
    print("❌ 避免原始RSA（无填充）")
    
    print("\n填充方案:")
    print("- OAEP: 最优非对称加密填充")
    print("- PSS: 概率签名方案")
    print("- PKCS#1 v1.5: 遗留填充（易受攻击）")
```

## 性能考虑

### 性能优化
```python
import time

def benchmark_rsa_operations():
    """基准测试RSA操作"""
    # 生成测试密钥
    key = RSA.generate(2048)
    message = "Test message"
    
    # 基准测试加密
    start_time = time.time()
    cipher = PKCS1_OAEP.new(key.publickey())
    cipher.encrypt(message.encode())
    encrypt_time = time.time() - start_time
    
    # 基准测试解密
    ciphertext = cipher.encrypt(message.encode())
    start_time = time.time()
    cipher = PKCS1_OAEP.new(key)
    cipher.decrypt(ciphertext)
    decrypt_time = time.time() - start_time
    
    print(f"加密时间: {encrypt_time*1000:.2f}ms")
    print(f"解密时间: {decrypt_time*1000:.2f}ms")

def key_size_performance():
    """比较不同密钥大小的性能"""
    key_sizes = [1024, 2048, 3072, 4096]
    
    for size in key_sizes:
        start_time = time.time()
        key = RSA.generate(size)
        generation_time = time.time() - start_time
        
        print(f"{size}位密钥生成: {generation_time:.2f}s")
```

## 错误处理

### 异常处理
```python
def safe_rsa_encrypt(public_key, message):
    """带错误处理的安全RSA加密"""
    try:
        cipher = PKCS1_OAEP.new(public_key)
        ciphertext = cipher.encrypt(message.encode())
        return ciphertext
    except ValueError as e:
        print(f"加密错误: {e}")
        return None
    except Exception as e:
        print(f"意外错误: {e}")
        return None

def safe_rsa_decrypt(private_key, ciphertext):
    """带错误处理的安全RSA解密"""
    try:
        cipher = PKCS1_OAEP.new(private_key)
        plaintext = cipher.decrypt(ciphertext)
        return plaintext.decode()
    except ValueError as e:
        print(f"解密错误: {e}")
        return None
    except Exception as e:
        print(f"意外错误: {e}")
        return None
```

## 测试和验证

### 测试向量
```python
def test_rsa_operations():
    """使用已知值测试RSA操作"""
    # 生成测试密钥
    key = RSA.generate(2048)
    
    # 测试加密/解密
    message = "Test message"
    encrypted = rsa_encrypt(key.publickey(), message)
    decrypted = rsa_decrypt(key, encrypted)
    
    assert decrypted == message, "加密/解密测试失败"
    print("RSA加密/解密测试通过")
    
    # 测试数字签名
    signature = rsa_sign(key, message)
    is_valid = rsa_verify(key.publickey(), message, signature)
    
    assert is_valid, "数字签名测试失败"
    print("RSA数字签名测试通过")
``` 