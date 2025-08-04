# Argon2 代码示例

## 基本哈希操作

### 简单密码哈希
```python
from argon2 import PasswordHasher

def basic_hash_example():
    """基本Argon2密码哈希示例"""
    ph = PasswordHasher()
    password = "mySecurePassword123"
    
    # 使用默认参数哈希密码
    hashed = ph.hash(password)
    print(f"原始密码: {password}")
    print(f"哈希密码: {hashed}")
    
    # 验证密码
    try:
        ph.verify(hashed, password)
        print("密码验证: True")
    except Exception as e:
        print(f"密码验证失败: {e}")
    
    return hashed

# 运行示例
basic_hash_example()
```

### 自定义参数
```python
def custom_parameters_example():
    """自定义Argon2参数示例"""
    ph = PasswordHasher(
        time_cost=3,      # 迭代次数
        memory_cost=65536, # 内存使用量(KiB) (64MB)
        parallelism=1,    # 并行线程数
        hash_len=32,      # 哈希长度(字节)
        salt_len=16       # 盐值长度(字节)
    )
    
    password = "adminPassword456"
    hashed = ph.hash(password)
    
    print(f"密码: {password}")
    print(f"自定义参数: time_cost=3, memory_cost=65536, parallelism=1")
    print(f"哈希: {hashed}")
    
    return hashed
```

## 高级用法

### 参数基准测试
```python
import time

def benchmark_parameters():
    """基准测试不同Argon2参数"""
    password = "benchmarkPassword"
    test_cases = [
        {"time_cost": 1, "memory_cost": 32768, "parallelism": 1},
        {"time_cost": 2, "memory_cost": 65536, "parallelism": 1},
        {"time_cost": 3, "memory_cost": 131072, "parallelism": 1},
        {"time_cost": 4, "memory_cost": 262144, "parallelism": 1}
    ]
    
    print("Argon2参数基准测试:")
    print("-" * 50)
    
    for params in test_cases:
        ph = PasswordHasher(**params)
        
        start_time = time.time()
        hashed = ph.hash(password)
        end_time = time.time()
        
        duration = (end_time - start_time) * 1000
        memory_mb = params["memory_cost"] / 1024
        
        print(f"时间: {params['time_cost']}, 内存: {memory_mb}MB, "
              f"并行度: {params['parallelism']} -> {duration:.2f}ms")
    
    print("-" * 50)

# 运行基准测试
benchmark_parameters()
```

### 内存使用分析
```python
import psutil
import os

def memory_usage_analysis():
    """分析Argon2操作期间的内存使用"""
    def get_memory_usage():
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / 1024 / 1024  # MB
    
    password = "memoryTestPassword"
    memory_costs = [32768, 65536, 131072, 262144]  # 32MB, 64MB, 128MB, 256MB
    
    print("Argon2内存使用分析:")
    print("-" * 40)
    
    for memory_cost in memory_costs:
        ph = PasswordHasher(memory_cost=memory_cost, time_cost=1)
        
        initial_memory = get_memory_usage()
        hashed = ph.hash(password)
        peak_memory = get_memory_usage()
        
        memory_used = peak_memory - initial_memory
        print(f"内存成本: {memory_cost/1024}MB, "
              f"峰值使用: {peak_memory:.1f}MB, "
              f"额外使用: {memory_used:.1f}MB")
```

## 安全应用

### 用户认证系统
```python
class UserAuth:
    def __init__(self):
        self.users = {}  # 实际应用中，使用数据库
    
    def register_user(self, username, password, **params):
        """使用Argon2哈希密码注册新用户"""
        if username in self.users:
            return False, "用户名已存在"
        
        # 使用Argon2哈希密码
        ph = PasswordHasher(**params)
        hashed = ph.hash(password)
        
        self.users[username] = {
            'password_hash': hashed,
            'params': params
        }
        return True, "用户注册成功"
    
    def authenticate_user(self, username, password):
        """使用Argon2验证用户"""
        if username not in self.users:
            return False, "用户不存在"
        
        stored_hash = self.users[username]['password_hash']
        ph = PasswordHasher()
        
        try:
            ph.verify(stored_hash, password)
            return True, "认证成功"
        except Exception:
            return False, "密码错误"

# 使用示例
auth_system = UserAuth()
auth_system.register_user("alice", "SecurePass123!", 
                         time_cost=3, memory_cost=65536)
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
            self.params = {"time_cost": 3, "memory_cost": 65536}
        
        def set_initial_password(self, password):
            """设置初始密码"""
            ph = PasswordHasher(**self.params)
            self.current_hash = ph.hash(password)
            return self.current_hash
        
        def update_password(self, old_password, new_password):
            """验证后更新密码"""
            ph = PasswordHasher()
            
            # 验证旧密码
            try:
                ph.verify(self.current_hash, old_password)
            except Exception:
                return False, "旧密码错误"
            
            # 哈希新密码
            ph_new = PasswordHasher(**self.params)
            new_hash = ph_new.hash(new_password)
            
            self.current_hash = new_hash
            return True, "密码更新成功"
    
    # 测试密码更新
    pm = PasswordManager()
    pm.set_initial_password("oldPassword123")
    success, message = pm.update_password("oldPassword123", "newPassword456")
    print(f"密码更新: {success}, {message}")
```

## 性能测试

### 参数优化
```python
def parameter_optimization():
    """为目标性能找到最佳参数"""
    def find_optimal_params(target_time=1.0, max_memory=256):
        """为目标执行时间找到最佳参数"""
        password = "testPassword"
        base_params = {"parallelism": 1}
        
        # 测试不同组合
        for time_cost in range(1, 6):
            for memory_cost in [32768, 65536, 131072, 262144]:
                if memory_cost / 1024 > max_memory:
                    continue
                
                params = {**base_params, "time_cost": time_cost, 
                         "memory_cost": memory_cost}
                ph = PasswordHasher(**params)
                
                start_time = time.time()
                ph.hash(password)
                duration = time.time() - start_time
                
                if duration >= target_time:
                    return params
        
        return {"time_cost": 1, "memory_cost": 65536, "parallelism": 1}
    
    # 为不同目标找到参数
    targets = [(0.5, 128), (1.0, 256), (2.0, 512)]
    
    print("参数优化:")
    for target_time, max_memory in targets:
        params = find_optimal_params(target_time, max_memory)
        print(f"目标: {target_time}s, 最大: {max_memory}MB -> "
              f"时间: {params['time_cost']}, 内存: {params['memory_cost']/1024}MB")
```

### 内存与时间权衡
```python
def memory_time_tradeoff():
    """分析内存与时间权衡"""
    password = "tradeoffPassword"
    test_configs = [
        {"time_cost": 1, "memory_cost": 131072},  # 高内存，低时间
        {"time_cost": 3, "memory_cost": 65536},   # 中等两者
        {"time_cost": 5, "memory_cost": 32768},   # 低内存，高时间
    ]
    
    print("内存与时间权衡分析:")
    print("-" * 50)
    
    for config in test_configs:
        ph = PasswordHasher(**config)
        
        start_time = time.time()
        hashed = ph.hash(password)
        duration = time.time() - start_time
        
        memory_mb = config["memory_cost"] / 1024
        print(f"时间: {config['time_cost']}, 内存: {memory_mb}MB -> "
              f"{duration:.3f}s")
    
    print("-" * 50)
```

## 错误处理

### 安全Argon2操作
```python
def safe_argon2_operations():
    """带错误处理的安全Argon2操作"""
    def safe_hash_password(password, **params):
        try:
            if not password:
                raise ValueError("密码不能为空")
            
            # 验证参数
            if params.get("time_cost", 1) < 1 or params.get("time_cost", 1) > 10:
                raise ValueError("时间成本必须在1到10之间")
            
            if params.get("memory_cost", 32768) < 8192:
                raise ValueError("内存成本必须至少8192 KiB")
            
            if params.get("parallelism", 1) < 1 or params.get("parallelism", 1) > 4:
                raise ValueError("并行度必须在1到4之间")
            
            ph = PasswordHasher(**params)
            return ph.hash(password)
            
        except Exception as e:
            print(f"哈希密码时出错: {e}")
            return None
    
    def safe_verify_password(password, hashed):
        try:
            if not password or not hashed:
                return False
            
            ph = PasswordHasher()
            ph.verify(hashed, password)
            return True
            
        except Exception as e:
            print(f"验证密码时出错: {e}")
            return False
    
    # 测试安全操作
    test_cases = [
        ("", {}),  # 空密码
        ("valid", {"time_cost": 0}),  # 无效时间成本
        ("valid", {"memory_cost": 4096}),  # 内存成本太低
        ("valid", {"parallelism": 8}),  # 并行度太高
        ("valid", {})  # 有效情况
    ]
    
    for password, params in test_cases:
        result = safe_hash_password(password, **params)
        print(f"密码: '{password}', 参数: {params} -> {result is not None}")
```

## JavaScript示例

### Node.js Argon2实现
```javascript
const argon2 = require('argon2');

async function argon2Examples() {
    console.log("JavaScript Argon2示例:");
    
    // 基本哈希
    const password = "jsPassword123";
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        timeCost: 3,
        memoryCost: 65536,
        parallelism: 1
    });
    
    console.log(`密码: ${password}`);
    console.log(`哈希: ${hash}`);
    
    // 验证
    const isValid = await argon2.verify(hash, password);
    console.log(`有效: ${isValid}`);
    
    // 参数比较
    const configs = [
        {timeCost: 1, memoryCost: 32768},
        {timeCost: 2, memoryCost: 65536},
        {timeCost: 3, memoryCost: 131072}
    ];
    
    for (const config of configs) {
        const startTime = Date.now();
        await argon2.hash("test", config);
        const duration = Date.now() - startTime;
        console.log(`配置: ${JSON.stringify(config)} -> ${duration}ms`);
    }
}

// 运行JavaScript示例
argon2Examples().catch(console.error);
```

### 浏览器Argon2实现
```javascript
// 在浏览器中使用argon2-browser
async function browserArgon2Example() {
    // 从CDN加载argon2-browser
    const argon2 = window.argon2;
    
    const password = "browserPassword";
    const hash = await argon2.hash({
        pass: password,
        salt: "somesalt",
        time: 3,
        mem: 65536,
        parallelism: 1,
        hashLen: 32,
        type: argon2.ArgonType.Argon2id
    });
    
    console.log("浏览器Argon2结果:", hash.encoded);
    
    const isValid = await argon2.verify({
        pass: password,
        encoded: hash.encoded
    });
    console.log("浏览器验证:", isValid);
}
```

## 测试和验证

### 哈希验证测试
```python
def hash_verification_tests():
    """全面的哈希验证测试"""
    ph = PasswordHasher()
    test_cases = [
        ("password123", "password123", True),
        ("password123", "password124", False),
        ("", "", True),
        ("unicode测试", "unicode测试", True),
        ("unicode测试", "unicode测试2", False),
    ]
    
    print("Argon2哈希验证测试:")
    print("-" * 50)
    
    for password, test_password, expected in test_cases:
        try:
            hashed = ph.hash(password)
            is_valid = ph.verify(hashed, test_password)
            
            status = "通过" if is_valid == expected else "失败"
            print(f"{status}: '{password}' vs '{test_password}' -> {is_valid}")
            
        except Exception as e:
            print(f"错误: {e}")

# 运行验证测试
hash_verification_tests()
```

### 性能回归测试
```python
def performance_regression_test():
    """测试Argon2性能一致性"""
    password = "regressionTestPassword"
    params = {"time_cost": 2, "memory_cost": 65536, "parallelism": 1}
    iterations = 10
    
    ph = PasswordHasher(**params)
    times = []
    
    for _ in range(iterations):
        start_time = time.time()
        ph.hash(password)
        end_time = time.time()
        times.append((end_time - start_time) * 1000)
    
    avg_time = sum(times) / len(times)
    max_time = max(times)
    min_time = min(times)
    
    print("Argon2性能回归测试:")
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
- 基本Argon2哈希和验证
- 参数选择和优化
- 内存使用分析和基准测试
- 用户认证系统
- 性能测试和优化
- 错误处理和安全操作
- JavaScript实现
- 全面的测试和验证

所有示例都遵循安全最佳实践，并为实际应用提供实用的实现。 