# Argon2 Usage Tutorial

## Picking a library

Argon2 bindings exist for pretty much every language. Here are the ones I've used and can vouch for:

**Python** -- `argon2-cffi` is the standard choice. It wraps the reference C implementation via CFFI and the API is clean and hard to misuse:
```bash
pip install argon2-cffi
```

**Node.js** -- the `argon2` npm package is well-maintained and exposes a nice async API:
```bash
npm install argon2
```

**PHP** -- Argon2 is built into `password_hash()` as of PHP 7.2 with the `PASSWORD_ARGON2ID` constant. If you're on PHP 7.2+, you don't need anything else.

**Java** -- Spring Security includes Argon2 support through `Argon2PasswordEncoder`. Otherwise, Bouncy Castle has it.

**Go** -- `golang.org/x/crypto/argon2` from the extended standard library. No third-party dependencies.

## The two most important concepts

Before you write any code, understand these two things:

### Variant selection -- just use Argon2id

Unless you have a specific threat model that says otherwise, Argon2id is the right call. It combines the side-channel resistance of Argon2i (for the first half of computation) with the GPU/ASIC resistance of Argon2d (for the second half). NIST and the RFC both recommend it as the default.

```python
from argon2 import PasswordHasher
from argon2 import Type

# The default type in most libraries is Argon2id -- but it's worth being explicit
ph = PasswordHasher(type=Type.ID)
```

### Parameter sizing -- benchmark first

The single biggest mistake people make with Argon2 is picking parameters without benchmarking. Either they leave the defaults (which are often tuned for development, not production) or they cargo-cult numbers from a blog post.

Instead, benchmark on your actual hardware:

```python
import time
from argon2 import PasswordHasher

def find_params(target_seconds=1.0, max_memory_mb=256):
    """Brute-force search for parameters that hit a target time"""
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
    
    # Fallback -- crank everything up
    return {"time_cost": 10, "memory_cost": 524288, "elapsed": 999}

params = find_params(target_seconds=0.5)
print(f"Recommended params: time_cost={params['time_cost']}, "
      f"memory_cost={params['memory_cost'] / 1024}MB "
      f"({params['elapsed']:.2f}s)")
```

For a typical web app, aim for 0.5-1 second per hash. If your server can't handle that without sweating, start at 0.2 seconds and work your way up as you scale horizontally. The key insight: the hash time is a one-time cost at login. It's latency your users tolerate once per session -- make that trade-off deliberately.

## Basic hashing and verification

The argon2-cffi library in Python gives you a `PasswordHasher` object that handles everything: salt generation, parameter encoding in the output string, and verification.

```python
from argon2 import PasswordHasher

ph = PasswordHasher(
    time_cost=3,       # 3 passes over memory
    memory_cost=65536, # 64 MiB of memory
    parallelism=1,     # Single-threaded
    hash_len=32,       # 32-byte output
    salt_len=16,       # 16-byte random salt
)

password = "my_user_password_123"
hashed = ph.hash(password)
print(hashed)
# Output looks like: $argon2id$v=19$m=65536,t=3,p=1$<salt>$<hash>
```

The output string is self-describing -- it includes the algorithm variant, version, and all parameters. This is brilliant for forward compatibility: if you decide to crank up the parameters later, you can verify old hashes against their embedded parameters and hash new passwords with stronger settings, all in the same database column.

```python
# Verification is dead simple
try:
    ph.verify(hashed, password)
    print("Password correct!")
except argon2.exceptions.VerifyMismatchError:
    print("Wrong password!")
```

## Advanced: transparent parameter upgrades

Here's a pattern I've used in production that handles parameter upgrades cleanly:

```python
import argon2

class PasswordService:
    def __init__(self, target_params):
        self.current_hasher = PasswordHasher(**target_params)
        self.target_params = target_params
    
    def hash_password(self, password):
        return self.current_hasher.hash(password)
    
    def verify_password(self, stored_hash, password):
        """Returns (is_valid, needs_rehash)"""
        try:
            # The verify call uses the parameters embedded in stored_hash
            ph = PasswordHasher()
            ph.verify(stored_hash, password)
            
            # Check if the hash uses weaker params than we'd like
            needs_rehash = ph.check_needs_rehash(stored_hash)
            
            return True, needs_rehash
        except argon2.exceptions.VerifyMismatchError:
            return False, False
    
    def rehash_if_needed(self, stored_hash, password):
        """Rehash with current params if the old hash is stale"""
        is_valid, needs_rehash = self.verify_password(stored_hash, password)
        if needs_rehash and is_valid:
            return self.hash_password(password)
        return stored_hash
```

If `check_needs_rehash` returns `True`, you rehash the password with current parameters and update the database. Users never even know it happened.

## Error handling that doesn't leak timing

One subtlety people miss: you should not return different error messages for "user not found" vs. "wrong password". It's not about Argon2 specifically -- it's a general authentication principle. If your error message lets an attacker distinguish between "this account exists" and "wrong password", you've given them a username enumeration oracle.

```python
# BAD: different error messages leak user existence
if not user:
    return "User not found"
if not verify_password(user.hash, password):
    return "Invalid password"

# GOOD: same error message regardless
if not user or not verify_password(user.hash, password):
    return "Invalid username or password"
```

Also, don't forget that Argon2 itself is constant-time in its verification path -- the library handles that for you. But your surrounding logic still needs to be careful about timing leaks (e.g., doing a database lookup for a nonexistent user vs. an existing one might take measurably different amounts of time).

## Quick parameter reference

| Use Case | time_cost | memory_cost | parallelism | Notes |
|----------|-----------|-------------|-------------|-------|
| Development | 1 | 32768 (32 MB) | 1 | Fast, but don't use in prod |
| Web app (standard) | 2-3 | 65536-131072 (64-128 MB) | 1 | Good balance for most sites |
| High security | 4-6 | 262144 (256 MB) | 1 | For financial/government data |
| Maximum | 10 | 524288+ (512+ MB) | 1 | Key derivation, offline use |

Remember: these numbers should be validated on your actual hardware. The table above is a starting point, not gospel.

## Use this tool

This online Argon2 tool handles parameter selection, hashing, and verification. It runs entirely in your browser -- nothing gets sent to a server. The salt is generated from your browser's CSPRNG, and all parameters are embedded in the output string so you can verify against any compliant Argon2 implementation later.
