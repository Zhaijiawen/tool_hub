# SHA 代码示例

## 基本哈希操作

### 简单字符串哈希
```python
import hashlib

# 基本SHA-256哈希
message = "Hello, World!"
hash_sha256 = hashlib.sha256(message.encode()).hexdigest()
print(f"SHA-256: {hash_sha256}")

# SHA-1（已弃用）
hash_sha1 = hashlib.sha1(message.encode()).hexdigest()
print(f"SHA-1: {hash_sha1}")

# SHA-384
hash_sha384 = hashlib.sha384(message.encode()).hexdigest()
print(f"SHA-384: {hash_sha384}")

# SHA-512
hash_sha512 = hashlib.sha512(message.encode()).hexdigest()
print(f"SHA-512: {hash_sha512}")
```

### 文件哈希
```python
import hashlib

def hash_file_sha256(filename):
    """使用SHA-256哈希文件"""
    hash_obj = hashlib.sha256()
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

# 使用示例
# file_hash = hash_file_sha256("document.txt")
# print(f"文件SHA-256: {file_hash}")
```

### 多种哈希算法
```python
import hashlib

def hash_with_multiple_algorithms(data, algorithms=None):
    """使用多种SHA算法哈希数据"""
    if algorithms is None:
        algorithms = ['sha1', 'sha256', 'sha384', 'sha512']
    
    results = {}
    for algo in algorithms:
        hash_obj = hashlib.new(algo)
        hash_obj.update(data.encode())
        results[algo] = hash_obj.hexdigest()
    
    return results

# 示例
message = "Test message"
hashes = hash_with_multiple_algorithms(message)
for algo, hash_value in hashes.items():
    print(f"{algo.upper()}: {hash_value}")
```

## 高级用法

### HMAC实现
```python
import hashlib
import hmac
import os

def create_hmac_sha256(message, key):
    """创建HMAC-SHA256"""
    if isinstance(key, str):
        key = key.encode()
    if isinstance(message, str):
        message = message.encode()
    
    return hmac.new(key, message, hashlib.sha256).hexdigest()

def verify_hmac_sha256(message, key, signature):
    """验证HMAC-SHA256签名"""
    expected = create_hmac_sha256(message, key)
    return hmac.compare_digest(signature, expected)

# 示例
message = "Important data"
key = os.urandom(32)
signature = create_hmac_sha256(message, key)
is_valid = verify_hmac_sha256(message, key, signature)
print(f"HMAC有效: {is_valid}")
```

### 带盐的密码哈希
```python
import hashlib
import os
import base64

def hash_password_sha256(password, salt=None):
    """使用SHA-256和盐哈希密码"""
    if salt is None:
        salt = os.urandom(16)
    
    if isinstance(password, str):
        password = password.encode()
    
    # 组合密码和盐
    salted = password + salt
    hash_obj = hashlib.sha256()
    hash_obj.update(salted)
    
    return base64.b64encode(salt).decode(), base64.b64encode(hash_obj.digest()).decode()

def verify_password_sha256(password, salt, stored_hash):
    """验证密码与存储的哈希"""
    salt_bytes = base64.b64decode(salt)
    stored_bytes = base64.b64decode(stored_hash)
    
    computed_salt, computed_hash = hash_password_sha256(password, salt_bytes)
    computed_bytes = base64.b64decode(computed_hash)
    
    return hmac.compare_digest(stored_bytes, computed_bytes)

# 示例
password = "mySecurePassword123"
salt, hashed = hash_password_sha256(password)
is_valid = verify_password_sha256(password, salt, hashed)
print(f"密码有效: {is_valid}")
```

### 使用PBKDF2的密钥派生
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

def derive_key_pbkdf2(password, salt=None, iterations=100000, key_length=32):
    """使用PBKDF2和SHA-256派生密钥"""
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

def verify_pbkdf2_key(password, salt, key, iterations=100000, key_length=32):
    """验证PBKDF2派生的密钥"""
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

# 示例
password = "mySecretPassword"
salt, key = derive_key_pbkdf2(password, iterations=100000)
is_valid = verify_pbkdf2_key(password, salt, key)
print(f"密钥验证: {is_valid}")
```

## 数字签名

### RSA签名中的SHA
```python
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import hashlib

def create_rsa_signature_sha256(message, private_key):
    """使用SHA-256创建RSA签名"""
    if isinstance(message, str):
        message = message.encode()
    
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    return signature

def verify_rsa_signature_sha256(message, signature, public_key):
    """使用SHA-256验证RSA签名"""
    if isinstance(message, str):
        message = message.encode()
    
    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except:
        return False

# 示例
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()

message = "Important document"
signature = create_rsa_signature_sha256(message, private_key)
is_valid = verify_rsa_signature_sha256(message, signature, public_key)
print(f"RSA签名有效: {is_valid}")
```

## 性能测试

### 哈希性能基准测试
```python
import time
import hashlib

def benchmark_sha_performance():
    """基准测试SHA算法性能"""
    test_data = "Test data for benchmarking" * 1000  # ~25KB
    
    algorithms = ['sha1', 'sha256', 'sha384', 'sha512']
    results = {}
    
    for algo in algorithms:
        start_time = time.time()
        
        # 多次哈希以获得准确测量
        for _ in range(1000):
            hashlib.new(algo).update(test_data.encode()).hexdigest()
        
        end_time = time.time()
        avg_time = (end_time - start_time) / 1000 * 1000  # 转换为毫秒
        results[algo] = avg_time
    
    return results

# 示例
performance = benchmark_sha_performance()
for algo, time_ms in performance.items():
    print(f"{algo.upper()}: 每次哈希{time_ms:.2f}ms")
```

## 安全应用

### 文件完整性验证
```python
import hashlib
import json

def create_file_checksum(filename, algorithm="sha256"):
    """创建文件完整性校验和"""
    hash_obj = hashlib.new(algorithm)
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

def verify_file_integrity(filename, expected_hash, algorithm="sha256"):
    """验证文件完整性与期望哈希"""
    actual_hash = create_file_checksum(filename, algorithm)
    return hmac.compare_digest(actual_hash, expected_hash)

def save_checksums(files, algorithm="sha256"):
    """保存多个文件的校验和"""
    checksums = {}
    for filename in files:
        checksums[filename] = create_file_checksum(filename, algorithm)
    
    with open("checksums.json", "w") as f:
        json.dump(checksums, f, indent=2)
    
    return checksums

# 使用示例
# files = ["document1.txt", "document2.txt", "image.jpg"]
# checksums = save_checksums(files)
# print("校验和已保存到checksums.json")
```

### 安全随机哈希生成
```python
import hashlib
import os
import secrets

def generate_secure_hash(data=None, algorithm="sha256"):
    """生成安全哈希，可选随机数据"""
    if data is None:
        data = secrets.token_hex(32)
    
    if isinstance(data, str):
        data = data.encode()
    
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(data)
    
    return hash_obj.hexdigest()

def generate_nonce_hash(nonce_length=16, algorithm="sha256"):
    """生成基于哈希的随机数"""
    nonce = secrets.token_hex(nonce_length)
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(nonce.encode())
    
    return nonce, hash_obj.hexdigest()

# 示例
secure_hash = generate_secure_hash()
nonce, nonce_hash = generate_nonce_hash()
print(f"安全哈希: {secure_hash}")
print(f"随机数: {nonce}")
print(f"随机数哈希: {nonce_hash}")
```

## 错误处理

### 安全哈希操作
```python
import hashlib

def safe_hash_operation(data, algorithm="sha256"):
    """带错误处理的安全哈希操作"""
    try:
        if isinstance(data, str):
            data = data.encode()
        
        hash_obj = hashlib.new(algorithm)
        hash_obj.update(data)
        return hash_obj.hexdigest()
        
    except ValueError as e:
        print(f"无效算法 '{algorithm}': {e}")
        return None
    except Exception as e:
        print(f"意外错误: {e}")
        return None

def validate_hash_algorithm(algorithm):
    """验证哈希算法"""
    valid_algorithms = ['sha1', 'sha256', 'sha384', 'sha512']
    
    if algorithm not in valid_algorithms:
        raise ValueError(f"不支持的算法: {algorithm}")
    
    if algorithm == 'sha1':
        print("警告: SHA-1已弃用且已破解")
    
    return True

# 示例
result = safe_hash_operation("test data", "sha256")
print(f"有效哈希: {result}")

result = safe_hash_operation("test data", "invalid")
print(f"无效算法结果: {result}")

try:
    validate_hash_algorithm("sha1")
except ValueError as e:
    print(f"验证错误: {e}")
```

## 测试和验证

### 哈希测试向量
```python
def test_sha_vectors():
    """使用已知测试向量测试SHA"""
    test_cases = [
        ("", "sha256", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
        ("abc", "sha256", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"),
        ("Hello, World!", "sha256", "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f")
    ]
    
    results = []
    for message, algorithm, expected in test_cases:
        computed = hashlib.new(algorithm).update(message.encode()).hexdigest()
        passed = computed == expected
        results.append((message, algorithm, passed, computed, expected))
        
        status = "通过" if passed else "失败"
        print(f"{status}: {algorithm.upper()}('{message}')")
        if not passed:
            print(f"  期望: {expected}")
            print(f"  计算: {computed}")
    
    return results

# 运行测试
test_results = test_sha_vectors()
passed = sum(1 for _, _, passed, _, _ in test_results if passed)
total = len(test_results)
print(f"\n测试结果: {passed}/{total} 通过")
```

## JavaScript示例

### Node.js SHA实现
```javascript
const crypto = require('crypto');

// 基本SHA-256哈希
function hashString(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
}

// 文件哈希
function hashFile(filename, algorithm = 'sha256') {
    const fs = require('fs');
    const hash = crypto.createHash(algorithm);
    const data = fs.readFileSync(filename);
    hash.update(data);
    return hash.digest('hex');
}

// HMAC创建
function createHmac(data, key, algorithm = 'sha256') {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
}

// 使用示例
const message = "Hello, World!";
const hash = hashString(message);
const hmac = createHmac(message, "secret-key");
console.log(`哈希: ${hash}`);
console.log(`HMAC: ${hmac}`);
```

## 总结

这些示例演示了：
- 字符串和文件的基本SHA哈希操作
- 使用HMAC和密码哈希的高级用法
- 使用PBKDF2的密钥派生
- 使用RSA的数字签名
- 性能基准测试
- 文件完整性安全应用
- 错误处理和验证
- 使用已知测试向量的测试
- JavaScript实现

所有示例都遵循安全最佳实践，并为其预期用途使用适当的算法。 