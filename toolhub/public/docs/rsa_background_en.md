# RSA Technical Background

RSA is the original public-key cryptosystem, published by Ron Rivest, Adi Shamir, and Leonard Adleman in 1977 (the same year DES came out). It was the first algorithm to do both encryption and digital signatures with separate public and private keys, and it's still everywhere -- TLS certificates, SSH keys, GPG, JWTs. But it's increasingly being replaced by elliptic curve cryptography, which offers equivalent security with dramatically smaller keys.

## How it works, simply

RSA's security rests on the difficulty of factoring large numbers. Generate two large prime numbers p and q, multiply them to get n = p * q, and choose a public exponent e (typically 65537). The public key is (n, e). The private key is d, computed from e and the totient of n, such that e * d ≡ 1 (mod φ(n)).

Encryption: ciphertext = message^e mod n. Decryption: message = ciphertext^d mod n. Without knowing p and q (and thus being able to compute d), an attacker would need to factor n -- which for a 2048-bit number is computationally infeasible with today's technology.

## Key sizes and what they mean

RSA keys need to be large because factoring attacks keep improving:

| Key size | Security | Status |
|----------|----------|--------|
| 1024-bit | ~80 bits | Broken/deprecated |
| 2048-bit | ~112 bits | Minimum for current use |
| 3072-bit | ~128 bits | Recommended by NIST |
| 4096-bit | ~140 bits | Overkill for most apps |

A 256-bit ECC key provides the same security as a 3072-bit RSA key. This is why SSL certificate authorities have largely switched to ECC -- smaller keys mean faster handshakes and less bandwidth.

## RSA encryption in practice

Nobody encrypts messages directly with RSA. It's slow, it can only encrypt data smaller than the key size minus padding, and textbook RSA (without padding) is insecure. The standard approach is hybrid encryption: generate a random AES key, encrypt the actual data with AES, and encrypt the AES key with RSA.

The padding scheme matters enormously. OAEP (Optimal Asymmetric Encryption Padding) is the current standard. PKCS#1 v1.5 padding is older and has known vulnerabilities (Bleichenbacher's attack).

## RSA signatures

RSA signing reverses the operation: the signer computes signature = hash(message)^d mod n, and anyone with the public key verifies with hash(message) ≡ signature^e mod n. RSA-PSS (Probabilistic Signature Scheme) is the modern padding standard; PKCS#1 v1.5 signatures are still widely used but less secure.

## RSA vs ECC

For new projects, ECC (Ed25519 for signatures, X25519 for key exchange) is the better choice. Keys are smaller, operations are faster, and the implementation is harder to get wrong. RSA's main remaining advantage is compatibility -- every system that does public-key crypto supports RSA, and some legacy systems only support RSA.

If you're generating an RSA key, use at least 2048 bits (3072 if you're cautious). Never use 1024-bit RSA keys -- they've been publicly factored.
