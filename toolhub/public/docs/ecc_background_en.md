# Elliptic Curve Cryptography (ECC) Background

Elliptic Curve Cryptography is one of the most important innovations in public-key crypto from the last few decades. The key insight, independently discovered by Neal Koblitz and Victor Miller in 1985, is that the math of elliptic curves over finite fields gives you the same cryptographic properties as RSA (difficulty of reversing certain operations) but with dramatically smaller keys. A 256-bit ECC key gives you roughly the same security as a 3,072-bit RSA key. In a world where we do crypto on phones, smart cards, and IoT sensors, that size difference matters enormously.

## The curve, intuitively

An elliptic curve has nothing to do with ellipses -- the name comes from their historical connection to elliptic integrals. For crypto purposes, an elliptic curve is the set of points (x, y) satisfying y^2 = x^3 + ax + b over some finite field, plus a "point at infinity" that serves as the identity element.

The magic is that you can define addition on these points. Draw a line through two points on the curve; it hits the curve at a third point. Reflect that point across the x-axis, and you've defined P + Q. If you draw a tangent line at a point (adding it to itself), you get scalar multiplication: P, 2P, 3P, and so on.

Scalar multiplication is a one-way function. Given a point P and a scalar k, computing kP is fast (using the double-and-add algorithm, similar to exponentiation). Given P and kP, finding k -- the elliptic curve discrete logarithm problem (ECDLP) -- has no known efficient solution on classical computers. That's the entire security basis of ECC.

## Curves matter more than you'd think

Not all curves are created equal, and bad curves have caused real security failures. The most infamous example is Dual_EC_DRBG, a NIST-standardized random number generator that contained a backdoor structured through carefully chosen curve parameters. The lesson: use curves with transparent, verifiable parameter generation.

The safe choices today:

- **Curve25519** (Bernstein, 2005): Designed for Diffie-Hellman key exchange. Parameters chosen with absolute transparency (p = 2^255 - 19, the largest prime under 2^255 that's 3 mod 4). Fast, constant-time, and virtually impossible to implement incorrectly. Used by WireGuard, Signal, TLS 1.3.
- **Ed25519**: The Edwards-curve version of Curve25519, optimized for digital signatures. 64-byte signatures, deterministic (no random nonce to screw up), fast verification.
- **NIST P-256** (secp256r1): The traditional choice, standardized by NIST and used everywhere. Some people distrust NIST curves after Dual_EC_DRBG, but P-256 has been independently analyzed and is considered secure. The curve parameters are verifiable (derived from SHA-1 hashes of a seed), unlike the mysterious Dual_EC constants.

For new projects, Curve25519/Ed25519 is what most cryptographers recommend. The design explicitly prevents the implementation mistakes that have plagued ECDSA (nonce reuse, biased nonces, timing leaks).

## ECDH and ECDSA: the two main protocols

ECC provides two primary operations:

**ECDH (Elliptic Curve Diffie-Hellman)** for key exchange. Alice has private key a and public key aG. Bob has b and bG. Alice computes a(bG), Bob computes b(aG), and they both get abG -- the shared secret. An eavesdropper who sees aG and bG can't compute abG without solving ECDLP.

**ECDSA (Elliptic Curve Digital Signature Algorithm)** for signing. Generate a random nonce k, compute kG (take its x-coordinate as r), compute s = k^-1 * (hash + r * private_key) mod n. The signature is (r, s). Verification checks whether a particular equation involving the public key, r, and s holds.

ECDSA has a critical footgun: if you reuse the nonce k across two signatures with the same key, an attacker can recover your private key from the two signatures using simple algebra. This has happened in the wild (the PlayStation 3 signing key was extracted this way). Ed25519 fixes this by making the nonce deterministic -- derived from the private key and message hash -- so nonce reuse is impossible by construction.

## Quantum considerations

ECC is not post-quantum. Shor's algorithm, running on a sufficiently large quantum computer, can solve ECDLP in polynomial time, completely breaking ECC. When usable quantum computers arrive (best estimates: 10-20 years for cryptographically relevant ones), ECC keys will be as insecure as 56-bit DES keys are today.

The migration to post-quantum cryptography is underway (NIST is standardizing lattice-based algorithms), but in the meantime, ECC remains the practical best choice for performance-sensitive public-key operations.
