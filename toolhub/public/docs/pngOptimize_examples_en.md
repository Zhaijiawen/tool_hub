# PNG Optimizer — Examples

## Optimize a web screenshot

**Input:** `screenshot.png` (1.4 MB)
**Action:** level 3, optimise alpha on
**Output:** `screenshot.optimized.png` (~980 KB, 30% saved)

Screenshots often carry redundant metadata; lossless optimization reliably shaves some off.

## Optimize a transparent logo

**Input:** `logo.png` (420 KB, transparent bg)
**Action:** level 4, optimise alpha on
**Output:** `logo.optimized.png` (~180 KB, 57% saved)

The alpha channel is where redundancy hides; optimise alpha pays off clearly.

## Re-compress an already-optimized image (no gain)

**Input:** `already.opt.png` (optimized with Oxipng before)
**Action:** level 6
**Result:** shows "no gain"

Don't wait for nothing — it genuinely can't shrink further, and the tool tells you so.

## Optimize a camera UI capture

**Input:** `ui.png` (2.2 MB)
**Action:** level 3
**Output:** ~1.5 MB, 32% saved

Large UI images have more redundancy; optimization shows better than on small images.
