# SHA 使用教程

## 环境设置

### 前置条件
- 具有SHA密码学库的编程语言
- 理解哈希函数概念
- 密码学安全原理知识
- 了解SHA算法变体及其用例

### 库选择

#### Python - hashlib和cryptography
```bash
# 内置hashlib用于基本SHA函数
# pip install cryptography  # 用于额外的SHA功能
```

#### Node.js crypto (JavaScript)
```bash
# 内置crypto模块支持SHA函数
npm install crypto-js  # 用于额外的SHA功能
```

#### OpenSSL (C/C++)
```bash
# 安装支持SHA的OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

#### Java - 内置和Bouncy Castle
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

## 基本概念

### SHA算法选择
```python
import hashlib

def sha_algorithm_guide():
    """SHA算法选择指南"""
    print("SHA算法选择指南:")
    print("SHA-1: 160位输出，已弃用（已破解）")
    print("SHA-256: 256位输出，广泛使用，安全")
    print("SHA-384: 384位输出，更高安全性")
    print("SHA-512: 512位输出，最高安全性")
    print("SHA-3: 可变输出，量子抗性")
    
    # 安全建议
    recommendations = {
        "SHA-1": "避免使用 - 已破解",
        "SHA-256": "大多数应用推荐",
        "SHA-384": "高安全要求",
        "SHA-512": "最高安全性",
        "SHA-3": "面向未来，量子抗性"
    }
    
    return recommendations
```

### 哈希函数特性
```python
def demonstrate_hash_properties():
    """演示SHA哈希函数特性"""
    message1 = "Hello, World!"
    message2 = "Hello, World"  # 略有不同
    
    # 相同输入产生相同输出
    hash1 = hashlib.sha256(message1.encode()).hexdigest()
    hash2 = hashlib.sha256(message1.encode()).hexdigest()
    print(f"确定性: {hash1 == hash2}")
    
    # 小变化产生大差异
    hash3 = hashlib.sha256(message2.encode()).hexdigest()
    print(f"雪崩效应: {hash1 != hash3}")
    print(f"原始: {hash1}")
    print(f"修改: {hash3}")
```

## 基本哈希操作

### 简单哈希
```python
import hashlib

def hash_string(message, algorithm="sha256"):
    """使用指定SHA算法哈希字符串"""
    if algorithm == "sha1":
        return hashlib.sha1(message.encode()).hexdigest()
    elif algorithm == "sha256":
        return hashlib.sha256(message.encode()).hexdigest()
    elif algorithm == "sha384":
        return hashlib.sha384(message.encode()).hexdigest()
    elif algorithm == "sha512":
        return hashlib.sha512(message.encode()).hexdigest()
    else:
        raise ValueError(f"不支持的算法: {algorithm}")

def hash_file(filename, algorithm="sha256"):
    """使用指定SHA算法哈希文件"""
    hash_obj = hashlib.new(algorithm)
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

# 使用示例
message = "Hello, SHA!"
hash_value = hash_string(message, "sha256")
print(f"'{message}'的哈希: {hash_value}")

# 文件哈希
# file_hash = hash_file("document.txt", "sha256")
# print(f"文件哈希: {file_hash}")
```

### JavaScript实现
```javascript
const crypto = require('crypto');

function hashString(message, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(message).digest('hex');
}

function hashFile(filename, algorithm = 'sha256') {
    const fs = require('fs');
    const hash = crypto.createHash(algorithm);
    
    const data = fs.readFileSync(filename);
    hash.update(data);
    
    return hash.digest('hex');
}

// 使用示例
const message = "Hello, SHA!";
const hashValue = hashString(message, 'sha256');
console.log(`'${message}'的哈希: ${hashValue}`);

// 文件哈希
// const fileHash = hashFile('document.txt', 'sha256');
// console.log(`文件哈希: ${fileHash}`);
```

## 高级用法

### HMAC（基于哈希的消息认证码）
```python
import hashlib
import hmac
import os

def create_hmac(message, key, algorithm="sha256"):
    """使用SHA算法创建HMAC"""
    if isinstance(key, str):
        key = key.encode()
    if isinstance(message, str):
        message = message.encode()
    
    return hmac.new(key, message, getattr(hashlib, algorithm)).hexdigest()

def verify_hmac(message, key, signature, algorithm="sha256"):
    """验证HMAC签名"""
    expected_signature = create_hmac(message, key, algorithm)
    return hmac.compare_digest(signature, expected_signature)

def hmac_example():
    """HMAC使用示例"""
    message = "重要消息"
    key = os.urandom(32)  # 256位密钥
    
    # 创建HMAC
    signature = create_hmac(message, key, "sha256")
    print(f"消息: {message}")
    print(f"HMAC: {signature}")
    
    # 验证HMAC
    is_valid = verify_hmac(message, key, signature, "sha256")
    print(f"签名有效: {is_valid}")
    
    return signature
```

### 带盐的密码哈希
```python
import hashlib
import os
import base64

def hash_password(password, salt=None, algorithm="sha256"):
    """使用SHA带盐哈希密码"""
    if salt is None:
        salt = os.urandom(16)
    
    if isinstance(password, str):
        password = password.encode()
    
    # 组合密码和盐
    salted_password = password + salt
    
    # 哈希组合
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(salted_password)
    hashed = hash_obj.digest()
    
    # 返回盐和哈希
    return base64.b64encode(salt).decode(), base64.b64encode(hashed).decode()

def verify_password(password, salt, stored_hash, algorithm="sha256"):
    """验证密码与存储的哈希"""
    salt_bytes = base64.b64decode(salt)
    stored_hash_bytes = base64.b64decode(stored_hash)
    
    # 使用相同盐哈希提供的密码
    computed_salt, computed_hash = hash_password(password, salt_bytes, algorithm)
    computed_hash_bytes = base64.b64decode(computed_hash)
    
    # 比较哈希
    return hmac.compare_digest(stored_hash_bytes, computed_hash_bytes)

def password_hashing_example():
    """密码哈希示例"""
    password = "mySecurePassword123"
    
    # 哈希密码
    salt, hashed = hash_password(password, algorithm="sha256")
    print(f"密码: {password}")
    print(f"盐: {salt}")
    print(f"哈希: {hashed}")
    
    # 验证密码
    is_valid = verify_password(password, salt, hashed, "sha256")
    print(f"密码有效: {is_valid}")
    
    return salt, hashed
```

## 密钥派生函数

### 使用SHA的PBKDF2
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

def derive_key_from_password(password, salt=None, iterations=100000, key_length=32):
    """使用PBKDF2和SHA-256从密码派生密钥"""
    if salt is None:
        salt = os.urandom(16)
    
    if isinstance(password, str):
        password = password.encode()
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=key_length,
        salt=salt,
        iterations=iterations,
    )
    
    key = kdf.derive(password)
    return salt, key

def verify_derived_key(password, salt, key, iterations=100000, key_length=32):
    """验证派生的密钥"""
    if isinstance(password, str):
        password = password.encode()
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=key_length,
        salt=salt,
        iterations=iterations,
    )
    
    try:
        kdf.verify(password, key)
        return True
    except:
        return False

def pbkdf2_example():
    """PBKDF2密钥派生示例"""
    password = "mySecretPassword"
    
    # 派生密钥
    salt, key = derive_key_from_password(password, iterations=100000)
    print(f"密码: {password}")
    print(f"盐: {salt.hex()}")
    print(f"派生密钥: {key.hex()}")
    
    # 验证密钥
    is_valid = verify_derived_key(password, salt, key)
    print(f"密钥验证: {is_valid}")
    
    return salt, key
```

### 使用SHA的HKDF
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import os

def derive_keys_with_hkdf(secret, salt=None, info=b"", key_length=32):
    """使用HKDF和SHA-256派生密钥"""
    if salt is None:
        salt = os.urandom(16)
    
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=key_length,
        salt=salt,
        info=info,
    )
    
    key = hkdf.derive(secret)
    return salt, key

def hkdf_example():
    """HKDF密钥派生示例"""
    # 生成密钥（例如，从ECDH密钥交换）
    secret = os.urandom(32)
    info = b"application-specific-info"
    
    # 派生密钥
    salt, key1 = derive_keys_with_hkdf(secret, info=b"encryption-key")
    _, key2 = derive_keys_with_hkdf(secret, salt=salt, info=b"authentication-key")
    
    print(f"密钥: {secret.hex()}")
    print(f"加密密钥: {key1.hex()}")
    print(f"认证密钥: {key2.hex()}")
    
    return key1, key2
```

## 数字签名

### 数字签名中的SHA
```python
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import hashlib

def create_digital_signature(message, private_key, algorithm="sha256"):
    """使用SHA创建数字签名"""
    if isinstance(message, str):
        message = message.encode()
    
    # 选择哈希算法
    if algorithm == "sha256":
        hash_algorithm = hashes.SHA256()
    elif algorithm == "sha384":
        hash_algorithm = hashes.SHA384()
    elif algorithm == "sha512":
        hash_algorithm = hashes.SHA512()
    else:
        raise ValueError(f"不支持的算法: {algorithm}")
    
    # 创建签名
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hash_algorithm),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hash_algorithm
    )
    
    return signature

def verify_digital_signature(message, signature, public_key, algorithm="sha256"):
    """使用SHA验证数字签名"""
    if isinstance(message, str):
        message = message.encode()
    
    # 选择哈希算法
    if algorithm == "sha256":
        hash_algorithm = hashes.SHA256()
    elif algorithm == "sha384":
        hash_algorithm = hashes.SHA384()
    elif algorithm == "sha512":
        hash_algorithm = hashes.SHA512()
    else:
        raise ValueError(f"不支持的算法: {algorithm}")
    
    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hash_algorithm),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hash_algorithm
        )
        return True
    except:
        return False

def digital_signature_example():
    """数字签名示例"""
    # 生成密钥对
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    public_key = private_key.public_key()
    
    # 创建签名
    message = "重要文档内容"
    signature = create_digital_signature(message, private_key, "sha256")
    print(f"消息: {message}")
    print(f"签名: {signature.hex()}")
    
    # 验证签名
    is_valid = verify_digital_signature(message, signature, public_key, "sha256")
    print(f"签名有效: {is_valid}")
    
    return signature
```

## 性能和安全性

### 性能基准测试
```python
import time
import hashlib

def benchmark_sha_algorithms():
    """基准测试不同SHA算法"""
    message = "Test message for benchmarking" * 1000  # 25KB
    
    algorithms = ["sha1", "sha256", "sha384", "sha512"]
    
    for algorithm in algorithms:
        start_time = time.time()
        
        # 多次哈希以获得准确测量
        for _ in range(1000):
            hashlib.new(algorithm).update(message.encode()).hexdigest()
        
        end_time = time.time()
        total_time = end_time - start_time
        avg_time = total_time / 1000
        
        print(f"{algorithm.upper()}: 每次哈希{avg_time*1000:.2f}ms")
    
    return algorithms

def security_recommendations():
    """SHA使用安全建议"""
    print("SHA安全建议:")
    print("✅ 通用应用使用SHA-256")
    print("✅ 高安全要求使用SHA-384或SHA-512")
    print("✅ 面向未来的应用使用SHA-3")
    print("❌ 避免SHA-1（已破解）")
    print("❌ 不要将SHA用于密码存储（使用bcrypt、Argon2）")
    print("✅ 密码哈希始终使用盐")
    print("✅ 消息认证使用HMAC")
    print("✅ 密钥派生使用PBKDF2或HKDF")
```

## 错误处理

### 安全SHA操作
```python
import hashlib

def safe_hash_operation(message, algorithm="sha256"):
    """带错误处理的安全哈希操作"""
    try:
        if isinstance(message, str):
            message = message.encode()
        
        hash_obj = hashlib.new(algorithm)
        hash_obj.update(message)
        return hash_obj.hexdigest()
        
    except ValueError as e:
        print(f"无效算法: {e}")
        return None
    except Exception as e:
        print(f"意外错误: {e}")
        return None

def validate_sha_parameters(algorithm):
    """验证SHA算法参数"""
    valid_algorithms = ["sha1", "sha256", "sha384", "sha512"]
    
    if algorithm not in valid_algorithms:
        raise ValueError(f"无效算法: {algorithm}")
    
    if algorithm == "sha1":
        print("警告: SHA-1已弃用且已破解")
    
    return True

def error_handling_example():
    """错误处理示例"""
    # 测试有效操作
    result = safe_hash_operation("test message", "sha256")
    print(f"有效操作: {result}")
    
    # 测试无效算法
    result = safe_hash_operation("test message", "invalid")
    print(f"无效算法结果: {result}")
    
    # 测试参数验证
    try:
        validate_sha_parameters("sha1")
    except ValueError as e:
        print(f"验证错误: {e}")
    
    return result
```

## 测试和验证

### 测试向量
```python
def test_sha_vectors():
    """使用已知测试向量测试SHA"""
    # SHA-256测试向量
    test_message = "abc"
    expected_hash = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    
    computed_hash = hashlib.sha256(test_message.encode()).hexdigest()
    
    if computed_hash == expected_hash:
        print("SHA-256测试向量通过")
    else:
        print("SHA-256测试向量失败")
        print(f"期望: {expected_hash}")
        print(f"计算: {computed_hash}")
    
    return computed_hash == expected_hash

# 运行所有示例
if __name__ == "__main__":
    print("SHA使用教程示例")
    print("=" * 40)
    
    # 基本示例
    sha_algorithm_guide()
    demonstrate_hash_properties()
    
    # 高级示例
    hmac_example()
    password_hashing_example()
    pbkdf2_example()
    hkdf_example()
    digital_signature_example()
    
    # 性能和安全性
    benchmark_sha_algorithms()
    security_recommendations()
    
    # 错误处理
    error_handling_example()
    
    # 测试
    test_sha_vectors()
``` 