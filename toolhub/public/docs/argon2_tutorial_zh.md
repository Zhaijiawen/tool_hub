# Argon2 使用教程

## 选库

Argon2 的绑定库几乎所有语言都有。以下是我用过且可以推荐的：

**Python** -- `argon2-cffi` 是标准选择，通过 CFFI 包装了参考 C 实现，API 清爽且不容易用错：
```bash
pip install argon2-cffi
```

**Node.js** -- `argon2` npm 包维护活跃，提供了好用的异步 API：
```bash
npm install argon2
```

**PHP** -- PHP 7.2 起内置了 Argon2 支持，用 `password_hash()` 和 `PASSWORD_ARGON2ID` 常量就行，不需要额外的东西。

**Java** -- Spring Security 通过 `Argon2PasswordEncoder` 支持 Argon2。或者用 Bouncy Castle。

**Go** -- 扩展标准库 `golang.org/x/crypto/argon2` 就够用了，不需要第三方依赖。

## 两个最重要的概念

写代码之前，先搞清楚这两件事：

### 变体选择 -- 直接用 Argon2id 就好

除非你有特定的威胁模型要求否则，Argon2id 就是正确选择。它结合了 Argon2i 的抗侧信道能力（前半段）和 Argon2d 的抗 GPU/ASIC 能力（后半段）。NIST 和 RFC 都推荐它作为默认。

```python
from argon2 import PasswordHasher
from argon2 import Type

# 大多数库默认就是 Argon2id，但显式声明更清晰
ph = PasswordHasher(type=Type.ID)
```

### 参数调优 -- 先做基准测试

人们用 Argon2 最大的错误就是不测试直接选参数。要么留默认值（通常调的是开发环境参数而非生产环境），要么照搬某篇博客的参数。

正确的做法是在自己的硬件上测试：

```python
import time
from argon2 import PasswordHasher

def find_params(target_seconds=1.0, max_memory_mb=256):
    """暴力搜索符合目标时间的参数"""
    test_password = "benchmark_test"
    
    for time_cost in range(1, 11):
        for memory_cost in [32768, 65536, 131072, 262144, 524288]:
            if memory_cost / 1024 > max_memory_mb:
                continue
            
            ph = PasswordHasher(time_cost=time_cost, memory_cost=memory_cost)
            start = time.time()
            ph.hash(test_password)
            elapsed = time.time() - start
            
            if elapsed >= target_seconds:
                return {
                    "time_cost": time_cost,
                    "memory_cost": memory_cost,
                    "elapsed": elapsed
                }
    
    # 保底 -- 全部拉满
    return {"time_cost": 10, "memory_cost": 524288, "elapsed": 999}

params = find_params(target_seconds=0.5)
print(f"推荐参数: time_cost={params['time_cost']}, "
      f"memory_cost={params['memory_cost'] / 1024}MB "
      f"({params['elapsed']:.2f}s)")
```

对于典型的 Web 应用，目标设在 0.5-1 秒每次哈希。如果服务器撑不住，从 0.2 秒开始，随着横向扩展再慢慢调高。关键洞察：哈希时间只在登录时一次性消耗。这是用户每次会话承受一次的延迟 -- 有意识地做这个权衡。

## 基本哈希和验证

Python 的 argon2-cffi 库提供了 `PasswordHasher` 对象，处理所有事情：盐值生成、输出字符串中的参数编码、以及验证。

```python
from argon2 import PasswordHasher

ph = PasswordHasher(
    time_cost=3,       # 遍历内存 3 次
    memory_cost=65536, # 64 MB 内存
    parallelism=1,     # 单线程
    hash_len=32,       # 32 字节输出
    salt_len=16,       # 16 字节随机盐
)

password = "my_user_password_123"
hashed = ph.hash(password)
print(hashed)
# 输出类似: $argon2id$v=19$m=65536,t=3,p=1$<salt>$<hash>
```

输出字符串是自描述的 -- 包含了算法变体、版本和所有参数。这对向前兼容性简直完美：如果以后想调高参数，你可以用旧哈希自身的参数验证它，用更强的参数哈希新密码，全都存在同一个数据库列里。

```python
# 验证非常简单
try:
    ph.verify(hashed, password)
    print("密码正确！")
except argon2.exceptions.VerifyMismatchError:
    print("密码错误！")
```

## 进阶：透明的参数升级

这是我生产环境用过的一个模式，能干净地处理参数升级：

```python
import argon2

class PasswordService:
    def __init__(self, target_params):
        self.current_hasher = PasswordHasher(**target_params)
        self.target_params = target_params
    
    def hash_password(self, password):
        return self.current_hasher.hash(password)
    
    def verify_password(self, stored_hash, password):
        """返回 (is_valid, needs_rehash)"""
        try:
            # verify 调用使用 stored_hash 中嵌入的参数
            ph = PasswordHasher()
            ph.verify(stored_hash, password)
            
            # 检查哈希是否用了比我们期望更弱的参数
            needs_rehash = ph.check_needs_rehash(stored_hash)
            
            return True, needs_rehash
        except argon2.exceptions.VerifyMismatchError:
            return False, False
    
    def rehash_if_needed(self, stored_hash, password):
        """如果旧参数过时，用当前参数重新哈希"""
        is_valid, needs_rehash = self.verify_password(stored_hash, password)
        if needs_rehash and is_valid:
            return self.hash_password(password)
        return stored_hash
```

如果 `check_needs_rehash` 返回 `True`，就用当前参数重新哈希并更新数据库。用户甚至不知道发生过升级。

## 不要泄露时序信息的错误处理

有个容易被忽略的细节：不要为"用户不存在"和"密码错误"返回不同的错误信息。这不只是 Argon2 的问题 -- 而是通用的认证原则。如果你的错误信息让攻击者能区分"这个账号存在"和"密码不对"，你就给了他们一个用户名枚举入口。

```python
# 不好的做法：不同的错误信息泄露用户存在性
if not user:
    return "用户不存在"
if not verify_password(user.hash, password):
    return "密码错误"

# 好的做法：无论什么情况都返回相同的信息
if not user or not verify_password(user.hash, password):
    return "用户名或密码错误"
```

另外别忘了，Argon2 本身的验证路径是恒定时间的 -- 库已经帮你处理了。但你外围的逻辑仍然需要注意时序泄露（比如，数据库查找不存在的用户和已存在的用户可能需要测量上不同量级的时间）。

## 参数速查表

| 场景 | time_cost | memory_cost | parallelism | 备注 |
|------|-----------|-------------|-------------|------|
| 开发环境 | 1 | 32768 (32 MB) | 1 | 快，但别用于生产 |
| Web 应用（标准） | 2-3 | 65536-131072 (64-128 MB) | 1 | 大多数网站的合适平衡 |
| 高安全性 | 4-6 | 262144 (256 MB) | 1 | 金融/政府数据 |
| 最高安全性 | 10 | 524288+ (512+ MB) | 1 | 密钥派生、离线使用 |

记住：这些数字要在你自己的硬件上验证。上表是起点，不是铁律。

## 使用本工具

这个在线 Argon2 工具处理参数选择、哈希和验证。所有计算都在你的浏览器中完成 -- 不会发送任何数据到服务器。盐值从你浏览器的 CSPRNG 生成，所有参数编码在输出字符串中，你可以后续用任何兼容的 Argon2 实现来验证。
