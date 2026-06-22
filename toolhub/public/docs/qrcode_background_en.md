# QR Code — How It Works

QR codes are two-dimensional barcodes invented by Denso Wave in 1994. They encode data in a grid of black and white squares (modules) that phone cameras read almost instantly. High capacity, fast scanning, and built-in error correction made them the default for everything from payment codes to WiFi sharing.

## The structure of a QR code

Every QR code has a few fixed elements you'll recognize:

- **Finder patterns** — the three big squares in the corners (top-left, top-right, bottom-left). They tell the scanner which way is up and where the code's edges are
- **Alignment patterns** — smaller squares scattered through the code on version 2 and above, helping scanners handle distortion
- **Timing patterns** — alternating black and white modules running horizontally and vertically, used to calibrate the module size
- **Data and error correction** — the actual encoded information plus Reed-Solomon error correction blocks

## Versions and sizes

There are 40 versions, from 21x21 modules (version 1) up to 177x177 (version 40). Each version bump adds 4 modules per side. The tool auto-selects the right version based on how much data you're encoding.

Version 40 at the lowest error correction level holds about 2,953 bytes. At the highest error correction level, that drops to 1,273 bytes — the tradeoff between capacity and durability.

## Encoding modes

The QR code spec supports several encoding modes, each optimized for different data types:

- **Numeric** — digits only, 3.33 bits per digit, most efficient
- **Alphanumeric** — digits, uppercase A-Z, and 9 special characters, 5.5 bits per character
- **Byte** — arbitrary 8-bit data including UTF-8, most flexible
- **Kanji** — optimized for Shift JIS Japanese characters

The encoder picks the most efficient mode for your data automatically. A URL will use alphanumeric mode; a paragraph with lowercase letters falls back to byte mode.

## Error correction levels

Reed-Solomon error correction lets a damaged QR code still scan correctly. Four levels:

| Level | Recovery | When to use |
|-------|----------|------------|
| L | ~7% | Clean environments, large prints, maximize data |
| M | ~15% | General purpose — the default for most applications |
| Q | ~25% | Smaller prints, outdoor use, moderate wear expected |
| H | ~30% | Maximum durability — logos overlaid, partial damage expected |

Higher levels add more error correction bytes, reducing usable data capacity. If you're adding a logo over your QR code, use H.

## Mask patterns

The raw encoded data might produce visually problematic patterns — large blocks of all white or all black. Masking XORs the data with one of 8 predefined patterns to even out the distribution and avoid these scanning problems. The tool tests all 8 masks and picks the one with the lowest penalty score.

## Practical limits

- **Quiet zone** — at least 4 modules of white space around all four sides. Don't crop your QR code
- **Minimum size for print** — about 2-3 cm for reliable scanning at arm's length
- **Contrast** — dark modules on a light background. Reverse (light on dark) works on some scanners but isn't reliable
