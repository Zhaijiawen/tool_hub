# PNG Optimizer — Technical Background

This tool losslessly compresses PNG images using **Oxipng** (via jsSquash's WASM wrapper). Files are not uploaded; it runs in your browser.

## Why PNGs can shrink

PNG is itself lossless, but many PNGs carry redundancy from generation: unneeded metadata chunks, suboptimal compression parameters, unused palette entries. Oxipng re-encodes the pixel data and cleans the redundancy, making the file smaller without losing a single pixel.

## Three parameters

- **Level (1-6)**: compression strength. 1 is fastest and compresses least; 6 is slowest and compresses most. Default 3 is the sweet spot.
- **Interlace**: when on, the image can display progressively top-to-bottom as it downloads (progressive PNG), but it slightly increases size. Usually off.
- **Optimise Alpha**: finer optimization of the transparency channel. On by default.

## When there's no gain

If a PNG was already well compressed (e.g. via Oxipng/squoosh), re-compressing barely shrinks it; the tool honestly shows "no gain". An already-compressed JPEG can't be optimized as a PNG — this tool only accepts PNG.

## Privacy

Images are processed locally only.
