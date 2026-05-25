# Character Code Converter — Technical Background

## Character Encoding Fundamentals

A character encoding maps characters (letters, digits, symbols) to numeric code points, which computers then represent in binary.

## ASCII

**ASCII** (American Standard Code for Information Interchange) was the original 7-bit character encoding, defining 128 characters:
- 0–31: Control characters (non-printable)
- 32–126: Printable characters (letters, digits, punctuation)
- 127: DEL

```
A = 65   a = 97   0 = 48   Space = 32   ! = 33
```

## Unicode

Unicode is the universal character standard, assigning a unique **code point** (U+XXXX) to every character across all writing systems.

- Over **140,000** characters covering 150+ scripts
- Code points range from U+0000 to U+10FFFF

### UTF-8

The most popular Unicode encoding:
- Variable-width: 1 to 4 bytes per character
- ASCII-compatible: the first 128 code points are identical
- `A` = `0x41` (1 byte)
- `€` = `0xE2 0x82 0xAC` (3 bytes)
- `😀` = `0xF0 0x9F 0x98 0x80` (4 bytes)

### UTF-16

Used internally by JavaScript, Java, and Windows:
- 2 or 4 bytes per character
- JavaScript's `String.charCodeAt()` returns UTF-16 code units

### UTF-32

Fixed 4 bytes per character — simple but memory-inefficient.

## HTML Entities

Characters can be represented in HTML as:
- **Named entity**: `&amp;` (= `&`), `&lt;` (= `<`)
- **Decimal reference**: `&#65;` (= `A`)
- **Hex reference**: `&#x41;` (= `A`)

## URL Encoding (Percent Encoding)

Special characters in URLs are encoded as `%XX` where XX is the hex byte value:
- Space = `%20`
- `/` = `%2F`
- `@` = `%40`

