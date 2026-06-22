# ECDSA Technical Background

ECDSA (Elliptic Curve Digital Signature Algorithm) is the elliptic curve version of DSA. It's the signature scheme used by Bitcoin, Ethereum, TLS certificates, and countless other systems. ECDSA produces signatures that prove you hold a private key without revealing it, using the elliptic curve discrete logarithm problem for security.

## The nonce problem

ECDSA has one critical vulnerability that you need to know about: the signing nonce (usually called `k`) must be unique, unpredictable, and never reused for a given private key. If you sign two different messages with the same `k` and the same private key, anyone can recover your private key from the two signatures with basic algebra.

This has happened in production: the PlayStation 3's signing key was extracted because Sony's implementation used a fixed `k` value. Multiple Bitcoin wallets have lost funds to nonce-reuse attacks. Android's Java `SecureRandom` once had a bug that produced predictable `k` values, breaking ECDSA on affected devices.

Modern implementations use RFC 6979 deterministic ECDSA, which derives `k` from the private key and message hash using HMAC, making nonce reuse impossible by construction. This is what you should use.

## Key and signature sizes

A 256-bit ECDSA key (P-256 curve) gives you ~128 bits of security. Signatures are typically 70-72 bytes when DER-encoded (the standard format), or 64 bytes in raw `r||s` form.

Compare this to RSA: a 2048-bit RSA key gives ~112 bits of security and produces 256-byte signatures. ECDSA is dramatically more compact.

## Choosing a curve

The same curve selection rules apply as for ECDH:

- **NIST P-256**: The workhorse. Every library supports it. 128-bit security.
- **secp256k1**: The Bitcoin curve. Only notable because of Bitcoin's network effect.
- **Ed25519**: If you're starting fresh, use Ed25519 instead of ECDSA. It fixes ECDSA's nonce problem, produces smaller signatures (64 bytes flat), and is faster to verify.

The tool on this site supports ECDSA on standard curves. For general-purpose signing in new projects, reach for Ed25519 first.

## How an ECDSA signature is verified

Verification checks whether `s * G = (hash * r^-1) * public_key + (r * s^-1) * G` (roughly). It's two scalar multiplications and some modular arithmetic. The key property: only someone who knows the private key can produce an `s` that satisfies this equation for a given message.

## PS3, Bitcoin, and real-world failures

The ECDSA nonce problem isn't theoretical. In 2010, the PS3's ECDSA implementation used a static `k`. Hackers extracted Sony's private key, gaining the ability to sign any software as authentic Sony code. In 2013, Android's `SecureRandom` bug caused multiple Bitcoin wallets to reuse `k` values; attackers scanned the blockchain for transactions with repeated `r` values and drained those wallets.

The lesson: use a library that handles nonce generation safely (deterministic RFC 6979 mode), or better yet, use Ed25519 and sidestep the problem entirely.
