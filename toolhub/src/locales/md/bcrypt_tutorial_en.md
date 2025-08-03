# bcrypt Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with bcrypt library support
- Understanding of password security principles
- Knowledge of cryptographic hash functions
- Awareness of bcrypt work factor and performance implications

### Library Selection

#### Python - bcrypt
```bash
# Install bcrypt library
pip install bcrypt
```

#### Node.js - bcryptjs
```bash
# Install bcryptjs (pure JavaScript implementation)
npm install bcryptjs

# Or install bcrypt (native implementation)
npm install bcrypt
```

#### PHP - password_hash
```bash
# Built-in password_hash function supports bcrypt
# No additional installation required for PHP 5.5+
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

### Work Factor Selection
```python
import bcrypt

def work_factor_guide():
    """Guide for selecting bcrypt work factor"""
    print("bcrypt Work Factor Selection Guide:")
    print("Work Factor 10: ~100ms, suitable for development")
    print("Work Factor 12: ~400ms, recommended for production")
    print("Work Factor 14: ~1.6s, high security requirements")
    print("Work Factor 16: ~6.4s, maximum security")
    
    # Security recommendations
    recommendations = {
        "Development": "Work factor 10-11",
        "Production": "Work factor 12-13",
        "High Security": "Work factor 14-15",
        "Maximum Security": "Work factor 16+"
    }
    
    return recommendations
```

### Hash Format Understanding
```python
def explain_bcrypt_format():
    """Explain bcrypt hash format"""
    # Example bcrypt hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe
    # Format: $2b$<cost>$<salt><hash>
    
    print("bcrypt Hash Format:")
    print("$2b$ - Algorithm version (2b is current)")
    print("12   - Work factor (cost)")
    print("LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe - Salt + Hash")
    print("Total length: 60 characters")
```

## Basic Password Operations

### Simple Password Hashing
```python
import bcrypt

def hash_password(password, work_factor=12):
    """Hash a password using bcrypt"""
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    # Generate salt and hash
    salt = bcrypt.gensalt(rounds=work_factor)
    hashed = bcrypt.hashpw(password, salt)
    
    return hashed.decode('utf-8')

def verify_password(password, hashed_password):
    """Verify a password against its hash"""
    if isinstance(password, str):
        password = password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(password, hashed_password)

# Usage examples
password = "mySecurePassword123"
hashed = hash_password(password, work_factor=12)
print(f"Password: {password}")
print(f"Hashed: {hashed}")

# Verify password
is_valid = verify_password(password, hashed)
print(f"Password valid: {is_valid}")
```

### JavaScript Implementation
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

// Usage examples
async function example() {
    const password = "mySecurePassword123";
    const hashed = await hashPassword(password, 12);
    console.log(`Password: ${password}`);
    console.log(`Hashed: ${hashed}`);
    
    const isValid = await verifyPassword(password, hashed);
    console.log(`Password valid: ${isValid}`);
}
```

## Advanced Usage

### Work Factor Management
```python
import bcrypt
import time

def benchmark_work_factors():
    """Benchmark different work factors"""
    password = "testPassword123"
    work_factors = [10, 12, 14, 16]
    
    results = {}
    for factor in work_factors:
        start_time = time.time()
        
        # Hash password with specific work factor
        hashed = hash_password(password, factor)
        
        end_time = time.time()
        duration = (end_time - start_time) * 1000  # Convert to milliseconds
        
        results[factor] = {
            'duration_ms': duration,
            'hash': hashed
        }
        
        print(f"Work factor {factor}: {duration:.2f}ms")
    
    return results

def adaptive_work_factor():
    """Determine optimal work factor based on system performance"""
    target_time = 0.5  # Target 500ms for hashing
    
    # Test with work factor 10
    start_time = time.time()
    hash_password("test", 10)
    test_time = time.time() - start_time
    
    # Calculate optimal work factor
    optimal_factor = 10
    while test_time < target_time and optimal_factor < 20:
        optimal_factor += 1
        start_time = time.time()
        hash_password("test", optimal_factor)
        test_time = time.time() - start_time
    
    return optimal_factor - 1
```

### Salt Management
```python
def custom_salt_generation():
    """Demonstrate custom salt generation"""
    import os
    
    # Generate custom salt
    custom_salt = bcrypt.gensalt(rounds=12)
    print(f"Generated salt: {custom_salt.decode('utf-8')}")
    
    # Use custom salt for hashing
    password = "myPassword"
    hashed = bcrypt.hashpw(password.encode('utf-8'), custom_salt)
    print(f"Hashed with custom salt: {hashed.decode('utf-8')}")
    
    return custom_salt, hashed

def extract_salt_from_hash(hashed_password):
    """Extract salt from bcrypt hash"""
    # bcrypt hash format: $2b$12$<salt><hash>
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    # Salt is the first 29 characters (including $2b$12$)
    salt = hashed_password[:29]
    return salt.decode('utf-8')
```

## Security Best Practices

### Password Validation
```python
import re

def validate_password_strength(password):
    """Validate password strength before hashing"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    return True, "Password meets strength requirements"

def secure_password_hashing(password, work_factor=12):
    """Secure password hashing with validation"""
    # Validate password strength
    is_valid, message = validate_password_strength(password)
    if not is_valid:
        raise ValueError(f"Password validation failed: {message}")
    
    # Hash password
    return hash_password(password, work_factor)
```

### Timing Attack Prevention
```python
import secrets
import time

def constant_time_verification(password, hashed_password):
    """Constant-time password verification to prevent timing attacks"""
    # Use constant-time comparison
    return verify_password(password, hashed_password)

def secure_password_update(old_password, new_password, old_hash, work_factor=12):
    """Securely update password with verification"""
    # Verify old password
    if not verify_password(old_password, old_hash):
        raise ValueError("Old password is incorrect")
    
    # Validate new password strength
    is_valid, message = validate_password_strength(new_password)
    if not is_valid:
        raise ValueError(f"New password validation failed: {message}")
    
    # Hash new password
    new_hash = hash_password(new_password, work_factor)
    
    return new_hash
```

## Error Handling

### Safe bcrypt Operations
```python
def safe_bcrypt_operation(password, work_factor=12):
    """Safe bcrypt operation with error handling"""
    try:
        if not password:
            raise ValueError("Password cannot be empty")
        
        if work_factor < 4 or work_factor > 31:
            raise ValueError("Work factor must be between 4 and 31")
        
        return hash_password(password, work_factor)
        
    except Exception as e:
        print(f"bcrypt operation failed: {e}")
        return None

def validate_bcrypt_hash(hashed_password):
    """Validate bcrypt hash format"""
    if not hashed_password:
        return False, "Hash cannot be empty"
    
    if not hashed_password.startswith('$2b$'):
        return False, "Invalid bcrypt hash format"
    
    if len(hashed_password) != 60:
        return False, "Invalid hash length"
    
    try:
        # Try to decode the hash
        hashed_password.encode('utf-8')
        return True, "Valid bcrypt hash"
    except UnicodeEncodeError:
        return False, "Invalid character encoding"
```

## Performance Optimization

### Batch Processing
```python
import asyncio
import concurrent.futures

def batch_hash_passwords(passwords, work_factor=12, max_workers=4):
    """Hash multiple passwords in parallel"""
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
                print(f"Password hashing failed: {e}")
                results.append(None)
    
    return results

async def async_batch_hash(passwords, work_factor=12):
    """Async batch password hashing"""
    loop = asyncio.get_event_loop()
    
    tasks = []
    for password in passwords:
        task = loop.run_in_executor(None, hash_password, password, work_factor)
        tasks.append(task)
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return results
```

## Testing and Validation

### Hash Verification
```python
def test_bcrypt_implementation():
    """Test bcrypt implementation with known values"""
    test_password = "testPassword123"
    work_factor = 10
    
    # Hash password
    hashed = hash_password(test_password, work_factor)
    print(f"Generated hash: {hashed}")
    
    # Verify password
    is_valid = verify_password(test_password, hashed)
    print(f"Password verification: {is_valid}")
    
    # Test with wrong password
    wrong_password = "wrongPassword123"
    is_invalid = verify_password(wrong_password, hashed)
    print(f"Wrong password verification: {is_invalid}")
    
    return hashed, is_valid, is_invalid

def performance_test():
    """Test bcrypt performance"""
    password = "testPassword123"
    iterations = 10
    
    print("bcrypt Performance Test:")
    for work_factor in [10, 12, 14]:
        total_time = 0
        for _ in range(iterations):
            start_time = time.time()
            hash_password(password, work_factor)
            end_time = time.time()
            total_time += (end_time - start_time)
        
        avg_time = (total_time / iterations) * 1000
        print(f"Work factor {work_factor}: {avg_time:.2f}ms average")
```

## Summary

This tutorial covers:
- Environment setup for different programming languages
- Basic password hashing and verification
- Work factor selection and management
- Security best practices and validation
- Error handling and performance optimization
- Testing and validation techniques

All examples follow security best practices and use appropriate work factors for their intended purposes. 