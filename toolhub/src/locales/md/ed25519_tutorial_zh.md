# Ed25519 使用教程

## 环境设置

### 前置条件
- 支持Ed25519库的编程语言
- 椭圆曲线密码学理解
- 数字签名概念知识
- Ed25519安全考虑意识

### 库选择

#### PyNaCl (Python)
```bash
pip install pynacl
```

#### Node.js crypto (JavaScript)
```bash
# 内置crypto模块，无需安装
```

#### libsodium (C/C++)
```bash
# 安装libsodium
sudo apt-get install libsodium-dev  # Ubuntu/Debian
brew install libsodium              # macOS
```

#### Go crypto/ed25519
```bash
# Go标准库内置，无需安装
```

## 基本概念

### Ed25519密钥结构
```python
import nacl.signing

# 生成Ed25519密钥对
signing_key = nacl.signing.SigningKey.generate()
verify_key = signing_key.verify_key

# 密钥组件
private_key_bytes = bytes(signing_key)
public_key_bytes = bytes(verify_key)

print(f"私钥大小: {len(private_key_bytes)} 字节")
print(f"公钥大小: {len(public_key_bytes)} 字节")
print(f"私钥: {private_key_bytes.hex()}")
print(f"公钥: {public_key_bytes.hex()}")
```

### 密钥大小和格式
```python
def key_information():
    """Ed25519密钥信息"""
    print("Ed25519密钥信息:")
    print("私钥: 32字节 (256位)")
    print("公钥: 32字节 (256位)")
    print("签名: 64字节 (512位)")
    print("安全级别: ~128位")
    
    # 密钥格式
    print("\n密钥格式:")
    print("私钥: 原始32字节标量")
    print("公钥: 压缩Edwards曲线点")
    print("签名: R (32字节) || s (32字节)")
```

## 密钥生成

### 基本密钥生成
```python
import nacl.signing
import os

def generate_ed25519_key_pair():
    """生成Ed25519密钥对"""
    # 生成随机签名密钥
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    print("已生成Ed25519密钥对")
    print(f"私钥: {bytes(signing_key).hex()}")
    print(f"公钥: {bytes(verify_key).hex()}")
    
    return signing_key, verify_key

def save_key_pair(signing_key, verify_key, filename_prefix):
    """保存Ed25519密钥对到文件"""
    # 保存私钥
    with open(f"{filename_prefix}_private.key", "wb") as f:
        f.write(bytes(signing_key))
    
    # 保存公钥
    with open(f"{filename_prefix}_public.key", "wb") as f:
        f.write(bytes(verify_key))
    
    print(f"密钥已保存为 {filename_prefix}_private.key 和 {filename_prefix}_public.key")
```

### 确定性密钥生成
```python
def generate_deterministic_key(seed):
    """从种子生成Ed25519密钥"""
    if len(seed) < 32:
        # 填充种子到32字节
        seed = seed.ljust(32, b'\x00')
    elif len(seed) > 32:
        # 截断种子到32字节
        seed = seed[:32]
    
    signing_key = nacl.signing.SigningKey(seed)
    verify_key = signing_key.verify_key
    
    print("已生成确定性Ed25519密钥对")
    return signing_key, verify_key

# 使用示例
seed = b"my_secret_seed_for_key_generation"
signing_key, verify_key = generate_deterministic_key(seed)
```

## 数字签名

### 基本Ed25519签名
```python
def ed25519_sign(signing_key, message):
    """使用Ed25519签名消息"""
    # 签名消息
    signature = signing_key.sign(message.encode())
    
    return signature.signature

def ed25519_verify(verify_key, message, signature):
    """验证Ed25519签名"""
    try:
        # 创建签名消息对象
        signed_message = nacl.signing.SignedMessage(message.encode() + signature)
        
        # 验证签名
        verify_key.verify(signed_message)
        return True
    except nacl.exceptions.BadSignatureError:
        return False

# 使用示例
signing_key, verify_key = generate_ed25519_key_pair()
message = "Hello, Ed25519 signing!"

signature = ed25519_sign(signing_key, message)
is_valid = ed25519_verify(verify_key, message, signature)

print(f"消息: {message}")
print(f"签名: {signature.hex()}")
print(f"有效: {is_valid}")
```

### 不同消息类型的Ed25519
```python
def sign_binary_data(signing_key, data):
    """使用Ed25519签名二进制数据"""
    signature = signing_key.sign(data)
    return signature.signature

def sign_file(signing_key, file_path):
    """使用Ed25519签名文件"""
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    signature = signing_key.sign(file_data)
    return signature.signature

def verify_file(verify_key, file_path, signature):
    """使用Ed25519验证文件签名"""
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    try:
        signed_message = nacl.signing.SignedMessage(file_data + signature)
        verify_key.verify(signed_message)
        return True
    except nacl.exceptions.BadSignatureError:
        return False
```

## 高级用法

### 批量签名验证
```python
def batch_verify_signatures(verify_keys, messages, signatures):
    """高效验证多个签名"""
    results = []
    
    for i, (verify_key, message, signature) in enumerate(zip(verify_keys, messages, signatures)):
        try:
            signed_message = nacl.signing.SignedMessage(message.encode() + signature)
            verify_key.verify(signed_message)
            results.append(True)
        except nacl.exceptions.BadSignatureError:
            results.append(False)
    
    return results

# 批量验证示例
messages = ["Message 1", "Message 2", "Message 3"]
signatures = []
verify_keys = []

for i, message in enumerate(messages):
    signing_key, verify_key = generate_ed25519_key_pair()
    signature = ed25519_sign(signing_key, message)
    
    signatures.append(signature)
    verify_keys.append(verify_key)

# 批量验证所有签名
results = batch_verify_signatures(verify_keys, messages, signatures)
print(f"批量验证结果: {results}")
```

### 密钥派生
```python
import hashlib

def derive_ed25519_key(password, salt=None):
    """从密码派生Ed25519密钥"""
    if salt is None:
        salt = os.urandom(16)
    
    # 使用PBKDF2派生密钥材料
    key_material = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, 32)
    
    # 从派生材料生成Ed25519密钥
    signing_key = nacl.signing.SigningKey(key_material)
    verify_key = signing_key.verify_key
    
    return signing_key, verify_key, salt

# 密钥派生示例
password = "my_secure_password"
signing_key, verify_key, salt = derive_ed25519_key(password)
print(f"从密码派生的密钥，盐值: {salt.hex()}")
```

## 安全最佳实践

### 安全密钥生成
```python
def secure_key_generation():
    """安全Ed25519密钥生成实践"""
    print("安全密钥生成指南:")
    print("1. 使用密码学安全的随机数生成器")
    print("2. 尽可能在安全硬件上生成密钥")
    print("3. 安全存储私钥")
    print("4. 使用确定性生成以获得可重现密钥")
    print("5. 生成后验证密钥参数")
    print("6. 切勿在应用程序间重用私钥")

def check_key_security(signing_key):
    """检查Ed25519密钥安全参数"""
    private_key_bytes = bytes(signing_key)
    
    # 检查密钥大小
    if len(private_key_bytes) != 32:
        return False, "无效私钥大小"
    
    # 检查弱密钥（全零、全一等）
    if private_key_bytes == b'\x00' * 32:
        return False, "弱私钥（全零）"
    
    if private_key_bytes == b'\xff' * 32:
        return False, "弱私钥（全一）"
    
    return True, "密钥安全检查通过"
```

### 确定性签名
```python
def deterministic_signature_properties():
    """Ed25519确定性签名特性"""
    print("Ed25519确定性签名:")
    print("✅ 相同消息和密钥总是产生相同签名")
    print("✅ 无需随机数生成")
    print("✅ 消除随机数漏洞")
    print("✅ 可重现用于测试和验证")
    print("✅ 侧信道抵抗")
    
    # 演示确定性
    signing_key, verify_key = generate_ed25519_key_pair()
    message = "Test message"
    
    signature1 = ed25519_sign(signing_key, message)
    signature2 = ed25519_sign(signing_key, message)
    
    print(f"\n确定性签名相同: {signature1 == signature2}")
```

## 性能考虑

### 性能优化
```python
import time

def benchmark_ed25519_operations():
    """Ed25519操作基准测试"""
    # 生成测试密钥
    signing_key, verify_key = generate_ed25519_key_pair()
    message = "Benchmark test message"
    
    # 签名基准测试
    start_time = time.time()
    for _ in range(1000):
        signature = ed25519_sign(signing_key, message)
    signing_time = time.time() - start_time
    
    # 验证基准测试
    start_time = time.time()
    for _ in range(1000):
        is_valid = ed25519_verify(verify_key, message, signature)
    verification_time = time.time() - start_time
    
    print(f"签名: {signing_time/1000*1000:.2f}ms 每次签名")
    print(f"验证: {verification_time/1000*1000:.2f}ms 每次验证")

# 运行基准测试
benchmark_ed25519_operations()
```

### 内存使用分析
```python
import sys

def analyze_memory_usage():
    """分析Ed25519内存使用"""
    # 测量密钥生成前的内存
    initial_memory = sys.getsizeof(object())
    
    # 生成多个密钥对
    keys = []
    for i in range(100):
        signing_key, verify_key = generate_ed25519_key_pair()
        keys.append((signing_key, verify_key))
    
    # 测量密钥生成后的内存
    final_memory = sys.getsizeof(keys)
    memory_per_key = (final_memory - initial_memory) / 100
    
    print(f"每个密钥对内存使用: {memory_per_key:.2f} 字节")
    print(f"100个密钥总内存: {final_memory - initial_memory:.2f} 字节")
```

## 错误处理

### 异常处理
```python
def safe_ed25519_sign(signing_key, message):
    """带错误处理的安全Ed25519签名"""
    try:
        signature = ed25519_sign(signing_key, message)
        return signature
    except Exception as e:
        print(f"签名错误: {e}")
        return None

def safe_ed25519_verify(verify_key, message, signature):
    """带错误处理的安全Ed25519验证"""
    try:
        is_valid = ed25519_verify(verify_key, message, signature)
        return is_valid
    except Exception as e:
        print(f"验证错误: {e}")
        return False

# 测试安全操作
message = "Safe operation test"
signature = safe_ed25519_sign(signing_key, message)
if signature:
    is_valid = safe_ed25519_verify(verify_key, message, signature)
    print(f"安全操作结果: {is_valid}")
```

## 测试和验证

### 测试向量
```python
def test_ed25519_operations():
    """使用已知值测试Ed25519操作"""
    # 生成测试密钥
    signing_key, verify_key = generate_ed25519_key_pair()
    
    # 测试签名/验证
    message = "Test message"
    signature = ed25519_sign(signing_key, message)
    is_valid = ed25519_verify(verify_key, message, signature)
    
    assert is_valid, "Ed25519签名测试失败"
    print("Ed25519签名测试通过")
    
    # 测试不同消息
    different_message = "Different message"
    is_valid = ed25519_verify(verify_key, different_message, signature)
    
    assert not is_valid, "Ed25519验证应该对不同消息失败"
    print("Ed25519验证测试通过")

# 运行测试
test_ed25519_operations()
```

### 密钥验证
```python
def validate_ed25519_key(signing_key):
    """验证Ed25519密钥参数"""
    # 检查私钥
    private_key_bytes = bytes(signing_key)
    if len(private_key_bytes) != 32:
        return False, "无效私钥大小"
    
    # 检查公钥
    verify_key = signing_key.verify_key
    public_key_bytes = bytes(verify_key)
    if len(public_key_bytes) != 32:
        return False, "无效公钥大小"
    
    # 检查签名大小
    test_message = b"test"
    signature = signing_key.sign(test_message).signature
    if len(signature) != 64:
        return False, "无效签名大小"
    
    return True, "Ed25519密钥验证通过"
``` 