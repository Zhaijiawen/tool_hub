# Character Code Examples

Quick reference for common characters and their encodings across formats.

## Basic Latin

| Character | Decimal | Hex | HTML Entity | URL Encoded |
|---|---|---|---|---|
| `A` | 65 | 41 | `&#65;` | `%41` |
| `a` | 97 | 61 | `&#97;` | `%61` |
| `0` | 48 | 30 | `&#48;` | `%30` |
| Space | 32 | 20 | `&#32;` | `%20` |

Note the pattern: uppercase A-Z is 65-90, lowercase a-z is 97-122, digits 0-9 are 48-57. This is worth memorizing -- it comes up a lot.

## HTML-Sensitive Characters

These need entity encoding to render safely in HTML:

| Character | Decimal | Hex | Named Entity |
|---|---|---|---|
| `<` | 60 | 3C | `&lt;` |
| `>` | 62 | 3E | `&gt;` |
| `&` | 38 | 26 | `&amp;` |
| `"` | 34 | 22 | `&quot;` |
| `'` | 39 | 27 | `&apos;` |

If you're building a template engine or any tool that outputs HTML, these five are the ones you absolutely must handle.

## Unicode Beyond ASCII

| Character | Unicode | UTF-8 Bytes | Notes |
|---|---|---|---|
| `€` | U+20AC | E2 82 AC | Euro sign -- 3 bytes in UTF-8 |
| `©` | U+00A9 | C2 A9 | Copyright symbol |
| `中` | U+4E2D | E4 B8 AD | CJK character -- also 3 bytes |
| `😀` | U+1F600 | F0 9F 98 80 | Emoji -- 4 bytes, surrogate pair in JS |

The emoji is a good reminder that "character" and "code unit" are different things. `'😀'.length` is 2 in JavaScript because it takes two UTF-16 code units.

## The Invisible Characters That Cause Bugs

| Character | Unicode | What it does |
|---|---|---|
| Zero Width Space | U+200B | Invisible, but it's a real character -- breaks string comparisons |
| BOM | U+FEFF | Byte Order Mark -- often at the start of UTF-8 files from Windows |
| Non-Breaking Space | U+00A0 | Looks like a space but `trim()` won't remove it |

If two strings look identical but don't compare equal, invisible characters like these are usually the culprit. Paste the text into the converter and look for code points you didn't expect.
