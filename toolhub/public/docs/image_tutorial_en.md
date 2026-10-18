# Image Tools — Usage Tutorial

Image operations are split into separate tools, each focused on one job. Everything runs in the browser; images never leave your device.

## Format conversion

Upload images (multi-select, up to 10) and pick a target format — JPEG, PNG, or GIF. Lossy formats (JPEG) show a quality slider; PNG and GIF are lossless with no quality option. To change dimensions, expand "Resize": enter width/height in pixels or percent, aspect ratio locked by default. When done, click "Download All".

WebP and AVIF are not here — those modern formats are handled by the "WebP / AVIF conversion" tool with WASM encoders, producing smaller files at similar quality.

Quick format advice:
- PNG to JPEG: transparent areas become white. If the PNG has an alpha channel, either choose WebP or accept the white background.
- JPEG to PNG: the file grows because PNG is lossless. Quality doesn't improve — JPEG's artifacts are already baked in.

## WebP / AVIF conversion

Upload an image, pick WebP or AVIF, adjust the quality slider, and watch the compression preview in real time. Generated locally by WASM encoders — typically 25-50% smaller than the original JPEG/PNG at comparable quality. Ideal for slimming down website assets.

## PNG optimization

PNG only, and **lossless** — pixels unchanged, file smaller. Seven compression levels; higher levels squeeze harder and take longer. The tool shows before/after size comparison. Already-optimized PNGs will show minimal gains; that's normal.

## Crop

Upload an image, drag a selection rectangle on the preview, and watch pixel coordinates update live. For precise dimensions, type width/height directly or lock a preset aspect ratio. Download when done.

## Rotate

Upload an image, drag the angle slider (0-360°, 90° steps). Original and rotated previews sit side by side; download when satisfied. Custom angles require interpolation, so non-right angles show slight quality changes; 90° steps are lossless.

## Watermark

Upload an image, type the watermark text, and adjust color, font size, opacity, and rotation angle. Good for marking samples or adding a simple copyright notice. The watermark is drawn into the pixels — not an overlay — so it's baked in on download.

## EXIF

View a photo's full EXIF data (camera, lens, exposure parameters, GPS, etc.), or strip it in one click. Running a strip before sharing is a good habit — GPS coordinates and device model are things you probably don't want to broadcast.
