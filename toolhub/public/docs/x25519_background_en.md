# X25519 Technical Background

X25519 is the modern key exchange function designed by Daniel J. Bernstein. It's ECDH done on Curve25519, stripped down to the simplest possible API: take 32 bytes of private key and 32 bytes of public key, output 32 bytes of shared secret. That's it. No curve parameters to choose, no point validation to forget, no timing side channels to worry about.

## Why X25519 exists

Traditional ECDH on NIST curves has footguns. You need to validate that the peer's public key is on the curve, that it's not the point at infinity, that your implementation doesn't leak timing information from conditional branches. Implementations get this wrong all the time. X25519 eliminates these problems by design:

- Every 32-byte string is a valid public key. The curve's clamping operation makes it so.
- The function is naturally constant-time -- no branching on secret data.
- The API surface is minimal -- literally two functions: scalar multiplication and base-point multiplication.

This is why WireGuard exclusively uses X25519. It's also why Signal, WhatsApp, and most modern secure messaging protocols have adopted it.

## Curve25519

The underlying curve is Curve25519: y^2 = x^3 + 486662x^2 + x over the prime field GF(2^255 - 19). The prime was chosen deliberately -- 2^255 - 19 is the largest prime under 2^255 that's congruent to 3 mod 4, which enables efficient square root computation.

The curve has a cofactor of 8, meaning the full group is 8 times the size of the prime-order subgroup. X25519's clamping operation (clearing the low 3 bits and setting the high bit of the private key) ensures you stay in the prime-order subgroup, avoiding small-subgroup attacks.

## X25519 vs Ed25519

These are often confused. Quick distinction:

- **X25519**: Key exchange (Diffie-Hellman). Takes private key and peer's public key, outputs shared secret.
- **Ed25519**: Digital signatures. Takes private key and message, outputs signature.

They use the same underlying curve (Curve25519 and its birationally equivalent Edwards form), and you can convert between X25519 and Ed25519 key pairs. But they're different functions for different purposes. X25519 replaces ECDH; Ed25519 replaces ECDSA.

## Security

X25519 provides ~128 bits of security. A quantum computer running Shor's algorithm would break it, but that's true of all elliptic curve crypto. For a classical attacker, there are no known attacks faster than the generic Pollard's rho algorithm (~2^128 operations).

The 32-byte keys are tiny. An X25519 public key fits in a single tweet. This compactness matters for embedded protocols, QR codes, and anything bandwidth-constrained.

## Adoption

X25519 is now mandatory in TLS 1.3. It's the only key exchange mechanism in WireGuard. The Noise protocol framework defaults to it. libsodium, Go's standard library, Rust's x25519-dalek crate, and every major crypto library support it. For new key exchange implementations, there's very little reason to use anything else.
