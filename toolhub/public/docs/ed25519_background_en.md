# Ed25519 Technical Background

Ed25519 is, in my opinion, the best general-purpose digital signature algorithm available today. It's fast, produces compact signatures (64 bytes), eliminates the nonce-reuse disasters that plague ECDSA, and the design is deliberately simple so implementations are hard to get wrong. If you're building something new that needs signatures, Ed25519 should be your default unless you have a specific reason to choose something else.

## The Bernstein crypto philosophy

Daniel J. Bernstein (djb) is something of a folk hero in applied cryptography. He designs algorithms with a consistent philosophy: make them fast in software with no special hardware, make them constant-time so timing attacks don't apply, and make them simple enough that a competent programmer can implement them correctly from the specification. Ed25519 is a perfect example of this philosophy in action.

The signature scheme is built on the Edwards curve edwards25519 (birationally equivalent to Curve25519). Edwards curves have a beautiful property: the addition formulas are "unified" -- the same math works for adding two distinct points and for doubling a point. This eliminates the need for branching logic based on whether points are equal, which is one of the classic side-channel vulnerabilities in ECDSA implementations.

## How Ed25519 signatures work

The scheme uses SHA-512 extensively (this is the "Ed" in EdDSA -- the Edwards-curve variant of Schnorr signatures using a hash function):

**Key generation** is dead simple. A 32-byte random seed is hashed with SHA-512. The lower 32 bytes become the private scalar (clamped to avoid small-subgroup attacks), and the upper 32 bytes are used as a prefix for signature nonce generation. The public key is the private scalar times the base point.

**Signing** is deterministic -- there's no random nonce to manage. The signature nonce is derived as SHA-512(prefix || message), where the prefix is the upper half of the SHA-512 output from key generation. This is the killer feature: because the nonce is deterministic, you can never accidentally reuse a nonce. The ECDSA private-key-extraction-from-nonce-reuse attack simply doesn't apply to Ed25519.

The signature itself is (R, s) -- the point R = rG (where r is the deterministic nonce), and s = r + H(R || A || M) * a (mod l), where a is the private key, A is the public key, M is the message, and l is the curve order. Total size: 64 bytes.

**Verification** checks whether sG = R + H(R || A || M) * A. It's two scalar multiplications and a hash -- very fast.

## Why 64 bytes is a great signature size

For comparison: a 256-bit ECDSA signature is typically 70-72 bytes (DER-encoded) or 64 bytes (raw r||s). An RSA-2048 signature is 256 bytes. Ed25519's 64 bytes is hard to beat. That compactness matters when you're putting signatures in HTTP headers, in blockchain transactions (where every byte costs gas), or in embedded protocols with tight MTU limits.

## Batch verification -- the hidden superpower

Ed25519 supports batch verification: you can verify dozens or hundreds of signatures in roughly the same time it takes to verify two individually. The trick is that verification checks sG - H(R||A||M)A = R, and you can sum up these equations across multiple signatures and check one big equation using multi-scalar multiplication. This is a big deal for blockchain nodes, certificate transparency logs, and any system that verifies many signatures.

Most crypto libraries expose batch verification as an option. It does have slightly different failure modes (a single bad signature in a batch can be masked by a carefully crafted set of other signatures), so you need to decide whether the performance gain is worth the subtle security trade-off. For high-throughput verification of signatures you already trust to be mostly valid, it's a great optimization.

## Adoption and ecosystem

Ed25519 is everywhere now. SSH supports it natively and recommends it over RSA and ECDSA. TLS 1.3 includes Ed25519 in the default supported signature algorithms. The Signal protocol uses it for identity keys. Monero, Solana, and several other cryptocurrencies use Ed25519 for transaction signing. GPG supports it. The only major holdout for a while was WebAuthn/FIDO2, and even that is adding Ed25519 support.

If you're starting from scratch, Ed25519 is the obvious choice. If you're maintaining an existing ECDSA system, a migration to Ed25519 is worth planning for (both algorithms can coexist -- you just add Ed25519 public keys alongside existing ECDSA keys and prefer them when both are available).
