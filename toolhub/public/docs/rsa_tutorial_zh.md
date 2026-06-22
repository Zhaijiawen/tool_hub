# RSA 使用教程

RSA 是部署最广泛的公钥算法，但新项目用 ECC 通常是更好的选择。当你需要与现有系统兼容时使用 RSA。

## 安装

```bash
pip install pycryptodome
```

## 密钥生成

RSA 密钥很大。至少 2048 位：

```python
from Crypto.PublicKey import RSA

# 2048 位是当前使用的最低标准
key = RSA.generate(2048)

# 导出为 PEM
private_pem = key.export_key()
public_pem = key.publickey().export_key()

with open('rsa_private.pem', 'wb') as f:
    f.write(private_pem)
with open('rsa_public.pem', 'wb') as f:
    f.write(public_pem)

# 加载回来
key = RSA.import_key(open('rsa_private.pem', 'rb').read())
```

## 加密（混合方案）

不要直接用 RSA 加密数据。使用混合加密：用 RSA 加密随机 AES 密钥，再用 AES 加密数据：

```python
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

# 生成 AES 密钥并加密数据
data = b"太长无法用 RSA 直接加密的秘密消息"
aes_key = get_random_bytes(32)
cipher_aes = AES.new(aes_key, AES.MODE_GCM)
ciphertext, tag = cipher_aes.encrypt_and_digest(data)

# 用 RSA 加密 AES 密钥
cipher_rsa = PKCS1_OAEP.new(key.publickey())
encrypted_aes_key = cipher_rsa.encrypt(aes_key)

# 存储/传输: encrypted_aes_key + nonce + ciphertext + tag
```

## 签名

使用 RSA-PSS（现代填充标准）：

```python
from Crypto.Signature import pss
from Crypto.Hash import SHA256

# 签名
message = b"Hello, RSA-PSS!"
hash_obj = SHA256.new(message)
signature = pss.new(key).sign(hash_obj)

# 验证
verifier = pss.new(key.publickey())
try:
    verifier.verify(SHA256.new(message), signature)
    print("签名有效！")
except (ValueError, TypeError):
    print("无效签名！")
```

## 密钥大小建议

- 2048 位：最低可接受。今天能用，5-10 年内可能不够。
- 3072 位：NIST 推荐。相当于 128 位安全性。
- 4096 位：保守选择。更慢，但更能应对未来。

1024 位 RSA 密钥已经不安全。绝对不要用。如果你在环境中发现 1024 位密钥，立即更换。

## RSA vs ECC：实用指南

新项目用 ECC（Ed25519/X25519）-- 密钥更小、操作更快、API 更简单。RSA 适用场景：你在维护已有的 RSA 系统、需要与老客户端兼容、或监管要求使用 RSA。
