# bcrypt Code Examples

Working bcrypt snippets in several languages, with notes on the practical details that matter.

## Python

The Python `bcrypt` library is a thin wrapper around the OpenBSD implementation. The API takes and returns bytes, so you'll always be encoding/decoding UTF-8 strings.

### Basic hash and verify

```python
import bcrypt

password = "Tr0ub4dor&3"

# gensalt() generates a random salt with your chosen work factor
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

print(hashed.decode('utf-8'))
# $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe

# Verification -- checkpw reads the rounds and salt from the hash
print(bcrypt.checkpw(password.encode('utf-8'), hashed))  # True
print(bcrypt.checkpw(b"wrong_password", hashed))         # False
```

### Benchmarking work factors

Don't guess what rounds value your server can handle. Measure it:

```python
import bcrypt
import time

for rounds in [8, 10, 12, 14, 16]:
    start = time.time()
    bcrypt.hashpw(b"benchmark", bcrypt.gensalt(rounds=rounds))
    elapsed = (time.time() - start) * 1000
    print(f"rounds={rounds:2d}: {elapsed:6.1f}ms")
```

On my dev machine, rounds=12 takes about 300ms. Your results will differ -- cloud VMs, Raspberry Pis, and M1 Macs all have very different bcrypt performance because of how the underlying Blowfish operations interact with different CPU architectures.

### Mini authentication service

```python
import bcrypt

class AuthService:
    def __init__(self, target_rounds=13):
        self.target_rounds = target_rounds
        self.users = {}  # In production: replace with a database
    
    def register(self, username, password):
        if username in self.users:
            return False, "Username already taken"
        hashed = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=self.target_rounds)
        ).decode('utf-8')
        self.users[username] = hashed
        return True, "Registered"
    
    def login(self, username, password):
        stored = self.users.get(username)
        if not stored:
            return False, "Invalid credentials"
        
        if not bcrypt.checkpw(password.encode('utf-8'), stored.encode('utf-8')):
            return False, "Invalid credentials"
        
        # Transparent upgrade: if stored hash uses weaker rounds, rehash
        current_rounds = int(stored.split('$')[2])
        if current_rounds < self.target_rounds:
            new_hash = bcrypt.hashpw(
                password.encode('utf-8'),
                bcrypt.gensalt(rounds=self.target_rounds)
            ).decode('utf-8')
            self.users[username] = new_hash
        
        return True, "Logged in"


auth = AuthService(target_rounds=13)
auth.register("alice", "correct horse battery staple")
print(auth.login("alice", "correct horse battery staple"))  # (True, "Logged in")
print(auth.login("alice", "wrong password"))                # (False, "Invalid credentials")
print(auth.login("bob", "anything"))                         # (False, "Invalid credentials")
```

Notice that "bob" (nonexistent user) and "wrong password" return the same response. This prevents user enumeration -- an attacker can't tell whether a username exists by looking at error messages.

## JavaScript (Node.js)

The `bcryptjs` package is slower than the native `bcrypt` but deploys anywhere without native compilation. For most applications the speed difference doesn't matter because bcrypt is supposed to be slow anyway.

```javascript
const bcrypt = require('bcryptjs');

async function demo() {
    const password = "jsPassword456";

    // Hash with explicit salt generation
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    console.log("Hash:", hash);

    // Verify
    const valid = await bcrypt.compare(password, hash);
    console.log("Correct password:", valid);  // true

    const invalid = await bcrypt.compare("wrong", hash);
    console.log("Wrong password:", invalid);   // false
}

demo().catch(console.error);
```

One subtlety: `bcryptjs` also accepts the password and salt directly in the `hash()` call without a separate `genSalt()`:

```javascript
// Shorthand: hash(password, rounds) generates a salt internally
const hash = await bcrypt.hash("myPassword", 12);
```

Both work, but the explicit `genSalt()` + `hash()` pattern gives you the option to reuse salts (which you shouldn't do for passwords, but is useful for certain key derivation scenarios).

## Go

Go's bcrypt package is in the extended standard library. The API is minimal but does what you need:

```go
package main

import (
    "fmt"
    "golang.org/x/crypto/bcrypt"
)

func main() {
    password := "goPassword123"

    // GenerateFromPassword creates a salt and returns the full hash string
    hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
    if err != nil {
        panic(err)
    }
    fmt.Println("Hash:", string(hash))
    // $2a$12$...  (Go uses $2a$ prefix by default)

    // CompareHashAndPassword does constant-time comparison
    err = bcrypt.CompareHashAndPassword(hash, []byte(password))
    if err == nil {
        fmt.Println("Password matches!")
    }

    err = bcrypt.CompareHashAndPassword(hash, []byte("wrong"))
    if err != nil {
        fmt.Println("Password does not match")  // This branch runs
    }

    // You can check if a hash needs upgrading:
    cost, _ := bcrypt.Cost(hash)
    if cost < 13 {
        fmt.Println("Hash should be upgraded to higher cost")
        newHash, _ := bcrypt.GenerateFromPassword([]byte(password), 13)
        // Store newHash in your database
        _ = newHash
    }
}
```

Go returns `bcrypt.ErrMismatchedHashAndPassword` as a specific error for wrong passwords, and `bcrypt.ErrHashTooShort` for malformed hashes. This is useful for distinguishing between "wrong password" and "corrupt data" in monitoring, but don't expose that distinction to the user in error messages.

## Java (Spring Security)

Spring Security's `BCryptPasswordEncoder` is the path of least resistance in the Java ecosystem:

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptDemo {
    public static void main(String[] args) {
        // The constructor argument is the work factor (log rounds)
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

        String password = "javaPassword789";
        String hash = encoder.encode(password);
        System.out.println("Hash: " + hash);
        // $2a$12$...

        boolean matches = encoder.matches(password, hash);
        System.out.println("Matches: " + matches);  // true

        boolean wrong = encoder.matches("wrong", hash);
        System.out.println("Wrong: " + wrong);      // false

        // To check if a hash needs upgrading:
        boolean needsUpgrade = encoder.upgradeEncoding(hash);
        System.out.println("Needs upgrade: " + needsUpgrade);
    }
}
```

Spring's `upgradeEncoding()` checks whether the stored hash uses the same work factor as the current encoder. If you bump your encoder's rounds from 12 to 13, all old hashes will return `true` for `upgradeEncoding()`, giving you a clean path to rehash on login.

## Things I've seen go wrong

A few practical lessons from real bcrypt deployments:

- **Storing the hash in a VARCHAR(60) column?** Make it VARCHAR(255). The standard hash is 60 characters, but future bcrypt versions might change the format, and you don't want a column width migration in your future.
- **Don't accidentally double-hash.** If you pre-hash with SHA before bcrypt (for the 72-byte limit), ensure your verification path does the exact same pre-hashing. I've debugged a production outage where the registration path pre-hashed but the login path didn't.
- **Timeouts during login under load.** If you set rounds=14 and get a traffic spike, your server might spend all its CPU on bcrypt and stop responding to health checks. Consider using a login rate limiter or moving to Argon2id (which has finer-grained parameter control).
- **The `gensalt()` prefix matters.** bcrypt hashes starting with `$2b$` work everywhere. Some old systems generate `$2a$` hashes, which have a known bug with certain UTF-8 passwords. Use `$2b$` for new hashes.
