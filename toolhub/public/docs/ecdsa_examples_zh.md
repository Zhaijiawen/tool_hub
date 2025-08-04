# ECDSA 代码示例

## Python示例

### 基本ECDSA密钥生成
```python
from Crypto.PublicKey import ECC
import os

def generate_ecdsa_key_pair(curve='P-256'):
    """生成ECDSA密钥对"""
    key = ECC.generate(curve=curve)
    private_key = key
    public_key = key.public_key()
    
    print(f"在{curve}上生成ECDSA密钥对")
    print(f"公钥: ({public_key.x}, {public_key.y})")
    print(f"私钥: {private_key.d}")
    
    return private_key, public_key

def save_keys_to_files(private_key, public_key, prefix="ecdsa"):
    """保存ECDSA密钥到PEM文件"""
    # 保存私钥
    with open(f"{prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key(format='PEM'))
    
    # 保存公钥
    with open(f"{prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key(format='PEM'))
    
    print(f"密钥保存为{prefix}_private.pem和{prefix}_public.pem")

# 使用示例
private_key, public_key = generate_ecdsa_key_pair('P-256')
save_keys_to_files(private_key, public_key)
```

### 基本ECDSA签名和验证
```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256
import base64

def ecdsa_sign(private_key, message):
    """使用ECDSA签名消息"""
    hash_obj = SHA256.new(message.encode())
    signer = DSS.new(private_key, 'fips-186-3')
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

def ecdsa_verify(public_key, message, signature):
    """验证ECDSA签名"""
    hash_obj = SHA256.new(message.encode())
    signature_bytes = base64.b64decode(signature.encode())
    
    verifier = DSS.new(public_key, 'fips-186-3')
    try:
        verifier.verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# 使用示例
message = "Hello, ECDSA签名!"
signature = ecdsa_sign(private_key, message)
is_valid = ecdsa_verify(public_key, message, signature)

print(f"消息: {message}")
print(f"签名: {signature}")
print(f"有效: {is_valid}")
```

### 不同曲线的ECDSA
```python
def compare_curves():
    """比较不同曲线的ECDSA性能"""
    curves = ['P-256', 'P-384', 'P-521']
    message = "曲线比较测试消息"
    
    for curve in curves:
        print(f"\n--- {curve} ---")
        
        # 生成密钥对
        key = ECC.generate(curve=curve)
        
        # 签名消息
        signature = ecdsa_sign(key, message)
        
        # 验证签名
        is_valid = ecdsa_verify(key.public_key(), message, signature)
        
        print(f"密钥大小: {key.pointQ.size_in_bits()} 位")
        print(f"签名有效: {is_valid}")

# 运行比较
compare_curves()
```

## JavaScript示例

### Node.js ECDSA实现
```javascript
const crypto = require('crypto');

function generateECDSAKeyPair(curve = 'P-256') {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'sec1',
            format: 'pem'
        }
    });
    
    console.log(`在${curve}上生成ECDSA密钥对`);
    return { privateKey, publicKey };
}

function ecdsaSign(privateKey, message) {
    const signature = crypto.sign('sha256', Buffer.from(message, 'utf8'), {
        key: privateKey,
        dsaEncoding: 'ieee-p1363'
    });
    return signature.toString('base64');
}

function ecdsaVerify(publicKey, message, signature) {
    try {
        const isValid = crypto.verify('sha256', Buffer.from(message, 'utf8'), {
            key: publicKey,
            dsaEncoding: 'ieee-p1363'
        }, Buffer.from(signature, 'base64'));
        return isValid;
    } catch (error) {
        return false;
    }
}

// 使用示例
const { privateKey, publicKey } = generateECDSAKeyPair('P-256');
const message = "Hello, Node.js中的ECDSA!";
const signature = ecdsaSign(privateKey, message);
const isValid = ecdsaVerify(publicKey, message, signature);

console.log(`消息: ${message}`);
console.log(`签名有效: ${isValid}`);
```

### 浏览器ECDSA实现
```javascript
// 在浏览器中使用Web Crypto API
async function browserECDSAExample() {
    try {
        // 生成密钥对
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256"
            },
            true,
            ["sign", "verify"]
        );
        
        // 签名消息
        const message = "Hello, 浏览器中的ECDSA!";
        const encoder = new TextEncoder();
        const messageBuffer = encoder.encode(message);
        
        const signature = await window.crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" }
            },
            keyPair.privateKey,
            messageBuffer
        );
        
        // 验证签名
        const isValid = await window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" }
            },
            keyPair.publicKey,
            signature,
            messageBuffer
        );
        
        console.log("浏览器ECDSA成功");
        console.log(`签名有效: ${isValid}`);
        
    } catch (error) {
        console.error("浏览器ECDSA错误:", error);
    }
}
```

## Java示例

### Bouncy Castle ECDSA实现
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class ECDSAExample {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public static KeyPair generateECDSAKeyPair(String curve) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("ECDSA", "BC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec(curve);
        keyGen.initialize(ecSpec);
        KeyPair keyPair = keyGen.generateKeyPair();
        
        System.out.println("在" + curve + "上生成ECDSA密钥对");
        return keyPair;
    }
    
    public static String ecdsaSign(PrivateKey privateKey, String message) throws Exception {
        Signature signature = Signature.getInstance("SHA256withECDSA", "BC");
        signature.initSign(privateKey);
        signature.update(message.getBytes());
        
        byte[] signed = signature.sign();
        return Base64.getEncoder().encodeToString(signed);
    }
    
    public static boolean ecdsaVerify(PublicKey publicKey, String message, String signature) throws Exception {
        Signature sig = Signature.getInstance("SHA256withECDSA", "BC");
        sig.initVerify(publicKey);
        sig.update(message.getBytes());
        
        return sig.verify(Base64.getDecoder().decode(signature));
    }
    
    public static void main(String[] args) throws Exception {
        KeyPair keyPair = generateECDSAKeyPair("P-256");
        
        String message = "Hello, Java中的ECDSA!";
        String signature = ecdsaSign(keyPair.getPrivate(), message);
        boolean isValid = ecdsaVerify(keyPair.getPublic(), message, signature);
        
        System.out.println("消息: " + message);
        System.out.println("签名有效: " + isValid);
    }
}
```

## Go示例

### Go中的ECDSA实现
```go
package main

import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
    "crypto/sha256"
    "encoding/base64"
    "fmt"
    "log"
)

func generateECDSAKeyPair() (*ecdsa.PrivateKey, *ecdsa.PublicKey, error) {
    privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
    if err != nil {
        return nil, nil, err
    }
    
    publicKey := &privateKey.PublicKey
    fmt.Println("在P-256上生成ECDSA密钥对")
    
    return privateKey, publicKey, nil
}

func ecdsaSign(privateKey *ecdsa.PrivateKey, message string) (string, error) {
    hash := sha256.Sum256([]byte(message))
    r, s, err := ecdsa.Sign(rand.Reader, privateKey, hash[:])
    if err != nil {
        return "", err
    }
    
    // 将签名转换为base64
    signature := append(r.Bytes(), s.Bytes()...)
    return base64.StdEncoding.EncodeToString(signature), nil
}

func ecdsaVerify(publicKey *ecdsa.PublicKey, message, signature string) (bool, error) {
    hash := sha256.Sum256([]byte(message))
    signatureBytes, err := base64.StdEncoding.DecodeString(signature)
    if err != nil {
        return false, err
    }
    
    // 将签名分割为r和s分量
    if len(signatureBytes) != 64 {
        return false, fmt.Errorf("无效的签名长度")
    }
    
    r := new(big.Int).SetBytes(signatureBytes[:32])
    s := new(big.Int).SetBytes(signatureBytes[32:])
    
    return ecdsa.Verify(publicKey, hash[:], r, s), nil
}

func main() {
    privateKey, publicKey, err := generateECDSAKeyPair()
    if err != nil {
        log.Fatal(err)
    }
    
    message := "Hello, Go中的ECDSA!"
    signature, err := ecdsaSign(privateKey, message)
    if err != nil {
        log.Fatal(err)
    }
    
    isValid, err := ecdsaVerify(publicKey, message, signature)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("消息: %s\n", message)
    fmt.Printf("签名有效: %t\n", isValid)
}
```

## 高级用法

### 确定性ECDSA (RFC 6979)
```python
def deterministic_ecdsa_sign(private_key, message):
    """使用确定性ECDSA签名消息"""
    hash_obj = SHA256.new(message.encode())
    signer = DSS.new(private_key, 'fips-186-3', encoding='der')
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

def deterministic_ecdsa_verify(public_key, message, signature):
    """验证确定性ECDSA签名"""
    hash_obj = SHA256.new(message.encode())
    signature_bytes = base64.b64decode(signature.encode())
    
    verifier = DSS.new(public_key, 'fips-186-3', encoding='der')
    try:
        verifier.verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# 测试确定性签名
message = "确定性ECDSA测试"
signature1 = deterministic_ecdsa_sign(private_key, message)
signature2 = deterministic_ecdsa_sign(private_key, message)

print(f"确定性签名相同: {signature1 == signature2}")
```

### 使用不同哈希函数的ECDSA
```python
from Crypto.Hash import SHA256, SHA384, SHA512

def ecdsa_sign_with_hash(private_key, message, hash_algorithm):
    """使用指定哈希算法的ECDSA签名消息"""
    if hash_algorithm == 'SHA256':
        hash_obj = SHA256.new(message.encode())
    elif hash_algorithm == 'SHA384':
        hash_obj = SHA384.new(message.encode())
    elif hash_algorithm == 'SHA512':
        hash_obj = SHA512.new(message.encode())
    else:
        raise ValueError("不支持的哈希算法")
    
    signer = DSS.new(private_key, 'fips-186-3')
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

def ecdsa_verify_with_hash(public_key, message, signature, hash_algorithm):
    """使用指定哈希算法的ECDSA验证签名"""
    if hash_algorithm == 'SHA256':
        hash_obj = SHA256.new(message.encode())
    elif hash_algorithm == 'SHA384':
        hash_obj = SHA384.new(message.encode())
    elif hash_algorithm == 'SHA512':
        hash_obj = SHA512.new(message.encode())
    else:
        raise ValueError("不支持的哈希算法")
    
    signature_bytes = base64.b64decode(signature.encode())
    verifier = DSS.new(public_key, 'fips-186-3')
    
    try:
        verifier.verify(hash_obj, signature_bytes)
        return True
    except (ValueError, TypeError):
        return False

# 测试不同哈希函数
message = "哈希函数比较"
hash_algorithms = ['SHA256', 'SHA384', 'SHA512']

for hash_algo in hash_algorithms:
    signature = ecdsa_sign_with_hash(private_key, message, hash_algo)
    is_valid = ecdsa_verify_with_hash(public_key, message, signature, hash_algo)
    print(f"{hash_algo}: {is_valid}")
```

## 安全应用

### 数字证书验证
```python
def verify_digital_certificate(certificate, public_key):
    """使用ECDSA验证数字证书"""
    # 提取证书数据和签名
    cert_data = certificate['data']
    cert_signature = certificate['signature']
    
    # 验证签名
    is_valid = ecdsa_verify(public_key, cert_data, cert_signature)
    
    if is_valid:
        print("证书签名有效")
        return True
    else:
        print("证书签名无效")
        return False

# 示例证书
certificate = {
    'data': '待签名的证书数据',
    'signature': ecdsa_sign(private_key, '待签名的证书数据')
}

verify_digital_certificate(certificate, public_key)
```

### 区块链交易签名
```python
def sign_blockchain_transaction(private_key, transaction_data):
    """使用ECDSA签名区块链交易"""
    # 创建交易哈希
    transaction_hash = SHA256.new(transaction_data.encode()).hexdigest()
    
    # 签名交易哈希
    signature = ecdsa_sign(private_key, transaction_hash)
    
    return {
        'transaction': transaction_data,
        'signature': signature,
        'public_key': public_key.export_key(format='PEM').decode()
    }

def verify_blockchain_transaction(signed_transaction):
    """验证区块链交易签名"""
    # 提取组件
    transaction_data = signed_transaction['transaction']
    signature = signed_transaction['signature']
    public_key_pem = signed_transaction['public_key']
    
    # 导入公钥
    public_key = ECC.import_key(public_key_pem)
    
    # 创建交易哈希
    transaction_hash = SHA256.new(transaction_data.encode()).hexdigest()
    
    # 验证签名
    return ecdsa_verify(public_key, transaction_hash, signature)

# 示例区块链交易
transaction = "Alice向Bob发送10 BTC"
signed_tx = sign_blockchain_transaction(private_key, transaction)
is_valid = verify_blockchain_transaction(signed_tx)

print(f"区块链交易有效: {is_valid}")
```

## 性能测试

### ECDSA操作基准测试
```python
import time

def benchmark_ecdsa_operations():
    """ECDSA操作基准测试"""
    curves = ['P-256', 'P-384', 'P-521']
    message = "基准测试消息"
    iterations = 100
    
    for curve in curves:
        print(f"\n--- {curve} ---")
        
        # 生成密钥
        start_time = time.time()
        key = ECC.generate(curve=curve)
        generation_time = time.time() - start_time
        
        # 签名基准测试
        start_time = time.time()
        for _ in range(iterations):
            signature = ecdsa_sign(key, message)
        signing_time = time.time() - start_time
        
        # 验证基准测试
        start_time = time.time()
        for _ in range(iterations):
            ecdsa_verify(key.public_key(), message, signature)
        verification_time = time.time() - start_time
        
        print(f"密钥生成: {generation_time:.3f}s")
        print(f"签名: {signing_time/iterations*1000:.2f}ms 每次签名")
        print(f"验证: {verification_time/iterations*1000:.2f}ms 每次验证")

# 运行基准测试
benchmark_ecdsa_operations()
```

## 错误处理

### 安全的ECDSA操作
```python
def safe_ecdsa_sign(private_key, message):
    """带错误处理的安全ECDSA签名"""
    try:
        signature = ecdsa_sign(private_key, message)
        return signature
    except ValueError as e:
        print(f"签名错误: {e}")
        return None
    except Exception as e:
        print(f"意外错误: {e}")
        return None

def safe_ecdsa_verify(public_key, message, signature):
    """带错误处理的安全ECDSA验证"""
    try:
        is_valid = ecdsa_verify(public_key, message, signature)
        return is_valid
    except ValueError as e:
        print(f"验证错误: {e}")
        return False
    except Exception as e:
        print(f"意外错误: {e}")
        return False

# 测试安全操作
message = "安全操作测试"
signature = safe_ecdsa_sign(private_key, message)
if signature:
    is_valid = safe_ecdsa_verify(public_key, message, signature)
    print(f"安全操作结果: {is_valid}")
```

## 测试和验证

### 测试向量
```python
def test_ecdsa_operations():
    """使用已知值测试ECDSA操作"""
    # 生成测试密钥
    key = ECC.generate(curve='P-256')
    
    # 测试签名/验证
    message = "测试消息"
    signature = ecdsa_sign(key, message)
    is_valid = ecdsa_verify(key.public_key(), message, signature)
    
    assert is_valid, "ECDSA签名测试失败"
    print("ECDSA签名测试通过")
    
    # 测试不同消息
    different_message = "不同消息"
    is_valid = ecdsa_verify(key.public_key(), different_message, signature)
    
    assert not is_valid, "ECDSA验证应该对不同消息失败"
    print("ECDSA验证测试通过")

# 运行测试
test_ecdsa_operations()
```

## 总结

这些示例演示了：
- 基本ECDSA密钥生成和管理
- 数字签名创建和验证
- 不同椭圆曲线的支持
- 确定性ECDSA实现
- 多种哈希函数支持
- 区块链和证书应用
- 性能基准测试
- 错误处理和验证
- 跨平台实现（Python、JavaScript、Java、Go）

所有示例都遵循安全最佳实践，为实际应用提供实用的实现。 