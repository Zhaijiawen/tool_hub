# bcrypt 使用教程

## 环境设置

### 前置条件
- 具有bcrypt库支持的编程语言
- 理解密码安全原理
- 密码学哈希函数知识
- 了解bcrypt工作因子和性能影响

### 库选择

#### Python - bcrypt
```bash
# 安装bcrypt库
pip install bcrypt
```

#### Node.js - bcryptjs
```bash
# 安装bcryptjs（纯JavaScript实现）
npm install bcryptjs

# 或安装bcrypt（原生实现）
npm install bcrypt
```

#### PHP - password_hash
```bash
# 内置password_hash函数支持bcrypt
# PHP 5.5+无需额外安装
```

#### Java - Spring Security
```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
    <version>5.8.0</version>
</dependency>
```

## 基本概念

### 工作因子选择
```python
import bcrypt

def work_factor_guide():
    """bcrypt工作因子选择指南"""
    print("bcrypt工作因子选择指南:")
    print("工作因子10: ~100ms，适合开发环境")
    print("工作因子12: ~400ms，生产环境推荐")
    print("工作因子14: ~1.6s，高安全要求")
    print("工作因子16: ~6.4s，最高安全性")
    
    # 安全建议
    recommendations = {
        "开发环境": "工作因子10-11",
        "生产环境": "工作因子12-13",
        "高安全性": "工作因子14-15",
        "最高安全性": "工作因子16+"
    }
    
    return recommendations
```

### 哈希格式理解
```python
def explain_bcrypt_format():
    """解释bcrypt哈希格式"""
    # 示例bcrypt哈希: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe
    # 格式: $2b$<cost>$<salt><hash>
    
    print("bcrypt哈希格式:")
    print("$2b$ - 算法版本（2b是当前版本）")
    print("12   - 工作因子（成本）")
    print("LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe - 盐值+哈希")
    print("总长度: 60个字符")
```

## 基本密码操作

### 简单密码哈希
```python
import bcrypt

def hash_password(password, work_factor=12):
    """使用bcrypt哈希密码"""
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    # 生成盐值和哈希
    salt = bcrypt.gensalt(rounds=work_factor)
    hashed = bcrypt.hashpw(password, salt)
    
    return hashed.decode('utf-8')

def verify_password(password, hashed_password):
    """验证密码与哈希"""
    if isinstance(password, str):
        password = password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(password, hashed_password)

# 使用示例
password = "mySecurePassword123"
hashed = hash_password(password, work_factor=12)
print(f"密码: {password}")
print(f"哈希: {hashed}")

# 验证密码
is_valid = verify_password(password, hashed)
print(f"密码有效: {is_valid}")
```

### JavaScript实现
```javascript
const bcrypt = require('bcryptjs');

async function hashPassword(password, workFactor = 12) {
    const salt = await bcrypt.genSalt(workFactor);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// 使用示例
async function example() {
    const password = "mySecurePassword123";
    const hashed = await hashPassword(password, 12);
    console.log(`密码: ${password}`);
    console.log(`哈希: ${hashed}`);
    
    const isValid = await verifyPassword(password, hashed);
    console.log(`密码有效: ${isValid}`);
}
```

## 高级用法

### 工作因子管理
```python
import bcrypt
import time

def benchmark_work_factors():
    """基准测试不同工作因子"""
    password = "testPassword123"
    work_factors = [10, 12, 14, 16]
    
    results = {}
    for factor in work_factors:
        start_time = time.time()
        
        # 使用特定工作因子哈希密码
        hashed = hash_password(password, factor)
        
        end_time = time.time()
        duration = (end_time - start_time) * 1000  # 转换为毫秒
        
        results[factor] = {
            'duration_ms': duration,
            'hash': hashed
        }
        
        print(f"工作因子 {factor}: {duration:.2f}ms")
    
    return results

def adaptive_work_factor():
    """根据系统性能确定最佳工作因子"""
    target_time = 0.5  # 目标500ms哈希时间
    
    # 使用工作因子10测试
    start_time = time.time()
    hash_password("test", 10)
    test_time = time.time() - start_time
    
    # 计算最佳工作因子
    optimal_factor = 10
    while test_time < target_time and optimal_factor < 20:
        optimal_factor += 1
        start_time = time.time()
        hash_password("test", optimal_factor)
        test_time = time.time() - start_time
    
    return optimal_factor - 1
```

### 盐值管理
```python
def custom_salt_generation():
    """演示自定义盐值生成"""
    import os
    
    # 生成自定义盐值
    custom_salt = bcrypt.gensalt(rounds=12)
    print(f"生成的盐值: {custom_salt.decode('utf-8')}")
    
    # 使用自定义盐值进行哈希
    password = "myPassword"
    hashed = bcrypt.hashpw(password.encode('utf-8'), custom_salt)
    print(f"使用自定义盐值的哈希: {hashed.decode('utf-8')}")
    
    return custom_salt, hashed

def extract_salt_from_hash(hashed_password):
    """从bcrypt哈希中提取盐值"""
    # bcrypt哈希格式: $2b$12$<salt><hash>
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    # 盐值是前29个字符（包括$2b$12$）
    salt = hashed_password[:29]
    return salt.decode('utf-8')
```

## 安全最佳实践

### 密码验证
```python
import re

def validate_password_strength(password):
    """在哈希前验证密码强度"""
    if len(password) < 8:
        return False, "密码必须至少8个字符长"
    
    if not re.search(r"[A-Z]", password):
        return False, "密码必须包含至少一个大写字母"
    
    if not re.search(r"[a-z]", password):
        return False, "密码必须包含至少一个小写字母"
    
    if not re.search(r"\d", password):
        return False, "密码必须包含至少一个数字"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "密码必须包含至少一个特殊字符"
    
    return True, "密码符合强度要求"

def secure_password_hashing(password, work_factor=12):
    """带验证的安全密码哈希"""
    # 验证密码强度
    is_valid, message = validate_password_strength(password)
    if not is_valid:
        raise ValueError(f"密码验证失败: {message}")
    
    # 哈希密码
    return hash_password(password, work_factor)
```

### 时序攻击防护
```python
import secrets
import time

def constant_time_verification(password, hashed_password):
    """恒定时间密码验证以防止时序攻击"""
    # 使用恒定时间比较
    return verify_password(password, hashed_password)

def secure_password_update(old_password, new_password, old_hash, work_factor=12):
    """安全更新密码并验证"""
    # 验证旧密码
    if not verify_password(old_password, old_hash):
        raise ValueError("旧密码不正确")
    
    # 验证新密码强度
    is_valid, message = validate_password_strength(new_password)
    if not is_valid:
        raise ValueError(f"新密码验证失败: {message}")
    
    # 哈希新密码
    new_hash = hash_password(new_password, work_factor)
    
    return new_hash
```

## 错误处理

### 安全bcrypt操作
```python
def safe_bcrypt_operation(password, work_factor=12):
    """带错误处理的安全bcrypt操作"""
    try:
        if not password:
            raise ValueError("密码不能为空")
        
        if work_factor < 4 or work_factor > 31:
            raise ValueError("工作因子必须在4到31之间")
        
        return hash_password(password, work_factor)
        
    except Exception as e:
        print(f"bcrypt操作失败: {e}")
        return None

def validate_bcrypt_hash(hashed_password):
    """验证bcrypt哈希格式"""
    if not hashed_password:
        return False, "哈希不能为空"
    
    if not hashed_password.startswith('$2b$'):
        return False, "无效的bcrypt哈希格式"
    
    if len(hashed_password) != 60:
        return False, "无效的哈希长度"
    
    try:
        # 尝试解码哈希
        hashed_password.encode('utf-8')
        return True, "有效的bcrypt哈希"
    except UnicodeEncodeError:
        return False, "无效的字符编码"
```

## 性能优化

### 批处理
```python
import asyncio
import concurrent.futures

def batch_hash_passwords(passwords, work_factor=12, max_workers=4):
    """并行哈希多个密码"""
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(hash_password, password, work_factor)
            for password in passwords
        ]
        
        results = []
        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                print(f"密码哈希失败: {e}")
                results.append(None)
    
    return results

async def async_batch_hash(passwords, work_factor=12):
    """异步批处理密码哈希"""
    loop = asyncio.get_event_loop()
    
    tasks = []
    for password in passwords:
        task = loop.run_in_executor(None, hash_password, password, work_factor)
        tasks.append(task)
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return results
```

## 测试和验证

### 哈希验证
```python
def test_bcrypt_implementation():
    """使用已知值测试bcrypt实现"""
    test_password = "testPassword123"
    work_factor = 10
    
    # 哈希密码
    hashed = hash_password(test_password, work_factor)
    print(f"生成的哈希: {hashed}")
    
    # 验证密码
    is_valid = verify_password(test_password, hashed)
    print(f"密码验证: {is_valid}")
    
    # 使用错误密码测试
    wrong_password = "wrongPassword123"
    is_invalid = verify_password(wrong_password, hashed)
    print(f"错误密码验证: {is_invalid}")
    
    return hashed, is_valid, is_invalid

def performance_test():
    """测试bcrypt性能"""
    password = "testPassword123"
    iterations = 10
    
    print("bcrypt性能测试:")
    for work_factor in [10, 12, 14]:
        total_time = 0
        for _ in range(iterations):
            start_time = time.time()
            hash_password(password, work_factor)
            end_time = time.time()
            total_time += (end_time - start_time)
        
        avg_time = (total_time / iterations) * 1000
        print(f"工作因子 {work_factor}: {avg_time:.2f}ms 平均")
```

## 总结

本教程涵盖：
- 不同编程语言的环境设置
- 基本密码哈希和验证
- 工作因子选择和管理
- 安全最佳实践和验证
- 错误处理和性能优化
- 测试和验证技术

所有示例都遵循安全最佳实践，并为其预期用途使用适当的工作因子。 