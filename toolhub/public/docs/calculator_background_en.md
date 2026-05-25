# Calculator — Technical Background

## Floating-Point Arithmetic

Computers represent numbers in binary using the **IEEE 754** floating-point standard. While this allows a wide range of values, it introduces subtle precision issues:

```javascript
0.1 + 0.2 === 0.3   // false
0.1 + 0.2           // 0.30000000000000004
```

This is because `0.1` and `0.2` cannot be represented exactly in binary floating-point. For critical financial or scientific calculations, use arbitrary-precision libraries.

## Order of Operations (PEMDAS/BODMAS)

Standard arithmetic follows this precedence:
1. **P**arentheses / **B**rackets
2. **E**xponents / **O**rders (powers and roots)
3. **M**ultiplication and **D**ivision (left to right)
4. **A**ddition and **S**ubtraction (left to right)

Example: `2 + 3 × 4 = 14` (not 20)

## Integer vs. Floating-Point Division

In many programming languages, dividing two integers performs **integer division** (truncates toward zero):
```python
7 // 2 = 3   # Python integer division
7 / 2 = 3.5  # Python floating-point division
```

In JavaScript, `/` always returns a float: `7 / 2 = 3.5`.

## Scientific Notation

Very large or very small numbers use scientific notation:
- `1.5e6 = 1,500,000`
- `2.5e-3 = 0.0025`

## Common Mathematical Constants

| Constant | Approximate Value |
|---|---|
| π (pi) | 3.14159265358979 |
| e (Euler's number) | 2.71828182845905 |
| √2 | 1.41421356237310 |
| φ (golden ratio) | 1.61803398874989 |

