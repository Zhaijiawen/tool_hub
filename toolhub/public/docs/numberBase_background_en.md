# Number Base Converter - Technical Background

A number base (or radix) is how many unique digits a numbering system uses before it "rolls over" to the next position. Decimal uses 10 digits. Binary uses 2. Hex uses 16. But there's nothing special about those numbers -- any positive integer base works the same way mathematically.

## The common ones

| Base | Name | Digits | Where you see it |
|---|---|---|---|
| 2 | Binary | 0-1 | Hardware, bit operations, low-level protocols |
| 8 | Octal | 0-7 | Unix permissions, legacy systems |
| 10 | Decimal | 0-9 | Everything humans touch |
| 16 | Hexadecimal | 0-9, A-F | Memory, colors, byte dumps, crypto |

## How base conversion works

Two directions, two algorithms.

### Decimal to target base: repeated division

Divide by the target base, keep the remainder, repeat with the quotient until you hit zero. Read remainders bottom-to-top (last remainder is the most significant digit).

Converting 42 to binary:
```
42 / 2 = 21 rem 0
21 / 2 = 10 rem 1
10 / 2 =  5 rem 0
 5 / 2 =  2 rem 1
 2 / 2 =  1 rem 0
 1 / 2 =  0 rem 1
Reading backwards: 101010
```

### Any base to decimal: positional summation

Each digit x (base^position), summed:
```
Hex 2A -> 2 x 16^1 + 10 x 16^0 = 32 + 10 = 42
```

## Arbitrary bases

This tool supports bases 2 through 36. For bases up to 10, it uses digits 0-9. For bases 11 through 36, it adds letters A-Z where A=10, B=11, ..., Z=35. This is the standard convention used by JavaScript's `parseInt` and `toString`.

Bases beyond 36 are theoretically possible but need more symbols (lowercase letters, special characters). Base 62 (0-9 + A-Z + a-z) is common in URL shorteners like Bitly. Base 64 is used for data encoding (Base64). This tool stops at 36 because that's the standard alphanumeric range.

Base 36 is particularly interesting: it's the largest base you can express with just 0-9 and A-Z, giving you compact string representations of numbers. A 64-bit integer fits in about 13 base-36 characters. Some systems use it for short, human-readable IDs.
