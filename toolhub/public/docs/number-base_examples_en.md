# Number Base Converter - Examples

## Standard conversions

### Decimal to hex
`255` (base 10) to base 16 = `FF`
`4096` (base 10) to base 16 = `1000` -- clean power-of-16 boundary

### Hex to binary
`A5` (base 16) to base 2 = `10100101`
Each hex digit maps to exactly 4 binary digits: A=1010, 5=0101. Stitch them together: `1010 0101`.

### Octal to decimal
`755` (base 8) to base 10 = `493`
This is the numeric value behind `chmod 755`. 7 x 64 + 5 x 8 + 5 = 493.

---

## Unusual bases

### Base 3 (ternary)
`210` (base 3) to base 10 = `21`
2 x 9 + 1 x 3 + 0 = 21

### Base 5
`123` (base 5) to base 10 = `38`
1 x 25 + 2 x 5 + 3 = 38

### Base 7
`100` (base 7) to base 10 = `49`
7^2 = 49

### Base 20 (vigesimal)
`10` (base 20) to base 10 = `20`
`1A` (base 20) to base 10 = `30` (1 x 20 + 10)

### Base 36 (alphanumeric)
`z` (base 36) to base 10 = `35` -- the largest single digit
`10` (base 36) to base 10 = `36` -- rollover point
`1z` (base 36) to base 10 = `71` (1 x 36 + 35)
`100` (base 36) to base 10 = `1296` (36^2)

---

## Real-world uses

### URL shortener IDs
Services like Bitly encode sequential IDs in base 62 (0-9, a-z, A-Z). A 7-character base-62 string can represent numbers up to 62^7 -- about 3.5 trillion unique IDs.

### Database shard keys
Need to distribute IDs across shards? Encode a user ID in base N (where N is the number of shards) and use the last digit as the shard key.

### Compact error codes
`E2A` (base 36) is a lot more scannable than `Error 2554` and encodes the same information. `E` prefix for "error," `2A` = 94 in decimal -- could mean error category 2, sub-error 94.

### Encoding bits
Base 2 output shows you the exact bit pattern:
- `15` (base 10) to base 2 = `1111` -- all 4 bits set
- `240` (base 10) to base 2 = `11110000` -- high 4 bits set, low 4 clear
- `85` (base 10) to base 2 = `1010101` -- alternating pattern
