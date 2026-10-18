# Image Tools — The Technical Background

All image tools run entirely in your browser. Most operations use the Canvas API; WebP/AVIF encoding and lossless PNG compression use codecs compiled to WebAssembly. Nothing is uploaded to a server, nothing waits on a backend — everything happens client-side. That matters because images can be large, and you probably don't want sensitive photos leaving your device.

## Tool matrix

| Tool | Technology | What it does |
|---|---|---|
| Format conversion | Canvas API | JPEG / PNG / GIF interop, batches up to 10, quality slider and resize |
| WebP / AVIF conversion | Squoosh WASM encoders | Produces WebP / AVIF — 25-50% smaller than JPEG/PNG at similar quality |
| PNG optimization | oxipng (Rust/WASM) | Lossless PNG compression, 7 levels, smaller files, identical pixels |
| Crop | Canvas API | Aspect-ratio-constrained cropping |
| Rotate | Canvas API | 90° step rotation (0-360°) |
| Watermark | Canvas API | Text watermarks: color, size, opacity, angle |
| EXIF | piexifjs | View and strip EXIF metadata |

These are separate tools rather than one giant page because each operation takes completely different inputs — format conversion batches with a quality slider, cropping needs an interactive selection, watermarking needs typography controls. Forcing them into one page yields an interface nobody enjoys.

## Format tradeoffs

The formats you'll actually choose between:

- **JPEG**: lossy, no transparency, for photos. Quality 80 is the sweet spot for web use — visually indistinguishable from 100 at half the file size. Below 60, artifacts appear.
- **PNG**: lossless, full alpha transparency. Best for screenshots, logos, text-heavy graphics, anything with sharp edges. Larger than JPEG for photos, but loses nothing.
- **WebP**: Google's format. Lossy and lossless, with alpha, producing files 25-35% smaller than equivalent JPEG/PNG. Universal browser support today.
- **AVIF**: better compression than WebP (typically another 50% at equal quality). Supports HDR and wide gamut. Downside: slower encoding — noticeable on large images.

Canvas cannot encode the high-compression WebP/AVIF variants, so those two formats live in a dedicated WASM-encoder tool.

## How resampling works

When shrinking an image, the browser decides which source pixels contribute to each output pixel. The default is bicubic interpolation — a weighted average of neighboring pixels — which looks good in most cases.

Enlarging has no new information to work with, so results look soft. The browser can't invent detail that isn't in the source. For significant upscaling, use a dedicated AI super-resolution tool.

## Why client-side

Tools never send your images anywhere. That's not just a privacy feature — it's a performance feature. Uploading a 20 MB photo takes seconds; downloading the result takes more. Browser processing takes milliseconds. The only bottleneck is your device's CPU/GPU.

The tradeoff: browser image codecs are optimized for speed, not for squeezing every byte. For extreme compression (production image pipelines), command-line tools like `imagemagick` or `sharp` on a server do better. For everyday one-off conversions, the browser is plenty.
