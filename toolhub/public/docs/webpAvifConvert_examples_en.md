# WebP / AVIF Converter — Examples

## Convert a product image to WebP for listing

**Input:** `product.jpg` (620 KB, JPEG)
**Action:** WebP, quality 80
**Output:** `product.webp` (~180 KB, 71% saved)

Converting web product images to WebP is among the highest-value operations.

## Crush a hero image to AVIF

**Input:** `hero.png` (1.2 MB)
**Action:** AVIF, quality 50, speed 6
**Output:** `hero.avif` (~90 KB, 92% saved)

Modern-browser hero images on AVIF push bandwidth to the minimum.

## WebP lossless keeps transparency

**Input:** `icon.png` (84 KB, transparent)
**Action:** WebP, lossless
**Output:** `icon.webp` (~22 KB, 74% saved, transparency kept)

Transparent assets need lossless — don't dirty the edges with lossy.

## Large image to AVIF is slow

**Input:** `pano.png` (8000x4000, 18 MB)
**Action:** AVIF, quality 50
**Note:** encoding takes longer and uses more memory; the tool warns. Wait it out — the result is the smallest at equal quality.
