# bcrypt Usage Tutorial

## Getting a library

bcrypt bindings are everywhere -- it's one of the most widely implemented crypto algorithms after AES and SHA. Here's what to reach for:

**Python** -- `bcrypt` on PyPI. Simple API, well-maintained:
```bash
pip install bcrypt
```

**Node.js** -- You have two choices. `bcrypt` is the native C++ binding (faster but needs compilation), and `bcryptjs` is pure JavaScript (slower but zero dependencies, works everywhere including browsers):
```bash
npm install bcryptjs   # Pure JS, no compilation needed
npm install bcrypt     # Native, faster
```

**PHP** -- Built into `password_hash()` since PHP 5.5 with `PASSWORD_BCRYPT`. No extra dependencies.

**Go** -- `golang.org/x/crypto/bcrypt` from the extended standard library.

**Java** -- Spring Security's `BCryptPasswordEncoder` is the most common choice, but jBCrypt and the Bouncy Castle implementation work too.

## The work factor: the only parameter that matters

bcrypt has essentially one knob to turn: the work factor (or "cost" or "rounds"). Each increment doubles the computation time, so choosing it matters:

```python
import bcrypt
import time

# Quick benchmark to find the right work factor for your hardware
for rounds in [10, 12, 14, 16]:
    start = time.time()
    bcrypt.hashpw(b"benchmark", bcrypt.gensalt(rounds=rounds))
    elapsed = time.time() - start
    print(f"Rounds {rounds}: {elapsed:.2f}s")
```

For a web server handling login requests, you want each hash to take somewhere between 250ms and 500ms. Faster and you're giving attackers an easier time; slower and users will complain (and your server will burn CPU under load). On a typical 2024 server, that usually means rounds=12 or 13.

The time scales roughly like 2^(rounds-10) * (time_for_rounds_10). If rounds=10 takes 50ms on your server, rounds=12 will take about 200ms, rounds=14 about 800ms. This exponential curve is why you can't just set it to some random number -- test it.

## Hashing and verifying passwords

The Python API couldn't be simpler. `bcrypt.hashpw()` takes the password and a salt (which you generate with `gensalt()`), and returns the hash with everything embedded. `bcrypt.checkpw()` takes the password and the stored hash and tells you if they match:

```python
import bcrypt

def hash_password(password: str, rounds: int = 12) -> str:
    """Hash a password and return the bcrypt string."""
    # bcrypt works with bytes, so encode the string
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=rounds)
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Check a password against its stored bcrypt hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Usage
hashed = hash_password("correct horse battery staple", rounds=12)
print(hashed)
# $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQe

print(verify_password("correct horse battery staple", hashed))  # True
print(verify_password("wrong password", hashed))                 # False
```

On the JavaScript side with bcryptjs:

```javascript
const bcrypt = require('bcryptjs');

async function hashPassword(password, rounds = 12) {
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
```

## The 72-byte limit and how to handle it

bcrypt silently truncates passwords longer than 72 bytes. For most users this never matters (72 bytes is a long password), but if you want to be thorough, pre-hash with SHA-256:

```python
import hashlib
import bcrypt

def hash_password_safe(password: str, rounds: int = 12) -> str:
    """Hash with SHA-256 pre-hashing to handle long passwords."""
    # Pre-hash the password to get a consistent-length input
    pre_hash = hashlib.sha256(password.encode('utf-8')).digest()
    # Encode as base64 to avoid null bytes that might confuse some libs
    import base64
    encoded = base64.b64encode(pre_hash)
    salt = bcrypt.gensalt(rounds=rounds)
    return bcrypt.hashpw(encoded, salt).decode('utf-8')
```

Note that this changes your verification path too -- you must pre-hash the attempted password before checking. If you're building a new system, consider just using Argon2id which handles long passwords natively. If you're already on bcrypt, this pattern works fine.

## Transparent work factor upgrades

The best bcrypt feature is that the work factor lives in the hash string. This lets you upgrade parameters over time without a mass password reset:

```python
def login_with_upgrade(username: str, password: str, db):
    """Login that transparently upgrades weak hashes."""
    user = db.get_user(username)
    if not user:
        return False  # Don't leak user existence

    if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return False

    # Check if we should upgrade the work factor
    # The rounds value is the second segment of the hash
    current_rounds = int(user.password_hash.split('$')[2])
    if current_rounds < 13:  # Our current target
        new_hash = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt(rounds=13)
        ).decode()
        db.update_password_hash(username, new_hash)

    return True
```

This pattern is the standard way to keep your password database healthy over years. Set a target rounds value, and every time someone logs in with an old hash, silently upgrade them.

You can also use this strategy for migration from an older algorithm entirely: check if the stored hash starts with `$2b$`, and if not (meaning it's still in the old format), verify with the old algorithm and then hash with bcrypt on success.

## JavaScript gotcha: async vs sync

Node.js bcrypt operations are async by default -- they run on a thread pool to avoid blocking the event loop. Don't accidentally use them synchronously in a request handler:

```javascript
// WRONG: This blocks the entire Node.js process
app.post('/login', (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    // ...
});

// RIGHT: Use the async API
app.post('/login', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    // ...
});
```

The synchronous methods are fine for scripts and CLI tools, but never in a server that handles concurrent requests.

## Quick reference

| Context | Recommended rounds | Approximate time |
|---------|-------------------|------------------|
| Development/testing | 6-10 | < 50ms |
| Production (standard) | 12-13 | 200-500ms |
| High security | 14-15 | 800ms-3s |
| Don't go above 16 | 16+ | > 5s (hurts UX) |

Remember: benchmark on your actual hardware. Cloud VMs can have wildly different bcrypt performance than your dev laptop.

## Use the online tool

This ToolHub bcrypt tool hashes and verifies passwords in your browser -- nothing leaves your machine. It uses a pure-JS implementation so you get the same results as server-side bcrypt libraries. The hash format is fully standard and can be verified by any bcrypt-compatible system.
