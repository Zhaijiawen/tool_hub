# Image Processing — Technical Background

The image tools run entirely in your browser using the Canvas API. No uploads to a server, no waiting for a backend to process — everything happens client-side. This matters because images can be large and you probably don't want sensitive photos leaving your machine.

## What the browser can do

The Canvas API gives you pixel-level access to images, which means the tool can do a lot without any external libraries:

- **Format conversion**: Read an image in one format (JPEG, PNG, WebP, AVIF, BMP, GIF), write it out in another. The browser handles the encoding/decoding natively.
- **Resizing and cropping**: Canvas lets you draw source image data into a target rectangle of any size. Resampling quality depends on the browser's implementation — Chrome and Firefox both do bicubic interpolation by default.
- **Rotation and flipping**: Affine transforms on canvas handle rotation and mirroring. The math happens in the GPU.
- **Compression quality control**: JPEG and WebP output accept a quality parameter (0-1). Lower quality = smaller file, more artifacts. You can preview the trade-off in real time.

## Format trade-offs

The formats you'll actually choose between:

- **JPEG**: Lossy, no transparency, great for photos. Quality 80 is the sweet spot for web — visually indistinguishable from 100 at half the file size. Below 60, artifacts become visible.
- **PNG**: Lossless, supports full alpha transparency. Best for screenshots, logos, text-heavy graphics, and anything with sharp edges. File size is larger than JPEG for photos, but you don't lose any detail.
- **WebP**: Google's format. Supports both lossy and lossless, includes transparency, and produces files 25-35% smaller than equivalent JPEG/PNG. Browser support is now universal.
- **AVIF**: Even better compression than WebP (often 50% smaller for equivalent quality). Supports HDR and wide color gamut. The downside: encoding is slower, and the tool runs in the browser so you'll feel the difference on large images.

## How resize quality works

When you scale an image down, the browser has to decide which source pixels contribute to each output pixel. The default is bicubic interpolation — a weighted average of nearby pixels — which looks good for most cases.

When scaling up, there's no new information to work with, so the result will look soft. The browser can't invent detail that isn't in the source. If you need to enlarge an image significantly, you're better off using a purpose-built AI upscaler.

## Why processing happens client-side

The tool never sends your images anywhere. This isn't just a privacy feature — it's a performance one. A 20 MB photo would take seconds to upload and seconds more to download the result. Processing it in the browser takes milliseconds. The only bottleneck is your device's CPU/GPU.

The trade-off: the browser's image codecs are optimized for speed, not for squeezing every last byte out of a file. If you need maximum compression (like for a production image pipeline), a command-line tool like `imagemagick` or `sharp` running on a server will do better. But for quick one-off conversions, the browser is more than good enough.
