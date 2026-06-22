# bcrypt 使用教程

## 选库

bcrypt 的库几乎无处不在 -- 它是 AES 和 SHA 之外实现最广泛的密码算法之一。以下是各语言的推荐：

**Python** -- PyPI 上的 `bcrypt`。API 简单，维护良好：
```bash
pip install bcrypt
```

**Node.js** -- 有两个选择。`bcrypt` 是原生 C++ 绑定（更快但需要编译），`bcryptjs` 是纯 JavaScript（稍慢但零依赖，包括浏览器都能用）：
```bash
npm install bcryptjs   # 纯 JS，无需编译
npm install bcrypt     # 原生，更快
```

**PHP** -- PHP 5.5 起内置在 `password_hash()` 中，用 `PASSWORD_BCRYPT` 常量。无需额外依赖。

**Go** -- 扩展标准库 `golang.org/x/crypto/bcrypt`。

**Java** -- Spring Security 的 `BCryptPasswordEncoder` 是最常见选择，jBCrypt 和 Bouncy Castle 的实现也可以用。

## 工作因子：唯一需要调的参数

bcrypt 本质上只有一个可以调节的旋钮：工作因子（也叫 "cost" 或 "rounds"）。每增加 1 意味着计算时间翻倍，所以选对很重要：

```python
import bcrypt
import time

# 快速基准测试，找到适合你硬件的工作因子
for rounds in [10, 12, 14, 16]:
    start = time.time()
    bcrypt.hashpw(b"benchmark", bcrypt.gensalt(rounds=rounds))
    elapsed = time.time() - start
    print(f"Rounds {rounds}: {elapsed:.2f}s")
```

对于处理登录请求的 Web 服务器，每次哈希应该在 250ms 到 500ms 之间。太快等于给攻击者放水；太慢用户会抱怨（而且服务器在负载下会烧 CPU）。在典型的 2024 年服务器上，通常对应 rounds=12 或 13。

时间大致按 2^(rounds-10) * (rounds_10 的时间) 的比例增长。如果你的服务器 rounds=10 需要 50ms，rounds=12 大约需要 200ms，rounds=14 大约 800ms。这个指数曲线意味着你不能随便设个数字 -- 必须测试。

## 哈希和验证密码

Python API 极其简单。`bcrypt.hashpw()` 接收密码和盐值（用 `gensalt()` 生成），返回包含所有参数和盐值的哈希字符串。`bcrypt.checkpw()` 接收密码和存储的哈希，返回是否匹配：

```python
import bcrypt

def hash_password(password: str, rounds: int = 12) -> str:
    """哈希密码并返回 bcrypt 字符串。"""
    # bcrypt 处理字节，所以先编码字符串
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=rounds)
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """用存储的 bcrypt 哈希检查密码。"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# 使用
hashed = hash_password("correct horse battery staple", rounds=12)
print(hashed)
# $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe

print(verify_password("correct horse battery staple", hashed))  # True
print(verify_password("wrong password", hashed))                 # False
```

JavaScript（bcryptjs）写法：

```javascript
const bcrypt = require('bcryptjs');

async function hashPassword(password, rounds = 12) {
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
```

## 72 字节限制及如何处理

bcrypt 静默截断超过 72 字节的密码。对大多数用户这不是问题（72 字节是很长的密码了），但如果你想做到万无一失，用 SHA-256 预哈希：

```python
import hashlib
import bcrypt
import base64

def hash_password_safe(password: str, rounds: int = 12) -> str:
    """SHA-256 预哈希来处理长密码。"""
    # 预哈希密码得到固定长度的输入
    pre_hash = hashlib.sha256(password.encode('utf-8')).digest()
    # Base64 编码避免 null 字节干扰某些库
    encoded = base64.b64encode(pre_hash)
    salt = bcrypt.gensalt(rounds=rounds)
    return bcrypt.hashpw(encoded, salt).decode('utf-8')
```

注意这也会改变你的验证路径 -- 必须在检查之前对输入的密码做同样的预哈希。如果你在构建新系统，直接考虑用 Argon2id 就好，它原生支持长密码。如果已经在用 bcrypt，这个模式完全可行。

## 透明的工作因子升级

bcrypt 最好的特性就是工作因子嵌入哈希字符串中。这让你可以随着时间推移升级参数，而不需要大规模重置密码：

```python
def login_with_upgrade(username: str, password: str, db):
    """登录时透明升级弱哈希。"""
    user = db.get_user(username)
    if not user:
        return False  # 不泄露用户是否存在

    if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return False

    # 检查是否需要升级工作因子
    # rounds 值是哈希字符串的第二个段
    current_rounds = int(user.password_hash.split('$')[2])
    if current_rounds < 13:  # 我们当前的目标
        new_hash = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt(rounds=13)
        ).decode()
        db.update_password_hash(username, new_hash)

    return True
```

这个模式是多年维持密码数据库健康的标配做法。设一个目标 rounds 值，每次有人用旧哈希登录时，静默升级他们。

你也可以用这个策略从更旧的算法迁移：检查存储的哈希是否以 `$2b$` 开头，如果不是（说明还是旧格式），用旧算法验证，成功后用 bcrypt 重新哈希。

## JavaScript 注意：async vs sync

Node.js 的 bcrypt 操作默认是异步的 -- 它们在后台线程池中运行以避免阻塞事件循环。别在请求处理函数中意外使用同步版本：

```javascript
// 错误：这会阻塞整个 Node.js 进程
app.post('/login', (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    // ...
});

// 正确：使用异步 API
app.post('/login', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    // ...
});
```

同步方法适合脚本和 CLI 工具，但绝不要在处理并发请求的服务器中使用。

## 参数速查

| 场景 | 推荐 rounds | 大概耗时 |
|------|-----------|----------|
| 开发/测试 | 6-10 | < 50ms |
| 生产环境（标准） | 12-13 | 200-500ms |
| 高安全性 | 14-15 | 800ms-3s |
| 别超过 16 | 16+ | > 5s（严重影响体验） |

记住：在你自己实际硬件上做基准测试。云虚拟机的 bcrypt 性能可能和你的开发笔记本天差地别。

## 使用本工具

这个 ToolHub bcrypt 工具在你的浏览器中哈希和验证密码 -- 数据不会离开你的电脑。它使用纯 JS 实现，结果和服务端 bcrypt 库完全一致。哈希格式完全标准，可以被任何 bcrypt 兼容的系统验证。
