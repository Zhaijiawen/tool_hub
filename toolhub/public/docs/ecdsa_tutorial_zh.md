# ECDSA 使用教程

ECDSA 部署广泛但有不少陷阱。新项目如果能选就选 Ed25519。如果必须用 ECDSA（与现有系统互操作），以下是你需要知道的。

## 安装

```bash
pip install pycryptodome
```

## 签名和验证

```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

# 生成 ECDSA 密钥对
key = ECC.generate(curve='P-256')

# 签名消息
message = b"ECDSA 签名的消息"
hash_obj = SHA256.new(message)
signer = DSS.new(key, 'fips-186-3')
signature = signer.sign(hash_obj)

print(f"签名 ({len(signature)} 字节): {signature.hex()}")

# 验证
verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(SHA256.new(message), signature)
    print("签名有效！")
except ValueError:
    print("无效签名！")
```

## 确定性 ECDSA（RFC 6979）

PyCryptodome 支持确定性 nonce 生成，从根本上消除 nonce 重用风险：

```python
# 确定性模式：k 从私钥和消息派生
signer = DSS.new(key, 'deterministic-rfc6979')
signature = signer.sign(hash_obj)
```

这应该成为你的默认选择。意味着相同私钥和相同消息总是产生相同签名 -- 不需要 RNG，不可能重用 nonce。

## nonce 重用演示（不要这么做）

要理解为什么 nonce 重用是致命的，这是如果 k 被重用会发生什么：

```python
# 生产中绝不要这样重用 nonce
# 这只是演示为什么危险

# 如果两个签名使用相同 k，看到两者的攻击者可以恢复密钥：
# 给定：消息哈希 z1 的 (r, s1)，消息哈希 z2 的 (r, s2)
# k = (z1 - z2) / (s1 - s2) mod n
# 然后：私钥 = (s1 * k - z1) / r mod n
```

务必使用 RFC 6979 确定性模式。

## 文件签名

```python
def sign_file(private_key, file_path):
    with open(file_path, 'rb') as f:
        data = f.read()
    signer = DSS.new(private_key, 'deterministic-rfc6979')
    return signer.sign(SHA256.new(data))

def verify_file(public_key, file_path, signature):
    with open(file_path, 'rb') as f:
        data = f.read()
    verifier = DSS.new(public_key, 'fips-186-3')
    try:
        verifier.verify(SHA256.new(data), signature)
        return True
    except ValueError:
        return False
```

## ECDSA 还是 Ed25519？

新代码：选 Ed25519。它天然确定性、64 字节签名、更简单容易实现正确。

只有当你需要和需要 ECDSA 的现有系统兼容时才用它（比特币、老 TLS、某些 HSM 和政府标准）。
