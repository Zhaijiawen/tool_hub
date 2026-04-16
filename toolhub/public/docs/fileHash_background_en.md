# File Hash Verification - Technical Background

## What is a Hash Function

A hash function maps data of arbitrary length to a fixed-length output (hash value / digest). Hash functions have the following key properties:

1. **Deterministic**: The same input always produces the same output
2. **One-way**: It is computationally infeasible to reverse a hash to recover the original data
3. **Avalanche effect**: A tiny change in input produces a completely different output
4. **Collision resistance**: Finding two different inputs that produce the same hash is extremely difficult

## Common Hash Algorithms

### MD5 (Message Digest 5)
- Output length: 128 bits (32 hex characters)
- Speed: Very fast
- Security: ⚠️ **No longer secure** — known collision attacks exist
- Uses: File integrity checking (non-security contexts), checksums

```
Example:
MD5("hello") = 5d41402abc4b2a76b9719d911017c592
```

### SHA-1 (Secure Hash Algorithm 1)
- Output length: 160 bits (40 hex characters)
- Speed: Relatively fast
- Security: ⚠️ **No longer secure** — Google demonstrated a practical collision attack (SHAttered) in 2017
- Uses: Git object identification (legacy), legacy systems

```
Example:
SHA1("hello") = aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
```

### SHA-256 (SHA-2 family)
- Output length: 256 bits (64 hex characters)
- Speed: Moderate
- Security: ✅ **Currently secure**, widely used
- Uses: File download verification, digital signatures, password storage, Bitcoin mining

```
Example:
SHA256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

### SHA-512 (SHA-2 family)
- Output length: 512 bits (128 hex characters)
- Speed: Faster than SHA-256 on 64-bit systems
- Security: ✅ **Very secure**, larger security margin
- Uses: High-security scenarios, SSL/TLS certificates

## Uses of Hash Values

### File Integrity Verification
When releasing software, official websites typically provide the SHA-256 hash of the file. After downloading, compute the file hash and compare with the official value to verify:
- The file is not corrupted
- The file has not been tampered with (man-in-the-middle attacks)
- You downloaded the genuine file

### Digital Fingerprint
Every file has a unique hash value (analogous to a fingerprint), used for:
- File deduplication
- Quickly comparing if files are identical (without byte-by-byte comparison)
- Copyright proof (timestamped hash)

### Password Storage
User passwords should never be stored in plaintext — store their hash values instead (combined with a salt).

## Web Crypto API

Modern browsers have a built-in `SubtleCrypto` API that supports computing SHA-family hashes directly in the browser without a backend service:

```javascript
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

Supported algorithms: `SHA-1`, `SHA-256`, `SHA-384`, `SHA-512` (Note: MD5 is not supported natively)

## Performance Considerations

- SHA-256 takes approximately 3-10 seconds for a 1GB file (depends on device performance)
- Large files must be processed in chunks to avoid memory overflow
- Use `FileReader.readAsArrayBuffer` or `File.arrayBuffer()` to read files
- MD5 is computed in the browser through third-party libraries like `spark-md5`

