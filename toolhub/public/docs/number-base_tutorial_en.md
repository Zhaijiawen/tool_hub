# Number Base Converter - Tutorial

Unlike the standard number converter that only handles base 2/8/10/16, this tool lets you convert between any bases from 2 to 36. Need base 5 to base 13? Go for it.

## How to use it

1. Enter your number in the input field
2. Set the "from" base -- what base is your input number in?
3. Set the "to" base -- what base do you want the result in?
4. The result appears instantly. Copy and move on.

## Quick reference

| Input | From | To | Result | What it means |
|---|---|---|---|---|
| `255` | 10 | 16 | `FF` | Standard dec-to-hex |
| `FF` | 16 | 2 | `11111111` | Hex to binary |
| `42` | 10 | 8 | `52` | Decimal to octal |
| `z` | 36 | 10 | `35` | Base-36 char to its numeric value |
| `10` | 36 | 10 | `36` | Base-36 "10" = 1 x 36 + 0 = 36 |

## Understanding digit values above base 10

For bases above 10, the tool uses A-Z:
- A = 10, B = 11, ..., Z = 35
- Case-insensitive: `a` and `A` both mean 10

So in base 16, `FF` = F x 16 + F = 15 x 16 + 15 = 255.
In base 20, `1G` = 1 x 20 + 16 = 36.
In base 36, `ZZ` = 35 x 36 + 35 = 1295.

## When you'd use arbitrary bases

**Base 3 (ternary):** Some puzzles and algorithms use ternary logic. Balanced ternary (digits -1, 0, 1) was used in some early Soviet computers.

**Base 5:** Not common in computing, but useful for understanding place-value systems in general. Sometimes used in hand-counting systems.

**Base 7 or base 9:** Rare. Mostly for educational purposes or specific algorithms.

**Base 20 (vigesimal):** Appears in some historical counting systems (Mayan numerals). Also the base of the French number system above 60 (quatre-vingts = 4 x 20).

**Base 36:** Great for encoding numbers into short alphanumeric strings. YouTube video IDs look a lot like base-64 but are actually using a wider character set.

## Practical base 36 use case

Need a compact, URL-safe ID from a number? Base 36 encoding:

```javascript
const n = 123456789
const id = n.toString(36) // "21i3v9"
const back = parseInt('21i3v9', 36) // 123456789
```

Way shorter than decimal, and more readable than hex for large numbers. Just don't confuse it with case-sensitive encodings -- base 36 is case-insensitive in standard implementations.
