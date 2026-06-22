# ECDSA 代码示例

Python、JavaScript 和 Java 中的 ECDSA 签名和验证。所有示例在可用时使用确定性 nonce 生成。

## Python

```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

key = ECC.generate(curve='P-256')

message = b"Hello, ECDSA!"

# 确定性签名（RFC 6979）
signer = DSS.new(key, 'deterministic-rfc6979')
signature = signer.sign(SHA256.new(message))
print(f"签名: {signature.hex()}")

# 验证
verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(SHA256.new(message), signature)
    print("有效签名！")
except ValueError:
    print("无效签名！")
```

## JavaScript (Node.js)

```javascript
const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'sec1', format: 'pem' },
});

const sign = crypto.createSign('SHA256');
sign.update('Hello, ECDSA!');
const signature = sign.sign(privateKey, 'hex');
console.log('签名:', signature);

const verify = crypto.createVerify('SHA256');
verify.update('Hello, ECDSA!');
console.log('有效:', verify.verify(publicKey, signature, 'hex'));
```

## Java (Bouncy Castle)

```java
import java.security.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

Security.addProvider(new BouncyCastleProvider());

KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
kpg.initialize(new ECGenParameterSpec("P-256"));
KeyPair kp = kpg.generateKeyPair();

Signature ecdsa = Signature.getInstance("SHA256withECDSA", "BC");
ecdsa.initSign(kp.getPrivate());
ecdsa.update("Hello, ECDSA!".getBytes());
byte[] sig = ecdsa.sign();

ecdsa.initVerify(kp.getPublic());
ecdsa.update("Hello, ECDSA!".getBytes());
System.out.println("有效: " + ecdsa.verify(sig));
```

## 关键提醒

- 使用确定性 ECDSA（RFC 6979）消除 nonce 重用风险
- 绝不在同一密钥的多个签名间共享 nonce
- 新项目优先选 Ed25519 -- 更简单更安全
