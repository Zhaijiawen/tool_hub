# SHA 使用教程

密码学哈希是最简单的密码操作之一，但也有一些事情需要做对。SHA-256 应该是你的默认选择，除非有理由选别的。

## 计算哈希

每种语言都内置了 SHA。Python：

```python
import hashlib

# SHA-256（最常用）
data = b"Hello, world!"
hash_256 = hashlib.sha256(data).hexdigest()
print(f"SHA-256: {hash_256}")

# SHA-512
hash_512 = hashlib.sha512(data).hexdigest()
print(f"SHA-512: {hash_512}")

# SHA-1（已过时 -- 仅供参考）
# hash_1 = hashlib.sha1(data).hexdigest()

# 流式/大文件
h = hashlib.sha256()
h.update(b"Hello, ")
h.update(b"world!")
print(h.hexdigest())
```

JavaScript (Node)：
```javascript
const crypto = require('crypto');

const hash = crypto.createHash('sha256').update('Hello, world!').digest('hex');
console.log('SHA-256:', hash);
```

## HMAC -- 带密钥的哈希

如果需要消息认证码，用 HMAC，不要用 H(密钥 || 消息)：

```python
import hmac
import hashlib

key = b"secret-key"
message = b"important message"

# HMAC-SHA256
mac = hmac.new(key, message, hashlib.sha256).hexdigest()
print(f"HMAC-SHA256: {mac}")
```

HMAC 免疫长度扩展攻击。构造是 `H((key XOR opad) || H((key XOR ipad) || message))`，修复了朴素前缀方案中的漏洞。

## 文件哈希

大文件分块哈希：

```python
def sha256_file(file_path):
    h = hashlib.sha256()
    with open(file_path, 'rb') as f:
        while chunk := f.read(65536):  # 64KB 分块
            h.update(chunk)
    return h.hexdigest()

print(sha256_file('large_file.bin'))
```

## 什么时候不该用 SHA

- **密码存储**：用 bcrypt、Argon2 或 scrypt。SHA 太快了。
- **加密**：SHA 不是加密。它是单向的。
- **随机数生成**：用 CSPRNG（os.urandom），别用当前时间的 SHA。

## 常见模式

```python
# 双重 SHA-256（比特币风格）
digest = hashlib.sha256(hashlib.sha256(data).digest()).hexdigest()

# SHA-256 文件完整性校验
with open('download.zip', 'rb') as f:
    file_hash = hashlib.sha256(f.read()).hexdigest()
# 与公布的哈希对比验证完整性
```
