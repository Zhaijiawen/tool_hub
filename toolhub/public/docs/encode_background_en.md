# Encoding Schemes -- What They Are and Why They Matter

Encoding is often confused with encryption, but they're completely different things. Encoding transforms data into a different representation for transport or storage -- it doesn't hide information, it just changes its format. Base64, Base32, URL encoding, hex encoding: these are all encoding schemes. Anyone can decode them because there's no secret key.

## Base64

Base64 is the most common binary-to-text encoding. Every 3 bytes of input become 4 ASCII characters from a 64-character alphabet (A-Z, a-z, 0-9, +, /). This makes binary data safe for text-only channels like email (MIME), JSON, XML, and HTTP headers.

The math: 3 bytes = 24 bits. Split into four 6-bit chunks (2^6 = 64, hence "Base64"). Each 6-bit value maps to a character in the alphabet. If the input isn't a multiple of 3 bytes, padding with `=` characters fills it out. Two `=` signs means one byte of padding, one `=` means two bytes.

The standard variant uses `+` and `/` as the last two characters, with `=` for padding. For URLs, Base64url replaces `+` with `-` and `/` with `_`, and often omits padding. This is what JWTs use.

A common mistake: thinking Base64 provides any security. It doesn't. You can decode Base64 with a single line of code in any language. It's purely a transport encoding.

## Hex encoding

Hex (hexadecimal) encodes each byte as two hex digits (0-9, a-f). A byte with value 255 becomes `ff`. Hex strings are twice as long as the original data, which makes them less efficient than Base64 for large data, but they're much more human-readable. Debugging tools, hash displays, and cryptographic keys almost always use hex.

## URL encoding (percent-encoding)

URL encoding replaces unsafe characters with `%` followed by their hex ASCII value. A space becomes `%20`, a `#` becomes `%23`. This is what lets you put arbitrary data in a URL query string without breaking the URL syntax.

## Base32 and other variants

Base32 uses a 32-character alphabet (A-Z, 2-7), encoding 5 bits per character. It's less efficient than Base64 but avoids case-sensitivity and visually ambiguous characters (no 0/O or 1/I/l confusion). It's used in things like OTP secrets and some DNS-related encodings.

## Encoding vs. encryption vs. hashing

This distinction trips people up constantly:

- **Encoding**: Reversible with no key. Base64, hex, URL encoding. Just changes the format.
- **Encryption**: Reversible with a key. AES, ChaCha20. Hides the content.
- **Hashing**: One-way. SHA-256, bcrypt. Can't be reversed (by design).

If you're storing passwords, use hashing (bcrypt/Argon2), not encoding. If you're protecting data, use encryption (AES), not encoding. Encoding is for transporting data safely through text-only channels -- nothing more.
