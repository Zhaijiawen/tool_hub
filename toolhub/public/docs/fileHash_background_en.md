# File Hash Verification - Technical Background

Hash functions are one of those things you use constantly without thinking about them. Git commits, package downloads, password storage -- they all lean on hashing. Let's walk through what's actually happening under the hood.

A hash function takes data of any size and spits out a fixed-length string. The key properties that make it useful:

1. **Deterministic** -- same input, same output every time. No randomness involved.
2. **One-way** -- you can't reverse a hash to get the original data. That's the whole point for passwords.
3. **Avalanche effect** -- flip one bit in the input and the output looks completely different. This is how you catch even the tiniest corruption.
4. **Collision resistance** -- finding two different inputs that hash to the same value should be practically impossible. When it becomes possible, the algorithm is dead.

## The algorithm family tree

**MD5** outputs 128 bits (32 hex chars). It's blazing fast, which is why people still use it for non-security checksums. But don't use it for anything security-related -- collision attacks have been demonstrated for over a decade. It's fine for "did this file get corrupted in transit" checks, nothing more.

```
MD5("hello") = 5d41402abc4b2a76b9719d911017c592
```

**SHA-1** gives you 160 bits (40 hex chars). Google's SHAttered attack in 2017 showed a practical collision, so it's also off the table for security. Git still uses SHA-1 for object IDs, though they've been working on the SHA-256 transition for a while now.

```
SHA1("hello") = aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
```

**SHA-256** (from the SHA-2 family) is the current workhorse -- 256 bits, 64 hex chars. It's what you see on download pages, what Bitcoin mining uses, what most digital signatures rely on. Still considered secure as of today.

```
SHA256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

**SHA-512** is SHA-256's bigger sibling at 512 bits (128 hex chars). Interestingly, it's actually faster than SHA-256 on 64-bit systems because it operates on 64-bit words natively. Used in high-security contexts and TLS certificates.

## What you actually use hashes for

Download verification is the most common real-world use. When you grab a Linux ISO or a Node.js installer, the download page shows a SHA-256 hash. Run the file through a hasher, compare the output, and you know whether the file arrived intact and un-tampered.

File deduplication is another big one. Instead of comparing files byte by byte, just compare hashes. If two files have the same SHA-256, they're the same file (with astronomically high probability).

Password storage of course -- never store plaintext. Hash with a salt, and when the user logs in, hash what they typed and compare. Even if your database leaks, attackers can't directly see passwords.

## Web Crypto API in the browser

Modern browsers expose `SubtleCrypto` which lets you compute SHA-family hashes directly in JavaScript, no backend needed:

```javascript
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

The built-in support covers `SHA-1`, `SHA-256`, `SHA-384`, and `SHA-512`. MD5 isn't in the spec (for good reason), so you'll need a library like `spark-md5` for that.

On the performance side, hashing a 1GB file with SHA-256 takes about 3-10 seconds depending on your hardware. Large files need chunked reading to avoid blowing up memory -- `File.arrayBuffer()` or `FileReader.readAsArrayBuffer()` with a streaming approach are the way to go. Browsers don't natively support incremental hashing through SubtleCrypto, so for really big files you might want to offload to a Web Worker to keep the UI responsive.
