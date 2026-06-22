# bcrypt 代码示例

几种语言中可直接使用的 bcrypt 代码片段，附带实际开发中的重要细节。

## Python

Python 的 `bcrypt` 库是 OpenBSD 实现的薄封装。API 处理的是字节，所以需要编码/解码 UTF-8 字符串。

### 基本哈希和验证

```python
import bcrypt

password = "Tr0ub4dor&3"

# gensalt() 用你选择的工作因子生成随机盐值
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

print(hashed.decode('utf-8'))
# $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe

# 验证 -- checkpw 从哈希中读取 rounds 和盐值
print(bcrypt.checkpw(password.encode('utf-8'), hashed))  # True
print(bcrypt.checkpw(b"wrong_password", hashed))         # False
```

### 基准测试工作因子

不要猜测服务器能承受多大 rounds 值。测试一下：

```python
import bcrypt
import time

for rounds in [8, 10, 12, 14, 16]:
    start = time.time()
    bcrypt.hashpw(b"benchmark", bcrypt.gensalt(rounds=rounds))
    elapsed = (time.time() - start) * 1000
    print(f"rounds={rounds:2d}: {elapsed:6.1f}ms")
```

在我开发机上 rounds=12 大约 300ms。你的结果会不同 -- 云虚拟机、树莓派和 M1 Mac 的 bcrypt 性能差别很大，因为底层 Blowfish 操作在不同 CPU 架构上的表现差异明显。

### 迷你认证服务

```python
import bcrypt

class AuthService:
    def __init__(self, target_rounds=13):
        self.target_rounds = target_rounds
        self.users = {}  # 生产环境：换成数据库
    
    def register(self, username, password):
        if username in self.users:
            return False, "用户名已被占用"
        hashed = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=self.target_rounds)
        ).decode('utf-8')
        self.users[username] = hashed
        return True, "注册成功"
    
    def login(self, username, password):
        stored = self.users.get(username)
        if not stored:
            return False, "用户名或密码错误"
        
        if not bcrypt.checkpw(password.encode('utf-8'), stored.encode('utf-8')):
            return False, "用户名或密码错误"
        
        # 透明升级：如果存储的哈希用了较弱的 rounds，重新哈希
        current_rounds = int(stored.split('$')[2])
        if current_rounds < self.target_rounds:
            new_hash = bcrypt.hashpw(
                password.encode('utf-8'),
                bcrypt.gensalt(rounds=self.target_rounds)
            ).decode('utf-8')
            self.users[username] = new_hash
        
        return True, "登录成功"


auth = AuthService(target_rounds=13)
auth.register("alice", "correct horse battery staple")
print(auth.login("alice", "correct horse battery staple"))  # (True, "登录成功")
print(auth.login("alice", "wrong password"))                # (False, "用户名或密码错误")
print(auth.login("bob", "anything"))                         # (False, "用户名或密码错误")
```

注意"bob"（不存在的用户）和"wrong password"返回相同的响应。这防止了用户枚举 -- 攻击者无法通过错误消息来判断用户名是否存在。

## JavaScript (Node.js)

`bcryptjs` 比原生 `bcrypt` 慢，但可以在任何地方部署，无需本地编译。对大多数应用来说速度差异无所谓，因为 bcrypt 本来就应该慢。

```javascript
const bcrypt = require('bcryptjs');

async function demo() {
    const password = "jsPassword456";

    // 显式生成盐值并哈希
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    console.log("哈希:", hash);

    // 验证
    const valid = await bcrypt.compare(password, hash);
    console.log("正确密码:", valid);  // true

    const invalid = await bcrypt.compare("wrong", hash);
    console.log("错误密码:", invalid);   // false
}

demo().catch(console.error);
```

一个小细节：`bcryptjs` 也支持在 `hash()` 调用中直接传密码和 rounds，不需要单独的 `genSalt()`：

```javascript
// 简写: hash(password, rounds) 内部生成盐值
const hash = await bcrypt.hash("myPassword", 12);
```

两种写法都可以，但显式的 `genSalt()` + `hash()` 模式让你可以选择重用盐值（密码场景不应该，但在某些密钥派生场景有用）。

## Go

Go 的 bcrypt 包在扩展标准库中。API 很精简但够用：

```go
package main

import (
    "fmt"
    "golang.org/x/crypto/bcrypt"
)

func main() {
    password := "goPassword123"

    // GenerateFromPassword 创建盐值并返回完整哈希字符串
    hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
    if err != nil {
        panic(err)
    }
    fmt.Println("哈希:", string(hash))
    // $2a$12$...  (Go 默认用 $2a$ 前缀)

    // CompareHashAndPassword 做恒定时间比较
    err = bcrypt.CompareHashAndPassword(hash, []byte(password))
    if err == nil {
        fmt.Println("密码匹配！")
    }

    err = bcrypt.CompareHashAndPassword(hash, []byte("wrong"))
    if err != nil {
        fmt.Println("密码不匹配")  // 走这个分支
    }

    // 可以检查哈希是否需要升级:
    cost, _ := bcrypt.Cost(hash)
    if cost < 13 {
        fmt.Println("哈希应该升级到更高的 cost")
        newHash, _ := bcrypt.GenerateFromPassword([]byte(password), 13)
        // 把 newHash 存到数据库
        _ = newHash
    }
}
```

Go 对错误密码返回 `bcrypt.ErrMismatchedHashAndPassword` 特定错误，对格式异常的哈希返回 `bcrypt.ErrHashTooShort`。这在监控中区分"密码错误"和"数据损坏"很有用，但不要把这种区分暴露给用户的错误消息。

## Java (Spring Security)

Spring Security 的 `BCryptPasswordEncoder` 是 Java 生态里最省事的方案：

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptDemo {
    public static void main(String[] args) {
        // 构造函数参数是工作因子
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

        String password = "javaPassword789";
        String hash = encoder.encode(password);
        System.out.println("哈希: " + hash);
        // $2a$12$...

        boolean matches = encoder.matches(password, hash);
        System.out.println("匹配: " + matches);  // true

        boolean wrong = encoder.matches("wrong", hash);
        System.out.println("错误: " + wrong);      // false

        // 检查哈希是否需要升级:
        boolean needsUpgrade = encoder.upgradeEncoding(hash);
        System.out.println("需要升级: " + needsUpgrade);
    }
}
```

Spring 的 `upgradeEncoding()` 检查存储的哈希是否使用了和当前 encoder 一样的工作因子。如果你把 encoder 的 rounds 从 12 调到 13，所有旧哈希对 `upgradeEncoding()` 都会返回 `true`，给你的登录时重新哈希提供了清晰的升级路径。

## 实际踩过的坑

从真实的 bcrypt 部署经验中总结：

- **哈希存在 VARCHAR(60) 字段？** 改成 VARCHAR(255)。标准哈希是 60 个字符，但未来 bcrypt 版本可能改变格式，你不想以后再搞字段宽度迁移。
- **别不小心双重哈希。** 如果你因为 72 字节限制在 bcrypt 之前用 SHA 预哈希，确保验证路径做一模一样的预哈希。我排查过一个生产事故，注册路径预哈希了但登录路径没预哈希。
- **高负载下登录超时。** 如果设了 rounds=14 又遇上流量高峰，服务器可能把所有 CPU 花在 bcrypt 上导致健康检查超时。考虑加登录频率限制或者换成 Argon2id（参数控制更精细）。
- **`gensalt()` 前缀很重要。** `$2b$` 开头的哈希到处都能用。有些老系统生成 `$2a$` 哈希，这种格式有已知的特定 UTF-8 密码 bug。新哈希用 `$2b$`。
