# Number Converter -- Technical Background

Different number bases are just different ways of writing the same value. Computers think in binary, humans prefer decimal, and programmers spend a surprising amount of time in hexadecimal. This tool translates between them instantly.

## The four bases you'll encounter

### Decimal (base 10)
Digits 0-9. What you learned in school. The default unless specified otherwise. `255`, `4096`, `-42`.

### Binary (base 2)
Digits 0 and 1 only. This is how computers actually store everything -- transistors are either on or off. `11111111` is 255. Each digit is a **bit**; eight bits make a **byte**. Binary gets unwieldy fast -- a 32-bit integer is 32 digits of 1s and 0s.

### Octal (base 8)
Digits 0-7. Less common these days, but still shows up in Unix file permissions (`chmod 755`), where each digit represents three bits of read/write/execute flags. Also used in some legacy systems and aviation transponder codes.

### Hexadecimal (base 16)
Digits 0-9 plus A-F (or a-f). The workhorse of programming. Two hex digits represent one byte, so `FF` = 255, `00` = 0, `7F` = 127. Hex shows up everywhere: color codes (`#FF6600`), memory addresses (`0x7FFE5B4C2A30`), binary dumps, MAC addresses, Unicode code points, and hash digests.

## How conversion actually works

The core idea is positional notation. Each digit's value is the digit multiplied by the base raised to the position power (counting from right, starting at 0):

```
Binary 1011 -> 1 x 2^3 + 0 x 2^2 + 1 x 2^1 + 1 x 2^0 = 8 + 0 + 2 + 1 = 11
Hex FF     -> 15 x 16^1 + 15 x 16^0 = 240 + 15 = 255
Octal 377  -> 3 x 8^2 + 7 x 8^1 + 7 x 8^0 = 192 + 56 + 7 = 255
```

Going the other direction (decimal to other bases) uses repeated division: divide by the target base, record the remainder, repeat with the quotient until it's zero, then read the remainders backwards.

## Signed integers and two's complement

Computers represent negative numbers using two's complement. For an n-bit signed integer:

- Range: -2^(n-1) to 2^(n-1) - 1
- An 8-bit signed integer goes from -128 to 127
- A 32-bit signed integer goes from about -2.1 billion to +2.1 billion

To negate a number: flip all bits, then add 1. So `00000001` (1) becomes `11111110 + 1 = 11111111` (-1). This is why `11111111` can mean either 255 (unsigned) or -1 (signed) for an 8-bit value -- the bits are the same, the interpretation differs.

## Floating point and why 0.1 + 0.2 != 0.3

IEEE 754 floating point represents real numbers with a sign bit, exponent, and mantissa (fractional part). It's like scientific notation in binary. The catch: many simple decimal fractions (like 0.1) are repeating fractions in binary, so they can't be stored exactly. The result is small rounding errors that accumulate. In JavaScript:

```javascript
0.1 + 0.2 // 0.30000000000000004
```

This isn't a bug -- it's inherent to binary floating-point representation. For precise decimal arithmetic, use integer cents or a decimal library.
