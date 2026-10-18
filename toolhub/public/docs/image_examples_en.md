# Image Tools — Examples

## Converting a PNG screenshot to JPEG for sharing

Screenshots with lots of text and solid colors are ideal for PNG. But if you need to share one in a chat app that compresses images anyway, converting to JPEG first gives you control.

**Input:** `screenshot.png` (2.4 MB, 1920x1080)
**Action:** Format conversion to JPEG, quality 85
**Output:** `screenshot.jpg` (~340 KB)

86% smaller with almost no visible change. Text stays sharp because screenshots lack the photographic gradients JPEG struggles with.

Camera photos stored as PNG are enormous — PNG's lossless compression does poorly on natural images. Converting to JPEG before sharing or uploading is essentially mandatory.

## Slimming website images with WebP

If you're optimizing a website, converting images to WebP cuts image bandwidth by 25-40%.

**Input:** `hero.jpg` (1.2 MB)
**Action:** WebP / AVIF conversion, choose WebP, quality 80
**Output:** `hero.webp` (~290 KB) — 76% smaller

For production batch processing, use CLI tools like `cwebp` or a build pipeline. But to find which quality parameter gives the best value for your specific image, the tool's live preview beats trial-and-error with command-line flags.

## PNG already compressed but you want it smaller

Design tool exports often carry unnecessary metadata and suboptimal deflate settings.

**Input:** `design-export.png` (480 KB)
**Action:** PNG optimization, compression level 4
**Output:** `design-export-optimized.png` (~390 KB) — 19% smaller, pixel-identical

If it reports "could not compress further", the PNG is already optimal — switching formats (WebP) is the next step.

## Cropping a square avatar

**Input:** `portrait.jpg` (3000x4000, portrait)
**Action:** Crop tool, lock 1:1, frame the face, confirm pixel dimensions, export
**Output:** `avatar.jpg` (800x800, ~120 KB)

The live coordinate readout while dragging gives you precise compositional control — no guessing.

## Rotating a photo with weird orientation

Phone cameras tag photos with orientation metadata (EXIF), but not all software respects it.

**Input:** `photo.jpg` (displays sideways in some viewers)
**Action:** Rotate tool, set angle to 90°, download
**Output:** `photo.jpg` (correct orientation)

The tool re-encodes the image, baking the correct orientation into the pixel data. Now even viewers that ignore EXIF rotation display it correctly.

## Watermarking samples

**Input:** `sample-design.jpg`
**Action:** Watermark tool, text "SAMPLE", opacity 40%, medium size, slight rotation
**Output:** watermarked image

Don't go below 30% opacity — below that it blurs into mush on many backgrounds. A 15-30° rotation is harder to clone out than horizontal text, but don't overdo it.

## Stripping EXIF before sharing

**Input:** `IMG_1234.jpg` (with GPS and device info)
**Action:** EXIF tool, review the location data, click strip
**Output:** clean JPEG

The original is untouched; the tool outputs a processed copy. Only metadata is removed — image data passes through unchanged.
