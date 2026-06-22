# Number Converter - Tutorial

Type a number in any base, see it in all four instantly. That's it. But there are some tricks worth knowing.

## How it works

1. Pick the base of the number you're entering -- decimal, binary, octal, or hex
2. Type the number in the input box. The tool validates as you type -- try typing `G` while in hex mode and it'll let you; try it in decimal mode and it won't
3. All four conversions appear immediately below. No submit button, no waiting

## Base selection matters

The tool only accepts digits valid for the selected base. In binary mode, `2` is rejected. In octal, `8` and `9` are rejected. In hex, `A-F` are fine but `G` is out. The real-time validation catches mistakes before you waste time on a bad conversion.

## Negative numbers

Enter a negative number in decimal and the tool shows the two's complement representation in binary. For example, `-1` in decimal becomes `11111111` in 8-bit binary. The tool handles this correctly across bases.

## Hex is case-insensitive

`FF`, `ff`, and `Ff` all mean 255. The output format is consistent (usually uppercase), but you can type either case.

## When you'd actually use this

**Reading color values:** `#FF6600` in CSS means red=FF (255), green=66 (102), blue=00 (0). This tool tells you what those hex values mean in decimal at a glance.

**Debugging Unix permissions:** `chmod 755` -- what does that even mean? 7 in octal is `111` in binary (rwx), 5 is `101` (r-x), 5 is `101` (r-x). So 755 = `rwxr-xr-x`. The tool helps you decode octal permissions into something meaningful.

**Working with binary data:** You're looking at a hex dump and see `0x1A3F`. Pop it into the tool and you instantly see it's 6719 in decimal and `1101000111111` in binary. Much faster than mental math.

**Understanding bit masks:** `0xFF` is a common bitmask -- it means "the lowest 8 bits." Seeing it as `11111111` in binary and `255` in decimal helps solidify what's actually happening.

**Reading memory addresses:** `0x7FFE5B4C2A30` is a 48-bit virtual address on x64. The tool won't process 48-bit values fully (browser number limits), but for addresses under 2^53 you'll get accurate conversions.

## JavaScript limits to know

JavaScript numbers are 64-bit floats, so integers up to 2^53 (~9 quadrillion) are exact. Beyond that, precision breaks down. If you're converting very large hex values (more than 16 hex digits), the decimal output might be approximate.
