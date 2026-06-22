# DES 使用教程

DES 是一个历史密码。你不应该用它做任何需要真正安全的事。这个教程存在是为了教育目的 -- 理解 DES 能帮你理解现代分组密码 -- 以及处理还没有升级的遗留系统。

## 先警告

DES 的 56 位密钥在消费级硬件上几小时就能暴力破解。如果你在接触一个还在用 DES 的系统，首要任务应该是迁移到 AES。哪怕三重 DES（3DES）也被 NIST 列为不推荐用于新应用。

## 安装需要的库

**Python** -- `pycryptodome` 包含 DES 和 3DES：
```bash
pip install pycryptodome
```

**Node.js** -- 内置 `crypto` 模块通过 `des` 和 `des-ede3`（3DES）算法名支持 DES。

## 基本 DES 加密（仅供学习）

DES 是 64 位块（8 字节）的分组密码，56 位密钥（8 字节含奇偶校验位）：

```python
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
import os

key = os.urandom(8)  # 56 位 + 8 位奇偶校验
iv = os.urandom(8)   # DES 块大小

cipher = DES.new(key, DES.MODE_CBC, iv=iv)
plaintext = b"Hello DES"
padded = pad(plaintext, DES.block_size)
ciphertext = cipher.encrypt(padded)

# 用同样的密钥和 IV 解密
cipher = DES.new(key, DES.MODE_CBC, iv=iv)
decrypted = unpad(cipher.decrypt(ciphertext), DES.block_size)
print(decrypted.decode())
```

## 三重 DES（3DES）-- 已过时的升级

3DES 用三个不同密钥做了三次 DES：

```python
from Crypto.Cipher import DES3

key = os.urandom(24)  # 3 × 8 字节密钥
iv = os.urandom(8)

cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)
ciphertext = cipher.encrypt(pad(b"3DES 消息", DES3.block_size))
```

3DES 的有效安全性约为 112 位（中间相遇攻击），比 AES 慢约 3 倍。NIST 已不再推荐 2023 年后用于新系统。

## Sweet32 攻击提醒

DES 和 3DES 的块大小是 64 位。用同一密钥加密约 32 GB 后，生日界导致密文碰撞，泄露明文信息（Sweet32 攻击，CVE-2016-2183）。大容量加密请换 AES 或 ChaCha20。

## 迁移路径

如果你在处理 DES/3DES 遗留系统：
1. 审计 DES/3DES 在哪里使用
2. 替换为 AES-256-GCM 或 ChaCha20-Poly1305
3. 静态数据：解密后用 AES 重新加密
4. TLS：从服务器配置移除 DES/3DES 密码套件
5. 设定不再接受 DES/3DES 连接的硬性截止日期

本工具用于教育用途和遗留系统互操作，同时规划替换。
