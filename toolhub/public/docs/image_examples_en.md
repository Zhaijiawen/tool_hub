# Image Processing — Examples

## Converting a PNG screenshot to JPEG for sharing

Screenshots with lots of text and solid colors are ideal for PNG. But if you need to share one in a chat app that compresses images anyway, converting to JPEG first gives you control.

**Input:** `screenshot.png` (2.4 MB, 1920x1080)
**Action:** Format conversion to JPEG, quality 85
**Output:** `screenshot.jpg` (~340 KB)

That's an 86% size reduction with barely any visible quality loss on a screenshot. The text stays sharp because screenshots don't have the photographic gradients that JPEG struggles with.

**Input:** `photo.png` (8.1 MB, 4000x3000)
**Action:** Format conversion to JPEG, quality 80
**Output:** `photo.jpg` (~1.1 MB)

Photos from a camera saved as PNG are huge — PNG's lossless compression doesn't work well on natural images. Converting to JPEG is basically mandatory before sharing or uploading.

## Resizing a photo for a website

A 4000x3000 photo is overkill for a website hero image. Most screens are 1920px wide at most.

**Input:** `photo.jpg` (4000x3000, 3.2 MB)
**Action:** Resize to 1920x1440 (maintained aspect ratio)
**Output:** `photo_resized.jpg` (~520 KB)

The resize reduced the pixel count by 77% and the file size followed proportionally. The browser's bicubic interpolation keeps the result looking sharp at the target size. If this is for a responsive website, you'd want to generate a few sizes (1920px for desktop, 800px for tablet, 400px for mobile) and let the browser pick with `srcset`.

## Cropping to a square profile picture

**Input:** `portrait.jpg` (3000x4000, portrait orientation)
**Action:** Crop to square, centered on the face, output 800x800
**Output:** `avatar.jpg` (800x800, ~120 KB)

The crop tool's square constraint (1:1) snaps the selection to a perfect square. Drag the selection to frame the face, check the pixel dimensions, and export. 800x800 is overkill for most profile picture use cases but gives you room to resize later.

## Converting a folder of images to WebP

If you're optimizing a website, batch-converting all images to WebP can cut your image bandwidth by 30-40%. The tool processes one image at a time in the browser, so you'd do them one by one.

**Example:**
- `hero.jpg` (1.2 MB) -> `hero.webp` (290 KB, quality 80) — 76% reduction
- `logo.png` (84 KB) -> `logo.webp` (22 KB, lossless) — 74% reduction
- `product1.jpg` (620 KB) -> `product1.webp` (180 KB, quality 85) — 71% reduction

For production batch processing, use a CLI tool like `cwebp` or a build pipeline. But for testing which quality setting gives the best trade-off for your specific images, the tool's real-time preview is faster than iterating with command-line flags.

## Compressing before email attachment

Email clients typically reject attachments over 25 MB. A photo straight from your phone can easily exceed that.

**Input:** `IMG_1234.jpg` (14 MB, 6000x4000)
**Action 1:** Resize to 2000px wide — output ~6 MB
**Action 2:** Compress to JPEG quality 70 — output ~800 KB

Two operations, 94% size reduction, and the image still looks good at screen size. The recipient can actually download it without their email client complaining.

## Rotating oddly-oriented photos

Phone cameras tag photos with orientation metadata (EXIF), but not all software respects it.

**Input:** `photo.jpg` (appears sideways in some viewers)
**Action:** Rotate 90 clockwise, then download
**Output:** `photo.jpg` (correct orientation, EXIF rotation tag reset)

The tool applies the rotation and re-encodes the image, which bakes the correct orientation into the pixel data. Even viewers that ignore EXIF rotation will show it correctly now.
