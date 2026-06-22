# SHA Usage Tutorial

Cryptographic hashing is one of the simplest crypto operations, but there are still some things to get right. SHA-256 is your default unless you have a reason to pick something else.

## Computing hashes

Every language has SHA built in. In Python:

```python
import hashlib

# SHA-256 (most common)
data = b"Hello, world!"
hash_256 = hashlib.sha256(data).hexdigest()
print(f"SHA-256: {hash_256}")

# SHA-512
hash_512 = hashlib.sha512(data).hexdigest()
print(f"SHA-512: {hash_512}")

# SHA-1 (deprecated -- for awareness only)
# hash_1 = hashlib.sha1(data).hexdigest()

# For streaming/large data
h = hashlib.sha256()
h.update(b"Hello, ")
h.update(b"world!")
print(h.hexdigest())
```

In JavaScript (Node):
```javascript
const crypto = require('crypto');

const hash = crypto.createHash('sha256').update('Hello, world!').digest('hex');
console.log('SHA-256:', hash);
```

## HMAC -- keyed hashing

If you need a message authentication code, use HMAC, not just H(key || message):

```python
import hmac
import hashlib

key = b"secret-key"
message = b"important message"

# HMAC-SHA256
mac = hmac.new(key, message, hashlib.sha256).hexdigest()
print(f"HMAC-SHA256: {mac}")
```

HMAC is immune to length extension attacks. The construction is `H((key XOR opad) || H((key XOR ipad) || message))`, which fixes the vulnerability in the naive prefix approach.

## Hashing files

For large files, hash in chunks:

```python
def sha256_file(file_path):
    h = hashlib.sha256()
    with open(file_path, 'rb') as f:
        while chunk := f.read(65536):  # 64KB chunks
            h.update(chunk)
    return h.hexdigest()

print(sha256_file('large_file.bin'))
```

## When NOT to use SHA

- **Password storage**: Use bcrypt, Argon2, or scrypt. SHA is too fast.
- **Encryption**: SHA is not encryption. It's one-way.
- **Random number generation**: Use a CSPRNG (os.urandom), not SHA of the current time.

## Common patterns

```python
# Double SHA-256 (Bitcoin-style)
digest = hashlib.sha256(hashlib.sha256(data).digest()).hexdigest()

# SHA-256 for file integrity
with open('download.zip', 'rb') as f:
    file_hash = hashlib.sha256(f.read()).hexdigest()
# Compare with published hash to verify integrity
```
