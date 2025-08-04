# bcrypt Code Examples

## Basic Hash Operations

### Simple Password Hashing
```python
import bcrypt

def basic_hash_example():
    """Basic bcrypt password hashing example"""
    password = "mySecurePassword123"
    
    # Hash password with default work factor (12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    print(f"Original password: {password}")
    print(f"Hashed password: {hashed.decode('utf-8')}")
    
    # Verify password
    is_valid = bcrypt.checkpw(password.encode('utf-8'), hashed)
    print(f"Password verification: {is_valid}")
    
    return hashed

# Run example
basic_hash_example()
```

### Custom Work Factor
```python
import time

def custom_work_factor_example():
    """Example with custom work factor"""
    password = "adminPassword456"
    work_factor = 14  # Higher security
    
    # Generate salt with custom work factor
    salt = bcrypt.gensalt(rounds=work_factor)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    print(f"Password: {password}")
    print(f"Work factor: {work_factor}")
    print(f"Hashed: {hashed.decode('utf-8')}")
    
    return hashed

# Test different work factors
def work_factor_comparison():
    """Compare different work factors"""
    password = "testPassword"
    factors = [10, 12, 14, 16]
    
    for factor in factors:
        start_time = time.time()
        salt = bcrypt.gensalt(rounds=factor)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        end_time = time.time()
        
        duration = (end_time - start_time) * 1000
        print(f"Work factor {factor}: {duration:.2f}ms")
```

## Advanced Usage

### Salt Management
```python
def salt_management_example():
    """Demonstrate salt management"""
    password = "userPassword789"
    
    # Generate salt manually
    salt1 = bcrypt.gensalt(rounds=12)
    salt2 = bcrypt.gensalt(rounds=12)
    
    # Hash same password with different salts
    hash1 = bcrypt.hashpw(password.encode('utf-8'), salt1)
    hash2 = bcrypt.hashpw(password.encode('utf-8'), salt2)
    
    print(f"Password: {password}")
    print(f"Hash 1: {hash1.decode('utf-8')}")
    print(f"Hash 2: {hash2.decode('utf-8')}")
    print(f"Hashes different: {hash1 != hash2}")
    
    # Both should verify correctly
    valid1 = bcrypt.checkpw(password.encode('utf-8'), hash1)
    valid2 = bcrypt.checkpw(password.encode('utf-8'), hash2)
    print(f"Both valid: {valid1 and valid2}")

def extract_salt_example():
    """Extract salt from existing hash"""
    password = "examplePassword"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Extract salt (first 29 characters)
    salt = hashed[:29]
    print(f"Original hash: {hashed.decode('utf-8')}")
    print(f"Extracted salt: {salt.decode('utf-8')}")
    
    # Use extracted salt for new password
    new_password = "newPassword123"
    new_hash = bcrypt.hashpw(new_password.encode('utf-8'), salt)
    print(f"New hash with same salt: {new_hash.decode('utf-8')}")
```

### Password Validation
```python
import re

def password_validation_example():
    """Validate password strength before hashing"""
    def validate_password(password):
        if len(password) < 8:
            return False, "Too short"
        if not re.search(r"[A-Z]", password):
            return False, "No uppercase"
        if not re.search(r"[a-z]", password):
            return False, "No lowercase"
        if not re.search(r"\d", password):
            return False, "No digit"
        if not re.search(r"[!@#$%^&*]", password):
            return False, "No special char"
        return True, "Valid"
    
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

## Security Applications

### User Authentication System
```python
class UserAuth:
    def __init__(self):
        self.users = {}  # In real app, use database
    
    def register_user(self, username, password, work_factor=12):
        """Register new user with bcrypt hashed password"""
        if username in self.users:
            return False, "Username already exists"
        
        # Hash password
        hashed = bcrypt.hashpw(password.encode('utf-8'), 
                              bcrypt.gensalt(rounds=work_factor))
        
        self.users[username] = {
            'password_hash': hashed.decode('utf-8'),
            'work_factor': work_factor
        }
        return True, "User registered successfully"
    
    def authenticate_user(self, username, password):
        """Authenticate user with bcrypt verification"""
        if username not in self.users:
            return False, "User not found"
        
        stored_hash = self.users[username]['password_hash']
        is_valid = bcrypt.checkpw(password.encode('utf-8'), 
                                 stored_hash.encode('utf-8'))
        
        return is_valid, "Authentication successful" if is_valid else "Invalid password"

# Usage example
auth_system = UserAuth()
auth_system.register_user("alice", "SecurePass123!", 12)
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
        
        def set_initial_password(self, password, work_factor=12):
            """Set initial password"""
            self.current_hash = bcrypt.hashpw(
                password.encode('utf-8'), 
                bcrypt.gensalt(rounds=work_factor)
            ).decode('utf-8')
            return self.current_hash
        
        def update_password(self, old_password, new_password, work_factor=12):
            """Update password with verification"""
            # Verify old password
            if not bcrypt.checkpw(old_password.encode('utf-8'), 
                                self.current_hash.encode('utf-8')):
                return False, "Old password incorrect"
            
            # Hash new password
            new_hash = bcrypt.hashpw(
                new_password.encode('utf-8'), 
                bcrypt.gensalt(rounds=work_factor)
            ).decode('utf-8')
            
            self.current_hash = new_hash
            return True, "Password updated successfully"
    
    # Test password update
    pm = PasswordManager()
    pm.set_initial_password("oldPassword123")
    success, message = pm.update_password("oldPassword123", "newPassword456")
    print(f"Password update: {success}, {message}")
```

## Performance Testing

### Benchmark Different Work Factors
```python
import time

def benchmark_work_factors():
    """Benchmark bcrypt with different work factors"""
    password = "benchmarkPassword"
    work_factors = [8, 10, 12, 14, 16]
    iterations = 5
    
    print("bcrypt Work Factor Benchmark:")
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
        print(f"Work factor {factor:2d}: {avg_time:6.2f}ms average")
    
    print("-" * 40)

# Run benchmark
benchmark_work_factors()
```

### Memory Usage Analysis
```python
import psutil
import os

def memory_usage_example():
    """Analyze memory usage during bcrypt operations"""
    def get_memory_usage():
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / 1024 / 1024  # MB
    
    password = "memoryTestPassword"
    work_factor = 12
    
    print("Memory usage analysis:")
    print(f"Initial memory: {get_memory_usage():.2f} MB")
    
    # Hash password
    start_memory = get_memory_usage()
    hashed = bcrypt.hashpw(password.encode('utf-8'), 
                          bcrypt.gensalt(rounds=work_factor))
    end_memory = get_memory_usage()
    
    print(f"After hashing: {end_memory:.2f} MB")
    print(f"Memory increase: {end_memory - start_memory:.2f} MB")
    print(f"Hash result: {hashed.decode('utf-8')[:30]}...")
```

## Error Handling

### Safe bcrypt Operations
```python
def safe_bcrypt_operations():
    """Safe bcrypt operations with error handling"""
    def safe_hash_password(password, work_factor=12):
        try:
            if not password:
                raise ValueError("Password cannot be empty")
            
            if work_factor < 4 or work_factor > 31:
                raise ValueError("Work factor must be between 4 and 31")
            
            if len(password) > 72:  # bcrypt limit
                print("Warning: Password truncated to 72 characters")
                password = password[:72]
            
            hashed = bcrypt.hashpw(password.encode('utf-8'), 
                                 bcrypt.gensalt(rounds=work_factor))
            return hashed.decode('utf-8')
            
        except Exception as e:
            print(f"Error hashing password: {e}")
            return None
    
    def safe_verify_password(password, hashed_password):
        try:
            if not password or not hashed_password:
                return False
            
            return bcrypt.checkpw(password.encode('utf-8'), 
                                hashed_password.encode('utf-8'))
            
        except Exception as e:
            print(f"Error verifying password: {e}")
            return False
    
    # Test safe operations
    test_cases = [
        ("", 12),  # Empty password
        ("valid", 3),  # Too low work factor
        ("valid", 32),  # Too high work factor
        ("valid", 12),  # Valid case
    ]
    
    for password, factor in test_cases:
        result = safe_hash_password(password, factor)
        print(f"Password: '{password}', Factor: {factor} -> {result}")
```

## JavaScript Examples

### Node.js bcrypt Implementation
```javascript
const bcrypt = require('bcryptjs');

async function bcryptExamples() {
    console.log("JavaScript bcrypt Examples:");
    
    // Basic hashing
    const password = "jsPassword123";
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    
    // Verification
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Valid: ${isValid}`);
    
    // Work factor comparison
    const factors = [10, 12, 14];
    for (const factor of factors) {
        const startTime = Date.now();
        await bcrypt.hash("test", factor);
        const duration = Date.now() - startTime;
        console.log(`Factor ${factor}: ${duration}ms`);
    }
}

// Run JavaScript examples
bcryptExamples().catch(console.error);
```

### Browser bcrypt Implementation
```javascript
// Using bcryptjs in browser
async function browserBcryptExample() {
    // Load bcryptjs from CDN
    const bcrypt = window.bcrypt;
    
    const password = "browserPassword";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log("Browser bcrypt result:", hash);
    
    const isValid = await bcrypt.compare(password, hash);
    console.log("Browser verification:", isValid);
}
```

## Testing and Validation

### Hash Verification Tests
```python
def hash_verification_tests():
    """Comprehensive hash verification tests"""
    test_cases = [
        ("password123", "password123", True),
        ("password123", "password124", False),
        ("", "", True),
        ("unicode测试", "unicode测试", True),
        ("unicode测试", "unicode测试2", False),
    ]
    
    print("Hash Verification Tests:")
    print("-" * 40)
    
    for password, test_password, expected in test_cases:
        # Hash original password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Test verification
        result = bcrypt.checkpw(test_password.encode('utf-8'), hashed)
        
        status = "PASS" if result == expected else "FAIL"
        print(f"{status}: '{password}' vs '{test_password}' -> {result} (expected {expected})")

# Run verification tests
hash_verification_tests()
```

### Performance Regression Test
```python
def performance_regression_test():
    """Test bcrypt performance consistency"""
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
    
    print("Performance Regression Test:")
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
- Basic bcrypt hashing and verification
- Work factor management and benchmarking
- Salt generation and management
- Password validation and security practices
- User authentication systems
- Performance testing and optimization
- Error handling and safe operations
- JavaScript implementations
- Comprehensive testing and validation

All examples follow security best practices and provide practical implementations for real-world applications. 