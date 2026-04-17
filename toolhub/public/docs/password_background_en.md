# Random Password Generator — Background

## Why Password Security Matters

Weak passwords are one of the leading causes of account compromise. Research shows that randomly generated, high-entropy passwords effectively resist brute-force and dictionary attacks.

## Password Strength Criteria

| Length | Charset | Theoretical Cracking Time |
|--------|---------|--------------------------|
| 8 chars, digits only | 10 chars | Milliseconds |
| 8 chars, alphanumeric | 62 chars | Minutes |
| 12 chars, mixed + symbols | 94 chars | Thousands of years |
| 16 chars, mixed + symbols | 94 chars | Hundreds of millions of years |

## Randomness Security

This tool uses `crypto.getRandomValues()` (Web Crypto API), a cryptographically secure pseudorandom number generator (CSPRNG) built into the browser. The values it produces are non-predictable and suitable for security-sensitive use cases like passwords and tokens.

`Math.random()` should never be used for password generation because it relies on a predictable algorithm.

## Strength Rating Rules

The tool combines password length and charset diversity:

- **Weak**: Length < 8 or only one character type
- **Medium**: Length 8–11 + 2 or more character types
- **Strong**: Length 12–15 + 3 character types
- **Very Strong**: Length 16+ + 4 character types

