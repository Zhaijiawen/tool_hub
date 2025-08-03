# ECC 代码示例

## 基本密钥生成

### Python - PyCryptodome
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

# 使用示例
key = generate_ecc_key_pair("P-256")
save_key_pair(key, "my_ecc_key")
```

### JavaScript - Node.js crypto
```javascript
const crypto = require('crypto');

function generateECCKeyPair(curve = 'P-256') {
    // 生成密钥对
    const keyPair = crypto.generateKeyPairSync('ec', {
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
    
    console.log(`生成了${curve} ECC密钥对`);
    console.log('私钥:', keyPair.privateKey);
    console.log('公钥:', keyPair.publicKey);
    
    return keyPair;
}

function saveKeyPair(keyPair, filenamePrefix) {
    const fs = require('fs');
    
    fs.writeFileSync(`${filenamePrefix}_private.pem`, keyPair.privateKey);
    fs.writeFileSync(`${filenamePrefix}_public.pem`, keyPair.publicKey);
    
    console.log(`密钥保存为${filenamePrefix}_private.pem和${filenamePrefix}_public.pem`);
}

// 使用示例
const keyPair = generateECCKeyPair('P-256');
saveKeyPair(keyPair, 'my_ecc_key');
```

### Java - Bouncy Castle
```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.custom.sec.SecP256K1Curve;

import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.io.FileOutputStream;

public class ECCKeyGenerator {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public static KeyPair generateECCKeyPair(String curveName) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec(curveName);
        keyGen.initialize(ecSpec);
        
        KeyPair keyPair = keyGen.generateKeyPair();
        System.out.println("生成了" + curveName + " ECC密钥对");
        
        return keyPair;
    }
    
    public static void saveKeyPair(KeyPair keyPair, String filenamePrefix) throws Exception {
        // 保存私钥
        try (FileOutputStream fos = new FileOutputStream(filenamePrefix + "_private.pem")) {
            fos.write(keyPair.getPrivate().getEncoded());
        }
        
        // 保存公钥
        try (FileOutputStream fos = new FileOutputStream(filenamePrefix + "_public.pem")) {
            fos.write(keyPair.getPublic().getEncoded());
        }
        
        System.out.println("密钥保存为" + filenamePrefix + "_private.pem和" + filenamePrefix + "_public.pem");
    }
    
    public static void main(String[] args) throws Exception {
        KeyPair keyPair = generateECCKeyPair("P-256");
        saveKeyPair(keyPair, "my_ecc_key");
    }
}
```

## ECDH密钥交换

### Python - ECDH实现
```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256
import os

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
    print(f"共享密钥: {alice_shared.hex()}")
    
    return alice_shared

# 运行ECDH示例
shared_key = ecdh_example()
```

### JavaScript - ECDH实现
```javascript
const crypto = require('crypto');

function ecdhKeyExchange(privateKey, publicKey) {
    // 创建ECDH对象
    const ecdh = crypto.createECDH('P-256');
    ecdh.setPrivateKey(privateKey);
    
    // 计算共享密钥
    const sharedSecret = ecdh.computeSecret(publicKey);
    
    // 使用HKDF派生密钥材料
    const keyMaterial = crypto.hkdfSync('sha256', sharedSecret, '', '', 32);
    
    return keyMaterial;
}

function ecdhExample() {
    // 为两方生成密钥对
    const aliceECDH = crypto.createECDH('P-256');
    const bobECDH = crypto.createECDH('P-256');
    
    aliceECDH.generateKeys();
    bobECDH.generateKeys();
    
    // 交换公钥
    const alicePublic = aliceECDH.getPublicKey();
    const bobPublic = bobECDH.getPublicKey();
    
    // 计算共享密钥
    const aliceShared = ecdhKeyExchange(aliceECDH.getPrivateKey(), bobPublic);
    const bobShared = ecdhKeyExchange(bobECDH.getPrivateKey(), alicePublic);
    
    // 验证它们匹配
    if (aliceShared.equals(bobShared)) {
        console.log("ECDH密钥交换成功");
        console.log("共享密钥:", aliceShared.toString('hex'));
    } else {
        console.log("ECDH密钥交换失败");
    }
    
    return aliceShared;
}

// 运行ECDH示例
const sharedKey = ecdhExample();
```

## ECDSA数字签名

### Python - ECDSA实现
```python
from Crypto.PublicKey import ECC
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
    print(f"签名: {signature.hex()}")
    print(f"签名有效: {is_valid}")
    
    return signature

# 运行ECDSA示例
signature = ecdsa_example()
```

### JavaScript - ECDSA实现
```javascript
const crypto = require('crypto');

function ecdsaSign(privateKey, message) {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    
    const signature = sign.sign(privateKey, 'hex');
    return signature;
}

function ecdsaVerify(publicKey, message, signature) {
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    
    return verify.verify(publicKey, signature, 'hex');
}

function ecdsaExample() {
    // 生成密钥对
    const keyPair = crypto.generateKeyPairSync('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'sec1',
            format: 'pem'
        }
    });
    
    // 签名消息
    const message = "Hello, ECDSA!";
    const signature = ecdsaSign(keyPair.privateKey, message);
    
    // 验证签名
    const isValid = ecdsaVerify(keyPair.publicKey, message, signature);
    
    console.log("消息:", message);
    console.log("签名:", signature);
    console.log("签名有效:", isValid);
    
    return signature;
}

// 运行ECDSA示例
const signature = ecdsaExample();
```

## 混合加密

### Python - ECC + AES混合加密
```python
from Crypto.PublicKey import ECC
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

def ecc_hybrid_encrypt(ecc_public_key, message):
    """使用ECC + AES的混合加密"""
    # 生成随机AES密钥
    aes_key = get_random_bytes(32)  # 256位密钥
    
    # 使用ECC加密AES密钥（简化的ECDH）
    # 实际中，使用适当的ECDH密钥交换
    shared_point = ecc_public_key.pointQ
    
    # 使用AES加密消息
    cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    
    return aes_key, cipher.nonce, ciphertext, tag

def ecc_hybrid_decrypt(ecc_private_key, aes_key, nonce, ciphertext, tag):
    """使用ECC + AES的混合解密"""
    # 使用ECC解密AES密钥（简化的ECDH）
    # 实际中，使用适当的ECDH密钥交换
    
    # 使用AES解密消息
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    
    return plaintext.decode()

def hybrid_encryption_example():
    """混合加密示例"""
    # 生成ECC密钥对
    key = ECC.generate(curve='P-256')
    
    # 要加密的消息
    message = "Hello, Hybrid Encryption!"
    
    # 加密
    aes_key, nonce, ciphertext, tag = ecc_hybrid_encrypt(key.public_key(), message)
    
    # 解密
    decrypted = ecc_hybrid_decrypt(key, aes_key, nonce, ciphertext, tag)
    
    print(f"原始消息: {message}")
    print(f"加密: {ciphertext.hex()}")
    print(f"解密: {decrypted}")
    print(f"匹配: {message == decrypted}")
    
    return ciphertext

# 运行混合加密示例
encrypted_data = hybrid_encryption_example()
```

## 密钥管理

### Python - 密钥导入/导出
```python
from Crypto.PublicKey import ECC
import hashlib

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
    key_data = public_key.export_key(format='DER')
    fingerprint = hashlib.sha256(key_data).hexdigest()
    return fingerprint[:16]  # 前16个字符

def key_management_example():
    """密钥管理示例"""
    # 生成密钥
    key = ECC.generate(curve='P-256')
    
    # 导出密钥
    export_ecc_key_to_pem(key, 'private_key.pem')
    export_ecc_key_to_pem(key.public_key(), 'public_key.pem')
    
    # 加载密钥
    loaded_private = load_ecc_key_from_file('private_key.pem')
    loaded_public = load_ecc_key_from_file('public_key.pem')
    
    # 生成指纹
    fingerprint = key_fingerprint(key.public_key())
    
    print(f"密钥指纹: {fingerprint}")
    print(f"密钥加载成功: {loaded_private.d == key.d}")
    
    return fingerprint

# 运行密钥管理示例
fingerprint = key_management_example()
```

## 性能基准测试

### Python - ECC性能测试
```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256
import time

def benchmark_ecc_operations():
    """基准测试ECC操作"""
    # 生成测试密钥
    key = ECC.generate(curve='P-256')
    message = "Test message for benchmarking"
    
    # 基准测试密钥生成
    start_time = time.time()
    for _ in range(100):
        test_key = ECC.generate(curve='P-256')
    generation_time = (time.time() - start_time) / 100
    
    # 基准测试签名
    start_time = time.time()
    for _ in range(1000):
        hash_obj = SHA256.new(message.encode())
        signer = DSS.new(key, 'fips-186-3')
        signature = signer.sign(hash_obj)
    signing_time = (time.time() - start_time) / 1000
    
    # 基准测试验证
    start_time = time.time()
    for _ in range(1000):
        hash_obj = SHA256.new(message.encode())
        verifier = DSS.new(key.public_key(), 'fips-186-3')
        verifier.verify(hash_obj, signature)
    verification_time = (time.time() - start_time) / 1000
    
    print(f"密钥生成: {generation_time*1000:.2f}ms")
    print(f"签名: {signing_time*1000:.2f}ms")
    print(f"验证: {verification_time*1000:.2f}ms")
    
    return generation_time, signing_time, verification_time

def curve_performance_comparison():
    """比较不同曲线的性能"""
    curves = ["P-256", "P-384", "P-521"]
    
    for curve in curves:
        start_time = time.time()
        key = ECC.generate(curve=curve)
        generation_time = time.time() - start_time
        
        print(f"{curve}密钥生成: {generation_time*1000:.2f}ms")

# 运行性能基准测试
benchmark_ecc_operations()
curve_performance_comparison()
```

## 错误处理

### Python - 安全ECC操作
```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

def safe_ecc_operations():
    """带错误处理的安全ECC操作"""
    try:
        # 生成密钥
        key = ECC.generate(curve='P-256')
        
        # 签名消息
        message = "Test message"
        hash_obj = SHA256.new(message.encode())
        signer = DSS.new(key, 'fips-186-3')
        signature = signer.sign(hash_obj)
        
        # 验证签名
        verifier = DSS.new(key.public_key(), 'fips-186-3')
        verifier.verify(hash_obj, signature)
        
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

def error_handling_example():
    """错误处理示例"""
    # 测试有效操作
    success, message = safe_ecc_operations()
    print(f"有效操作: {success} - {message}")
    
    # 测试无效曲线
    try:
        validate_ecc_parameters("invalid-curve")
    except ValueError as e:
        print(f"无效曲线错误: {e}")
    
    return success

# 运行错误处理示例
result = error_handling_example()
``` 