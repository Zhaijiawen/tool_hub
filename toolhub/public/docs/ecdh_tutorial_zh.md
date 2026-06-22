# ECDH 使用教程

ECDH 是现代密钥交换的主力。每个 TLS 1.3 握手、每条 Signal 消息、每个 WireGuard 连接底层都在用 ECDH。以下是在 Python 中如何使用。

## 安装

```bash
pip install pycryptodome
```

## 基本 ECDH 交换

两方各自生成密钥对、交换公钥、计算共享密钥：

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

# Alice 这边
alice_private = ECC.generate(curve='P-256')
alice_public = alice_private.public_key()

# Bob 这边
bob_private = ECC.generate(curve='P-256')
bob_public = bob_private.public_key()

# Alice 用 Bob 的公钥计算共享密钥
alice_shared_point = alice_private.d * bob_public.pointQ
alice_shared_bytes = int(alice_shared_point.x).to_bytes(32, 'big')

# Bob 用 Alice 的公钥计算共享密钥
bob_shared_point = bob_private.d * alice_public.pointQ
bob_shared_bytes = int(bob_shared_point.x).to_bytes(32, 'big')

# 它们一致
assert alice_shared_bytes == bob_shared_bytes

# 用 HKDF 派生加密密钥
encryption_key = HKDF(alice_shared_bytes, 32, b"ecdh-salt", SHA256)
```

人们常忘的关键步骤：一定要把共享密钥通过 KDF 如 HKDF 处理。裸 ECDH 输出有一些你不想出现在加密密钥中的数学结构。

## 推荐使用 X25519

X25519 是更安全、更简单的 ECDH 变体。PyCryptodome 支持不好 -- 用 PyNaCl 或 `cryptography` 库：

```bash
pip install pynacl
```

```python
from nacl.public import PrivateKey, Box

# 各自生成密钥
alice = PrivateKey.generate()
bob = PrivateKey.generate()

# Box 内部计算共享密钥
alice_box = Box(alice, bob.public_key)
bob_box = Box(bob, alice.public_key)

# 加密消息
encrypted = alice_box.encrypt(b"Hello Bob!", b"some nonce")
# 解密
decrypted = bob_box.decrypt(encrypted)
```

X25519 配合 NaCl 是密码学中几乎最简单的用法。生成密钥、创建 Box、自动获得认证加密（NaCl box 底层用 X25519 + XSalsa20-Poly1305）。

## 安全提示

- 每次交换用全新的临时密钥对。不要重用密钥。
- 公钥不保密 -- 可以明文发送。
- 验证对方的公钥。在 NIST 曲线上，不在曲线上的点会泄露你的私钥。
- 共享密钥通过 HKDF 处理再用作加密密钥。
- Python 新代码优先用 PyNaCl（Curve25519）而不是 PyCryptodome（NIST 曲线）。
