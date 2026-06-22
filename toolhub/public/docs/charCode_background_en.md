# Character Codes: What's Behind Every Letter You Type

Every character you see on screen is a number underneath. Character encodings are the mapping from those numbers to the glyphs you actually see. Understanding this mapping is essential when you're debugging encoding issues, working with regular expressions, or dealing with URLs.

## ASCII: The Original 7-bit World

ASCII defined 128 characters using 7 bits. It's the common ancestor of almost every encoding you'll encounter:

- 0-31: Control characters (non-printable stuff like newline, tab, null)
- 32-126: Printable characters -- letters, digits, punctuation
- 127: DEL

```
A = 65    a = 97    0 = 48    Space = 32    ! = 33
```

If you've ever wondered why `'a' > 'A'` in JavaScript, now you know -- lowercase letters have higher code points.

## Unicode: The Universal Character Set

Unicode is the standard that covers pretty much every writing system on the planet. Over 140,000 characters across 150+ scripts, each with a unique code point like `U+0041` for `A`.

### UTF-8: The One That Won

UTF-8 is everywhere -- the web, filesystems, APIs. It's variable-width: 1 byte for ASCII characters, up to 4 bytes for things like emoji. Crucially, it's backwards-compatible with ASCII.

```
A  = 0x41                    (1 byte -- same as ASCII)
€  = 0xE2 0x82 0xAC         (3 bytes)
😀 = 0xF0 0x9F 0x98 0x80    (4 bytes)
```

### UTF-16: What JavaScript Uses Internally

JavaScript strings are sequences of UTF-16 code units. Most characters fit in one 16-bit unit, but characters outside the Basic Multilingual Plane (like many emoji) need two -- that's what surrogate pairs are about. This is why `'😀'.length` returns 2 in JavaScript even though it's one visible character.

### URL Encoding (Percent Encoding)

Characters that aren't allowed in URLs get encoded as `%XX` where XX is the hex byte value:

- Space = `%20`
- `/` = `%2F`
- `@` = `%40`

### HTML Entities

HTML gives you a few ways to represent characters:

- Named: `&amp;` for `&`, `&lt;` for `<`
- Decimal: `&#65;` = `A`
- Hex: `&#x41;` = `A`

These are critical for preventing XSS -- if user input gets rendered as HTML without entity encoding, you've got a security problem.
