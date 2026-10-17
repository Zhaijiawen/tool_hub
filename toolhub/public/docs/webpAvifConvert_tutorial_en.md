# WebP / AVIF Converter — Usage Tutorial

1. Upload an image (any common format). The tool shows a preview, original size, and dimensions.
2. Pick the target: **WebP** or **AVIF**.
3. Adjust parameters:
   - WebP: quality slider, or toggle **lossless**.
   - AVIF: quality slider, speed slider, or toggle **lossless**.
4. Click **Convert**. First use of a format downloads its WASM encoder (with progress, cancellable).
5. When done it shows original size, result size, size-change percentage, and elapsed time; preview the result and download.

> Size change: positive means saved, negative means it grew (e.g. converting an already-tiny image to slower AVIF lossless may grow instead).

## Tips

- For web images prefer **WebP** — good compatibility, small size.
- For maximum ratio and a new enough target browser, use **AVIF** (quality around 50 is usually enough).
- Raising AVIF speed (e.g. 8-10) speeds it up noticeably with only a slight size increase.
