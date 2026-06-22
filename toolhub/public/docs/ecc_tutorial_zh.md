# ECC 使用教程

ECC 是个大话题 -- 曲线选择、密钥交换、签名验证。这个教程聚焦实际操作：生成密钥、做 ECDH 密钥交换、用 ECDSA 签名，全部用 Python 和 `pycryptodome`。

## 安装

```bash
pip install pycryptodome
```

JavaScript 的话，Node 内置的 `crypto` 模块原生支持 ECC。Java 用 Bouncy Castle 是标配。Go 的标准库有 `crypto/ecdsa` 和 `crypto/elliptic`。

## 选曲线

选什么曲线影响很大。快速指南：

```python
from Crypto.PublicKey import ECC

# NIST P-256：主力。128 位安全，到处都支持。
key = ECC.generate(curve='P-256')

# P-384：更高安全性（192 位），更慢。
key = ECC.generate(curve='P-384')

# Curve25519：djb 的设计，快且难用错。仅用于密钥交换。
# （用 nacl 或 cryptography 库，pycryptodome 不太支持）

# Ed25519：用于签名。确定性，无 nonce 重用风险。
# （用 nacl 或 cryptography 库）
```

对新项目，Curve25519（ECDH）+ Ed25519（签名）是大多数密码学家推荐的组合。NIST P-256 也没问题，兼容性更广。

## 密钥生成

```python
from Crypto.PublicKey import ECC

# 生成 P-256 密钥对
key = ECC.generate(curve='P-256')

# 私钥是一个标量（大整数）
print(f"私钥 d: {key.d}")

# 公钥是曲线上的点
pub = key.public_key()
print(f"公钥点: {pub.pointQ}")

# 导出为 PEM 格式存储
private_pem = key.export_key(format='PEM')
public_pem = pub.export_key(format='PEM')

with open('ecc_private.pem', 'wb') as f:
    f.write(private_pem)
with open('ecc_public.pem', 'wb') as f:
    f.write(public_pem)

# 加载回来
loaded_key = ECC.import_key(open('ecc_private.pem', 'rb').read())
```

## ECDH 密钥交换

ECDH 让两方用彼此的公钥派生共享密钥：

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

# Alice 生成密钥对
alice = ECC.generate(curve='P-256')
# Bob 生成密钥对
bob = ECC.generate(curve='P-256')

# Alice 用 Bob 的公钥计算共享密钥
alice_shared = alice.d * bob.public_key().pointQ
alice_bytes = int(alice_shared.x).to_bytes(32, 'big')

# Bob 用 Alice 的公钥计算共享密钥
bob_shared = bob.d * alice.public_key().pointQ
bob_bytes = int(bob_shared.x).to_bytes(32, 'big')

# 它们一样！
assert alice_bytes == bob_bytes

# 用 HKDF 派生实际的加密密钥
derived_key = HKDF(alice_bytes, 32, b"ecdh-salt", SHA256)
```

实践中，原始共享密钥在使用前一定要通过 KDF（如 HKDF）处理。裸 ECDH 输出有一些统计偏差，HKDF 能消除掉。

## ECDSA 签名

ECDSA 用私钥签名消息哈希。最大的坑：nonce `k` 每次签名必须唯一且不可预测。两个签名重用同一个 nonce 会暴露私钥。PyCryptodome 的 DSS 模块安全地处理了这一点：

```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

# 签名
message = b"Hello, ECDSA!"
hash_obj = SHA256.new(message)
signer = DSS.new(key, 'fips-186-3')
signature = signer.sign(hash_obj)

# 验证
verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(hash_obj, signature)
    print("签名有效！")
except ValueError:
    print("签名无效！")
```

实际应用中，优先选 Ed25519 而不是 ECDSA。Ed25519 通过确定性 nonce 从根本上解决了 nonce 问题，签名更小（64 字节 vs 70-72），验证更快。

## Python 中使用 Curve25519/Ed25519（nacl）

PyCryptodome 对 Curve25519 的支持不太好。用 PyNaCl 或 `cryptography` 库：

```bash
pip install pynacl
```

```python
import nacl.signing

# Ed25519 签名密钥
signing_key = nacl.signing.SigningKey.generate()
verify_key = signing_key.verify_key

# 签名
signed = signing_key.sign(b"Hello, Ed25519!")
# 验证
try:
    verify_key.verify(signed)
    print("有效！")
except nacl.exceptions.BadSignatureError:
    print("无效！")
```

就这些。不用管理 nonce，不用配置模式，签名就验证就好。
