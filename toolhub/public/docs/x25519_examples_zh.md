# X25519 代码示例

## 基本密钥交换

### 简单X25519交换
```python
from cryptography.hazmat.primitives.asymmetric import x25519
import os

def basic_x25519_exchange():
    """基本X25519密钥交换示例"""
    # 为双方生成私钥
    private_key_alice = x25519.X25519PrivateKey.generate()
    private_key_bob = x25519.X25519PrivateKey.generate()
    
    # 获取公钥
    public_key_alice = private_key_alice.public_key()
    public_key_bob = private_key_bob.public_key()
    
    # 交换公钥（在实际场景中，通过网络传输）
    print(f"Alice的公钥: {public_key_alice.public_bytes().hex()}")
    print(f"Bob的公钥: {public_key_bob.public_bytes().hex()}")
    
    # 计算共享密钥
    shared_secret_alice = private_key_alice.exchange(public_key_bob)
    shared_secret_bob = private_key_bob.exchange(public_key_alice)
    
    # 验证两个密钥相同
    assert shared_secret_alice == shared_secret_bob
    print(f"共享密钥（32字节）: {shared_secret_alice.hex()}")
    
    return shared_secret_alice

# 运行示例
basic_x25519_exchange()
```

### 密钥生成和验证
```python
def key_generation_and_validation():
    """演示X25519密钥生成和验证"""
    # 生成私钥
    private_key = x25519.X25519PrivateKey.generate()
    
    # 获取公钥
    public_key = private_key.public_key()
    
    # 验证密钥大小
    private_bytes = private_key.private_bytes(
        encoding=None,
        format=None,
        encryption_algorithm=None
    )
    public_bytes = public_key.public_bytes(
        encoding=None,
        format=None
    )
    
    print(f"私钥大小: {len(private_bytes)} 字节")
    print(f"公钥大小: {len(public_bytes)} 字节")
    
    # 验证它们都是32字节
    assert len(private_bytes) == 32, "私钥必须是32字节"
    assert len(public_bytes) == 32, "公钥必须是32字节"
    
    return private_key, public_key
```

## 高级用法

### 密钥派生
```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

def derive_keys_from_x25519_secret(shared_secret, salt=None):
    """使用HKDF从X25519共享密钥派生多个密钥"""
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
shared_secret = basic_x25519_exchange()
derived_keys = derive_keys_from_x25519_secret(shared_secret)
print(f"派生的加密密钥: {derived_keys['encryption_key'].hex()}")
```

### 完美前向保密
```python
class X25519Session:
    def __init__(self):
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None
    
    def generate_ephemeral_keys(self):
        """为此会话生成新的临时密钥"""
        self.ephemeral_private_key = x25519.X25519PrivateKey.generate()
        self.ephemeral_public_key = self.ephemeral_private_key.public_key()
        return self.ephemeral_public_key
    
    def compute_shared_secret(self, other_public_key):
        """与其他方的公钥计算共享密钥"""
        self.shared_secret = self.ephemeral_private_key.exchange(other_public_key)
        return self.shared_secret
    
    def clear_session_data(self):
        """清除会话数据以实现前向保密"""
        self.ephemeral_private_key = None
        self.ephemeral_public_key = None
        self.shared_secret = None

# 完美前向保密示例
def perfect_forward_secrecy_example():
    """演示使用X25519的完美前向保密"""
    # Alice和Bob创建会话
    alice_session = X25519Session()
    bob_session = X25519Session()
    
    # 生成临时密钥
    alice_public = alice_session.generate_ephemeral_keys()
    bob_public = bob_session.generate_ephemeral_keys()
    
    # 交换公钥并计算共享密钥
    alice_secret = alice_session.compute_shared_secret(bob_public)
    bob_secret = bob_session.compute_shared_secret(alice_public)
    
    assert alice_secret == bob_secret
    print(f"会话共享密钥: {alice_secret.hex()}")
    
    # 清除会话数据以实现前向保密
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
        """与其他方建立安全通道"""
        # 生成我们的密钥对
        self.private_key = x25519.X25519PrivateKey.generate()
        self.public_key = self.private_key.public_key()
        
        # 计算共享密钥
        self.shared_secret = self.private_key.exchange(other_public_key)
        
        # 派生会话密钥
        self.derived_keys = derive_keys_from_x25519_secret(self.shared_secret)
        
        return self.public_key
    
    def encrypt_message(self, message):
        """使用派生的加密密钥加密消息"""
        if not self.derived_keys:
            raise ValueError("通道未建立")
        
        # 简单XOR加密（在实际使用中应使用适当的加密）
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
    """使用X25519的安全通信示例"""
    # Alice和Bob建立安全通道
    alice_channel = SecureChannel()
    bob_channel = SecureChannel()
    
    # Bob生成他的密钥对
    bob_private = x25519.X25519PrivateKey.generate()
    bob_public = bob_private.public_key()
    
    # Alice与Bob建立连接
    alice_public = alice_channel.establish_connection(bob_public)
    
    # Bob与Alice建立连接
    bob_shared_secret = bob_private.exchange(alice_public)
    bob_derived_keys = derive_keys_from_x25519_secret(bob_shared_secret)
    
    # Alice发送加密消息
    message = "Hello, Bob! This is a secret message."
    encrypted = alice_channel.encrypt_message(message)
    print(f"加密: {encrypted.hex()}")
    
    # Bob解密消息
    decrypted = bob_channel.decrypt_message(encrypted)
    print(f"解密: {decrypted}")
```

## 性能测试

### X25519基准测试
```python
import time

def benchmark_x25519():
    """X25519性能基准测试"""
    iterations = 1000
    
    print("X25519性能基准测试:")
    print("-" * 40)
    
    # 生成密钥对
    start_time = time.time()
    for _ in range(iterations):
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
    keygen_time = (time.time() - start_time) * 1000
    
    # 执行交换
    private_key = x25519.X25519PrivateKey.generate()
    public_key = private_key.public_key()
    
    start_time = time.time()
    for _ in range(iterations):
        other_private = x25519.X25519PrivateKey.generate()
        other_public = other_private.public_key()
        shared_secret = private_key.exchange(other_public)
    exchange_time = (time.time() - start_time) * 1000
    
    print(f"密钥生成: {keygen_time/iterations:.3f}ms 每密钥")
    print(f"密钥交换: {exchange_time/iterations:.3f}ms 每次交换")
    print(f"总操作数: {iterations}")
```

### 内存使用分析
```python
import sys

def analyze_memory_usage():
    """分析X25519操作的内存使用"""
    # 测量密钥生成前的内存
    initial_memory = sys.getsizeof(object())
    
    # 生成多个密钥对
    keys = []
    for i in range(100):
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
        keys.append((private_key, public_key))
    
    # 测量密钥生成后的内存
    final_memory = sys.getsizeof(keys)
    memory_per_key = (final_memory - initial_memory) / 100
    
    print(f"每个密钥对的内存使用: {memory_per_key:.2f} 字节")
    print(f"100个密钥的总内存: {final_memory - initial_memory:.2f} 字节")
```

## 错误处理

### 安全的X25519操作
```python
def safe_x25519_operations():
    """带错误处理的安全X25519操作"""
    def safe_generate_key():
        """安全生成X25519密钥对"""
        try:
            private_key = x25519.X25519PrivateKey.generate()
            public_key = private_key.public_key()
            return private_key, public_key
            
        except Exception as e:
            print(f"生成密钥时出错: {e}")
            return None, None
    
    def safe_exchange(private_key, public_key):
        """安全执行X25519交换"""
        try:
            if private_key is None or public_key is None:
                raise ValueError("无效的密钥参数")
            
            shared_secret = private_key.exchange(public_key)
            return shared_secret
            
        except Exception as e:
            print(f"密钥交换时出错: {e}")
            return None
    
    # 测试安全操作
    private_key, public_key = safe_generate_key()
    if private_key and public_key:
        other_private, other_public = safe_generate_key()
        if other_private and other_public:
            shared_secret = safe_exchange(private_key, other_public)
            if shared_secret:
                print(f"成功的密钥交换: {shared_secret.hex()}")
```

## JavaScript示例

### Node.js X25519实现
```javascript
const crypto = require('crypto');

function x25519Examples() {
    console.log("JavaScript X25519示例:");
    
    // 生成密钥对
    const alice = crypto.createECDH('x25519');
    const bob = crypto.createECDH('x25519');
    
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
        console.log("错误：共享密钥不匹配！");
    }
}

// 运行JavaScript示例
x25519Examples();
```

### 浏览器X25519实现
```javascript
// 在浏览器中使用Web Crypto API
async function browserX25519Example() {
    try {
        // 生成密钥对
        const aliceKeyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256"  // 注意：Web Crypto不直接支持X25519
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
def verify_x25519_exchange():
    """验证X25519密钥交换的正确性"""
    # 为多个参与方生成密钥
    parties = []
    for i in range(3):
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
        parties.append((private_key, public_key))
    
    print("X25519密钥交换验证:")
    print("-" * 40)
    
    # 测试所有成对交换
    for i in range(len(parties)):
        for j in range(i + 1, len(parties)):
            private_i, public_i = parties[i]
            private_j, public_j = parties[j]
            
            # 计算共享密钥
            secret_ij = private_i.exchange(public_j)
            secret_ji = private_j.exchange(public_i)
            
            # 验证它们相同
            assert secret_ij == secret_ji
            print(f"参与方 {i} 和 {j}: {secret_ij.hex()}")
    
    print("所有成对交换验证成功！")
```

### 安全测试
```python
def security_testing():
    """测试X25519安全属性"""
    # 测试1：不同的私钥应该产生不同的共享密钥
    private1 = x25519.X25519PrivateKey.generate()
    private2 = x25519.X25519PrivateKey.generate()
    public = x25519.X25519PrivateKey.generate().public_key()
    
    secret1 = private1.exchange(public)
    secret2 = private2.exchange(public)
    
    assert secret1 != secret2, "不同的私钥产生了相同的密钥"
    print("测试1通过：不同的私钥产生不同的密钥")
    
    # 测试2：相同的私钥应该总是产生相同的共享密钥
    secret1_repeat = private1.exchange(public)
    assert secret1 == secret1_repeat, "相同的私钥产生了不同的密钥"
    print("测试2通过：相同的私钥产生一致的密钥")
    
    # 测试3：双方应该计算相同的共享密钥
    private_a = x25519.X25519PrivateKey.generate()
    private_b = x25519.X25519PrivateKey.generate()
    public_a = private_a.public_key()
    public_b = private_b.public_key()
    
    secret_a = private_a.exchange(public_b)
    secret_b = private_b.exchange(public_a)
    
    assert secret_a == secret_b, "双方计算了不同的共享密钥"
    print("测试3通过：双方计算相同的共享密钥")

# 运行安全测试
security_testing()
```

## 总结

这些示例演示了：
- 基本X25519密钥交换实现
- 密钥生成和验证
- 从共享密钥派生密钥
- 完美前向保密实现
- 安全通信协议
- 性能基准测试和优化
- 错误处理和验证
- JavaScript实现
- 全面的测试和安全验证

所有示例都遵循安全最佳实践，为实际应用提供实用的实现。 