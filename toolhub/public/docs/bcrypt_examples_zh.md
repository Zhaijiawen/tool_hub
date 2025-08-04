# bcrypt 代码示例

## 基本哈希操作

### 简单密码哈希
```python
import bcrypt

def basic_hash_example():
    """基本bcrypt密码哈希示例"""
    password = "mySecurePassword123"
    
    # 使用默认工作因子(12)哈希密码
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    print(f"原始密码: {password}")
    print(f"哈希密码: {hashed.decode('utf-8')}")
    
    # 验证密码
    is_valid = bcrypt.checkpw(password.encode('utf-8'), hashed)
    print(f"密码验证: {is_valid}")
    
    return hashed

# 运行示例
basic_hash_example()
```

### 自定义工作因子
```python
import time

def custom_work_factor_example():
    """自定义工作因子示例"""
    password = "adminPassword456"
    work_factor = 14  # 更高安全性
    
    # 使用自定义工作因子生成盐值
    salt = bcrypt.gensalt(rounds=work_factor)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    print(f"密码: {password}")
    print(f"工作因子: {work_factor}")
    print(f"哈希: {hashed.decode('utf-8')}")
    
    return hashed

# 测试不同工作因子
def work_factor_comparison():
    """比较不同工作因子"""
    password = "testPassword"
    factors = [10, 12, 14, 16]
    
    for factor in factors:
        start_time = time.time()
        salt = bcrypt.gensalt(rounds=factor)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        end_time = time.time()
        
        duration = (end_time - start_time) * 1000
        print(f"工作因子 {factor}: {duration:.2f}ms")
```

## 高级用法

### 盐值管理
```python
def salt_management_example():
    """演示盐值管理"""
    password = "userPassword789"
    
    # 手动生成盐值
    salt1 = bcrypt.gensalt(rounds=12)
    salt2 = bcrypt.gensalt(rounds=12)
    
    # 使用不同盐值哈希相同密码
    hash1 = bcrypt.hashpw(password.encode('utf-8'), salt1)
    hash2 = bcrypt.hashpw(password.encode('utf-8'), salt2)
    
    print(f"密码: {password}")
    print(f"哈希1: {hash1.decode('utf-8')}")
    print(f"哈希2: {hash2.decode('utf-8')}")
    print(f"哈希不同: {hash1 != hash2}")
    
    # 两者都应该验证正确
    valid1 = bcrypt.checkpw(password.encode('utf-8'), hash1)
    valid2 = bcrypt.checkpw(password.encode('utf-8'), hash2)
    print(f"都有效: {valid1 and valid2}")

def extract_salt_example():
    """从现有哈希中提取盐值"""
    password = "examplePassword"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # 提取盐值（前29个字符）
    salt = hashed[:29]
    print(f"原始哈希: {hashed.decode('utf-8')}")
    print(f"提取的盐值: {salt.decode('utf-8')}")
    
    # 使用提取的盐值处理新密码
    new_password = "newPassword123"
    new_hash = bcrypt.hashpw(new_password.encode('utf-8'), salt)
    print(f"使用相同盐值的新哈希: {new_hash.decode('utf-8')}")
```

### 密码验证
```python
import re

def password_validation_example():
    """在哈希前验证密码强度"""
    def validate_password(password):
        if len(password) < 8:
            return False, "太短"
        if not re.search(r"[A-Z]", password):
            return False, "无大写字母"
        if not re.search(r"[a-z]", password):
            return False, "无小写字母"
        if not re.search(r"\d", password):
            return False, "无数字"
        if not re.search(r"[!@#$%^&*]", password):
            return False, "无特殊字符"
        return True, "有效"
    
    test_passwords = [
        "weak",
        "weakpass",
        "WeakPass",
        "WeakPass1",
        "WeakPass1!"
    ]
    
    for password in test_passwords:
        is_valid, message = validate_password(password)
        if is_valid:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            print(f"'{password}': {message} -> {hashed.decode('utf-8')[:20]}...")
        else:
            print(f"'{password}': {message}")
```

## 安全应用

### 用户认证系统
```python
class UserAuth:
    def __init__(self):
        self.users = {}  # 实际应用中，使用数据库
    
    def register_user(self, username, password, work_factor=12):
        """使用bcrypt哈希密码注册新用户"""
        if username in self.users:
            return False, "用户名已存在"
        
        # 哈希密码
        hashed = bcrypt.hashpw(password.encode('utf-8'), 
                              bcrypt.gensalt(rounds=work_factor))
        
        self.users[username] = {
            'password_hash': hashed.decode('utf-8'),
            'work_factor': work_factor
        }
        return True, "用户注册成功"
    
    def authenticate_user(self, username, password):
        """使用bcrypt验证用户"""
        if username not in self.users:
            return False, "用户不存在"
        
        stored_hash = self.users[username]['password_hash']
        is_valid = bcrypt.checkpw(password.encode('utf-8'), 
                                 stored_hash.encode('utf-8'))
        
        return is_valid, "认证成功" if is_valid else "密码错误"

# 使用示例
auth_system = UserAuth()
auth_system.register_user("alice", "SecurePass123!", 12)
success, message = auth_system.authenticate_user("alice", "SecurePass123!")
print(f"认证: {success}, {message}")
```

### 密码更新系统
```python
def secure_password_update_example():
    """安全更新用户密码"""
    class PasswordManager:
        def __init__(self):
            self.current_hash = None
        
        def set_initial_password(self, password, work_factor=12):
            """设置初始密码"""
            self.current_hash = bcrypt.hashpw(
                password.encode('utf-8'), 
                bcrypt.gensalt(rounds=work_factor)
            ).decode('utf-8')
            return self.current_hash
        
        def update_password(self, old_password, new_password, work_factor=12):
            """验证后更新密码"""
            # 验证旧密码
            if not bcrypt.checkpw(old_password.encode('utf-8'), 
                                self.current_hash.encode('utf-8')):
                return False, "旧密码不正确"
            
            # 哈希新密码
            new_hash = bcrypt.hashpw(
                new_password.encode('utf-8'), 
                bcrypt.gensalt(rounds=work_factor)
            ).decode('utf-8')
            
            self.current_hash = new_hash
            return True, "密码更新成功"
    
    # 测试密码更新
    pm = PasswordManager()
    pm.set_initial_password("oldPassword123")
    success, message = pm.update_password("oldPassword123", "newPassword456")
    print(f"密码更新: {success}, {message}")
```

## 性能测试

### 基准测试不同工作因子
```python
import time

def benchmark_work_factors():
    """基准测试不同工作因子的bcrypt"""
    password = "benchmarkPassword"
    work_factors = [8, 10, 12, 14, 16]
    iterations = 5
    
    print("bcrypt工作因子基准测试:")
    print("-" * 40)
    
    for factor in work_factors:
        total_time = 0
        for _ in range(iterations):
            start_time = time.time()
            bcrypt.hashpw(password.encode('utf-8'), 
                         bcrypt.gensalt(rounds=factor))
            end_time = time.time()
            total_time += (end_time - start_time)
        
        avg_time = (total_time / iterations) * 1000
        print(f"工作因子 {factor:2d}: {avg_time:6.2f}ms 平均")
    
    print("-" * 40)

# 运行基准测试
benchmark_work_factors()
```

### 内存使用分析
```python
import psutil
import os

def memory_usage_example():
    """分析bcrypt操作期间的内存使用"""
    def get_memory_usage():
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / 1024 / 1024  # MB
    
    password = "memoryTestPassword"
    work_factor = 12
    
    print("内存使用分析:")
    print(f"初始内存: {get_memory_usage():.2f} MB")
    
    # 哈希密码
    start_memory = get_memory_usage()
    hashed = bcrypt.hashpw(password.encode('utf-8'), 
                          bcrypt.gensalt(rounds=work_factor))
    end_memory = get_memory_usage()
    
    print(f"哈希后: {end_memory:.2f} MB")
    print(f"内存增加: {end_memory - start_memory:.2f} MB")
    print(f"哈希结果: {hashed.decode('utf-8')[:30]}...")
```

## 错误处理

### 安全bcrypt操作
```python
def safe_bcrypt_operations():
    """带错误处理的安全bcrypt操作"""
    def safe_hash_password(password, work_factor=12):
        try:
            if not password:
                raise ValueError("密码不能为空")
            
            if work_factor < 4 or work_factor > 31:
                raise ValueError("工作因子必须在4到31之间")
            
            if len(password) > 72:  # bcrypt限制
                print("警告: 密码截断为72个字符")
                password = password[:72]
            
            hashed = bcrypt.hashpw(password.encode('utf-8'), 
                                 bcrypt.gensalt(rounds=work_factor))
            return hashed.decode('utf-8')
            
        except Exception as e:
            print(f"哈希密码时出错: {e}")
            return None
    
    def safe_verify_password(password, hashed_password):
        try:
            if not password or not hashed_password:
                return False
            
            return bcrypt.checkpw(password.encode('utf-8'), 
                                hashed_password.encode('utf-8'))
            
        except Exception as e:
            print(f"验证密码时出错: {e}")
            return False
    
    # 测试安全操作
    test_cases = [
        ("", 12),  # 空密码
        ("valid", 3),  # 工作因子太低
        ("valid", 32),  # 工作因子太高
        ("valid", 12),  # 有效情况
    ]
    
    for password, factor in test_cases:
        result = safe_hash_password(password, factor)
        print(f"密码: '{password}', 因子: {factor} -> {result}")
```

## JavaScript示例

### Node.js bcrypt实现
```javascript
const bcrypt = require('bcryptjs');

async function bcryptExamples() {
    console.log("JavaScript bcrypt示例:");
    
    // 基本哈希
    const password = "jsPassword123";
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    
    console.log(`密码: ${password}`);
    console.log(`哈希: ${hash}`);
    
    // 验证
    const isValid = await bcrypt.compare(password, hash);
    console.log(`有效: ${isValid}`);
    
    // 工作因子比较
    const factors = [10, 12, 14];
    for (const factor of factors) {
        const startTime = Date.now();
        await bcrypt.hash("test", factor);
        const duration = Date.now() - startTime;
        console.log(`因子 ${factor}: ${duration}ms`);
    }
}

// 运行JavaScript示例
bcryptExamples().catch(console.error);
```

### 浏览器bcrypt实现
```javascript
// 在浏览器中使用bcryptjs
async function browserBcryptExample() {
    // 从CDN加载bcryptjs
    const bcrypt = window.bcrypt;
    
    const password = "browserPassword";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log("浏览器bcrypt结果:", hash);
    
    const isValid = await bcrypt.compare(password, hash);
    console.log("浏览器验证:", isValid);
}
```

## 测试和验证

### 哈希验证测试
```python
def hash_verification_tests():
    """全面的哈希验证测试"""
    test_cases = [
        ("password123", "password123", True),
        ("password123", "password124", False),
        ("", "", True),
        ("unicode测试", "unicode测试", True),
        ("unicode测试", "unicode测试2", False),
    ]
    
    print("哈希验证测试:")
    print("-" * 40)
    
    for password, test_password, expected in test_cases:
        # 哈希原始密码
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # 测试验证
        result = bcrypt.checkpw(test_password.encode('utf-8'), hashed)
        
        status = "通过" if result == expected else "失败"
        print(f"{status}: '{password}' vs '{test_password}' -> {result} (期望 {expected})")

# 运行验证测试
hash_verification_tests()
```

### 性能回归测试
```python
def performance_regression_test():
    """测试bcrypt性能一致性"""
    password = "regressionTestPassword"
    work_factor = 10
    iterations = 10
    
    times = []
    for _ in range(iterations):
        start_time = time.time()
        bcrypt.hashpw(password.encode('utf-8'), 
                     bcrypt.gensalt(rounds=work_factor))
        end_time = time.time()
        times.append((end_time - start_time) * 1000)
    
    avg_time = sum(times) / len(times)
    max_time = max(times)
    min_time = min(times)
    
    print("性能回归测试:")
    print(f"平均时间: {avg_time:.2f}ms")
    print(f"最小时间: {min_time:.2f}ms")
    print(f"最大时间: {max_time:.2f}ms")
    print(f"方差: {max_time - min_time:.2f}ms")
    
    # 检查显著的性能下降
    if max_time > avg_time * 2:
        print("警告: 检测到显著的性能差异")

# 运行性能测试
performance_regression_test()
```

## 总结

这些示例演示了：
- 基本bcrypt哈希和验证
- 工作因子管理和基准测试
- 盐值生成和管理
- 密码验证和安全实践
- 用户认证系统
- 性能测试和优化
- 错误处理和安全操作
- JavaScript实现
- 全面的测试和验证

所有示例都遵循安全最佳实践，并为实际应用提供实用的实现。 