# Ed25519 使用教程

Ed25519 是当今最简单、最安全的数字签名算法。32 字节密钥、64 字节签名、确定性（不用管理 nonce）、速度快。每个现代密码库都支持它。

## 安装

**Python** -- 用 PyNaCl（libsodium 的 Python 绑定）：
```bash
pip install pynacl
```

**Node.js** -- `crypto` 模块内置。无需安装。

**Go** -- 标准库中的 `crypto/ed25519`。

**Rust** -- `ed25519-dalek` crate。

## 密钥生成

Ed25519 密钥非常小 -- 各 32 字节：

```python
from nacl.signing import SigningKey

# 生成随机密钥对
signing_key = SigningKey.generate()
verify_key = signing_key.verify_key  # 这是公钥

print(f"私钥 ({len(bytes(signing_key))} 字节): {bytes(signing_key).hex()}")
print(f"公钥 ({len(bytes(verify_key))} 字节):  {bytes(verify_key).hex()}")
```

如果需要从种子或密码派生密钥，用 32 字节种子：

```python
import hashlib
import os

# 从密码派生
password = b"my secure password"
salt = os.urandom(16)
seed = hashlib.pbkdf2_hmac('sha256', password, salt, 100000, 32)

signing_key = SigningKey(seed)
verify_key = signing_key.verify_key
```

## 签名消息

签名返回原始消息附加 64 字节的签名：

```python
# 签名
message = b"Hello, Ed25519!"
signed = signing_key.sign(message)

# 签名是最后 64 字节
signature = signed.signature  # 64 字节

print(f"签名: {signature.hex()}")
```

## 验证签名

如果签名无效会抛出 `BadSignatureError`：

```python
from nacl.exceptions import BadSignatureError

try:
    verify_key.verify(signed)  # signed = 消息 + 签名
    print("签名有效！")
except BadSignatureError:
    print("无效签名！")
```

验证分离的签名（只有签名字节）：

```python
from nacl.signing import SignedMessage

# 从签名 + 消息重构签名消息
signed_msg = SignedMessage(signature + message)
try:
    verify_key.verify(signed_msg)
    print("分离签名有效！")
except BadSignatureError:
    print("无效！")
```

## 密钥和签名大小一览

| 组件 | 大小 | 备注 |
|------|------|------|
| 私钥 | 32 字节 | 保管好 |
| 公钥 | 32 字节 | 可自由分享 |
| 签名 | 64 字节 | 附在消息后面 |
| 安全性 | ~128 位 | 相当于 AES-128 |

## 确定性的优势

不同于 ECDSA，Ed25519 签名是确定性的。用同一密钥哈希同一消息，每次得到完全相同的签名。这意味着：

- 签名过程中不需要 CSPRNG（消除了整类 nonce 重用的 bug）
- 签名验证是幂等的
- 非常适合测试向量验证

演示：对同一消息签名两次产生完全相同的签名：

```python
sig1 = signing_key.sign(b"test message").signature
sig2 = signing_key.sign(b"test message").signature
print(sig1 == sig2)  # True
```

## Ed25519 vs ECDSA 的选择

新项目用 Ed25519。唯一使用 ECDSA 的理由是和需要它的现有系统互操作（比如老版本 TLS 配置、某些硬件安全模块、或特定政府标准）。其他所有场景，Ed25519 都更简单、更快、更安全。
