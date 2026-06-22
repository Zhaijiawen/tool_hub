# bcrypt Technical Background

bcrypt is the old guard of password hashing -- it's been around since 1999, designed by Niels Provos and David Mazières, and it's still a solid choice even if Argon2 is technically the newer, fancier option. It was built to fix the fundamental problem with password storage: if you just hash passwords with SHA-1 or MD5, an attacker who gets your database can run through billions of guesses per second on a GPU. bcrypt makes that slow. Deliberately, beautifully slow.

## Built on Blowfish, but not in the way you might think

bcrypt uses the Blowfish block cipher as its core primitive, but it doesn't use it for encryption in the normal sense. Instead, it takes advantage of Blowfish's notoriously expensive key schedule -- the process of initializing the cipher's internal state (the P-array and S-boxes) from a key. Normal Blowfish does this once. bcrypt's "EksBlowfish" variant does it 2^cost times, where "cost" is the work factor you choose.

The algorithm then encrypts the 24-byte string "OrpheanBeholderScryDoubt" (yes, that's really the constant -- 1999 was a different time) with this expensive-to-set-up cipher, and the output becomes your password hash, mixed together with the salt and work factor into a standard 60-character string.

## The work factor is everything

Here's the key insight that makes bcrypt work: the cost parameter is exponential. A work factor of 10 means 2^10 = 1,024 iterations of the key schedule. A work factor of 12 means 4,096. Each increment doubles the time. In 1999, a work factor of 6 was considered reasonable. Today, 12 is the practical minimum for production, and if you're building something new, 13 or 14 is better if your hardware can handle it.

The genius of embedding the work factor in the hash string itself (that `$2b$12$...` format) is that you can transparently upgrade. When hardware gets faster, your login function checks the stored work factor and re-hashes with a higher value on successful login. Users don't notice; attackers suffer.

One thing that trips people up: bcrypt has a maximum password length of 72 bytes. Anything beyond that is silently truncated. If your users have passphrases longer than 72 characters (which honestly they shouldn't, but some password managers generate them), you should pre-hash with SHA-256 or SHA-512 before passing to bcrypt. This is the "bcrypt + SHA" pattern and it's widely used.

## Why it resists GPUs and ASICs

bcrypt was designed before GPU password cracking was the dominant threat, but it turned out to be surprisingly resistant. The reason is memory access patterns. bcrypt's key schedule requires repeatedly reading from and writing to 4 KB of state (the Blowfish S-boxes and P-array), and these accesses are data-dependent -- you can't predict in advance which bytes you'll need next. GPUs have thousands of cores but very little fast local memory per core; a GPU trying to crack bcrypt hashes runs into a memory bandwidth bottleneck, not a compute bottleneck.

This is essentially the same intuition that Argon2 formalized 16 years later with its explicit "memory-hard" design. bcrypt got there first, though with a much smaller memory footprint (4 KB vs. Argon2's 64-512 MB). The smaller footprint means bcrypt is less resistant to ASIC attacks than Argon2 is, but it's still vastly better than PBKDF2 or raw SHA hashing.

## The $2a$ vs $2b$ thing

You'll sometimes see bcrypt hashes starting with `$2a$` and sometimes `$2b$`. The `2a` variant had a bug in the original 1999 implementation (related to handling of non-ASCII characters and a signed/unsigned issue in the password length check). The `2b` variant, standardized by OpenBSD in 2014, fixed this. Some implementations use `$2y$` (PHP did this for a while) and `$2x$` (for the intentionally broken variant used in some testing suites). For new code, `$2b$` is what you want, and any modern library should use it by default.

## Should you still use bcrypt?

For new projects, Argon2id is the better choice -- it's more resistant to ASIC attacks, handles long passwords natively, and gives you more tuning knobs. But bcrypt is still fine. It's battle-tested (25 years of real-world attacks), every language has a well-audited implementation, and the 72-byte password limit is rarely a problem in practice. If you're maintaining a system that already uses bcrypt, there's no urgent need to migrate. If you're building new and have the choice, Argon2id edges it out, but bcrypt isn't wrong.

The real mistake is using anything weaker: MD5, SHA-1, unsalted SHA-256, or -- heaven forbid -- storing passwords in plain text. bcrypt is the floor, not the ceiling, of password security.
