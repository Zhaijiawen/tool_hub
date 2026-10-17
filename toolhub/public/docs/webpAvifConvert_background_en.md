# WebP / AVIF Converter — Technical Background

This tool converts images to **WebP** or **AVIF** in the browser using jsSquash's WASM encoders — fully local, no upload.

## Why these two formats

- **WebP**: 25-35% smaller than equivalent JPEG/PNG, supports lossy/lossless and transparency, and browser support is comprehensive. A good everyday replacement for JPEG/PNG.
- **AVIF**: based on AV1 video coding, even better compression than WebP (often another 50% smaller at equal quality), but slower to encode and heavier on memory for large files. Supported by all modern browsers.

## Parameters

- **WebP**: quality 0-100 (default 75), with a **lossless** mode.
- **AVIF**: quality 0-100 (default 50), **speed** 0-10 (default 6, higher = faster but slightly larger), with a **lossless** mode.

## Encoder size

- The WebP encoder uses the SIMD build (~338KB) or the plain build (~275KB); the tool auto-picks by your device's capability.
- The AVIF encoder is ~3.3MB; first download shows the global progress bar, then cached.

## Decoding

Input images are decoded by the browser natively (Canvas / `createImageBitmap`), so JPG/PNG/WebP/GIF/BMP all read, and modern browsers read AVIF input too. Very large images encode slowly and use more memory; the tool warns you.

## Privacy

Images are processed locally only.
