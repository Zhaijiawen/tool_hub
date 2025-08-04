# ECC 使用教程

## 环境设置

### 前置条件
- 具有ECC加密库的编程语言
- 理解椭圆曲线数学
- 公钥密码学概念知识
- 了解ECC安全考虑

### 库选择

#### PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### Node.js crypto (JavaScript)
```bash
# 内置crypto模块支持ECC
npm install elliptic  # 用于额外的ECC功能
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
# 安装支持ECC的OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

## 基本概念

### 曲线选择
```python
from Crypto.PublicKey import ECC

def curve_selection_guide():
    """ECC曲线选择指南"""
    print("ECC曲线选择指南:")
    print("P-256: NIST曲线，广泛支持，128位安全性")
    print("P-384: NIST曲线，更高安全性，性能较慢")
    print("Curve25519: 高性能曲线，128位安全性")
    print("Ed25519: Edwards曲线用于签名，快速且安全")
    
    # 安全级别
    security_levels = {
        "P-256": "128位（推荐）",
        "P-384": "192位（高安全性）",
        "Curve25519": "128位（高性能）",
        "Ed25519": "128位（仅签名）"
    }
    
    return security_levels
```

### 密钥对结构
```python
def generate_ecc_key_pair(curve_name="P-256"):
    """生成ECC密钥对"""
    key = ECC.generate(curve=curve_name)
    
    # 提取组件
    private_key = key
    public_key = key.public_key()
    
    print(f"生成了{curve_name} ECC密钥对")
    print(f"私钥: {private_key.d}")
    print(f"公钥: {public_key.pointQ}")
    
    return private_key, public_key
```

## 密钥生成

### 基本密钥生成
```python
from Crypto.PublicKey import ECC
import os

def generate_ecc_key_pair(curve_name="P-256"):
    """生成指定曲线的ECC密钥对"""
    key = ECC.generate(curve=curve_name)
    
    print(f"生成了{curve_name} ECC密钥对")
    print(f"曲线: {key.curve}")
    print(f"密钥大小: {key.pointQ.size_in_bits()} 位")
    
    return key

def save_key_pair(key, filename_prefix):
    """保存ECC密钥对到文件"""
    # 保存私钥
    with open(f"{filename_prefix}_private.pem", "wb") as f:
        f.write(key.export_key(format='PEM'))
    
    # 保存公钥
    with open(f"{filename_prefix}_public.pem", "wb") as f:
        f.write(key.public_key().export_key(format='PEM'))
    
    print(f"密钥保存为{filename_prefix}_private.pem和{filename_prefix}_public.pem")
```

### 自定义参数的密钥生成
```python
def generate_ecc_with_custom_curve():
    """生成不同曲线的ECC密钥"""
    curves = ["P-256", "P-384", "P-521"]
    
    for curve in curves:
        key = ECC.generate(curve=curve)
        print(f"{curve}: {key.pointQ.size_in_bits()} 位")
    
    return key

def validate_key_parameters(key):
    """验证ECC密钥参数"""
    # 检查曲线
    if key.curve not in ["P-256", "P-384", "P-521"]:
        print("警告: 非标准曲线")
    
    # 检查密钥大小
    if key.pointQ.size_in_bits() < 256:
        print("警告: 密钥大小小于256位")
    
    # 检查私钥
    if key.d == 0:
        print("错误: 无效私钥")
        return False
    
    return True
```

## 密钥交换 (ECDH)

### 基本ECDH密钥交换
```python
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

def ecdh_key_exchange(private_key_a, public_key_b):
    """执行ECDH密钥交换"""
    # 计算共享密钥
    shared_secret = private_key_a.d * public_key_b.pointQ
    
    # 转换为字节
    shared_bytes = shared_secret.x.to_bytes(32, 'big')
    
    # 派生密钥材料
    key_material = HKDF(shared_bytes, 32, b"", SHA256)
    
    return key_material

def ecdh_example():
    """完整ECDH密钥交换示例"""
    # 为两方生成密钥对
    alice_key = ECC.generate(curve='P-256')
    bob_key = ECC.generate(curve='P-256')
    
    # 交换公钥
    alice_public = alice_key.public_key()
    bob_public = bob_key.public_key()
    
    # 计算共享密钥
    alice_shared = ecdh_key_exchange(alice_key, bob_public)
    bob_shared = ecdh_key_exchange(bob_key, alice_public)
    
    # 验证它们匹配
    assert alice_shared == bob_shared
    print("ECDH密钥交换成功")
    
    return alice_shared
```

### 带密钥派生的ECDH
```python
def ecdh_with_derivation(private_key, public_key, salt=None):
    """带适当密钥派生的ECDH"""
    # 计算共享密钥
    shared_point = private_key.d * public_key.pointQ
    
    # 转换为字节
    shared_bytes = shared_point.x.to_bytes(32, 'big')
    
    # 如果未提供则生成盐值
    if salt is None:
        salt = os.urandom(16)
    
    # 使用HKDF派生密钥
    derived_key = HKDF(shared_bytes, 32, salt, SHA256)
    
    return derived_key, salt

def secure_key_exchange():
    """带密钥派生的安全ECDH密钥交换"""
    # 生成密钥
    alice_key = ECC.generate(curve='P-256')
    bob_key = ECC.generate(curve='P-256')
    
    # 交换公钥
    alice_public = alice_key.public_key()
    bob_public = bob_key.public_key()
    
    # 生成盐值
    salt = os.urandom(16)
    
    # 派生共享密钥
    alice_key_material, _ = ecdh_with_derivation(alice_key, bob_public, salt)
    bob_key_material, _ = ecdh_with_derivation(bob_key, alice_public, salt)
    
    assert alice_key_material == bob_key_material
    return alice_key_material
```

## 数字签名

### ECDSA签名
```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

def ecdsa_sign(private_key, message):
    """使用ECDSA签名消息"""
    # 创建消息的哈希
    hash_obj = SHA256.new(message.encode())
    
    # 创建签名者
    signer = DSS.new(private_key, 'fips-186-3')
    
    # 签名哈希
    signature = signer.sign(hash_obj)
    
    return signature

def ecdsa_verify(public_key, message, signature):
    """验证ECDSA签名"""
    # 创建消息的哈希
    hash_obj = SHA256.new(message.encode())
    
    # 创建验证者
    verifier = DSS.new(public_key, 'fips-186-3')
    
    try:
        verifier.verify(hash_obj, signature)
        return True
    except ValueError:
        return False

# 使用示例
def ecdsa_example():
    """ECDSA签名示例"""
    # 生成密钥对
    key = ECC.generate(curve='P-256')
    
    # 签名消息
    message = "Hello, ECDSA!"
    signature = ecdsa_sign(key, message)
    
    # 验证签名
    is_valid = ecdsa_verify(key.public_key(), message, signature)
    
    print(f"消息: {message}")
    print(f"签名有效: {is_valid}")
    
    return signature
```

### EdDSA签名
```python
def eddsa_sign(private_key, message):
    """使用EdDSA签名消息"""
    # 创建消息的哈希
    hash_obj = SHA256.new(message.encode())
    
    # 创建签名者（EdDSA使用不同格式）
    signer = DSS.new(private_key, 'deterministic-rfc6979')
    
    # 签名哈希
    signature = signer.sign(hash_obj)
    
    return signature

def eddsa_verify(public_key, message, signature):
    """验证EdDSA签名"""
    # 创建消息的哈希
    hash_obj = SHA256.new(message.encode())
    
    # 创建验证者
    verifier = DSS.new(public_key, 'deterministic-rfc6979')
    
    try:
        verifier.verify(hash_obj, signature)
        return True
    except ValueError:
        return False
```

## 高级用法

### 混合加密
```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def ecc_hybrid_encrypt(ecc_public_key, message):
    """使用ECC + AES的混合加密"""
    # 生成随机AES密钥
    aes_key = get_random_bytes(32)  # 256位密钥
    
    # 使用ECC加密AES密钥（ECDH）
    shared_point = ecc_public_key.pointQ  # 实际中，使用ECDH
    # 这是简化的 - 在实际实现中，使用适当的ECDH
    
    # 使用AES加密消息
    cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    
    return aes_key, cipher.nonce, ciphertext, tag

def ecc_hybrid_decrypt(ecc_private_key, aes_key, nonce, ciphertext, tag):
    """使用ECC + AES的混合解密"""
    # 使用ECC解密AES密钥（ECDH）
    # 这是简化的 - 在实际实现中，使用适当的ECDH
    
    # 使用AES解密消息
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    
    return plaintext.decode()
```

### 密钥管理
```python
def load_ecc_key_from_file(filename):
    """从PEM文件加载ECC密钥"""
    with open(filename, "rb") as f:
        key_data = f.read()
    
    return ECC.import_key(key_data)

def export_ecc_key_to_pem(key, filename):
    """导出ECC密钥到PEM文件"""
    with open(filename, "wb") as f:
        f.write(key.export_key(format='PEM'))

def key_fingerprint(public_key):
    """生成密钥指纹用于识别"""
    import hashlib
    key_data = public_key.export_key(format='DER')
    fingerprint = hashlib.sha256(key_data).hexdigest()
    return fingerprint[:16]  # 前16个字符
```

## 安全最佳实践

### 安全密钥生成
```python
def secure_ecc_generation():
    """安全ECC密钥生成实践"""
    print("安全ECC密钥生成指南:")
    print("1. 使用标准化曲线（P-256、Curve25519）")
    print("2. 尽可能在安全硬件上生成密钥")
    print("3. 安全存储私钥")
    print("4. 使用强随机数生成器")
    print("5. 生成后验证密钥参数")
    print("6. 为安全级别使用适当的密钥大小")

def check_ecc_security(key):
    """检查ECC密钥安全参数"""
    issues = []
    
    if key.curve not in ["P-256", "P-384", "P-521"]:
        issues.append("非标准曲线")
    
    if key.pointQ.size_in_bits() < 256:
        issues.append("密钥大小太小")
    
    if key.d == 0:
        issues.append("无效私钥")
    
    return issues
```

### 曲线安全性
```python
def curve_security_guide():
    """ECC曲线安全指南"""
    print("ECC曲线安全性:")
    print("✅ 通用用途使用P-256（128位安全性）")
    print("✅ 高安全性使用P-384（192位安全性）")
    print("✅ 高性能使用Curve25519")
    print("✅ 数字签名使用Ed25519")
    print("❌ 避免自定义曲线")
    print("❌ 避免已弃用的曲线")
    
    print("\n曲线建议:")
    print("- P-256: 广泛支持，良好性能")
    print("- P-384: 更高安全性，性能较慢")
    print("- Curve25519: 高性能，现代设计")
    print("- Ed25519: 快速签名，确定性")
```

## 性能考虑

### 性能优化
```python
import time

def benchmark_ecc_operations():
    """基准测试ECC操作"""
    # 生成测试密钥
    key = ECC.generate(curve='P-256')
    message = "Test message"
    
    # 基准测试密钥生成
    start_time = time.time()
    test_key = ECC.generate(curve='P-256')
    generation_time = time.time() - start_time
    
    # 基准测试签名
    start_time = time.time()
    signature = ecdsa_sign(key, message)
    signing_time = time.time() - start_time
    
    # 基准测试验证
    start_time = time.time()
    ecdsa_verify(key.public_key(), message, signature)
    verification_time = time.time() - start_time
    
    print(f"密钥生成: {generation_time*1000:.2f}ms")
    print(f"签名: {signing_time*1000:.2f}ms")
    print(f"验证: {verification_time*1000:.2f}ms")

def curve_performance_comparison():
    """比较不同曲线的性能"""
    curves = ["P-256", "P-384", "P-521"]
    
    for curve in curves:
        start_time = time.time()
        key = ECC.generate(curve=curve)
        generation_time = time.time() - start_time
        
        print(f"{curve}密钥生成: {generation_time*1000:.2f}ms")
```

## 错误处理

### 异常处理
```python
def safe_ecc_operations():
    """带错误处理的安全ECC操作"""
    try:
        # 生成密钥
        key = ECC.generate(curve='P-256')
        
        # 签名消息
        message = "Test message"
        signature = ecdsa_sign(key, message)
        
        # 验证签名
        is_valid = ecdsa_verify(key.public_key(), message, signature)
        
        return True, "操作成功"
        
    except ValueError as e:
        return False, f"值错误: {e}"
    except Exception as e:
        return False, f"意外错误: {e}"

def validate_ecc_parameters(curve_name):
    """验证ECC曲线参数"""
    valid_curves = ["P-256", "P-384", "P-521"]
    
    if curve_name not in valid_curves:
        raise ValueError(f"无效曲线: {curve_name}")
    
    return True
```

## 测试和验证

### 测试向量
```python
def test_ecc_operations():
    """使用已知值测试ECC操作"""
    # 生成测试密钥
    key = ECC.generate(curve='P-256')
    
    # 测试ECDSA
    message = "Test message"
    signature = ecdsa_sign(key, message)
    is_valid = ecdsa_verify(key.public_key(), message, signature)
    
    assert is_valid, "ECDSA测试失败"
    print("ECC ECDSA测试通过")
    
    # 测试密钥交换
    alice_key = ECC.generate(curve='P-256')
    bob_key = ECC.generate(curve='P-256')
    
    alice_shared = ecdh_key_exchange(alice_key, bob_key.public_key())
    bob_shared = ecdh_key_exchange(bob_key, alice_key.public_key())
    
    assert alice_shared == bob_shared, "ECDH测试失败"
    print("ECC ECDH测试通过")
``` 