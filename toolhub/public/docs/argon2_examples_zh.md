# Argon2 代码示例

几种语言下可直接使用的 Argon2 代码片段，附带每个部分的说明。

## Python

Python 的 `argon2-cffi` 是参考实现的官方绑定，用起来很舒服。`PasswordHasher` 类帮你处理了盐值生成、参数编码和恒定时间验证。

### 基本哈希和验证

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()  # 默认: Argon2id, t=3, m=65536, p=1

password = "correct horse battery staple"
hashed = ph.hash(password)
print(f"哈希: {hashed}")

# 哈希字符串包含所有参数 -- 是自包含的
# $argon2id$v=19$m=65536,t=3,p=1$<salt>$<hash>

try:
    ph.verify(hashed, password)
    print("密码匹配！")
except VerifyMismatchError:
    print("密码错误！")
```

### 生产环境的自定义参数

开发环境的默认值是故意设得很快。生产环境需要更多内存，可能也需要更多时间：

```python
ph = PasswordHasher(
    time_cost=3,        # 遍历内存数组的次数
    memory_cost=131072, # 128 MB (131072 KiB)
    parallelism=1,      # 线程数 -- Web 服务器通常 1
    hash_len=32,        # 32 字节输出
    salt_len=16,        # 16 字节盐值
)

hashed = ph.hash("production_password")
print(hashed)
```

### 构建一个小型认证系统

```python
from argon2 import PasswordHasher
import argon2.exceptions

class AuthService:
    def __init__(self, time_cost=3, memory_cost=131072):
        self._params = {"time_cost": time_cost, "memory_cost": memory_cost}
        self._hasher = PasswordHasher(**self._params, parallelism=1)
        self._users = {}  # 生产环境换成数据库
    
    def register(self, username, password):
        if username in self._users:
            return False, "用户名已占用"
        self._users[username] = self._hasher.hash(password)
        return True, "注册成功！"
    
    def login(self, username, password):
        stored_hash = self._users.get(username)
        if not stored_hash:
            # 和密码错误返回相同信息 -- 不泄露用户名存在性
            return False, "用户名或密码错误"
        
        try:
            # verify() 从存储的哈希值中读取参数
            PasswordHasher().verify(stored_hash, password)
            
            # 检查是否需要升级到更强的参数
            if PasswordHasher().check_needs_rehash(stored_hash):
                self._users[username] = self._hasher.hash(password)
            
            return True, "登录成功！"
        except argon2.exceptions.VerifyMismatchError:
            return False, "用户名或密码错误"


auth = AuthService()
auth.register("alice", "Tr0ub4dor&3")
print(auth.login("alice", "Tr0ub4dor&3"))  # (True, "登录成功！")
print(auth.login("alice", "wrongpass"))    # (False, "用户名或密码错误")
print(auth.login("bob", "anything"))        # (False, "用户名或密码错误")
```

### 通过基准测试找到合适的参数

不要凭感觉选参数 -- 测一下：

```python
import time
from argon2 import PasswordHasher

def benchmark_params(time_cost, memory_cost):
    ph = PasswordHasher(time_cost=time_cost, memory_cost=memory_cost)
    start = time.time()
    ph.hash("benchmark_password")
    return time.time() - start

# 快速扫描合理的参数组合
for t in [1, 2, 3, 5]:
    for m_kib in [32768, 65536, 131072, 262144]:
        elapsed = benchmark_params(t, m_kib)
        print(f"t={t}, m={m_kib/1024:.0f}MB -> {elapsed:.2f}s")
```

选一个符合你延迟预算的组合（大多数 Web 应用 0.5-1 秒）。

## JavaScript (Node.js)

`argon2` npm 包提供基于 Promise 的 API。`type` 参数很重要 -- 显式设为 `argon2id`。

```javascript
const argon2 = require('argon2');

async function hashAndVerify() {
    // 使用显式的 Argon2id 哈希
    const hash = await argon2.hash("my_password", {
        type: argon2.argon2id,
        timeCost: 3,
        memoryCost: 65536,  // 64 MiB (单位 KiB)
        parallelism: 1,
        hashLength: 32,
    });
    console.log("哈希:", hash);

    // 验证 -- 从哈希字符串中读取参数
    const valid = await argon2.verify(hash, "my_password");
    console.log("有效:", valid);  // true

    const invalid = await argon2.verify(hash, "wrong_password");
    console.log("无效:", invalid);  // false
}

hashAndVerify().catch(console.error);
```

Node.js API 同样暴露了 `argon2.needsRehash()` 用于参数升级，和 Python 库一样：

```javascript
// 检查旧哈希是否需要升级
const needsUpgrade = argon2.needsRehash(oldHash, {
    timeCost: 5,           // 我们现在想要更强的参数
    memoryCost: 131072,
});
if (needsUpgrade) {
    const newHash = await argon2.hash(password, { timeCost: 5, memoryCost: 131072 });
    // 把 newHash 存到数据库
}
```

## Go

Go 的 `golang.org/x/crypto/argon2` 包是底层实现 -- 它提供密钥派生，而不是内建验证的密码哈希 API。你需要自己处理编码和参数存储。对于密码哈希场景，可以考虑更高层的封装，不过这里展示原始用法：

```go
package main

import (
    "crypto/rand"
    "crypto/subtle"
    "encoding/base64"
    "fmt"
    "strings"
    "golang.org/x/crypto/argon2"
)

func hashPassword(password string) (string, error) {
    // 生成 16 字节随机盐
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil {
        return "", err
    }

    // Argon2id 显式参数
    hash := argon2.IDKey([]byte(password), salt,
        3,          // time (迭代次数)
        64*1024,    // memory (64 MiB)
        1,          // threads
        32,         // 输出密钥长度
    )

    // 将盐和哈希编码在一起存储
    encoded := base64.StdEncoding.EncodeToString(salt) + "$" +
        base64.StdEncoding.EncodeToString(hash)

    return encoded, nil
}

func verifyPassword(encodedHash, password string) bool {
    // 分离盐和哈希
    parts := strings.SplitN(encodedHash, "$", 2)
    if len(parts) != 2 {
        return false
    }

    salt, _ := base64.StdEncoding.DecodeString(parts[0])
    expectedHash, _ := base64.StdEncoding.DecodeString(parts[1])

    // 用相同参数重新计算
    recomputed := argon2.IDKey([]byte(password), salt, 3, 64*1024, 1, 32)

    // 恒定时间比较
    return subtle.ConstantTimeCompare(recomputed, expectedHash) == 1
}
```

需要注意的是，这段 Go 代码比 Python/JS 冗长很多，因为它需要手动处理参数跟踪和恒定时间比较。生产环境的 Go 项目可以考虑用 `github.com/matthewhartstonge/argon2` 这类库来封装这些细节。

## 容易踩的坑

几个实际使用中会让你头疼的地方：

- **不要截断哈希字符串。** `$argon2id$...` 格式有精确的分隔符。截断或修改会破坏验证。
- **不要重复使用盐值。** 库在 `hash()` 调用中已经帮你处理了。如果你手动构造盐值，每个密码都要有自己的盐。
- **不要存储密码，哪怕临时也不行。** 如果你在 Java 中用 `char[]` 或在 Python 中用 `bytearray`，哈希完之后清零。Python 字符串是不可变的所以 `hash()` 调用本身已经处理好了；在更底层的语言中要多留心。
- **测试你的迁移路径。** 从 bcrypt/PBKDF2 迁移到 Argon2 之前，用 staging 数据库完整测试一遍登录时重新哈希的流程。
