# Argon2 使用教程

## 环境设置

### 前置条件
- 具有Argon2库支持的编程语言
- 理解密码安全原理
- 内存密集型函数知识
- 了解Argon2变体和参数选择

### 库选择

#### Python - argon2-cffi
```bash
# 安装argon2-cffi库
pip install argon2-cffi
```

#### Node.js - argon2
```bash
# 安装argon2库
npm install argon2
```

#### PHP - password_hash
```bash
# 内置password_hash函数支持Argon2
# 需要PHP 7.2+并支持Argon2
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

### Argon2变体
```python
from argon2 import PasswordHasher

def explain_argon2_variants():
    """解释不同的Argon2变体"""
    print("Argon2变体:")
    print("Argon2d: 数据相关内存访问，最快但易受侧信道攻击")
    print("Argon2i: 数据无关内存访问，抵抗侧信道攻击")
    print("Argon2id: 混合方法，推荐用于大多数应用")
    
    # 安全建议
    recommendations = {
        "Web应用程序": "Argon2id",
        "高安全性": "Argon2i", 
        "性能关键": "Argon2d",
        "一般用途": "Argon2id"
    }
    
    return recommendations
```

### 参数选择指南
```python
def parameter_selection_guide():
    """Argon2参数选择指南"""
    print("Argon2参数选择:")
    print("内存成本(m): 64MB-1GB，决定内存使用量")
    print("时间成本(t): 1-10，决定CPU时间")
    print("并行度(p): 1-4，并行线程数")
    
    # 参数建议
    recommendations = {
        "开发环境": "m=65536, t=1, p=1",
        "生产环境": "m=131072, t=3, p=1", 
        "高安全性": "m=262144, t=5, p=1",
        "最高安全性": "m=524288, t=10, p=1"
    }
    
    return recommendations
```

## 基本密码操作

### 简单密码哈希
```python
from argon2 import PasswordHasher

def basic_hash_example():
    """基本Argon2密码哈希示例"""
    ph = PasswordHasher()
    password = "mySecurePassword123"
    
    # 使用默认参数哈希密码
    hashed = ph.hash(password)
    print(f"密码: {password}")
    print(f"哈希: {hashed}")
    
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
    # 使用自定义参数创建哈希器
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

## 安全最佳实践

### 参数选择
```python
def secure_parameter_selection():
    """根据用例选择安全参数"""
    def get_secure_params(use_case):
        if use_case == "development":
            return {"time_cost": 1, "memory_cost": 32768, "parallelism": 1}
        elif use_case == "production":
            return {"time_cost": 3, "memory_cost": 131072, "parallelism": 1}
        elif use_case == "high_security":
            return {"time_cost": 5, "memory_cost": 262144, "parallelism": 1}
        elif use_case == "maximum_security":
            return {"time_cost": 10, "memory_cost": 524288, "parallelism": 1}
        else:
            raise ValueError("无效用例")
    
    # 测试不同用例
    use_cases = ["development", "production", "high_security", "maximum_security"]
    
    for use_case in use_cases:
        params = get_secure_params(use_case)
        ph = PasswordHasher(**params)
        
        start_time = time.time()
        hashed = ph.hash("testPassword")
        duration = (time.time() - start_time) * 1000
        
        print(f"{use_case}: {duration:.2f}ms, "
              f"内存: {params['memory_cost']/1024}MB")
```

### 哈希验证
```python
def secure_verification_example():
    """带错误处理的安全密码验证"""
    ph = PasswordHasher()
    password = "securePassword123"
    
    # 哈希密码
    hashed = ph.hash(password)
    
    # 正确验证
    try:
        is_valid = ph.verify(hashed, password)
        print(f"正确密码验证: {is_valid}")
    except Exception as e:
        print(f"验证错误: {e}")
    
    # 错误密码
    try:
        is_valid = ph.verify(hashed, "wrongPassword")
        print(f"错误密码验证: {is_valid}")
    except Exception as e:
        print(f"预期的验证失败: {e}")
    
    # 无效哈希格式
    try:
        is_valid = ph.verify("invalid_hash", password)
        print(f"无效哈希验证: {is_valid}")
    except Exception as e:
        print(f"预期的哈希格式错误: {e}")
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

## 性能优化

### 自适应参数选择
```python
def adaptive_parameter_selection():
    """根据系统性能选择参数"""
    def find_optimal_params(target_time=1.0):
        """为目标执行时间找到最佳参数"""
        password = "testPassword"
        base_params = {"memory_cost": 65536, "parallelism": 1}
        
        # 测试不同时间成本
        for time_cost in range(1, 11):
            params = {**base_params, "time_cost": time_cost}
            ph = PasswordHasher(**params)
            
            start_time = time.time()
            ph.hash(password)
            duration = time.time() - start_time
            
            if duration >= target_time:
                return params
        
        return base_params
    
    # 为不同目标时间找到参数
    target_times = [0.5, 1.0, 2.0, 5.0]
    
    print("自适应参数选择:")
    for target_time in target_times:
        params = find_optimal_params(target_time)
        print(f"目标: {target_time}s -> 时间: {params['time_cost']}, "
              f"内存: {params['memory_cost']/1024}MB")
```

### 并行处理
```python
def parallel_processing_example():
    """演示Argon2的并行处理"""
    import concurrent.futures
    
    def hash_password_parallel(password, params):
        """使用特定参数哈希密码"""
        ph = PasswordHasher(**params)
        return ph.hash(password)
    
    passwords = ["password1", "password2", "password3", "password4"]
    params = {"time_cost": 2, "memory_cost": 65536, "parallelism": 1}
    
    print("并行密码哈希:")
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [
            executor.submit(hash_password_parallel, password, params)
            for password in passwords
        ]
        
        results = []
        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                print(f"错误: {e}")
    
    total_time = time.time() - start_time
    print(f"总时间: {total_time:.2f}s，处理{len(passwords)}个密码")
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

本教程涵盖：
- 不同编程语言的环境设置
- 基本密码哈希和验证
- 参数选择和优化
- 安全最佳实践和验证
- 错误处理和性能优化
- 测试和验证技术

所有示例都遵循安全最佳实践，并为其预期用途使用适当的参数。 