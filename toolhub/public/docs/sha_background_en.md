# SHA Family Technical Background

SHA (Secure Hash Algorithm) is the family of cryptographic hash functions standardized by NIST. You encounter SHA every day -- Git commit hashes, TLS certificates, blockchain proof-of-work, software checksums. A hash function takes arbitrary input and produces a fixed-size output (the "digest") with a few critical properties: it's deterministic (same input always gives the same output), one-way (you can't recover the input from the hash), collision-resistant (hard to find two different inputs with the same hash), and the output changes dramatically for even tiny input changes (avalanche effect).

## The SHA family tree

**SHA-1** (160-bit digest, 1995): Was the standard for two decades. Now broken. Researchers demonstrated a practical collision attack in 2017 (SHAttered). Git still uses SHA-1 for commit hashes, though there's an ongoing migration to SHA-256. Don't use SHA-1 for anything new.

**SHA-2 family** (2001): The current workhorse. Comes in four sizes:
- SHA-224: 224 bits. Rarely used.
- SHA-256: 256 bits. Most common. Used in TLS, Bitcoin, PGP.
- SHA-384: 384 bits. Higher security.
- SHA-512: 512 bits. Also common, especially on 64-bit platforms where it's faster than SHA-256.

SHA-256 provides 128-bit security against collision attacks and 256-bit against preimage attacks. This is sufficient for all current applications.

**SHA-3** (2015): Not a replacement for SHA-2, but an alternative with a completely different internal design (Keccak sponge construction). For now, SHA-2 is still the default choice. SHA-3 is there if SHA-2 ever develops problems.

## Length extension attacks

SHA-256 (and SHA-512) are vulnerable to length extension attacks: given H(message) and the length of message, you can compute H(message || suffix) without knowing the original message. This is a problem for naive MAC constructions like H(secret || message). If you're building a MAC, use HMAC (which is immune to length extension) or SHA-3 (which isn't vulnerable by design). Don't roll your own secret-prefix hash authentication.

## SHA for passwords? No.

SHA is fast. That's the point. But for password hashing, fast is bad -- you want the hashing to be slow and memory-intensive so attackers can't brute-force at scale. Use bcrypt, Argon2, or scrypt for passwords. Never use SHA-256 or SHA-512 for password storage unless you use it inside PBKDF2 with a high iteration count and a proper salt.

## Practical uses

- **Integrity verification**: Hash a file and compare it to the published hash to verify it hasn't been modified.
- **Commit/tx identifiers**: Git and blockchains use SHA hashes as content-addressed identifiers.
- **Digital signatures**: Sign the SHA hash of a message, not the message itself.
- **Key derivation**: As part of HKDF or PBKDF2.
- **Proof-of-work**: Bitcoin uses double SHA-256.

## Which SHA should you use?

SHA-256 for almost everything. SHA-512 if you're on a 64-bit system and need the extra throughput (SHA-512 processes 64-bit words and can be faster than SHA-256 on 64-bit CPUs). SHA-3 if you want a structurally different alternative. Avoid SHA-1 completely.
