# Number Converter — Technical Background

## Number Systems

A number system is a writing system for expressing numbers. The most commonly used systems in computing are:

### Decimal (Base 10)
The standard system used by humans. Uses digits 0–9.
- Example: `255`

### Binary (Base 2)
Used internally by computers. Uses only digits 0 and 1.
- Example: `11111111` (= 255 in decimal)
- Every binary digit is called a **bit**; 8 bits = 1 **byte**

### Octal (Base 8)
Uses digits 0–7. Sometimes used in Unix file permissions.
- Example: `377` (= 255 in decimal)

### Hexadecimal (Base 16)
Uses digits 0–9 and letters A–F. Widely used in computing (memory addresses, colors, character encodings).
- Example: `FF` (= 255 in decimal)

## How Conversion Works

To convert from any base to decimal, multiply each digit by its positional value (base^position) and sum:

```
Binary 1011 → 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11
Hex FF → 15×16¹ + 15×16⁰ = 240 + 15 = 255
```

## Signed vs. Unsigned Integers

- **Unsigned**: only non-negative values (0 to 2^n − 1)
- **Signed (Two's Complement)**: includes negative values (−2^(n-1) to 2^(n-1) − 1)

For an 8-bit signed integer: −128 to 127.

## Floating-Point Numbers

Computers represent real numbers using the **IEEE 754** standard:
- **32-bit float** (single precision): ~7 significant digits
- **64-bit double** (double precision): ~15 significant digits

Floating-point arithmetic can produce rounding errors, e.g., `0.1 + 0.2 ≠ 0.3` in most languages.

