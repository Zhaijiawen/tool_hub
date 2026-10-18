# Character Code Converter -- How to Use

Type a character, see its encoding in every format. Or work backward: enter a code point and it tells you what character that is.

## Forward Lookup: Character to Codes

Type or paste a character (or a whole string) into the input field. The tool instantly shows you:

- **Decimal** -- the Unicode code point as a plain number
- **Hexadecimal** -- hex representation, what you'd use in most programming contexts
- **Binary** -- the raw bits
- **HTML Entity** -- both decimal (`&#65;`) and hex (`&#x41;`) forms
- **URL Encoded** -- percent-encoded form
- **Octal** -- occasionally useful in legacy contexts

For multi-character strings it shows each character's codes separately, which makes it great for inspecting text with encoding problems.

## Reverse Lookup: Code to Character

Enter a code point in any of these formats and the tool finds the matching character:

| Format | Example | Result |
|---|---|---|
| Decimal | `65` | `A` |
| Hex | `0x41` or `41` | `A` |
| Unicode notation | `U+0041` | `A` |
| HTML entity | `&#65;` or `&#x41;` | `A` |

## When You'll Actually Use This

- **Debugging invisible characters**: Zero-width spaces (U+200B), BOM (U+FEFF), non-breaking spaces (U+00A0) -- these cause baffling bugs. Paste text in and the tool reveals them.
- **Encoding troubleshooting**: Got garbled text? Paste it character by character to see what code points are actually there versus what you expected.
- **Regex with Unicode**: Writing a regex that matches emoji or CJK characters? Look up the code point ranges you need.
- **URL encoding**: Need to know the percent-encoded form of a specific character for query strings or path segments.
- **HTML safety**: Check what characters need entity encoding and what their entity forms are.
