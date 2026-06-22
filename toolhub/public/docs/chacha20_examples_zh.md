# ChaCha20 代码示例

几种语言下的实用 ChaCha20 代码片段。除非特别标注，所有示例都使用认证加密。

## Python

### 裸 ChaCha20（无认证 -- 知道什么时候该用）

生产环境几乎不用裸 ChaCha20。它只提供机密性不提供完整性。除非你在别处已经处理了认证。

```python
import os
from Crypto.Cipher import ChaCha20

key = os.urandom(32)
nonce = os.urandom(12)

cipher = ChaCha20.new(key=key, nonce=nonce)
message = b"没有认证的流密码"
ciphertext = cipher.encrypt(message)

# 用同样的密钥和 nonce 解密
cipher = ChaCha20.new(key=key, nonce=nonce)
plaintext = cipher.decrypt(ciphertext)
print(plaintext.decode())
```

### ChaCha20-Poly1305（你实际应该用的）

这是生产可用的版本。Poly1305 标签能捕获任何篡改：

```python
from Crypto.Cipher import ChaCha20_Poly1305

def encrypt(key, plaintext, aad=b""):
    nonce = os.urandom(12)
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(aad)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return nonce + ciphertext + tag  # 打包在一起

def decrypt(key, data, aad=b""):
    nonce = data[:12]
    tag = data[-16:]
    ciphertext = data[12:-16]
    cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
    cipher.update(aad)
    try:
        return cipher.decrypt_and_verify(ciphertext, tag)
    except ValueError:
        raise ValueError("密文被修改了！")

key = os.urandom(32)
encrypted = encrypt(key, b"带篡改检测的秘密消息", b"header")
decrypted = decrypt(key, encrypted, b"header")
print(decrypted.decode())
```

### 用 ChaCha20-Poly1305 加密文件

文件加密需要流式或分块 AE。以下是一个分块方案，每块带独立的 nonce 和 tag（对大多数场景偏重了，但演示性强）：

```python
def encrypt_file(key, input_path, output_path, chunk_size=65536):
    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        while True:
            chunk = fin.read(chunk_size)
            if not chunk:
                break
            nonce = os.urandom(12)
            cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
            ciphertext, tag = cipher.encrypt_and_digest(chunk)
            fout.write(nonce)
            fout.write(len(ciphertext).to_bytes(4, 'big'))
            fout.write(ciphertext)
            fout.write(tag)

def decrypt_file(key, input_path, output_path):
    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        while True:
            header = fin.read(16)  # 12 nonce + 4 长度
            if not header:
                break
            nonce = header[:12]
            chunk_len = int.from_bytes(header[12:16], 'big')
            ciphertext = fin.read(chunk_len)
            tag = fin.read(16)
            cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
            try:
                chunk = cipher.decrypt_and_verify(ciphertext, tag)
                fout.write(chunk)
            except ValueError:
                raise ValueError("文件被篡改了！")
```

## Go

Go 的 `chacha20poly1305` 包提供认证加密。`Seal` 方法把密文和标签追加在 nonce 后面，存储起来很方便：

```go
package main

import (
    "crypto/rand"
    "fmt"
    "golang.org/x/crypto/chacha20poly1305"
)

func main() {
    key := make([]byte, chacha20poly1305.KeySize)
    rand.Read(key)

    aead, _ := chacha20poly1305.New(key)

    nonce := make([]byte, chacha20poly1305.NonceSize)
    rand.Read(nonce)

    plaintext := []byte("Go 中的认证加密")
    additionalData := []byte("protocol-v1")

    // Seal: 加密 + 认证。nonce 被前置到了前面。
    ciphertext := aead.Seal(nonce, nonce, plaintext, additionalData)

    // Open: 验证 + 解密。从 ciphertext[:NonceSize] 读 nonce。
    nonce, ciphertext = ciphertext[:aead.NonceSize()], ciphertext[aead.NonceSize():]
    decrypted, err := aead.Open(nil, nonce, ciphertext, additionalData)
    if err != nil {
        fmt.Println("验证失败:", err)
    } else {
        fmt.Println(string(decrypted))
    }
}
```

如果需要不带认证的裸 ChaCha20（比如实现已有的协议），用更底层的 `chacha20` 包：

```go
import "golang.org/x/crypto/chacha20"

cipher, _ := chacha20.NewUnauthenticatedCipher(key, nonce)
ciphertext := make([]byte, len(plaintext))
cipher.XORKeyStream(ciphertext, plaintext)
```

但说实话，你几乎不需要这个。首选永远是 `chacha20poly1305`。

## JavaScript (Node.js)

Node 内置的 `crypto` 模块支持 ChaCha20-Poly1305：

```javascript
const crypto = require('crypto');

function encrypt(key, plaintext) {
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, {
        authTagLength: 16,
    });
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([nonce, ciphertext, tag]);
}

function decrypt(key, data) {
    const nonce = data.subarray(0, 12);
    const tag = data.subarray(data.length - 16);
    const ciphertext = data.subarray(12, data.length - 16);
    const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, {
        authTagLength: 16,
    });
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

const key = crypto.randomBytes(32);
const encrypted = encrypt(key, Buffer.from('来自 Node.js 的问候！'));
const decrypted = decrypt(key, encrypted);
console.log(decrypted.toString());
```

## 关键要点

- ChaCha20-Poly1305 是默认选择 -- 裸 ChaCha20 是例外
- 同一密钥每条消息必须用唯一 nonce；96 位下随机生成是安全的
- Poly1305 标签（16 字节）必须在使用解密数据前验证
- ChaCha20 纯软件就很快 -- 不需要特殊硬件
