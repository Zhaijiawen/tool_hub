# ECC 代码示例

实用 ECC 代码片段：密钥生成、ECDH 密钥交换、ECDSA 签名，覆盖 Python、JavaScript 和 Java。

## Python

### 密钥生成和 PEM 导出

```python
from Crypto.PublicKey import ECC

key = ECC.generate(curve='P-256')
print(f"曲线: {key.curve}, 大小: {key.pointQ.size_in_bits()} 位")

with open('private.pem', 'wb') as f:
    f.write(key.export_key(format='PEM'))
with open('public.pem', 'wb') as f:
    f.write(key.public_key().export_key(format='PEM'))
```

### ECDH 密钥交换

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

alice = ECC.generate(curve='P-256')
bob = ECC.generate(curve='P-256')

alice_shared = alice.d * bob.public_key().pointQ
bob_shared = bob.d * alice.public_key().pointQ

shared_bytes = int(alice_shared.x).to_bytes(32, 'big')
derived_key = HKDF(shared_bytes, 32, b"", SHA256)
assert derived_key == HKDF(int(bob_shared.x).to_bytes(32, 'big'), 32, b"", SHA256)
print("共享密钥派生成功")
```

### ECDSA 签名和验证

```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

key = ECC.generate(curve='P-256')
message = b"Hello, ECDSA!"

signer = DSS.new(key, 'fips-186-3')
signature = signer.sign(SHA256.new(message))

verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(SHA256.new(message), signature)
    print("签名有效！")
except ValueError:
    print("无效签名！")
```

## JavaScript (Node.js)

### 密钥生成

```javascript
const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'sec1', format: 'pem' },
});
```

### ECDH 密钥交换

```javascript
const alice = crypto.createECDH('P-256');
const bob = crypto.createECDH('P-256');
alice.generateKeys();
bob.generateKeys();

const aliceShared = alice.computeSecret(bob.getPublicKey());
const bobShared = bob.computeSecret(alice.getPublicKey());

const derived = crypto.hkdfSync('sha256', aliceShared, '', '', 32);
console.log('派生密钥:', derived.toString('hex'));
```

### ECDSA 签名

```javascript
const sign = crypto.createSign('SHA256');
sign.update('Hello, ECDSA!');
const signature = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify('SHA256');
verify.update('Hello, ECDSA!');
console.log('有效:', verify.verify(publicKey, signature, 'hex'));
```

## Java (Bouncy Castle)

```java
import java.security.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

Security.addProvider(new BouncyCastleProvider());

KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
keyGen.initialize(new ECGenParameterSpec("P-256"));
KeyPair keyPair = keyGen.generateKeyPair();

Signature ecdsa = Signature.getInstance("SHA256withECDSA", "BC");
ecdsa.initSign(keyPair.getPrivate());
ecdsa.update("Hello, ECDSA!".getBytes());
byte[] signature = ecdsa.sign();

ecdsa.initVerify(keyPair.getPublic());
ecdsa.update("Hello, ECDSA!".getBytes());
System.out.println("有效: " + ecdsa.verify(signature));
```

## 关键要点

- P-256 兼容性最广，新项目推荐 Curve25519/Ed25519
- ECDH 输出必须通过 HKDF 处理才能用作密钥
- ECDSA nonce 每次签名必须唯一 -- 用能处理这点的库
- Ed25519 比 ECDSA 更简单、更安全
