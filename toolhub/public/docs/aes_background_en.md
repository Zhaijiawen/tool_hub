# AES Technical Background

AES -- the Advanced Encryption Standard -- is the symmetric block cipher that pretty much everything uses these days. If you've ever made an HTTPS request, unlocked a password manager, or used a VPN, you've relied on AES without thinking about it. It was standardized by NIST back in 2001 after a multi-year competition, and the winner was a cipher called Rijndael, cooked up by two Belgian cryptographers, Joan Daemen and Vincent Rijmen.

## How the competition went down

The story is worth knowing because it tells you why AES ended up the way it did. In 1997, NIST put out a call: DES was getting long in the tooth (56-bit keys? in the 90s?), and they needed something that could hold up for decades. Fifteen teams submitted candidates. By 1999 they'd narrowed it to five finalists -- MARS, RC6, Rijndael, Serpent, and Twofish -- and in 2000, Rijndael took it.

The judges cared about more than just raw security. They wanted something that ran fast on 8-bit microcontrollers and beefy servers alike, something simple enough that people could actually implement it correctly, and something that didn't use too much memory or power. Rijndael checked all those boxes, and twenty-plus years later, the choice has held up remarkably well. Nobody has broken AES in any practical sense -- the best known attack is a related-key attack on AES-256 that reduces complexity from 2^256 to about 2^99.5, which is a theoretical earthquake but utterly useless in practice because it requires the attacker to have access to relationships between keys you're never going to create in a real system.

## The block and the key

AES always works on 128-bit blocks -- that's 16 bytes, no more, no less. But the key can be one of three sizes:

- **AES-128**: 128-bit key, 10 rounds of transformations
- **AES-192**: 192-bit key, 12 rounds
- **AES-256**: 256-bit key, 14 rounds

More rounds means more security margin, but also more computation. For most things, AES-128 is still perfectly fine -- there's no known attack that meaningfully threatens it, even with Grover's algorithm in a hypothetical quantum future (which would just cut the effective security to 64 bits, still requiring 2^64 operations that nobody can run). AES-256 is what you reach for when you're encrypting something that needs to stay secret for decades, or when compliance says you have to.

Internally, that 16-byte block gets arranged as a 4x4 grid called the state array. Every round shuffles it through four operations:

```
SubBytes   -- each byte goes through a lookup table (the S-box) that's carefully designed to be non-linear
ShiftRows  -- rows get cyclically shifted by different amounts
MixColumns -- columns get mixed together with matrix multiplication in a finite field
AddRoundKey -- XOR the whole state with a round key derived from your original key
```

The first round skips straight to AddRoundKey, and the last round drops MixColumns (which would be redundant at that point). Decryption runs the inverse of each step in reverse order -- InvShiftRows, InvSubBytes, AddRoundKey, then InvMixColumns for the main rounds.

## Where the real design magic lives

The S-box deserves a moment of appreciation. It's a 256-entry lookup table, but it's not arbitrary -- every entry is computed as the multiplicative inverse in GF(2^8) followed by an affine transformation. That mathematical foundation is what gives AES its resistance to differential and linear cryptanalysis, the two big guns of block cipher attacks. The ShiftRows and MixColumns steps provide diffusion: change one input bit and roughly half the output bits should flip (the avalanche effect). This combination of substitution (confusion) and permutation (diffusion) is the classic Shannon recipe for a good cipher, and AES executes it beautifully.

## Modes of operation matter more than the cipher

Here's something I wish someone had told me when I first started doing crypto: the cipher itself is rarely the weak point. The mode you use it in is where things go wrong. Plain AES encrypts exactly one 16-byte block at a time. To encrypt anything longer, you need a mode of operation.

**ECB (Electronic Codebook)** is the one you should probably never use. Each block is encrypted independently with the same key. Identical plaintext blocks produce identical ciphertext blocks. If you've seen that famous picture of the Linux penguin where you can still make out the shape after ECB encryption -- that's why. ECB leaks patterns, and pattern leakage is a security failure.

**CBC (Cipher Block Chaining)** fixes this by XORing each plaintext block with the previous ciphertext block before encrypting. You also need a random initialization vector (IV) for the first block. It's been the workhorse mode for decades, but it's not authenticated -- someone can tamper with ciphertext and you won't know. Also, encryption is strictly sequential (you can't parallelize), though decryption can run in parallel.

**CTR (Counter)** turns AES into a stream cipher. You encrypt a counter value and XOR the output with plaintext. Each block is independent, so you can encrypt and decrypt in parallel. Great for high-throughput scenarios, but you must never reuse the same counter with the same key -- that's a catastrophic failure mode.

**GCM (Galois/Counter Mode)** is the modern default for a reason. It's CTR mode plus an authentication tag computed using Galois field multiplication. That means you get both encryption and integrity in one pass, and it's fast in hardware (though the software performance can be iffy on some platforms without carryless multiplication instructions). GCM is what TLS 1.3 uses, what WireGuard uses, what most modern protocols have settled on. The one gotcha: nonce reuse is absolutely fatal -- it can reveal the authentication key and break both confidentiality and integrity.

## Performance and hardware

On anything made in the last decade, your CPU probably has AES-NI instructions that run AES rounds in dedicated hardware. This takes AES from "pretty fast" to "basically free" -- we're talking gigabytes per second on a single core. Software fallbacks exist everywhere (OpenSSL, Crypto++, Bouncy Castle, Go's standard library, Rust's aes crate), but they're one to two orders of magnitude slower. For mobile and embedded, ARM has its own AES extensions.

One thing people don't think about enough: side channels. Software AES without constant-time lookups can leak key material through cache timing. The S-box lookup is a textbook example -- if the lookup address depends on secret data, an attacker measuring cache access patterns can recover the key. Modern libraries handle this by using bitsliced implementations or relying on hardware AES where possible, but if you're rolling your own for some reason, you need to care about this.

## Where AES goes from here

AES is going to be around for a long time. Even in a post-quantum world, as I mentioned, Grover's algorithm just cuts the effective key size in half -- so AES-256 would still offer 128-bit security against a quantum attacker, which is plenty. The real threats to AES deployments aren't mathematical breaks; they're implementation bugs, side channels, and misuse of modes and IVs. Use a well-vetted library, pick GCM or CBC+HMAC, generate IVs from a proper CSPRNG, and you'll be fine.
