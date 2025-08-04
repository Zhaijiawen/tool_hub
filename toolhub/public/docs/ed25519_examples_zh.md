# Ed25519 代码示例

## 基本Ed25519操作

### 简单密钥生成和签名
```python
import nacl.signing
import os

def basic_ed25519_example():
    """基本Ed25519密钥生成和签名示例"""
    # 生成Ed25519密钥对
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # 签名消息
    message = "Hello, Ed25519!"
    signed_message = signing_key.sign(message.encode())
    
    # 验证签名
    try:
        verify_key.verify(signed_message)
        print("签名验证成功！")
        return True
    except nacl.exceptions.BadSignatureError:
        print("签名验证失败！")
        return False

# 运行示例
basic_ed25519_example()
```

### 密钥信息显示
```python
def display_key_info():
    """显示Ed25519密钥信息"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    print("Ed25519密钥信息:")
    print(f"私钥 (32字节): {bytes(signing_key).hex()}")
    print(f"公钥 (32字节): {bytes(verify_key).hex()}")
    print(f"私钥长度: {len(bytes(signing_key))} 字节")
    print(f"公钥长度: {len(bytes(verify_key))} 字节")
    
    # 测试签名大小
    test_message = "Test"
    signature = signing_key.sign(test_message.encode()).signature
    print(f"签名长度: {len(signature)} 字节")
    print(f"签名: {signature.hex()}")

display_key_info()
```

## 高级密钥管理

### 确定性密钥生成
```python
import hashlib

def deterministic_key_from_seed(seed):
    """从种子确定性生成Ed25519密钥"""
    # 哈希种子以获得32字节
    if isinstance(seed, str):
        seed = seed.encode()
    
    # 使用SHA-256获得32字节
    key_material = hashlib.sha256(seed).digest()
    
    # 从材料生成签名密钥
    signing_key = nacl.signing.SigningKey(key_material)
    verify_key = signing_key.verify_key
    
    print(f"从种子生成确定性密钥: {seed}")
    print(f"公钥: {bytes(verify_key).hex()}")
    
    return signing_key, verify_key

# 测试确定性生成
seed1 = "my_secret_seed"
seed2 = "my_secret_seed"

key1, _ = deterministic_key_from_seed(seed1)
key2, _ = deterministic_key_from_seed(seed2)

# 验证确定性
print(f"密钥相同: {bytes(key1) == bytes(key2)}")
```

### 从密码派生密钥
```python
import hashlib
import os

def derive_key_from_password(password, salt=None):
    """使用PBKDF2从密码派生Ed25519密钥"""
    if salt is None:
        salt = os.urandom(16)
    
    # 使用PBKDF2派生密钥材料
    key_material = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, 32)
    
    # 生成Ed25519密钥
    signing_key = nacl.signing.SigningKey(key_material)
    verify_key = signing_key.verify_key
    
    return signing_key, verify_key, salt

# 使用示例
password = "my_secure_password"
signing_key, verify_key, salt = derive_key_from_password(password)

print(f"从密码派生的密钥")
print(f"盐值: {salt.hex()}")
print(f"公钥: {bytes(verify_key).hex()}")

# 使用相同密码和盐值测试
signing_key2, verify_key2, _ = derive_key_from_password(password, salt)
print(f"密钥匹配: {bytes(verify_key) == bytes(verify_key2)}")
```

## 签名操作

### 基本签名和验证
```python
def sign_and_verify_example():
    """完整Ed25519签名和验证示例"""
    # 生成密钥
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # 要签名的消息
    messages = [
        "Hello, World!",
        "Ed25519 is awesome",
        "Cryptographic signatures"
    ]
    
    signatures = []
    
    # 签名所有消息
    for message in messages:
        signature = signing_key.sign(message.encode()).signature
        signatures.append(signature)
        print(f"已签名: {message}")
        print(f"签名: {signature.hex()}")
    
    # 验证所有签名
    print("\n验证签名:")
    for i, (message, signature) in enumerate(zip(messages, signatures)):
        try:
            # 为验证创建签名消息
            signed_message = nacl.signing.SignedMessage(message.encode() + signature)
            verify_key.verify(signed_message)
            print(f"✓ 消息 {i+1} 验证成功")
        except nacl.exceptions.BadSignatureError:
            print(f"✗ 消息 {i+1} 验证失败")

sign_and_verify_example()
```

### 二进制数据签名
```python
def sign_binary_data():
    """使用Ed25519签名二进制数据"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # 二进制数据
    binary_data = b'\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09'
    
    # 签名二进制数据
    signature = signing_key.sign(binary_data).signature
    
    print(f"二进制数据: {binary_data.hex()}")
    print(f"签名: {signature.hex()}")
    
    # 验证二进制数据
    try:
        signed_message = nacl.signing.SignedMessage(binary_data + signature)
        verify_key.verify(signed_message)
        print("二进制数据签名验证成功！")
    except nacl.exceptions.BadSignatureError:
        print("二进制数据签名验证失败！")

sign_binary_data()
```

## 文件操作

### 文件签名和验证
```python
def sign_file_example():
    """使用Ed25519签名和验证文件"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # 创建测试文件
    test_content = "This is a test file for Ed25519 signing."
    with open("test_file.txt", "w") as f:
        f.write(test_content)
    
    # 签名文件
    with open("test_file.txt", "rb") as f:
        file_data = f.read()
    
    signature = signing_key.sign(file_data).signature
    
    # 保存签名
    with open("test_file.sig", "wb") as f:
        f.write(signature)
    
    print(f"文件已签名: test_file.txt")
    print(f"签名已保存: test_file.sig")
    print(f"签名: {signature.hex()}")
    
    # 验证文件
    with open("test_file.txt", "rb") as f:
        file_data = f.read()
    
    with open("test_file.sig", "rb") as f:
        signature = f.read()
    
    try:
        signed_message = nacl.signing.SignedMessage(file_data + signature)
        verify_key.verify(signed_message)
        print("文件签名验证成功！")
    except nacl.exceptions.BadSignatureError:
        print("文件签名验证失败！")

sign_file_example()
```

## 批量操作

### 批量签名验证
```python
def batch_verification_example():
    """高效验证多个Ed25519签名"""
    # 生成多个密钥对
    num_keys = 10
    signing_keys = []
    verify_keys = []
    messages = []
    signatures = []
    
    for i in range(num_keys):
        signing_key = nacl.signing.SigningKey.generate()
        verify_key = signing_key.verify_key
        
        message = f"Message {i+1}"
        
        signing_keys.append(signing_key)
        verify_keys.append(verify_key)
        messages.append(message)
        signatures.append(signing_key.sign(message.encode()).signature)
    
    # 批量验证所有签名
    print("批量验证结果:")
    valid_count = 0
    
    for i in range(num_keys):
        try:
            signed_message = nacl.signing.SignedMessage(messages[i].encode() + signatures[i])
            verify_keys[i].verify(signed_message)
            print(f"✓ 消息 {i+1}: 有效")
            valid_count += 1
        except nacl.exceptions.BadSignatureError:
            print(f"✗ 消息 {i+1}: 无效")
    
    print(f"\n有效签名总数: {valid_count}/{num_keys}")

batch_verification_example()
```

## 安全应用

### 安全通信协议
```python
def secure_communication_example():
    """使用Ed25519模拟安全通信"""
    # Alice生成她的密钥对
    alice_signing_key = nacl.signing.SigningKey.generate()
    alice_verify_key = alice_signing_key.verify_key
    
    # Bob生成他的密钥对
    bob_signing_key = nacl.signing.SigningKey.generate()
    bob_verify_key = bob_signing_key.verify_key
    
    # Alice向Bob发送签名消息
    alice_message = "Hello Bob, this is Alice!"
    alice_signature = alice_signing_key.sign(alice_message.encode()).signature
    
    print("Alice的消息:", alice_message)
    print("Alice的签名:", alice_signature.hex())
    
    # Bob验证Alice的消息
    try:
        signed_message = nacl.signing.SignedMessage(alice_message.encode() + alice_signature)
        alice_verify_key.verify(signed_message)
        print("Bob: Alice的消息验证成功！")
    except nacl.exceptions.BadSignatureError:
        print("Bob: Alice的消息验证失败！")
    
    # Bob发送签名响应
    bob_message = "Hello Alice, this is Bob!"
    bob_signature = bob_signing_key.sign(bob_message.encode()).signature
    
    print("\nBob的消息:", bob_message)
    print("Bob的签名:", bob_signature.hex())
    
    # Alice验证Bob的消息
    try:
        signed_message = nacl.signing.SignedMessage(bob_message.encode() + bob_signature)
        bob_verify_key.verify(signed_message)
        print("Alice: Bob的消息验证成功！")
    except nacl.exceptions.BadSignatureError:
        print("Alice: Bob的消息验证失败！")

secure_communication_example()
```

## 性能测试

### Ed25519性能基准测试
```python
import time

def performance_benchmark():
    """Ed25519操作基准测试"""
    signing_key = nacl.signing.SigningKey.generate()
    verify_key = signing_key.verify_key
    
    # 测试数据
    test_messages = [f"Test message {i}" for i in range(1000)]
    
    # 签名基准测试
    start_time = time.time()
    signatures = []
    for message in test_messages:
        signature = signing_key.sign(message.encode()).signature
        signatures.append(signature)
    signing_time = time.time() - start_time
    
    # 验证基准测试
    start_time = time.time()
    for i, message in enumerate(test_messages):
        signed_message = nacl.signing.SignedMessage(message.encode() + signatures[i])
        verify_key.verify(signed_message)
    verification_time = time.time() - start_time
    
    print("Ed25519性能基准测试:")
    print(f"签名1000条消息: {signing_time:.4f} 秒")
    print(f"验证1000个签名: {verification_time:.4f} 秒")
    print(f"平均签名时间: {signing_time/1000*1000:.2f} 毫秒/签名")
    print(f"平均验证时间: {verification_time/1000*1000:.2f} 毫秒/验证")
    print(f"签名吞吐量: {1000/signing_time:.0f} 签名/秒")
    print(f"验证吞吐量: {1000/verification_time:.0f} 验证/秒")

performance_benchmark()
```

## 错误处理

### 健壮的Ed25519操作
```python
def robust_ed25519_operations():
    """具有全面错误处理的Ed25519操作"""
    try:
        # 生成密钥
        signing_key = nacl.signing.SigningKey.generate()
        verify_key = signing_key.verify_key
        
        # 测试各种输入的签名
        test_cases = [
            "Normal message",
            "",  # 空字符串
            "A" * 1000,  # 长消息
            "Unicode: 你好世界",  # Unicode
        ]
        
        for i, message in enumerate(test_cases):
            try:
                signature = signing_key.sign(message.encode()).signature
                print(f"✓ 测试用例 {i+1}: 签名成功")
                
                # 验证签名
                signed_message = nacl.signing.SignedMessage(message.encode() + signature)
                verify_key.verify(signed_message)
                print(f"✓ 测试用例 {i+1}: 验证成功")
                
            except Exception as e:
                print(f"✗ 测试用例 {i+1}: 失败 - {e}")
        
        # 测试无效签名
        try:
            invalid_signature = b'\x00' * 64
            signed_message = nacl.signing.SignedMessage(b"test" + invalid_signature)
            verify_key.verify(signed_message)
            print("✗ 无效签名测试: 应该失败")
        except nacl.exceptions.BadSignatureError:
            print("✓ 无效签名测试: 正确拒绝")
        
    except Exception as e:
        print(f"严重错误: {e}")

robust_ed25519_operations()
```

## JavaScript示例

### Node.js Ed25519实现
```javascript
const crypto = require('crypto');

function generateEd25519KeyPair() {
    // 生成Ed25519密钥对
    const keyPair = crypto.generateKeyPairSync('ed25519');
    
    console.log('已生成Ed25519密钥对');
    console.log('公钥:', keyPair.publicKey.export({type: 'spki', format: 'der'}).toString('hex'));
    
    return keyPair;
}

function signMessage(keyPair, message) {
    // 签名消息
    const signature = crypto.sign(null, Buffer.from(message), keyPair.privateKey);
    return signature;
}

function verifySignature(keyPair, message, signature) {
    try {
        // 验证签名
        crypto.verify(null, Buffer.from(message), keyPair.publicKey, signature);
        return true;
    } catch (error) {
        return false;
    }
}

// 使用示例
const keyPair = generateEd25519KeyPair();
const message = "Hello, Ed25519!";
const signature = signMessage(keyPair, message);

console.log('消息:', message);
console.log('签名:', signature.toString('hex'));

const isValid = verifySignature(keyPair, message, signature);
console.log('签名有效:', isValid);
```

## 测试和验证

### Ed25519测试向量
```python
def test_ed25519_vectors():
    """使用已知测试向量测试Ed25519"""
    # 已知测试用例（简化）
    seed = b'\x00' * 32  # 全零种子
    signing_key = nacl.signing.SigningKey(seed)
    verify_key = signing_key.verify_key
    
    message = b""
    signature = signing_key.sign(message).signature
    
    print("Ed25519测试向量:")
    print(f"种子: {seed.hex()}")
    print(f"公钥: {bytes(verify_key).hex()}")
    print(f"消息: {message.hex()}")
    print(f"签名: {signature.hex()}")
    
    # 验证签名
    try:
        signed_message = nacl.signing.SignedMessage(message + signature)
        verify_key.verify(signed_message)
        print("✓ 测试向量验证成功")
    except nacl.exceptions.BadSignatureError:
        print("✗ 测试向量验证失败")

test_ed25519_vectors()
``` 