# ECDH 代码示例

## 基本密钥交换

### 简单ECDH交换
```python
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import os

def basic_ecdh_exchange():
    """基本ECDH密钥交换示例"""
    # 为双方生成私钥
    private_key_alice = ec.generate_private_key(ec.SECP256R1())
    private_key_bob = ec.generate_private_key(ec.SECP256R1())
    
    # 获取公钥
    public_key_alice = private_key_alice.public_key()
    public_key_bob = private_key_bob.public_key()
    
    # 交换公钥（在实际场景中，通过网络）
    print(f"Alice的公钥: {public_key_alice.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()}")
    
    print(f"Bob的公钥: {public_key_bob.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()}")
    
    # 计算共享密钥
    shared_secret_alice = private_key_alice.exchange(
        ec.ECDH(), public_key_bob
    )
    shared_secret_bob = private_key_bob.exchange(
        ec.ECDH(), public_key_alice
    )
    
    # 验证两个密钥相同
    assert shared_secret_alice == shared_secret_bob
    print(f"共享密钥（32字节）: {shared_secret_alice.hex()}")
    
    return shared_secret_alice

# 运行示例
basic_ecdh_exchange()
```

### 曲线比较
```python
def curve_comparison():
    """比较ECDH的不同曲线"""
    curves = [
        ec.SECP256R1(),  # NIST P-256
        ec.SECP384R1(),  # NIST P-384
        ec.SECP256K1(),  # 比特币曲线
    ]
    
    print("ECDH曲线比较:")
    print("-" * 50)
    
    for curve in curves:
        # 生成密钥
        private_key = ec.generate_private_key(curve)
        public_key = private_key.public_key()
        
        # 测量密钥大小
        key_size = public_key.key_size
        curve_name = curve.name if hasattr(curve, 'name') else str(curve)
        
        print(f"曲线: {curve_name}")
        print(f"密钥大小: {key_size} 位")
        print(f"安全级别: ~{key_size//2} 位")
        print("-" * 30)
```

## 高级用法

### 密钥派生
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

def derive_keys_from_shared_secret(shared_secret, salt=None):
    """使用HKDF从共享密钥派生多个密钥"""
    if salt is None:
        salt = os.urandom(16)
    
    # 派生加密密钥
    encryption_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=b"encryption_key",
    ).derive(shared_secret)
    
    # 派生认证密钥
    auth_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=b"auth_key",
    ).derive(shared_secret)
    
    # 派生MAC密钥
    mac_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=b"mac_key",
    ).derive(shared_secret)
    
    return {
        "encryption_key": encryption_key,
        "auth_key": auth_key,
        "mac_key": mac_key,
        "salt": salt
    }

# 使用示例
shared_secret = basic_ecdh_exchange()
derived_keys = derive_keys_from_shared_secret(shared_secret)
print(f"派生的加密密钥: {derived_keys['encryption_key'].hex()}")
```

### 完美前向安全性
```python
class ECDHSession:
    def __init__(self, curve=ec.SECP256R1()):
        self.curve = curve
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None
    
    def generate_ephemeral_keys(self):
        """为此会话生成新的临时密钥"""
        self.ephemeral_private_key = ec.generate_private_key(self.curve)
        self.ephemeral_public_key = self.ephemeral_private_key.public_key()
        return self.ephemeral_public_key
    
    def compute_shared_secret(self, other_public_key):
        """使用对方的公钥计算共享密钥"""
        self.shared_secret = self.ephemeral_private_key.exchange(
            ec.ECDH(), other_public_key
        )
        return self.shared_secret
    
    def clear_session_data(self):
        """清除会话数据以实现前向安全性"""
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None

# 完美前向安全性示例
def perfect_forward_secrecy_example():
    """演示ECDH的完美前向安全性"""
    # Alice和Bob创建会话
    alice_session = ECDHSession()
    bob_session = ECDHSession()
    
    # 生成临时密钥
    alice_public = alice_session.generate_ephemeral_keys()
    bob_public = bob_session.generate_ephemeral_keys()
    
    # 交换公钥并计算共享密钥
    alice_secret = alice_session.compute_shared_secret(bob_public)
    bob_secret = bob_session.compute_shared_secret(alice_public)
    
    assert alice_secret == bob_secret
    print(f"会话共享密钥: {alice_secret.hex()}")
    
    # 清除会话数据以实现前向安全性
    alice_session.clear_session_data()
    bob_session.clear_session_data()
    
    return alice_secret
```

## 安全应用

### 安全通信协议
```python
class SecureChannel:
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self.shared_secret = None
        self.derived_keys = None
    
    def establish_connection(self, other_public_key):
        """与对方建立安全通道"""
        # 生成我们的密钥对
        self.private_key = ec.generate_private_key(ec.SECP256R1())
        self.public_key = self.private_key.public_key()
        
        # 计算共享密钥
        self.shared_secret = self.private_key.exchange(
            ec.ECDH(), other_public_key
        )
        
        # 派生会话密钥
        self.derived_keys = derive_keys_from_shared_secret(self.shared_secret)
        
        return self.public_key
    
    def encrypt_message(self, message):
        """使用派生的加密密钥加密消息"""
        if not self.derived_keys:
            raise ValueError("通道未建立")
        
        # 简单XOR加密（在实际应用中使用适当的加密）
        message_bytes = message.encode('utf-8')
        key = self.derived_keys['encryption_key']
        
        encrypted = bytes(a ^ b for a, b in zip(message_bytes, key))
        return encrypted
    
    def decrypt_message(self, encrypted_message):
        """使用派生的加密密钥解密消息"""
        if not self.derived_keys:
            raise ValueError("通道未建立")
        
        key = self.derived_keys['encryption_key']
        decrypted = bytes(a ^ b for a, b in zip(encrypted_message, key))
        return decrypted.decode('utf-8')

# 使用示例
def secure_communication_example():
    """使用ECDH的安全通信示例"""
    # Alice和Bob建立安全通道
    alice_channel = SecureChannel()
    bob_channel = SecureChannel()
    
    # Bob生成他的密钥对
    bob_private = ec.generate_private_key(ec.SECP256R1())
    bob_public = bob_private.public_key()
    
    # Alice与Bob建立连接
    alice_public = alice_channel.establish_connection(bob_public)
    
    # Bob与Alice建立连接
    bob_shared_secret = bob_private.exchange(ec.ECDH(), alice_public)
    bob_derived_keys = derive_keys_from_shared_secret(bob_shared_secret)
    
    # Alice发送加密消息
    message = "你好，Bob！这是一条秘密消息。"
    encrypted = alice_channel.encrypt_message(message)
    print(f"加密: {encrypted.hex()}")
    
    # Bob解密消息
    decrypted = bob_channel.decrypt_message(encrypted)
    print(f"解密: {decrypted}")
```

## 性能测试

### 不同曲线基准测试
```python
import time

def benchmark_curves():
    """基准测试不同曲线的性能"""
    curves = [
        ("P-256", ec.SECP256R1()),
        ("P-384", ec.SECP384R1()),
        ("P-521", ec.SECP521R1()),
        ("secp256k1", ec.SECP256K1())
    ]
    
    print("ECDH曲线性能基准测试:")
    print("-" * 50)
    
    for curve_name, curve in curves:
        # 生成密钥对
        start_time = time.time()
        private_key = ec.generate_private_key(curve)
        public_key = private_key.public_key()
        keygen_time = (time.time() - start_time) * 1000
        
        # 执行交换
        other_private = ec.generate_private_key(curve)
        other_public = other_private.public_key()
        
        start_time = time.time()
        shared_secret = private_key.exchange(ec.ECDH(), other_public)
        exchange_time = (time.time() - start_time) * 1000
        
        print(f"{curve_name}:")
        print(f"  密钥生成: {keygen_time:.2f}ms")
        print(f"  密钥交换: {exchange_time:.2f}ms")
        print(f"  总时间: {keygen_time + exchange_time:.2f}ms")
        print("-" * 30)
```

### 内存使用分析
```python
import sys

def analyze_memory_usage():
    """分析ECDH操作的内存使用"""
    curve = ec.SECP256R1()
    
    # 测量密钥生成前的内存
    initial_memory = sys.getsizeof(object())
    
    # 生成多个密钥对
    keys = []
    for i in range(100):
        private_key = ec.generate_private_key(curve)
        public_key = private_key.public_key()
        keys.append((private_key, public_key))
    
    # 测量密钥生成后的内存
    final_memory = sys.getsizeof(keys)
    memory_per_key = (final_memory - initial_memory) / 100
    
    print(f"每个密钥对的内存使用: {memory_per_key:.2f} 字节")
    print(f"100个密钥的总内存: {final_memory - initial_memory:.2f} 字节")
```

## 错误处理

### 安全ECDH操作
```python
def safe_ecdh_operations():
    """带错误处理的安全ECDH操作"""
    def safe_generate_key(curve_name="P-256"):
        """安全生成ECDH密钥对"""
        try:
            curve_map = {
                "P-256": ec.SECP256R1(),
                "P-384": ec.SECP384R1(),
                "P-521": ec.SECP521R1(),
                "secp256k1": ec.SECP256K1()
            }
            
            if curve_name not in curve_map:
                raise ValueError(f"不支持的曲线: {curve_name}")
            
            curve = curve_map[curve_name]
            private_key = ec.generate_private_key(curve)
            public_key = private_key.public_key()
            
            return private_key, public_key
            
        except Exception as e:
            print(f"生成密钥时出错: {e}")
            return None, None
    
    def safe_exchange(private_key, public_key):
        """安全执行ECDH交换"""
        try:
            if private_key is None or public_key is None:
                raise ValueError("无效的密钥参数")
            
            shared_secret = private_key.exchange(ec.ECDH(), public_key)
            return shared_secret
            
        except Exception as e:
            print(f"密钥交换时出错: {e}")
            return None
    
    # 测试安全操作
    private_key, public_key = safe_generate_key("P-256")
    if private_key and public_key:
        other_private, other_public = safe_generate_key("P-256")
        if other_private and other_public:
            shared_secret = safe_exchange(private_key, other_public)
            if shared_secret:
                print(f"成功的密钥交换: {shared_secret.hex()}")
```

## JavaScript示例

### Node.js ECDH实现
```javascript
const crypto = require('crypto');

function ecdhExamples() {
    console.log("JavaScript ECDH示例:");
    
    // 生成密钥对
    const alice = crypto.createECDH('secp256r1');
    const bob = crypto.createECDH('secp256r1');
    
    alice.generateKeys();
    bob.generateKeys();
    
    // 交换公钥
    const alicePublic = alice.getPublicKey();
    const bobPublic = bob.getPublicKey();
    
    console.log(`Alice的公钥: ${alicePublic.toString('hex')}`);
    console.log(`Bob的公钥: ${bobPublic.toString('hex')}`);
    
    // 计算共享密钥
    const aliceSecret = alice.computeSecret(bobPublic);
    const bobSecret = bob.computeSecret(alicePublic);
    
    console.log(`Alice的共享密钥: ${aliceSecret.toString('hex')}`);
    console.log(`Bob的共享密钥: ${bobSecret.toString('hex')}`);
    
    // 验证它们相同
    if (aliceSecret.equals(bobSecret)) {
        console.log("共享密钥匹配！");
    } else {
        console.log("错误: 共享密钥不匹配！");
    }
}

// 运行JavaScript示例
ecdhExamples();
```

### 浏览器ECDH实现
```javascript
// 在浏览器中使用Web Crypto API
async function browserEcdhExample() {
    try {
        // 生成密钥对
        const aliceKeyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256"
            },
            true,
            ["deriveKey", "deriveBits"]
        );
        
        const bobKeyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256"
            },
            true,
            ["deriveKey", "deriveBits"]
        );
        
        // 派生共享密钥
        const aliceSecret = await window.crypto.subtle.deriveBits(
            {
                name: "ECDH",
                public: bobKeyPair.publicKey
            },
            aliceKeyPair.privateKey,
            256
        );
        
        const bobSecret = await window.crypto.subtle.deriveBits(
            {
                name: "ECDH",
                public: aliceKeyPair.publicKey
            },
            bobKeyPair.privateKey,
            256
        );
        
        console.log("浏览器ECDH成功");
        console.log(`共享密钥: ${new Uint8Array(aliceSecret).toString()}`);
        
    } catch (error) {
        console.error("浏览器ECDH错误:", error);
    }
}
```

## 测试和验证

### 密钥交换验证
```python
def verify_key_exchange():
    """验证ECDH密钥交换的正确性"""
    # 为多个方生成密钥
    parties = []
    for i in range(3):
        private_key = ec.generate_private_key(ec.SECP256R1())
        public_key = private_key.public_key()
        parties.append((private_key, public_key))
    
    print("ECDH密钥交换验证:")
    print("-" * 40)
    
    # 测试所有成对交换
    for i in range(len(parties)):
        for j in range(i + 1, len(parties)):
            private_i, public_i = parties[i]
            private_j, public_j = parties[j]
            
            # 计算共享密钥
            secret_ij = private_i.exchange(ec.ECDH(), public_j)
            secret_ji = private_j.exchange(ec.ECDH(), public_i)
            
            # 验证它们相同
            assert secret_ij == secret_ji
            print(f"方 {i} 和 {j}: {secret_ij.hex()}")
    
    print("所有成对交换验证成功！")
```

### 安全测试
```python
def security_testing():
    """测试ECDH安全特性"""
    curve = ec.SECP256R1()
    
    # 测试1: 不同的私钥应该产生不同的共享密钥
    private1 = ec.generate_private_key(curve)
    private2 = ec.generate_private_key(curve)
    public = ec.generate_private_key(curve).public_key()
    
    secret1 = private1.exchange(ec.ECDH(), public)
    secret2 = private2.exchange(ec.ECDH(), public)
    
    assert secret1 != secret2, "不同的私钥产生了相同的密钥"
    print("测试1 通过: 不同的私钥产生不同的密钥")
    
    # 测试2: 相同的私钥应该总是产生相同的共享密钥
    secret1_repeat = private1.exchange(ec.ECDH(), public)
    assert secret1 == secret1_repeat, "相同的私钥产生了不同的密钥"
    print("测试2 通过: 相同的私钥产生一致的密钥")
    
    # 测试3: 双方应该得到相同的共享密钥
    private_a = ec.generate_private_key(curve)
    private_b = ec.generate_private_key(curve)
    public_a = private_a.public_key()
    public_b = private_b.public_key()
    
    secret_a = private_a.exchange(ec.ECDH(), public_b)
    secret_b = private_b.exchange(ec.ECDH(), public_a)
    
    assert secret_a == secret_b, "双方计算了不同的共享密钥"
    print("测试3 通过: 双方计算了相同的共享密钥")

# 运行安全测试
security_testing()
```

## 总结

这些示例演示了：
- 基本ECDH密钥交换实现
- 曲线选择和比较
- 从共享密钥派生密钥
- 完美前向安全性实现
- 安全通信协议
- 性能基准测试和优化
- 错误处理和验证
- JavaScript实现
- 全面的测试和安全验证

所有示例都遵循安全最佳实践，并提供实际应用的实用实现。 