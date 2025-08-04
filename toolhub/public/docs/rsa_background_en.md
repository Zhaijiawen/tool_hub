# RSA Technical Background

## Overview
RSA (Rivest-Shamir-Adleman) is a widely-used public-key cryptosystem that provides both encryption and digital signature capabilities. Named after its creators Ron Rivest, Adi Shamir, and Leonard Adleman, RSA is based on the mathematical difficulty of factoring large composite numbers. It was first published in 1977 and remains one of the most important cryptographic algorithms in modern security systems.

## Mathematical Foundation

### Core Principle
RSA security relies on the computational difficulty of factoring the product of two large prime numbers. The problem of finding the prime factors of a large composite number is believed to be computationally infeasible for sufficiently large numbers, making RSA secure against classical attacks.

### Key Mathematical Concepts
- **Prime Numbers**: Large prime numbers p and q are the foundation
- **Euler's Totient Function**: φ(n) = (p-1)(q-1) for n = pq
- **Modular Arithmetic**: All operations are performed modulo n
- **Fermat's Little Theorem**: Basis for the encryption/decryption process

## Algorithm Structure

### Key Generation
1. **Prime Selection**: Choose two large prime numbers p and q
2. **Modulus Calculation**: Compute n = p × q
3. **Totient Calculation**: Compute φ(n) = (p-1)(q-1)
4. **Public Exponent**: Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
5. **Private Exponent**: Calculate d such that d × e ≡ 1 (mod φ(n))

### Encryption Process
- **Public Key**: (n, e)
- **Ciphertext**: c = m^e mod n
- **Message**: m must satisfy 0 ≤ m < n

### Decryption Process
- **Private Key**: (n, d)
- **Plaintext**: m = c^d mod n

## Security Analysis

### Known Attacks
- **Factorization Attacks**: Attempt to factor n into p and q
- **Timing Attacks**: Exploit timing variations in modular exponentiation
- **Chosen Ciphertext Attacks**: Exploit properties of RSA padding
- **Side-Channel Attacks**: Exploit physical implementation weaknesses

### Security Parameters
- **Key Size**: Currently recommended minimum is 2048 bits
- **Prime Size**: Each prime should be at least 1024 bits
- **Exponent**: Common choices are e = 3, 17, or 65537

## Implementation Considerations

### Padding Schemes
- **PKCS#1 v1.5**: Legacy padding scheme with known vulnerabilities
- **OAEP (Optimal Asymmetric Encryption Padding)**: Recommended padding scheme
- **PSS (Probabilistic Signature Scheme)**: For digital signatures

### Performance Characteristics
- **Encryption**: Relatively fast with small public exponent
- **Decryption**: Slower due to large private exponent
- **Key Generation**: Most computationally expensive operation

## Standards and Compliance

### NIST Guidelines
- **FIPS 186-4**: Digital Signature Standard
- **SP 800-56B**: Key establishment using integer factorization
- **SP 800-57**: Key management recommendations

### Industry Standards
- **PKCS#1**: RSA cryptography standard
- **RFC 8017**: PKCS#1 v2.2 specification
- **ISO/IEC 9796**: Digital signature schemes

## Applications and Use Cases

### Primary Applications
- **Digital Signatures**: Document and message authentication
- **Key Exchange**: Secure key establishment protocols
- **Hybrid Encryption**: Combined with symmetric ciphers
- **Certificate Authorities**: X.509 certificate infrastructure

### Real-World Usage
- **SSL/TLS**: Secure web communications
- **SSH**: Secure remote access
- **PGP/GPG**: Email encryption and signing
- **Smart Cards**: Identity and payment systems

## Historical Development

### Timeline
- **1977**: RSA algorithm first published
- **1983**: MIT patent granted for RSA
- **1990s**: Widespread adoption in internet protocols
- **2000**: Patent expiration, open implementation
- **2000s**: Transition to larger key sizes
- **2010s**: Post-quantum cryptography research begins

### Evolution
- **Key Sizes**: From 512 bits to 2048+ bits
- **Padding**: From simple padding to OAEP
- **Implementation**: From software-only to hardware acceleration
- **Standards**: From academic papers to formal standards

## Future Considerations

### Quantum Computing Threat
- **Shor's Algorithm**: Can factor large numbers efficiently
- **Key Size Impact**: Current key sizes become insecure
- **Migration Timeline**: 10-20 year transition period
- **Post-Quantum Alternatives**: Lattice-based, hash-based, code-based

### Current Research
- **Post-Quantum RSA**: RSA with larger key sizes
- **Hybrid Schemes**: Combining classical and post-quantum
- **Implementation Security**: Side-channel resistance
- **Performance Optimization**: Faster key generation and operations 