# AES 使用教程

## 环境准备

写代码之前先选好库。现在每种语言都有靠谱的密码库，别自己实现 AES，debug 起来会让你怀疑人生。以下是我常用的：

**Python** -- `pycryptodome` 是标配：
```bash
pip install pycryptodome
```

**JavaScript/Node** -- `crypto-js` 哪里都能用，但如果你在浏览器里更推荐直接用 Web Crypto API（内置的，还能用硬件加速）：
```bash
npm install crypto-js
```

**Java** -- Bouncy Castle 是 Java 密码学的瑞士军刀，不过标准库 `javax.crypto` 做基本的 AES 也完全够用。

**C/C++** -- OpenSSL 的 `libcrypto` 是显而易见的选择，或者 `libsodium` 如果你想要更难用错的高层 API。

**Go** -- 标准库 `crypto/aes` 和 `crypto/cipher` 就够用了，不需要第三方依赖，这点很舒服。

**Rust** -- `aes-gcm` crate 或 `aes` crate，看你是只要分组密码还是需要带认证的加密。

## 密钥生成 -- 这一步搞错就全完了

别直接用密码当 AES 密钥。真的别。如果非要从密码派生密钥，用 PBKDF2、scrypt 或 Argon2，加上合适的 salt。但大多数场景下，你应该用随机密钥：

```python
import os

# 生成 256 位随机密钥
key = os.urandom(32)  # 32 字节 = 256 位

# AES-128 用 16 字节，AES-192 用 24 字节
```

小提醒：`os.urandom` 在 Linux/macOS 上没问题，但在某些旧版 Python/Windows 组合上，用 `secrets.token_bytes()` 更稳妥 -- 底层的随机源一样，但名字更明确告诉你这是给密码学用的。

## 填充 -- 烦人但躲不掉

AES 一次只加密 16 字节。如果数据不是 16 字节的倍数，就得填充。PKCS#7 是标准做法：

```python
from Crypto.Util.Padding import pad, unpad

BLOCK_SIZE = 16

# pad() 添加字节使总长度成为 BLOCK_SIZE 的倍数
# 每个填充字节的值等于添加的填充字节数
data = b"Hello, world!"  # 13 字节
padded = pad(data, BLOCK_SIZE)  # 添加 3 个值为 0x03 的字节
```

PKCS#7 填充的好处是 `unpad()` 读取最后一个字节就知道要去掉几个填充字节。不过解密时一定要正确验证填充，否则可能被填充预言攻击（当然用 GCM 这类现代 AEAD 模式的话就完全不用担心这个了）。

## 开始加密

最简单的安全模式 -- AES-256 CBC 加随机 IV：

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import os

def encrypt_cbc(key, plaintext):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode(), AES.block_size)
    ciphertext = cipher.encrypt(padded_data)
    # IV 附在密文前面返回 -- 解密时需要它
    return iv + ciphertext

def decrypt_cbc(key, encrypted_data):
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    return unpad(padded_data, AES.block_size).decode()

# 使用
key = os.urandom(32)
encrypted = encrypt_cbc(key, "老地方见")
print(decrypt_cbc(key, encrypted))  # "老地方见"
```

IV 不需要保密，但必须不可预测，而且同一个密钥绝不能重复使用同一个 IV。把 IV 附在密文前面一起存储是标准做法。

## GCM 模式 -- 加密加认证

CBC 只提供机密性。如果有人翻转了密文中的某一位，解密出来是乱码但你完全不会知道。GCM 通过认证标签来检测篡改：

```python
from Crypto.Cipher import AES

def encrypt_gcm(key, plaintext, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(associated_data)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())
    return cipher.nonce, ciphertext, tag

def decrypt_gcm(key, nonce, ciphertext, tag, associated_data=b""):
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode()
    except ValueError:
        raise ValueError("密文被篡改了！")
```

`associated_data` 参数用于需要认证但不需要加密的数据 -- 比如元数据或协议头。标签一般是 16 字节（128 位），nonce 最好用 12 字节以达到 GCM 的最优性能（其他长度计算会慢一些）。GCM 的铁律：绝不重复使用同一个密钥的 nonce，这是绝对不能打破的规则。

## 文件加密

文件可能比内存大，需要分块处理：

```python
def encrypt_file(key, input_path, output_path):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        fout.write(iv)  # IV 存在文件开头

        while True:
            chunk = fin.read(64 * 1024)  # 64KB 分块
            if not chunk:
                break
            if len(chunk) % 16 != 0:
                chunk = pad(chunk, AES.block_size)
            fout.write(cipher.encrypt(chunk))

def decrypt_file(key, input_path, output_path):
    with open(input_path, 'rb') as fin, open(output_path, 'wb') as fout:
        iv = fin.read(16)
        cipher = AES.new(key, AES.MODE_CBC, iv)

        while True:
            chunk = fin.read(64 * 1024)
            if not chunk:
                break
            fout.write(cipher.decrypt(chunk))
```

提醒一下：这个 CBC 文件加密不提供认证。攻击者如果能修改加密文件，可以构造出对明文内容可预测的破坏。严肃的文件加密应该用 GCM（但需要把整个文件缓存起来或用分块认证），或者直接用更上层的工具比如 age 或 GPG。

## 密钥管理 -- 别把密钥写死在代码里

如果需要持久化存储密钥，用另一个从密码派生的密钥来加密它：

```python
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256

def derive_key(password, salt):
    return PBKDF2(password.encode(), salt, dkLen=32, count=100_000, hmac_hash_module=SHA256)

# 用密码加密存储密钥
def save_key(key, filename, password):
    salt = os.urandom(16)
    kek = derive_key(password, salt)  # 密钥加密密钥
    cipher = AES.new(kek, AES.MODE_GCM)
    encrypted_key, tag = cipher.encrypt_and_digest(key)

    import json, base64
    with open(filename, 'w') as f:
        json.dump({
            'salt': base64.b64encode(salt).decode(),
            'nonce': base64.b64encode(cipher.nonce).decode(),
            'key': base64.b64encode(encrypted_key).decode(),
            'tag': base64.b64encode(tag).decode(),
        }, f)

def load_key(filename, password):
    import json, base64
    with open(filename) as f:
        d = json.load(f)
    salt = base64.b64decode(d['salt'])
    kek = derive_key(password, salt)
    cipher = AES.new(kek, AES.MODE_GCM, nonce=base64.b64decode(d['nonce']))
    return cipher.decrypt_and_verify(base64.b64decode(d['key']), base64.b64decode(d['tag']))
```

生产环境建议用专业的密钥管理服务（AWS KMS、HashiCorp Vault、Google Cloud KMS），不要自己管理密钥文件。把密钥管理做对的运维成本比大多数人想象的要高。

## 安全检查清单

- 用 `secrets.token_bytes()` 或 `os.urandom()` 生成密钥，不要直接从密码生成
- 同一个密钥每次加密都用全新的随机 IV/nonce
- 优先选 GCM 或其他 AEAD 模式而不是纯 CBC -- 认证很重要
- GCM 的 nonce 绝不能重复，绝对不能
- 用现成的库，别自己实现
- 所有输入在传给密码函数之前先验证
- 如果是加密静态数据，要提前想好密钥轮换的策略
