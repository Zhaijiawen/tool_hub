# Number Converter - Examples

## Standard conversion tables

### Decimal 255 -- a classic

One byte, all bits set. Shows up everywhere: color channels, IP octets, binary masks.

| Base | Value |
|---|---|
| Decimal | `255` |
| Binary | `11111111` |
| Octal | `377` |
| Hexadecimal | `FF` |

### Hex 1A3F

| Base | Value |
|---|---|
| Hexadecimal | `1A3F` |
| Decimal | `6719` |
| Binary | `1101000111111` |
| Octal | `15077` |

### Binary 10101010 -- alternating pattern

| Base | Value |
|---|---|
| Binary | `10101010` |
| Decimal | `170` |
| Octal | `252` |
| Hexadecimal | `AA` |

The `AA` output is nice -- alternating bits in binary become repeating A's in hex. Two hex digits per byte is why hex is so readable for binary data.

---

## Practical contexts

### Color codes

`#FF6600` breaks down to:
- Red: `FF` = 255 (full intensity)
- Green: `66` = 102 (about 40% intensity)  
- Blue: `00` = 0 (off)

The common shorthand `#F60` is the same: `F` = `FF`, `6` = `66`, `0` = `00`. Understanding hex-decimal conversion makes CSS colors far less mysterious.

### Unix permissions

`chmod 755` on a file means:

| Octal digit | Binary | Permissions |
|---|---|---|
| 7 | `111` | rwx (read, write, execute) |
| 5 | `101` | r-x (read, no write, execute) |
| 5 | `101` | r-x (read, no write, execute) |

So 755 = owner can do everything, group and others can read and execute but not write. `chmod 644` (rw-r--r--) is the other common one -- 6 is `110` in binary (rw-), 4 is `100` (r--).

### Memory addresses

`0x7FFE5B4C2A30` is a typical stack address on a 64-bit system. The `0x` prefix is the standard C/JavaScript/Go notation for hex literals. `0b` is for binary, `0o` for octal (in modern JS). `0` alone as a prefix (like `0777`) is octal in C but not in JS strict mode -- avoid it.

### Bit masks

- `0xFF` = keep lowest 8 bits
- `0xFFFF` = keep lowest 16 bits
- `0xFFFFFFFF` = keep lowest 32 bits

In decimal: `0xFF` = 255, `0xFFFF` = 65535, `0xFFFFFFFF` = 4294967295. These numbers come up constantly in systems programming when you need to mask, shift, or extract bits.

### Floating point gotcha

```javascript
0.1 + 0.2 === 0.3 // false -- it's 0.30000000000000004
```

This isn't JavaScript being weird. It's IEEE 754 double precision. 0.1 in binary is a repeating fraction (like 1/3 in decimal), so it can't be stored exactly. The standard fix: compare with a tolerance:

```javascript
Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON // true
```
