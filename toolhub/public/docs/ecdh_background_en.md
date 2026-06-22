# ECDH Technical Background

ECDH (Elliptic Curve Diffie-Hellman) is the elliptic curve version of the classic Diffie-Hellman key exchange. Instead of doing math modulo a large prime (as in traditional DH), ECDH does math on an elliptic curve. The result is the same capability -- two parties agree on a shared secret over a public channel -- but with much smaller keys. A 256-bit ECDH key provides roughly the same security as a 3,072-bit traditional DH key.

## How it works

Alice generates a private key (a random number) and computes her public key by multiplying the curve's generator point by that number: `A = a * G`. Bob does the same: `B = b * G`. They exchange public keys. Then Alice computes `a * B = a * b * G`, and Bob computes `b * A = b * a * G`. They both arrive at the same point on the curve -- the shared secret.

An eavesdropper sees `A` and `B` but can't compute `a * b * G` without knowing either `a` or `b`. That's the elliptic curve discrete logarithm problem (ECDLP), and it's believed to be computationally intractable for classical computers.

## Curve choice matters enormously

Not all curves are created equal. The safe choices for ECDH today are:

- **Curve25519** (Bernstein, RFC 7748): Designed specifically for ECDH. Fast, constant-time, deliberately hard to implement incorrectly. This is what WireGuard, Signal, and modern TLS use. The curve parameters are completely transparent (p = 2^255 - 19).

- **NIST P-256** (secp256r1): The traditional choice, still widely used and considered secure. Some people are suspicious of NIST curves after the Dual_EC_DRBG backdoor scandal, but P-256 has been independently analyzed.

For new projects, Curve25519 is the clear recommendation. It eliminates entire classes of implementation mistakes (invalid curve attacks, small-subgroup attacks, timing leaks) that P-256 implementations can suffer from.

## From shared secret to encryption key

The raw ECDH shared secret is an elliptic curve point, not a byte string. You typically take the x-coordinate of the shared point, then pass it through a key derivation function (KDF) like HKDF to produce a symmetric key suitable for AES or ChaCha20. Don't use the raw x-coordinate directly as a key -- KDFs exist for a reason, and skipping this step is a common crypto mistake.

## Forward secrecy

ECDH provides forward secrecy when you use ephemeral keys -- generate new key pairs for each session and throw them away afterward. Even if your long-term key is later compromised, past session keys can't be recovered because the ephemeral private keys are gone. This is why TLS 1.3 mandates ephemeral key exchange and dropped static RSA key exchange entirely.

## ECDH vs X25519

X25519 is a specific ECDH function built on Curve25519. It's ECDH done right -- a minimal API that takes a private key (32 bytes) and a public key (32 bytes), and returns a shared secret (32 bytes). No curve parameters to configure, no point validation to miss. If you're implementing key exchange today, use X25519 directly. The "ECDH" tool on this site uses standard ECDH on NIST curves; the separate X25519 tool handles the modern variant.
