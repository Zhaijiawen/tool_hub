# Argon2 Code Examples

Practical, drop-in-ready Argon2 code across a few languages, with notes on what each piece does.

## Python

Python's `argon2-cffi` is the reference implementation binding and it's a pleasure to use. The `PasswordHasher` class handles salt generation, parameter encoding, and constant-time verification for you.

### Basic hash and verify

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()  # Defaults: Argon2id, t=3, m=65536, p=1

password = "correct horse battery staple"
hashed = ph.hash(password)
print(f"Hash: {hashed}")

# The hash string includes all params -- it's self-contained
# $argon2id$v=19$m=65536,t=3,p=1$<salt>$<hash>

try:
    ph.verify(hashed, password)
    print("Password matches!")
except VerifyMismatchError:
    print("Wrong password!")
```

### Custom parameters for production

Development defaults are deliberately fast. For production, you want more memory and possibly more time:

```python
ph = PasswordHasher(
    time_cost=3,        # Passes over the memory array
    memory_cost=131072, # 128 MiB (131072 KiB)
    parallelism=1,      # Threads -- usually 1 for web servers
    hash_len=32,        # 32-byte output
    salt_len=16,        # 16-byte salt
)

hashed = ph.hash("production_password")
print(hashed)
```

### Building a small auth system

```python
from argon2 import PasswordHasher
import argon2.exceptions

class AuthService:
    def __init__(self, time_cost=3, memory_cost=131072):
        self._params = {"time_cost": time_cost, "memory_cost": memory_cost}
        self._hasher = PasswordHasher(**self._params, parallelism=1)
        self._users = {}  # In production, this is a database
    
    def register(self, username, password):
        if username in self._users:
            return False, "Username taken"
        self._users[username] = self._hasher.hash(password)
        return True, "Registered!"
    
    def login(self, username, password):
        stored_hash = self._users.get(username)
        if not stored_hash:
            # Same message as wrong password -- don't leak existence
            return False, "Invalid username or password"
        
        try:
            # verify() reads parameters from the stored hash itself
            PasswordHasher().verify(stored_hash, password)
            
            # Check if we should upgrade the hash to stronger params
            if PasswordHasher().check_needs_rehash(stored_hash):
                self._users[username] = self._hasher.hash(password)
            
            return True, "Logged in!"
        except argon2.exceptions.VerifyMismatchError:
            return False, "Invalid username or password"


auth = AuthService()
auth.register("alice", "Tr0ub4dor&3")
print(auth.login("alice", "Tr0ub4dor&3"))  # (True, "Logged in!")
print(auth.login("alice", "wrongpass"))    # (False, "Invalid username...")
print(auth.login("bob", "anything"))        # (False, "Invalid username...")
```

### Benchmarking to find the right params

Don't guess your parameters -- measure them:

```python
import time
from argon2 import PasswordHasher

def benchmark_params(time_cost, memory_cost):
    ph = PasswordHasher(time_cost=time_cost, memory_cost=memory_cost)
    start = time.time()
    ph.hash("benchmark_password")
    return time.time() - start

# Quick scan of reasonable parameter combinations
for t in [1, 2, 3, 5]:
    for m_kib in [32768, 65536, 131072, 262144]:
        elapsed = benchmark_params(t, m_kib)
        print(f"t={t}, m={m_kib/1024:.0f}MB -> {elapsed:.2f}s")
```

Pick the combination that hits your latency budget (0.5-1s for most web apps).

## JavaScript (Node.js)

The `argon2` npm package provides a Promise-based API. The `type` parameter is important -- explicitly set it to `argon2id`.

```javascript
const argon2 = require('argon2');

async function hashAndVerify() {
    // Hash with explicit Argon2id
    const hash = await argon2.hash("my_password", {
        type: argon2.argon2id,
        timeCost: 3,
        memoryCost: 65536,  // 64 MiB in KiB
        parallelism: 1,
        hashLength: 32,
    });
    console.log("Hash:", hash);

    // Verify -- reads params from the hash string
    const valid = await argon2.verify(hash, "my_password");
    console.log("Valid:", valid);  // true

    const invalid = await argon2.verify(hash, "wrong_password");
    console.log("Invalid:", invalid);  // false
}

hashAndVerify().catch(console.error);
```

The Node.js API also exposes `argon2.needsRehash()` for parameter upgrades, just like the Python library:

```javascript
// Check if an old hash should be upgraded
const needsUpgrade = argon2.needsRehash(oldHash, {
    timeCost: 5,           // We now want stronger params
    memoryCost: 131072,
});
if (needsUpgrade) {
    const newHash = await argon2.hash(password, { timeCost: 5, memoryCost: 131072 });
    // Store newHash in the database
}
```

## Go

Go's `golang.org/x/crypto/argon2` package is a low-level implementation -- it gives you key derivation, not a password hashing API with verification built in. You handle encoding and parameter storage yourself. For password hashing specifically, consider a higher-level wrapper, but here's the raw approach:

```go
package main

import (
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "golang.org/x/crypto/argon2"
)

func hashPassword(password string) (string, error) {
    // Generate a random 16-byte salt
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil {
        return "", err
    }

    // Argon2id with explicit parameters
    hash := argon2.IDKey([]byte(password), salt,
        3,          // time (iterations)
        64*1024,    // memory (64 MiB)
        1,          // threads
        32,         // output key length
    )

    // Encode salt + hash together for storage
    encoded := base64.StdEncoding.EncodeToString(salt) + "$" +
        base64.StdEncoding.EncodeToString(hash)

    return encoded, nil
}

func verifyPassword(encodedHash, password string) bool {
    // Split salt and hash
    parts := strings.SplitN(encodedHash, "$", 2)
    if len(parts) != 2 {
        return false
    }

    salt, _ := base64.StdEncoding.DecodeString(parts[0])
    expectedHash, _ := base64.StdEncoding.DecodeString(parts[1])

    // Recompute with the same parameters
    recomputed := argon2.IDKey([]byte(password), salt, 3, 64*1024, 1, 32)

    // Constant-time comparison
    return subtle.ConstantTimeCompare(recomputed, expectedHash) == 1
}
```

A caveat: this Go code is more verbose than Python/JS because it's doing parameter tracking and constant-time comparison manually. For production Go, you might prefer a library like `github.com/matthewhartstonge/argon2` that wraps all this up.

## What to watch out for

A few things that'll bite you in practice:

- **Don't trim the hash string.** The `$argon2id$...` format has precise delimiters. Truncating or modifying it will break verification.
- **Don't reuse salts.** The library handles this for you in the `hash()` call. If you're constructing salts manually, each password gets its own salt.
- **Don't store passwords, even temporarily.** If you pass a `char[]` in Java or a `bytearray` in Python, zero it out after hashing. Python strings are immutable so the `hash()` call handles this; in lower-level languages, be mindful.
- **Test your migration path.** Before switching from bcrypt/PBKDF2 to Argon2, test that your rehash-on-login flow works end-to-end with a staging database.
