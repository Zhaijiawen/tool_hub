# Argon2 Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with Argon2 library support
- Understanding of password security principles
- Knowledge of memory-hard functions
- Awareness of Argon2 variants and parameter selection

### Library Selection

#### Python - argon2-cffi
```bash
# Install argon2-cffi library
pip install argon2-cffi
```

#### Node.js - argon2
```bash
# Install argon2 library
npm install argon2
```

#### PHP - password_hash
```bash
# Built-in password_hash function supports Argon2
# Requires PHP 7.2+ with Argon2 support
```

#### Java - Spring Security
```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
    <version>5.8.0</version>
</dependency>
```

## Basic Concepts

### Argon2 Variants
```python
from argon2 import PasswordHasher

def explain_argon2_variants():
    """Explain different Argon2 variants"""
    print("Argon2 Variants:")
    print("Argon2d: Data-dependent memory access, fastest but vulnerable to side-channel attacks")
    print("Argon2i: Data-independent memory access, resistant to side-channel attacks")
    print("Argon2id: Hybrid approach, recommended for most applications")
    
    # Security recommendations
    recommendations = {
        "Web Applications": "Argon2id",
        "High Security": "Argon2i", 
        "Performance Critical": "Argon2d",
        "General Use": "Argon2id"
    }
    
    return recommendations
```

### Parameter Selection Guide
```python
def parameter_selection_guide():
    """Guide for selecting Argon2 parameters"""
    print("Argon2 Parameter Selection:")
    print("Memory Cost (m): 64MB-1GB, determines memory usage")
    print("Time Cost (t): 1-10, determines CPU time")
    print("Parallelism (p): 1-4, number of parallel threads")
    
    # Parameter recommendations
    recommendations = {
        "Development": "m=65536, t=1, p=1",
        "Production": "m=131072, t=3, p=1", 
        "High Security": "m=262144, t=5, p=1",
        "Maximum Security": "m=524288, t=10, p=1"
    }
    
    return recommendations
```

## Basic Password Operations

### Simple Password Hashing
```python
from argon2 import PasswordHasher

def basic_hash_example():
    """Basic Argon2 password hashing example"""
    ph = PasswordHasher()
    password = "mySecurePassword123"
    
    # Hash password with default parameters
    hashed = ph.hash(password)
    print(f"Password: {password}")
    print(f"Hashed: {hashed}")
    
    # Verify password
    try:
        ph.verify(hashed, password)
        print("Password verification: True")
    except Exception as e:
        print(f"Password verification failed: {e}")
    
    return hashed

# Run example
basic_hash_example()
```

### Custom Parameters
```python
def custom_parameters_example():
    """Example with custom Argon2 parameters"""
    # Create hasher with custom parameters
    ph = PasswordHasher(
        time_cost=3,      # Number of iterations
        memory_cost=65536, # Memory usage in KiB (64MB)
        parallelism=1,    # Number of parallel threads
        hash_len=32,      # Hash length in bytes
        salt_len=16       # Salt length in bytes
    )
    
    password = "adminPassword456"
    hashed = ph.hash(password)
    
    print(f"Password: {password}")
    print(f"Custom parameters: time_cost=3, memory_cost=65536, parallelism=1")
    print(f"Hashed: {hashed}")
    
    return hashed
```

## Advanced Usage

### Parameter Benchmarking
```python
import time

def benchmark_parameters():
    """Benchmark different Argon2 parameters"""
    password = "benchmarkPassword"
    test_cases = [
        {"time_cost": 1, "memory_cost": 32768, "parallelism": 1},
        {"time_cost": 2, "memory_cost": 65536, "parallelism": 1},
        {"time_cost": 3, "memory_cost": 131072, "parallelism": 1},
        {"time_cost": 4, "memory_cost": 262144, "parallelism": 1}
    ]
    
    print("Argon2 Parameter Benchmark:")
    print("-" * 50)
    
    for params in test_cases:
        ph = PasswordHasher(**params)
        
        start_time = time.time()
        hashed = ph.hash(password)
        end_time = time.time()
        
        duration = (end_time - start_time) * 1000
        memory_mb = params["memory_cost"] / 1024
        
        print(f"Time: {params['time_cost']}, Memory: {memory_mb}MB, "
              f"Parallelism: {params['parallelism']} -> {duration:.2f}ms")
    
    print("-" * 50)
```

### Memory Usage Analysis
```python
import psutil
import os

def memory_usage_analysis():
    """Analyze memory usage during Argon2 operations"""
    def get_memory_usage():
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / 1024 / 1024  # MB
    
    password = "memoryTestPassword"
    memory_costs = [32768, 65536, 131072, 262144]  # 32MB, 64MB, 128MB, 256MB
    
    print("Argon2 Memory Usage Analysis:")
    print("-" * 40)
    
    for memory_cost in memory_costs:
        ph = PasswordHasher(memory_cost=memory_cost, time_cost=1)
        
        initial_memory = get_memory_usage()
        hashed = ph.hash(password)
        peak_memory = get_memory_usage()
        
        memory_used = peak_memory - initial_memory
        print(f"Memory Cost: {memory_cost/1024}MB, "
              f"Peak Usage: {peak_memory:.1f}MB, "
              f"Additional: {memory_used:.1f}MB")
```

## Security Best Practices

### Parameter Selection
```python
def secure_parameter_selection():
    """Select secure parameters based on use case"""
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
            raise ValueError("Invalid use case")
    
    # Test different use cases
    use_cases = ["development", "production", "high_security", "maximum_security"]
    
    for use_case in use_cases:
        params = get_secure_params(use_case)
        ph = PasswordHasher(**params)
        
        start_time = time.time()
        hashed = ph.hash("testPassword")
        duration = (time.time() - start_time) * 1000
        
        print(f"{use_case}: {duration:.2f}ms, "
              f"Memory: {params['memory_cost']/1024}MB")
```

### Hash Verification
```python
def secure_verification_example():
    """Secure password verification with error handling"""
    ph = PasswordHasher()
    password = "securePassword123"
    
    # Hash password
    hashed = ph.hash(password)
    
    # Correct verification
    try:
        is_valid = ph.verify(hashed, password)
        print(f"Correct password verification: {is_valid}")
    except Exception as e:
        print(f"Verification error: {e}")
    
    # Incorrect password
    try:
        is_valid = ph.verify(hashed, "wrongPassword")
        print(f"Incorrect password verification: {is_valid}")
    except Exception as e:
        print(f"Expected verification failure: {e}")
    
    # Invalid hash format
    try:
        is_valid = ph.verify("invalid_hash", password)
        print(f"Invalid hash verification: {is_valid}")
    except Exception as e:
        print(f"Expected hash format error: {e}")
```

## Error Handling

### Safe Argon2 Operations
```python
def safe_argon2_operations():
    """Safe Argon2 operations with error handling"""
    def safe_hash_password(password, **params):
        try:
            if not password:
                raise ValueError("Password cannot be empty")
            
            # Validate parameters
            if params.get("time_cost", 1) < 1 or params.get("time_cost", 1) > 10:
                raise ValueError("Time cost must be between 1 and 10")
            
            if params.get("memory_cost", 32768) < 8192:
                raise ValueError("Memory cost must be at least 8192 KiB")
            
            if params.get("parallelism", 1) < 1 or params.get("parallelism", 1) > 4:
                raise ValueError("Parallelism must be between 1 and 4")
            
            ph = PasswordHasher(**params)
            return ph.hash(password)
            
        except Exception as e:
            print(f"Error hashing password: {e}")
            return None
    
    def safe_verify_password(password, hashed):
        try:
            if not password or not hashed:
                return False
            
            ph = PasswordHasher()
            ph.verify(hashed, password)
            return True
            
        except Exception as e:
            print(f"Error verifying password: {e}")
            return False
    
    # Test safe operations
    test_cases = [
        ("", {}),  # Empty password
        ("valid", {"time_cost": 0}),  # Invalid time cost
        ("valid", {"memory_cost": 4096}),  # Too low memory cost
        ("valid", {"parallelism": 8}),  # Too high parallelism
        ("valid", {})  # Valid case
    ]
    
    for password, params in test_cases:
        result = safe_hash_password(password, **params)
        print(f"Password: '{password}', Params: {params} -> {result is not None}")
```

## Performance Optimization

### Adaptive Parameter Selection
```python
def adaptive_parameter_selection():
    """Select parameters based on system performance"""
    def find_optimal_params(target_time=1.0):
        """Find optimal parameters for target execution time"""
        password = "testPassword"
        base_params = {"memory_cost": 65536, "parallelism": 1}
        
        # Test different time costs
        for time_cost in range(1, 11):
            params = {**base_params, "time_cost": time_cost}
            ph = PasswordHasher(**params)
            
            start_time = time.time()
            ph.hash(password)
            duration = time.time() - start_time
            
            if duration >= target_time:
                return params
        
        return base_params
    
    # Find parameters for different target times
    target_times = [0.5, 1.0, 2.0, 5.0]
    
    print("Adaptive Parameter Selection:")
    for target_time in target_times:
        params = find_optimal_params(target_time)
        print(f"Target: {target_time}s -> Time: {params['time_cost']}, "
              f"Memory: {params['memory_cost']/1024}MB")
```

### Parallel Processing
```python
def parallel_processing_example():
    """Demonstrate parallel processing with Argon2"""
    import concurrent.futures
    
    def hash_password_parallel(password, params):
        """Hash password with specific parameters"""
        ph = PasswordHasher(**params)
        return ph.hash(password)
    
    passwords = ["password1", "password2", "password3", "password4"]
    params = {"time_cost": 2, "memory_cost": 65536, "parallelism": 1}
    
    print("Parallel Password Hashing:")
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
                print(f"Error: {e}")
    
    total_time = time.time() - start_time
    print(f"Total time: {total_time:.2f}s for {len(passwords)} passwords")
```

## Testing and Validation

### Hash Verification Tests
```python
def hash_verification_tests():
    """Comprehensive hash verification tests"""
    ph = PasswordHasher()
    test_cases = [
        ("password123", "password123", True),
        ("password123", "password124", False),
        ("", "", True),
        ("unicode测试", "unicode测试", True),
        ("unicode测试", "unicode测试2", False),
    ]
    
    print("Argon2 Hash Verification Tests:")
    print("-" * 50)
    
    for password, test_password, expected in test_cases:
        try:
            hashed = ph.hash(password)
            is_valid = ph.verify(hashed, test_password)
            
            status = "PASS" if is_valid == expected else "FAIL"
            print(f"{status}: '{password}' vs '{test_password}' -> {is_valid}")
            
        except Exception as e:
            print(f"ERROR: {e}")

# Run verification tests
hash_verification_tests()
```

### Performance Regression Test
```python
def performance_regression_test():
    """Test Argon2 performance consistency"""
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
    
    print("Argon2 Performance Regression Test:")
    print(f"Average time: {avg_time:.2f}ms")
    print(f"Min time: {min_time:.2f}ms")
    print(f"Max time: {max_time:.2f}ms")
    print(f"Variance: {max_time - min_time:.2f}ms")
    
    # Check for significant performance degradation
    if max_time > avg_time * 2:
        print("WARNING: Significant performance variance detected")

# Run performance test
performance_regression_test()
```

## Summary

This tutorial covers:
- Environment setup for different programming languages
- Basic password hashing and verification
- Parameter selection and optimization
- Security best practices and validation
- Error handling and performance optimization
- Testing and validation techniques

All examples follow security best practices and use appropriate parameters for their intended purposes. 