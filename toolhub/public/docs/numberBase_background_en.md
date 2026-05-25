# Number Base Converter — Technical Background

## What Is a Number Base?

A number base (or radix) determines how many unique digits are used to represent numbers. The position of each digit carries a weight equal to the base raised to the power of that position.

## Common Bases

| Base | Name | Digits Used | Common Use |
|---|---|---|---|
| 2 | Binary | 0, 1 | Computer hardware, logic circuits |
| 8 | Octal | 0–7 | Legacy Unix systems, file permissions |
| 10 | Decimal | 0–9 | Human arithmetic |
| 16 | Hexadecimal | 0–9, A–F | Memory addresses, color codes, byte representation |

## Base Conversion Algorithm

### From Decimal to Target Base
Repeatedly divide by the target base and collect remainders in reverse order.

**Example: Convert 42 to Binary (Base 2)**
```
42 ÷ 2 = 21 remainder 0
21 ÷ 2 = 10 remainder 1
10 ÷ 2 =  5 remainder 0
 5 ÷ 2 =  2 remainder 1
 2 ÷ 2 =  1 remainder 0
 1 ÷ 2 =  0 remainder 1
Reading remainders bottom-to-top: 101010
```

### From Any Base to Decimal
Multiply each digit by its positional weight and sum.

**Example: Convert Hex 2A to Decimal**
```
2 × 16¹ + 10 × 16⁰ = 32 + 10 = 42
```

## Arbitrary Base Conversion

Any positive integer base is valid. Bases above 36 require additional symbols beyond 0–9 and A–Z.

Base 36 (alphanumeric): uses 0–9 then A–Z
Base 62: uses 0–9, A–Z, a–z (common in URL shorteners)

