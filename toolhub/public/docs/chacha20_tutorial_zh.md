# ChaCha20 使用教程

## 快速准备

ChaCha20 在所有现代密码库中都有 -- 它已经主流很多年了。安装什么：

**Python** -- `pycryptodome` 包含裸 ChaCha20 和 ChaCha20-Poly1305：
```bash
pip install pycryptodome
```

**Node.js** -- Node 10 起内置于 `crypto` 模块。核心密码不需要额外依赖，但你可能想要 `tweetnacl` 或 `libsodium.js` 来获得更好的 API。

**Go** -- 扩展标准库中的 `golang.org/x/crypto/chacha20`。用 `chacha20poly1305` 包做 AEAD。

**Rust** -- `chacha20` 和 `chacha20poly1305` crate。

## nonce 规则：绝对、永远不能违反

我把它放在最前面，因为这是唯一无法挽回的错误。使用流密码时，同一个密钥和 nonce 加密两条不同的消息是灾难性的。拿到两个密文的攻击者可以把它们异或到一起得到两条明文的异或。对两条明文异或的密码分析比单独攻击密文容易得多。

怎么避免：每条消息生成随机 12 字节 nonce。96 位 nonce 下，CSPRNG 碰撞概率约为 n^2 / 2^97 -- 即使加密十亿条消息，碰撞概率仍然约 2^-70，基本为零。

```python
import os

# 每条消息生成全新的 nonce
key = os.urandom(32)   # 256 位密钥，只生成一次
nonce = os.urandom(12)  # 96 位 nonce，每条消息新生成
```

## 基本加密/解密

ChaCha20 是流密码，加密和解密是完全相同的异或操作。pycryptodome 的 API 很直接：

```python
from Crypto.Cipher import ChaCha20

key = os.urandom(32)
nonce = os.urandom(12)

# 加密
cipher = ChaCha20.new(key=key, nonce=nonce)
plaintext = b"Hello, ChaCha20!"
ciphertext = cipher.encrypt(plaintext)

# 解密 -- 和加密完全相同
cipher = ChaCha20.new(key=key, nonce=nonce)
decrypted = cipher.decrypt(ciphertext)
# decrypted == b"Hello, ChaCha20!"
```

因为没有填充和块对齐，你可以加密任意长度的数据。一条一字节的消息？可以。2 GB 的流？也可以（32 位计数器允许你在重新生成密钥前加密最多 256 GB）。

## ChaCha20-Poly1305：认证加密

裸 ChaCha20 只提供机密性，不提供完整性。拦截你密文的人可以翻转某个位，你会解密出垃圾但完全不知道出了问题。这是 ChaCha20-Poly1305 登场的地方：

```python
from Crypto.Cipher import ChaCha20_Poly1305

key = os.urandom(32)
nonce = os.urandom(12)

# 带认证的加密
cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
cipher.update(b"可选的关联数据")  # 不加密，但认证
ciphertext, tag = cipher.encrypt_and_digest(b"秘密消息")
# 标签是 16 字节 -- 和密文一起存储/传输

# 带验证的解密
cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
cipher.update(b"可选的关联数据")
try:
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    print("消息验证且解密成功:", plaintext)
except ValueError:
    print("检测到篡改 -- 消息被拒绝")
```

关联数据参数用于需要认证但不需要加密的元数据 -- 比如协议头、消息 ID 或路由信息。攻击者无法修改关联数据而不导致标签验证失败。

一个关键注意点：PyCryptodome 的 ChaCha20_Poly1305 可以自己生成 nonce。如果你显式通过 `nonce=` 传入，必须确保唯一性。如果让库自己生成，nonce 会被前置到密文前面，解密时需要从中提取。

## 浏览器中使用

在浏览器环境下，Web Crypto API 对 ChaCha20-Poly1305 的支持目前还不普遍（截至 2024 年）。可以用 AES-GCM 获得类似的认证加密。如果要专门在浏览器用 ChaCha20，可以引入 `libsodium.js` 或 `tweetnacl`。

## Go：标准库全搞定

Go 的 ChaCha20 包偏底层但功能完整：

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/chacha20poly1305"
)

func main() {
    key := make([]byte, chacha20poly1305.KeySize)  // 32 字节
    rand.Read(key)

    ae, _ := chacha20poly1305.New(key)

    nonce := make([]byte, chacha20poly1305.NonceSize)  // 12 字节
    rand.Read(nonce)

    plaintext := []byte("来自 Go 的问候！")

    // Seal 把密文附加到 nonce 后面，再自动加上标签
    ciphertext := ae.Seal(nil, nonce, plaintext, nil)

    // Open 从前面读 nonce、验证标签、返回明文
    decrypted, err := ae.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        fmt.Println("检测到篡改！")
    } else {
        fmt.Println(string(decrypted))
    }
}
```

`Seal` 和 `Open` 的 API 需要一点时间适应 -- `dst` 参数（第一个参数，上面传了 `nil`）决定了输出的前缀位置。传 `nonce` 作为 `dst` 可以自动把 nonce 存在密文前面。

## 安全检查清单

- 同一密钥每次加密都用全新随机 nonce
- 绝不要用裸 ChaCha20 而不加认证 -- 始终搭配 Poly1305
- 密钥是 32 字节，必须来自 CSPRNG
- 如果从密码派生密钥，用 PBKDF2、scrypt 或 Argon2
- nonce 和密文一起存储（不需要保密）
- Poly1305 标签是 16 字节，必须存储和验证
