# Random Password Generator — The Thinking Behind It

Weak passwords are still the leading cause of account compromise. Not phishing, not zero-days — just people reusing "Password123!" everywhere. A randomly generated, high-entropy password eliminates that entire category of risk.

## What makes a password strong

It comes down to two things: length and character variety. Here's the math:

| Length + charset | Possible combinations | Brute-force time (rough) |
|-----------------|----------------------|--------------------------|
| 8 chars, digits only | 10^8 | Milliseconds |
| 8 chars, mixed case + digits | 62^8 | Minutes to hours |
| 12 chars, mixed + symbols | 94^12 | Thousands of years |
| 16 chars, mixed + symbols | 94^16 | Billions of years |

Every additional character multiplies the search space by the character set size. Going from 12 to 16 characters isn't 33% stronger — it's 94^4 times stronger.

## How the randomness works

This tool uses `crypto.getRandomValues()` from the Web Crypto API. That's the browser's built-in cryptographically secure PRNG — the same one used for TLS key generation. Its output is unpredictable in the cryptographic sense.

Contrast that with `Math.random()`, which uses a predictable algorithm. You can predict `Math.random()`'s next output if you've observed enough of its previous outputs. Do not use `Math.random()` for anything security-related.

## How the strength meter works

The tool evaluates strength based on a simple combination of length and character set diversity:

- **Weak**: Fewer than 8 characters, or only one character type
- **Medium**: 8-11 characters with at least 2 character types
- **Strong**: 12-15 characters with at least 3 character types
- **Very Strong**: 16+ characters with all 4 character types

This is a heuristic. A 20-character all-lowercase password is actually stronger than an 8-character mixed password, but the meter prioritizes diversity as a proxy for good password hygiene.
