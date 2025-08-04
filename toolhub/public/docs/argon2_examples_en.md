# Argon2 Code Examples

## Basic Hash Operations

### Simple Password Hashing
```python
from argon2 import PasswordHasher

def basic_hash_example():
    """Basic Argon2 password hashing example"""
    ph = PasswordHasher()
    password = "mySecurePassword123"
    
    # Hash password with default parameters
    hashed = ph.hash(password)
    print(f"Original password: {password}")
    print(f"Hashed password: {hashed}")
    
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

# Run benchmark
benchmark_parameters()
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

## Security Applications

### User Authentication System
```python
class UserAuth:
    def __init__(self):
        self.users = {}  # In real app, use database
    
    def register_user(self, username, password, **params):
        """Register new user with Argon2 hashed password"""
        if username in self.users:
            return False, "Username already exists"
        
        # Hash password with Argon2
        ph = PasswordHasher(**params)
        hashed = ph.hash(password)
        
        self.users[username] = {
            'password_hash': hashed,
            'params': params
        }
        return True, "User registered successfully"
    
    def authenticate_user(self, username, password):
        """Authenticate user with Argon2 verification"""
        if username not in self.users:
            return False, "User not found"
        
        stored_hash = self.users[username]['password_hash']
        ph = PasswordHasher()
        
        try:
            ph.verify(stored_hash, password)
            return True, "Authentication successful"
        except Exception:
            return False, "Invalid password"

# Usage example
auth_system = UserAuth()
auth_system.register_user("alice", "SecurePass123!", 
                         time_cost=3, memory_cost=65536)
success, message = auth_system.authenticate_user("alice", "SecurePass123!")
print(f"Authentication: {success}, {message}")
```

### Password Update System
```python
def secure_password_update_example():
    """Securely update user password"""
    class PasswordManager:
        def __init__(self):
            self.current_hash = None
            self.params = {"time_cost": 3, "memory_cost": 65536}
        
        def set_initial_password(self, password):
            """Set initial password"""
            ph = PasswordHasher(**self.params)
            self.current_hash = ph.hash(password)
            return self.current_hash
        
        def update_password(self, old_password, new_password):
            """Update password with verification"""
            ph = PasswordHasher()
            
            # Verify old password
            try:
                ph.verify(self.current_hash, old_password)
            except Exception:
                return False, "Old password incorrect"
            
            # Hash new password
            ph_new = PasswordHasher(**self.params)
            new_hash = ph_new.hash(new_password)
            
            self.current_hash = new_hash
            return True, "Password updated successfully"
    
    # Test password update
    pm = PasswordManager()
    pm.set_initial_password("oldPassword123")
    success, message = pm.update_password("oldPassword123", "newPassword456")
    print(f"Password update: {success}, {message}")
```

## Performance Testing

### Parameter Optimization
```python
def parameter_optimization():
    """Find optimal parameters for target performance"""
    def find_optimal_params(target_time=1.0, max_memory=256):
        """Find optimal parameters for target execution time"""
        password = "testPassword"
        base_params = {"parallelism": 1}
        
        # Test different combinations
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
    
    # Find parameters for different targets
    targets = [(0.5, 128), (1.0, 256), (2.0, 512)]
    
    print("Parameter Optimization:")
    for target_time, max_memory in targets:
        params = find_optimal_params(target_time, max_memory)
        print(f"Target: {target_time}s, Max: {max_memory}MB -> "
              f"Time: {params['time_cost']}, Memory: {params['memory_cost']/1024}MB")
```

### Memory vs Time Trade-off
```python
def memory_time_tradeoff():
    """Analyze memory vs time trade-off"""
    password = "tradeoffPassword"
    test_configs = [
        {"time_cost": 1, "memory_cost": 131072},  # High memory, low time
        {"time_cost": 3, "memory_cost": 65536},   # Medium both
        {"time_cost": 5, "memory_cost": 32768},   # Low memory, high time
    ]
    
    print("Memory vs Time Trade-off Analysis:")
    print("-" * 50)
    
    for config in test_configs:
        ph = PasswordHasher(**config)
        
        start_time = time.time()
        hashed = ph.hash(password)
        duration = time.time() - start_time
        
        memory_mb = config["memory_cost"] / 1024
        print(f"Time: {config['time_cost']}, Memory: {memory_mb}MB -> "
              f"{duration:.3f}s")
    
    print("-" * 50)
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

## JavaScript Examples

### Node.js Argon2 Implementation
```javascript
const argon2 = require('argon2');

async function argon2Examples() {
    console.log("JavaScript Argon2 Examples:");
    
    // Basic hashing
    const password = "jsPassword123";
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        timeCost: 3,
        memoryCost: 65536,
        parallelism: 1
    });
    
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    
    // Verification
    const isValid = await argon2.verify(hash, password);
    console.log(`Valid: ${isValid}`);
    
    // Parameter comparison
    const configs = [
        {timeCost: 1, memoryCost: 32768},
        {timeCost: 2, memoryCost: 65536},
        {timeCost: 3, memoryCost: 131072}
    ];
    
    for (const config of configs) {
        const startTime = Date.now();
        await argon2.hash("test", config);
        const duration = Date.now() - startTime;
        console.log(`Config: ${JSON.stringify(config)} -> ${duration}ms`);
    }
}

// Run JavaScript examples
argon2Examples().catch(console.error);
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

These examples demonstrate:
- Basic Argon2 hashing and verification
- Parameter selection and optimization
- Memory usage analysis and benchmarking
- User authentication systems
- Performance testing and optimization
- Error handling and safe operations
- JavaScript implementations
- Comprehensive testing and validation

All examples follow security best practices and provide practical implementations for real-world applications. 